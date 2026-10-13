import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { MantleContext, MantleProvider } from '../../components/lib/api/Api';
import { Button } from '../../components/lib/button/Button';
import { Dialog } from '../../components/lib/dialog/Dialog';
import { Dropdown } from '../../components/lib/dropdown/Dropdown';
import { Aura, definePreset } from '../../components/lib/themes/themes';

const results = [];
const contexts = {};
const refs = {
    first: { dialog: React.createRef(), dropdown: React.createRef() },
    second: { dialog: React.createRef(), dropdown: React.createRef() }
};
const preset = (light, dark, primary) =>
    definePreset(Aura, {
        semantic: {
            colorScheme: {
                light: { overlay: { background: light }, primary: { color: primary } },
                dark: { overlay: { background: dark }, primary: { color: primary } }
            }
        }
    });
const firstPreset = preset('#112233', '#223344', '#123456');
const secondPreset = preset('#445566', '#556677', '#456789');
let root = createRoot(document.getElementById('app'));
let firstTheme = { preset: firstPreset, options: { darkModeSelector: '.app-dark' } };
let themeRevision = 0;
let appendTo;
let hasSecond = true;

const Controls = ({ name }) => {
    const context = React.useContext(MantleContext);

    React.useEffect(() => {
        contexts[name] = context;
    }, [context, name]);

    return null;
};

const Scene = ({ name, theme }) => (
    <MantleProvider value={{ theme, cssTransition: false }} themeRevision={themeRevision}>
        <section id={`${name}-origin`}>
            <Controls name={name} />
            <Button id={`${name}-button`} label={name} />
            <Dialog id={`${name}-dialog`} ref={refs[name].dialog} visible onHide={() => {}} appendTo={appendTo}>
                <Button id={`${name}-dialog-button`} label="Inside dialog" />
                {name === 'first' && (
                    <MantleProvider value={{ theme: { preset: secondPreset, options: { prefix: 'nested', darkModeSelector: false } } }}>
                        <Button id="nested-button" label="Nested theme" />
                    </MantleProvider>
                )}
            </Dialog>
            <Dropdown id={`${name}-dropdown`} ref={refs[name].dropdown} options={['One', 'Two']} appendTo={appendTo} />
        </section>
    </MantleProvider>
);

const renderScenes = () =>
    flushSync(() => {
        root.render(
            <React.StrictMode>
                <Scene name="first" theme={firstTheme} />
                {hasSecond && <Scene name="second" theme={{ preset: secondPreset, options: { prefix: 'custom', darkModeSelector: '.app-dark' } }} />}
            </React.StrictMode>
        );
    });

const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

