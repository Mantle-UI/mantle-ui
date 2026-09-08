import { $dt, applyPreset, Aura, createPresetCss, createThemeCss, definePreset, resolvePreset, updatePrimaryPalette } from './themes';

describe('Aura token foundation', () => {
    it('resolves primitive references for a color scheme', () => {
        const tokens = resolvePreset(Aura);

        expect(tokens['primary.color']).toBe('#10b981');
        expect(tokens['formField.borderRadius']).toBe('6px');
        expect(tokens['formField.focusBorderColor']).toBe('#10b981');
        expect(tokens['selectButton.button.selectedBackground']).toBe('#10b981');
        expect(tokens['toggleButton.root.selectedHoverBackground']).toBe('#059669');
        expect(tokens['checkbox.root.checkedBackground']).toBe('#10b981');
        expect(tokens['inputswitch.root.handleBackground']).toBe('#ffffff');
        expect(tokens['inputtext.root.filledBackground']).toBe('#f1f5f9');
        expect(tokens['dropdown.panel.background']).toBe('#ffffff');
        expect(resolvePreset(Aura, 'dark')['formField.borderColor']).toBe('#52525b');
        expect(resolvePreset(Aura, 'dark')['inputtext.root.filledBackground']).toBe('#27272a');
        expect(resolvePreset(Aura, 'dark')['dropdown.panel.background']).toBe('#18181b');
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
        expect(css).toContain('.p-selectbutton.p-button-group.p-component > .p-button.p-highlight');
        expect(css).toContain('var(--p-select-button-button-selected-background)');
        expect(css).toContain('var(--p-toggle-button-root-selected-background)');
        expect(css).toContain('.p-button.p-button-link');
        expect(css).toContain('--p-button-danger-background');
        expect(css).toContain('.p-checkbox .p-checkbox-box');
        expect(css).toContain('.p-inputswitch .p-inputswitch-slider');
        expect(css).toContain('var(--p-checkbox-root-checked-background)');
        expect(css).toContain('var(--p-inputswitch-root-checked-background)');
        expect(css).toContain('var(--p-inputtext-root-filled-background)');
        expect(css).toContain('var(--p-dropdown-panel-background)');
        expect(css).toContain('var(--p-dropdown-option-selected-background)');
    });

    it('applies and updates a preset at runtime', () => {
        applyPreset(Aura, { darkModeSelector: false });
        updatePrimaryPalette({ 500: '#000000' });

        expect(document.getElementById('mantle-theme')?.textContent).toContain('--mantle-primary-500: #000000;');
        expect($dt('primary.color').value).toBe('#000000');
    });
});
