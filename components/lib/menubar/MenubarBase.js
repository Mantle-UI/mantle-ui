import { ComponentBase } from '../componentbase/ComponentBase';
import { classNames } from '../utils/Utils';

const classes = {
    start: 'p-menubar-start',
    end: 'p-menubar-end',
    button: 'p-menubar-button',
    root: ({ mobileActiveState }) =>
        classNames('p-menubar p-component', {
            'p-menubar-mobile-active': mobileActiveState
        }),
    separator: 'p-menuitem-separator',
    icon: 'p-menuitem-icon',
    label: 'p-menuitem-text',
    submenuIcon: 'p-submenu-icon',
    menuitem: ({ active, focused, disabled }) => classNames('p-menuitem', { 'p-menuitem-active p-highlight': active, 'p-focus': focused, 'p-disabled': disabled }),
    menu: 'p-menubar-root-list',
    content: 'p-menuitem-content',
    submenu: 'p-submenu-list',
    action: ({ disabled }) => classNames('p-menuitem-link', { 'p-disabled': disabled })
};

const styles = `
@layer primereact {
    .p-menubar {
        display: flex;
        align-items: center;
    }

    .p-menubar ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .p-menubar .p-menuitem-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
    }

    .p-menubar .p-menuitem-text {
        line-height: 1;
    }

    .p-menubar .p-menuitem {
        position: relative;
    }

    .p-menubar-root-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }

    .p-menubar-root-list > li ul {
        display: none;
        z-index: 1;
    }

    .p-menubar-root-list > .p-menuitem-active > .p-submenu-list {
        display: block;
    }

    .p-menubar .p-submenu-list {
        display: none;
        position: absolute;
        z-index: 5;
    }

    .p-menubar .p-submenu-list > .p-menuitem-active > .p-submenu-list {
        display: block;
        left: 100%;
        top: 0;
    }

    .p-menubar .p-submenu-list .p-menuitem .p-menuitem-content .p-menuitem-link .p-submenu-icon {
        margin-left: auto;
    }

    .p-menubar .p-menubar-end {
        margin-left: auto;
        align-self: center;
    }

    .p-menubar-button {
        display: none;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        text-decoration: none;
    }

    /* Keep responsive navigation functional without a legacy theme stylesheet. */
    @media screen and (max-width: 960px) {
        .p-menubar {
            position: relative;
        }

        .p-menubar .p-menubar-button {
            display: flex;
        }

        .p-menubar > .p-menubar-root-list {
            display: none;
            position: absolute;
            width: 100%;
            top: 100%;
            left: 0;
        }

        .p-menubar .p-menubar-root-list .p-menuitem {
            width: 100%;
            position: static;
        }

        .p-menubar .p-menubar-root-list .p-submenu-list {
            width: 100%;
            position: static;
        }

        .p-menubar .p-menubar-root-list .p-menuitem > .p-menuitem-content > .p-menuitem-link > .p-submenu-icon {
            margin-left: auto;
        }

        .p-menubar .p-menubar-root-list > .p-menuitem-active > .p-menuitem-content > .p-menuitem-link > .p-submenu-icon {
            transform: rotate(-180deg);
        }

        .p-menubar .p-menubar-root-list .p-submenu-list .p-submenu-icon {
            transform: rotate(90deg);
        }

        .p-menubar .p-menubar-root-list .p-submenu-list > .p-menuitem-active > .p-menuitem-content > .p-menuitem-link > .p-submenu-icon {
            transform: rotate(-90deg);
        }

        .p-menubar.p-menubar-mobile-active > .p-menubar-root-list {
            display: flex;
            flex-direction: column;
            z-index: 1;
        }
    }
}
`;

export const MenubarBase = ComponentBase.extend({
    defaultProps: {
        __TYPE: 'Menubar',
        id: null,
        model: null,
        style: null,
        className: null,
        start: null,
        ariaLabel: null,
        ariaLabelledBy: null,
        onFocus: null,
        onBlur: null,
        submenuIcon: null,
        menuIcon: null,
        end: null,
        children: undefined
    },
    css: {
        classes,
        styles
    }
});
