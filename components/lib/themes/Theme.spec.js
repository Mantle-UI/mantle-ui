import { $dt, applyPreset, Aura, createPresetCss, createThemeCss, definePreset, resolvePreset, updatePrimaryPalette } from './themes';

describe('Aura token foundation', () => {
    it('resolves primitive references for a color scheme', () => {
        const tokens = resolvePreset(Aura);

        expect(tokens['primary.color']).toBe('#10b981');
        expect(tokens['formField.borderRadius']).toBe('6px');
        expect(tokens['formField.focusBorderColor']).toBe('#10b981');
    });

    it('creates scoped CSS custom properties', () => {
        expect(createThemeCss(Aura, { selector: '.aura' })).toContain('--mantle-primary-color: #10b981;');
    });

    it('does not mutate the base preset when applying overrides', () => {
        const preset = definePreset(Aura, { semantic: { primary: { 500: '#000000' } } });

        expect(resolvePreset(preset)['primary.color']).toBe('#000000');
        expect(resolvePreset(Aura)['primary.color']).toBe('#10b981');
    });

    it('creates a light and class-selected dark theme', () => {
        const css = createPresetCss(Aura, { darkModeSelector: '.app-dark', prefix: 'p' });

        expect(css).toContain(':root {');
        expect(css).toContain('.app-dark {');
        expect(css).toContain('var(--p-button-root-background)');
    });

    it('applies and updates a preset at runtime', () => {
        applyPreset(Aura, { darkModeSelector: false });
        updatePrimaryPalette({ 500: '#000000' });

        expect(document.getElementById('mantle-theme')?.textContent).toContain('--mantle-primary-500: #000000;');
        expect($dt('primary.color').value).toBe('#000000');
    });
});
