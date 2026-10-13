import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { MantleContext, MantleProvider } from '../../components/lib/api/Api';
import { Button } from '../../components/lib/button/Button';
import { Dialog } from '../../components/lib/dialog/Dialog';
import { DataViewLayoutOptions } from '../../components/lib/dataview/DataView';
import { Dropdown } from '../../components/lib/dropdown/Dropdown';
import { InputMask } from '../../components/lib/inputmask/InputMask';
import { InputSwitch } from '../../components/lib/inputswitch/InputSwitch';
import { SplitButton } from '../../components/lib/splitbutton/SplitButton';
import { VirtualScroller } from '../../components/lib/virtualscroller/VirtualScroller';
import { Aura, definePreset, resolvePreset } from '../../components/lib/themes/themes';

const assertions = [];
const contexts = {};
const settle = () => new Promise((resolve) => setTimeout(resolve, 80));

const waitForElement = async (id, target = document) => {
    for (let attempt = 0; attempt < 80 && !target.getElementById(id); attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 20));
    }

    assert(`${id} mounted`, !!target.getElementById(id), true);
};

const assert = (name, actual, expected) => {
    assertions.push({ name, actual, expected, passed: actual === expected });

    if (actual !== expected) {
        throw new Error(`${name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
};

const background = (id) => getComputedStyle(document.getElementById(id)).backgroundColor;

const Capture = ({ name }) => {
    contexts[name] = React.useContext(MantleContext);

    return null;
};

const buttonPreset = (color) => definePreset(Aura, { components: { button: { root: { background: color } } } });
const root = createRoot(document.getElementById('app'));
const render = (scene) => flushSync(() => root.render(<React.StrictMode>{scene}</React.StrictMode>));

const empty = () => {
    render(null);
    assert('provider/local sheets clean up between scenarios', document.querySelectorAll('style[data-mantle-theme], style[data-mantle-theme-local]').length, 0);
};

const run = async () => {
    let inputPreset = buttonPreset('#112233');
    let revision = 0;
    const inlineScene = () => (
        <MantleProvider themeRevision={revision} value={{ theme: { preset: inputPreset, options: { prefix: 'inline' } } }}>
            <Capture name="inline" />
            <Button id="inline-button" label="Inline" />
        </MantleProvider>
    );

    render(inlineScene());
    await settle();
    flushSync(() => contexts.inline.setTheme({ preset: buttonPreset('#abcdef'), options: { prefix: 'runtime' } }));
    await settle();
    render(inlineScene());
    await settle();
    assert('1: unrelated inline configuration rerender preserves setTheme', background('inline-button'), 'rgb(171, 205, 239)');
    inputPreset = buttonPreset('#445566');
    render(inlineScene());
    await settle();
    assert('1: genuine external token replacement is accepted', background('inline-button'), 'rgb(68, 85, 102)');
    flushSync(() => contexts.inline.setTheme({ preset: buttonPreset('#abcdef') }));
    revision++;
    render(inlineScene());
    await settle();
    assert('1: explicit revision reapplies equivalent external config', background('inline-button'), 'rgb(68, 85, 102)');
    empty();

    let controlled = { preset: buttonPreset('#112233') };
    let requested;
    const controlledScene = () => (
        <MantleProvider themeMode="controlled" onThemeChange={(value) => (requested = value)} value={{ theme: controlled }}>
            <Capture name="controlled" />
            <Button id="controlled-button" label="Controlled" />
        </MantleProvider>
    );

    render(controlledScene());
    await settle();
    flushSync(() => contexts.controlled.setTheme({ preset: buttonPreset('#abcdef') }));
    await settle();
    assert('1: controlled provider waits for external acceptance', background('controlled-button'), 'rgb(17, 34, 51)');
    controlled = requested;
    render(controlledScene());
    await settle();
    assert('1: controlled replacement applies requested theme', background('controlled-button'), 'rgb(171, 205, 239)');
    empty();

    const outer = definePreset(Aura, { components: { button: { colorScheme: { light: { root: { background: '#112233' } }, dark: { root: { background: '#223344' } } } } } });
    const inner = definePreset(Aura, { components: { button: { colorScheme: { light: { root: { background: '#334455' } }, dark: { root: { background: '#445566' } } } } } });
    const innerDialog = React.createRef();

    render(
        <MantleProvider value={{ theme: { preset: outer, options: { darkModeSelector: '.outer-dark' } } }}>
            <Dialog id="outer-light-dialog" visible onHide={() => {}} transitionOptions={{ timeout: 0 }}>
                <MantleProvider value={{ theme: { preset: inner, options: { darkModeSelector: '.child-dark' } } }}>
                    <section id="child-origin" className="child-dark">
                        <Button id="nested-review-button" label="Nested" />
                        <Dialog id="inner-review-dialog" ref={innerDialog} visible onHide={() => {}} transitionOptions={{ timeout: 0 }}>
                            <Button id="nested-portaled-button" label="Portaled" />
                        </Dialog>
                    </section>
                </MantleProvider>
            </Dialog>
        </MantleProvider>
    );
    await settle();
    assert('2: nested class-dark provider ignores opposite outer portal marker', background('nested-review-button'), 'rgb(68, 85, 102)');
    await waitForElement('nested-portaled-button');
    assert('2: nested provider portal follows its own class', background('nested-portaled-button'), 'rgb(68, 85, 102)');
    document.getElementById('child-origin').classList.remove('child-dark');
    await settle();
    assert('2: nested local dark removal restores its own light tokens', background('nested-review-button'), 'rgb(51, 68, 85)');
    assert('2: nested portal dark removal follows owned origin', background('nested-portaled-button'), 'rgb(51, 68, 85)');
    empty();

    // Use a new shadow root so previously created primereact layers cannot mask
    // the empty-provider/delayed-structural-style ordering regression.
    const layerHost = document.createElement('div');
    const shadow = layerHost.attachShadow({ mode: 'open' });
    const target = document.createElement('div');
    const settledStyles = document.createElement('style');

    settledStyles.textContent = '* { transition: none !important; animation: none !important; }';
    shadow.appendChild(settledStyles);
    shadow.appendChild(target);
    document.body.appendChild(layerHost);
    const layerRoot = createRoot(target);
    const layerPreset = definePreset(Aura, { components: { dialog: { mask: { background: '#123456' } } } });
    const layeredScene = (show) => (
        <MantleProvider value={{ styleContainer: shadow, theme: { preset: layerPreset, options: { cssLayer: { name: 'review-theme' } } } }}>{show && <Dialog id="delayed-dialog" appendTo={target} visible onHide={() => {}} />}</MantleProvider>
    );

    flushSync(() => layerRoot.render(layeredScene(false)));
    await settle();
    flushSync(() => layerRoot.render(layeredScene(true)));
    await settle();
    await waitForElement('delayed-dialog', shadow);
    assert('3: delayed Dialog mask theme wins after structural layer loads', getComputedStyle(shadow.getElementById('delayed-dialog').parentElement).backgroundColor, 'rgb(18, 52, 86)');
    flushSync(() => layerRoot.unmount());
    assert('3: delayed layered provider mirror is removed', document.querySelectorAll('style[data-mantle-theme]').length, 0);
    layerHost.remove();

    const extended = definePreset(Aura, {
        extend: { my: { width: '13px', transition: { fast: '0.2s' } } },
        components: {
            button: { extend: { accent: { color: '#f59e0b', inverseColor: '#ffffff' } }, css: ({ dt }) => `.p-button-accent { background: ${dt('button.accent.color')}; color: ${dt('button.accent.inverse.color')}; border-width: ${dt('my.width')}; }` }
        },
        css: ({ dt }) => `.review-custom { outline: ${dt('my.width')} solid red; }`
    });
    const composed = definePreset(definePreset(extended, { css: '.review-composed { opacity: 0.7; }' }), { css: '.review-composed { opacity: 0.7; }' });
    const firstDropdown = React.createRef();
    const secondDropdown = React.createRef();
    const maskInput = React.createRef();
    const virtual = React.createRef();
    const split = React.createRef();
    let localColor = '#aa5500';
    let prefix = 'scoped';
    let local = true;
    const localScene = () => (
        <MantleProvider value={{ theme: { preset: composed, options: { prefix, darkModeSelector: '.local-dark' } } }}>
            <section id="local-origin">
                <Capture name="local" />
                <Button id="default-accent" className="p-button-accent review-composed" label="Default" />
                <Button id="local-accent" className="p-button-accent" label="Local" dt={local ? { extend: { accent: { color: localColor } }, css: ({ dt }) => `.p-button-accent { border-color: ${dt('button.accent.color')}; }` } : undefined} />
                <InputSwitch id="local-switch" checked dt={{ colorScheme: { light: { root: { checkedBackground: '#ffaa00' } }, dark: { root: { checkedBackground: '#bb6600' } } } }} />
                <Dropdown id="local-dropdown-one" ref={firstDropdown} options={['One']} dt={local ? { panel: { background: '#112233' }, colorScheme: { dark: { panel: { background: '#223344' } } } } : undefined} />
                <Dropdown id="local-dropdown-two" ref={secondDropdown} options={['One']} dt={{ panel: { background: '#445566' } }} />
                <SplitButton ref={split} label="Local split" model={[{ label: 'Action' }]} dt={{ panel: { background: '#ddbb99' } }} />
                <Dialog id="local-review-dialog" visible onHide={() => {}} dt={{ root: { background: '#556677' }, mask: { background: '#667788' } }}>
                    <Dialog id="ordinary-review-dialog" visible onHide={() => {}} transitionOptions={{ timeout: 0 }} />
                    <span id="custom-global" className="review-custom" />
                </Dialog>
                <InputMask id="local-mask" ref={maskInput} mask="999" dt={{ root: { background: '#778899' } }} />
                <VirtualScroller ref={virtual} items={['One']} itemSize={30} scrollHeight="50px" itemTemplate={(value) => <span>{value}</span>} dt={{ root: { background: '#8899aa' } }} />
                <DataViewLayoutOptions id="local-layout" layout="list" onChange={() => {}} dt={{ layoutButton: { selectedBackground: '#bb00cc' } }} />
            </section>
        </MantleProvider>
    );

    render(localScene());
    await settle();
    flushSync(() => split.current.getElement().querySelector('.p-splitbutton-menubutton').click());
    await settle();
    flushSync(() => {
        firstDropdown.current.show();
        secondDropdown.current.show();
    });
    await settle();
    assert('4: custom CSS preserves Aura consuming styles', background('local-review-dialog'), 'rgb(85, 102, 119)');
    assert('extension: global tokens omit the extend segment', resolvePreset(composed)['my.width'], '13px');
    assert('extension: component tokens omit the extend segment', resolvePreset(composed)['button.accent.color'], '#f59e0b');
    assert('extension: component callback consumes prefixed extension variables', background('default-accent'), 'rgb(245, 158, 11)');
    assert('extension: global callback receives dt accessor', getComputedStyle(document.getElementById('custom-global')).outlineWidth, '13px');
    assert('4: repeated CSS composition emits one consuming rule', document.querySelector('style[data-mantle-theme]').textContent.match(/\.review-composed/g).length, 1);
    assert('dt: extension overrides one button', background('local-accent'), 'rgb(170, 85, 0)');
    assert('dt: local custom callback executes', getComputedStyle(document.getElementById('local-accent')).borderTopColor, 'rgb(170, 85, 0)');
    assert('dt: first body Dropdown consumes its local panel token', getComputedStyle(firstDropdown.current.getOverlay()).backgroundColor, 'rgb(17, 34, 51)');
    assert('dt: sibling body Dropdown remains independent', getComputedStyle(secondDropdown.current.getOverlay()).backgroundColor, 'rgb(68, 85, 102)');
    assert('dt: composite SplitButton detached menu retains its owning instance', getComputedStyle(document.querySelector('.p-splitbutton-menu')).backgroundColor, 'rgb(221, 187, 153)');
    assert('dt: Dialog mask receives its own local tokens', getComputedStyle(document.getElementById('local-review-dialog').parentElement).backgroundColor, 'rgb(102, 119, 136)');
    assert('dt: nested ordinary Dialog does not adopt its parent instance', background('ordinary-review-dialog'), 'rgb(255, 255, 255)');
    assert('dt: InputMask forwards local ownership to its real input', background('local-mask'), 'rgb(119, 136, 153)');
    assert('dt: VirtualScroller supports the shared local style lifecycle', getComputedStyle(virtual.current.getElementRef().current).backgroundColor, 'rgb(136, 153, 170)');
    assert('dt: standalone DataView layout controls consume their token group', getComputedStyle(document.querySelector('#local-layout .p-button.p-highlight')).backgroundColor, 'rgb(187, 0, 204)');
    assert('dt: no token object is forwarded as an HTML attribute', document.querySelector('[dt]') === null, true);
    document.getElementById('local-origin').classList.add('local-dark');
    await settle();
    assert('dt: local component dark scheme reacts to class changes', getComputedStyle(document.querySelector('#local-switch .p-inputswitch-slider')).backgroundColor, 'rgb(187, 102, 0)');
    assert('dt: body Dropdown local dark tokens react to origin changes', getComputedStyle(firstDropdown.current.getOverlay()).backgroundColor, 'rgb(34, 51, 68)');
    localColor = '#aabbcc';
    prefix = 'replacement';
    render(localScene());
    await settle();
    assert('dt: preset prefix and local tokens update together', background('local-accent'), 'rgb(170, 187, 204)');
    assert('dt: prefix replacement preserves panel refs and local scheme', getComputedStyle(firstDropdown.current.getOverlay()).backgroundColor, 'rgb(34, 51, 68)');
    assert('dt: public InputMask ref remains usable', maskInput.current.getElement() === document.getElementById('local-mask'), true);
    local = false;
    render(localScene());
    await settle();
    assert('dt: removing local tokens restores provider extension defaults', background('local-accent'), 'rgb(245, 158, 11)');
    assert('dt: removing local panel tokens restores provider dark defaults', getComputedStyle(firstDropdown.current.getOverlay()).backgroundColor, 'rgb(24, 24, 27)');
    empty();

    const selfDialog = React.createRef();

    render(
        <MantleProvider value={{ theme: { preset: Aura, options: { darkModeSelector: '.self-dark' } } }}>
            <section id="self-origin" className="self-dark">
                <Dialog id="self-local-dialog" ref={selfDialog} appendTo="self" visible onHide={() => {}} transitionOptions={{ timeout: 0 }} dt={{ mask: { background: '#112233' }, colorScheme: { dark: { mask: { background: '#445566' } } } }} />
            </section>
        </MantleProvider>
    );
    await settle();
    assert('dt: self Dialog mask consumes local dark tokens', getComputedStyle(selfDialog.current.getMask()).backgroundColor, 'rgb(68, 85, 102)');
    document.getElementById('self-origin').classList.remove('self-dark');
    await settle();
    assert('dt: self Dialog mask tracks local dark removal', getComputedStyle(selfDialog.current.getMask()).backgroundColor, 'rgb(17, 34, 51)');
    empty();

    const hydrationRoots = [];
    const hydrationErrors = [];

    const scopedHost = document.createElement('div');
    const scopedShadow = scopedHost.attachShadow({ mode: 'open' });
    const scopedRoot = createRoot(scopedShadow);

    document.body.appendChild(scopedHost);
    flushSync(() =>
        scopedRoot.render(
            <MantleProvider value={{ styleContainer: scopedShadow, nonce: 'local-nonce', theme: { preset: Aura, options: { prefix: 'shadow-dt', darkModeSelector: '.local-dark' } } }}>
                <section className="local-dark">
                    <Button id="shadow-local-button" label="Shadow" dt={{ root: { background: '#112233' }, colorScheme: { dark: { root: { background: '#445566' } } } }} />
                    <Dialog id="shadow-local-dialog" visible onHide={() => {}} transitionOptions={{ timeout: 0 }} dt={{ root: { background: '#112233' }, colorScheme: { dark: { root: { background: '#445566' } } } }} />
                </section>
            </MantleProvider>
        )
    );
    await settle();
    assert('dt: shadow component consumes local dark tokens', getComputedStyle(scopedShadow.getElementById('shadow-local-button')).backgroundColor, 'rgb(68, 85, 102)');
    await waitForElement('shadow-local-dialog');
    assert('dt: shadow-origin body portal consumes local dark tokens', background('shadow-local-dialog'), 'rgb(68, 85, 102)');
    assert('dt: shadow local sheets are mirrored into the document', document.querySelectorAll('style[data-mantle-theme-local]').length, 2);
    assert(
        'dt: local sheets preserve CSP nonce',
        [...document.querySelectorAll('style[data-mantle-theme-local]'), ...scopedShadow.querySelectorAll('style[data-mantle-theme-local]')].every((sheet) => sheet.nonce === 'local-nonce'),
        true
    );
    flushSync(() => scopedRoot.unmount());
    assert('dt: shadow unmount removes local mirrors and owned sheets', document.querySelectorAll('style[data-mantle-theme-local]').length + scopedShadow.querySelectorAll('style[data-mantle-theme-local]').length, 0);
    scopedHost.remove();

    for (const [index, identifierPrefix] of ['app.one-', 'appone-'].entries()) {
        const container = document.createElement('div');
        const scene = (
            <MantleProvider value={{ theme: { preset: buttonPreset(index ? '#445566' : '#112233') } }}>
                <Button id={`prefix-${index}`} label="Root" dt={{ root: { borderRadius: index ? '9px' : '7px' } }} />
            </MantleProvider>
        );

        document.body.appendChild(container);
        container.innerHTML = renderToString(scene, { identifierPrefix });
        const button = container.querySelector('button');
        const scopeBefore = button.getAttribute('data-mantle-theme-scope');
        const instanceBefore = button.getAttribute('data-mantle-theme-instance');
        const hydrated = hydrateRoot(container, scene, { identifierPrefix, onRecoverableError: (error) => hydrationErrors.push(error.message) });

        await settle();
        assert(`5: ${identifierPrefix} hydration retains provider identifier`, button.getAttribute('data-mantle-theme-scope'), scopeBefore);
        assert(`5: ${identifierPrefix} hydration retains local identifier`, button.getAttribute('data-mantle-theme-instance'), instanceBefore);
        assert(`5: ${identifierPrefix} independent root consumes its own tokens`, background(`prefix-${index}`), index ? 'rgb(68, 85, 102)' : 'rgb(17, 34, 51)');
        assert(`dt: ${identifierPrefix} hydrated local geometry applies`, getComputedStyle(button).borderRadius, index ? '9px' : '7px');
        hydrationRoots.push({ hydrated, container });
    }

    assert('5: punctuation-distinct prefixes have different provider scopes', document.getElementById('prefix-0').getAttribute('data-mantle-theme-scope') !== document.getElementById('prefix-1').getAttribute('data-mantle-theme-scope'), true);
    assert('5: independent roots hydrate without recoverable mismatches', hydrationErrors.length, 0);
    hydrationRoots.forEach(({ hydrated, container }) => {
        flushSync(() => hydrated.unmount());
        container.remove();
    });
    flushSync(() => root.unmount());
    assert('final: all provider and local sheets are removed', document.querySelectorAll('style[data-mantle-theme], style[data-mantle-theme-local]').length, 0);
    assert('final: all Dialog/Dropdown portal parts are removed', document.querySelectorAll('.p-dialog, .p-dropdown-panel').length, 0);
};

run()
    .then(() => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: true, assertions });
    })
    .catch((error) => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, error: error.message, assertions });
    });
