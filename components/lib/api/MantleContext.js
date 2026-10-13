import React, { useState } from 'react';
import { FilterMatchMode } from './FilterMatchMode';
import MantleUI from './MantleUI';
import { createPresetCss } from '../themes/themes';
import { encodeThemeId, equalThemeValues, snapshotTheme, useThemeId } from '../themes/ThemeScope';

export const MantleContext = React.createContext();

export const MantleProvider = (props) => {
    const propsValue = props.value ?? {};

    const [ripple, setRipple] = useState(propsValue.ripple ?? false);
    const [inputStyle, setInputStyle] = useState(propsValue.inputStyle ?? 'outlined');
    const [locale, setLocale] = useState(propsValue.locale ?? 'en');
    const [appendTo, setAppendTo] = useState(propsValue.appendTo ?? null);
    const [styleContainer, setStyleContainer] = useState(propsValue.styleContainer ?? null);
    const [cssTransition, setCssTransition] = useState(propsValue.cssTransition ?? true);
    const [autoZIndex, setAutoZIndex] = useState(propsValue.autoZIndex ?? true);
    const [hideOverlaysOnDocumentScrolling, setHideOverlaysOnDocumentScrolling] = useState(propsValue.hideOverlaysOnDocumentScrolling ?? false);
    const [nonce, setNonce] = useState(propsValue.nonce ?? null);
    const [nullSortOrder, setNullSortOrder] = useState(propsValue.nullSortOrder ?? 1);
    const [zIndex, setZIndex] = useState(
        propsValue.zIndex ?? {
            modal: 1100,
            overlay: 1000,
            menu: 1000,
            tooltip: 1100,
            toast: 1200
        }
    );
    const [ptOptions, setPtOptions] = useState(
        propsValue.ptOptions ?? {
            mergeSections: true,
            mergeProps: true
        }
    );
    const [pt, setPt] = useState(propsValue.pt ?? undefined);
    const [unstyled, setUnstyled] = useState(propsValue.unstyled ?? false);
    const [themeState, setThemeState] = useState(propsValue.theme ?? undefined);
    const previousThemeConfig = React.useRef({ value: snapshotTheme(propsValue.theme), revision: props.themeRevision });
    const controlledTheme = props.themeMode === 'controlled';
    const theme = controlledTheme ? propsValue.theme : themeState;
    const currentTheme = React.useRef();

    currentTheme.current = { theme, controlled: controlledTheme, onChange: props.onThemeChange };

    const setTheme = React.useCallback((update) => {
        const current = currentTheme.current;
        const next = typeof update === 'function' ? update(current.theme) : update;

        if (!current.controlled) {
            current.theme = next;
            setThemeState(next);
        }

        current.onChange?.(next);
    }, []);

    const themeId = useThemeId();
    const themeStyleId = themeId ? `mantle-theme-provider-${encodeThemeId(themeId)}` : undefined;
    const themeScope = !unstyled && theme?.preset ? themeStyleId : undefined;
    const themeRegistry = React.useRef({ names: new Set(), sheets: [], count: 0 });

    themeRegistry.current.config = { theme, themeScope };

    const registerThemeComponent = React.useCallback((name) => themeRegistry.current.names.add(name.toLowerCase()), []);
    const flushThemeComponents = React.useCallback(() => {
        const registry = themeRegistry.current;

        if (registry.sheets.length && registry.count !== registry.names.size) {
            const { theme, themeScope } = registry.config;
            const css = createPresetCss(theme.preset, { ...theme.options, selector: `[data-mantle-theme-scope=${themeScope}]`, colorSchemeAttribute: true, componentRoots: [...registry.names] });

            registry.sheets.forEach((sheet) => (sheet.textContent = css));
            registry.count = registry.names.size;
        }
    }, []);

    React.useEffect(() => {
        if (!equalThemeValues(previousThemeConfig.current.value, propsValue.theme) || !Object.is(previousThemeConfig.current.revision, props.themeRevision)) {
            previousThemeConfig.current = { value: snapshotTheme(propsValue.theme), revision: props.themeRevision };

            if (!controlledTheme) {
                setThemeState(propsValue.theme);
            }
        }
    }, [propsValue.theme, controlledTheme, props.themeRevision]);

    React.useEffect(() => {
        if (themeScope && typeof document !== 'undefined') {
            const registry = themeRegistry.current;
            const container = styleContainer || theme.options?.styleContainer || document.head;
            const documentHead = (container.ownerDocument || document).head;
            const containers = container.getRootNode()?.host ? [container, documentHead] : [container];
            const options = { ...theme.options, selector: `[data-mantle-theme-scope=${themeScope}]`, colorSchemeAttribute: true, componentRoots: [...registry.names] };
            const css = createPresetCss(theme.preset, options);
            // A sheet inside a shadow root cannot style a body portal. Its
            // document copy is equally scoped and owned by this provider.
            const styleElements = containers.map((target) => {
                const styleElement = (target.ownerDocument || document).createElement('style');

                styleElement.id = themeStyleId;
                styleElement.setAttribute('data-mantle-theme', themeStyleId);
                styleElement.textContent = css;

                if (nonce || theme.options?.nonce) {
                    styleElement.setAttribute('nonce', nonce || theme.options.nonce);
                }

                target.appendChild(styleElement);

                return styleElement;
            });

            registry.sheets = styleElements;
            registry.count = registry.names.size;

            return () => {
                styleElements.forEach((styleElement) => styleElement.remove());
                registry.sheets = [];
            };
        }
    }, [nonce, styleContainer, theme, themeScope, themeStyleId]);
    const [filterMatchModeOptions, setFilterMatchModeOptions] = useState(
        propsValue.filterMatchModeOptions ?? {
            text: [FilterMatchMode.STARTS_WITH, FilterMatchMode.CONTAINS, FilterMatchMode.NOT_CONTAINS, FilterMatchMode.ENDS_WITH, FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS],
            numeric: [FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS, FilterMatchMode.LESS_THAN, FilterMatchMode.LESS_THAN_OR_EQUAL_TO, FilterMatchMode.GREATER_THAN, FilterMatchMode.GREATER_THAN_OR_EQUAL_TO],
            date: [FilterMatchMode.DATE_IS, FilterMatchMode.DATE_IS_NOT, FilterMatchMode.DATE_BEFORE, FilterMatchMode.DATE_AFTER]
        }
    );

    const changeTheme = (currentTheme, newTheme, linkElementId, callback) => {
        const linkElement = document.getElementById(linkElementId);

        if (!linkElement) {
            throw Error(`Element with id ${linkElementId} not found.`);
        }

        const newThemeUrl = linkElement.getAttribute('href').replace(currentTheme, newTheme);
        const newLinkElement = document.createElement('link');

        newLinkElement.setAttribute('rel', 'stylesheet');
        newLinkElement.setAttribute('id', linkElementId);
        newLinkElement.setAttribute('href', newThemeUrl);
        newLinkElement.addEventListener('load', () => {
            if (callback) {
                callback();
            }
        });

        linkElement.parentNode?.replaceChild(newLinkElement, linkElement);
    };

    /**
     * @deprecated
     */
    React.useEffect(() => {
        MantleUI.ripple = ripple;
    }, [ripple]);

    /**
     * @deprecated
     */
    React.useEffect(() => {
        MantleUI.inputStyle = inputStyle;
    }, [inputStyle]);

    /**
     * @deprecated
     */
    React.useEffect(() => {
        MantleUI.locale = locale;
    }, [locale]);

    const value = {
        registerThemeComponent,
        flushThemeComponents,
        changeTheme,
        ripple,
        setRipple,
        inputStyle,
        setInputStyle,
        locale,
        setLocale,
        appendTo,
        setAppendTo,
        styleContainer,
        setStyleContainer,
        cssTransition,
        setCssTransition,
        autoZIndex,
        setAutoZIndex,
        hideOverlaysOnDocumentScrolling,
        setHideOverlaysOnDocumentScrolling,
        nonce,
        setNonce,
        nullSortOrder,
        setNullSortOrder,
        zIndex,
        setZIndex,
        ptOptions,
        setPtOptions,
        pt,
        setPt,
        filterMatchModeOptions,
        setFilterMatchModeOptions,
        unstyled,
        setUnstyled,
        theme,
        setTheme,
        themeScope
    };

    return <MantleContext.Provider value={value}>{props.children}</MantleContext.Provider>;
};
