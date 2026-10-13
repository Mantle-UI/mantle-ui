import * as React from 'react';
import '@testing-library/jest-dom';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { MantleContext, MantleProvider } from '../api/Api';
import { Button } from '../button/Button';
import { Dialog } from '../dialog/Dialog';
import { Dropdown } from '../dropdown/Dropdown';
import { Aura, Theme, applyPreset, definePreset, removePreset, updatePreset } from './themes';

const firstPreset = definePreset(Aura, {
    semantic: {
        colorScheme: {
            light: { overlay: { background: '#112233' }, primary: { color: '#123456' } },
            dark: { overlay: { background: '#223344' }, primary: { color: '#234567' } }
        }
    }
});
const secondPreset = definePreset(Aura, {
    semantic: {
        colorScheme: {
            light: { overlay: { background: '#445566' }, primary: { color: '#456789' } },
            dark: { overlay: { background: '#556677' }, primary: { color: '#56789a' } }
        }
    }
});

const ThemeControls = ({ capture }) => {
    const context = React.useContext(MantleContext);

    React.useEffect(() => {
        capture(context);
    }, [capture, context]);

    return null;
};

const Scene = ({ name, preset = firstPreset, options = { darkModeSelector: '.app-dark' }, capture = () => {}, dialogRef, dropdownRef, appendTo, children, cssTransition = false, visible = true }) => (
    <MantleProvider value={{ theme: { preset, options }, cssTransition }}>
        <div data-testid={name}>
            <ThemeControls capture={capture} />
            <Button label={name} />
            <Dialog id={`${name}-dialog`} ref={dialogRef} visible={visible} onHide={() => {}} appendTo={appendTo} transitionOptions={{ timeout: 0 }}>
                {children || name}
            </Dialog>
            <Dropdown id={`${name}-dropdown`} ref={dropdownRef} options={['One', 'Two']} appendTo={appendTo} transitionOptions={{ timeout: 0 }} />
        </div>
    </MantleProvider>
);

const openDropdown = (id) => fireEvent.click(document.getElementById(`${id}-dropdown`));
const getStyle = (scope) => document.querySelector(`style[data-mantle-theme="${scope}"]`);
const getScope = (root) => root.getAttribute('data-mantle-theme-scope');
const originalMatchMedia = window.matchMedia;

afterEach(() => {
    cleanup();
    removePreset();
    jest.restoreAllMocks();
    window.matchMedia = originalMatchMedia;
});