const assert = (name, actual, expected) => {
    results.push({ name, actual, expected, passed: actual === expected });

    if (actual !== expected) {
        throw new Error(`${name}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
    }
};

const background = (element) => getComputedStyle(element).backgroundColor;
const element = (id) => document.getElementById(id);
const overlay = (name) => refs[name].dropdown.current.getOverlay();
const scope = (name) => element(`${name}-dialog`).getAttribute('data-mantle-theme-scope');

const openDropdowns = () => {
    flushSync(() => element('first-dropdown').click());

    if (hasSecond) {
        flushSync(() => element('second-dropdown').click());
    }
};

const run = async () => {
    renderScenes();
    await settle();
    openDropdowns();
    await settle();

    assert('dialog ref points to real root', refs.first.dialog.current.getElement() === element('first-dialog'), true);
    assert('dropdown ref points to body panel', overlay('first').parentElement === document.body, true);
    assert('dialog mask is body-portaled', refs.first.dialog.current.getMask().parentElement === document.body, true);
    assert('providers have different scopes', scope('first') !== scope('second'), true);
    assert('global root has no provider tokens', getComputedStyle(document.documentElement).getPropertyValue('--mantle-primary-color'), '');
    assert('first light dialog', background(element('first-dialog')), 'rgb(17, 34, 51)');
    assert('second light dialog with custom prefix', background(element('second-dialog')), 'rgb(68, 85, 102)');
    assert('first light dropdown', background(overlay('first')), 'rgb(17, 34, 51)');
    assert('second light dropdown with custom prefix', background(overlay('second')), 'rgb(68, 85, 102)');
    assert('first button', background(element('first-button')), 'rgb(18, 52, 86)');
    assert('second button with custom prefix', background(element('second-button')), 'rgb(69, 103, 137)');
    assert('button inside body dialog', background(element('first-dialog-button')), 'rgb(18, 52, 86)');
    assert('nested prefix does not get outer component declarations', background(element('nested-button')), 'rgb(69, 103, 137)');
    assert('origin marker has no layout box', document.querySelector('template[data-mantle-theme-origin]').getBoundingClientRect().width, 0);

    element('first-button').classList.add('app-dark');
    assert('dark selector can match a component root itself', getComputedStyle(element('first-button')).getPropertyValue('--mantle-overlay-background').trim(), '#223344');
    element('first-button').classList.remove('app-dark');

    element('first-origin').classList.add('app-dark');
    await settle();
    assert('live local dark class reaches dialog', background(element('first-dialog')), 'rgb(34, 51, 68)');
    assert('live local dark class reaches dropdown', background(overlay('first')), 'rgb(34, 51, 68)');
    assert('sibling dialog remains light', background(element('second-dialog')), 'rgb(68, 85, 102)');
    assert('sibling dropdown remains light', background(overlay('second')), 'rgb(68, 85, 102)');
    assert('nested disabled-dark provider stays light', getComputedStyle(element('nested-button')).getPropertyValue('--nested-overlay-background').trim(), '#445566');

    element('first-origin').classList.remove('app-dark');
    await settle();
    assert('dark removal restores dialog', background(element('first-dialog')), 'rgb(17, 34, 51)');
    assert('dark removal restores dropdown', background(overlay('first')), 'rgb(17, 34, 51)');

    flushSync(() => contexts.first.setTheme({ preset: preset('#abcdef', '#fedcba', '#aabbcc'), options: { prefix: 'runtime', darkModeSelector: '.app-dark' } }));
    await settle();
    assert('runtime theme updates dialog', background(element('first-dialog')), 'rgb(171, 205, 239)');
    assert('runtime theme updates dropdown', background(overlay('first')), 'rgb(171, 205, 239)');
    assert('runtime prefix updates regular button', background(element('first-button')), 'rgb(170, 187, 204)');
    assert('runtime prefix updates portaled child', background(element('first-dialog-button')), 'rgb(170, 187, 204)');
    assert('runtime update leaves sibling unchanged', background(element('second-dialog')), 'rgb(68, 85, 102)');

    firstTheme = { preset: firstPreset, options: { darkModeSelector: '.app-dark' } };
    themeRevision++;
    appendTo = document.createElement('div');
    appendTo.className = 'app-dark';
    document.body.appendChild(appendTo);
    renderScenes();
    await settle();
    assert('replacement prop theme restores dialog', background(element('first-dialog')), 'rgb(17, 34, 51)');
    assert('dark destination cannot override light origin', background(overlay('first')), 'rgb(17, 34, 51)');
    assert('replacement removes previous prefix variables', getComputedStyle(element('first-dialog')).getPropertyValue('--runtime-overlay-background'), '');
    assert('custom target keeps actual ref', refs.first.dialog.current.getMask().parentElement === appendTo, true);

    element('first-origin').classList.add('app-dark');
    await settle();
    assert('custom target still tracks local dark class', background(overlay('first')), 'rgb(34, 51, 68)');

    const secondScope = scope('second');

    hasSecond = false;
    renderScenes();
    await settle();
    assert('sibling unmount removes only its stylesheet', document.querySelector(`style[data-mantle-theme="${secondScope}"]`) === null, true);
    assert('remaining theme survives sibling unmount', background(element('first-dialog')), 'rgb(34, 51, 68)');

    flushSync(() => root.unmount());
    assert('StrictMode unmount removes all provider sheets', document.querySelectorAll('style[data-mantle-theme]').length, 0);
    assert('unmount removes all portal roots', document.querySelectorAll('.p-dialog, .p-dropdown-panel').length, 0);
    assert('unmount removes all origin markers', document.querySelectorAll('[data-mantle-theme-origin]').length, 0);
    appendTo.remove();

    const shadowHost = document.createElement('div');
    const shadow = shadowHost.attachShadow({ mode: 'open' });

    document.body.appendChild(shadowHost);
    appendTo = undefined;
    root = createRoot(shadow);
    firstTheme = { preset: firstPreset, options: { styleContainer: shadow, darkModeSelector: '.app-dark' } };
    renderScenes();
    await settle();
    flushSync(() => refs.first.dropdown.current.getElement().click());
    await settle();
    assert('shadow provider styles body Dialog', background(element('first-dialog')), 'rgb(17, 34, 51)');
    assert('shadow provider styles body Dropdown', background(overlay('first')), 'rgb(17, 34, 51)');
    assert('shadow provider styles its regular Button', background(shadow.getElementById('first-button')), 'rgb(18, 52, 86)');

    shadowHost.classList.add('app-dark');
    await settle();
    assert('shadow-host dark class reaches body Dialog', background(element('first-dialog')), 'rgb(34, 51, 68)');
    assert('shadow-host dark class reaches body Dropdown', background(overlay('first')), 'rgb(34, 51, 68)');

    flushSync(() => root.unmount());
    assert('shadow unmount removes shadow theme sheets', shadow.querySelectorAll('style[data-mantle-theme]').length, 0);
    assert('shadow unmount removes document theme sheets', document.querySelectorAll('style[data-mantle-theme]').length, 0);
    shadowHost.remove();
};

run()
    .then(() => {
        element('portal-theme-test-results').textContent = JSON.stringify({ passed: true, assertions: results });
    })
    .catch((error) => {
        element('portal-theme-test-results').textContent = JSON.stringify({ passed: false, error: error.message, assertions: results });
    });
