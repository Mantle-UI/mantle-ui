const surfaceTokens = () => ({
    background: '{overlay.background}',
    borderColor: '{overlay.borderColor}',
    color: '{overlay.color}',
    borderRadius: '{overlay.root.borderRadius}',
    shadow: '{overlay.root.shadow}'
});

const focusRingTokens = () => ({
    width: '{focusRing.width}',
    style: '{focusRing.style}',
    color: '{focusRing.color}',
    offset: '{focusRing.offset}'
});

const maskTokens = () => ({
    background: 'color-mix(in srgb, {surface.700} 40%, transparent)',
    color: '{surface.0}',
    transitionDuration: '{transitionDuration}'
});

const closeButtonTokens = () => ({
    background: 'transparent',
    color: '{text.mutedColor}',
    hoverBackground: '{surface.100}',
    hoverColor: '{text.color}',
    activeBackground: '{surface.200}',
    activeColor: '{text.color}',
    size: '2rem',
    borderRadius: '50%',
    disabledOpacity: '{disabledOpacity}',
    transitionDuration: '{transitionDuration}',
    focusRing: focusRingTokens()
});

const contentTokens = (name, padding = '1.25rem') => ({
    background: `{${name}.root.background}`,
    color: `{${name}.root.color}`,
    padding
});

const dialogTokens = (name) => ({
    root: surfaceTokens(),
    header: { ...contentTokens(name), gap: '0.5rem' },
    title: { color: `{${name}.header.color}`, fontSize: '1.25rem', fontWeight: '600' },
    content: contentTokens(name, '0 1.25rem 1.25rem'),
    footer: { ...contentTokens(name, '0 1.25rem 1.25rem'), buttonGap: '0.5rem' },
    closeButton: closeButtonTokens(),
    closeIcon: { size: '1rem', color: 'inherit' },
    mask: maskTokens()
});

const menuTokens = (name, nested = false) => ({
    root: { ...surfaceTokens(), padding: '0.25rem' },
    item: {
        background: 'transparent',
        color: '{overlay.color}',
        hoverBackground: `{${name}.item.focusBackground}`,
        hoverColor: `{${name}.item.color}`,
        focusBackground: 'color-mix(in srgb, {overlay.color}, transparent 94%)',
        focusColor: `{${name}.item.color}`,
        activeBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)',
        activeColor: '{primary.color}',
        borderRadius: '{borderRadius.sm}',
        padding: '0.75rem 1rem',
        gap: '0.5rem',
        disabledOpacity: '{disabledOpacity}',
        transitionDuration: '{transitionDuration}',
        focusRing: focusRingTokens()
    },
    label: { color: 'inherit' },
    icon: {
        color: '{text.mutedColor}',
        hoverColor: `{${name}.item.hoverColor}`,
        focusColor: `{${name}.item.focusColor}`,
        activeColor: `{${name}.item.activeColor}`,
        size: '1rem'
    },
    separator: { borderColor: '{surface.border}', margin: '0.25rem 0' },
    ...(nested
        ? {
              submenu: { ...surfaceTokens(), padding: '0.25rem' },
              submenuIcon: {
                  color: `{${name}.icon.color}`,
                  hoverColor: `{${name}.icon.hoverColor}`,
                  focusColor: `{${name}.icon.focusColor}`,
                  activeColor: `{${name}.icon.activeColor}`,
                  size: '1rem'
              }
          }
        : {})
});

