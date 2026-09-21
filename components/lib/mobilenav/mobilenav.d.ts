/**
 * MobileNav is an overlay navigation component for mobile interfaces.
 *
 * @module mobilenav
 */
import * as React from 'react';
import { MenuItem } from '../menuitem';
import { PassThroughOptions } from '../passthrough';
import { PassThroughType } from '../utils';

export declare type MobileNavPassThroughType<T> = PassThroughType<T, MobileNavPassThroughMethodOptions>;

export interface MobileNavPassThroughMethodOptions {
    /** The complete MobileNav props object. */
    props: MobileNavProps;
    /** MobileNav has no additional persistent state. */
    state: Record<string, never>;
    /** Context for the current item, when a PT slot is rendered for one. */
    context: { item?: MenuItem; active?: boolean; expanded?: boolean };
}

export interface MobileNavPassThroughOptions {
    /** Attributes for the navigation landmark. */
    nav?: MobileNavPassThroughType<React.HTMLAttributes<HTMLElement>>;
    /** Attributes for the root navigation list. */
    menu?: MobileNavPassThroughType<React.OlHTMLAttributes<HTMLOListElement>>;
    /** Attributes for nested navigation lists. */
    submenu?: MobileNavPassThroughType<React.OlHTMLAttributes<HTMLOListElement>>;
    /** Attributes for the animated nested-list container. */
    submenuWrapper?: MobileNavPassThroughType<React.HTMLAttributes<HTMLDivElement>>;
    /** Attributes for a navigation list item. */
    menuitem?: MobileNavPassThroughType<React.HTMLAttributes<HTMLLIElement>>;
    /** Attributes for an item link or expandable button. */
    action?: MobileNavPassThroughType<React.HTMLAttributes<HTMLAnchorElement | HTMLButtonElement>>;
    /** Attributes for an item label. */
    label?: MobileNavPassThroughType<React.HTMLAttributes<HTMLSpanElement>>;
    /** Attributes for an item icon container. */
    icon?: MobileNavPassThroughType<React.HTMLAttributes<HTMLSpanElement>>;
    /** Attributes for an expandable item's toggle icon. */
    toggleIcon?: MobileNavPassThroughType<React.SVGProps<SVGSVGElement>>;
    /** Attributes for a nested group label. */
    groupLabel?: MobileNavPassThroughType<React.HTMLAttributes<HTMLSpanElement>>;
    /** Attributes for a separator item. */
    separator?: MobileNavPassThroughType<React.HTMLAttributes<HTMLLIElement>>;
}

export interface MobileNavItemSelectEvent {
    /** The browser event that selected the item. */
    originalEvent: React.SyntheticEvent;
    /** The selected leaf navigation item. */
    item: MenuItem;
}

/**
 * Defines valid properties in MobileNav.
 * @group Properties
 */
export interface MobileNavProps extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'onSelect' | 'ref'> {
    /**
     * Tree of navigation items to display.
     * @defaultValue null
     */
    model?: MenuItem[] | undefined;
    /**
     * Controls whether the drawer is visible.
     * @defaultValue false
     */
    visible?: boolean | undefined;
    /**
     * Current item, item id, or item URL. Its ancestor branch is expanded automatically.
     * @defaultValue null
     */
    activeItem?: MenuItem | string | null | undefined;
    /**
     * DOM element where the drawer is mounted. When null, it mounts to document.body.
     * @defaultValue null
     */
    appendTo?: 'self' | HTMLElement | undefined | null | (() => HTMLElement);
    /**
     * Accessible label for the navigation landmark.
     * @defaultValue Navigation
     */
    ariaLabel?: string | undefined;
    /**
     * Blocks document scrolling while the drawer is open.
     * @defaultValue true
     */
    blockScroll?: boolean | undefined;
    /**
     * Closes the drawer after a leaf item is selected.
     * @defaultValue true
     */
    closeOnSelect?: boolean | undefined;
    /**
     * Closes the drawer when its mask is clicked.
     * @defaultValue true
     */
    dismissable?: boolean | undefined;
    /**
     * Additional CSS class for the overlay mask.
     * @defaultValue null
     */
    maskClassName?: string | undefined;
    /**
     * Inline style for the overlay mask.
     * @defaultValue null
     */
    maskStyle?: React.CSSProperties | undefined;
    /**
     * Called when the drawer is dismissed.
     * @defaultValue null
     */
    onHide?(event?: React.SyntheticEvent): void;
    /**
     * Called after a leaf navigation item is selected.
     * @defaultValue null
     */
    onItemSelect?(event: MobileNavItemSelectEvent): void;
    /**
     * When enabled, removes MobileNav's default navigation styles.
     * @defaultValue false
     */
    unstyled?: boolean | undefined;
    /**
     * Pass-through attributes for internal DOM elements.
     * @defaultValue null
     */
    pt?: MobileNavPassThroughOptions;
    /**
     * Configuration for pass-through merging.
     * @defaultValue null
     */
    ptOptions?: PassThroughOptions;
}

/**
 * **MantleUI - MobileNav**
 *
 * _MobileNav displays a tree of navigation items in an overlay drawer._
 *
 * @group Component
 */
export declare class MobileNav extends React.Component<MobileNavProps, any> {}
