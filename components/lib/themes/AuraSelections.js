const focusRing = () => ({ width: '{focusRing.width}', style: '{focusRing.style}', color: '{focusRing.color}', offset: '{focusRing.offset}' });

const formField = () => ({
    background: '{formField.background}',
    filledBackground: '{formField.filledBackground}',
    borderColor: '{formField.borderColor}',
    hoverBorderColor: '{formField.hoverBorderColor}',
    focusBorderColor: '{formField.focusBorderColor}',
    invalidBorderColor: '{red.500}',
    color: '{formField.color}',
    borderRadius: '{formField.borderRadius}',
    disabledOpacity: '{disabledOpacity}',
    transitionDuration: '{formField.transitionDuration}',
    focusRing: focusRing()
});

const panel = () => ({ background: '{overlay.background}', borderColor: '{overlay.borderColor}', color: '{overlay.color}', borderRadius: '{borderRadius.md}', shadow: '0 8px 24px rgba(15, 23, 42, 0.12)', padding: '0.25rem' });

const option = () => ({
    background: 'transparent',
    color: '{overlay.color}',
    hoverBackground: 'color-mix(in srgb, {overlay.color}, transparent 94%)',
    hoverColor: '{overlay.color}',
    focusBackground: 'color-mix(in srgb, {overlay.color}, transparent 90%)',
    focusColor: '{overlay.color}',
    selectedBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)',
    selectedColor: '{primary.color}',
    selectedHoverBackground: 'color-mix(in srgb, {primary.color}, transparent 76%)',
    selectedFocusBackground: 'color-mix(in srgb, {primary.color}, transparent 70%)',
    borderRadius: '{borderRadius.sm}',
    paddingX: '0.75rem',
    paddingY: '0.5rem',
    disabledOpacity: '{disabledOpacity}'
});

const group = () => ({ background: '{surface.50}', color: '{text.mutedColor}', fontWeight: '600', paddingX: '0.75rem', paddingY: '0.5rem' });
const emptyMessage = () => ({ color: '{text.mutedColor}', paddingX: '0.75rem', paddingY: '0.5rem' });
const header = () => ({ background: '{surface.50}', color: '{overlay.color}', borderColor: '{overlay.borderColor}', padding: '0.75rem', gap: '0.5rem' });
const filter = () => ({ ...formField(), placeholderColor: '{formField.placeholderColor}', paddingX: '{formField.paddingX}', paddingY: '{formField.paddingY}', iconColor: '{text.mutedColor}' });
const closeButton = () => ({ color: '{text.mutedColor}', hoverColor: '{text.color}', hoverBackground: '{surface.100}', size: '2rem', borderRadius: '50%', focusRing: focusRing() });
const token = () => ({ background: '{surface.100}', color: '{formField.color}', borderRadius: '{borderRadius.md}', paddingX: '0.5rem', paddingY: '0.25rem', gap: '0.5rem', margin: '0 0.25rem 0 0' });

const checkbox = () => ({
    width: '1.375rem',
    height: '1.375rem',
    borderRadius: '{borderRadius.md}',
    background: '{formField.background}',
    filledBackground: '{formField.filledBackground}',
    borderColor: '{formField.borderColor}',
    color: '{formField.color}',
    hoverBorderColor: '{primary.color}',
    checkedBackground: '{primary.color}',
    checkedBorderColor: '{primary.color}',
    checkedColor: '{primary.contrastColor}',
    checkedHoverBackground: '{primary.hoverColor}',
    checkedHoverBorderColor: '{primary.hoverColor}',
    focusBorderColor: '{formField.focusBorderColor}',
    invalidBorderColor: '{red.500}',
    disabledOpacity: '{disabledOpacity}',
    transitionDuration: '{transitionDuration}',
    focusRing: focusRing()
});

const select = (name) => ({
    root: formField(),
    label: { color: `{${name}.root.color}`, placeholderColor: '{formField.placeholderColor}', paddingX: '{formField.paddingX}', paddingY: '{formField.paddingY}' },
    trigger: { color: '{text.mutedColor}', width: '3rem' },
    panel: panel()
});

const buttonParts = (name, part) => ({
    label: { color: `{${name}.${part}.color}`, selectedColor: `{${name}.${part}.selectedColor}`, hoverColor: `{${name}.${part}.color}`, selectedHoverColor: `{${name}.${part}.selectedColor}`, fontWeight: '500' }
});

