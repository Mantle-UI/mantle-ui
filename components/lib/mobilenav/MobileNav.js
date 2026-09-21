import * as React from 'react';
import { useHandleStyle } from '../componentbase/ComponentBase';
import { ChevronDownIcon } from '../icons/chevrondown';
import { ESC_KEY_HANDLING_PRIORITIES, useDisplayOrder, useGlobalOnEscapeKey, useMergeProps } from '../hooks/Hooks';
import { Portal } from '../portal/Portal';
import { StyleClass } from '../styleclass/StyleClass';
import { DomHandler, IconUtils, ObjectUtils, UniqueComponentId, classNames } from '../utils/Utils';
import { MobileNavBase } from './MobileNavBase';

export const MobileNav = React.forwardRef((inProps, ref) => {
    const mergeProps = useMergeProps();
    const props = MobileNavBase.getProps(inProps);
    const [idState] = React.useState(props.id || UniqueComponentId('mobilenav_'));
    const [expandedKeysState] = React.useState({});
    const [rendered, setRendered] = React.useState(props.visible);
    const itemRefs = React.useRef({});
    const maskRef = React.useRef(null);
    const activate = React.useCallback(() => {
        rootRef.current?.classList.add('p-mobilenav-active');
        maskRef.current?.classList.add('p-mobilenav-mask-active');
    }, []);
    const { ptm, cx, isUnstyled } = MobileNavBase.setMetaData({ props, state: { id: idState, expandedKeys: expandedKeysState } });

    useHandleStyle(MobileNavBase.css.styles, isUnstyled, { name: 'mobilenav' });

    React.useEffect(() => {
        let timer;
        let frame;

        if (props.visible) {
            setRendered(true);

            // When the Portal already exists (for example a close followed by an
            // immediate reopen), it has a rendered inactive drawer we can animate.
            if (rootRef.current) {
                frame = requestAnimationFrame(activate);
            }

            props.blockScroll && DomHandler.blockBodyScroll();
        } else {
            rootRef.current?.classList.remove('p-mobilenav-active');
            maskRef.current?.classList.remove('p-mobilenav-mask-active');
            props.blockScroll && DomHandler.unblockBodyScroll();
            timer = setTimeout(() => setRendered(false), 400);
        }

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(frame);
        };
    }, [props.visible, props.blockScroll, activate]);

    const mobileNavDisplayOrder = useDisplayOrder('mobilenav', props.visible);

    useGlobalOnEscapeKey({
        callback: (event) => props.onHide && props.onHide(event),
        when: props.visible && mobileNavDisplayOrder,
        priority: [ESC_KEY_HANDLING_PRIORITIES.SIDEBAR, mobileNavDisplayOrder]
    });

    const getItemValue = (item, name) => ObjectUtils.getItemValue(item[name]);
    const getItemKey = (item, key) => getItemValue(item, 'id') || key;
    const getItems = (item) => getItemValue(item, 'items') || [];

    const getItemRef = (key) => {
        if (!itemRefs.current[key]) itemRefs.current[key] = React.createRef();

        return itemRefs.current[key];
    };

    const isItemVisible = (item) => getItemValue(item, 'visible') !== false;
    const isItemActive = (item) => props.activeItem != null && (props.activeItem === item || props.activeItem === getItemValue(item, 'id') || props.activeItem === getItemValue(item, 'url'));
    const hasActiveDescendant = (item) => getItems(item).some((child) => isItemActive(child) || hasActiveDescendant(child));

    const isItemExpanded = (item, key) => {
        const expandedKeys = props.expandedKeys || expandedKeysState;

        return expandedKeys[getItemKey(item, key)] ?? getItemValue(item, 'expanded') ?? hasActiveDescendant(item);
    };

    const onItemClick = (event, item, key) => {
        if (getItemValue(item, 'disabled')) {
            event.preventDefault();

            return;
        }

        const items = getItems(item);

        if (items.length) {
            event.preventDefault();
            const action = event.currentTarget;

            // StyleClass owns the visual open/close operation, exactly as the
            // documentation sidebar does. Mirror its completed state to the
            // accessibility tree without re-rendering the menu.
            setTimeout(() => {
                const submenu = action.nextElementSibling;
                const collapsed = submenu?.classList.contains('hidden');

                if (submenu) {
                    submenu.setAttribute('aria-hidden', String(collapsed));
                    submenu.querySelectorAll('a, button').forEach((element) => {
                        element.tabIndex = collapsed ? -1 : 0;
                    });
                    action.setAttribute('aria-expanded', String(!collapsed));
                }
            }, 0);

            return;
        }

        item.command && item.command({ originalEvent: event, item });
        props.onItemSelect && props.onItemSelect({ originalEvent: event, item });

        if (props.closeOnSelect) {
            props.onHide && props.onHide(event);
        }
    };

    const createIcon = (item) => {
        const icon = getItemValue(item, 'icon');

        if (!icon) {
            return null;
        }

        const iconProps = mergeProps({ className: cx('icon') }, ptm('icon', { context: { item } }));

        return <span {...iconProps}>{IconUtils.getJSXIcon(icon, {}, { props, item })}</span>;
    };

    const createMenuItem = (item, key, level, hidden) => {
        if (!isItemVisible(item)) {
            return null;
        }

        if (item.separator) {
            return <li {...mergeProps({ className: cx('separator'), role: 'separator' }, ptm('separator', { context: { item } }))} key={key} />;
        }

        const items = getItems(item);
        const hasItems = items.length > 0;
        const active = isItemActive(item);
        const expanded = hasItems && isItemExpanded(item, key);
        const initiallyExpanded = hasItems && (getItemValue(item, 'expanded') || hasActiveDescendant(item));
        const label = getItemValue(item, 'label');
        const icon = createIcon(item);
        const labelElement = <span key="label" {...mergeProps({ className: cx('label') }, ptm('label', { context: { item } }))}>{label}</span>;
        const toggleElement = hasItems ? <ChevronDownIcon key="toggle" {...mergeProps({ className: cx('toggleIcon') }, ptm('toggleIcon', { context: { item, expanded } }))} /> : null;
        const actionProps = mergeProps(
            {
                className: cx('action'),
                onClick: (event) => onItemClick(event, item, key),
                'aria-current': active && !hasItems ? 'page' : undefined,
                'aria-expanded': hasItems ? expanded : undefined,
                'aria-controls': hasItems ? `${idState}_${key}_group` : undefined,
                tabIndex: hidden ? -1 : undefined
            },
            ptm('action', { context: { item, active, expanded } })
        );
        const action = hasItems
            ? React.createElement('button', { key: 'action', type: 'button', ...actionProps, disabled: getItemValue(item, 'disabled') }, icon && React.cloneElement(icon, { key: 'icon' }), labelElement, toggleElement)
            : React.createElement('a', { key: 'action', ...actionProps, href: getItemValue(item, 'url') || '#', target: getItemValue(item, 'target') }, icon && React.cloneElement(icon, { key: 'icon' }), labelElement, toggleElement);

        const element =
            hasItems && level === 0 ? (
                <StyleClass nodeRef={getItemRef(key)} selector="@next" enterClassName="hidden" enterActiveClassName="slidedown" leaveToClassName="hidden" leaveActiveClassName="slideup">
                    {React.cloneElement(action, { ref: getItemRef(key) })}
                </StyleClass>
            ) : (
                action
            );

        if (level > 0 && hasItems && !getItemValue(item, 'url')) {
            return (
                <li {...mergeProps({ className: cx('item', { item, active, expanded: true }) }, ptm('menuitem', { context: { item, active, expanded: true } }))} key={key}>
                    <span {...mergeProps({ className: cx('groupLabel') }, ptm('groupLabel', { context: { item } }))}>{label}</span>
                    {createMenu(items, `${key}_`, level + 1, hidden)}
                </li>
            );
        }

        if (!hasItems) {
            return (
                <li {...mergeProps({ className: cx('item', { item, active, expanded }) }, ptm('menuitem', { context: { item, active, expanded } }))} key={key}>
                    {element}
                </li>
            );
        }

        return (
            <li {...mergeProps({ className: cx('item', { item, active, expanded }) }, ptm('menuitem', { context: { item, active, expanded } }))} key={key}>
                {element}
                <div
                    key="submenu"
                    {...mergeProps(
                        {
                            // Keep the original documentation menu's contract:
                            // StyleClass toggles `hidden` on this direct sibling.
                            className: classNames('overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out', cx('submenuWrapper'), { hidden: !initiallyExpanded }),
                            'aria-hidden': !initiallyExpanded
                        },
                        ptm('submenuWrapper', { context: { item, expanded } })
                    )}
                >
                    {createMenu(items, `${key}_`, level + 1, hidden || !expanded)}
                </div>
            </li>
        );
    };

    const createMenu = (items, parentKey = '', level = 0, hidden = false) => {
        if (!items.length) {
            return null;
        }

        const menuItems = [];

        items.forEach((item, index) => {
            const key = `${parentKey}${getItemKey(item, index)}`;
            const menuItem = createMenuItem(item, key, level, hidden);

            if (menuItem) {
                menuItems.push(React.cloneElement(menuItem, { key }));
            }
        });

        return React.createElement('ol', mergeProps({ id: level ? `${idState}_${parentKey.slice(0, -1)}_group` : undefined, className: level ? cx('submenu') : cx('menu') }, ptm(level ? 'submenu' : 'menu')), ...menuItems);
    };

    const rootRef = React.useRef(null);

    React.useImperativeHandle(ref, () => ({
        props,
        getElement: () => rootRef.current
    }));

    if (!rendered) return null;

    return (
        <Portal
            appendTo={props.appendTo}
            visible
            onMounted={() => {
                // A new Portal first mounts the inactive drawer, then activates it
                // on its next render. This is the same before/after state the old
                // documentation sidebar used, without a timeout delay.
                if (props.visible) {
                    requestAnimationFrame(activate);
                }
            }}
        >
            <div
                ref={maskRef}
                className={classNames('p-mobilenav-mask', props.maskClassName)}
                style={props.maskStyle}
                onMouseDown={(event) => props.dismissable && event.target === event.currentTarget && props.onHide && props.onHide(event)}
            >
                <aside ref={rootRef} id={props.id} className={cx('root')} style={props.style}>
                    <nav {...mergeProps({ 'aria-label': props.ariaLabel }, ptm('nav'))}>{createMenu(props.model || [])}</nav>
                </aside>
            </div>
        </Portal>
    );
});
