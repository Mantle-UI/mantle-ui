const focusRingTokens = () => ({ width: '{focusRing.width}', style: '{focusRing.style}', color: '{focusRing.color}', offset: '{focusRing.offset}' });

const surfaceTokens = (overlay = false) => ({
    background: overlay ? '{overlay.background}' : '{surface.card}',
    color: overlay ? '{overlay.color}' : '{text.color}',
    borderColor: overlay ? '{overlay.borderColor}' : '{surface.border}',
    borderRadius: '{borderRadius.md}',
    padding: '0.5rem',
    shadow: overlay ? '0 8px 24px rgba(15, 23, 42, 0.12)' : 'none'
});

const itemTokens = (name, color = '{text.color}') => ({
    background: 'transparent',
    color,
    hoverBackground: 'color-mix(in srgb, {text.color}, transparent 94%)',
    hoverColor: `{${name}.color}`,
    focusBackground: `{${name}.hoverBackground}`,
    focusColor: `{${name}.color}`,
    activeBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)',
    activeColor: '{primary.color}',
    borderRadius: '{borderRadius.sm}',
    padding: '0.75rem 1rem',
    gap: '0.5rem',
    disabledOpacity: '{disabledOpacity}',
    transitionDuration: '{transitionDuration}',
    focusRing: focusRingTokens()
});

const iconTokens = (name) => ({
    color: '{text.mutedColor}',
    hoverColor: `{${name}.hoverColor}`,
    focusColor: `{${name}.focusColor}`,
    activeColor: `{${name}.activeColor}`,
    size: '1rem'
});

const menuTokens = (name, overlay = false) => ({
    root: surfaceTokens(overlay),
    item: itemTokens(`${name}.item`, overlay ? '{overlay.color}' : '{text.color}'),
    label: { color: 'inherit' },
    icon: iconTokens(`${name}.item`),
    submenuIcon: iconTokens(`${name}.item`),
    separator: { borderColor: '{surface.border}', margin: '0.25rem 0' },
    button: { ...itemTokens(`${name}.button`), size: '2rem', padding: '0', borderRadius: '50%' },
    buttonIcon: { color: 'inherit', size: '1.25rem' },
    mobileMenu: surfaceTokens(true),
    start: { color: `{${name}.root.color}` },
    end: { color: `{${name}.root.color}` }
});

