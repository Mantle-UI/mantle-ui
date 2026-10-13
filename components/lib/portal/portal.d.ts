import * as React from 'react';

export type PortalElement = Element | null | undefined;
export type PortalElementTarget = PortalElement | React.RefObject<PortalElement> | (() => PortalElement);
export type PortalThemeRootTarget = PortalElementTarget | PortalElementTarget[] | (() => PortalElementTarget[]);

export interface PortalProps {
    element?: React.ReactNode;
    children?: React.ReactNode;
    appendTo?: Element | DocumentFragment | 'self' | null | (() => Element | DocumentFragment | null);
    visible?: boolean;
    onMounted?: () => void;
    onUnmounted?: () => void;
    /** Actual DOM roots whose provider scope and originating color scheme should be bridged. */
    themeRootRef?: PortalThemeRootTarget;
    /** Current trigger or local origin for an imperative overlay. */
    themeOrigin?: PortalElementTarget;
    themeInstance?: string | null | (() => string | undefined | null);
}

export interface PortalThemeOptions {
    /** Defaults to whether an imperative preset is active when actual roots are supplied. */
    themeEnabled?: boolean;
    themeInstance?: string | null | (() => string | undefined | null);
    themeScope?: string;
    darkModeSelector?: string | false;
    themeRootRef?: PortalThemeRootTarget;
    themeOrigin?: PortalElementTarget;
    isPortal?: boolean;
    isSelf?: boolean;
    mounted?: boolean;
}

export declare const Portal: React.NamedExoticComponent<PortalProps>;
export declare function usePortalTheme(options: PortalThemeOptions): React.RefObject<HTMLTemplateElement | null>;
