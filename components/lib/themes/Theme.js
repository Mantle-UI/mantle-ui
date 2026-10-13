const tokenReferencePattern = /\{([^}]+)\}/g;

let activePreset;
let activeOptions = {};
const subscribers = new Set();
const defaultStyleId = 'mantle-theme';
const cssSources = Symbol.for('mantle-css-sources');

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
        } else if (value !== undefined && value !== null && !Array.isArray(value) && typeof value !== 'function') {
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
        result[key] = key === 'css' ? composeCss(base?.[key], override[key]) : mergeTokens(base?.[key], override[key]);

        return result;
    }, {});
};

// `colorScheme` may occur at the semantic layer or inside a component token
// group. Keep the direct values and let the selected scheme override them.
const selectColorScheme = (tokens, colorScheme) => {
    if (!tokens || typeof tokens !== 'object' || Array.isArray(tokens)) {
        return tokens;
    }

    const { colorScheme: schemes, extend, ...directTokens } = tokens;

    delete directTokens.css;
    const direct = Object.entries(mergeTokens(directTokens, extend)).reduce((result, [key, value]) => {
        result[key] = selectColorScheme(value, colorScheme);

        return result;
    }, {});
    const scheme = schemes?.[colorScheme] ? selectColorScheme(schemes[colorScheme], colorScheme) : {};

    return mergeTokens(direct, scheme);
};