/** Component tokens for the legacy navigation DOM and its native state classes. */
export const auraNavigationComponents = {
    breadcrumb: {
        root: { ...surfaceTokens(), padding: '1rem' },
        item: { ...itemTokens('breadcrumb.item'), padding: '0.25rem' },
        label: { color: 'inherit' },
        icon: iconTokens('breadcrumb.item'),
        home: { iconColor: '{breadcrumb.icon.color}', hoverIconColor: '{breadcrumb.icon.hoverColor}', focusIconColor: '{breadcrumb.icon.focusColor}', activeIconColor: '{breadcrumb.icon.activeColor}' },
        separator: { color: '{text.mutedColor}', margin: '0 0.5rem' },
        separatorIcon: { color: '{breadcrumb.separator.color}', size: '0.875rem' }
    },
    dock: {
        root: { color: '{text.color}' },
        container: { ...surfaceTokens(true), borderRadius: '{borderRadius.lg}' },
        menu: { gap: '0.25rem' },
        item: { ...itemTokens('dock.item'), padding: '0.5rem', size: '3rem' },
        icon: { ...iconTokens('dock.item'), size: '2rem' },
        header: { background: 'transparent', color: '{dock.root.color}', padding: '0.5rem' },
        footer: { background: 'transparent', color: '{dock.root.color}', padding: '0.5rem' }
    },
    megamenu: {
        ...menuTokens('megamenu', true),
        panel: surfaceTokens(true),
        submenu: { padding: '0.25rem' },
        submenuHeader: { background: 'transparent', color: '{text.mutedColor}', padding: '0.75rem 1rem', fontWeight: '600' },
        grid: { gap: '0' },
        column: { padding: '0.5rem' }
    },
    menubar: { ...menuTokens('menubar'), submenu: surfaceTokens(true) },
    panelmenu: {
        root: { color: '{text.color}' },
        panel: { margin: '0 0 0.25rem' },
        header: { ...itemTokens('panelmenu.header'), background: '{surface.card}', borderColor: '{surface.border}', borderRadius: '{borderRadius.md}', fontWeight: '600' },
        headerLabel: { color: 'inherit' },
        headerIcon: iconTokens('panelmenu.header'),
        headerSubmenuIcon: iconTokens('panelmenu.header'),
        content: { background: '{surface.card}', color: '{text.color}', borderColor: '{surface.border}', borderRadius: '{borderRadius.md}', padding: '0.25rem' },
        item: itemTokens('panelmenu.item'),
        label: { color: 'inherit' },
        icon: iconTokens('panelmenu.item'),
        submenuIcon: iconTokens('panelmenu.item'),
        submenu: { indent: '1rem' },
        separator: { borderColor: '{surface.border}', margin: '0.25rem 0' }
    },
    steps: {
        root: { background: '{surface.card}', color: '{text.color}', padding: '0.5rem' },
        item: { ...itemTokens('steps.item', '{text.mutedColor}'), activeBackground: 'transparent', activeColor: '{text.color}', padding: '0.25rem', gap: '0' },
        number: {
            background: '{steps.root.background}',
            color: '{text.mutedColor}',
            borderColor: '{surface.border}',
            hoverBackground: '{surface.100}',
            hoverColor: '{text.color}',
            hoverBorderColor: '{surface.border}',
            activeBackground: '{primary.color}',
            activeColor: '{primary.contrastColor}',
            activeBorderColor: '{primary.color}',
            size: '2rem',
            borderRadius: '50%',
            fontSize: '1rem'
        },
        label: { color: 'inherit', activeColor: '{text.color}', fontWeight: '400', activeFontWeight: '600', marginTop: '0.5rem' },
        icon: iconTokens('steps.item'),
        connector: { color: '{surface.border}', width: '1px', offset: 'calc({steps.number.size} / 2 + 0.25rem)' }
    },
    tabmenu: {
        root: { background: '{surface.card}', color: '{text.color}', borderColor: '{surface.border}', borderWidth: '2px' },
        item: {
            ...itemTokens('tabmenu.item', '{text.mutedColor}'),
            padding: '1rem 1.25rem',
            borderColor: 'transparent',
            hoverBorderColor: '{surface.border}',
            activeBorderColor: '{primary.color}',
            activeBackground: 'transparent',
            fontWeight: '600'
        },
        label: { color: 'inherit' },
        icon: iconTokens('tabmenu.item'),
        inkbar: { background: '{primary.color}', height: '{tabmenu.root.borderWidth}', borderRadius: '{borderRadius.sm}', transitionDuration: '{transitionDuration}' }
    }
};

const cssVariable = (prefix, path) =>
    `var(--${prefix}-${path
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replaceAll('.', '-')
        .toLowerCase()})`;

const rule = (selectors, declarations) => `${Array.isArray(selectors) ? selectors.join(',\n') : selectors} {\n${declarations}\n}\n`;

const focusCss = (name, variable) => `    outline: ${variable(`${name}.focusRing.width`)} ${variable(`${name}.focusRing.style`)} ${variable(`${name}.focusRing.color`)};
    outline-offset: ${variable(`${name}.focusRing.offset`)};
    box-shadow: none;`;

const surfaceCss = ({ selector, name, variable }) =>
    rule(
        selector,
        `    background: ${variable(`${name}.background`)};
    color: ${variable(`${name}.color`)};
    border: 1px solid ${variable(`${name}.borderColor`)};
    border-radius: ${variable(`${name}.borderRadius`)};
    padding: ${variable(`${name}.padding`)};
    box-shadow: ${variable(`${name}.shadow`)};`
    );

const contentCss = ({ selector, name, variable }) => rule(selector, `    background: ${variable(`${name}.background`)};\n    color: ${variable(`${name}.color`)};\n    padding: ${variable(`${name}.padding`)};`);

