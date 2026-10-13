import * as React from 'react';
import '@testing-library/jest-dom';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { MantleContext, MantleProvider } from '../api/Api';
import { Button } from '../button/Button';
import { Dialog } from '../dialog/Dialog';
import { Dropdown } from '../dropdown/Dropdown';
import { Aura, createPresetCss, definePreset, resolvePreset } from './themes';

afterEach(cleanup);

const overridden = definePreset(Aura, { components: { button: { root: { background: '#abcdef' } } } });

const Capture = ({ capture }) => {
    capture(React.useContext(MantleContext));

    return null;
};

describe('independent theme review regressions', () => {
    it('preserves runtime updates through equivalent inline configurations and accepts real replacements and explicit revisions', () => {
        let context;
        const capture = (value) => (context = value);
        const Scene = ({ preset = Aura, revision = 0, count = 0 }) => (
            <MantleProvider themeRevision={revision} value={{ theme: { preset, options: { prefix: 'review' } } }}>
                <Capture capture={capture} />
                <Button label={`${count}`} />
            </MantleProvider>
        );
        const view = render(<Scene />);

        act(() => context.setTheme({ preset: overridden, options: { prefix: 'runtime' } }));
        view.rerender(<Scene count={1} />);
        expect(context.theme.preset).toBe(overridden);
        expect(context.theme.options.prefix).toBe('runtime');
        view.rerender(<Scene preset={overridden} count={2} />);
        expect(context.theme.options.prefix).toBe('review');
        act(() => context.setTheme({ preset: Aura }));
        view.rerender(<Scene preset={overridden} revision={1} />);
        expect(context.theme.preset).toBe(overridden);
    });

    it('uses controlled props as authoritative and emits one requested update', () => {
        let context;
        const changes = jest.fn();
        const view = render(
            <MantleProvider themeMode="controlled" onThemeChange={changes} value={{ theme: { preset: Aura } }}>
                <Capture capture={(value) => (context = value)} />
            </MantleProvider>
        );
        const updater = jest.fn(() => ({ preset: overridden }));

        act(() => context.setTheme(updater));
        expect(updater).toHaveBeenCalledTimes(1);
        expect(changes).toHaveBeenCalledWith({ preset: overridden });
        expect(context.theme.preset).toBe(Aura);
        view.rerender(
            <MantleProvider themeMode="controlled" onThemeChange={changes} value={{ theme: { preset: overridden } }}>
                <Capture capture={(value) => (context = value)} />
            </MantleProvider>
        );
        expect(context.theme.preset).toBe(overridden);
    });

    it('does not collapse punctuation in independent SSR identifier prefixes', () => {
        const scene = (
            <MantleProvider value={{ theme: { preset: Aura } }}>
                <Button label="Root" />
            </MantleProvider>
        );
        const scope = (prefix) => renderToString(scene, { identifierPrefix: prefix }).match(/data-mantle-theme-scope="([^"]+)"/)[1];

        expect(scope('app.one-')).not.toBe(scope('appone-'));
        expect(scope('app.one-')).toBe(scope('app.one-'));
    });

    it('composes custom CSS without replacing Aura or duplicating repeated composition', () => {
        const extra = '.review-custom { color: red; }';
        const first = definePreset(Aura, { css: extra });
        const second = definePreset(first, { css: extra });
        const css = createPresetCss(second);

        expect(css).toContain('var(--mantle-button-root-background)');
        expect(css.match(/\.review-custom/g)).toHaveLength(1);
        expect(css.match(/--surface-card: var/g)).toHaveLength(1);
    });

    it('flattens extension tokens and executes component/global CSS callbacks with a prefixed dt accessor', () => {
        const componentCss = jest.fn(({ dt }) => `.review-accent { color: ${dt('button.accent.color')}; transition-duration: ${dt('my.transition.fast')}; }`);
        const globalCss = jest.fn(({ dt }) => `.review-global { width: ${dt('my.width')}; }`);
        const preset = definePreset(Aura, { extend: { my: { width: '10px', transition: { fast: '0.2s' } } }, components: { button: { extend: { accent: { color: '#123456' } }, css: componentCss } }, css: globalCss });
        const tokens = resolvePreset(preset);
        const css = createPresetCss(preset, { prefix: 'custom' });

        expect(tokens['my.width']).toBe('10px');
        expect(tokens['button.accent.color']).toBe('#123456');
        expect(Object.keys(tokens).some((path) => path.includes('.extend.') || path.endsWith('.css'))).toBe(false);
        expect(css).toContain('var(--custom-button-accent-color)');
        expect(css).toContain('var(--custom-my-transition-fast)');
        expect(css).toContain('var(--custom-my-width)');
        expect(componentCss).toHaveBeenCalledTimes(1);
        expect(globalCss).toHaveBeenCalledTimes(1);
    });

    it('declares structural/theme ordering before creating a configurable theme layer', () => {
        const css = createPresetCss(Aura, { cssLayer: { name: 'review' } });

        expect(css.startsWith('@layer primereact, review;\n@layer review {')).toBe(true);
    });

    it('keeps dt off DOM props, gives two instances independent sheets, updates and cleans up in StrictMode', () => {
        const Scene = ({ color = '#112233', local = true }) => (
            <React.StrictMode>
                <MantleProvider value={{ theme: { preset: Aura } }}>
                    <Button label="First" dt={local ? { root: { background: color } } : undefined} />
                    <Button label="Second" dt={{ root: { background: '#445566' } }} />
                    <Button label="Default" />
                </MantleProvider>
            </React.StrictMode>
        );
        const view = render(<Scene />);
        const first = view.getByRole('button', { name: 'First' });
        const second = view.getByRole('button', { name: 'Second' });

        expect(first).not.toHaveAttribute('dt');
        expect(first.getAttribute('data-mantle-theme-instance')).not.toBe(second.getAttribute('data-mantle-theme-instance'));
        expect(view.getByRole('button', { name: 'Default' })).not.toHaveAttribute('data-mantle-theme-instance');
        expect(document.querySelectorAll('style[data-mantle-theme-local]')).toHaveLength(2);
        view.rerender(<Scene color="#abcdef" />);
        expect(document.querySelector(`style[data-mantle-theme-local="${first.getAttribute('data-mantle-theme-instance')}"]`)).toHaveTextContent('--mantle-button-root-background: #abcdef');
        view.rerender(<Scene local={false} />);
        expect(first).not.toHaveAttribute('data-mantle-theme-instance');
        expect(document.querySelectorAll('style[data-mantle-theme-local]')).toHaveLength(1);
        view.unmount();
        expect(document.querySelector('style[data-mantle-theme-local]')).toBeNull();
    });

    it('propagates owning dt instances to Dialog mask and Dropdown panel without adopting a parent Dialog instance', async () => {
        const dropdown = React.createRef();
        const view = render(
            <MantleProvider value={{ theme: { preset: Aura }, cssTransition: false }}>
                <Dialog id="local-dialog" visible onHide={() => {}} dt={{ root: { background: '#112233' } }}>
                    <Dialog id="nested-default-dialog" visible onHide={() => {}} />
                </Dialog>
                <Dropdown ref={dropdown} options={['One']} dt={{ panel: { background: '#445566' } }} />
            </MantleProvider>
        );

        act(() => dropdown.current.show());
        await waitFor(() => expect(dropdown.current.getOverlay()).toHaveAttribute('data-mantle-theme-instance'));
        const dialog = document.getElementById('local-dialog');

        expect(dialog.parentElement).toHaveAttribute('data-mantle-theme-instance', dialog.getAttribute('data-mantle-theme-instance'));
        expect(dropdown.current.getOverlay()).toHaveAttribute('data-mantle-theme-instance', dropdown.current.getElement().getAttribute('data-mantle-theme-instance'));
        expect(document.getElementById('nested-default-dialog')).not.toHaveAttribute('data-mantle-theme-instance');
        view.unmount();
        expect(document.querySelector('style[data-mantle-theme-local]')).toBeNull();
    });
});
