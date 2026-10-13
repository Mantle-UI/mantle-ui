import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { OverlayFixture, overlayCases, overlayPreset, sourceEvent } from './overlay-cases';
import { definePreset } from '../../components/lib/themes/themes';

const assertions = [];
const settle = () => new Promise((resolve) => setTimeout(resolve, 80));

const assert = (name, actual, expected) => {
    assertions.push({ name, actual, expected, passed: actual === expected });

    if (actual !== expected) {
        throw new Error(`${name}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
    }
};

const token = (root, prefix = 'case') => getComputedStyle(root).getPropertyValue(`--${prefix}-overlay-background`).trim();
const skinTargets = {
    dialog: ['dialog.root.background'],
    autocomplete: ['autocomplete.panel.background'],
    multiselect: ['multiselect.panel.background'],
    calendar: ['calendar.panel.background'],
    'calendar-touch': ['calendar.panel.background'],
    'calendar-touch-self': ['calendar.panel.background'],
    colorpicker: ['colorpicker.panel.background'],
    treeselect: ['treeselect.panel.background'],
    cascadeselect: ['cascadeselect.panel.background'],
    password: ['password.panel.background'],
    menu: ['menu.root.background'],
    tieredmenu: ['tieredmenu.root.background'],
    slidemenu: ['slidemenu.root.background'],
    contextmenu: ['contextmenu.root.background'],
    overlaypanel: ['overlaypanel.root.background'],
    tooltip: ['tooltip.root.background', '.p-tooltip-text'],
    sidebar: ['sidebar.root.background'],
    mobilenav: ['mobilenav.root.background'],
    confirmdialog: ['confirmdialog.root.background'],
    'confirmdialog-imperative': ['confirmdialog.root.background'],
    confirmpopup: ['confirmpopup.root.background'],
    toast: ['toast.info.background', '.p-toast-message'],
    blockui: ['blockui.mask.background'],
    galleria: ['galleria.mask.background'],
    image: ['image.mask.background'],
    columnfilter: ['datatable.filterPanel.background'],
    dragselection: ['datatable.dragSelection.background']
};

const componentOverride = (path, value) => {
    const parts = path.split('.');
    const last = parts.pop();
    const components = {};
    const target = parts.reduce((object, key) => (object[key] ||= {}), components);

    target[last] = value;

    return { components };
};

const run = async () => {
    for (const testCase of overlayCases) {
        const api = React.createRef();
        const reactRoot = createRoot(document.getElementById('app'));
        let context;
        const capture = (value) => (context = value);

        flushSync(() =>
            reactRoot.render(
                <React.StrictMode>
                    <OverlayFixture testCase={testCase} api={api} capture={capture} />
                </React.StrictMode>
            )
        );
        await settle();
        flushSync(() => testCase.open?.({ api, target: document.getElementById('overlay-trigger') }));
        await settle();

        const root = testCase.root();
        const scope = context.themeScope;

        assert(`${testCase.name}: actual portal root exists`, !!root, true);
        assert(`${testCase.name}: local dark tokens resolve`, token(root), '#223344');
        assert(`${testCase.name}: provider root tokens do not leak`, getComputedStyle(document.documentElement).getPropertyValue('--case-overlay-background'), '');

        if (testCase.consumesBackground) {
            assert(`${testCase.name}: Aura consumes dark background`, getComputedStyle(root).backgroundColor, 'rgb(34, 51, 68)');
        }

        if (testCase.consumesSurfaceBackground) {
            assert(`${testCase.name}: native skin consumes dark surface token`, getComputedStyle(root).backgroundColor, 'rgb(24, 24, 27)');
        }

        if (testCase.extraRoot) {
            assert(`${testCase.name}: secondary mask resolves dark tokens`, token(testCase.extraRoot()), '#223344');
        }

        document.getElementById('overlay-origin').classList.remove('app-dark');
        await settle();
        assert(`${testCase.name}: live dark removal resolves light tokens`, token(root), '#112233');

        if (testCase.consumesBackground) {
            assert(`${testCase.name}: Aura consumes light background`, getComputedStyle(root).backgroundColor, 'rgb(17, 34, 51)');
        }

        if (testCase.consumesSurfaceBackground) {
            assert(`${testCase.name}: native skin consumes light surface token`, getComputedStyle(root).backgroundColor, 'rgb(255, 255, 255)');
        }

        flushSync(() => context.setTheme({ preset: definePreset(overlayPreset, { semantic: { colorScheme: { light: { overlay: { background: '#abcdef' } } } } }), options: { prefix: 'updated', darkModeSelector: '.app-dark' } }));
        await settle();
        assert(`${testCase.name}: replacement prefix and preset reach portal`, token(root, 'updated'), '#abcdef');

        if (testCase.consumesBackground) {
            assert(`${testCase.name}: Aura consumes replacement background`, getComputedStyle(root).backgroundColor, 'rgb(171, 205, 239)');
        }

        if (testCase.name === 'tooltip') {
            document.getElementById('overlay-origin').classList.add('app-dark');
            flushSync(() => api.current.show(sourceEvent(document.getElementById('overlay-trigger'))));
            await settle();
            assert('tooltip: visible retarget resolves dark source', token(root, 'updated'), '#223344');
        }

        if (testCase.name === 'dragselection') {
            api.current.getElement().querySelector('tbody tr').classList.add('app-dark');
            await settle();
            assert('dragselection: row-local dark ancestry reaches direct helper', token(root, 'updated'), '#223344');
        }

        const [path, partSelector] = skinTargets[testCase.name];
        const part = partSelector ? root.querySelector(partSelector) : root;

        flushSync(() => context.setTheme({ preset: definePreset(overlayPreset, componentOverride(path, '#405060')), options: { prefix: 'component', darkModeSelector: '.app-dark' } }));
        await settle();
        assert(`${testCase.name}: actual component background override wins`, getComputedStyle(part).backgroundColor, 'rgb(64, 80, 96)');

        flushSync(() => reactRoot.unmount());
        assert(`${testCase.name}: portal root cleaned up`, root.isConnected, false);
        assert(`${testCase.name}: provider sheet cleaned up`, document.querySelector(`style[data-mantle-theme="${scope}"]`) === null, true);
        assert(`${testCase.name}: origin markers cleaned up`, document.querySelector('[data-mantle-theme-origin]') === null, true);
        assert(`${testCase.name}: direct masks and helpers cleaned up`, document.querySelector('.p-datepicker-mask, .p-datatable-drag-selection-helper') === null, true);
    }
};

run()
    .then(() => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: true, assertions });
    })
    .catch((error) => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, error: error.message, assertions });
    });
