import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { MantleProvider } from '../../components/lib/api/Api';
import { Button } from '../../components/lib/button/Button';
import { Card } from '../../components/lib/card/Card';
import { Dropdown } from '../../components/lib/dropdown/Dropdown';
import { Dialog } from '../../components/lib/dialog/Dialog';
import { IconField } from '../../components/lib/iconfield/IconField';
import { InputIcon } from '../../components/lib/inputicon/InputIcon';
import { InputText } from '../../components/lib/inputtext/InputText';
import { Panel } from '../../components/lib/panel/Panel';
import { SpeedDial } from '../../components/lib/speeddial/SpeedDial';
import { Aura, applyPreset, definePreset, removePreset } from '../../components/lib/themes/themes';
import { overlayCases } from './overlay-cases';

const assertions = [];
const settle = () => new Promise((resolve) => setTimeout(resolve, 80));
const group = document.documentElement.dataset.testGroup || 'provider';
const root = createRoot(document.getElementById('app'));
const render = (scene) => flushSync(() => root.render(<React.StrictMode>{scene}</React.StrictMode>));

const assert = (name, actual, expected) => {
    assertions.push({ name, actual, expected, passed: actual === expected });
    document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, phase: name, assertions });

    if (actual !== expected) {
        throw new Error(`${name}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
    }
};

const color = (element) => getComputedStyle(element).backgroundColor;

const waitForElement = async (id) => {
    for (let attempt = 0; attempt < 80 && !document.getElementById(id); attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 20));
    }

    assert(`${id}: mounted`, !!document.getElementById(id), true);
};

const tokenPath = {
    dialog: 'root.background',
    autocomplete: 'panel.background',
    multiselect: 'panel.background',
    calendar: 'panel.background',
    'calendar-touch': 'panel.background',
    'calendar-touch-self': 'panel.background',
    colorpicker: 'panel.background',
    treeselect: 'panel.background',
    cascadeselect: 'panel.background',
    password: 'panel.background',
    menu: 'root.background',
    tieredmenu: 'root.background',
    slidemenu: 'root.background',
    contextmenu: 'root.background',
    overlaypanel: 'root.background',
    tooltip: 'root.background',
    sidebar: 'root.background',
    mobilenav: 'root.background',
    confirmdialog: 'root.background',
    'confirmdialog-imperative': 'root.background',
    confirmpopup: 'root.background',
    toast: 'info.background',
    blockui: 'mask.background',
    galleria: 'mask.background',
    image: 'mask.background',
    columnfilter: 'filterPanel.background',
    dragselection: 'dragSelection.background',
    dropdown: 'panel.background',
    speeddial: 'mask.background'
};

const setToken = (path, value, target = {}) => {
    const parts = path.split('.');
    const last = parts.pop();
    const object = parts.reduce((node, key) => (node[key] ||= {}), target);

    object[last] = value;

    return target;
};

const cases = [
    ...overlayCases.map((testCase) => (testCase.name.startsWith('confirmdialog') ? { ...testCase, extraRoot: () => testCase.root()?.parentElement } : testCase)),
    { name: 'dropdown', Component: Dropdown, props: { options: ['One'] }, open: ({ api }) => api.current.show(), root: () => document.querySelector('.p-dropdown-panel') },
    { name: 'speeddial', Component: SpeedDial, props: { mask: true, model: [{ label: 'One' }] }, open: ({ api }) => api.current.show(), root: () => document.querySelector('.p-speeddial-mask') }
];

const overlayChecks = async (global) => {
    const selected = group === 'global-first' ? cases.slice(0, 16) : group === 'global-second' ? cases.slice(16) : cases;

    for (const testCase of selected) {
        const api = React.createRef();
        const Component = testCase.Component;
        let prefix = 'scoped';
        let local = true;
        let localColor = '#112233';
        const options = () => ({ prefix, darkModeSelector: '.app-dark' });

        const tokens = () => {
            const light = setToken(tokenPath[testCase.name], localColor);
            const dark = setToken(tokenPath[testCase.name], '#223344');

            if (testCase.extraRoot) {
                setToken('mask.background', '#445566', light);
                setToken('mask.background', '#556677', dark);
            }

            return { ...light, colorScheme: { dark } };
        };

        const scene = () => {
            const transitionProps = ['blockui', 'mobilenav', 'tooltip', 'image', 'columnfilter', 'dragselection', 'speeddial'].includes(testCase.name) ? {} : { transitionOptions: { timeout: 0 } };
            const subject = (
                <Component ref={api} {...testCase.props} {...transitionProps} dt={local ? tokens() : undefined}>
                    {testCase.children}
                </Component>
            );
            const contents = (
                <>
                    <section id="scoped-origin">
                        <button id="scoped-trigger">Trigger</button>
                        {!testCase.imperative && subject}
                    </section>
                    {testCase.imperative && subject}
                </>
            );

            return global ? contents : <MantleProvider value={{ theme: { preset: Aura, options: options() } }}>{contents}</MantleProvider>;
        };

        if (global) {
            flushSync(() => applyPreset(Aura, options()));
        }

        render(scene());
        await settle();
        flushSync(() => testCase.open?.({ api, target: document.getElementById('scoped-trigger') }));
        await settle();
        const element = testCase.root();
        const part = testCase.name === 'tooltip' ? element?.querySelector('.p-tooltip-text') : testCase.name === 'toast' ? element?.querySelector('.p-toast-message') : element;
        const instance = element?.getAttribute('data-mantle-theme-instance');

        assert(`${group}/${testCase.name}: actual root mounts`, !!element, true);
        assert(`${group}/${testCase.name}: instance is carried to real root`, !!instance, true);
        assert(`${group}/${testCase.name}: local background paints`, color(part), 'rgb(17, 34, 51)');

        if (testCase.extraRoot) {
            const mask = testCase.extraRoot();

            assert(`${group}/${testCase.name}: sibling mask has same instance`, mask.getAttribute('data-mantle-theme-instance'), instance);
            assert(`${group}/${testCase.name}: sibling mask paints local background`, color(mask), 'rgb(68, 85, 102)');
        }

        document.getElementById('scoped-origin').classList.add('app-dark');
        await settle();
        assert(`${group}/${testCase.name}: local dark class paints detached root`, color(part), 'rgb(34, 51, 68)');

        if (testCase.extraRoot) {
            assert(`${group}/${testCase.name}: local dark class paints detached mask`, color(testCase.extraRoot()), 'rgb(85, 102, 119)');
        }

        document.getElementById('scoped-origin').classList.remove('app-dark');
        prefix = 'replacement';
        localColor = '#abcdef';

        if (global) {
            flushSync(() => applyPreset(definePreset(Aura, { semantic: { primary: { 500: '#ff00cc' } } }), options()));
        }

        render(scene());
        await settle();
        assert(`${group}/${testCase.name}: ref and real root survive updates`, testCase.root() === element, true);
        assert(`${group}/${testCase.name}: replacement prefix and dt repaint`, color(part), 'rgb(171, 205, 239)');
        assert(`${group}/${testCase.name}: only owning local sheet remains`, document.querySelectorAll('style[data-mantle-theme-local]').length, 1);
        local = false;
        render(scene());
        await settle();
        assert(`${group}/${testCase.name}: removing dt removes local sheet`, document.querySelectorAll('style[data-mantle-theme-local]').length, 0);
        assert(`${group}/${testCase.name}: removing dt removes root instance`, !!element.getAttribute('data-mantle-theme-instance'), false);
        render(null);
        assert(`${group}/${testCase.name}: unmount removes real root`, element.isConnected, false);
        assert(`${group}/${testCase.name}: StrictMode cleanup removes origin markers`, document.querySelector('[data-mantle-theme-origin]') === null, true);

        if (global) {
            flushSync(() => removePreset());
        }

        assert(`${group}/${testCase.name}: all owned theme sheets clean up`, document.querySelectorAll('style[data-mantle-theme], style[data-mantle-theme-local]').length, 0);
    }
};

const nestingChecks = async () => {
    let local = true;
    let colorScheme = '';
    let prefix = 'nested';
    const scene = () => (
        <section id="nested-origin" className={colorScheme}>
            <Card id="outer-card" dt={local ? { root: { background: '#112233' }, colorScheme: { dark: { root: { background: '#223344' } } } } : undefined}>
                <Card id="ordinary-card">Ordinary</Card>
                <Panel id="ordinary-panel" header="Panel">
                    Different component
                </Panel>
                <Card id="inner-card" dt={{ root: { background: '#445566' } }}>
                    <Card id="deep-card">Deep ordinary</Card>
                </Card>
                <Button id="ordinary-button" label="Ordinary button" />
            </Card>
            <Card id="sibling-card">Sibling</Card>
            <IconField dt={{ root: { inputPadding: '61px', iconOffset: '21px' } }}>
                <InputIcon id="composite-icon">Icon</InputIcon>
                <InputText id="composite-input" />
            </IconField>
            <MantleProvider value={{ theme: { preset: definePreset(Aura, { components: { card: { root: { background: '#778899' } } } }), options: { prefix } } }}>
                <Card id="provider-card">
                    <div id="provider-raw-dark" className="app-dark">
                        Provider
                    </div>
                </Card>
            </MantleProvider>
            <MantleProvider value={{ theme: { preset: Aura } }}>
                <Card id="default-options-card" dt={{ root: { background: '#aabbcc' } }}>
                    Default options
                </Card>
                <section className="app-dark">
                    <Dialog id="default-options-dialog" visible onHide={() => {}} transitionOptions={{ timeout: 0 }} dt={{ root: { background: '#112233' }, colorScheme: { dark: { root: { background: '#223344' } } } }} />
                </section>
            </MantleProvider>
        </section>
    );

    const check = (stage, defaultColor) => {
        assert(`${stage}: global dt remains on its owner`, color(document.getElementById('outer-card')), local ? (colorScheme ? 'rgb(34, 51, 68)' : 'rgb(17, 34, 51)') : defaultColor);
        ['ordinary-card', 'deep-card', 'sibling-card'].forEach((id) => assert(`${stage}: ${id} resolves its own defaults`, color(document.getElementById(id)), defaultColor));
        assert(`${stage}: nested distinct local instance remains independent`, color(document.getElementById('inner-card')), 'rgb(68, 85, 102)');
        assert(`${stage}: global consuming CSS excludes provider roots`, color(document.getElementById('provider-card')), 'rgb(119, 136, 153)');
        assert(`${stage}: global dark variables exclude provider descendants`, getComputedStyle(document.getElementById('provider-raw-dark')).getPropertyValue(`--${prefix}-card-root-background`).trim(), '#778899');
        assert(`${stage}: nested different component keeps primary palette`, color(document.getElementById('ordinary-button')), colorScheme ? 'rgb(52, 211, 153)' : 'rgb(16, 185, 129)');
        assert(`${stage}: composite input retains its owner's spacing token`, getComputedStyle(document.getElementById('composite-input')).paddingRight, '61px');
        assert(`${stage}: composite icon retains its owner's offset token`, getComputedStyle(document.getElementById('composite-icon')).right, '21px');
        assert(`${stage}: provider defaults do not borrow a global prefix`, color(document.getElementById('default-options-card')), 'rgb(170, 187, 204)');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        assert(`${stage}: provider portal defaults do not borrow a global dark selector`, document.getElementById('default-options-dialog').getAttribute('data-mantle-color-scheme'), systemDark ? 'dark' : 'light');
        assert(`${stage}: provider portal local tokens use their own default prefix`, color(document.getElementById('default-options-dialog')), systemDark ? 'rgb(34, 51, 68)' : 'rgb(17, 34, 51)');
    };

    flushSync(() => applyPreset(Aura, { prefix, darkModeSelector: '.app-dark' }));
    render(scene());
    await settle();
    await waitForElement('default-options-dialog');
    check('global/light', 'rgb(255, 255, 255)');
    assert('global/light: nested Panel header keeps its defaults', color(document.querySelector('#ordinary-panel .p-panel-header')), 'rgb(255, 255, 255)');
    colorScheme = 'app-dark';
    render(scene());
    await settle();
    check('global/dark', 'rgb(24, 24, 27)');
    colorScheme = '';
    prefix = 'next';
    flushSync(() => applyPreset(Aura, { prefix, darkModeSelector: '.app-dark' }));
    render(scene());
    await settle();
    check('global/replacement', 'rgb(255, 255, 255)');
    local = false;
    render(scene());
    await settle();
    check('global/dt removal', 'rgb(255, 255, 255)');
    render(null);
    flushSync(() => removePreset());
    assert('global/nesting: local and provider sheets clean up', document.querySelectorAll('style[data-mantle-theme], style[data-mantle-theme-local]').length, 0);

    const dropdown = React.createRef();

    flushSync(() => applyPreset(Aura, { prefix: 'plain', darkModeSelector: '.app-dark' }));
    render(
        <section id="plain-origin" className="app-dark">
            <Dropdown ref={dropdown} options={['One']} transitionOptions={{ timeout: 0 }} />
        </section>
    );
    await settle();
    flushSync(() => dropdown.current.show());
    await settle();
    assert('global/no dt: portal follows origin dark class', color(dropdown.current.getOverlay()), 'rgb(24, 24, 27)');
    flushSync(() => applyPreset(Aura, { prefix: 'updated', darkModeSelector: '.second-dark' }));
    await settle();
    assert('global/no dt: runtime dark selector replacement is observed', color(dropdown.current.getOverlay()), 'rgb(255, 255, 255)');
    document.getElementById('plain-origin').classList.add('second-dark');
    await settle();
    assert('global/no dt: replacement selector tracks live classes', color(dropdown.current.getOverlay()), 'rgb(24, 24, 27)');
    render(null);
    flushSync(() => removePreset());
    assert('global/no dt: unmount cleans origin marker', document.querySelector('[data-mantle-theme-origin]') === null, true);

    // Existing roots must acquire their default-reset boundary when the global
    // preset is activated after mount, and lose it when the preset is removed.
    render(
        <Card id="late-outer" dt={{ root: { background: '#112233' }, body: { padding: '23px' } }}>
            <Card id="late-inner">Ordinary nested card</Card>
        </Card>
    );
    await settle();
    assert('global/late activation: no local sheet before a preset', document.querySelectorAll('style[data-mantle-theme-local]').length, 0);
    flushSync(() => applyPreset(Aura, { prefix: 'late', darkModeSelector: false }));
    await settle();
    assert('global/late activation: mounted owner receives dt', color(document.getElementById('late-outer')), 'rgb(17, 34, 51)');
    assert('global/late activation: mounted nested component receives its default', color(document.getElementById('late-inner')), 'rgb(255, 255, 255)');
    assert('global/late activation: internal body retains owner tokens', getComputedStyle(document.querySelector('#late-outer > .p-card-body')).paddingTop, '23px');
    assert('global/late activation: only actual styled roots are boundaries', document.querySelectorAll('[data-mantle-theme-root]').length, 2);
    flushSync(() => removePreset());
    await settle();
    assert('global/removal: mounted roots lose token boundaries', document.querySelectorAll('[data-mantle-theme-root]').length, 0);
    assert('global/removal: mounted owners remove local sheets', document.querySelectorAll('style[data-mantle-theme-local]').length, 0);
    render(null);
};

const run = async () => {
    if (group === 'nested') {
        await nestingChecks();
    } else {
        await overlayChecks(group.startsWith('global'));
    }

    flushSync(() => root.unmount());
};

run()
    .then(() => (document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: true, group, assertions })))
    .catch((error) => (document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, group, error: error.message, debug: document.querySelector('.p-toast')?.outerHTML, assertions })));
