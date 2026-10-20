import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import { MantleProvider } from '../api/Api';
import { Dropdown } from '../dropdown/Dropdown';

describe('Mantle CSS layer', () => {
    let styleContainer;

    beforeEach(() => {
        // Detached container avoids jsdom's incomplete CSS cascade-layer parser.
        // Browser validation is needed separately for computed cascade precedence.
        styleContainer = document.createElement('div');
    });

    const renderDropdown = (providerOptions = {}, componentOptions = {}) =>
        render(
            <MantleProvider value={{ styleContainer, ...providerOptions }}>
                <Dropdown options={['One', 'Two']} {...componentOptions} />
            </MantleProvider>
        );

    it('injects common and component styles into the same mantle layer', () => {
        renderDropdown();

        for (const name of ['common', 'dropdown']) {
            const style = styleContainer.querySelector(`style[data-primereact-style-id="${name}"]`);

            expect(style).not.toBeNull();
            expect(style).toHaveTextContent(/@layer mantle\s*\{/);
            expect(style).not.toHaveTextContent(/@layer primereact\b/);
        }
    });

    it.each([
        ['provider', { unstyled: true }, {}],
        ['component', {}, { unstyled: true }]
    ])('skips layered styles in %s unstyled mode', (mode, providerOptions, componentOptions) => {
        renderDropdown(providerOptions, componentOptions);

        expect(styleContainer.querySelector('style[data-primereact-style-id="base"]')).not.toBeNull();
        expect(styleContainer.querySelector('style[data-primereact-style-id="common"]')).toBeNull();
        expect(styleContainer.querySelector('style[data-primereact-style-id="dropdown"]')).toBeNull();
        expect(styleContainer).not.toHaveTextContent(/@layer\s/);
    });

    const themeRoot = path.join(process.cwd(), 'public/themes');
    const themes = fs.readdirSync(themeRoot).filter((name) => fs.existsSync(path.join(themeRoot, name, 'theme.css')));

    it.each(themes)('ships %s theme rules in the mantle layer', (theme) => {
        const css = fs.readFileSync(path.join(themeRoot, theme, 'theme.css'), 'utf8');
        const layers = [];

        postcss.parse(css).walkAtRules('layer', (rule) => layers.push(rule.params));

        expect(layers.length).toBeGreaterThan(0);
        expect(new Set(layers)).toEqual(new Set(['mantle']));
    });
});
