export interface MantleThemeCssContext {
    prefix: string;
    selector?: string;
    colorScheme?: 'light' | 'dark';
    /** Returns a CSS var() reference, respecting the configured prefix. */
    dt(path: string, fallback?: string): string;
}

export type MantleThemeCss = string | ((options: MantleThemeCssContext) => string);

export interface MantleComponentTokens {
    colorScheme?: { light?: Record<string, unknown>; dark?: Record<string, unknown> };
    extend?: Record<string, unknown>;
    css?: MantleThemeCss;
    [key: string]: unknown;
}

export interface ComponentThemeProps {
    /** Component-only token overrides, scoped to this instance and its portal parts. Requires a token preset. */
    dt?: MantleComponentTokens;
}

export interface MantleThemePreset {
    primitive?: Record<string, unknown>;
    semantic?: Record<string, unknown>;
    components?: Record<string, MantleComponentTokens>;
    extend?: Record<string, unknown>;
    /** Composed with inherited consuming CSS when using definePreset. */
    css?: MantleThemeCss;
}

export interface MantleThemeOptions {
    prefix?: string;
    darkModeSelector?: string | false;
    /** Selector used by imperative theme CSS APIs. MantleProvider owns its component scope automatically. */
    selector?: string;
    cssLayer?: boolean | { name?: string };
    styleContainer?: HTMLElement | ShadowRoot;
    /** Identifier for the generated style element. */
    styleId?: string;
    /** CSP nonce assigned to the generated style element. */
    nonce?: string;
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
export declare function createComponentThemeCss(preset: MantleThemePreset, name: string, tokens: MantleComponentTokens, options?: MantleThemeOptions & { colorScheme?: 'light' | 'dark'; ownerSelector?: string }): string;
export declare function applyPreset(preset: MantleThemePreset, options?: MantleThemeOptions): MantleThemePreset;
export declare function usePreset(preset: MantleThemePreset, options?: MantleThemeOptions): MantleThemePreset;
export declare function removePreset(options?: Pick<MantleThemeOptions, 'styleContainer' | 'styleId'>): void;
export declare function updatePreset(overrides: MantleThemePreset): MantleThemePreset;
export declare function updatePrimaryPalette(palette: Record<string, string>): MantleThemePreset;
export declare function updateSurfacePalette(palette: Record<string, string>, colorScheme?: 'light' | 'dark'): MantleThemePreset;
export declare function $dt(path: string, fallback?: string): DesignToken;
export declare const Theme: {
    readonly preset: MantleThemePreset | undefined;
    readonly options: MantleThemeOptions;
    subscribe(listener: (theme: { preset: MantleThemePreset; options: MantleThemeOptions }) => void): () => void;
};