/** Component tokens for the legacy overlay and navigation DOM. */
export const auraOverlayComponents = {
    dialog: dialogTokens('dialog'),
    sidebar: {
        root: surfaceTokens(),
        header: { ...contentTokens('sidebar'), gap: '0.5rem' },
        content: contentTokens('sidebar', '0 1.25rem 1.25rem'),
        closeButton: closeButtonTokens(),
        closeIcon: { size: '1rem', color: 'inherit' },
        mask: maskTokens()
    },
    overlaypanel: {
        root: surfaceTokens(),
        content: contentTokens('overlaypanel'),
        closeButton: closeButtonTokens(),
        closeIcon: { size: '1rem', color: 'inherit' },
        arrow: { color: '{overlaypanel.root.background}', borderColor: '{overlaypanel.root.borderColor}' }
    },
    tooltip: {
        root: surfaceTokens(),
        text: { padding: '0.5rem 0.75rem' },
        arrow: { color: '{tooltip.root.background}' }
    },
    confirmpopup: {
        root: surfaceTokens(),
        content: { ...contentTokens('confirmpopup'), gap: '0.75rem' },
        footer: { ...contentTokens('confirmpopup', '0 1.25rem 1.25rem'), buttonGap: '0.5rem' },
        icon: { color: '{text.mutedColor}', size: '1.5rem' },
        message: { color: '{confirmpopup.content.color}' },
        arrow: { color: '{confirmpopup.root.background}', borderColor: '{confirmpopup.root.borderColor}' }
    },
    confirmdialog: {
        ...dialogTokens('confirmdialog'),
        icon: { color: '{text.mutedColor}', size: '2rem' },
        message: { color: '{confirmdialog.content.color}', margin: '0 0 0 1rem' }
    },
    menu: {
        ...menuTokens('menu'),
        submenuHeader: { background: '{menu.root.background}', color: '{text.mutedColor}', padding: '0.75rem 1rem', fontWeight: '600' }
    },
    tieredmenu: menuTokens('tieredmenu', true),
    contextmenu: menuTokens('contextmenu', true),
    slidemenu: {
        ...menuTokens('slidemenu', true),
        backward: {
            background: '{slidemenu.root.background}',
            color: '{text.mutedColor}',
            hoverBackground: '{slidemenu.item.hoverBackground}',
            hoverColor: '{slidemenu.item.hoverColor}',
            activeBackground: '{slidemenu.item.activeBackground}',
            activeColor: '{slidemenu.item.activeColor}',
            padding: '0.75rem 1rem',
            borderColor: '{slidemenu.separator.borderColor}',
            transitionDuration: '{transitionDuration}',
            focusRing: focusRingTokens()
        },
        backwardIcon: { color: 'inherit', size: '1rem', margin: '0 0.5rem 0 0' }
    },
    mobilenav: {
        // The Base's important native surface rules consume this local alias.
        root: { background: '{surface.overlay}', color: '{text.color}', borderRadius: '0' },
        item: {
            background: 'transparent',
            color: '{text.color}',
            hoverBackground: 'color-mix(in srgb, {text.color}, transparent 94%)',
            hoverColor: '{primary.color}',
            focusBackground: 'color-mix(in srgb, {text.color}, transparent 94%)',
            focusColor: '{text.color}',
            activeBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)',
            activeColor: '{primary.color}',
            borderRadius: '{borderRadius.md}',
            disabledOpacity: '{disabledOpacity}',
            transitionDuration: '{transitionDuration}',
            focusRing: focusRingTokens()
        },
        label: { color: 'inherit' },
        icon: {
            color: '{text.mutedColor}',
            borderColor: '{surface.border}',
            borderRadius: '{borderRadius.md}',
            hoverColor: '{primary.color}',
            focusColor: '{mobilenav.item.focusColor}',
            activeColor: '{primary.color}'
        },
        submenu: { color: '{text.mutedColor}', borderColor: '{surface.border}', hoverBorderColor: '{primary.color}', activeBorderColor: '{primary.color}' },
        submenuIcon: { color: '{text.mutedColor}', hoverColor: '{primary.color}', focusColor: '{mobilenav.item.focusColor}', activeColor: '{primary.color}' },
        groupLabel: { color: '{text.color}' },
        separator: { background: '{surface.border}' },
        mask: maskTokens()
    },
    blockui: {
        // The mask is the fullscreen root; it is a backdrop, not a content card.
        root: { background: 'color-mix(in srgb, {surface.700} 40%, transparent)', color: '{surface.0}' },
        mask: { background: '{blockui.root.background}', color: '{blockui.root.color}', transitionDuration: '{transitionDuration}' }
    }
};

const cssVariable = (prefix, path) =>
    `var(--${prefix}-${path
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replaceAll('.', '-')
        .toLowerCase()})`;

const rule = (selectors, declarations) => `${Array.isArray(selectors) ? selectors.join(',\n') : selectors} {\n${declarations}\n}\n`;

const surfaceCss = ({ selector, name, variable, padding = false }) =>
    rule(
        selector,
        `    background: ${variable(`${name}.background`)};
    border: 1px solid ${variable(`${name}.borderColor`)};
    border-radius: ${variable(`${name}.borderRadius`)};
    box-shadow: ${variable(`${name}.shadow`)};
    color: ${variable(`${name}.color`)};${padding ? `\n    padding: ${variable(`${name}.padding`)};` : ''}`
    );