const iconCss = ({ selector, name, variable }) => rule(selector, `    color: ${variable(`${name}.color`)};\n    width: ${variable(`${name}.size`)};\n    height: ${variable(`${name}.size`)};\n    font-size: ${variable(`${name}.size`)};`);

const linkPaths = ({ root, itemClass, actionClass, contentClass }) => {
    const item = `${root} ${itemClass}`;
    const enabledItem = `${item}:not(.p-disabled):not([aria-disabled="true"])`;
    const content = contentClass ? `${item} > ${contentClass}` : '';
    const enabledContent = contentClass ? `${enabledItem} > ${contentClass}:not(.p-disabled)` : '';
    const action = `${content || item} > ${actionClass}`;
    const enabledAction = `${enabledContent || enabledItem} > ${actionClass}:not(.p-disabled):not([aria-disabled="true"])`;

    return { item, enabledItem, content, enabledContent, action, enabledAction, actionClass, contentClass };
};

const stateTargets = ({ paths, state, activeItem, activeAction, itemFocus }) => {
    const { enabledItem, enabledContent, enabledAction, actionClass, contentClass } = paths;
    const interaction = state === 'focus' ? ':focus-visible' : state === 'hover' ? ':hover' : ':active';
    const selectors = [`${enabledAction}${interaction}`];

    if (state === 'hover' && enabledContent) {
        selectors.push(`${enabledContent}:hover`);
    }

    const itemStates = state === 'focus' && itemFocus ? ['.p-focus', ':focus-visible'] : state === 'active' && activeItem ? [activeItem] : [];

    itemStates.forEach((suffix) => {
        const content = contentClass ? `${enabledItem}${suffix} > ${contentClass}:not(.p-disabled)` : '';

        if (content) {
            selectors.push(content);
        }

        selectors.push(`${content || `${enabledItem}${suffix}`} > ${actionClass}:not(.p-disabled):not([aria-disabled="true"])`);
    });

    if (state === 'active' && activeAction) {
        selectors.push(`${enabledAction}${activeAction}`);
    }

    return selectors;
};

const linkCss = ({
    root,
    name,
    variable,
    itemClass = '.p-menuitem',
    actionClass = '.p-menuitem-link',
    contentClass = '.p-menuitem-content',
    labelClass = '.p-menuitem-text',
    iconClass = '.p-menuitem-icon',
    iconName,
    labelName,
    submenuIcon = false,
    activeItem = '.p-menuitem-active',
    activeAction = '',
    itemFocus = true
}) => {
    const paths = linkPaths({ root, itemClass, actionClass, contentClass });
    const icon = iconName || `${name}.icon`;
    const label = labelName || `${name}.label`;
    const itemToken = labelName ? `${name}.header` : `${name}.item`;
    const target = paths.content || paths.action;
    const states = ['hover', 'focus', 'active'].map((state) => {
        const selectors = stateTargets({ paths, state, activeItem, activeAction, itemFocus });
        const backgrounds = paths.content
            ? selectors.map((selector) => {
                  const actionIndex = selector.lastIndexOf(` > ${actionClass}`);

                  return actionIndex < 0 ? selector : `${selector.slice(0, actionIndex)}:has(> ${selector.slice(actionIndex + 3)})`;
              })
            : selectors;

        return [
            rule(backgrounds, `    background: ${variable(`${itemToken}.${state}Background`)};`),
            rule(selectors, `    color: ${variable(`${itemToken}.${state}Color`)};${state === 'focus' ? `\n${focusCss(itemToken, variable)}` : ''}`),
            rule(
                selectors.map((selector) => `${selector} ${iconClass}`),
                `    color: ${variable(`${icon}.${state}Color`)};`
            ),
            submenuIcon
                ? rule(
                      selectors.map((selector) => `${selector} .p-submenu-icon`),
                      `    color: ${variable(`${labelName ? `${name}.headerSubmenuIcon` : `${name}.submenuIcon`}.${state}Color`)};`
                  )
                : ''
        ].join('\n');
    });

    return [
        rule(
            target,
            `    background: ${variable(`${itemToken}.background`)};\n    color: ${variable(`${itemToken}.color`)};\n    border-radius: ${variable(`${itemToken}.borderRadius`)};\n    transition: background ${variable(`${itemToken}.transitionDuration`)}, color ${variable(`${itemToken}.transitionDuration`)};`
        ),
        rule(
            paths.action,
            `    background: ${paths.content ? 'transparent' : variable(`${itemToken}.background`)};\n    color: ${paths.content ? 'inherit' : variable(`${itemToken}.color`)};\n    padding: ${variable(`${itemToken}.padding`)};\n    gap: ${variable(`${itemToken}.gap`)};\n    border-radius: ${variable(`${itemToken}.borderRadius`)};`
        ),
        labelClass ? rule(`${target} ${labelClass}`, `    color: ${variable(`${label}.color`)};`) : '',
        iconCss({ selector: `${target} ${iconClass}`, name: icon, variable }),
        submenuIcon ? iconCss({ selector: `${target} .p-submenu-icon`, name: labelName ? `${name}.headerSubmenuIcon` : `${name}.submenuIcon`, variable }) : '',
        ...states,
        rule([`${paths.item}.p-disabled > ${contentClass || actionClass}`, `${paths.item}[aria-disabled="true"] > ${contentClass || actionClass}`], `    opacity: ${variable(`${itemToken}.disabledOpacity`)};`)
    ].join('\n');
};

