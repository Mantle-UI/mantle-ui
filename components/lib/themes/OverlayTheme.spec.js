import * as React from 'react';
import '@testing-library/jest-dom';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import { OverlayFixture, overlayCases, overlayPreset, sourceEvent } from '../../../scripts/fixtures/overlay-cases';
import { definePreset } from './themes';

afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
});

describe('all overlay theme adoption (jsdom DOM and CSS generation)', () => {
    it.each(overlayCases)('$name carries origin state, updates tokens and cleans up', async (testCase) => {
        const activeObservers = new Set();
        const OriginalObserver = window.MutationObserver;

        jest.spyOn(window, 'MutationObserver').mockImplementation((callback) => {
            const observer = new OriginalObserver(callback);
            const disconnect = observer.disconnect.bind(observer);

            activeObservers.add(observer);

            observer.disconnect = () => {
                activeObservers.delete(observer);
                disconnect();
            };

            return observer;
        });

        const api = React.createRef();
        let context;
        const capture = (value) => (context = value);
        const view = render(
            <React.StrictMode>
                <OverlayFixture testCase={testCase} api={api} capture={capture} />
            </React.StrictMode>
        );
        const origin = document.getElementById('overlay-origin');
        const target = document.getElementById('overlay-trigger');

        act(() => testCase.open?.({ api, target }));

        await waitFor(() => expect(testCase.root()).toHaveAttribute('data-mantle-color-scheme', 'dark'));

        const root = testCase.root();
        const scope = root.getAttribute('data-mantle-theme-scope');

        expect(scope).toBe(context.themeScope);
        expect(origin.contains(root)).toBe(!!testCase.isSelf);

        if (testCase.extraRoot) {
            await waitFor(() => expect(testCase.extraRoot()).toHaveAttribute('data-mantle-color-scheme', 'dark'));
            expect(testCase.extraRoot()).toHaveAttribute('data-mantle-theme-scope', scope);
        }

        act(() => context.setTheme({ preset: definePreset(overlayPreset, { semantic: { customToken: '#abcdef' } }), options: { prefix: 'updated', darkModeSelector: '.app-dark' } }));
        expect(document.querySelector(`style[data-mantle-theme="${scope}"]`)).toHaveTextContent('--updated-custom-token: #abcdef;');
        expect(root).toHaveAttribute('data-mantle-color-scheme', 'dark');

        origin.classList.remove('app-dark');
        await waitFor(() => expect(root).toHaveAttribute('data-mantle-color-scheme', 'light'));

        if (testCase.extraRoot) {
            expect(testCase.extraRoot()).toHaveAttribute('data-mantle-color-scheme', 'light');
        }

        view.unmount();
        expect(root.isConnected).toBe(false);
        expect(document.querySelector(`style[data-mantle-theme="${scope}"]`)).toBeNull();
        expect(document.querySelector('[data-mantle-theme-origin]')).toBeNull();
        expect(document.querySelector('.p-datepicker-mask, .p-datatable-drag-selection-helper')).toBeNull();
        expect(activeObservers.size).toBe(0);
    });

    it('retargets an already visible Tooltip between dark and light origins', async () => {
        const testCase = overlayCases.find((entry) => entry.name === 'tooltip');
        const api = React.createRef();
        const view = render(<OverlayFixture testCase={testCase} api={api} capture={() => {}} />);
        const darkTarget = document.getElementById('overlay-trigger');
        const lightTarget = document.createElement('button');

        lightTarget.textContent = 'Light target';
        view.container.appendChild(lightTarget);
        act(() => api.current.show(sourceEvent(darkTarget)));
        await waitFor(() => expect(testCase.root()).toHaveAttribute('data-mantle-color-scheme', 'dark'));

        act(() => api.current.show(sourceEvent(lightTarget)));
        await waitFor(() => expect(testCase.root()).toHaveAttribute('data-mantle-color-scheme', 'light'));
    });

    it('uses the originating row for a direct DataTable drag helper', async () => {
        const testCase = overlayCases.find((entry) => entry.name === 'dragselection');
        const api = React.createRef();

        render(<OverlayFixture testCase={testCase} api={api} capture={() => {}} dark={false} />);
        api.current.getElement().querySelector('tbody tr').classList.add('app-dark');
        act(() => testCase.open({ api }));
        await waitFor(() => expect(testCase.root()).toHaveAttribute('data-mantle-color-scheme', 'dark'));
    });
});