const contentCss = ({ selector, name, variable }) =>
    rule(
        selector,
        `    background: ${variable(`${name}.background`)};
    color: ${variable(`${name}.color`)};
    padding: ${variable(`${name}.padding`)};`
    );

const focusCss = (name, variable) => `    outline: ${variable(`${name}.focusRing.width`)} ${variable(`${name}.focusRing.style`)} ${variable(`${name}.focusRing.color`)};
    outline-offset: ${variable(`${name}.focusRing.offset`)};
    box-shadow: none;`;

const closeButtonCss = ({ selector, name, iconSelector, variable }) => {
    const token = `${name}.closeButton`;

    return [
        rule(
            selector,
            `    background: ${variable(`${token}.background`)};
    border: 0;
    border-radius: ${variable(`${token}.borderRadius`)};
    color: ${variable(`${token}.color`)};
    width: ${variable(`${token}.size`)};
    height: ${variable(`${token}.size`)};
    transition: background ${variable(`${token}.transitionDuration`)}, color ${variable(`${token}.transitionDuration`)};`
        ),
        rule(`${selector}:enabled:hover`, `    background: ${variable(`${token}.hoverBackground`)};\n    color: ${variable(`${token}.hoverColor`)};`),
        rule(`${selector}:enabled:active`, `    background: ${variable(`${token}.activeBackground`)};\n    color: ${variable(`${token}.activeColor`)};`),
        rule(`${selector}:enabled:focus-visible`, focusCss(token, variable)),
        rule(`${selector}:disabled`, `    opacity: ${variable(`${token}.disabledOpacity`)};`),
        rule(iconSelector, `    color: ${variable(`${name}.closeIcon.color`)};\n    width: ${variable(`${name}.closeIcon.size`)};\n    height: ${variable(`${name}.closeIcon.size`)};\n    font-size: ${variable(`${name}.closeIcon.size`)};`)
    ].join('\n');
};

const maskCss = ({ selector, name, variable }) => rule(selector, `    background: ${variable(`${name}.mask.background`)};\n    color: ${variable(`${name}.mask.color`)};\n    transition-duration: ${variable(`${name}.mask.transitionDuration`)};`);

const dialogCss = ({ selector, name, maskSelector, variable }) =>
    [
        surfaceCss({ selector, name: `${name}.root`, variable }),
        contentCss({ selector: `${selector} > .p-dialog-header`, name: `${name}.header`, variable }),
        rule(`${selector} > .p-dialog-header`, `    gap: ${variable(`${name}.header.gap`)};\n    border-radius: ${variable(`${name}.root.borderRadius`)} ${variable(`${name}.root.borderRadius`)} 0 0;`),
        rule(`${selector} > .p-dialog-header > .p-dialog-header-icons`, `    gap: ${variable(`${name}.header.gap`)};`),
        rule(`${selector} > .p-dialog-header > .p-dialog-title`, `    color: ${variable(`${name}.title.color`)};\n    font-size: ${variable(`${name}.title.fontSize`)};\n    font-weight: ${variable(`${name}.title.fontWeight`)};`),
        contentCss({ selector: `${selector} > .p-dialog-content`, name: `${name}.content`, variable }),
        rule(`${selector}:not(:has(> .p-dialog-footer)) > .p-dialog-content`, `    border-radius: 0 0 ${variable(`${name}.root.borderRadius`)} ${variable(`${name}.root.borderRadius`)};`),
        contentCss({ selector: `${selector} > .p-dialog-footer`, name: `${name}.footer`, variable }),
        rule(`${selector} > .p-dialog-footer`, `    text-align: end;\n    border-radius: 0 0 ${variable(`${name}.root.borderRadius`)} ${variable(`${name}.root.borderRadius`)};`),
        rule(`${selector} > .p-dialog-footer > .p-button + .p-button`, `    margin-inline-start: ${variable(`${name}.footer.buttonGap`)};`),
        closeButtonCss({
            selector: `${selector} > .p-dialog-header > .p-dialog-header-icons > .p-dialog-header-icon`,
            name,
            iconSelector: [
                `${selector} > .p-dialog-header > .p-dialog-header-icons > .p-dialog-header-icon .p-dialog-header-close-icon`,
                `${selector} > .p-dialog-header > .p-dialog-header-icons > .p-dialog-header-icon .p-dialog-header-maximize-icon`
            ],
            variable
        }),
        maskCss({ selector: maskSelector, name, variable })
    ].join('\n');

