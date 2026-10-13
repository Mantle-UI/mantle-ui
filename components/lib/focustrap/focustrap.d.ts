/** @module focustrap */
import * as React from 'react';

/** Properties for the focus-boundary helper used by overlay components. */
export interface FocusTrapProps {
    children?: React.ReactNode;
    disabled?: boolean;
    autoFocus?: boolean;
    autoFocusSelector?: string;
    firstFocusableSelector?: string;
    lastFocusableSelector?: string;
    tabIndex?: number;
}

/** Methods exposed by the focus-boundary helper. */
export interface FocusTrapRef {
    props: FocusTrapProps;
    getInk(): HTMLSpanElement | null;
    getTarget(): HTMLElement | null;
}

export declare const FocusTrap: React.MemoExoticComponent<React.ForwardRefExoticComponent<FocusTrapProps & React.RefAttributes<FocusTrapRef>>>;
export default FocusTrap;