describe('provider themes across Dialog and Dropdown portals (jsdom DOM and CSS generation)', () => {
    it('isolates sibling providers without global root variables and preserves actual component refs', () => {
        const firstDialog = React.createRef();
        const secondDialog = React.createRef();
        const firstDropdown = React.createRef();
        const secondDropdown = React.createRef();
        const view = render(
            <>
                <Scene name="first" dialogRef={firstDialog} dropdownRef={firstDropdown} />
                <Scene name="second" preset={secondPreset} dialogRef={secondDialog} dropdownRef={secondDropdown} options={{ darkModeSelector: '.app-dark', prefix: 'custom' }} />
            </>
        );

        openDropdown('first');
        openDropdown('second');

        const firstRoot = firstDialog.current.getElement();
        const secondRoot = secondDialog.current.getElement();
        const firstScope = getScope(firstRoot);
        const secondScope = getScope(secondRoot);

        expect(firstScope).not.toBe(secondScope);
        expect(firstRoot).toBe(document.getElementById('first-dialog'));
        expect(firstDialog.current.getMask().parentElement).toBe(document.body);
        expect(secondDialog.current.getMask().parentElement).toBe(document.body);
        expect(firstDropdown.current.getOverlay().parentElement).toBe(document.body);
        expect(secondDropdown.current.getOverlay().parentElement).toBe(document.body);
        expect(getScope(firstDropdown.current.getElement())).toBe(firstScope);
        expect(getScope(firstDropdown.current.getOverlay())).toBe(firstScope);
        expect(getScope(secondDropdown.current.getOverlay())).toBe(secondScope);
        expect(view.getByRole('button', { name: 'first' })).toHaveAttribute('data-mantle-theme-scope', firstScope);
        expect(getStyle(firstScope)).toHaveTextContent(/\-\-mantle\-overlay\-background: #112233;/);
        expect(getStyle(secondScope)).toHaveTextContent(/\-\-custom\-overlay\-background: #445566;/);
        expect(getStyle(firstScope)).not.toHaveTextContent(/:root \{/);
        expect(getStyle(secondScope)).not.toHaveTextContent(/:root \{/);
        expect(document.querySelectorAll('style[data-mantle-theme]')).toHaveLength(2);
        expect(document.querySelectorAll('template[data-mantle-theme-origin]')).toHaveLength(4);
    });

    it('propagates live dark-class changes from the origin without a React render or sibling leakage', async () => {
        const firstDialog = React.createRef();
        const firstDropdown = React.createRef();
        const secondDialog = React.createRef();
        const secondDropdown = React.createRef();
        const view = render(
            <>
                <Scene name="first" dialogRef={firstDialog} dropdownRef={firstDropdown} />
                <Scene name="second" preset={secondPreset} dialogRef={secondDialog} dropdownRef={secondDropdown} />
            </>
        );

        openDropdown('first');
        openDropdown('second');
        view.getByTestId('first').classList.add('app-dark');

        await waitFor(() => {
            expect(firstDialog.current.getElement()).toHaveAttribute('data-mantle-color-scheme', 'dark');
            expect(firstDropdown.current.getOverlay()).toHaveAttribute('data-mantle-color-scheme', 'dark');
        });

        expect(secondDialog.current.getElement()).toHaveAttribute('data-mantle-color-scheme', 'light');
        expect(secondDropdown.current.getOverlay()).toHaveAttribute('data-mantle-color-scheme', 'light');

        view.getByTestId('first').classList.remove('app-dark');

        await waitFor(() => {
            expect(firstDialog.current.getElement()).toHaveAttribute('data-mantle-color-scheme', 'light');
            expect(firstDropdown.current.getOverlay()).toHaveAttribute('data-mantle-color-scheme', 'light');
        });
    });

    it('updates and replaces a provider preset, prefix and dark selector while keeping its sibling intact', async () => {
        let firstContext;
        const capture = (context) => (firstContext = context);
        const firstDialog = React.createRef();
        const firstDropdown = React.createRef();
        const secondDialog = React.createRef();
        const view = render(
            <>
                <Scene name="first" capture={capture} dialogRef={firstDialog} dropdownRef={firstDropdown} />
                <Scene name="second" preset={secondPreset} dialogRef={secondDialog} />
            </>
        );

        openDropdown('first');

        const firstScope = getScope(firstDialog.current.getElement());
        const siblingStyle = getStyle(getScope(secondDialog.current.getElement()));
        const siblingCss = siblingStyle.textContent;

        act(() => firstContext.setTheme({ preset: definePreset(firstPreset, { semantic: { customToken: 'orange' } }), options: { darkModeSelector: '.app-dark' } }));
        expect(getStyle(firstScope)).toHaveTextContent(/\-\-mantle\-custom\-token: orange;/);

        act(() => firstContext.setTheme({ preset: secondPreset, options: { darkModeSelector: '[data-dark="yes"]', prefix: 'new', nonce: 'theme-nonce' } }));
        view.getByTestId('first').setAttribute('data-dark', 'yes');

        await waitFor(() => expect(firstDropdown.current.getOverlay()).toHaveAttribute('data-mantle-color-scheme', 'dark'));
        expect(firstDialog.current.getElement()).toHaveAttribute('data-mantle-color-scheme', 'dark');
        expect(getStyle(firstScope)).toHaveTextContent(/\-\-new\-overlay\-background: #445566;/);
        expect(getStyle(firstScope)).not.toHaveTextContent(/\-\-mantle\-custom\-token/);
        expect(getStyle(firstScope)).toHaveAttribute('nonce', 'theme-nonce');
        expect(siblingStyle).toHaveTextContent(siblingCss, { normalizeWhitespace: false });
        expect(siblingStyle.isConnected).toBe(true);
        expect(document.querySelectorAll('style[data-mantle-theme]')).toHaveLength(2);

        view.rerender(
            <>
                <Scene name="first" preset={secondPreset} capture={capture} dialogRef={firstDialog} dropdownRef={firstDropdown} options={{ darkModeSelector: false }} />
                <Scene name="second" preset={secondPreset} dialogRef={secondDialog} />
            </>
        );

        expect(getScope(firstDialog.current.getElement())).toBe(firstScope);
        expect(firstDropdown.current.getOverlay()).toHaveAttribute('data-mantle-color-scheme', 'light');
        expect(getStyle(firstScope)).not.toHaveTextContent(/\-\-new\-/);
    });

    it('does not redirect the imperative global preset API to the last mounted provider', () => {
        applyPreset(Aura, { darkModeSelector: false });

        const view = render(<Scene name="first" />);
        const providerStyle = document.querySelector('style[data-mantle-theme]:not([data-mantle-theme="mantle-theme"])');
        const providerCss = providerStyle.textContent;

        updatePreset({ semantic: { primary: { 500: '#abcdef' } } });
        expect(document.getElementById('mantle-theme')).toHaveTextContent(/\-\-mantle\-primary\-500: #abcdef;/);
        expect(providerStyle).toHaveTextContent(providerCss, { normalizeWhitespace: false });
        expect(Theme.options.styleId).toBeUndefined();

        view.unmount();
        expect(document.getElementById('mantle-theme')).not.toBeNull();
    });

    it('propagates dark state through a nested Dropdown portal inside a Dialog', async () => {
        const dropdownRef = React.createRef();
        const view = render(
            <Scene name="first">
                <Dropdown id="nested-dropdown" ref={dropdownRef} options={['Nested']} />
            </Scene>
        );

        view.getByTestId('first').classList.add('app-dark');
        await waitFor(() => expect(document.getElementById('first-dialog')).toHaveAttribute('data-mantle-color-scheme', 'dark'));
        openDropdown('nested');
        expect(dropdownRef.current.getOverlay()).toHaveAttribute('data-mantle-color-scheme', 'dark');

        view.getByTestId('first').classList.remove('app-dark');
        await waitFor(() => expect(dropdownRef.current.getOverlay()).toHaveAttribute('data-mantle-color-scheme', 'light'));
    });

    it('supports self append targets without adding origin markers or replacing refs', () => {
        const dialogRef = React.createRef();
        const dropdownRef = React.createRef();
        const view = render(<Scene name="first" dialogRef={dialogRef} dropdownRef={dropdownRef} appendTo="self" />);

        openDropdown('first');
        expect(view.getByTestId('first').contains(dialogRef.current.getElement())).toBe(true);
        expect(dropdownRef.current.getElement().contains(dropdownRef.current.getOverlay())).toBe(true);
        expect(document.querySelector('template[data-mantle-theme-origin]')).toBeNull();
    });

    it('reapplies origin dark state when transitioned Dialog and Dropdown roots are recreated', async () => {
        const dialogRef = React.createRef();
        const dropdownRef = React.createRef();
        const view = render(<Scene name="first" dialogRef={dialogRef} dropdownRef={dropdownRef} cssTransition />);

        openDropdown('first');
        await waitFor(() => expect(dropdownRef.current.getOverlay()).not.toBeNull());

        const originalPanel = dropdownRef.current.getOverlay();
        const originalDialog = dialogRef.current.getElement();

        act(() => dropdownRef.current.hide());
        view.rerender(<Scene name="first" dialogRef={dialogRef} dropdownRef={dropdownRef} cssTransition visible={false} />);

        await waitFor(() => {
            expect(dropdownRef.current.getOverlay()).toBeNull();
            expect(dialogRef.current.getElement()).toBeNull();
        });

        view.getByTestId('first').classList.add('app-dark');
        view.rerender(<Scene name="first" dialogRef={dialogRef} dropdownRef={dropdownRef} cssTransition />);
        openDropdown('first');

        await waitFor(() => {
            expect(dialogRef.current.getElement()).toHaveAttribute('data-mantle-color-scheme', 'dark');
            expect(dropdownRef.current.getOverlay()).toHaveAttribute('data-mantle-color-scheme', 'dark');
        });

        expect(dialogRef.current.getElement()).not.toBe(originalDialog);
        expect(dropdownRef.current.getOverlay()).not.toBe(originalPanel);
        expect(document.querySelectorAll('style[data-mantle-theme]')).toHaveLength(1);
    });

    it('owns both shadow-root and document sheets for body portals and observes shadow-host dark changes', async () => {
        const host = document.createElement('div');
        const shadow = host.attachShadow({ mode: 'open' });
        const dialogRef = React.createRef();
        const dropdownRef = React.createRef();

        document.body.appendChild(host);

        const view = render(<Scene name="first" options={{ styleContainer: shadow, darkModeSelector: '.app-dark' }} dialogRef={dialogRef} dropdownRef={dropdownRef} />, { container: shadow });

        // The Dropdown's source root is in the shadow tree, so open it directly.
        fireEvent.click(dropdownRef.current.getElement());

        const themeScope = getScope(dialogRef.current.getElement());

        expect(getStyle(themeScope)).not.toBeNull();
        expect(shadow.querySelector('style[data-mantle-theme]')).not.toBeNull();
        host.classList.add('app-dark');

        await waitFor(() => expect(dialogRef.current.getElement()).toHaveAttribute('data-mantle-color-scheme', 'dark'));
        expect(dropdownRef.current.getOverlay()).toHaveAttribute('data-mantle-color-scheme', 'dark');

        view.unmount();
        expect(getStyle(themeScope)).toBeNull();
        expect(shadow.querySelector('style[data-mantle-theme]')).toBeNull();
        host.remove();
    });

    it('cleans up provider sheets, observers and media listeners in StrictMode and when the theme is removed', () => {
        const listeners = new Set();
        const mediaQuery = {
            matches: false,
            addEventListener: (event, listener) => listeners.add(listener),
            removeEventListener: (event, listener) => listeners.delete(listener)
        };
        const activeObservers = new Set();
        const OriginalObserver = window.MutationObserver;
        const disconnect = jest.spyOn(MutationObserver.prototype, 'disconnect');
        let context;
        const capture = (value) => (context = value);
        const dialogRef = React.createRef();
        const dropdownRef = React.createRef();

        window.matchMedia = () => mediaQuery;
        jest.spyOn(window, 'MutationObserver').mockImplementation((callback) => {
            const observer = new OriginalObserver(callback);
            const originalDisconnect = observer.disconnect.bind(observer);

            activeObservers.add(observer);

            observer.disconnect = () => {
                activeObservers.delete(observer);
                originalDisconnect();
            };

            return observer;
        });

        const view = render(
            <React.StrictMode>
                <Scene name="first" options={{ darkModeSelector: 'system' }} capture={capture} dialogRef={dialogRef} dropdownRef={dropdownRef} />
            </React.StrictMode>
        );

        openDropdown('first');
        expect(document.querySelectorAll('style[data-mantle-theme]')).toHaveLength(1);
        expect(listeners.size).toBe(2);

        mediaQuery.matches = true;
        act(() => listeners.forEach((listener) => listener()));
        expect(dialogRef.current.getElement()).toHaveAttribute('data-mantle-color-scheme', 'dark');
        expect(dropdownRef.current.getOverlay()).toHaveAttribute('data-mantle-color-scheme', 'dark');

        act(() => context.setUnstyled(true));
        expect(document.querySelector('style[data-mantle-theme]')).toBeNull();
        expect(dialogRef.current.getElement()).not.toHaveAttribute('data-mantle-theme-scope');
        expect(dropdownRef.current.getOverlay()).not.toHaveAttribute('data-mantle-theme-scope');
        expect(listeners.size).toBe(0);
        expect(activeObservers.size).toBe(0);

        act(() => context.setUnstyled(false));
        expect(document.querySelectorAll('style[data-mantle-theme]')).toHaveLength(1);
        act(() => context.setTheme(undefined));
        expect(document.querySelector('style[data-mantle-theme]')).toBeNull();
        expect(listeners.size).toBe(0);

        view.unmount();
        expect(document.querySelector('[data-mantle-theme-origin]')).toBeNull();
        expect(document.querySelector('.p-dialog')).toBeNull();
        expect(document.querySelector('.p-dropdown-panel')).toBeNull();
        expect(disconnect).toHaveBeenCalled();
        expect(activeObservers.size).toBe(0);
    });
});