const arrowCss = ({ selector, name, variable }) =>
    [
        rule(`${selector}:before`, `    border-style: solid;\n    border-color: transparent;\n    border-bottom-color: ${variable(`${name}.arrow.borderColor`)};`),
        rule(`${selector}:after`, `    border-style: solid;\n    border-color: transparent;\n    border-bottom-color: ${variable(`${name}.arrow.color`)};`),
        rule(`${selector}.${selector.slice(1)}-flipped:before`, `    border-bottom-color: transparent;\n    border-top-color: ${variable(`${name}.arrow.borderColor`)};`),
        rule(`${selector}.${selector.slice(1)}-flipped:after`, `    border-bottom-color: transparent;\n    border-top-color: ${variable(`${name}.arrow.color`)};`)
    ].join('\n');

const menuCss = ({ name, variable, nested = false, direct = false }) => {
    const root = `.p-${name}`;
    const enabledItem = `${root} .p-menuitem:not(.p-disabled):not([aria-disabled="true"])`;
    const enabledLink = '.p-menuitem-link:not(.p-disabled):not([aria-disabled="true"])';
    const link = direct ? `${root} .p-menuitem > .p-menuitem-link` : `${root} .p-menuitem > .p-menuitem-content > .p-menuitem-link`;
    const target = direct ? link : `${root} .p-menuitem > .p-menuitem-content`;
    // Menu's documented template callback can replace the content wrapper with
    // an action that retains the supplied option className.
    const templateLink = name === 'menu' ? `${root} .p-menuitem > .p-menuitem-link` : null;

    const stateTargets = (state) => {
        const itemState = state === 'focus' ? '.p-focus' : state === 'active' ? '.p-menuitem-active' : '';
        const interaction = state === 'hover' ? ':hover' : state === 'focus' ? ':focus-visible' : ':active';
        const content = `${enabledItem}${itemState} > .p-menuitem-content:not(.p-disabled)`;
        const action = direct ? `${enabledItem}${itemState} > ${enabledLink}` : `${content} > ${enabledLink}`;
        const interactiveAction = direct ? `${enabledItem} > ${enabledLink}${interaction}` : `${enabledItem} > .p-menuitem-content:not(.p-disabled) > ${enabledLink}${interaction}`;
        const selectors = state === 'hover' ? (direct ? [interactiveAction] : [`${content}:hover`, interactiveAction]) : direct ? [action, interactiveAction] : [content, action, interactiveAction];
        const painters = direct ? selectors : state === 'hover' ? [`${content}:hover`] : [content, `${enabledItem} > .p-menuitem-content:not(.p-disabled):has(> ${enabledLink}${interaction})`];
        const templateSelectors = templateLink ? [...(state === 'hover' ? [] : [`${enabledItem}${itemState} > ${enabledLink}`]), `${enabledItem} > ${enabledLink}${interaction}`] : [];

        return { selectors: [...selectors, ...templateSelectors], painters: [...painters, ...templateSelectors] };
    };

    const states = ['hover', 'focus', 'active'].map((state) => {
        const { selectors, painters } = stateTargets(state);

        return [
            rule(painters, `    background: ${variable(`${name}.item.${state}Background`)};`),
            rule(selectors, `    color: ${variable(`${name}.item.${state}Color`)};${state === 'focus' ? `\n${focusCss(`${name}.item`, variable)}` : ''}`),
            rule(
                selectors.map((selector) => `${selector} .p-menuitem-icon`),
                `    color: ${variable(`${name}.icon.${state}Color`)};`
            ),
            nested
                ? rule(
                      selectors.map((selector) => `${selector} .p-submenu-icon`),
                      `    color: ${variable(`${name}.submenuIcon.${state}Color`)};`
                  )
                : ''
        ].join('\n');
    });
    const separator = name === 'menu' ? '.p-menu-separator' : name === 'slidemenu' ? '.p-slidemenu-separator:not(.p-slidemenu-backward)' : '.p-menuitem-separator';
    const list = name === 'menu' ? '.p-menu-list' : name === 'slidemenu' ? '.p-slidemenu-rootlist' : `.p-${name}-root-list`;

    return [
        surfaceCss({ selector: root, name: `${name}.root`, variable, padding: true }),
        rule(`${root} ${list}:focus-visible`, focusCss(`${name}.item`, variable)),
        rule(
            templateLink ? [target, templateLink] : target,
            `    background: ${variable(`${name}.item.background`)};\n    color: ${variable(`${name}.item.color`)};\n    border-radius: ${variable(`${name}.item.borderRadius`)};\n    transition: background ${variable(`${name}.item.transitionDuration`)}, color ${variable(`${name}.item.transitionDuration`)};`
        ),
        rule(
            templateLink ? [link, templateLink] : link,
            `    color: ${direct ? variable(`${name}.item.color`) : 'inherit'};\n    border-radius: ${variable(`${name}.item.borderRadius`)};\n    padding: ${variable(`${name}.item.padding`)};\n    gap: ${variable(`${name}.item.gap`)};`
        ),
        // A wrapped action inherits text states but its content wrapper paints
        // the background once, including translucent normal/state colors.
        !direct ? rule(link, '    background: transparent;') : '',
        templateLink ? rule(templateLink, `    color: ${variable(`${name}.item.color`)};`) : '',
        rule(`${root} .p-menuitem-text`, `    color: ${variable(`${name}.label.color`)};`),
        rule(`${root} .p-menuitem-icon`, `    color: ${variable(`${name}.icon.color`)};\n    font-size: ${variable(`${name}.icon.size`)};\n    width: ${variable(`${name}.icon.size`)};\n    height: ${variable(`${name}.icon.size`)};`),
        nested ? surfaceCss({ selector: `${root} .p-submenu-list`, name: `${name}.submenu`, variable, padding: true }) : '',
        nested
            ? rule(
                  `${root} .p-submenu-icon`,
                  `    color: ${variable(`${name}.submenuIcon.color`)};\n    width: ${variable(`${name}.submenuIcon.size`)};\n    height: ${variable(`${name}.submenuIcon.size`)};\n    font-size: ${variable(`${name}.submenuIcon.size`)};`
              )
            : '',
        ...states,
        rule(
            direct
                ? `${root} .p-menuitem.p-disabled > .p-menuitem-link`
                : [
                      `${root} .p-menuitem.p-disabled > .p-menuitem-content`,
                      `${root} .p-menuitem[aria-disabled="true"] > .p-menuitem-content`,
                      `${root} .p-menuitem-content.p-disabled`,
                      ...(templateLink ? [`${templateLink}.p-disabled`, `${root} .p-menuitem[aria-disabled="true"] > .p-menuitem-link`] : [])
                  ],
            `    opacity: ${variable(`${name}.item.disabledOpacity`)};`
        ),
        rule(`${root} ${separator}`, `    border: 0;\n    border-top: 1px solid ${variable(`${name}.separator.borderColor`)};\n    margin: ${variable(`${name}.separator.margin`)};`)
    ].join('\n');
};

