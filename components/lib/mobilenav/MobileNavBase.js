import { ComponentBase } from '../componentbase/ComponentBase';
import { classNames } from '../utils/Utils';

const styles = `
@layer primereact {
    .p-mobilenav-mask {
        position: fixed;
        inset: 0;
        z-index: 1101;
        pointer-events: none;
        background: rgba(0, 0, 0, 0);
        transition: background-color .5s;
    }

    .p-mobilenav-mask-active {
        pointer-events: auto;
        background: rgba(0, 0, 0, .4);
    }

    .p-mobilenav {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1102;
        height: 100%;
        width: 18.75rem;
        /* Solid overlay fallback for browsers without color-mix support. */
        background: var(--surface-overlay) !important;
        border: 0 none !important;
        box-shadow: none !important;
        -webkit-backdrop-filter: blur(20px);
        backdrop-filter: blur(20px);
        opacity: 0;
        transform: translateX(-100%);
        transition: transform .4s cubic-bezier(.05,.74,.2,.99), opacity .3s;
    }

    .p-mobilenav-active { opacity: 1; transform: translateX(0); }

    @supports (background: color-mix(in srgb, black, transparent)) {
        .p-mobilenav {
            /* Keep light surfaces legible while retaining their glass effect. */
            background: color-mix(in srgb, var(--surface-overlay) 82%, transparent) !important;
        }

        /* The documentation layout provides a deliberately translucent dark
         * surface, so preserve the stronger frosted treatment in dark mode. */
        .layout-dark .p-mobilenav {
            background: color-mix(in srgb, var(--surface-overlay) 30%, transparent) !important;
        }
    }

    .p-mobilenav-mask {
        background-color: rgba(0, 0, 0, 0.4);
    }

    .p-mobilenav nav {
        padding: 1rem !important;
        height: 100%;
        overflow: auto;
    }

    .p-mobilenav-list,
    .p-mobilenav-sublist {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .p-mobilenav-list > .p-mobilenav-item {
        margin-bottom: .25rem;
    }

    .p-mobilenav-item-content {
        display: flex;
        width: 100%;
        align-items: center;
        padding: .5rem 0;
        color: var(--surface-900);
        font-weight: 600;
        text-decoration: none;
        border: 0;
        border-radius: var(--border-radius);
        background: transparent;
        cursor: pointer;
        transition: color .2s;
    }

    .p-mobilenav-item-content:focus-visible {
        outline: 0 none;
        box-shadow: inset var(--focus-ring);
    }

    .p-mobilenav-item-content:hover,
    .p-mobilenav-item-active > .p-mobilenav-item-content {
        color: var(--primary-color);
    }

    .p-mobilenav-icon {
        display: inline-flex;
        width: 2rem;
        height: 2rem;
        align-items: center;
        justify-content: center;
        margin-right: .5rem;
        color: var(--surface-700);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        transition: color .2s;
    }

    .p-mobilenav-item-content:hover .p-mobilenav-icon,
    .p-mobilenav-item-active > .p-mobilenav-item-content .p-mobilenav-icon {
        color: var(--primary-color);
    }

    .p-mobilenav-toggle-icon {
        width: .875rem;
        height: .875rem;
        margin-left: auto;
        color: var(--surface-700);
        transition: transform .2s, color .2s;
    }

    .p-mobilenav-item-expanded > .p-mobilenav-item-content .p-mobilenav-toggle-icon {
        transform: rotate(180deg);
    }

    .p-mobilenav-item-content[aria-expanded="true"] .p-mobilenav-toggle-icon {
        transform: rotate(180deg);
    }

    .p-mobilenav-sublist {
        margin-left: 1rem;
        padding: .25rem 0;
    }

    .p-mobilenav-submenu-wrapper {
        overflow-y: hidden;
    }

    .p-mobilenav-sublist .p-mobilenav-item-content {
        padding: .5rem .5rem .5rem 1rem;
        color: var(--surface-700);
        font-weight: 450;
        border-left: 1px solid var(--surface-border);
        border-radius: 0;
    }

    .p-mobilenav-sublist .p-mobilenav-item-content:hover,
    .p-mobilenav-sublist .p-mobilenav-item-active > .p-mobilenav-item-content {
        color: var(--primary-color);
        border-left-color: var(--primary-color);
    }

    .p-mobilenav-sublist .p-mobilenav-icon {
        display: none;
    }

    .p-mobilenav-group-label {
        display: flex;
        padding: .5rem .5rem .5rem 0;
        margin-bottom: .25rem;
        color: var(--surface-900);
        font-size: .875rem;
        font-weight: 600;
        letter-spacing: 1px;
    }

    .p-mobilenav-sublist > .p-mobilenav-item:has(> .p-mobilenav-group-label) {
        margin-top: 1rem;
    }

    .p-mobilenav-sublist > .p-mobilenav-item:has(> .p-mobilenav-group-label):first-child {
        margin-top: 0;
    }

    .p-mobilenav-separator {
        height: 1px;
        margin: .5rem 0;
        background: var(--surface-border);
    }
}
`;

const classes = {
    root: ({ props }) => classNames('p-mobilenav', props.className),
    menu: 'p-mobilenav-list',
    submenu: 'p-mobilenav-sublist',
    submenuWrapper: 'p-mobilenav-submenu-wrapper',
    item: ({ active, expanded, item }) => classNames('p-mobilenav-item', item.className, { 'p-mobilenav-item-active': active, 'p-mobilenav-item-expanded': expanded }),
    action: 'p-mobilenav-item-content',
    icon: 'p-mobilenav-icon',
    toggleIcon: 'p-mobilenav-toggle-icon',
    label: 'p-mobilenav-label',
    groupLabel: 'p-mobilenav-group-label',
    separator: 'p-mobilenav-separator'
};

export const MobileNavBase = ComponentBase.extend({
    defaultProps: {
        __TYPE: 'MobileNav',
        activeItem: null,
        appendTo: null,
        ariaLabel: 'Navigation',
        baseZIndex: 0,
        blockScroll: true,
        className: null,
        closeOnSelect: true,
        dismissable: true,
        expandedKeys: null,
        id: null,
        maskClassName: null,
        maskStyle: null,
        model: null,
        onExpandedKeysChange: null,
        onHide: null,
        onItemSelect: null,
        onShow: null,
        position: 'left',
        style: null,
        visible: false
    },
    css: {
        classes,
        styles
    }
});
