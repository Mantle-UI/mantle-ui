/* eslint-disable */
import * as React from 'react';
import { DomHandler } from '../utils/Utils';
import { useEventListener } from './useEventListener';
import { useOverlayScrollListener } from './useOverlayScrollListener';
import { useResizeListener } from './useResizeListener';
import { useUnmountEffect } from './useUnmountEffect';

export const useOverlayListener = ({ target, overlay, listener, when = true, type = 'click' }) => {
    const targetRef = React.useRef(null);
    const overlayRef = React.useRef(null);
    const getOwnerWindow = () => DomHandler.getTargetElement(overlay)?.ownerDocument?.defaultView || DomHandler.getTargetElement(target)?.ownerDocument?.defaultView || window;

    /**
     * The parameters of the 'listener' method in the following event handlers;
     * @param {Event} event A click event of the document.
     * @param {string} options.type The custom type to detect event.
     * @param {boolean} options.valid It is controlled by MantleUI. It is determined whether it is valid or not according to some custom validation.
     */
    const [bindDocumentClickListener, unbindDocumentClickListener] = useEventListener({
        target: getOwnerWindow,
        type: type,
        listener: (event) => {
            listener && listener(event, { type: 'outside', valid: event.which !== 3 && isOutsideClicked(event) });
        },
        when
    });
    const [bindWindowResizeListener, unbindWindowResizeListener] = useResizeListener({
        target: getOwnerWindow,
        listener: (event) => {
            listener && listener(event, { type: 'resize', valid: !DomHandler.isTouchDevice() });
        },
        when
    });
    const [bindWindowOrientationChangeListener, unbindWindowOrientationChangeListener] = useEventListener({
        target: getOwnerWindow,
        type: 'orientationchange',
        listener: (event) => {
            listener && listener(event, { type: 'orientationchange', valid: true });
        },
        when
    });
    const [bindOverlayScrollListener, unbindOverlayScrollListener] = useOverlayScrollListener({
        target,
        listener: (event) => {
            listener && listener(event, { type: 'scroll', valid: true });
        },
        when
    });

    const isOutsideClicked = (event) => {
        return targetRef.current && !(targetRef.current.isSameNode(event.target) || targetRef.current.contains(event.target) || (overlayRef.current && overlayRef.current.contains(event.target)));
    };

    const bind = () => {
        targetRef.current = DomHandler.getTargetElement(target);
        overlayRef.current = DomHandler.getTargetElement(overlay);
        const ownerWindow = getOwnerWindow();

        bindDocumentClickListener({ target: ownerWindow });
        bindWindowResizeListener({ target: ownerWindow });
        bindWindowOrientationChangeListener({ target: ownerWindow });
        bindOverlayScrollListener({ target: targetRef.current });
    };

    const unbind = () => {
        unbindDocumentClickListener();
        unbindWindowResizeListener();
        unbindWindowOrientationChangeListener();
        unbindOverlayScrollListener();
    };

    React.useEffect(() => {
        if (when) {
            targetRef.current = DomHandler.getTargetElement(target);
            overlayRef.current = DomHandler.getTargetElement(overlay);
        } else {
            unbind();
            targetRef.current = overlayRef.current = null;
        }
    }, [target, overlay, when]);

    useUnmountEffect(() => {
        unbind();
    });

    return [bind, unbind];
};
/* eslint-enable */