const mobileNavCss = (variable) => {
    const action = '.p-mobilenav .p-mobilenav-item-content';
    const enabledAction = `${action}:not(:disabled):not([aria-disabled="true"])`;
    const activeAction = '.p-mobilenav .p-mobilenav-item-active > .p-mobilenav-item-content:not(:disabled):not([aria-disabled="true"])';
    const states = ['hover', 'focus', 'active'].map((state) => {
        const selectors = state === 'active' ? [activeAction, `${enabledAction}:active`] : [`${enabledAction}${state === 'focus' ? ':focus-visible' : ':hover'}`];

        return [
            rule(selectors, `    background: ${variable(`mobilenav.item.${state}Background`)};\n    color: ${variable(`mobilenav.item.${state}Color`)};${state === 'focus' ? `\n${focusCss('mobilenav.item', variable)}` : ''}`),
            rule(
                selectors.map((selector) => `${selector} .p-mobilenav-icon`),
                `    color: ${variable(`mobilenav.icon.${state}Color`)};`
            ),
            rule(
                selectors.map((selector) => `${selector} .p-mobilenav-toggle-icon`),
                `    color: ${variable(`mobilenav.submenuIcon.${state}Color`)};`
            )
        ].join('\n');
    });

    return [
        rule('.p-mobilenav', `    --surface-overlay: ${variable('mobilenav.root.background')};\n    color: ${variable('mobilenav.root.color')};\n    border-radius: ${variable('mobilenav.root.borderRadius')};`),
        rule(
            action,
            `    background: ${variable('mobilenav.item.background')};\n    color: ${variable('mobilenav.item.color')};\n    border-radius: ${variable('mobilenav.item.borderRadius')};\n    transition-duration: ${variable('mobilenav.item.transitionDuration')};`
        ),
        rule('.p-mobilenav .p-mobilenav-label', `    color: ${variable('mobilenav.label.color')};`),
        rule(
            '.p-mobilenav .p-mobilenav-icon',
            `    color: ${variable('mobilenav.icon.color')};\n    border-color: ${variable('mobilenav.icon.borderColor')};\n    border-radius: ${variable('mobilenav.icon.borderRadius')};\n    transition-duration: ${variable('mobilenav.item.transitionDuration')};`
        ),
        rule('.p-mobilenav .p-mobilenav-toggle-icon', `    color: ${variable('mobilenav.submenuIcon.color')};\n    transition-duration: ${variable('mobilenav.item.transitionDuration')};`),
        rule('.p-mobilenav .p-mobilenav-sublist .p-mobilenav-item-content', `    color: ${variable('mobilenav.submenu.color')};\n    border-left-color: ${variable('mobilenav.submenu.borderColor')};\n    border-radius: 0;`),
        ...states,
        rule('.p-mobilenav .p-mobilenav-sublist .p-mobilenav-item-content:not(:disabled):not([aria-disabled="true"]):hover', `    border-left-color: ${variable('mobilenav.submenu.hoverBorderColor')};`),
        rule('.p-mobilenav .p-mobilenav-sublist .p-mobilenav-item-active > .p-mobilenav-item-content:not(:disabled):not([aria-disabled="true"])', `    border-left-color: ${variable('mobilenav.submenu.activeBorderColor')};`),
        rule([`${action}:disabled`, `${action}[aria-disabled="true"]`], `    opacity: ${variable('mobilenav.item.disabledOpacity')};`),
        rule('.p-mobilenav .p-mobilenav-group-label', `    color: ${variable('mobilenav.groupLabel.color')};`),
        rule('.p-mobilenav .p-mobilenav-separator', `    background: ${variable('mobilenav.separator.background')};`),
        maskCss({ selector: '.p-mobilenav-mask', name: 'mobilenav', variable })
    ].join('\n');
};