const controlCss = ({ root, name, selector, variable }) => {
    const enabled = `${root} ${selector}:not(:disabled):not(.p-disabled):not([aria-disabled="true"])`;

    return [
        rule(
            `${root} ${selector}`,
            `    background: ${variable(`${name}.button.background`)};\n    color: ${variable(`${name}.button.color`)};\n    border-radius: ${variable(`${name}.button.borderRadius`)};\n    width: ${variable(`${name}.button.size`)};\n    height: ${variable(`${name}.button.size`)};\n    padding: ${variable(`${name}.button.padding`)};\n    gap: ${variable(`${name}.button.gap`)};\n    transition: background ${variable(`${name}.button.transitionDuration`)}, color ${variable(`${name}.button.transitionDuration`)};`
        ),
        rule(`${enabled}:hover`, `    background: ${variable(`${name}.button.hoverBackground`)};\n    color: ${variable(`${name}.button.hoverColor`)};`),
        rule(`${enabled}:focus-visible`, `    background: ${variable(`${name}.button.focusBackground`)};\n    color: ${variable(`${name}.button.focusColor`)};\n${focusCss(`${name}.button`, variable)}`),
        rule([`${enabled}:active`, `${enabled}[aria-expanded="true"]`], `    background: ${variable(`${name}.button.activeBackground`)};\n    color: ${variable(`${name}.button.activeColor`)};`),
        rule([`${root} ${selector}:disabled`, `${root} ${selector}.p-disabled`, `${root} ${selector}[aria-disabled="true"]`], `    opacity: ${variable(`${name}.button.disabledOpacity`)};`),
        iconCss({ selector: `${root} ${selector} > .p-icon`, name: `${name}.buttonIcon`, variable })
    ].join('\n');
};

const separatorCss = ({ root, name, variable }) => rule(`${root} .p-menuitem-separator`, `    border: 0;\n    border-top: 1px solid ${variable(`${name}.separator.borderColor`)};\n    margin: ${variable(`${name}.separator.margin`)};`);

const menuCss = ({ name, variable }) => {
    const root = `.p-${name}`;

    return [
        surfaceCss({ selector: root, name: `${name}.root`, variable }),
        linkCss({ root, name, variable, submenuIcon: true }),
        rule(`${root} .p-${name}-root-list:focus-visible`, focusCss(`${name}.item`, variable)),
        surfaceCss({ selector: `${root}.p-${name}-mobile-active > .p-${name}-root-list`, name: `${name}.mobileMenu`, variable }),
        controlCss({ root, name, selector: `.p-${name}-button`, variable }),
        separatorCss({ root, name, variable }),
        rule(`${root} .p-${name}-start`, `    color: ${variable(`${name}.start.color`)};`),
        rule(`${root} .p-${name}-end`, `    color: ${variable(`${name}.end.color`)};`)
    ].join('\n');
};

