import * as React from 'react';
import { Theme } from '../themes/themes';
import { getThemeColorScheme, getThemeParent } from '../themes/ThemeScope';

const getParentElement = getThemeParent;

const getElement = (value) => {
    const resolved = typeof value === 'function' ? value() : value;
    const element = resolved?.current === undefined ? resolved : resolved.current;

    return element?.nodeType === 1 ? element : null;
};

const getRootElements = (value) => {
    const resolved = typeof value === 'function' ? value() : value;

    return (Array.isArray(resolved) ? resolved : [resolved]).map(getElement).filter(Boolean);
};

/**
 * Bridge tokens to a portal's actual root without cloning composite children or
 * replacing their refs. The template is inert and stays at the React origin.
 */
export const usePortalTheme = ({ themeScope, themeEnabled, darkModeSelector, themeRootRef, themeOrigin, themeInstance, isPortal, isSelf, mounted }) => {
    const originRef = React.useRef(null);
    const [, update] = React.useReducer((value) => value + 1, 0);
    const enabled = themeEnabled ?? (!!themeRootRef && !!Theme.preset);
    const selector = darkModeSelector ?? (themeScope ? 'system' : Theme.options.darkModeSelector);

    React.useEffect(() => {
        if (!themeScope && themeRootRef && themeEnabled !== false) {
            return Theme.subscribe(update);
        }
    }, [themeScope, themeRootRef, themeEnabled]);

    React.useLayoutEffect(() => {
        const resolveInstance = () =>
            typeof themeInstance === 'function'
                ? themeInstance()
                : (themeInstance ??
                  getRootElements(themeRootRef)
                      .map((root) => root.getAttribute('data-mantle-theme-instance'))
                      .find(Boolean));

        const resolveOrigin = () => {
            const roots = getRootElements(themeRootRef);

            return getElement(themeOrigin) || originRef.current || (isSelf && roots.find((root) => !roots.includes(root.parentElement))?.parentElement);
        };

        let origin = resolveOrigin();

        if ((!themeScope && !resolveInstance() && !enabled) || !isPortal || !mounted || !origin) {
            return;
        }

        const document = origin.ownerDocument;
        const view = document.defaultView;
        const mediaQuery = view.matchMedia?.('(prefers-color-scheme: dark)');
        let currentRoots = [];
        const originalInstances = new Map();
        const assignedInstances = new Map();

        const clearRoot = (root) => {
            if ((root?.getAttribute('data-mantle-theme-scope') || undefined) === themeScope) {
                root.removeAttribute('data-mantle-theme-scope');
                root.removeAttribute('data-mantle-color-scheme');
            }

            if (root?.getAttribute('data-mantle-theme-instance') === assignedInstances.get(root)) {
                const original = originalInstances.get(root);

                original ? root.setAttribute('data-mantle-theme-instance', original) : root.removeAttribute('data-mantle-theme-instance');
            }
        };

        const synchronize = () => {
            const roots = getRootElements(themeRootRef);

            currentRoots.filter((root) => !roots.includes(root)).forEach(clearRoot);
            currentRoots = roots;
            origin = resolveOrigin();

            if (!origin) {
                return;
            }

            const colorScheme = getThemeColorScheme(origin, selector, mediaQuery, themeScope);
            const instance = typeof themeInstance === 'function' ? themeInstance() : (themeInstance ?? roots.map((root) => root.getAttribute('data-mantle-theme-instance')).find(Boolean));

            roots.forEach((root) => {
                if (!originalInstances.has(root)) {
                    originalInstances.set(root, root.getAttribute('data-mantle-theme-instance'));
                }

                if (instance && root.getAttribute('data-mantle-theme-instance') !== instance) {
                    root.setAttribute('data-mantle-theme-instance', instance);
                }

                assignedInstances.set(root, instance);

                if (themeScope && root.getAttribute('data-mantle-theme-scope') !== themeScope) {
                    root.setAttribute('data-mantle-theme-scope', themeScope);
                }

                if (root.getAttribute('data-mantle-color-scheme') !== colorScheme) {
                    root.setAttribute('data-mantle-color-scheme', colorScheme);
                }
            });
        };

        synchronize();

        // Observe origin ancestors and reparenting, including a shadow host.
        // Ignore unrelated mutations and our own portal attribute writes.
        const observer = new view.MutationObserver((records) => {
            const nextOrigin = resolveOrigin();
            const ancestors = new Set();

            for (let element = nextOrigin; element; element = getParentElement(element)) {
                ancestors.add(element);
            }

            if (nextOrigin !== origin || records.some((record) => ancestors.has(record.target) || Array.from(record.removedNodes).some((node) => origin && node.contains(origin)))) {
                synchronize();
                observeShadowRoots();
            }
        });

        observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });

        const observeShadowRoots = () => {
            for (let element = origin; element; element = getParentElement(element)) {
                const root = element.getRootNode();

                if (root !== document) {
                    observer.observe(root, { attributes: true, childList: true, subtree: true });
                }
            }
        };

        observeShadowRoots();

        mediaQuery?.addEventListener?.('change', synchronize);

        return () => {
            observer.disconnect();
            mediaQuery?.removeEventListener?.('change', synchronize);
            currentRoots.forEach(clearRoot);
        };
    });

    return originRef;
};
