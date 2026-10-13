import * as React from 'react';
import ReactDOM from 'react-dom';
import MantleUI, { MantleContext } from '../api/Api';
import { useMountEffect, useUnmountEffect, useUpdateEffect } from '../hooks/Hooks';
import { DomHandler, ObjectUtils } from '../utils/Utils';
import { Theme } from '../themes/themes';
import { PortalBase } from './PortalBase';
import { usePortalTheme } from './usePortalTheme';

export const Portal = React.memo((inProps) => {
    const props = PortalBase.getProps(inProps);
    const context = React.useContext(MantleContext);

    const [mountedState, setMountedState] = React.useState(props.visible && DomHandler.isClient());

    useMountEffect(() => {
        if (DomHandler.isClient() && !mountedState) {
            setMountedState(true);
            props.onMounted && props.onMounted();
        }
    });

    useUpdateEffect(() => {
        props.onMounted && props.onMounted();
    }, [mountedState]);

    useUnmountEffect(() => {
        props.onUnmounted && props.onUnmounted();
    });

    const element = props.element || props.children;
    let appendTo = props.appendTo || (context && context.appendTo) || MantleUI.appendTo;

    if (element && mountedState && ObjectUtils.isFunction(appendTo)) {
        appendTo = appendTo();
    }

    if (!appendTo && DomHandler.isClient()) {
        appendTo = document.body;
    }

    const themeScope = props.themeRootRef && context?.themeScope;
    const themeInstance = typeof props.themeInstance === 'function' ? props.themeInstance() : props.themeInstance;
    const globalTheme = props.themeRootRef && !!Theme.preset;
    const originRef = usePortalTheme({
        themeScope,
        darkModeSelector: context?.theme?.preset ? (context.theme.options?.darkModeSelector ?? 'system') : Theme.options.darkModeSelector,
        themeRootRef: props.themeRootRef,
        themeOrigin: props.themeOrigin,
        themeInstance: props.themeInstance,
        isPortal: appendTo !== 'self' || Array.isArray(props.themeRootRef),
        isSelf: appendTo === 'self',
        mounted: mountedState
    });

    if (element && mountedState) {
        return appendTo === 'self' ? (
            element
        ) : (
            <>
                {(themeScope || themeInstance || globalTheme) && <template ref={originRef} data-mantle-theme-origin="" />}
                {ReactDOM.createPortal(element, appendTo)}
            </>
        );
    }

    return null;
});

Portal.displayName = 'Portal';

export { usePortalTheme } from './usePortalTheme';