const breadcrumbCss = (variable) => {
    const root = '.p-breadcrumb';
    const paths = linkPaths({ root, itemClass: '.p-menuitem', actionClass: '.p-menuitem-link' });
    const homeStates = ['hover', 'focus', 'active'].map((state) => {
        const homePaths = linkPaths({ root, itemClass: '.p-breadcrumb-home', actionClass: '.p-menuitem-link' });
        const selectors = stateTargets({ paths: homePaths, state, activeAction: '[aria-current="page"]', itemFocus: false });

        return rule(
            selectors.map((selector) => `${selector} .p-menuitem-icon`),
            `    color: ${variable(`breadcrumb.home.${state}IconColor`)};`
        );
    });

    return [
        surfaceCss({ selector: root, name: 'breadcrumb.root', variable }),
        linkCss({ root, name: 'breadcrumb', variable, contentClass: '', activeItem: '', activeAction: '[aria-current="page"]', itemFocus: false }),
        rule(`${root} .p-breadcrumb-home .p-menuitem-icon`, `    color: ${variable('breadcrumb.home.iconColor')};`),
        ...homeStates,
        rule(`${root} .p-menuitem-separator`, `    color: ${variable('breadcrumb.separator.color')};\n    margin: ${variable('breadcrumb.separator.margin')};`),
        iconCss({ selector: `${root} .p-breadcrumb-chevron`, name: 'breadcrumb.separatorIcon', variable }),
        rule(`${paths.enabledAction}[aria-current="page"]`, `    color: ${variable('breadcrumb.item.activeColor')};`)
    ].join('\n');
};

const dockCss = (variable) => {
    const paths = linkPaths({ root: '.p-dock', itemClass: '.p-dock-item', actionClass: '.p-dock-action', contentClass: '.p-menuitem-content' });

    return [
        rule('.p-dock', `    color: ${variable('dock.root.color')};`),
        surfaceCss({ selector: '.p-dock .p-dock-list-container', name: 'dock.container', variable }),
        contentCss({ selector: '.p-dock .p-dock-header', name: 'dock.header', variable }),
        contentCss({ selector: '.p-dock .p-dock-footer', name: 'dock.footer', variable }),
        rule('.p-dock .p-dock-list', `    gap: ${variable('dock.menu.gap')};`),
        linkCss({ root: '.p-dock', name: 'dock', variable, itemClass: '.p-dock-item', actionClass: '.p-dock-action', iconClass: '.p-dock-action-icon', labelClass: '', activeItem: '', iconName: 'dock.icon', labelName: '' }),
        rule(paths.action, `    width: ${variable('dock.item.size')};\n    height: ${variable('dock.item.size')};`),
        rule('.p-dock .p-dock-list:focus-visible', focusCss('dock.item', variable)),
        rule(
            '.p-dock .p-dock-item-current:not(.p-focus):not([aria-disabled="true"]) > .p-menuitem-content > .p-dock-action:not(.p-disabled)',
            `    background: ${variable('dock.item.hoverBackground')};\n    color: ${variable('dock.item.hoverColor')};`
        ),
        rule('.p-dock .p-dock-item-current:not(.p-focus):not([aria-disabled="true"]) > .p-menuitem-content > .p-dock-action:not(.p-disabled) .p-dock-action-icon', `    color: ${variable('dock.icon.hoverColor')};`)
    ].join('\n');
};