const resolveTokens = (tokens) => {
    const flatTokens = flattenTokens(tokens);
    const tokenPaths = Object.fromEntries(Object.keys(flatTokens).map((key) => [toKebabCase(key), key]));

    const resolveValue = (value, resolving = []) => {
        if (typeof value !== 'string') {
            return value;
        }

        return value.replace(tokenReferencePattern, (_, reference) => {
            const path = tokenPaths[toKebabCase(reference)];

            if (!path || resolving.includes(path)) {
                return `{${reference}}`;
            }

            return resolveValue(flatTokens[path], [...resolving, path]);
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

const getCssSources = (css) => (css?.[cssSources] || [css]).filter(Boolean);

const composeCss = (base, override) => {
    const sources = [...new Set([...getCssSources(base), ...getCssSources(override)])];

    if (sources.length < 2) {
        return sources[0];
    }

    const composed = (options) => [...new Set(sources.map((source) => (typeof source === 'function' ? source(options) : source)).filter(Boolean))].join('\n');

    Object.defineProperty(composed, cssSources, { value: sources });

    return composed;
};

const splitSelectors = (text) => {
    const selectors = [];
    let start = 0;
    let depth = 0;
    let quote;

    for (let index = 0; index < text.length; index++) {
        const character = text[index];

        if (quote) {
            if (character === quote && text[index - 1] !== '\\') {
                quote = undefined;
            }
        } else if (character === '"' || character === "'") {
            quote = character;
        } else if (character === '(' || character === '[') {
            depth++;
        } else if (character === ')' || character === ']') {
            depth--;
        } else if (character === ',' && !depth) {
            selectors.push(text.slice(start, index));
            start = index + 1;
        }
    }

    return [...selectors, text.slice(start)];
};

// Scope consuming rules once, including selector functions and nested at-rules.
// Declaration strings and global definitions such as keyframes stay intact.
const scopeCss = (css = '', selector = ':root', owner = selector, local = false, isolateGlobal = false) => {
    if (!css || (selector === ':root' && !isolateGlobal)) {
        return css;
    }

    const region = `:is(${selector})`;
    const scope = isolateGlobal
        ? `${selector === ':root' ? '' : `:where(${region}, ${region} *)`}:not(:where([data-mantle-theme-scope], [data-mantle-theme-scope] *))`
        : `:${local ? 'is' : 'where'}(${region}, ${region} *):not(:where(${region} [data-mantle-theme-scope]:not(${owner}), ${region} [data-mantle-theme-scope]:not(${owner}) *))`;
    let output = '';
    let start = 0;
    let open = -1;
    let depth = 0;
    let quote;
    let comment = false;

    for (let index = 0; index < css.length; index++) {
        const character = css[index];

        if (comment) {
            if (character === '/' && css[index - 1] === '*') {
                comment = false;
            }

            continue;
        }

        if (quote) {
            if (character === quote && css[index - 1] !== '\\') {
                quote = undefined;
            }

            continue;
        }

        if (character === '/' && css[index + 1] === '*') {
            comment = true;
        } else if (character === '"' || character === "'") {
            quote = character;
        } else if (character === '{') {
            if (!depth) {
                open = index;
            }

            depth++;
        } else if (character === '}' && --depth === 0) {
            const prelude = css.slice(start, open);
            const body = css.slice(open + 1, index);
            const rule = prelude.replace(/\/\*[\s\S]*?\*\//g, '').trim();

            if (rule.startsWith('@')) {
                output += `${prelude}{${/^@(media|supports|layer|container|scope)\b/.test(rule) ? scopeCss(body, selector, owner, local, isolateGlobal) : body}}`;
            } else {
                const comments = prelude.match(/\/\*[\s\S]*?\*\//g)?.join('\n') || '';
                const selectors = splitSelectors(rule)
                    .map((part) =>
                        part
                            .trim()
                            .replaceAll(':root', selector === ':root' ? selector : region)
                            .replace(/(::[\w-]+(?:\([^)]*\))?)?$/, `${scope}$1`)
                    )
                    .join(',\n');

                output += `${comments}\n${selectors} {${body}}`;
            }

            start = index + 1;
        } else if (character === ';' && !depth) {
            output += css.slice(start, index + 1);
            start = index + 1;
        }
    }

    return output + css.slice(start);
};

const createCssContext = ({ prefix, selector, colorScheme = 'light' }) => ({ prefix, selector, colorScheme, dt: (path, fallback) => `var(--${prefix}-${toKebabCase(path)}${fallback === undefined ? '' : `, ${fallback}`})` });
const resolveCss = (css, options) => (typeof css === 'function' ? css(createCssContext(options)) : css);

const getLayerCss = (css, cssLayer) => {
    if (!cssLayer) {
        return css;
    }

    const layer = typeof cssLayer === 'object' ? cssLayer.name || 'mantle' : 'mantle';

    return `@layer primereact, ${layer};\n@layer ${layer} {\n${css}\n}`;
};

const getDarkSelector = (darkModeSelector) => {
    if (darkModeSelector === false) {
        return undefined;
    }

    return darkModeSelector || 'system';
};

const getStyleContainer = (styleContainer, document) => styleContainer || document.head;

const getThemeStyleElement = (styleContainer, styleId) => {
    if (!styleContainer || typeof styleContainer.querySelector !== 'function') {
        return undefined;
    }

    return Array.from(styleContainer.querySelectorAll('style[data-mantle-theme]')).find((styleElement) => styleElement.getAttribute('data-mantle-theme') === styleId);
};

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
    const { primitive = {}, semantic = {}, components = {}, extend = {} } = preset;

    return resolveTokens(mergeTokens(mergeTokens(mergeTokens(primitive, selectColorScheme(semantic, colorScheme)), selectColorScheme(extend, colorScheme)), selectColorScheme(components, colorScheme)));
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
export const createPresetCss = (preset, { prefix = 'mantle', darkModeSelector = 'system', selector = ':root', cssLayer = false, variablesOnly = false, colorSchemeAttribute = false, componentRoots = false, schemeOwnerSelector = selector } = {}) => {
    const globalRoots = ':where([data-mantle-theme-root], [data-mantle-color-scheme]):where(:not([data-mantle-theme-scope]))';
    const imperativeRoots = !!componentRoots && (componentRoots === true || selector === ':root');
    const regionRoots = selector === ':root' ? globalRoots : `${globalRoots}:where(:is(${selector}), :is(${selector}) *)`;

    const createVariables = (rootSelector, scheme) => {
        const tokens = resolvePreset(preset, scheme);

        if (!componentRoots) {
            return createCssRule(rootSelector, tokens, prefix);
        }

        if (imperativeRoots) {
            const propagated = rootSelector.startsWith(globalRoots);
            const roots = propagated ? rootSelector : rootSelector === ':root' ? globalRoots : `${globalRoots}:where(:is(${rootSelector}), :is(${rootSelector}) *)`;
            const globalSelector = `:where(${rootSelector}):not(:where([data-mantle-theme-scope], [data-mantle-theme-scope] *))`;
            const names = Object.keys(preset.components || {});
            const common = Object.fromEntries(Object.entries(tokens).filter(([path]) => !names.some((name) => path.startsWith(`${name}.`))));
            // Reset a component's own group, retaining tokens from composite
            // parents consumed by another type (IconField/InputText).
            const components = names.map((name) => {
                const value = /^[a-zA-Z_][\w-]*$/.test(name) ? name.toLowerCase() : JSON.stringify(name.toLowerCase());
                const own = Object.fromEntries(Object.entries(tokens).filter(([path]) => path.startsWith(`${name}.`)));

                return createCssRule(`${roots}:where([data-mantle-theme-root=${value}])`, own, prefix);
            });
            const detachedParts = `${roots}:where([data-mantle-color-scheme]):where(:not([data-mantle-theme-root]))`;

            return [...(propagated ? [] : [createCssRule(globalSelector, tokens, prefix)]), createCssRule(roots, common, prefix), ...components, createCssRule(detachedParts, tokens, prefix)].join('\n\n');
        }

        const boundary = `${rootSelector}:not(:where(${selector} ${selector}))`;
        const commonTokens = resolvePreset({ ...preset, components: {} }, scheme);
        const names = Array.isArray(componentRoots) ? componentRoots : Object.keys(preset.components || {}).map((name) => name.toLowerCase());
        const components = Object.keys(preset.components || {})
            .filter((name) => names.includes(name.toLowerCase()))
            .map((name) => {
                const ownTokens = Object.fromEntries(Object.entries(tokens).filter(([path]) => path.startsWith(`${name}.`)));

                const value = /^[a-zA-Z_][\w-]*$/.test(name) ? name.toLowerCase() : JSON.stringify(name.toLowerCase());

                const aliases = name === 'dataview' ? ', [data-pc-name=dataviewlayoutoptions]' : '';

                return createCssRule(`${rootSelector}:where([data-pc-name=${value}]${aliases})`, ownTokens, prefix);
            });

        return [createCssRule(rootSelector, commonTokens, prefix), createCssRule(boundary, tokens, prefix), ...components].join('\n\n');
    };

    const lightCss = createVariables(selector, 'light');
    const darkSelector = getDarkSelector(darkModeSelector);
    const scopedDarkSelector = selector === ':root' ? darkSelector : `:is(${selector}):where(:is(${darkSelector}), :is(${darkSelector}) *)${imperativeRoots ? `, :is(${darkSelector}):where(:is(${selector}), :is(${selector}) *)` : ''}`;
    const darkCss = darkSelector ? (darkSelector === 'system' ? `@media (prefers-color-scheme: dark) {\n${createVariables(selector, 'dark')}\n}` : createVariables(scopedDarkSelector, 'dark')) : '';
    const componentCss = variablesOnly
        ? ''
        : [resolveCss(preset.css, { prefix, selector }), ...Object.values(preset.components || {}).map((tokens) => resolveCss(tokens.css, { prefix, selector }))]
              .filter(Boolean)
              .map((css) => scopeCss(css, selector, selector, false, imperativeRoots))
              .join('\n');
    // Portals carry their originating color scheme on their actual DOM root.
    // Descendant component roots must resolve the same tokens, even when the
    // portal destination has a different dark class or OS preference.
    const propagatedCss = colorSchemeAttribute
        ? (darkSelector ? ['dark', 'light'] : ['light'])
              .map((scheme) => {
                  const anchor = `${schemeOwnerSelector}[data-mantle-color-scheme=${scheme}]`;
                  const nearer = `${anchor} ${schemeOwnerSelector}[data-mantle-color-scheme=${scheme === 'light' ? 'dark' : 'light'}]`;
                  const localDark =
                      scheme === 'light' && darkSelector && darkSelector !== 'system'
                          ? splitSelectors(darkSelector)
                                .map((part) => `, ${anchor} ${part.trim()}, ${anchor} ${part.trim()} *`)
                                .join('')
                          : '';
                  const targetRoot = imperativeRoots ? regionRoots : selector;
                  const target = `${targetRoot}:where([data-mantle-color-scheme=${scheme}], ${anchor} *):not(:where(${nearer}, ${nearer} *${localDark}))`;

                  return createVariables(target, scheme);
              })
              .join('\n\n')
        : '';
    const css = [lightCss, darkCss, propagatedCss, componentCss].filter(Boolean).join('\n\n');

    return getLayerCss(css, cssLayer);
};

/** Produces the component-only variable overrides and CSS for one dt instance. */
export const createComponentThemeCss = (preset, name, tokens, { prefix = 'mantle', selector, colorScheme, cssLayer = false, ownerSelector = selector, darkModeSelector = 'system' } = {}) => {
    const canonicalName = Object.keys(preset.components || {}).find((key) => key.toLowerCase() === name.toLowerCase()) || name;
    const scopedPreset = definePreset(preset, { components: { [canonicalName]: tokens } });
    const ownTokens = (scheme) => Object.fromEntries(Object.entries(resolvePreset(scopedPreset, scheme)).filter(([path]) => path.startsWith(`${canonicalName}.`)));
    const variables = colorScheme
        ? createCssRule(selector, ownTokens(colorScheme), prefix)
        : createPresetCss(
              { semantic: { colorScheme: { light: ownTokens('light'), dark: ownTokens('dark') } } },
              { prefix, selector, darkModeSelector, variablesOnly: true, colorSchemeAttribute: true, schemeOwnerSelector: ownerSelector === ':root' ? ':not([data-mantle-theme-scope])' : ownerSelector }
          );
    const css = resolveCss(tokens.css, { prefix, selector, colorScheme });

    return getLayerCss([variables, scopeCss(css, selector, ownerSelector, true)].filter(Boolean).join('\n'), cssLayer);
};

/**
 * Applies a preset to a document. This is the imperative equivalent of
 * configuring MantleProvider with a theme preset.
 */
export const applyPreset = (preset, options = {}) => {
    activePreset = preset;
    activeOptions = { ...options };

    if (typeof document !== 'undefined') {
        const styleContainer = getStyleContainer(activeOptions.styleContainer, document);
        const styleId = activeOptions.styleId || defaultStyleId;
        const styleElement = getThemeStyleElement(styleContainer, styleId) || document.createElement('style');

        styleElement.id = styleId;
        styleElement.setAttribute('data-mantle-theme', styleId);

        if (activeOptions.nonce) {
            styleElement.setAttribute('nonce', activeOptions.nonce);
        } else {
            styleElement.removeAttribute('nonce');
        }

        styleElement.textContent = createPresetCss(activePreset, {
            ...activeOptions,
            componentRoots: true,
            colorSchemeAttribute: true,
            schemeOwnerSelector: ':not([data-mantle-theme-scope])'
        });

        if (!styleElement.isConnected) {
            styleContainer.appendChild(styleElement);
        }
    }

    notify();

    return activePreset;
};

export const usePreset = (preset, options = {}) => applyPreset(preset, options);

/**
 * Removes CSS generated for a preset. This is useful for isolated React roots
 * and shadow DOM hosts; the global imperative preset state is left untouched.
 */
export const removePreset = (options = {}) => {
    if (typeof document === 'undefined') {
        return;
    }

    const styleElement = getThemeStyleElement(getStyleContainer(options.styleContainer, document), options.styleId || defaultStyleId);

    styleElement?.parentNode?.removeChild(styleElement);

    if ((activeOptions.styleId || defaultStyleId) === (options.styleId || defaultStyleId) && activeOptions.styleContainer === options.styleContainer) {
        activePreset = undefined;
        activeOptions = {};
        notify();
    }
};

export const updatePreset = (overrides) => {
    if (!activePreset) {
        throw new Error('A theme preset must be applied before it can be updated.');
    }

    return applyPreset(definePreset(activePreset, overrides), activeOptions);
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
