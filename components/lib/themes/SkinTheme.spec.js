import postcss from 'postcss';
import { skinCases } from '../../../scripts/fixtures/skin-cases';
import { auraAdvancedComponents } from './AuraAdvanced';
import { auraChartComponents } from './AuraChart';
import { auraContainerComponents } from './AuraContainers';
import { auraDataComponents } from './AuraData';
import { auraFeedbackComponents } from './AuraFeedback';
import { auraFormComponents } from './AuraForms';
import { auraMediaComponents } from './AuraMedia';
import { auraNavigationComponents } from './AuraNavigation';
import { auraOverlayComponents } from './AuraOverlays';
import { auraSelectionComponents } from './AuraSelections';
import { auraSpecialFormComponents } from './AuraSpecialForms';
import { Aura, createPresetCss, definePreset, resolvePreset } from './themes';

const kebab = (path) =>
    path
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replaceAll('.', '-')
        .toLowerCase();
const leaves = (object, path = []) =>
    Object.entries(object).flatMap(([key, value]) => {
        const next = [...path, key];

        return value && typeof value === 'object' ? leaves(value, next) : [next.join('.')];
    });
const completedTokens = {
    ...auraFormComponents,
    ...auraOverlayComponents,
    ...auraSelectionComponents,
    ...auraSpecialFormComponents,
    ...auraContainerComponents,
    ...auraDataComponents,
    ...auraFeedbackComponents,
    ...auraMediaComponents,
    ...auraNavigationComponents,
    ...auraAdvancedComponents,
    ...auraChartComponents
};
const canonical = (path) => path.replace(/\.colorScheme\.(?:light|dark)/g, '');

const flatValues = (object, path = [], output = {}) => {
    Object.entries(object).forEach(([key, value]) => {
        const next = [...path, key];

        if (value && typeof value === 'object') {
            flatValues(value, next, output);
        } else {
            output[next.join('.')] = value;
        }
    });

    return output;
};

describe('Aura component skins', () => {
    it('uses existing token paths in the real component browser fixture', () => {
        const tokens = resolvePreset(Aura);

        expect(skinCases.map((testCase) => testCase.path).filter((path) => !Object.prototype.hasOwnProperty.call(tokens, path))).toEqual([]);
    });
    it.each(['light', 'dark'])('resolves every declared token without missing or cyclic references in %s mode', (scheme) => {
        const tokens = resolvePreset(Aura, scheme);
        const unresolved = Object.entries(tokens).filter(([, value]) => typeof value === 'string' && /\{[^}]+\}/.test(value));

        expect(unresolved).toEqual([]);
    });

    it('provides variables for every consuming declaration with a custom prefix', () => {
        const tokens = new Set(Object.keys(resolvePreset(Aura)).map((path) => `--probe-${kebab(path)}`));
        const css = Aura.css({ prefix: 'probe' });
        const consumed = [...css.matchAll(/var\((--probe-[\w-]+)/g)].map((match) => match[1]);

        expect([...new Set(consumed)].filter((token) => !tokens.has(token))).toEqual([]);
    });

    it('consumes every new component token instead of adding unused declarations', () => {
        const css = Aura.css({ prefix: 'probe' });
        const values = flatValues(Aura.components);

        const consumed = (path, seen = []) => {
            if (seen.includes(path)) {
                return false;
            }

            return css.includes(`var(--probe-${kebab(path)})`) || Object.entries(values).some(([alias, value]) => typeof value === 'string' && value.includes(`{${path}}`) && consumed(alias, [...seen, path]));
        };

        expect(leaves(completedTokens).filter((path) => !consumed(canonical(path)))).toEqual([]);
    });

    it('keeps generated static and provider CSS syntactically valid', () => {
        [':root', '[data-mantle-theme-scope="test"]'].forEach((selector) => {
            const css = createPresetCss(Aura, { selector, prefix: 'probe', darkModeSelector: '.app-dark', colorSchemeAttribute: true });
            const parsed = postcss.parse(css);

            expect(parsed.nodes.length).toBeGreaterThan(100);
            expect(css).not.toMatch(/var\(--mantle-(?!chart-theme-)/);
        });
    });

    it('recomputes component aliases after primitive, semantic and component overrides', () => {
        const preset = definePreset(Aura, {
            primitive: { emerald: { 500: '#112233' } },
            semantic: { colorScheme: { dark: { formField: { background: '#223344' } } } },
            components: { slider: { range: { background: '#334455' } }, calendar: { day: { selectedBackground: '#445566' } } }
        });

        expect(resolvePreset(preset)['checkbox.root.checkedBackground']).toBe('#112233');
        expect(resolvePreset(preset, 'dark')['inputnumber.input.background']).toBe('#223344');
        expect(resolvePreset(preset)['slider.range.background']).toBe('#334455');
        expect(resolvePreset(preset)['calendar.day.selectedBackground']).toBe('#445566');
        expect(resolvePreset(Aura)['checkbox.root.checkedBackground']).toBe('#10b981');
    });
});