const panelMenuCss = (variable) => {
    const header = '.p-panelmenu .p-panelmenu-header';
    const paths = linkPaths({ root: '.p-panelmenu', itemClass: '.p-menuitem', actionClass: '.p-menuitem-link', contentClass: '.p-menuitem-content' });

    return [
        rule('.p-panelmenu', `    color: ${variable('panelmenu.root.color')};`),
        rule('.p-panelmenu .p-panelmenu-panel', `    margin: ${variable('panelmenu.panel.margin')};`),
        rule(`${header} > .p-panelmenu-header-content`, `    border: 1px solid ${variable('panelmenu.header.borderColor')};\n    font-weight: ${variable('panelmenu.header.fontWeight')};`),
        linkCss({
            root: '.p-panelmenu',
            name: 'panelmenu',
            variable,
            itemClass: '.p-panelmenu-header',
            actionClass: '.p-panelmenu-header-link',
            contentClass: '.p-panelmenu-header-content',
            iconName: 'panelmenu.headerIcon',
            labelName: 'panelmenu.headerLabel',
            submenuIcon: true,
            activeItem: '[aria-expanded="true"]'
        }),
        rule(`${header}:focus-visible`, '    outline: 0;'),
        rule(`${header}[aria-expanded="true"] > .p-panelmenu-header-content`, `    border-radius: ${variable('panelmenu.header.borderRadius')} ${variable('panelmenu.header.borderRadius')} 0 0;`),
        contentCss({ selector: '.p-panelmenu .p-panelmenu-content', name: 'panelmenu.content', variable }),
        rule(
            '.p-panelmenu .p-panelmenu-content',
            `    border: 1px solid ${variable('panelmenu.content.borderColor')};\n    border-top: 0;\n    border-radius: 0 0 ${variable('panelmenu.content.borderRadius')} ${variable('panelmenu.content.borderRadius')};`
        ),
        linkCss({ root: '.p-panelmenu', name: 'panelmenu', variable, submenuIcon: true, activeItem: '[aria-expanded="true"]' }),
        rule('.p-panelmenu .p-panelmenu-content .p-panelmenu-root-list:focus-visible', focusCss('panelmenu.item', variable)),
        rule('.p-panelmenu .p-submenu-list:not(.p-panelmenu-root-list)', `    padding-inline-start: ${variable('panelmenu.submenu.indent')};`),
        rule(`${paths.enabledItem}[aria-expanded="true"] > .p-menuitem-content > .p-menuitem-link`, `    color: ${variable('panelmenu.item.activeColor')};`),
        separatorCss({ root: '.p-panelmenu', name: 'panelmenu', variable })
    ].join('\n');
};

const stepsCss = (variable) => {
    const paths = linkPaths({ root: '.p-steps', itemClass: '.p-steps-item', actionClass: '.p-menuitem-link' });
    const current = `${paths.enabledItem}.p-steps-current > .p-menuitem-link`;

    return [
        contentCss({ selector: '.p-steps', name: 'steps.root', variable }),
        linkCss({ root: '.p-steps', name: 'steps', variable, itemClass: '.p-steps-item', contentClass: '', labelClass: '.p-steps-title', activeItem: '.p-steps-current', itemFocus: false }),
        rule('.p-steps > ol:focus-visible', focusCss('steps.item', variable)),
        rule(
            '.p-steps .p-steps-item:before',
            `    content: '';\n    position: absolute;\n    top: ${variable('steps.connector.offset')};\n    left: 0;\n    width: 100%;\n    border-top: ${variable('steps.connector.width')} solid ${variable('steps.connector.color')};`
        ),
        rule(paths.action, '    position: relative;'),
        rule(
            '.p-steps .p-steps-number',
            `    background: ${variable('steps.number.background')};\n    color: ${variable('steps.number.color')};\n    border: 1px solid ${variable('steps.number.borderColor')};\n    border-radius: ${variable('steps.number.borderRadius')};\n    width: ${variable('steps.number.size')};\n    height: ${variable('steps.number.size')};\n    font-size: ${variable('steps.number.fontSize')};`
        ),
        rule(
            `${paths.enabledAction.replace('.p-steps-item', '.p-steps-item:not(.p-steps-current)')}:hover .p-steps-number`,
            `    background: ${variable('steps.number.hoverBackground')};\n    color: ${variable('steps.number.hoverColor')};\n    border-color: ${variable('steps.number.hoverBorderColor')};`
        ),
        rule(`${current} .p-steps-number`, `    background: ${variable('steps.number.activeBackground')};\n    color: ${variable('steps.number.activeColor')};\n    border-color: ${variable('steps.number.activeBorderColor')};`),
        rule('.p-steps .p-steps-title', `    font-weight: ${variable('steps.label.fontWeight')};\n    margin-top: ${variable('steps.label.marginTop')};`),
        rule(`${current} .p-steps-title`, `    color: ${variable('steps.label.activeColor')};\n    font-weight: ${variable('steps.label.activeFontWeight')};`)
    ].join('\n');
};

