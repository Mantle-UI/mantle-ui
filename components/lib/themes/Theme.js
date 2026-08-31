const tokenReferencePattern = /\{([^}]+)\}/g;

let activePreset;
let activeOptions = {};
const subscribers = new Set();

const toKebabCase = (value) =>
    value
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replaceAll('.', '-')
        .toLowerCase();

const flattenTokens = (tokens, path = [], output = {}) => {
    Object.entries(tokens || {}).forEach(([key, value]) => {
        const tokenPath = [...path, key];

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            flattenTokens(value, tokenPath, output);
        } else {
            output[tokenPath.join('.')] = value;
        }
    });

    return output;
};

const mergeTokens = (base, override) => {
    if (!override || typeof override !== 'object' || Array.isArray(override)) {
        return override === undefined ? base : override;
    }

    return Object.keys({ ...base, ...override }).reduce((result, key) => {
        result[key] = mergeTokens(base?.[key], override[key]);

        return result;
    }, {});
};

const resolveTokens = (tokens) => {
    const flatTokens = flattenTokens(tokens);

    const resolveValue = (value, resolving = []) => {
        if (typeof value !== 'string') {
            return value;
        }

        return value.replace(tokenReferencePattern, (_, reference) => {
            if (!flatTokens.hasOwnProperty(reference) || resolving.includes(reference)) {
                return `{${reference}}`;
            }

            return resolveValue(flatTokens[reference], [...resolving, reference]);
        });
    };

    return Object.fromEntries(Object.entries(flatTokens).map(([key, value]) => [key, resolveValue(value, [key])]));
};

const toCssVariables = (tokens, prefix = 'mantle') => {
    return Object.entries(resolveTokens(tokens))
        .map(([key, value]) => `    --${prefix}-${toKebabCase(key)}: ${value};`)
        .join('\n');
};

const createCssRule = (selector, tokens, prefix) => `${selector} {\n${toCssVariables(tokens, prefix)}\n}`;

const getDarkSelector = (darkModeSelector) => {
    if (darkModeSelector === false) {
        return undefined;
    }

    return darkModeSelector || 'system';
};

const getThemeStyleElement = (document) => document.getElementById('mantle-theme');

const notify = () => subscribers.forEach((listener) => listener({ preset: activePreset, options: activeOptions }));

/**
 * Merges a base preset with overrides without mutating either input.
 */
export const definePreset = (basePreset = {}, overrides = {}) => {
    return mergeTokens(basePreset, overrides);
};

/**
 * Resolves a preset's token references for one color scheme.
 */
export const resolvePreset = (preset, colorScheme = 'light') => {
    const { primitive = {}, semantic = {}, components = {} } = preset;
    const { colorScheme: colorSchemes = {}, ...sharedSemantic } = semantic;

    return resolveTokens(
        mergeTokens(
            mergeTokens(
                {
                    ...primitive,
                    ...sharedSemantic
                },
                components
            ),
            colorSchemes[colorScheme] || {}
        )
    );
};

/**
 * Produces scoped CSS custom properties from a Mantle token preset.
 */
export const createThemeCss = (preset, { colorScheme = 'light', prefix = 'mantle', selector = ':root' } = {}) => {
    return `${selector} {\n${toCssVariables(resolvePreset(preset, colorScheme), prefix)}\n}`;
};

/**
 * Produces light and dark CSS variable rules for a preset. A selector, such as
 * '.app-dark', switches to the dark scheme; 'system' uses the OS preference.
 */
export const createPresetCss = (preset, { prefix = 'mantle', darkModeSelector = 'system', selector = ':root', cssLayer = false } = {}) => {
    const lightCss = createCssRule(selector, resolvePreset(preset, 'light'), prefix);
    const darkSelector = getDarkSelector(darkModeSelector);
    const darkCss = darkSelector ? (darkSelector === 'system' ? `@media (prefers-color-scheme: dark) {\n${createCssRule(selector, resolvePreset(preset, 'dark'), prefix)}\n}` : createCssRule(darkSelector, resolvePreset(preset, 'dark'), prefix)) : '';
    const componentCss = typeof preset.css === 'function' ? preset.css({ prefix }) : preset.css;
    const css = [lightCss, darkCss, componentCss].filter(Boolean).join('\n\n');

    if (!cssLayer) {
        return css;
    }

    const layer = typeof cssLayer === 'object' ? cssLayer.name || 'mantle' : 'mantle';

    return `@layer ${layer} {\n${css}\n}`;
};

/**
 * Applies a preset to a document. This is the imperative equivalent of
 * configuring MantleProvider with a theme preset.
 */
export const applyPreset = (preset, options = {}) => {
    activePreset = preset;
    activeOptions = { ...activeOptions, ...options };

    if (typeof document !== 'undefined') {
        const styleContainer = activeOptions.styleContainer || document.head;
        const styleElement = getThemeStyleElement(document) || document.createElement('style');

        styleElement.id = 'mantle-theme';
        styleElement.textContent = createPresetCss(activePreset, activeOptions);

        if (!styleElement.isConnected) {
            styleContainer.appendChild(styleElement);
        }
    }

    notify();

    return activePreset;
};

export const usePreset = (preset, options = {}) => applyPreset(preset, options);

export const updatePreset = (overrides) => {
    if (!activePreset) {
        throw new Error('A theme preset must be applied before it can be updated.');
    }

    return applyPreset(definePreset(activePreset, overrides));
};

export const updatePrimaryPalette = (palette) => updatePreset({ semantic: { primary: palette } });

export const updateSurfacePalette = (palette, colorScheme = 'light') => updatePreset({ semantic: { colorScheme: { [colorScheme]: { surface: palette } } } });

/**
 * Returns Prime-style metadata for a design token in the active preset.
 */
export const $dt = (path, fallback) => {
    const tokens = activePreset ? resolvePreset(activePreset) : {};
    const value = tokens[path] ?? fallback;
    const prefix = activeOptions.prefix || 'mantle';

    return {
        name: path,
        variable: `--${prefix}-${toKebabCase(path)}`,
        value
    };
};

export const Theme = {
    get options() {
        return activeOptions;
    },
    get preset() {
        return activePreset;
    },
    subscribe(listener) {
        subscribers.add(listener);

        return () => subscribers.delete(listener);
    }
};
