import * as React from 'react';
import '@testing-library/jest-dom';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import postcss from 'postcss';
import { MantleProvider } from '../api/Api';
import { Card } from '../card/Card';
import { Dialog } from '../dialog/Dialog';
import { Dropdown } from '../dropdown/Dropdown';
import { MobileNav } from '../mobilenav/MobileNav';
import { SpeedDial } from '../speeddial/SpeedDial';
import { Aura, applyPreset, removePreset } from './themes';

afterEach(() => {
    cleanup();
    removePreset();
});

describe('scoped token ownership (jsdom DOM and generated CSS)', () => {
    it.each(['.theme-region', '#theme-region', '[data-theme-region]', '.theme-region, #alternate', ':is(.theme-region, #alternate)'])('emits component defaults within imperative selector %s and cleans local ownership', (selector) => {
        applyPreset(Aura, { selector, prefix: 'custom', darkModeSelector: false });
        const view = render(
            <section id="theme-region" className="theme-region" data-theme-region="">
                <Card dt={{ root: { background: '#112233' } }}>
                    <Card id="ordinary-nested-card">Ordinary</Card>
                </Card>
            </section>
        );
        const nested = document.getElementById('ordinary-nested-card');
        const matchingDefaults = [];

        postcss.parse(document.querySelector('style[data-mantle-theme="mantle-theme"]').textContent).walkRules((rule) => {
            if (rule.nodes.some((node) => node.prop === '--custom-card-root-background' && node.value === '#ffffff') && rule.selector.includes('[data-mantle-theme-root=card]')) {
                matchingDefaults.push(rule.selector);
            }
        });
        // jsdom's selector engine cannot evaluate the nested CSS4 functions;
        // actual selector matching and painting are checked in Chromium.
        expect(matchingDefaults.length).toBeGreaterThan(0);
        matchingDefaults.forEach((rule) => expect(rule).toContain(`:is(${selector})`));
        expect(nested).not.toHaveAttribute('data-mantle-theme-instance');
        view.unmount();
        expect(document.querySelector('style[data-mantle-theme-local]')).toBeNull();
    });

    it('keeps provider default prefix and system mode independent of an active global configuration', async () => {
        applyPreset(Aura, { prefix: 'global', darkModeSelector: '.app-dark' });
        const view = render(
            <MantleProvider value={{ theme: { preset: Aura } }}>
                <Card id="default-scoped-card" dt={{ root: { background: '#aabbcc' } }} />
                <section className="app-dark">
                    <Dialog id="default-scoped-dialog" visible onHide={() => {}} transitionOptions={{ timeout: 0 }} dt={{ root: { background: '#112233' } }} />
                </section>
            </MantleProvider>
        );
        const card = document.getElementById('default-scoped-card');
        const sheet = document.querySelector(`style[data-mantle-theme-local="${card.getAttribute('data-mantle-theme-instance')}"]`);

        expect(sheet).toHaveTextContent('--mantle-card-root-background: #aabbcc');
        expect(sheet).not.toHaveTextContent('--global-card-root-background');
        await waitFor(() => expect(document.getElementById('default-scoped-dialog')).toHaveAttribute('data-mantle-color-scheme', 'light'));
        view.unmount();
        expect(document.querySelector('style[data-mantle-theme-local]')).toBeNull();
    });

    it('marks mounted styled global roots for default resets and preserves internal parts', () => {
        const view = render(
            <Card id="outer-card" dt={{ root: { background: '#112233' } }}>
                <Card id="inner-card">Ordinary</Card>
            </Card>
        );

        expect(document.querySelector('[data-mantle-theme-root]')).toBeNull();
        act(() => applyPreset(Aura));
        expect(document.querySelectorAll('[data-mantle-theme-root]')).toHaveLength(2);
        expect(document.getElementById('outer-card')).toHaveAttribute('data-mantle-theme-instance');
        expect(document.getElementById('inner-card')).not.toHaveAttribute('data-mantle-theme-instance');
        expect(document.querySelector('#outer-card > .p-card-body')).not.toHaveAttribute('data-mantle-theme-root');
        act(() => removePreset());
        expect(document.querySelector('[data-mantle-theme-root]')).toBeNull();
        expect(document.querySelector('style[data-mantle-theme-local]')).toBeNull();
        view.unmount();
    });

    it.each(['provider', 'global'])('keeps SpeedDial mask and MobileNav mask with their local owner in %s mode', async (mode) => {
        const speed = React.createRef();
        const contents = (
            <section className="app-dark">
                <SpeedDial id="scoped-speed" ref={speed} mask model={[{ label: 'One' }]} dt={{ mask: { background: '#112233' } }} />
                <MobileNav id="scoped-nav" visible model={[{ label: 'One' }]} dt={{ mask: { background: '#445566' } }} />
            </section>
        );

        if (mode === 'global') {
            applyPreset(Aura, { prefix: 'audit', darkModeSelector: '.app-dark' });
        }

        const view = render(<React.StrictMode>{mode === 'global' ? contents : <MantleProvider value={{ theme: { preset: Aura, options: { prefix: 'audit', darkModeSelector: '.app-dark' } } }}>{contents}</MantleProvider>}</React.StrictMode>);

        act(() => speed.current.show());
        const speedRoot = document.getElementById('scoped-speed');
        const speedMask = document.querySelector('.p-speeddial-mask');

        expect(speedMask).toHaveAttribute('data-mantle-theme-instance', speedRoot.getAttribute('data-mantle-theme-instance'));
        await waitFor(() => expect(document.querySelector('.p-mobilenav-mask')).toHaveAttribute('data-mantle-color-scheme', 'dark'));
        const navRoot = document.getElementById('scoped-nav');
        const navMask = document.querySelector('.p-mobilenav-mask');

        expect(navMask).toHaveAttribute('data-mantle-theme-instance', navRoot.getAttribute('data-mantle-theme-instance'));
        expect(navRoot.getAttribute('data-mantle-theme-instance')).not.toBe(speedRoot.getAttribute('data-mantle-theme-instance'));
        expect(document.querySelectorAll('style[data-mantle-theme-local]')).toHaveLength(2);
        expect(document.querySelector(`style[data-mantle-theme-local="${speedRoot.getAttribute('data-mantle-theme-instance')}"]`)).toHaveTextContent('--audit-speeddial-mask-background: #112233');
        expect(document.querySelector(`style[data-mantle-theme-local="${navRoot.getAttribute('data-mantle-theme-instance')}"]`)).toHaveTextContent('--audit-mobilenav-mask-background: #445566');
        view.unmount();
        expect(document.querySelectorAll('style[data-mantle-theme-local]')).toHaveLength(0);
        expect(document.querySelector('[data-mantle-theme-origin]')).toBeNull();
    });

    it('tracks global dark selector replacement without dt and cleans observer state in StrictMode', async () => {
        const dropdown = React.createRef();

        applyPreset(Aura, { darkModeSelector: '.app-dark' });
        const view = render(
            <React.StrictMode>
                <section id="plain-origin" className="app-dark">
                    <Dropdown ref={dropdown} options={['One']} transitionOptions={{ timeout: 0 }} />
                </section>
            </React.StrictMode>
        );

        act(() => dropdown.current.show());
        await waitFor(() => expect(dropdown.current.getOverlay()).toHaveAttribute('data-mantle-color-scheme', 'dark'));
        act(() => applyPreset(Aura, { prefix: 'changed', darkModeSelector: '.changed-dark' }));
        await waitFor(() => expect(dropdown.current.getOverlay()).toHaveAttribute('data-mantle-color-scheme', 'light'));
        document.getElementById('plain-origin').classList.add('changed-dark');
        await waitFor(() => expect(dropdown.current.getOverlay()).toHaveAttribute('data-mantle-color-scheme', 'dark'));
        act(() => removePreset());
        await waitFor(() => expect(dropdown.current.getOverlay()).not.toHaveAttribute('data-mantle-color-scheme'));
        view.unmount();
        expect(document.querySelector('[data-mantle-theme-origin]')).toBeNull();
    });
});
