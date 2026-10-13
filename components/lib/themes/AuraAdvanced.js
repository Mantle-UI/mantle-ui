const focusRingTokens = () => ({
    width: '{focusRing.width}',
    style: '{focusRing.style}',
    color: '{focusRing.color}',
    offset: '{focusRing.offset}'
});

const actionTokens = (overrides = {}) => ({
    background: 'transparent',
    color: '{text.color}',
    hoverBackground: 'color-mix(in srgb, {primary.color}, transparent 92%)',
    hoverColor: '{primary.color}',
    activeBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)',
    activeColor: '{primary.color}',
    borderRadius: '{borderRadius.md}',
    size: '2rem',
    transitionDuration: '{transitionDuration}',
    focusRing: focusRingTokens(),
    ...overrides
});

/** Advanced controls retain their value-driven dimensions, transforms and inline colors. */
export const auraAdvancedComponents = {
    metergroup: {
        root: { color: '{text.color}', gap: '1rem' },
        meterContainer: { background: '{surface.border}', borderRadius: '{borderRadius.md}', size: '0.5rem' },
        meter: { background: '{primary.color}' },
        labelList: { gap: '1rem' },
        label: { color: '{text.color}', gap: '0.5rem', lineHeight: '1.5rem' },
        labelMarker: { color: '{primary.color}', size: '0.5rem', borderRadius: '50%' },
        labelIcon: { color: '{primary.color}', size: '1rem' }
    },
    organizationchart: {
        root: { color: '{text.color}' },
        cell: { padding: '0 0.75rem' },
        node: {
            background: '{surface.card}',
            color: '{text.color}',
            borderColor: '{surface.border}',
            borderRadius: '{borderRadius.md}',
            padding: '1.25rem',
            hoverBackground: 'color-mix(in srgb, {primary.color}, transparent 92%)',
            hoverColor: '{text.color}',
            selectedBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)',
            selectedColor: '{primary.color}',
            selectedBorderColor: '{primary.color}',
            transitionDuration: '{transitionDuration}',
            focusRing: focusRingTokens()
        },
        connector: { color: '{surface.border}', width: '1px', height: '20px' },
        toggler: actionTokens({ background: 'inherit', color: 'inherit', borderRadius: '50%', size: '1.5rem' }),
        togglerIcon: { size: '1rem', color: 'inherit', selectedColor: '{primary.color}' }
    },
    scrolltop: {
        root: {
            ...actionTokens({
                background: '{primary.color}',
                color: '{primary.contrastColor}',
                hoverBackground: '{primary.hoverColor}',
                hoverColor: '{primary.contrastColor}',
                activeBackground: '{primary.activeColor}',
                activeColor: '{primary.contrastColor}',
                borderRadius: '50%',
                size: '3rem'
            }),
            shadow: '0 2px 12px rgba(15, 23, 42, 0.2)',
            bottom: '20px',
            right: '20px',
            motionDuration: '0.15s',
            disabledOpacity: '{disabledOpacity}'
        },
        icon: { color: 'inherit', size: '1.5rem' }
    },
    speeddial: {
        root: { gap: '0.5rem', disabledOpacity: '{disabledOpacity}' },
        button: {
            ...actionTokens({
                background: '{button.root.background}',
                color: '{button.root.color}',
                hoverBackground: '{button.root.hoverBackground}',
                hoverColor: '{button.root.color}',
                activeBackground: '{button.root.activeBackground}',
                activeColor: '{button.root.color}',
                borderRadius: '50%',
                size: '4rem'
            }),
            openedBackground: '{primary.activeColor}',
            openedColor: '{primary.contrastColor}',
            iconSize: '1.5rem'
        },
        menu: { gap: '0.5rem' },
        item: { transformDuration: '200ms', opacityDuration: '0.8s' },
        action: {
            ...actionTokens({
                background: '{surface.700}',
                color: '{surface.0}',
                hoverBackground: '{primary.hoverColor}',
                hoverColor: '{primary.contrastColor}',
                activeBackground: '{primary.activeColor}',
                activeColor: '{primary.contrastColor}',
                borderRadius: '50%',
                size: '3rem'
            }),
            focusBackground: '{primary.color}',
            focusColor: '{primary.contrastColor}',
            disabledOpacity: '{disabledOpacity}'
        },
        actionIcon: { color: 'inherit', size: '1.25rem' },
        mask: { background: 'rgba(0, 0, 0, 0.4)', borderRadius: '{borderRadius.md}' }
    },
    stepper: {
        root: { color: '{text.color}' },
        nav: { padding: '0', gap: '0' },
        header: { padding: '0.5rem', disabledOpacity: '{disabledOpacity}' },
        action: {
            background: 'transparent',
            color: '{text.color}',
            hoverBackground: 'color-mix(in srgb, {primary.color}, transparent 92%)',
            hoverColor: '{primary.color}',
            borderRadius: '{borderRadius.md}',
            padding: '0.25rem',
            gap: '0.5rem',
            transitionDuration: '{transitionDuration}',
            focusRing: focusRingTokens()
        },
        number: {
            background: '{surface.card}',
            color: '{text.mutedColor}',
            borderColor: '{surface.border}',
            borderWidth: '2px',
            borderRadius: '50%',
            size: '2rem',
            fontSize: '1rem',
            fontWeight: '600',
            activeBackground: '{primary.color}',
            activeColor: '{primary.contrastColor}',
            activeBorderColor: '{primary.color}',
            completedBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)',
            completedColor: '{primary.color}',
            completedBorderColor: '{primary.color}'
        },
        title: { color: '{text.mutedColor}', hoverColor: '{primary.color}', activeColor: '{text.color}', completedColor: '{primary.color}', fontWeight: '600', fontSize: '1rem' },
        separator: { color: '{surface.border}', completedColor: '{primary.color}', size: '2px', horizontalMargin: '1rem', verticalMargin: 'calc({stepper.header.padding} + {stepper.action.padding} + {stepper.number.size} / 2)' },
        panels: { background: '{surface.card}', color: '{text.color}', borderRadius: '{borderRadius.md}', padding: '1.25rem' },
        content: { background: '{surface.card}', color: '{text.color}', padding: '0', verticalPadding: '0 0 1.25rem 1rem', lastVerticalPadding: '0 0 1.25rem calc({stepper.separator.verticalMargin} + 1rem)' },
        start: { color: '{text.color}', padding: '0.5rem 0' },
        end: { color: '{text.color}', padding: '0.5rem 0' }
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

