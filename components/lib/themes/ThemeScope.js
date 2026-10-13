import * as React from 'react';

const useLegacyThemeId = () => {
    const [id, setId] = React.useState();

    React.useEffect(() => {
        setId(`legacy-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`);
    }, []);

    return id;
};

export const useThemeId = React.useId || useLegacyThemeId;
export const encodeThemeId = (id) => id && Array.from(id, (character) => character.codePointAt(0).toString(16)).join('-');
export const getThemeParent = (element) => element.parentElement || element.getRootNode()?.host;

export const getThemeColorScheme = (origin, darkModeSelector, mediaQuery, themeScope) => {
    if (darkModeSelector === false) {
        return 'light';
    }

    for (let element = origin; element; element = getThemeParent(element)) {
        const inheritedScheme = element.getAttribute('data-mantle-color-scheme');

        if (inheritedScheme && (element.getAttribute('data-mantle-theme-scope') || undefined) === themeScope) {
            return inheritedScheme;
        }

        if (darkModeSelector && darkModeSelector !== 'system' && element.matches(darkModeSelector)) {
            return 'dark';
        }
    }

    return (!darkModeSelector || darkModeSelector === 'system') && mediaQuery?.matches ? 'dark' : 'light';
};

const isRecord = (value) => value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;

export const snapshotTheme = (value) => (Array.isArray(value) ? value.map(snapshotTheme) : isRecord(value) ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, snapshotTheme(item)])) : value);

export const equalThemeValues = (first, second) => {
    if (Object.is(first, second)) {
        return true;
    }

    const sources = Symbol.for('mantle-css-sources');

    if (typeof first === 'function' && typeof second === 'function' && first[sources] && second[sources]) {
        return equalThemeValues(first[sources], second[sources]);
    }

    if ((isRecord(first) && isRecord(second)) || (Array.isArray(first) && Array.isArray(second))) {
        const keys = Object.keys(first);

        return keys.length === Object.keys(second).length && keys.every((key) => Object.prototype.hasOwnProperty.call(second, key) && equalThemeValues(first[key], second[key]));
    }

    return false;
};