/** Component tokens for selection controls and their actual legacy DOM parts. */
export const auraSelectionComponents = {
    multiselect: {
        ...select('multiselect'),
        list: { padding: '0.25rem' },
        option: option(),
        optionGroup: group(),
        emptyMessage: emptyMessage(),
        header: header(),
        filter: filter(),
        closeButton: closeButton(),
        token: { ...token(), removeIconColor: '{text.mutedColor}', removeIconHoverColor: '{text.color}' },
        checkbox: checkbox()
    },
    listbox: { root: formField(), list: { padding: '0.25rem' }, header: header(), filter: filter(), option: option(), optionGroup: group(), emptyMessage: emptyMessage() },
    treeselect: {
        ...select('treeselect'),
        header: header(),
        filter: filter(),
        closeButton: closeButton(),
        token: token(),
        tree: { padding: '0.25rem', indent: '1rem' },
        node: { ...option(), gap: '0.5rem' },
        toggler: { color: '{text.mutedColor}', hoverColor: '{text.color}', hoverBackground: '{surface.100}', size: '2rem', borderRadius: '50%', focusRing: focusRing() },
        nodeIcon: { color: '{text.mutedColor}', selectedColor: '{primary.color}' },
        checkbox: checkbox(),
        emptyMessage: emptyMessage()
    },
    cascadeselect: { ...select('cascadeselect'), option: option(), groupIcon: { color: '{text.mutedColor}', selectedColor: '{primary.color}', size: '1rem' } },
    slider: {
        root: { background: '{surface.200}', hoverBackground: '{surface.300}', borderRadius: '{borderRadius.md}', size: '0.25rem', disabledOpacity: '{disabledOpacity}', transitionDuration: '{transitionDuration}' },
        range: { background: '{primary.color}', hoverBackground: '{primary.hoverColor}' },
        handle: {
            background: '{surface.0}',
            borderColor: '{primary.color}',
            hoverBackground: '{primary.hoverColor}',
            hoverBorderColor: '{primary.hoverColor}',
            activeBackground: '{primary.activeColor}',
            activeBorderColor: '{primary.activeColor}',
            width: '1.25rem',
            height: '1.25rem',
            borderRadius: '50%',
            focusRing: focusRing()
        }
    },
    rating: {
        root: { gap: '0.5rem', disabledOpacity: '{disabledOpacity}' },
        item: { borderRadius: '{borderRadius.sm}', focusRing: focusRing() },
        icon: { size: '1.25rem', color: '{text.mutedColor}', hoverColor: '{primary.hoverColor}', activeColor: '{primary.color}', activeHoverColor: '{primary.hoverColor}' },
        cancelIcon: { color: '{red.500}', hoverColor: '{red.600}' }
    },
    knob: {
        root: { borderRadius: '{borderRadius.md}', disabledOpacity: '{disabledOpacity}', focusRing: focusRing() },
        range: { color: '{surface.border}', hoverColor: '{formField.hoverBorderColor}', strokeLinecap: 'butt' },
        value: { color: '{primary.color}', hoverColor: '{primary.hoverColor}', strokeLinecap: 'butt' },
        text: { color: '{text.mutedColor}', fontSize: '1.3rem' }
    },
    tristatecheckbox: {
        root: checkbox(),
        icon: { size: '0.875rem' },
        unchecked: {
            background: '{tristatecheckbox.root.checkedBackground}',
            borderColor: '{tristatecheckbox.root.checkedBorderColor}',
            color: '{tristatecheckbox.root.checkedColor}',
            hoverBackground: '{tristatecheckbox.root.checkedHoverBackground}',
            hoverBorderColor: '{tristatecheckbox.root.checkedHoverBorderColor}'
        }
    },
    multistatecheckbox: { root: checkbox(), icon: { size: '0.875rem' } },
    checkbox: { root: { filledBackground: '{formField.filledBackground}', disabledOpacity: '{disabledOpacity}', focusRing: focusRing() }, icon: { size: '0.875rem' } },
    radiobutton: { root: { filledBackground: '{formField.filledBackground}', disabledOpacity: '{disabledOpacity}', focusRing: focusRing() }, icon: { size: '0.625rem', color: '{radiobutton.root.checkedColor}' } },
    inputswitch: { root: { disabledOpacity: '{disabledOpacity}', focusRing: focusRing() }, handle: { size: '1.25rem', offset: '0.25rem', borderRadius: '50%' } },
    selectButton: {
        root: { gap: '0' },
        button: { borderRadius: '{formField.borderRadius}', paddingX: '{formField.paddingX}', paddingY: '{formField.paddingY}', disabledOpacity: '{disabledOpacity}', focusRing: focusRing() },
        ...buttonParts('selectButton', 'button')
    },
    toggleButton: {
        root: { borderRadius: '{formField.borderRadius}', paddingX: '{formField.paddingX}', paddingY: '{formField.paddingY}', disabledOpacity: '{disabledOpacity}', focusRing: focusRing() },
        ...buttonParts('toggleButton', 'root'),
        icon: { color: '{toggleButton.root.color}', selectedColor: '{toggleButton.root.selectedColor}', size: '1rem', gap: '0.5rem' }
    }
};

