export interface MantleThemePreset {
    primitive?: Record<string, unknown>;
    semantic?: Record<string, unknown>;
    components?: Record<string, unknown>;
    css?: string | ((options: { prefix: string; selector?: string; colorScheme?: 'light' | 'dark' }) => string);
}

export interface MantleThemeOptions {
    prefix?: string;
    darkModeSelector?: string | false;
    selector?: string;
    cssLayer?: boolean | { name?: string };
    styleContainer?: HTMLElement;
}

export interface DesignToken {
    name: string;
    variable: string;
    value: string | undefined;
}

export declare const Aura: MantleThemePreset;

export declare function definePreset(basePreset?: MantleThemePreset, overrides?: MantleThemePreset): MantleThemePreset;
export declare function resolvePreset(preset: MantleThemePreset, colorScheme?: 'light' | 'dark'): Record<string, string>;
export declare function createThemeCss(preset: MantleThemePreset, options?: { colorScheme?: 'light' | 'dark'; prefix?: string; selector?: string }): string;
export declare function createPresetCss(preset: MantleThemePreset, options?: MantleThemeOptions): string;
export declare function applyPreset(preset: MantleThemePreset, options?: MantleThemeOptions): MantleThemePreset;
export declare function usePreset(preset: MantleThemePreset, options?: MantleThemeOptions): MantleThemePreset;
export declare function updatePreset(overrides: MantleThemePreset): MantleThemePreset;
export declare function updatePrimaryPalette(palette: Record<string, string>): MantleThemePreset;
export declare function updateSurfacePalette(palette: Record<string, string>, colorScheme?: 'light' | 'dark'): MantleThemePreset;
export declare function $dt(path: string, fallback?: string): DesignToken;
export declare const Theme: {
    readonly preset: MantleThemePreset | undefined;
    readonly options: MantleThemeOptions;
    subscribe(listener: (theme: { preset: MantleThemePreset; options: MantleThemeOptions }) => void): () => void;
};