/** Flat rules are scoped by Aura after every component skin is concatenated. */
export const auraOverlayCss = ({ prefix = 'mantle' } = {}) => {
    const variable = (path) => cssVariable(prefix, path);

    return [
        dialogCss({ selector: '.p-dialog', name: 'dialog', maskSelector: '.p-dialog-mask.p-component-overlay', variable }),
        surfaceCss({ selector: '.p-sidebar', name: 'sidebar.root', variable }),
        contentCss({ selector: '.p-sidebar .p-sidebar-header', name: 'sidebar.header', variable }),
        rule('.p-sidebar .p-sidebar-header', `    gap: ${variable('sidebar.header.gap')};`),
        rule('.p-sidebar .p-sidebar-icons', `    gap: ${variable('sidebar.header.gap')};`),
        contentCss({ selector: '.p-sidebar .p-sidebar-content', name: 'sidebar.content', variable }),
        closeButtonCss({ selector: '.p-sidebar .p-sidebar-icon', name: 'sidebar', iconSelector: '.p-sidebar .p-sidebar-close-icon', variable }),
        maskCss({ selector: '.p-sidebar-mask.p-component-overlay', name: 'sidebar', variable }),
        surfaceCss({ selector: '.p-overlaypanel', name: 'overlaypanel.root', variable }),
        contentCss({ selector: '.p-overlaypanel .p-overlaypanel-content', name: 'overlaypanel.content', variable }),
        closeButtonCss({ selector: '.p-overlaypanel .p-overlaypanel-close', name: 'overlaypanel', iconSelector: '.p-overlaypanel .p-overlaypanel-close-icon', variable }),
        arrowCss({ selector: '.p-overlaypanel', name: 'overlaypanel', variable }),
        surfaceCss({ selector: '.p-tooltip .p-tooltip-text', name: 'tooltip.root', variable }),
        rule('.p-tooltip .p-tooltip-text', `    padding: ${variable('tooltip.text.padding')};`),
        rule('.p-tooltip.p-tooltip-right .p-tooltip-arrow', `    border-right-color: ${variable('tooltip.arrow.color')};`),
        rule('.p-tooltip.p-tooltip-left .p-tooltip-arrow', `    border-left-color: ${variable('tooltip.arrow.color')};`),
        rule('.p-tooltip.p-tooltip-top .p-tooltip-arrow', `    border-top-color: ${variable('tooltip.arrow.color')};`),
        rule('.p-tooltip.p-tooltip-bottom .p-tooltip-arrow', `    border-bottom-color: ${variable('tooltip.arrow.color')};`),
        surfaceCss({ selector: '.p-confirm-popup', name: 'confirmpopup.root', variable }),
        contentCss({ selector: '.p-confirm-popup .p-confirm-popup-content', name: 'confirmpopup.content', variable }),
        rule('.p-confirm-popup .p-confirm-popup-content', `    gap: ${variable('confirmpopup.content.gap')};`),
        contentCss({ selector: '.p-confirm-popup .p-confirm-popup-footer', name: 'confirmpopup.footer', variable }),
        rule('.p-confirm-popup .p-confirm-popup-footer', '    text-align: end;'),
        rule('.p-confirm-popup .p-confirm-popup-footer .p-button + .p-button', `    margin-inline-start: ${variable('confirmpopup.footer.buttonGap')};`),
        rule(
            '.p-confirm-popup .p-confirm-popup-icon',
            `    color: ${variable('confirmpopup.icon.color')};\n    font-size: ${variable('confirmpopup.icon.size')};\n    width: ${variable('confirmpopup.icon.size')};\n    height: ${variable('confirmpopup.icon.size')};`
        ),
        rule('.p-confirm-popup .p-confirm-popup-message', `    color: ${variable('confirmpopup.message.color')};`),
        arrowCss({ selector: '.p-confirm-popup', name: 'confirmpopup', variable }),
        dialogCss({ selector: '.p-dialog.p-confirm-dialog', name: 'confirmdialog', maskSelector: '.p-dialog-mask.p-component-overlay:has(> .p-confirm-dialog)', variable }),
        rule(
            '.p-confirm-dialog .p-confirm-dialog-icon',
            `    color: ${variable('confirmdialog.icon.color')};\n    font-size: ${variable('confirmdialog.icon.size')};\n    width: ${variable('confirmdialog.icon.size')};\n    height: ${variable('confirmdialog.icon.size')};`
        ),
        rule('.p-confirm-dialog .p-confirm-dialog-message', `    color: ${variable('confirmdialog.message.color')};\n    margin: ${variable('confirmdialog.message.margin')};`),
        menuCss({ name: 'menu', variable }),
        contentCss({ selector: '.p-menu .p-submenu-header', name: 'menu.submenuHeader', variable }),
        rule('.p-menu .p-submenu-header', `    font-weight: ${variable('menu.submenuHeader.fontWeight')};`),
        rule('.p-menu .p-submenu-header.p-disabled', `    opacity: ${variable('menu.item.disabledOpacity')};`),
        menuCss({ name: 'tieredmenu', variable, nested: true }),
        menuCss({ name: 'contextmenu', variable, nested: true }),
        menuCss({ name: 'slidemenu', variable, nested: true, direct: true }),
        contentCss({ selector: '.p-slidemenu .p-slidemenu-backward', name: 'slidemenu.backward', variable }),
        rule(
            '.p-slidemenu .p-slidemenu-backward',
            `    border-top: 1px solid ${variable('slidemenu.backward.borderColor')};\n    transition: background ${variable('slidemenu.backward.transitionDuration')}, color ${variable('slidemenu.backward.transitionDuration')};`
        ),
        rule('.p-slidemenu .p-slidemenu-backward:hover', `    background: ${variable('slidemenu.backward.hoverBackground')};\n    color: ${variable('slidemenu.backward.hoverColor')};`),
        rule('.p-slidemenu .p-slidemenu-backward:active', `    background: ${variable('slidemenu.backward.activeBackground')};\n    color: ${variable('slidemenu.backward.activeColor')};`),
        rule('.p-slidemenu .p-slidemenu-backward:focus-visible', focusCss('slidemenu.backward', variable)),
        rule(
            '.p-slidemenu .p-slidemenu-backward-icon',
            `    color: ${variable('slidemenu.backwardIcon.color')};\n    font-size: ${variable('slidemenu.backwardIcon.size')};\n    width: ${variable('slidemenu.backwardIcon.size')};\n    height: ${variable('slidemenu.backwardIcon.size')};\n    margin: ${variable('slidemenu.backwardIcon.margin')};`
        ),
        mobileNavCss(variable),
        maskCss({ selector: '.p-blockui.p-component-overlay', name: 'blockui', variable })
    ].join('\n');
};