const tabMenuCss = (variable) => {
    const paths = linkPaths({ root: '.p-tabmenu', itemClass: '.p-tabmenuitem', actionClass: '.p-menuitem-link' });

    return [
        rule('.p-tabmenu', `    background: ${variable('tabmenu.root.background')};\n    color: ${variable('tabmenu.root.color')};`),
        rule('.p-tabmenu .p-tabmenu-nav', `    position: relative;\n    border-bottom: ${variable('tabmenu.root.borderWidth')} solid ${variable('tabmenu.root.borderColor')};`),
        linkCss({ root: '.p-tabmenu', name: 'tabmenu', variable, itemClass: '.p-tabmenuitem', contentClass: '', activeItem: '.p-highlight', itemFocus: false }),
        rule(
            paths.action,
            `    border-bottom: ${variable('tabmenu.root.borderWidth')} solid ${variable('tabmenu.item.borderColor')};\n    margin-bottom: calc(-1 * ${variable('tabmenu.root.borderWidth')});\n    font-weight: ${variable('tabmenu.item.fontWeight')};\n    border-radius: ${variable('tabmenu.item.borderRadius')} ${variable('tabmenu.item.borderRadius')} 0 0;`
        ),
        rule(`${paths.enabledAction.replace('.p-tabmenuitem', '.p-tabmenuitem:not(.p-highlight)')}:hover`, `    border-bottom-color: ${variable('tabmenu.item.hoverBorderColor')};`),
        rule(`${paths.enabledItem}.p-highlight > .p-menuitem-link`, `    border-bottom-color: ${variable('tabmenu.item.activeBorderColor')};`),
        // Width and left are measured and written inline by TabMenu.
        rule(
            '.p-tabmenu .p-tabmenu-ink-bar',
            `    display: block;\n    position: absolute;\n    bottom: 0;\n    pointer-events: none;\n    background: ${variable('tabmenu.inkbar.background')};\n    height: ${variable('tabmenu.inkbar.height')};\n    border-radius: ${variable('tabmenu.inkbar.borderRadius')};\n    transition: left ${variable('tabmenu.inkbar.transitionDuration')}, width ${variable('tabmenu.inkbar.transitionDuration')};`
        )
    ].join('\n');
};

/** Flat rules are scoped by Aura after all component skins are concatenated. */
export const auraNavigationCss = ({ prefix = 'mantle' } = {}) => {
    const variable = (path) => cssVariable(prefix, path);

    return [
        breadcrumbCss(variable),
        dockCss(variable),
        menuCss({ name: 'megamenu', variable }),
        surfaceCss({ selector: '.p-megamenu .p-megamenu-panel', name: 'megamenu.panel', variable }),
        rule('.p-megamenu .p-megamenu-submenu', `    padding: ${variable('megamenu.submenu.padding')};`),
        contentCss({ selector: '.p-megamenu .p-megamenu-submenu-header', name: 'megamenu.submenuHeader', variable }),
        rule('.p-megamenu .p-megamenu-submenu-header', `    font-weight: ${variable('megamenu.submenuHeader.fontWeight')};`),
        rule('.p-megamenu .p-megamenu-submenu-header.p-disabled', `    opacity: ${variable('megamenu.item.disabledOpacity')};`),
        rule('.p-megamenu .p-megamenu-grid', `    gap: ${variable('megamenu.grid.gap')};`),
        rule('.p-megamenu .p-megamenu-grid > div[class*="p-megamenu-col-"]', `    padding: ${variable('megamenu.column.padding')};`),
        menuCss({ name: 'menubar', variable }),
        surfaceCss({ selector: '.p-menubar .p-submenu-list', name: 'menubar.submenu', variable }),
        panelMenuCss(variable),
        stepsCss(variable),
        tabMenuCss(variable)
    ].join('\n');
};
