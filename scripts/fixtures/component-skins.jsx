import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { MantleContext, MantleProvider } from '../../components/lib/api/Api';
import { Aura, applyPreset, definePreset, removePreset } from '../../components/lib/themes/themes';
import { componentOverrides, skinCases, SkinSubjects } from './skin-cases';

const assertions = [];
const group = document.documentElement.dataset.testGroup;
const cases = skinCases.filter((testCase) => !group || (testCase.group || 'controls') === group);
const staticTheme = document.documentElement.dataset.staticTheme === 'true';
const globalTheme = document.documentElement.dataset.globalTheme === 'true';
const themeOptions = (prefix) => ({ prefix: staticTheme ? 'mantle' : prefix, darkModeSelector: '.app-dark', variablesOnly: staticTheme });
let context;
const root = createRoot(document.getElementById('app'));
const settle = () => new Promise((resolve) => setTimeout(resolve, 80));

const assert = (name, actual, expected) => {
    assertions.push({ name, actual, expected, passed: actual === expected });
    document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, phase: name, assertions });

    if (actual !== expected) {
        throw new Error(`${name}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
    }
};

const Controls = () => {
    const provider = React.useContext(MantleContext);

    context = globalTheme ? { setTheme: ({ preset, options }) => applyPreset(preset, options) } : provider;

    return null;
};

const checkCases = async (updated) => {
    for (const testCase of cases) {
        const container = document.querySelector(`[data-skin-case="${testCase.name}"]`);

        if (testCase.prepare && !updated) {
            flushSync(() => testCase.prepare(container));
            await settle();
        }

        const part = container.querySelector(testCase.selector);

        assert(`${testCase.name}: actual styled part exists`, !!part, true);

        if (testCase.pseudo) {
            const selector = `[data-skin-case="${testCase.name}"] ${testCase.pseudoSelector || testCase.selector}`;
            const response = await fetch('/pseudo', { method: 'POST', body: JSON.stringify({ selector, classes: testCase.pseudo, pointer: testCase.name === 'button-hover' || testCase.name === 'button-active' }) });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            await settle();
        }

        if (testCase.focus) {
            container.querySelector(testCase.focus).focus();
            await settle();
        }

        const expected = updated ? testCase.updated || 'rgb(64, 80, 96)' : testCase.value || 'rgb(16, 32, 48)';

        assert(`${testCase.name}: ${updated ? 'runtime replacement' : 'component override'} reaches ${testCase.property}`, getComputedStyle(part)[testCase.property], expected);
    }
};

const run = async () => {
    const initial = { preset: definePreset(Aura, componentOverrides(cases)), options: themeOptions('skins') };
    const contents = (
        <>
            <Controls />
            <SkinSubjects cases={cases} />
        </>
    );

    if (globalTheme) {
        applyPreset(initial.preset, initial.options);
    }

    flushSync(() => root.render(<React.StrictMode>{globalTheme ? contents : <MantleProvider value={{ theme: initial }}>{contents}</MantleProvider>}</React.StrictMode>));
    await settle();
    await checkCases(false);
    flushSync(() => context.setTheme({ preset: definePreset(Aura, componentOverrides(cases, true)), options: themeOptions('replaced') }));
    await settle();
    await checkCases(true);

    const semantic = { preset: Aura, options: themeOptions('semantic') };
    const semanticContents = (
        <>
            <Controls />
            <SkinSubjects cases={skinCases.filter((testCase) => ['inputnumber', 'checkbox-selected'].includes(testCase.name))} />
        </>
    );

    if (globalTheme) {
        flushSync(() => applyPreset(semantic.preset, semantic.options));
    }

    flushSync(() => root.render(globalTheme ? semanticContents : <MantleProvider value={{ theme: semantic }}>{semanticContents}</MantleProvider>));
    await settle();

    flushSync(() =>
        context.setTheme({
            preset: definePreset(Aura, { primitive: { emerald: { 500: '#123456' } }, semantic: { colorScheme: { light: { formField: { background: '#abcdef' } }, dark: { formField: { background: '#234567' } } } } }),
            options: themeOptions('semantic')
        })
    );
    await settle();
    assert('primitive palette reaches checked checkbox', getComputedStyle(document.querySelector('[data-skin-case="checkbox-selected"] .p-checkbox-box')).backgroundColor, 'rgb(18, 52, 86)');
    assert('semantic field background reaches inputnumber', getComputedStyle(document.querySelector('[data-skin-case="inputnumber"] input')).backgroundColor, 'rgb(171, 205, 239)');
    document.getElementById('app').classList.add('app-dark');
    await settle();
    assert('local dark semantic field background reaches inputnumber', getComputedStyle(document.querySelector('[data-skin-case="inputnumber"] input')).backgroundColor, 'rgb(35, 69, 103)');
    assert(globalTheme ? 'imperative variables reach root' : 'provider custom variables do not reach root', getComputedStyle(document.documentElement).getPropertyValue('--semantic-primary-color').trim(), globalTheme ? '#123456' : '');
    flushSync(() => root.unmount());

    if (globalTheme) {
        removePreset();
    }

    assert('all provider sheets removed on unmount', document.querySelectorAll('style[data-mantle-theme]').length, 0);
};

run()
    .then(() => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: true, assertions });
    })
    .catch((error) => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, error: error.message, assertions });
    });