const actionCss = ({ selector, name, variable, enabled = `${selector}:enabled`, rotation = false, motion = false }) =>
    [
        rule(
            selector,
            `    background: ${variable(`${name}.background`)};\n    color: ${variable(`${name}.color`)};\n    border: 0;\n    padding: 0;\n    width: ${variable(`${name}.size`)};\n    height: ${variable(`${name}.size`)};\n    border-radius: ${variable(`${name}.borderRadius`)};\n    transition: background ${variable(`${name}.transitionDuration`)}, color ${variable(`${name}.transitionDuration`)}${rotation ? ', transform 250ms cubic-bezier(0.4, 0, 0.2, 1)' : ''}${motion ? `, opacity ${variable(`${name}.motionDuration`)}` : ''};`
        ),
        rule(`${enabled}:hover`, `    background: ${variable(`${name}.hoverBackground`)};\n    color: ${variable(`${name}.hoverColor`)};`),
        rule(`${enabled}:active`, `    background: ${variable(`${name}.activeBackground`)};\n    color: ${variable(`${name}.activeColor`)};`),
        rule(`${enabled}:focus-visible`, focusCss(name, variable))
    ].join('\n');

export const auraAdvancedCss = ({ prefix = 'mantle' } = {}) => {
    const variable = (path) => cssVariable(prefix, path);
    const completedHeaders = ['.p-stepper.p-stepper-horizontal .p-stepper-header:has(~ .p-highlight)', '.p-stepper.p-stepper-vertical .p-stepper-panel:has(~ .p-stepper-panel-active) .p-stepper-header'];

    return [
        rule('.p-metergroup', `    color: ${variable('metergroup.root.color')};`),
        rule('.p-metergroup.p-metergroup-vertical', `    gap: ${variable('metergroup.root.gap')};`),
        rule('.p-metergroup .p-metergroup-meter-container', `    background: ${variable('metergroup.meterContainer.background')};\n    border-radius: ${variable('metergroup.meterContainer.borderRadius')};\n    overflow: hidden;`),
        rule('.p-metergroup.p-metergroup-horizontal .p-metergroup-meter-container', `    height: ${variable('metergroup.meterContainer.size')};`),
        rule('.p-metergroup.p-metergroup-vertical .p-metergroup-meter-container', `    width: ${variable('metergroup.meterContainer.size')};\n    height: 100%;\n    flex-shrink: 0;`),
        rule('.p-metergroup .p-metergroup-meter', `    background-color: ${variable('metergroup.meter.background')};\n    border: 0;`),
        rule('.p-metergroup .p-metergroup-label-list', `    gap: ${variable('metergroup.labelList.gap')};\n    flex-wrap: wrap;`),
        rule('.p-metergroup.p-metergroup-horizontal .p-metergroup-label-list-start', `    margin-bottom: ${variable('metergroup.root.gap')};`),
        rule('.p-metergroup.p-metergroup-horizontal .p-metergroup-label-list-end', `    margin-top: ${variable('metergroup.root.gap')};`),
        rule('.p-metergroup .p-metergroup-label-list-item', `    gap: ${variable('metergroup.label.gap')};\n    line-height: ${variable('metergroup.label.lineHeight')};`),
        rule('.p-metergroup .p-metergroup-label', `    color: ${variable('metergroup.label.color')};`),
        rule(
            '.p-metergroup .p-metergroup-label-type',
            `    background-color: ${variable('metergroup.labelMarker.color')};\n    width: ${variable('metergroup.labelMarker.size')};\n    height: ${variable('metergroup.labelMarker.size')};\n    border-radius: ${variable('metergroup.labelMarker.borderRadius')};\n    flex-shrink: 0;`
        ),
        rule(
            '.p-metergroup .p-metergroup-label-icon',
            `    color: ${variable('metergroup.labelIcon.color')};\n    width: ${variable('metergroup.labelIcon.size')};\n    height: ${variable('metergroup.labelIcon.size')};\n    font-size: ${variable('metergroup.labelIcon.size')};`
        ),
        rule('.p-organizationchart', `    color: ${variable('organizationchart.root.color')};`),
        rule('.p-organizationchart .p-organizationchart-table > tbody > tr > td', `    padding: ${variable('organizationchart.cell.padding')};`),
        rule(
            '.p-organizationchart .p-organizationchart-node-content',
            `    background: ${variable('organizationchart.node.background')};\n    color: ${variable('organizationchart.node.color')};\n    border: 1px solid ${variable('organizationchart.node.borderColor')};\n    border-radius: ${variable('organizationchart.node.borderRadius')};\n    padding: ${variable('organizationchart.node.padding')};\n    transition: background ${variable('organizationchart.node.transitionDuration')}, color ${variable('organizationchart.node.transitionDuration')}, border-color ${variable('organizationchart.node.transitionDuration')};`
        ),
        rule('.p-organizationchart .p-organizationchart-selectable-node:not(.p-highlight):hover', `    background: ${variable('organizationchart.node.hoverBackground')};\n    color: ${variable('organizationchart.node.hoverColor')};`),
        rule(
            '.p-organizationchart .p-organizationchart-node-content.p-highlight',
            `    background: ${variable('organizationchart.node.selectedBackground')};\n    color: ${variable('organizationchart.node.selectedColor')};\n    border-color: ${variable('organizationchart.node.selectedBorderColor')};`
        ),
        rule('.p-organizationchart .p-organizationchart-selectable-node:focus-visible', focusCss('organizationchart.node', variable)),
        rule(
            '.p-organizationchart .p-organizationchart-line-down',
            `    background: ${variable('organizationchart.connector.color')};\n    width: ${variable('organizationchart.connector.width')};\n    height: ${variable('organizationchart.connector.height')};`
        ),
        rule('.p-organizationchart .p-organizationchart-line-left', `    border-right: ${variable('organizationchart.connector.width')} solid ${variable('organizationchart.connector.color')};`),
        rule('.p-organizationchart .p-organizationchart-line-top', `    border-top: ${variable('organizationchart.connector.width')} solid ${variable('organizationchart.connector.color')};`),
        actionCss({
            selector: '.p-organizationchart .p-organizationchart-node-content .p-node-toggler',
            name: 'organizationchart.toggler',
            enabled: '.p-organizationchart .p-organizationchart-node-content .p-node-toggler:not(.p-disabled)',
            variable
        }),
        rule(
            '.p-organizationchart .p-organizationchart-node-content .p-node-toggler',
            `    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    bottom: calc(-1 * ${variable('organizationchart.toggler.size')} / 2);\n    margin-left: calc(-1 * ${variable('organizationchart.toggler.size')} / 2);`
        ),
        rule('.p-organizationchart .p-node-toggler > i', '    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    color: inherit;'),
        rule(
            '.p-organizationchart .p-node-toggler .p-node-toggler-icon',
            `    top: 0;\n    color: ${variable('organizationchart.togglerIcon.color')};\n    width: ${variable('organizationchart.togglerIcon.size')};\n    height: ${variable('organizationchart.togglerIcon.size')};\n    font-size: ${variable('organizationchart.togglerIcon.size')};`
        ),
        rule('.p-organizationchart .p-organizationchart-node-content.p-highlight .p-node-toggler .p-node-toggler-icon', `    color: ${variable('organizationchart.togglerIcon.selectedColor')};`),
        actionCss({ selector: '.p-scrolltop.p-link', name: 'scrolltop.root', variable, motion: true }),
        rule('.p-scrolltop', `    bottom: ${variable('scrolltop.root.bottom')};\n    right: ${variable('scrolltop.root.right')};\n    box-shadow: ${variable('scrolltop.root.shadow')};`),
        rule('.p-scrolltop:disabled', `    opacity: ${variable('scrolltop.root.disabledOpacity')};`),
        rule('.p-scrolltop .p-scrolltop-icon', `    color: ${variable('scrolltop.icon.color')};\n    width: ${variable('scrolltop.icon.size')};\n    height: ${variable('scrolltop.icon.size')};\n    font-size: ${variable('scrolltop.icon.size')};`),
        rule('.p-speeddial.p-speeddial-linear', `    gap: ${variable('speeddial.root.gap')};`),
        rule('.p-speeddial.p-disabled', `    opacity: ${variable('speeddial.root.disabledOpacity')};`),
        actionCss({ selector: '.p-speeddial .p-speeddial-button.p-button.p-button-icon-only', name: 'speeddial.button', variable, rotation: true }),
        rule(
            '.p-speeddial.p-speeddial-opened .p-speeddial-button.p-button.p-button-icon-only:enabled:not(:hover):not(:active)',
            `    background: ${variable('speeddial.button.openedBackground')};\n    color: ${variable('speeddial.button.openedColor')};`
        ),
        rule('.p-speeddial .p-speeddial-button.p-button:disabled', '    opacity: 1;'),
        rule(
            '.p-speeddial .p-speeddial-button.p-button .p-button-icon',
            `    width: ${variable('speeddial.button.iconSize')};\n    height: ${variable('speeddial.button.iconSize')};\n    font-size: ${variable('speeddial.button.iconSize')};\n    color: inherit;`
        ),
        rule('.p-speeddial.p-speeddial-linear .p-speeddial-list', `    gap: ${variable('speeddial.menu.gap')};\n    outline: 0;`),
        rule('.p-speeddial .p-speeddial-item', `    margin: 0;\n    transition-duration: ${variable('speeddial.item.transformDuration')}, ${variable('speeddial.item.opacityDuration')};`),
        actionCss({ selector: '.p-speeddial .p-speeddial-action', name: 'speeddial.action', enabled: '.p-speeddial:not(.p-disabled) .p-speeddial-action:not(.p-disabled)', variable }),
        rule(
            ['.p-speeddial:not(.p-disabled) .p-speeddial-item.p-focus > .p-speeddial-action:not(.p-disabled)', '.p-speeddial:not(.p-disabled) .p-speeddial-action:not(.p-disabled):focus-visible'],
            `    background: ${variable('speeddial.action.focusBackground')};\n    color: ${variable('speeddial.action.focusColor')};\n${focusCss('speeddial.action', variable)}`
        ),
        rule('.p-speeddial:not(.p-disabled) .p-speeddial-action.p-disabled', `    opacity: ${variable('speeddial.action.disabledOpacity')};`),
        rule('.p-speeddial.p-disabled .p-speeddial-action.p-disabled', '    opacity: 1;'),
        rule(
            '.p-speeddial .p-speeddial-action-icon',
            `    color: ${variable('speeddial.actionIcon.color')};\n    width: ${variable('speeddial.actionIcon.size')};\n    height: ${variable('speeddial.actionIcon.size')};\n    font-size: ${variable('speeddial.actionIcon.size')};`
        ),
        rule('.p-speeddial-mask', `    background: ${variable('speeddial.mask.background')};\n    border-radius: ${variable('speeddial.mask.borderRadius')};`),
        rule('.p-stepper', `    color: ${variable('stepper.root.color')};`),
        rule('.p-stepper .p-stepper-nav', `    padding: ${variable('stepper.nav.padding')};\n    gap: ${variable('stepper.nav.gap')};`),
        rule('.p-stepper .p-stepper-header', `    padding: ${variable('stepper.header.padding')};`),
        rule('.p-stepper .p-stepper-header.p-disabled', `    opacity: ${variable('stepper.header.disabledOpacity')};`),
        rule(
            '.p-stepper .p-stepper-header .p-stepper-action',
            `    background: ${variable('stepper.action.background')};\n    color: ${variable('stepper.action.color')};\n    border-radius: ${variable('stepper.action.borderRadius')};\n    padding: ${variable('stepper.action.padding')};\n    gap: ${variable('stepper.action.gap')};\n    transition: background ${variable('stepper.action.transitionDuration')}, color ${variable('stepper.action.transitionDuration')};`
        ),
        rule('.p-stepper .p-stepper-header:not(.p-disabled) .p-stepper-action:hover', `    background: ${variable('stepper.action.hoverBackground')};\n    color: ${variable('stepper.action.hoverColor')};`),
        rule('.p-stepper .p-stepper-header:not(.p-disabled) .p-stepper-action:focus-visible', focusCss('stepper.action', variable)),
        rule(
            '.p-stepper .p-stepper-action .p-stepper-number',
            `    box-sizing: border-box;\n    background: ${variable('stepper.number.background')};\n    color: ${variable('stepper.number.color')};\n    border: ${variable('stepper.number.borderWidth')} solid ${variable('stepper.number.borderColor')};\n    border-radius: ${variable('stepper.number.borderRadius')};\n    min-width: ${variable('stepper.number.size')};\n    height: ${variable('stepper.number.size')};\n    font-size: ${variable('stepper.number.fontSize')};\n    font-weight: ${variable('stepper.number.fontWeight')};\n    flex-shrink: 0;\n    transition: background ${variable('stepper.action.transitionDuration')}, color ${variable('stepper.action.transitionDuration')}, border-color ${variable('stepper.action.transitionDuration')};`
        ),
        rule('.p-stepper .p-stepper-action .p-stepper-title', `    color: ${variable('stepper.title.color')};\n    font-weight: ${variable('stepper.title.fontWeight')};\n    font-size: ${variable('stepper.title.fontSize')};`),
        rule('.p-stepper .p-stepper-header:not(.p-disabled) .p-stepper-action:hover .p-stepper-title', `    color: ${variable('stepper.title.hoverColor')};`),
        rule(
            completedHeaders.map((selector) => `${selector} .p-stepper-number`),
            `    background: ${variable('stepper.number.completedBackground')};\n    color: ${variable('stepper.number.completedColor')};\n    border-color: ${variable('stepper.number.completedBorderColor')};`
        ),
        rule(
            completedHeaders.map((selector) => `${selector} .p-stepper-title`),
            `    color: ${variable('stepper.title.completedColor')};`
        ),
        rule(
            '.p-stepper .p-stepper-header.p-highlight .p-stepper-number',
            `    background: ${variable('stepper.number.activeBackground')};\n    color: ${variable('stepper.number.activeColor')};\n    border-color: ${variable('stepper.number.activeBorderColor')};`
        ),
        rule('.p-stepper .p-stepper-header.p-highlight .p-stepper-title', `    color: ${variable('stepper.title.activeColor')};`),
        rule(
            '.p-stepper .p-stepper-separator',
            `    background: ${variable('stepper.separator.color')};\n    width: 100%;\n    height: ${variable('stepper.separator.size')};\n    margin-inline-start: ${variable('stepper.separator.horizontalMargin')};`
        ),
        rule(
            ['.p-stepper.p-stepper-horizontal .p-stepper-header:has(~ .p-highlight) .p-stepper-separator', '.p-stepper.p-stepper-vertical .p-stepper-panel:has(~ .p-stepper-panel-active) .p-stepper-separator'],
            `    background: ${variable('stepper.separator.completedColor')};`
        ),
        rule(
            '.p-stepper .p-stepper-panels',
            `    background: ${variable('stepper.panels.background')};\n    color: ${variable('stepper.panels.color')};\n    border-radius: ${variable('stepper.panels.borderRadius')};\n    padding: ${variable('stepper.panels.padding')};`
        ),
        rule('.p-stepper .p-stepper-content', `    background: ${variable('stepper.content.background')};\n    color: ${variable('stepper.content.color')};\n    padding: ${variable('stepper.content.padding')};`),
        rule('.p-stepper.p-stepper-vertical', '    display: flex;\n    flex-direction: column;'),
        rule('.p-stepper.p-stepper-vertical .p-stepper-panel', '    display: flex;\n    flex-direction: column;\n    flex: initial;'),
        rule('.p-stepper.p-stepper-vertical .p-stepper-panel.p-stepper-panel-active', '    flex: 1 1 auto;'),
        rule('.p-stepper.p-stepper-vertical .p-stepper-header', '    flex: initial;'),
        rule('.p-stepper.p-stepper-vertical .p-stepper-toggleable-content', `    display: flex;\n    flex: 1 1 auto;\n    background: ${variable('stepper.content.background')};\n    color: ${variable('stepper.content.color')};`),
        rule('.p-stepper.p-stepper-vertical .p-stepper-panel .p-stepper-content', `    width: 100%;\n    padding: ${variable('stepper.content.verticalPadding')};`),
        rule(
            '.p-stepper.p-stepper-vertical .p-stepper-panel .p-stepper-separator',
            `    flex: 0 0 auto;\n    width: ${variable('stepper.separator.size')};\n    height: auto;\n    margin-inline-start: ${variable('stepper.separator.verticalMargin')};`
        ),
        rule('.p-stepper.p-stepper-vertical .p-stepper-panel:not(:has(~ .p-stepper-panel)) .p-stepper-content', `    padding: ${variable('stepper.content.lastVerticalPadding')};`),
        ...['start', 'end'].map((part) => rule(`.p-stepper > .p-stepper-${part}`, `    color: ${variable(`stepper.${part}.color`)};\n    padding: ${variable(`stepper.${part}.padding`)};`))
    ].join('\n');
};