/** Flat rules are scoped by Aura after this module is appended to its bridge. */
export const auraSelectionCss = ({ prefix = 'mantle' } = {}) => {
    const variable = (path) =>
        `var(--${prefix}-${path
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
            .replaceAll('.', '-')
            .toLowerCase()})`;
    const rule = (selectors, declarations) => `${Array.isArray(selectors) ? selectors.join(',\n') : selectors} {\n${declarations}\n}\n`;
    const ring = (path) => `outline: ${variable(`${path}.width`)} ${variable(`${path}.style`)} ${variable(`${path}.color`)}; outline-offset: ${variable(`${path}.offset`)}; box-shadow: none;`;

    const fieldCss = ({ name, selector, part = 'root', focus = ':focus-visible' }) => {
        const path = `${name}.${part}`;

        return [
            rule(
                selector,
                `background: ${variable(`${path}.background`)}; border: 1px solid ${variable(`${path}.borderColor`)}; border-radius: ${variable(`${path}.borderRadius`)}; color: ${variable(`${path}.color`)}; transition: background ${variable(`${path}.transitionDuration`)}, border-color ${variable(`${path}.transitionDuration`)}, outline-color ${variable(`${path}.transitionDuration`)};`
            ),
            rule(`${selector}:not(.p-disabled):not(:disabled):hover`, `border-color: ${variable(`${path}.hoverBorderColor`)};`),
            rule(`${selector}.p-variant-filled`, `background: ${variable(`${path}.filledBackground`)};`),
            rule(`${selector}:not(.p-disabled):not(:disabled)${focus}`, `border-color: ${variable(`${path}.focusBorderColor`)}; ${ring(`${path}.focusRing`)}`),
            rule(`${selector}.p-invalid.p-invalid.p-invalid`, `border-color: ${variable(`${path}.invalidBorderColor`)};`),
            rule([`${selector}.p-disabled`, `${selector}:disabled`], `opacity: ${variable(`${path}.disabledOpacity`)};`)
        ].join('\n');
    };

    const panelCss = (name) =>
        rule(
            `${name === 'cascadeselect' ? 'div' : ''}.p-${name}-panel`,
            `background: ${variable(`${name}.panel.background`)}; border: 1px solid ${variable(`${name}.panel.borderColor`)}; border-radius: ${variable(`${name}.panel.borderRadius`)}; color: ${variable(`${name}.panel.color`)}; box-shadow: ${variable(`${name}.panel.shadow`)}; padding: ${variable(`${name}.panel.padding`)};`
        );
    const selectCss = (name) =>
        [
            fieldCss({ name, selector: `.p-${name}`, focus: '.p-focus' }),
            rule(`.p-${name} .p-${name}-label`, `color: ${variable(`${name}.label.color`)}; padding: ${variable(`${name}.label.paddingY`)} ${variable(`${name}.label.paddingX`)};`),
            rule(`.p-${name} .p-${name}-label.p-placeholder`, `color: ${variable(`${name}.label.placeholderColor`)};`),
            rule(`.p-${name} .p-${name}-trigger`, `color: ${variable(`${name}.trigger.color`)}; width: ${variable(`${name}.trigger.width`)};`),
            rule(`.p-${name} .p-${name}-clear-icon`, `color: ${variable(`${name}.trigger.color`)}; right: ${variable(`${name}.trigger.width`)};`),
            panelCss(name)
        ].join('\n');

    const optionsCss = ({
        name,
        selector,
        enabledSelector = selector,
        part = 'option',
        focusSelectors = [`${enabledSelector}.p-focus`, `${enabledSelector}:focus-visible`],
        selectedFocusSelectors = [`${enabledSelector}.p-highlight.p-focus`, `${enabledSelector}.p-highlight:focus-visible`]
    }) => {
        const path = `${name}.${part}`;

        return [
            rule(selector, `background: ${variable(`${path}.background`)}; color: ${variable(`${path}.color`)}; border-radius: ${variable(`${path}.borderRadius`)}; padding: ${variable(`${path}.paddingY`)} ${variable(`${path}.paddingX`)};`),
            rule(`${enabledSelector}:not(.p-highlight):not(.p-disabled):hover`, `background: ${variable(`${path}.hoverBackground`)}; color: ${variable(`${path}.hoverColor`)};`),
            rule(
                focusSelectors.map((item) => `${item}:not(.p-highlight):not(.p-disabled)`),
                `background: ${variable(`${path}.focusBackground`)}; color: ${variable(`${path}.focusColor`)}; outline: none;`
            ),
            rule(`${selector}.p-highlight`, `background: ${variable(`${path}.selectedBackground`)}; color: ${variable(`${path}.selectedColor`)};`),
            rule(`${enabledSelector}.p-highlight:not(.p-disabled):hover`, `background: ${variable(`${path}.selectedHoverBackground`)};`),
            rule(
                selectedFocusSelectors.map((item) => `${item}:not(.p-disabled)`),
                `background: ${variable(`${path}.selectedFocusBackground`)}; outline: none;`
            ),
            rule(`${selector}.p-disabled`, `opacity: ${variable(`${path}.disabledOpacity`)};`)
        ].join('\n');
    };

    const groupedOptionsCss = (name, container) =>
        [
            rule(
                `${container} .p-${name}-item-group`,
                `background: ${variable(`${name}.optionGroup.background`)}; color: ${variable(`${name}.optionGroup.color`)}; font-weight: ${variable(`${name}.optionGroup.fontWeight`)}; padding: ${variable(`${name}.optionGroup.paddingY`)} ${variable(`${name}.optionGroup.paddingX`)};`
            ),
            rule(`${container} .p-${name}-empty-message`, `color: ${variable(`${name}.emptyMessage.color`)}; padding: ${variable(`${name}.emptyMessage.paddingY`)} ${variable(`${name}.emptyMessage.paddingX`)};`),
            rule(`${container} .p-${name}-${name === 'listbox' ? 'list' : 'items'}`, `padding: ${variable(`${name}.list.padding`)};`)
        ].join('\n');
    const headerCss = (name, container) =>
        rule(
            `${container} .p-${name}-header`,
            `background: ${variable(`${name}.header.background`)}; color: ${variable(`${name}.header.color`)}; border-bottom: 1px solid ${variable(`${name}.header.borderColor`)}; padding: ${variable(`${name}.header.padding`)}; gap: ${variable(`${name}.header.gap`)};`
        );

    const filterCss = (name, container) => {
        // The InputText root carries provider attributes too. Include its input
        // class so these component overrides win the base InputText selectors.
        const selector = `${container} .p-${name}-filter.p-inputtext`;

        return [
            fieldCss({ name, selector, part: 'filter' }),
            rule(selector, `padding: ${variable(`${name}.filter.paddingY`)} calc(${variable(`${name}.filter.paddingX`)} + 1.5rem) ${variable(`${name}.filter.paddingY`)} ${variable(`${name}.filter.paddingX`)};`),
            rule(`${selector}::placeholder`, `color: ${variable(`${name}.filter.placeholderColor`)};`),
            rule(`${container} .p-${name}-filter-icon`, `color: ${variable(`${name}.filter.iconColor`)}; right: ${variable(`${name}.filter.paddingX`)};`)
        ].join('\n');
    };

    const closeCss = (name) =>
        [
            rule(
                `.p-${name}-panel .p-${name}-close`,
                `color: ${variable(`${name}.closeButton.color`)}; background: transparent; border: 0; width: ${variable(`${name}.closeButton.size`)}; height: ${variable(`${name}.closeButton.size`)}; border-radius: ${variable(`${name}.closeButton.borderRadius`)};`
            ),
            rule(`.p-${name}-panel .p-${name}-close:not(:disabled):hover`, `color: ${variable(`${name}.closeButton.hoverColor`)}; background: ${variable(`${name}.closeButton.hoverBackground`)};`),
            rule(`.p-${name}-panel .p-${name}-close:focus-visible`, ring(`${name}.closeButton.focusRing`))
        ].join('\n');
    const tokenCss = (name) =>
        rule(
            `.p-${name} .p-${name}-token`,
            `background: ${variable(`${name}.token.background`)}; color: ${variable(`${name}.token.color`)}; border-radius: ${variable(`${name}.token.borderRadius`)}; padding: ${variable(`${name}.token.paddingY`)} ${variable(`${name}.token.paddingX`)}; gap: ${variable(`${name}.token.gap`)}; margin: ${variable(`${name}.token.margin`)};`
        );

    const checkboxCss = ({
        name,
        root,
        box,
        checkedRoot = `${root}.p-highlight`,
        disabledRoot = `${root}.p-disabled`,
        invalidRoot = `${root}.p-invalid`,
        filledRoot = `${root}.p-variant-filled:not(.p-highlight)`,
        focusSelectors = [`${root}:not(.p-disabled):has(.p-checkbox-input:focus-visible) ${box}`],
        part = 'root'
    }) => {
        const path = `${name}.${part}`;

        return [
            rule(root, `width: ${variable(`${path}.width`)}; height: ${variable(`${path}.height`)};`),
            rule(
                `${root} ${box}`,
                `background: ${variable(`${path}.background`)}; border: 2px solid ${variable(`${path}.borderColor`)}; color: ${variable(`${path}.color`)}; width: ${variable(`${path}.width`)}; height: ${variable(`${path}.height`)}; border-radius: ${variable(`${path}.borderRadius`)}; transition: background ${variable(`${path}.transitionDuration`)}, border-color ${variable(`${path}.transitionDuration`)};`
            ),
            rule(`${filledRoot} ${box}`, `background: ${variable(`${path}.filledBackground`)};`),
            rule(`${root}:not(.p-disabled):not(.p-highlight):hover ${box}`, `border-color: ${variable(`${path}.hoverBorderColor`)};`),
            rule(`${checkedRoot} ${box}`, `background: ${variable(`${path}.checkedBackground`)}; border-color: ${variable(`${path}.checkedBorderColor`)}; color: ${variable(`${path}.checkedColor`)};`),
            rule(`${checkedRoot}:not(.p-disabled):hover ${box}`, `background: ${variable(`${path}.checkedHoverBackground`)}; border-color: ${variable(`${path}.checkedHoverBorderColor`)};`),
            rule(focusSelectors, `border-color: ${variable(`${path}.focusBorderColor`)}; ${ring(`${path}.focusRing`)}`),
            rule(`${invalidRoot}.p-invalid.p-invalid ${box}`, `border-color: ${variable(`${path}.invalidBorderColor`)};`),
            rule(disabledRoot, `opacity: ${variable(`${path}.disabledOpacity`)};`)
        ].join('\n');
    };

    const buttonCss = ({ name, path, button, checkedButton, checkedHoverButton, enabledButton, focusSelector, invalidButton, disabledButton }) =>
        [
            // Repeat .p-button to outrank the base Button state selectors, whose
            // :not() classes also contribute specificity after provider scoping.
            rule(
                button,
                `background: ${variable(`${path}.background`)}; border: 1px solid ${variable(`${path}.borderColor`)}; color: ${variable(`${path}.color`)}; border-radius: ${variable(`${path}.borderRadius`)}; padding: ${variable(`${path}.paddingY`)} ${variable(`${path}.paddingX`)};`
            ),
            rule(`${enabledButton}:hover`, `background: ${variable(`${path}.hoverBackground`)}; border-color: ${variable(`${path}.hoverBorderColor`)};`),
            rule(checkedButton, `background: ${variable(`${path}.selectedBackground`)}; border-color: ${variable(`${path}.selectedBorderColor`)}; color: ${variable(`${path}.selectedColor`)};`),
            rule(`${checkedHoverButton}:hover`, `background: ${variable(`${path}.selectedHoverBackground`)}; border-color: ${variable(`${path}.selectedHoverBorderColor`)};`),
            rule(focusSelector, `border-color: ${variable(`${path}.focusBorderColor`)}; ${ring(`${path}.focusRing`)}`),
            rule(invalidButton, `border-color: ${variable(`${path}.invalidBorderColor`)};`),
            rule(disabledButton, `opacity: ${variable(`${path}.disabledOpacity`)};`),
            rule(`${button} .p-button-label`, `color: ${variable(`${name}.label.color`)}; font-weight: ${variable(`${name}.label.fontWeight`)};`),
            rule(`${checkedButton} .p-button-label`, `color: ${variable(`${name}.label.selectedColor`)};`),
            rule(`${enabledButton}:hover .p-button-label`, `color: ${variable(`${name}.label.hoverColor`)};`),
            rule(`${checkedHoverButton}:hover .p-button-label`, `color: ${variable(`${name}.label.selectedHoverColor`)};`)
        ].join('\n');

    return [
        ...['multiselect', 'treeselect', 'cascadeselect'].map(selectCss),
        fieldCss({ name: 'listbox', selector: '.p-listbox', focus: ':focus-within' }),
        rule('.p-listbox', 'box-shadow: none;'),
        optionsCss({ name: 'multiselect', selector: '.p-multiselect-panel .p-multiselect-item' }),
        optionsCss({ name: 'listbox', selector: '.p-listbox .p-listbox-item', enabledSelector: '.p-listbox:not(.p-disabled) .p-listbox-item' }),
        groupedOptionsCss('multiselect', '.p-multiselect-panel'),
        groupedOptionsCss('listbox', '.p-listbox'),
        ...['multiselect', 'treeselect'].flatMap((name) => [
            headerCss(name, `.p-${name}-panel`),
            filterCss(name, `.p-${name}-panel`),
            closeCss(name),
            tokenCss(name),
            checkboxCss({ name, root: `.p-${name}-panel .p-checkbox`, box: '.p-checkbox-box', part: 'checkbox' })
        ]),
        headerCss('listbox', '.p-listbox'),
        filterCss('listbox', '.p-listbox'),
        rule('.p-listbox.p-disabled .p-listbox-filter.p-inputtext', 'opacity: 1;'),
        rule('.p-multiselect .p-multiselect-token-icon', `color: ${variable('multiselect.token.removeIconColor')};`),
        rule('.p-multiselect:not(.p-disabled) .p-multiselect-token-icon:hover', `color: ${variable('multiselect.token.removeIconHoverColor')};`),
        rule('.p-multiselect-panel.p-multiselect-inline', 'border: 0; box-shadow: none;'),
        rule('.p-treeselect-panel .p-tree', `background: transparent; border: 0; padding: ${variable('treeselect.tree.padding')};`),
        rule('.p-treeselect-panel .p-treenode-children', `padding-left: ${variable('treeselect.tree.indent')};`),
        optionsCss({
            name: 'treeselect',
            part: 'node',
            selector: '.p-treeselect-panel .p-treenode-content',
            focusSelectors: ['.p-treeselect-panel .p-treenode:focus-visible > .p-treenode-content', '.p-treeselect-panel .p-treenode-content:focus-visible'],
            selectedFocusSelectors: ['.p-treeselect-panel .p-treenode:focus-visible > .p-treenode-content.p-highlight', '.p-treeselect-panel .p-treenode-content.p-highlight:focus-visible']
        }),
        rule('.p-treeselect-panel .p-treenode-content', `gap: ${variable('treeselect.node.gap')};`),
        rule(
            '.p-treeselect-panel .p-tree-toggler',
            `color: ${variable('treeselect.toggler.color')}; background: transparent; border: 0; width: ${variable('treeselect.toggler.size')}; height: ${variable('treeselect.toggler.size')}; border-radius: ${variable('treeselect.toggler.borderRadius')};`
        ),
        rule('.p-treeselect-panel .p-treenode-content:not(.p-disabled) .p-tree-toggler:hover', `color: ${variable('treeselect.toggler.hoverColor')}; background: ${variable('treeselect.toggler.hoverBackground')};`),
        rule('.p-treeselect-panel .p-tree-toggler:focus-visible', ring('treeselect.toggler.focusRing')),
        rule('.p-treeselect-panel .p-treenode-icon', `color: ${variable('treeselect.nodeIcon.color')};`),
        rule('.p-treeselect-panel .p-treenode-content.p-highlight .p-treenode-icon', `color: ${variable('treeselect.nodeIcon.selectedColor')};`),
        rule(
            ['.p-treeselect-panel .p-treeselect-empty-message', '.p-treeselect-panel .p-tree-empty-message'],
            `color: ${variable('treeselect.emptyMessage.color')}; padding: ${variable('treeselect.emptyMessage.paddingY')} ${variable('treeselect.emptyMessage.paddingX')};`
        ),
        optionsCss({
            name: 'cascadeselect',
            selector: '.p-cascadeselect-panel .p-cascadeselect-item > .p-cascadeselect-item-content',
            focusSelectors: ['.p-cascadeselect-panel .p-cascadeselect-item:not(.p-highlight) > .p-cascadeselect-item-content:focus-visible'],
            selectedFocusSelectors: ['.p-cascadeselect-panel .p-cascadeselect-item.p-highlight > .p-cascadeselect-item-content:focus-visible']
        }),
        // CascadeSelect puts its highlight class on the list item, while focus
        // and its padded hit target belong to the immediate content child.
        rule('.p-cascadeselect-panel .p-cascadeselect-item.p-highlight > .p-cascadeselect-item-content', `background: ${variable('cascadeselect.option.selectedBackground')}; color: ${variable('cascadeselect.option.selectedColor')};`),
        rule('.p-cascadeselect-panel .p-cascadeselect-item.p-highlight > .p-cascadeselect-item-content:hover', `background: ${variable('cascadeselect.option.selectedHoverBackground')};`),
        rule('.p-cascadeselect-panel .p-cascadeselect-item.p-disabled > .p-cascadeselect-item-content', `opacity: ${variable('cascadeselect.option.disabledOpacity')};`),
        rule('.p-cascadeselect-panel .p-cascadeselect-group-icon', `color: ${variable('cascadeselect.groupIcon.color')}; width: ${variable('cascadeselect.groupIcon.size')}; height: ${variable('cascadeselect.groupIcon.size')};`),
        rule('.p-cascadeselect-panel .p-cascadeselect-item.p-highlight > .p-cascadeselect-item-content > .p-cascadeselect-group-icon', `color: ${variable('cascadeselect.groupIcon.selectedColor')};`),
        rule('.p-slider', `background: ${variable('slider.root.background')}; border-radius: ${variable('slider.root.borderRadius')}; transition: background ${variable('slider.root.transitionDuration')};`),
        rule('.p-slider.p-slider-horizontal', `height: ${variable('slider.root.size')};`),
        rule('.p-slider.p-slider-vertical', `width: ${variable('slider.root.size')};`),
        rule('.p-slider:not(.p-disabled):hover', `background: ${variable('slider.root.hoverBackground')};`),
        rule('.p-slider .p-slider-range', `background: ${variable('slider.range.background')}; border-radius: inherit;`),
        rule('.p-slider:not(.p-disabled):hover .p-slider-range', `background: ${variable('slider.range.hoverBackground')};`),
        rule(
            '.p-slider .p-slider-handle',
            `background: ${variable('slider.handle.background')}; border: 2px solid ${variable('slider.handle.borderColor')}; border-radius: ${variable('slider.handle.borderRadius')}; width: ${variable('slider.handle.width')}; height: ${variable('slider.handle.height')}; transition: background ${variable('slider.root.transitionDuration')}, border-color ${variable('slider.root.transitionDuration')};`
        ),
        rule('.p-slider.p-slider-horizontal .p-slider-handle', `margin-left: calc(${variable('slider.handle.width')} / -2); margin-top: calc(${variable('slider.handle.height')} / -2);`),
        rule('.p-slider.p-slider-vertical .p-slider-handle', `margin-left: calc(${variable('slider.handle.width')} / -2); margin-bottom: calc(${variable('slider.handle.height')} / -2);`),
        rule('.p-slider:not(.p-disabled) .p-slider-handle:hover', `background: ${variable('slider.handle.hoverBackground')}; border-color: ${variable('slider.handle.hoverBorderColor')};`),
        rule(
            ['.p-slider:not(.p-disabled) .p-slider-handle:active', '.p-slider:not(.p-disabled) .p-slider-handle.p-slider-handle-active'],
            `background: ${variable('slider.handle.activeBackground')}; border-color: ${variable('slider.handle.activeBorderColor')};`
        ),
        rule('.p-slider:not(.p-disabled) .p-slider-handle:focus-visible', ring('slider.handle.focusRing')),
        rule('.p-slider.p-disabled', `opacity: ${variable('slider.root.disabledOpacity')};`),
        rule('.p-rating', `gap: ${variable('rating.root.gap')};`),
        rule('.p-rating .p-rating-item', `border-radius: ${variable('rating.item.borderRadius')};`),
        rule(['.p-rating:not(.p-disabled):not(.p-readonly) .p-rating-item:focus-visible', '.p-rating:not(.p-disabled):not(.p-readonly) .p-rating-item.p-focus'], ring('rating.item.focusRing')),
        rule('.p-rating .p-rating-icon', `color: ${variable('rating.icon.color')}; width: ${variable('rating.icon.size')}; height: ${variable('rating.icon.size')}; font-size: ${variable('rating.icon.size')};`),
        rule('.p-rating .p-rating-item.p-rating-item-active .p-rating-icon', `color: ${variable('rating.icon.activeColor')};`),
        rule('.p-rating:not(.p-disabled):not(.p-readonly) .p-rating-item:hover .p-rating-icon', `color: ${variable('rating.icon.hoverColor')};`),
        rule('.p-rating:not(.p-disabled):not(.p-readonly) .p-rating-item.p-rating-item-active:hover .p-rating-icon', `color: ${variable('rating.icon.activeHoverColor')};`),
        rule('.p-rating .p-rating-icon.p-rating-cancel', `color: ${variable('rating.cancelIcon.color')};`),
        rule('.p-rating:not(.p-disabled):not(.p-readonly) .p-rating-cancel-item:hover .p-rating-icon.p-rating-cancel', `color: ${variable('rating.cancelIcon.hoverColor')};`),
        rule('.p-rating.p-disabled', `opacity: ${variable('rating.root.disabledOpacity')};`),
        rule('.p-knob > svg', `border-radius: ${variable('knob.root.borderRadius')};`),
        rule('.p-knob:not(.p-disabled) > svg:focus-visible', ring('knob.root.focusRing')),
        // CSS wins SVG presentation attributes; !important also makes token
        // overrides work when passthrough supplies inline stroke/fill styles.
        rule('.p-knob .p-knob-range', `stroke: ${variable('knob.range.color')} !important; stroke-linecap: ${variable('knob.range.strokeLinecap')};`),
        rule('.p-knob .p-knob-value', `stroke: ${variable('knob.value.color')} !important; stroke-linecap: ${variable('knob.value.strokeLinecap')};`),
        rule('.p-knob:not(.p-disabled):hover .p-knob-range', `stroke: ${variable('knob.range.hoverColor')} !important;`),
        rule('.p-knob:not(.p-disabled):hover .p-knob-value', `stroke: ${variable('knob.value.hoverColor')} !important;`),
        rule('.p-knob .p-knob-text', `fill: ${variable('knob.text.color')} !important; font-size: ${variable('knob.text.fontSize')};`),
        rule('.p-knob.p-disabled', `opacity: ${variable('knob.root.disabledOpacity')};`),
        checkboxCss({
            name: 'tristatecheckbox',
            root: '.p-tristatecheckbox.p-checkbox',
            box: '> .p-checkbox-box',
            focusSelectors: ['.p-tristatecheckbox.p-checkbox:not(.p-disabled):has(> .p-checkbox-box:focus-visible) > .p-checkbox-box', '.p-tristatecheckbox.p-checkbox:not(.p-disabled):has(> .p-checkbox-input:focus-visible) > .p-checkbox-box']
        }),
        rule(
            '.p-tristatecheckbox.p-highlight:has(> .p-checkbox-input[value="false"]) > .p-checkbox-box',
            `background: ${variable('tristatecheckbox.unchecked.background')}; border-color: ${variable('tristatecheckbox.unchecked.borderColor')}; color: ${variable('tristatecheckbox.unchecked.color')};`
        ),
        rule(
            '.p-tristatecheckbox.p-highlight:not(.p-disabled):has(> .p-checkbox-input[value="false"]):hover > .p-checkbox-box',
            `background: ${variable('tristatecheckbox.unchecked.hoverBackground')}; border-color: ${variable('tristatecheckbox.unchecked.hoverBorderColor')};`
        ),
        rule(
            [
                '.p-tristatecheckbox.p-checkbox:not(.p-disabled):has(> .p-checkbox-box:focus-visible) > .p-checkbox-box.p-checkbox-box',
                '.p-tristatecheckbox.p-checkbox:not(.p-disabled):has(> .p-checkbox-input:focus-visible) > .p-checkbox-box.p-checkbox-box'
            ],
            `border-color: ${variable('tristatecheckbox.root.focusBorderColor')}; ${ring('tristatecheckbox.root.focusRing')}`
        ),
        rule('.p-tristatecheckbox.p-checkbox.p-invalid.p-invalid.p-invalid > .p-checkbox-box.p-checkbox-box', `border-color: ${variable('tristatecheckbox.root.invalidBorderColor')};`),
        rule('.p-tristatecheckbox.p-checkbox .p-checkbox-icon', `width: ${variable('tristatecheckbox.icon.size')}; height: ${variable('tristatecheckbox.icon.size')}; font-size: ${variable('tristatecheckbox.icon.size')};`),
        checkboxCss({ name: 'multistatecheckbox', root: '.p-multistatecheckbox > .p-checkbox', box: '> .p-checkbox-box', filledRoot: '.p-multistatecheckbox.p-variant-filled > .p-checkbox:not(.p-highlight)' }),
        rule('.p-multistatecheckbox > .p-checkbox .p-checkbox-icon', `width: ${variable('multistatecheckbox.icon.size')}; height: ${variable('multistatecheckbox.icon.size')}; font-size: ${variable('multistatecheckbox.icon.size')};`),
        ...['checkbox', 'radiobutton'].flatMap((name) => [
            rule(`.p-${name}.p-variant-filled:not(.p-highlight) > .p-${name}-box`, `background: ${variable(`${name}.root.filledBackground`)};`),
            rule(`.p-${name}.p-disabled`, `opacity: ${variable(`${name}.root.disabledOpacity`)};`),
            rule(`.p-${name}:not(.p-disabled):has(> .p-${name}-input:focus-visible) > .p-${name}-box`, ring(`${name}.root.focusRing`)),
            rule(`.p-${name}.p-invalid.p-invalid.p-invalid > .p-${name}-box`, `border-color: ${variable(`${name}.root.invalidBorderColor`)};`),
            rule(`.p-${name} .p-${name}-icon`, `width: ${variable(`${name}.icon.size`)}; height: ${variable(`${name}.icon.size`)}; font-size: ${variable(`${name}.icon.size`)};`)
        ]),
        rule('.p-radiobutton .p-radiobutton-icon', `background: ${variable('radiobutton.icon.color')}; border-radius: 50%;`),
        rule('.p-inputswitch.p-disabled', `opacity: ${variable('inputswitch.root.disabledOpacity')};`),
        rule('.p-inputswitch .p-inputswitch-slider', 'border: 1px solid transparent;'),
        rule('.p-inputswitch:not(.p-disabled):has(> .p-inputswitch-input:focus-visible) > .p-inputswitch-slider', ring('inputswitch.root.focusRing')),
        rule('.p-inputswitch.p-invalid.p-invalid.p-invalid .p-inputswitch-slider', `border-color: ${variable('inputswitch.root.invalidBorderColor')};`),
        rule(
            '.p-inputswitch .p-inputswitch-slider:before',
            `width: ${variable('inputswitch.handle.size')}; height: ${variable('inputswitch.handle.size')}; left: ${variable('inputswitch.handle.offset')}; margin-top: calc(${variable('inputswitch.handle.size')} / -2); border-radius: ${variable('inputswitch.handle.borderRadius')};`
        ),
        rule('.p-inputswitch.p-highlight .p-inputswitch-slider:before', `transform: translateX(calc(${variable('inputswitch.root.width')} - ${variable('inputswitch.handle.size')} - 2 * ${variable('inputswitch.handle.offset')}));`),
        rule('.p-selectbutton', `display: inline-flex; gap: ${variable('selectButton.root.gap')};`),
        buttonCss({
            name: 'selectButton',
            path: 'selectButton.button',
            button: '.p-selectbutton > .p-button.p-button.p-button.p-button',
            enabledButton: '.p-selectbutton > .p-button.p-button.p-button.p-button:not(.p-disabled)',
            checkedButton: '.p-selectbutton > .p-button.p-button.p-button.p-button.p-highlight',
            checkedHoverButton: '.p-selectbutton > .p-button.p-button.p-button.p-button.p-highlight:not(.p-disabled)',
            focusSelector: ['.p-selectbutton > .p-button.p-button.p-button.p-button:not(.p-disabled):focus-visible', '.p-selectbutton > .p-button.p-button.p-button.p-button:not(.p-disabled).p-focus'],
            invalidButton: '.p-selectbutton.p-invalid.p-invalid.p-invalid > .p-button.p-button.p-button.p-button',
            disabledButton: '.p-selectbutton > .p-button.p-button.p-button.p-button.p-disabled'
        }),
        rule('.p-selectbutton > .p-button.p-button.p-button.p-button:not(:first-child):not(:last-child)', 'border-radius: 0;'),
        rule('.p-selectbutton > .p-button.p-button.p-button.p-button:first-child:not(:last-child)', 'border-top-right-radius: 0; border-bottom-right-radius: 0;'),
        rule('.p-selectbutton > .p-button.p-button.p-button.p-button:last-child:not(:first-child)', 'border-top-left-radius: 0; border-bottom-left-radius: 0;'),
        buttonCss({
            name: 'toggleButton',
            path: 'toggleButton.root',
            button: '.p-togglebutton > .p-button.p-button.p-button.p-button',
            enabledButton: '.p-togglebutton:not(.p-disabled) > .p-button.p-button.p-button.p-button',
            checkedButton: '.p-togglebutton.p-highlight > .p-button.p-button.p-button.p-button',
            checkedHoverButton: '.p-togglebutton.p-highlight:not(.p-disabled) > .p-button.p-button.p-button.p-button',
            focusSelector: '.p-togglebutton:not(.p-disabled):has(> .p-togglebutton-input:focus-visible) > .p-button.p-button.p-button.p-button',
            invalidButton: '.p-togglebutton.p-invalid.p-invalid.p-invalid > .p-button.p-button.p-button.p-button',
            disabledButton: '.p-togglebutton.p-disabled'
        }),
        rule(
            '.p-togglebutton > .p-button .p-button-icon',
            `color: ${variable('toggleButton.icon.color')}; width: ${variable('toggleButton.icon.size')}; height: ${variable('toggleButton.icon.size')}; font-size: ${variable('toggleButton.icon.size')};`
        ),
        rule('.p-togglebutton.p-highlight > .p-button .p-button-icon', `color: ${variable('toggleButton.icon.selectedColor')};`),
        rule('.p-togglebutton > .p-button .p-button-icon-left', `margin-right: ${variable('toggleButton.icon.gap')};`),
        rule('.p-togglebutton > .p-button .p-button-icon-right', `margin-left: ${variable('toggleButton.icon.gap')};`)
    ].join('\n');
};
