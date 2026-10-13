import * as React from 'react';
import '@testing-library/jest-dom';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { MantleProvider } from '../api/Api';
import { Button } from '../button/Button';
import { Dialog } from '../dialog/Dialog';
import { Aura } from './themes';

// Exercise the supported React 17 path without replacing the renderer or hooks.
jest.mock('react', () => ({ ...jest.requireActual('react'), useId: undefined }));

afterEach(cleanup);

const Scene = () => (
    <React.StrictMode>
        <MantleProvider value={{ theme: { preset: Aura, options: { prefix: 'first', darkModeSelector: '.app-dark' } }, cssTransition: false }}>
            <section className="app-dark">
                <Button id="legacy-first" label="First" />
                <Dialog id="legacy-dialog" visible onHide={() => {}} />
            </section>
        </MantleProvider>
        <MantleProvider value={{ theme: { preset: Aura, options: { prefix: 'second' } } }}>
            <Button id="legacy-second" label="Second" />
        </MantleProvider>
    </React.StrictMode>
);

describe('provider compatibility without React.useId', () => {
    it('keeps unthemed providers usable', () => {
        const view = render(
            <MantleProvider>
                <Button label="Unthemed" />
            </MantleProvider>
        );

        expect(view.getByRole('button')).not.toHaveAttribute('data-mantle-theme-scope');
        expect(document.querySelector('style[data-mantle-theme]')).toBeNull();
    });

    it('hydrates without an ID mismatch, then isolates sibling scopes and cleans up portals', async () => {
        const container = document.createElement('div');
        const errors = [];

        container.innerHTML = renderToString(<Scene />);
        document.body.appendChild(container);
        expect(container.innerHTML).not.toContain('data-mantle-theme-scope');
        let root;

        await act(async () => {
            root = hydrateRoot(container, <Scene />, { onRecoverableError: (error) => errors.push(error) });
        });
        await waitFor(() => expect(document.getElementById('legacy-dialog')).toHaveAttribute('data-mantle-color-scheme', 'dark'));
        const first = document.getElementById('legacy-first').getAttribute('data-mantle-theme-scope');
        const second = document.getElementById('legacy-second').getAttribute('data-mantle-theme-scope');

        expect(first).toBeTruthy();
        expect(second).toBeTruthy();
        expect(first).not.toBe(second);
        expect(document.getElementById('legacy-dialog')).toHaveAttribute('data-mantle-theme-scope', first);
        expect(document.querySelectorAll('style[data-mantle-theme]')).toHaveLength(2);
        expect(errors).toEqual([]);
        act(() => root.unmount());
        expect(document.querySelector('style[data-mantle-theme]')).toBeNull();
        expect(document.getElementById('legacy-dialog')).toBeNull();
        container.remove();
    });
});
