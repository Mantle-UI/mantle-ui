import * as React from 'react';
import { flushSync } from 'react-dom';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { MantleContext, MantleProvider } from '../../components/lib/api/Api';
import { Dialog } from '../../components/lib/dialog/Dialog';
import { Dropdown } from '../../components/lib/dropdown/Dropdown';
import { InputNumber } from '../../components/lib/inputnumber/InputNumber';
import { Aura, definePreset } from '../../components/lib/themes/themes';

const assertions = [];
const errors = [];
const refs = { first: React.createRef(), second: React.createRef() };
const contexts = {};
const firstTheme = { preset: definePreset(Aura, { semantic: { colorScheme: { light: { overlay: { background: '#112233' } }, dark: { overlay: { background: '#223344' } } } } }), options: { prefix: 'server', darkModeSelector: '.app-dark' } };
const secondTheme = { preset: definePreset(Aura, { semantic: { colorScheme: { light: { overlay: { background: '#445566' } } } } }), options: { prefix: 'sibling', darkModeSelector: false } };

const Controls = ({ name }) => {
    contexts[name] = React.useContext(MantleContext);

    return null;
};

const Scene = () => (
    <>
        {['first', 'second'].map((name) => (
            <MantleProvider key={name} value={{ theme: name === 'first' ? firstTheme : secondTheme }}>
                <section id={`${name}-server-origin`} className={name === 'first' ? 'app-dark' : ''}>
                    <Controls name={name} />
                    <InputNumber id={`${name}-server-number`} value={1} />
                    <Dropdown id={`${name}-server-dropdown`} ref={refs[name]} options={['One']} transitionOptions={{ timeout: 0 }} />
                    <Dialog id={`${name}-server-dialog`} visible header="Hydrated dialog" onHide={() => {}} transitionOptions={{ timeout: 0 }} />
                </section>
            </MantleProvider>
        ))}
    </>
);
const settle = () => new Promise((resolve) => setTimeout(resolve, 120));

const assert = (name, actual, expected) => {
    assertions.push({ name, actual, expected, passed: actual === expected });

    if (actual !== expected) {
        throw new Error(`${name}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
    }
};

const run = async () => {
    const app = document.getElementById('app');

    app.innerHTML = renderToString(<Scene />, { identifierPrefix: 'hydrate-' });
    const scopesBefore = ['first', 'second'].map((name) => document.getElementById(`${name}-server-dropdown`).getAttribute('data-mantle-theme-scope'));

    assert('server render creates no provider style nodes', document.querySelectorAll('style[data-mantle-theme]').length, 0);
    assert('server render assigns distinct sibling scopes', scopesBefore[0] !== scopesBefore[1], true);
    const root = hydrateRoot(app, <Scene />, { identifierPrefix: 'hydrate-', onRecoverableError: (error) => errors.push(error.message) });

    await settle();
    ['first', 'second'].forEach((name, index) => {
        assert(`${name}: hydration preserves server scope`, document.getElementById(`${name}-server-dropdown`).getAttribute('data-mantle-theme-scope'), scopesBefore[index]);
        assert(`${name}: creates exactly one owned theme sheet`, document.querySelectorAll(`style[data-mantle-theme="${scopesBefore[index]}"]`).length, 1);
        flushSync(() => refs[name].current.show());
    });
    await settle();
    assert('hydration reports no recoverable mismatch', errors.length, 0);
    assert('hydrated first dialog consumes originating dark theme', getComputedStyle(document.getElementById('first-server-dialog')).backgroundColor, 'rgb(34, 51, 68)');
    assert('hydrated sibling dialog remains light', getComputedStyle(document.getElementById('second-server-dialog')).backgroundColor, 'rgb(68, 85, 102)');
    assert('hydrated dropdown panel consumes dark theme', getComputedStyle(refs.first.current.getOverlay()).backgroundColor, 'rgb(34, 51, 68)');
    document.getElementById('first-server-origin').classList.remove('app-dark');
    await settle();
    assert('hydrated portal follows live origin class', getComputedStyle(document.getElementById('first-server-dialog')).backgroundColor, 'rgb(17, 34, 51)');
    flushSync(() => contexts.first.setTheme({ preset: definePreset(firstTheme.preset, { components: { dialog: { root: { background: '#abcdef' } } } }), options: { prefix: 'replacement', darkModeSelector: '.app-dark' } }));
    await settle();
    assert('hydrated portal consumes runtime component/prefix replacement', getComputedStyle(document.getElementById('first-server-dialog')).backgroundColor, 'rgb(171, 205, 239)');
    flushSync(() => root.unmount());
    assert('hydration unmount removes provider sheets', document.querySelectorAll('style[data-mantle-theme]').length, 0);
    assert('hydration unmount removes portal roots', document.querySelectorAll('.p-dialog, .p-dropdown-panel').length, 0);
};

run()
    .then(() => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: true, assertions });
    })
    .catch((error) => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, error: error.message, assertions });
    });
