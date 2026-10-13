import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { MantleProvider } from '../../components/lib/api/Api';
import { Card } from '../../components/lib/card/Card';
import { IconField } from '../../components/lib/iconfield/IconField';
import { InputText } from '../../components/lib/inputtext/InputText';
import { Panel } from '../../components/lib/panel/Panel';
import { Aura, applyPreset, definePreset, removePreset } from '../../components/lib/themes/themes';

const assertions = [];
const root = createRoot(document.getElementById('app'));
const settle = () => new Promise((resolve) => setTimeout(resolve, 80));
const render = (scene) => flushSync(() => root.render(<React.StrictMode>{scene}</React.StrictMode>));
const color = (id) => getComputedStyle(document.getElementById(id)).backgroundColor;

const assert = (name, actual, expected) => {
    assertions.push({ name, actual, expected, passed: actual === expected });
    document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, phase: name, assertions });

    if (actual !== expected) {
        throw new Error(`${name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
};

const selectors = [
    { value: '.theme-region' },
    { value: '#theme-region' },
    { value: '[data-theme-region]' },
    { value: 'main > section.theme-region' },
    { value: '.theme-region, #theme-alternate', alternate: true },
    { value: ':is(.theme-region, #theme-alternate)', alternate: true },
    { value: ':where(.theme-region, [data-alternate-region])', alternate: true },
    { value: '#theme-root-card' }
];

const run = async () => {
    for (const testCase of selectors) {
        let prefix = 'selector';
        let local = true;
        let localColor = '#112233';
        let darkModeSelector = false;
        const options = () => ({ selector: testCase.value, prefix, darkModeSelector });
        const scene = () => (
            <main>
                <section id="theme-region" className="theme-region" data-theme-region="">
                    <div id="selector-origin">
                        <Card id="theme-root-card" dt={local ? { root: { background: localColor }, body: { padding: '23px' }, colorScheme: { dark: { root: { background: '#223344' } } } } : undefined}>
                            <Card id="nested-default">Nested default</Card>
                            <Panel id="different-type" header="Panel">
                                <Card id="deep-default">Deep default</Card>
                            </Panel>
                            <Card id="nested-local" dt={{ root: { background: '#445566' } }}>
                                <Card id="local-child-default">Default inside another local instance</Card>
                            </Card>
                            <IconField dt={{ root: { inputPadding: '61px' } }}>
                                <InputText id="composite-input" />
                            </IconField>
                        </Card>
                    </div>
                    <MantleProvider value={{ theme: { preset: definePreset(Aura, { components: { card: { root: { background: '#778899' } } } }), options: { prefix, darkModeSelector: false } } }}>
                        <Card id="provider-card">
                            <div id="provider-selector" className="theme-region app-dark">
                                Provider
                            </div>
                        </Card>
                    </MantleProvider>
                </section>
                <section id="theme-alternate" data-alternate-region="">
                    <Card id="alternate-card">Alternate region</Card>
                </section>
                <section id="outside-region">
                    <Card id="outside-card">Outside</Card>
                </section>
            </main>
        );

        const check = (stage, defaultColor, ownerColor) => {
            assert(`${testCase.value}/${stage}: owner keeps local background`, color('theme-root-card'), ownerColor);
            ['nested-default', 'deep-default', 'local-child-default'].forEach((id) => assert(`${testCase.value}/${stage}: ${id} has independent defaults`, color(id), defaultColor));
            assert(`${testCase.value}/${stage}: different component keeps its default`, getComputedStyle(document.querySelector('#different-type .p-panel-header')).backgroundColor, defaultColor);
            assert(`${testCase.value}/${stage}: nested local instance keeps its override`, color('nested-local'), 'rgb(68, 85, 102)');
            assert(`${testCase.value}/${stage}: composite child retains parent spacing`, getComputedStyle(document.getElementById('composite-input')).paddingRight, '61px');
            assert(`${testCase.value}/${stage}: provider stays isolated`, color('provider-card'), 'rgb(119, 136, 153)');
            assert(`${testCase.value}/${stage}: raw provider descendants stay isolated`, getComputedStyle(document.getElementById('provider-selector')).getPropertyValue(`--${prefix}-card-root-background`).trim(), '#778899');
            assert(`${testCase.value}/${stage}: outside variables stay empty`, getComputedStyle(document.getElementById('outside-card')).getPropertyValue(`--${prefix}-card-root-background`).trim(), '');
            assert(`${testCase.value}/${stage}: document variables stay empty`, getComputedStyle(document.documentElement).getPropertyValue(`--${prefix}-card-root-background`).trim(), '');

            if (testCase.alternate) {
                assert(`${testCase.value}/${stage}: alternate selector also receives theme`, color('alternate-card'), 'rgb(255, 255, 255)');
            }
        };

        flushSync(() => applyPreset(Aura, options()));
        render(scene());
        await settle();
        check('light', 'rgb(255, 255, 255)', 'rgb(17, 34, 51)');
        assert(`${testCase.value}: internal body retains local tokens`, getComputedStyle(document.querySelector('#theme-root-card > .p-card-body')).paddingTop, '23px');
        prefix = 'replacement';
        localColor = '#abcdef';
        flushSync(() => applyPreset(Aura, options()));
        render(scene());
        await settle();
        check('prefix replacement', 'rgb(255, 255, 255)', 'rgb(171, 205, 239)');
        darkModeSelector = '.app-dark';
        flushSync(() => applyPreset(Aura, options()));
        document.getElementById('selector-origin').classList.add('app-dark');
        await settle();
        check('local dark class', 'rgb(24, 24, 27)', 'rgb(34, 51, 68)');
        document.getElementById('selector-origin').classList.remove('app-dark');
        local = false;
        render(scene());
        await settle();
        check('dt removal', 'rgb(255, 255, 255)', 'rgb(255, 255, 255)');
        render(null);
        flushSync(() => removePreset());
        assert(`${testCase.value}: all theme sheets cleaned up`, document.querySelectorAll('style[data-mantle-theme], style[data-mantle-theme-local]').length, 0);
    }

    flushSync(() => root.unmount());
};

run()
    .then(() => (document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: true, assertions })))
    .catch((error) => (document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, error: error.message, assertions })));
