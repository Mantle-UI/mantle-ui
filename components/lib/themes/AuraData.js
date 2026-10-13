const focusRing = () => ({ width: '{focusRing.width}', style: '{focusRing.style}', color: '{focusRing.color}', offset: '{focusRing.offset}' });
const frame = () => ({ background: '{surface.card}', color: '{text.color}', borderColor: '{surface.border}', borderWidth: '0', borderRadius: '{borderRadius.md}' });
const section = () => ({ background: '{surface.card}', color: '{text.color}', borderColor: '{surface.border}', paddingX: '0.75rem', paddingY: '0.75rem', fontWeight: '600' });
const content = () => ({ background: '{surface.card}', color: '{text.color}', paddingX: '0', paddingY: '0' });
const emptyMessage = () => ({ color: '{text.mutedColor}', paddingX: '0.75rem', paddingY: '0.75rem' });
const loading = () => ({ background: 'color-mix(in srgb, {surface.card}, transparent 25%)', color: '{primary.color}', iconSize: '2rem' });
const iconButton = () => ({ background: 'transparent', color: '{text.mutedColor}', hoverBackground: '{surface.100}', hoverColor: '{text.color}', size: '2rem', borderRadius: '50%', focusRing: focusRing() });
const filter = (withIcon = true) => ({
    background: '{formField.background}',
    color: '{formField.color}',
    borderColor: '{formField.borderColor}',
    hoverBorderColor: '{formField.hoverBorderColor}',
    focusBorderColor: '{formField.focusBorderColor}',
    borderRadius: '{formField.borderRadius}',
    placeholderColor: '{formField.placeholderColor}',
    paddingX: '{formField.paddingX}',
    paddingY: '{formField.paddingY}',
    ...(withIcon ? { iconColor: '{text.mutedColor}' } : {}),
    disabledOpacity: '{disabledOpacity}',
    focusRing: focusRing()
});
const item = () => ({
    background: 'transparent',
    color: '{text.color}',
    hoverBackground: '{surface.100}',
    hoverColor: '{text.color}',
    focusBackground: '{surface.100}',
    focusColor: '{text.color}',
    selectedBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)',
    selectedColor: '{primary.color}',
    selectedHoverBackground: 'color-mix(in srgb, {primary.color}, transparent 76%)',
    selectedFocusBackground: 'color-mix(in srgb, {primary.color}, transparent 70%)',
    borderRadius: '{borderRadius.sm}',
    paddingX: '0.75rem',
    paddingY: '0.5rem',
    focusRing: focusRing()
});
const actionButton = () => ({
    background: '{primary.color}',
    color: '{primary.contrastColor}',
    borderColor: '{primary.color}',
    hoverBackground: '{primary.hoverColor}',
    hoverBorderColor: '{primary.hoverColor}',
    activeBackground: '{primary.activeColor}',
    activeBorderColor: '{primary.activeColor}',
    size: '2.5rem',
    padding: '0.5rem',
    borderRadius: '{borderRadius.md}',
    disabledOpacity: '{disabledOpacity}',
    focusRing: focusRing()
});
const checkbox = () => ({
    background: '{formField.background}',
    color: '{formField.color}',
    borderColor: '{formField.borderColor}',
    hoverBorderColor: '{primary.color}',
    checkedBackground: '{primary.color}',
    checkedBorderColor: '{primary.color}',
    checkedColor: '{primary.contrastColor}',
    checkedHoverBackground: '{primary.hoverColor}',
    checkedHoverBorderColor: '{primary.hoverColor}',
    size: '1.375rem',
    iconSize: '0.875rem',
    borderRadius: '{borderRadius.md}',
    disabledOpacity: '{disabledOpacity}',
    focusRing: focusRing()
});
const row = () => ({
    background: '{surface.card}',
    color: '{text.color}',
    borderColor: '{surface.border}',
    stripedBackground: '{surface.50}',
    hoverBackground: '{surface.100}',
    hoverColor: '{text.color}',
    focusBackground: '{surface.100}',
    selectedBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)',
    selectedColor: '{primary.color}',
    selectedHoverBackground: 'color-mix(in srgb, {primary.color}, transparent 76%)',
    selectedFocusBackground: 'color-mix(in srgb, {primary.color}, transparent 70%)',
    focusRing: { ...focusRing(), offset: '-1px' }
});
const table = (name) => ({
    root: frame(),
    header: section(),
    footer: section(),
    columnHeader: {
        background: `{${name}.header.background}`,
        color: `{${name}.header.color}`,
        borderColor: `{${name}.header.borderColor}`,
        hoverBackground: '{surface.100}',
        hoverColor: '{text.color}',
        selectedBackground: '{surface.100}',
        selectedColor: '{primary.color}',
        selectedHoverBackground: '{surface.200}',
        paddingX: '0.75rem',
        paddingY: '0.75rem',
        fontWeight: '600',
        gap: '0.5rem',
        ...(name === 'datatable' ? { disabledOpacity: '{disabledOpacity}' } : {}),
        focusRing: { ...focusRing(), offset: '-1px' }
    },
    row: row(),
    cell: {
        borderColor: `{${name}.row.borderColor}`,
        hoverBackground: `{${name}.row.hoverBackground}`,
        hoverColor: `{${name}.row.hoverColor}`,
        paddingX: '0.75rem',
        paddingY: '0.75rem',
        borderWidth: '0 0 1px 0',
        ...(name === 'datatable' ? { selectedBackground: `{${name}.row.selectedBackground}`, selectedColor: `{${name}.row.selectedColor}` } : {}),
        editingBackground: '{surface.100}',
        focusRing: { ...focusRing(), offset: '-1px' }
    },
    sortIcon: { color: '{text.mutedColor}', selectedColor: '{primary.color}', size: '1rem' },
    sortBadge: { background: '{primary.color}', color: '{primary.contrastColor}', size: '1.25rem', borderRadius: '50%' },
    emptyMessage: emptyMessage(),
    loading: loading(),
    toggler: iconButton(),
    checkbox: checkbox(),
    columnResize: { color: '{primary.color}' },
    reorderIndicator: { color: '{primary.color}' }
});
const transferList = () => ({
    root: { gap: '1rem' },
    header: { ...section(), background: '{surface.50}', borderRadius: '{borderRadius.md}' },
    list: { background: '{formField.background}', color: '{formField.color}', borderColor: '{formField.borderColor}', borderRadius: '{borderRadius.md}', padding: '0.25rem', focusRing: focusRing() },
    item: item(),
    filterContainer: { background: '{surface.card}', borderColor: '{surface.border}', padding: '0.75rem' },
    filter: filter(),
    controls: { gap: '0.5rem' },
    button: actionButton()
});
const paginatorButton = () => ({
    background: 'transparent',
    color: '{text.mutedColor}',
    borderColor: 'transparent',
    hoverBackground: '{surface.100}',
    hoverColor: '{text.color}',
    hoverBorderColor: 'transparent',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    disabledOpacity: '{disabledOpacity}',
    focusRing: focusRing()
});

/** Data component tokens mapped to the maintained legacy DOM contracts. */
export const auraDataComponents = {
    datatable: {
        ...table('datatable'),
        size: { small: { paddingX: '0.5rem', paddingY: '0.5rem' }, large: { paddingX: '1rem', paddingY: '1rem' } },
        rowExpansion: { background: '{surface.card}', color: '{text.color}', paddingX: '0.75rem', paddingY: '0.75rem' },
        rowGroup: { ...section(), background: '{surface.50}' },
        rowEditor: iconButton(),
        filter: filter(false),
        filterButton: { ...iconButton(), activeBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)', activeColor: '{primary.color}', iconSize: '1rem' },
        filterPanel: { background: '{overlay.background}', color: '{overlay.color}', borderColor: '{overlay.borderColor}', borderRadius: '{borderRadius.md}', shadow: '0 8px 24px rgba(15, 23, 42, 0.12)', padding: '0.75rem', gap: '0.75rem' },
        filterOption: item(),
        filterSeparator: { color: '{surface.border}' },
        radiobutton: { ...checkbox(), borderRadius: '50%', iconSize: '0.625rem' },
        rowReorderIcon: { color: '{text.mutedColor}' },
        dragSelection: { background: 'color-mix(in srgb, {primary.color}, transparent 90%)', borderColor: '{primary.color}' }
    },
    treetable: { ...table('treetable'), filter: filter(false), partialCheckbox: { background: '{primary.color}', borderColor: '{primary.color}', color: '{primary.contrastColor}' } },
    dataview: {
        root: frame(),
        header: section(),
        footer: section(),
        content: content(),
        emptyMessage: emptyMessage(),
        loading: loading(),
        layoutButton: {
            ...actionButton(),
            background: '{formField.background}',
            color: '{formField.color}',
            borderColor: '{formField.borderColor}',
            hoverBackground: '{surface.100}',
            hoverBorderColor: '{formField.hoverBorderColor}',
            activeBackground: '{surface.200}',
            activeBorderColor: '{formField.hoverBorderColor}',
            selectedBackground: '{primary.color}',
            selectedColor: '{primary.contrastColor}',
            selectedBorderColor: '{primary.color}',
            selectedHoverBackground: '{primary.hoverColor}',
            selectedHoverBorderColor: '{primary.hoverColor}'
        }
    },
    datascroller: { root: frame(), header: section(), footer: section(), content: content(), list: { gap: '0' }, item: { color: '{text.color}', borderColor: '{surface.border}', paddingX: '0', paddingY: '0' }, emptyMessage: emptyMessage() },
    tree: {
        root: { ...frame(), borderWidth: '1px', padding: '0.75rem', disabledOpacity: '{disabledOpacity}' },
        header: section(),
        footer: section(),
        node: { ...item(), gap: '0.5rem', disabledColor: '{text.mutedColor}', dragoverBackground: 'color-mix(in srgb, {primary.color}, transparent 76%)', dragoverColor: '{primary.color}' },
        children: { indent: '1rem' },
        nodeIcon: { color: '{text.mutedColor}', selectedColor: '{primary.color}', size: '1rem' },
        toggler: iconButton(),
        checkbox: checkbox(),
        partialCheckbox: { background: '{primary.color}', borderColor: '{primary.color}', color: '{primary.contrastColor}' },
        filter: filter(),
        filterContainer: { marginBottom: '0.75rem' },
        emptyMessage: emptyMessage(),
        loading: loading(),
        droppoint: { background: 'transparent', activeBackground: '{primary.color}', size: '0.5rem' }
    },
    orderlist: { ...transferList(), droppoint: { background: 'transparent', activeBackground: '{primary.color}', size: '0.5rem' } },
    picklist: {
        ...transferList(),
        source: { listBackground: '{formField.background}', listColor: '{formField.color}', listBorderColor: '{formField.borderColor}', headerBackground: '{surface.50}', headerColor: '{text.color}' },
        target: { listBackground: '{formField.background}', listColor: '{formField.color}', listBorderColor: '{formField.borderColor}', headerBackground: '{surface.50}', headerColor: '{text.color}' }
    },
    paginator: {
        root: { ...frame(), borderWidth: '1px', paddingX: '0.75rem', paddingY: '0.5rem', gap: '0.25rem' },
        pages: { gap: '0.25rem' },
        pageButton: {
            ...paginatorButton(),
            selectedBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)',
            selectedColor: '{primary.color}',
            selectedBorderColor: 'transparent',
            selectedHoverBackground: 'color-mix(in srgb, {primary.color}, transparent 76%)',
            selectedHoverColor: '{primary.color}'
        },
        navigationButton: paginatorButton(),
        icon: { color: '{paginator.navigationButton.color}', hoverColor: '{paginator.navigationButton.hoverColor}', size: '1rem' },
        current: { color: '{text.mutedColor}', paddingX: '0.5rem', paddingY: '0.5rem' },
        dropdown: { ...filter(), triggerWidth: '2.5rem' },
        pageInput: filter(false)
    },
    virtualscroller: { root: { ...frame(), focusRing: focusRing() }, content: { background: '{surface.card}', color: '{text.color}' }, loading: loading() }
};

/** Visual styling only: no virtual dimensions, transforms, or scroll offsets. */
export const auraDataCss = ({ prefix = 'mantle' } = {}) => {
    const variable = (path) =>
        `var(--${prefix}-${path
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
            .replaceAll('.', '-')
            .toLowerCase()})`;
    const rule = (selectors, declarations) => `${Array.isArray(selectors) ? selectors.join(',\n') : selectors} {\n${declarations}\n}\n`;
    const ring = (path) => `outline: ${variable(`${path}.width`)} ${variable(`${path}.style`)} ${variable(`${path}.color`)}; outline-offset: ${variable(`${path}.offset`)}; box-shadow: none;`;
    const frameCss = (name, selector = `.p-${name}`) =>
        rule(
            selector,
            `background: ${variable(`${name}.root.background`)}; color: ${variable(`${name}.root.color`)}; border: ${variable(`${name}.root.borderWidth`)} solid ${variable(`${name}.root.borderColor`)}; border-radius: ${variable(`${name}.root.borderRadius`)};`
        );
    const sectionCss = (name, part, selector = `.p-${name} .p-${name}-${part}`) =>
        rule(
            selector,
            `background: ${variable(`${name}.${part}.background`)}; color: ${variable(`${name}.${part}.color`)}; border: solid ${variable(`${name}.${part}.borderColor`)}; border-width: ${part === 'footer' ? '1px 0 0' : '0 0 1px'}; padding: ${variable(`${name}.${part}.paddingY`)} ${variable(`${name}.${part}.paddingX`)}; font-weight: ${variable(`${name}.${part}.fontWeight`)};`
        );
    const contentCss = (name) =>
        rule(`.p-${name} .p-${name}-content`, `background: ${variable(`${name}.content.background`)}; color: ${variable(`${name}.content.color`)}; padding: ${variable(`${name}.content.paddingY`)} ${variable(`${name}.content.paddingX`)};`);
    const emptyCss = (name, selector) => rule(selector, `color: ${variable(`${name}.emptyMessage.color`)}; padding: ${variable(`${name}.emptyMessage.paddingY`)} ${variable(`${name}.emptyMessage.paddingX`)};`);
    const loadingCss = (name, overlay = `.p-${name} .p-${name}-loading-overlay`, icon = `.p-${name} .p-${name}-loading-icon`) =>
        [
            rule(overlay, `background: ${variable(`${name}.loading.background`)}; color: ${variable(`${name}.loading.color`)}; ${name === 'virtualscroller' ? '' : 'inset: 0;'}`),
            rule(icon, `color: ${variable(`${name}.loading.color`)}; width: ${variable(`${name}.loading.iconSize`)}; height: ${variable(`${name}.loading.iconSize`)}; font-size: ${variable(`${name}.loading.iconSize`)};`)
        ].join('\n');

    const iconButtonCss = (name, part, selectors) => {
        const path = `${name}.${part}`;
        const buttons = Array.isArray(selectors) ? selectors : [selectors];

        return [
            rule(
                buttons,
                `background: ${variable(`${path}.background`)}; color: ${variable(`${path}.color`)}; border: 0; width: ${variable(`${path}.size`)}; height: ${variable(`${path}.size`)}; border-radius: ${variable(`${path}.borderRadius`)}; padding: 0;`
            ),
            rule(
                buttons.map((selector) => `${selector}:not(:disabled):hover`),
                `background: ${variable(`${path}.hoverBackground`)}; color: ${variable(`${path}.hoverColor`)};`
            ),
            rule(
                buttons.map((selector) => `${selector}:not(:disabled):focus-visible`),
                ring(`${path}.focusRing`)
            )
        ].join('\n');
    };

    const filterCss = ({ name, selector, part = 'filter', iconSelector, withIcon = false }) => {
        const path = `${name}.${part}`;

        return [
            rule(
                selector,
                `background: ${variable(`${path}.background`)}; color: ${variable(`${path}.color`)}; border: 1px solid ${variable(`${path}.borderColor`)}; border-radius: ${variable(`${path}.borderRadius`)}; padding: ${variable(`${path}.paddingY`)} ${withIcon ? `calc(${variable(`${path}.paddingX`)} + 1.5rem)` : variable(`${path}.paddingX`)} ${variable(`${path}.paddingY`)} ${variable(`${path}.paddingX`)};`
            ),
            rule(`${selector}:not(:disabled):not(.p-disabled):hover`, `border-color: ${variable(`${path}.hoverBorderColor`)};`),
            rule(`${selector}:not(:disabled):not(.p-disabled):focus-visible`, `border-color: ${variable(`${path}.focusBorderColor`)}; ${ring(`${path}.focusRing`)}`),
            rule(`${selector}::placeholder`, `color: ${variable(`${path}.placeholderColor`)};`),
            rule([`${selector}:disabled`, `${selector}.p-disabled`], `opacity: ${variable(`${path}.disabledOpacity`)};`),
            iconSelector ? rule(iconSelector, `color: ${variable(`${path}.iconColor`)}; ${withIcon ? `right: ${variable(`${path}.paddingX`)};` : ''}`) : ''
        ].join('\n');
    };

    const itemCss = ({ name, selector, part = 'item', focusSelectors = [`${selector}.p-focus`, `${selector}:focus-visible`], selectedFocusSelectors = [`${selector}.p-highlight.p-focus`, `${selector}.p-highlight:focus-visible`] }) => {
        const path = `${name}.${part}`;

        return [
            rule(selector, `background: ${variable(`${path}.background`)}; color: ${variable(`${path}.color`)}; padding: ${variable(`${path}.paddingY`)} ${variable(`${path}.paddingX`)}; border-radius: ${variable(`${path}.borderRadius`)};`),
            rule(`${selector}:not(.p-highlight):not(.p-disabled):hover`, `background: ${variable(`${path}.hoverBackground`)}; color: ${variable(`${path}.hoverColor`)};`),
            rule(
                focusSelectors.map((item) => `${item}:not(.p-highlight):not(.p-disabled)`),
                `background: ${variable(`${path}.focusBackground`)}; color: ${variable(`${path}.focusColor`)}; ${ring(`${path}.focusRing`)}`
            ),
            rule(`${selector}.p-highlight`, `background: ${variable(`${path}.selectedBackground`)}; color: ${variable(`${path}.selectedColor`)};`),
            rule(`${selector}.p-highlight:not(.p-disabled):hover`, `background: ${variable(`${path}.selectedHoverBackground`)};`),
            rule(
                selectedFocusSelectors.map((item) => `${item}:not(.p-disabled)`),
                `background: ${variable(`${path}.selectedFocusBackground`)}; ${ring(`${path}.focusRing`)}`
            )
        ].join('\n');
    };

    const actionCss = (name, part, selector) => {
        const path = `${name}.${part}`;

        return [
            rule(
                selector,
                `background: ${variable(`${path}.background`)}; border: 1px solid ${variable(`${path}.borderColor`)}; color: ${variable(`${path}.color`)}; border-radius: ${variable(`${path}.borderRadius`)}; width: ${variable(`${path}.size`)}; height: ${variable(`${path}.size`)}; padding: ${variable(`${path}.padding`)};`
            ),
            rule(`${selector}:not(:disabled):hover`, `background: ${variable(`${path}.hoverBackground`)}; border-color: ${variable(`${path}.hoverBorderColor`)};`),
            rule(`${selector}:not(:disabled):active`, `background: ${variable(`${path}.activeBackground`)}; border-color: ${variable(`${path}.activeBorderColor`)};`),
            rule(`${selector}:not(:disabled):focus-visible`, ring(`${path}.focusRing`)),
            rule(`${selector}:disabled`, `opacity: ${variable(`${path}.disabledOpacity`)};`)
        ].join('\n');
    };

    const checkboxCss = (name, container, part = 'checkbox', radio = false) => {
        const path = `${name}.${part}`;
        const component = radio ? 'radiobutton' : 'checkbox';
        const root = `${container} .p-${component}`;
        const box = `.p-${component}-box`;

        return [
            rule(root, `width: ${variable(`${path}.size`)}; height: ${variable(`${path}.size`)};`),
            rule(
                `${root} > ${box}`,
                `background: ${variable(`${path}.background`)}; color: ${variable(`${path}.color`)}; border: 2px solid ${variable(`${path}.borderColor`)}; border-radius: ${variable(`${path}.borderRadius`)}; width: ${variable(`${path}.size`)}; height: ${variable(`${path}.size`)};`
            ),
            rule(`${root}:not(.p-disabled):not(.p-highlight):has(> .p-${component}-input:hover) > ${box}`, `border-color: ${variable(`${path}.hoverBorderColor`)};`),
            rule(`${root}.p-highlight > ${box}`, `background: ${variable(`${path}.checkedBackground`)}; color: ${variable(`${path}.checkedColor`)}; border-color: ${variable(`${path}.checkedBorderColor`)};`),
            rule(`${root}.p-highlight:not(.p-disabled):has(> .p-${component}-input:hover) > ${box}`, `background: ${variable(`${path}.checkedHoverBackground`)}; border-color: ${variable(`${path}.checkedHoverBorderColor`)};`),
            rule(`${root}:not(.p-disabled):has(> .p-${component}-input:focus-visible) > ${box}`, ring(`${path}.focusRing`)),
            rule(`${root} .p-${component}-icon`, `width: ${variable(`${path}.iconSize`)}; height: ${variable(`${path}.iconSize`)}; font-size: ${variable(`${path}.iconSize`)}; ${radio ? `background: ${variable(`${path}.checkedColor`)};` : ''}`),
            rule(`${root}.p-disabled`, `opacity: ${variable(`${path}.disabledOpacity`)};`)
        ].join('\n');
    };

    const tableCss = (name) => {
        const root = `.p-${name}`;
        const headerCell = `${root} .p-${name}-thead > tr > th`;
        const bodyRow = `${root} .p-${name}-tbody > tr`;
        const bodyCell = `${bodyRow} > td`;
        const footerCell = `${root} .p-${name}-tfoot > tr > td`;

        return [
            frameCss(name),
            sectionCss(name, 'header'),
            sectionCss(name, 'footer'),
            rule(
                headerCell,
                `background: ${variable(`${name}.columnHeader.background`)}; color: ${variable(`${name}.columnHeader.color`)}; border: solid ${variable(`${name}.columnHeader.borderColor`)}; border-width: 0 0 1px; padding: ${variable(`${name}.columnHeader.paddingY`)} ${variable(`${name}.columnHeader.paddingX`)}; font-weight: ${variable(`${name}.columnHeader.fontWeight`)};`
            ),
            rule(`${headerCell}.p-sortable-column:not(.p-sortable-disabled):not(.p-highlight):hover`, `background: ${variable(`${name}.columnHeader.hoverBackground`)}; color: ${variable(`${name}.columnHeader.hoverColor`)};`),
            rule(`${headerCell}.p-highlight`, `background: ${variable(`${name}.columnHeader.selectedBackground`)}; color: ${variable(`${name}.columnHeader.selectedColor`)};`),
            rule(`${headerCell}.p-highlight:not(.p-sortable-disabled):hover`, `background: ${variable(`${name}.columnHeader.selectedHoverBackground`)};`),
            rule(`${headerCell}.p-sortable-column:not(.p-sortable-disabled):focus-visible`, ring(`${name}.columnHeader.focusRing`)),
            name === 'datatable' ? rule(`${headerCell}.p-sortable-disabled`, `opacity: ${variable(`${name}.columnHeader.disabledOpacity`)};`) : '',
            rule(`${root} .p-column-header-content`, `display: flex; align-items: center; gap: ${variable(`${name}.columnHeader.gap`)};`),
            rule(bodyRow, `background: ${variable(`${name}.row.background`)}; color: ${variable(`${name}.row.color`)}; border-color: ${variable(`${name}.row.borderColor`)};`),
            rule(`${root}.p-${name}-striped .p-${name}-tbody > tr.p-row-odd:not(.p-highlight):not(.p-highlight-contextmenu)`, `background: ${variable(`${name}.row.stripedBackground`)};`),
            rule(`${root}.p-${name}-hoverable-rows .p-${name}-tbody > tr:not(.p-highlight):not(.p-highlight-contextmenu):hover`, `background: ${variable(`${name}.row.hoverBackground`)}; color: ${variable(`${name}.row.hoverColor`)};`),
            rule(
                `${root}.p-${name}-selectable .p-${name}-tbody > tr${name === 'datatable' ? '.p-selectable-row' : ''}:not(.p-highlight):not(.p-highlight-contextmenu):not(.p-${name}-emptymessage):hover`,
                `background: ${variable(`${name}.row.hoverBackground`)}; color: ${variable(`${name}.row.hoverColor`)};`
            ),
            rule(`${bodyRow}.p-highlight`, `background: ${variable(`${name}.row.selectedBackground`)}; color: ${variable(`${name}.row.selectedColor`)};`),
            rule(`${bodyRow}.p-highlight-contextmenu`, `background: ${variable(`${name}.row.selectedBackground`)}; color: ${variable(`${name}.row.selectedColor`)};`),
            rule(`${bodyRow}.p-highlight:hover`, `background: ${variable(`${name}.row.selectedHoverBackground`)};`),
            rule(`${root}${root} .p-${name}-tbody > tr:not(.p-highlight):focus-visible`, `background: ${variable(`${name}.row.focusBackground`)}; ${ring(`${name}.row.focusRing`)}`),
            rule(`${root}${root} .p-${name}-tbody > tr.p-highlight:focus-visible`, `background: ${variable(`${name}.row.selectedFocusBackground`)}; ${ring(`${name}.row.focusRing`)}`),
            // Cell backgrounds inherit the row so selected, striped and frozen
            // rows remain coherent while inline column widths remain intact.
            rule(
                bodyCell,
                `background: inherit; color: inherit; border: solid ${variable(`${name}.cell.borderColor`)}; border-width: ${variable(`${name}.cell.borderWidth`)}; padding: ${variable(`${name}.cell.paddingY`)} ${variable(`${name}.cell.paddingX`)};`
            ),
            name === 'datatable' ? rule(`${bodyCell}.p-highlight`, `background: ${variable(`${name}.cell.selectedBackground`)}; color: ${variable(`${name}.cell.selectedColor`)};`) : '',
            rule(`${bodyCell}.p-selectable-cell:not(.p-highlight):hover`, `background: ${variable(`${name}.cell.hoverBackground`)}; color: ${variable(`${name}.cell.hoverColor`)};`),
            rule(`${bodyCell}.p-cell-editing`, `background: ${variable(`${name}.cell.editingBackground`)};`),
            rule([`${bodyCell}.p-selectable-cell:focus-visible`, `${bodyCell}.p-cell-editing:focus-within`], ring(`${name}.cell.focusRing`)),
            sectionCss(name, 'footer', footerCell),
            rule([`${root}.p-${name}-gridlines .p-${name}-thead > tr > th`, `${root}.p-${name}-gridlines .p-${name}-tbody > tr > td`, `${root}.p-${name}-gridlines .p-${name}-tfoot > tr > td`], 'border-width: 1px;'),
            rule(`${root} .p-sortable-column-icon`, `color: ${variable(`${name}.sortIcon.color`)}; width: ${variable(`${name}.sortIcon.size`)}; height: ${variable(`${name}.sortIcon.size`)}; font-size: ${variable(`${name}.sortIcon.size`)};`),
            rule(`${root} .p-sortable-column.p-highlight .p-sortable-column-icon`, `color: ${variable(`${name}.sortIcon.selectedColor`)};`),
            rule(
                `${root} .p-sortable-column-badge`,
                `background: ${variable(`${name}.sortBadge.background`)}; color: ${variable(`${name}.sortBadge.color`)}; width: ${variable(`${name}.sortBadge.size`)}; height: ${variable(`${name}.sortBadge.size`)}; border-radius: ${variable(`${name}.sortBadge.borderRadius`)};`
            ),
            emptyCss(name, `${root} .p-${name}-emptymessage > td`),
            loadingCss(name),
            iconButtonCss(name, 'toggler', `${root} .p-${name === 'datatable' ? 'row' : name}-toggler`),
            checkboxCss(name, root),
            rule(`${root} .p-column-resizer-helper`, `background: ${variable(`${name}.columnResize.color`)};`),
            rule([`${root} .p-${name}-reorder-indicator-up`, `${root} .p-${name}-reorder-indicator-down`], `color: ${variable(`${name}.reorderIndicator.color`)};`)
        ].join('\n');
    };

    const transferCss = (name) =>
        [
            rule(`.p-${name}`, `gap: ${variable(`${name}.root.gap`)};`),
            sectionCss(name, 'header'),
            rule(`.p-${name} .p-${name}-header`, `border: 1px solid ${variable(`${name}.header.borderColor`)}; border-top-left-radius: ${variable(`${name}.header.borderRadius`)}; border-top-right-radius: ${variable(`${name}.header.borderRadius`)};`),
            rule(
                `.p-${name} .p-${name}-list`,
                `background: ${variable(`${name}.list.background`)}; color: ${variable(`${name}.list.color`)}; border: 1px solid ${variable(`${name}.list.borderColor`)}; border-radius: ${variable(`${name}.list.borderRadius`)}; padding: ${variable(`${name}.list.padding`)};`
            ),
            rule(`.p-${name} .p-${name}-list:focus-visible`, ring(`${name}.list.focusRing`)),
            itemCss({ name, selector: `.p-${name} .p-${name}-item` }),
            rule(
                `.p-${name} .p-${name}-filter-container`,
                `background: ${variable(`${name}.filterContainer.background`)}; border: 1px solid ${variable(`${name}.filterContainer.borderColor`)}; padding: ${variable(`${name}.filterContainer.padding`)};`
            ),
            filterCss({ name, selector: `.p-${name} .p-${name}-filter-input.p-inputtext`, iconSelector: `.p-${name} .p-${name}-filter-icon`, withIcon: true }),
            rule(`.p-${name} .p-${name}-${name === 'picklist' ? 'buttons' : 'controls'}`, `gap: ${variable(`${name}.controls.gap`)};`),
            // Four repeated Button classes beat the base Button hover/active rules.
            actionCss(name, 'button', `.p-${name} .p-${name}-${name === 'picklist' ? 'buttons' : 'controls'} > .p-button.p-button.p-button.p-button`)
        ].join('\n');

    const paginatorButtonCss = (part, selector) => {
        const path = `paginator.${part}`;

        return [
            rule(
                selector,
                `background: ${variable(`${path}.background`)}; color: ${variable(`${path}.color`)}; border: 1px solid ${variable(`${path}.borderColor`)}; width: ${variable(`${path}.width`)}; height: ${variable(`${path}.height`)}; border-radius: ${variable(`${path}.borderRadius`)}; padding: 0;`
            ),
            rule(`${selector}:not(:disabled):not(.p-disabled):hover`, `background: ${variable(`${path}.hoverBackground`)}; color: ${variable(`${path}.hoverColor`)}; border-color: ${variable(`${path}.hoverBorderColor`)};`),
            rule(`${selector}:not(:disabled):not(.p-disabled):focus-visible`, ring(`${path}.focusRing`)),
            rule([`${selector}:disabled`, `${selector}.p-disabled`], `opacity: ${variable(`${path}.disabledOpacity`)};`)
        ].join('\n');
    };

    return [
        tableCss('datatable'),
        tableCss('treetable'),
        ...['small', 'large'].map((size) =>
            rule(
                [
                    `.p-datatable.p-datatable-${size === 'small' ? 'sm' : 'lg'} .p-datatable-thead > tr > th`,
                    `.p-datatable.p-datatable-${size === 'small' ? 'sm' : 'lg'} .p-datatable-tbody > tr > td`,
                    `.p-datatable.p-datatable-${size === 'small' ? 'sm' : 'lg'} .p-datatable-tfoot > tr > td`
                ],
                `padding: ${variable(`datatable.size.${size}.paddingY`)} ${variable(`datatable.size.${size}.paddingX`)};`
            )
        ),
        rule(
            '.p-datatable .p-datatable-row-expansion > td',
            `background: ${variable('datatable.rowExpansion.background')}; color: ${variable('datatable.rowExpansion.color')}; padding: ${variable('datatable.rowExpansion.paddingY')} ${variable('datatable.rowExpansion.paddingX')};`
        ),
        sectionCss('datatable', 'rowGroup', ['.p-datatable .p-rowgroup-header > td', '.p-datatable .p-rowgroup-footer > td']),
        iconButtonCss('datatable', 'rowEditor', ['.p-datatable .p-row-editor-init', '.p-datatable .p-row-editor-save', '.p-datatable .p-row-editor-cancel']),
        filterCss({ name: 'datatable', selector: '.p-datatable .p-column-filter.p-inputtext' }),
        filterCss({ name: 'datatable', selector: '.p-column-filter-overlay .p-column-filter.p-inputtext' }),
        iconButtonCss('datatable', 'filterButton', ['.p-datatable .p-column-filter-menu-button', '.p-datatable .p-column-filter-clear-button']),
        rule(['.p-datatable .p-column-filter-menu-button > svg', '.p-datatable .p-column-filter-clear-button > svg'], `width: ${variable('datatable.filterButton.iconSize')}; height: ${variable('datatable.filterButton.iconSize')};`),
        rule(['.p-datatable .p-column-filter-menu-button-active', '.p-datatable .p-column-filter-menu-button-open'], `background: ${variable('datatable.filterButton.activeBackground')}; color: ${variable('datatable.filterButton.activeColor')};`),
        rule(
            '.p-column-filter-overlay',
            `background: ${variable('datatable.filterPanel.background')}; color: ${variable('datatable.filterPanel.color')}; border: 1px solid ${variable('datatable.filterPanel.borderColor')}; border-radius: ${variable('datatable.filterPanel.borderRadius')}; box-shadow: ${variable('datatable.filterPanel.shadow')}; padding: ${variable('datatable.filterPanel.padding')};`
        ),
        rule('.p-column-filter-overlay .p-column-filter-constraint', `margin-bottom: ${variable('datatable.filterPanel.gap')};`),
        rule('.p-column-filter-overlay .p-column-filter-buttonbar', `gap: ${variable('datatable.filterPanel.gap')};`),
        itemCss({ name: 'datatable', part: 'filterOption', selector: '.p-column-filter-overlay .p-column-filter-row-item' }),
        rule('.p-column-filter-overlay .p-column-filter-separator', `border: 0; border-top: 1px solid ${variable('datatable.filterSeparator.color')};`),
        checkboxCss('datatable', '.p-datatable', 'radiobutton', true),
        rule('.p-datatable .p-datatable-reorderablerow-handle', `color: ${variable('datatable.rowReorderIcon.color')};`),
        // TableBody propagates its provider scope and row color scheme through
        // usePortalTheme when this helper is appended to document.body.
        rule('.p-datatable-drag-selection-helper', `background: ${variable('datatable.dragSelection.background')}; border: 1px solid ${variable('datatable.dragSelection.borderColor')};`),
        filterCss({ name: 'treetable', selector: '.p-treetable .p-treetable-thead .p-inputtext' }),
        rule(
            '.p-treetable .p-treetable-checkbox.p-indeterminate > .p-checkbox-box',
            `background: ${variable('treetable.partialCheckbox.background')}; color: ${variable('treetable.partialCheckbox.color')}; border-color: ${variable('treetable.partialCheckbox.borderColor')};`
        ),
        frameCss('dataview', '.p-dataview:not(.p-dataview-layout-options)'),
        sectionCss('dataview', 'header'),
        sectionCss('dataview', 'footer'),
        contentCss('dataview'),
        emptyCss('dataview', '.p-dataview .p-dataview-emptymessage'),
        loadingCss('dataview'),
        actionCss('dataview', 'layoutButton', '.p-dataview-layout-options > .p-button.p-button.p-button.p-button.p-button'),
        rule(
            '.p-dataview-layout-options > .p-button.p-button.p-button.p-button.p-button.p-highlight',
            `background: ${variable('dataview.layoutButton.selectedBackground')}; color: ${variable('dataview.layoutButton.selectedColor')}; border-color: ${variable('dataview.layoutButton.selectedBorderColor')};`
        ),
        rule(
            '.p-dataview-layout-options > .p-button.p-button.p-button.p-button.p-button.p-highlight:not(:disabled):hover',
            `background: ${variable('dataview.layoutButton.selectedHoverBackground')}; border-color: ${variable('dataview.layoutButton.selectedHoverBorderColor')};`
        ),
        rule('.p-dataview-layout-options > .p-button.p-button.p-button.p-button.p-button:first-child:not(:last-child)', 'border-top-right-radius: 0; border-bottom-right-radius: 0;'),
        rule('.p-dataview-layout-options > .p-button.p-button.p-button.p-button.p-button:last-child:not(:first-child)', 'border-top-left-radius: 0; border-bottom-left-radius: 0;'),
        frameCss('datascroller'),
        sectionCss('datascroller', 'header'),
        sectionCss('datascroller', 'footer'),
        contentCss('datascroller'),
        rule('.p-datascroller .p-datascroller-list', `display: flex; flex-direction: column; gap: ${variable('datascroller.list.gap')};`),
        rule(
            '.p-datascroller .p-datascroller-list > [data-pc-section="item"]',
            `color: ${variable('datascroller.item.color')}; border-bottom: 1px solid ${variable('datascroller.item.borderColor')}; padding: ${variable('datascroller.item.paddingY')} ${variable('datascroller.item.paddingX')};`
        ),
        emptyCss('datascroller', '.p-datascroller .p-datascroller-list > [data-pc-section="emptymessage"]'),
        frameCss('tree'),
        rule('.p-tree', `padding: ${variable('tree.root.padding')};`),
        sectionCss('tree', 'header', ':where(.p-tree) .p-tree-header'),
        sectionCss('tree', 'footer', ':where(.p-tree) .p-tree-footer'),
        // :where() keeps embedded TreeSelect part overrides more specific than
        // the standalone Tree defaults, regardless of module ordering.
        itemCss({
            name: 'tree',
            part: 'node',
            selector: ':where(.p-tree) .p-treenode-content',
            focusSelectors: [':where(.p-tree) .p-treenode:focus-visible > .p-treenode-content'],
            selectedFocusSelectors: [':where(.p-tree) .p-treenode:focus-visible > .p-treenode-content.p-highlight']
        }),
        rule(':where(.p-tree) .p-treenode-content', `gap: ${variable('tree.node.gap')};`),
        rule(':where(.p-tree) .p-treenode-content.p-disabled', `color: ${variable('tree.node.disabledColor')};`),
        rule(':where(.p-tree) .p-treenode-content.p-treenode-dragover', `background: ${variable('tree.node.dragoverBackground')}; color: ${variable('tree.node.dragoverColor')};`),
        rule(':where(.p-tree) .p-treenode-children', `padding-left: ${variable('tree.children.indent')};`),
        rule(':where(.p-tree) .p-treenode-icon', `color: ${variable('tree.nodeIcon.color')}; width: ${variable('tree.nodeIcon.size')}; height: ${variable('tree.nodeIcon.size')}; font-size: ${variable('tree.nodeIcon.size')};`),
        rule(':where(.p-tree) .p-treenode-content.p-highlight .p-treenode-icon', `color: ${variable('tree.nodeIcon.selectedColor')};`),
        iconButtonCss('tree', 'toggler', ':where(.p-tree) .p-tree-toggler'),
        checkboxCss('tree', ':where(.p-tree)'),
        rule(
            ':where(.p-tree) .p-checkbox.p-indeterminate > .p-checkbox-box',
            `background: ${variable('tree.partialCheckbox.background')}; color: ${variable('tree.partialCheckbox.color')}; border-color: ${variable('tree.partialCheckbox.borderColor')};`
        ),
        filterCss({ name: 'tree', selector: ':where(.p-tree) .p-tree-filter.p-inputtext', iconSelector: ':where(.p-tree) .p-tree-filter-icon', withIcon: true }),
        rule(':where(.p-tree) .p-tree-filter-container', `margin-bottom: ${variable('tree.filterContainer.marginBottom')};`),
        emptyCss('tree', ':where(.p-tree) .p-tree-empty-message > .p-treenode-content'),
        loadingCss('tree'),
        rule(':where(.p-tree) .p-treenode-droppoint', `background: ${variable('tree.droppoint.background')}; height: ${variable('tree.droppoint.size')};`),
        rule(':where(.p-tree) .p-treenode-droppoint-active', `background: ${variable('tree.droppoint.activeBackground')};`),
        rule('.p-tree.p-disabled', `opacity: ${variable('tree.root.disabledOpacity')};`),
        rule(['.p-tree.p-disabled .p-checkbox.p-disabled', '.p-tree.p-disabled .p-tree-filter.p-inputtext'], 'opacity: 1;'),
        transferCss('orderlist'),
        transferCss('picklist'),
        rule('.p-orderlist .p-orderlist-droppoint', `background: ${variable('orderlist.droppoint.background')}; height: ${variable('orderlist.droppoint.size')};`),
        // OrderList sets this data attribute during drag; its legacy Base CSS
        // watches a class that the runtime does not currently add.
        rule(['.p-orderlist .p-orderlist-droppoint[data-p-orderlist-droppoint-highlight="true"]', '.p-orderlist .p-orderlist-droppoint.p-orderlist-droppoint-highlight'], `background: ${variable('orderlist.droppoint.activeBackground')};`),
        ...['source', 'target'].flatMap((side) => [
            rule(`.p-picklist .p-picklist-list.p-picklist-${side}`, `background: ${variable(`picklist.${side}.listBackground`)}; color: ${variable(`picklist.${side}.listColor`)}; border-color: ${variable(`picklist.${side}.listBorderColor`)};`),
            rule(`.p-picklist .p-picklist-${side}-wrapper .p-picklist-header`, `background: ${variable(`picklist.${side}.headerBackground`)}; color: ${variable(`picklist.${side}.headerColor`)};`)
        ]),
        frameCss('paginator'),
        rule('.p-paginator', `padding: ${variable('paginator.root.paddingY')} ${variable('paginator.root.paddingX')}; gap: ${variable('paginator.root.gap')};`),
        rule('.p-paginator .p-paginator-pages', `display: inline-flex; gap: ${variable('paginator.pages.gap')};`),
        paginatorButtonCss('pageButton', '.p-paginator .p-paginator-page'),
        paginatorButtonCss('navigationButton', '.p-paginator .p-paginator-element:not(.p-paginator-page)'),
        rule(
            '.p-paginator .p-paginator-page.p-highlight',
            `background: ${variable('paginator.pageButton.selectedBackground')}; color: ${variable('paginator.pageButton.selectedColor')}; border-color: ${variable('paginator.pageButton.selectedBorderColor')};`
        ),
        rule('.p-paginator .p-paginator-page.p-highlight:not(:disabled):not(.p-disabled):hover', `background: ${variable('paginator.pageButton.selectedHoverBackground')}; color: ${variable('paginator.pageButton.selectedHoverColor')};`),
        rule('.p-paginator .p-paginator-icon', `color: ${variable('paginator.icon.color')}; width: ${variable('paginator.icon.size')}; height: ${variable('paginator.icon.size')}; font-size: ${variable('paginator.icon.size')};`),
        rule('.p-paginator .p-paginator-element:not(:disabled):not(.p-disabled):hover .p-paginator-icon', `color: ${variable('paginator.icon.hoverColor')};`),
        rule('.p-paginator .p-paginator-current', `color: ${variable('paginator.current.color')}; padding: ${variable('paginator.current.paddingY')} ${variable('paginator.current.paddingX')};`),
        rule(
            '.p-paginator > .p-dropdown',
            `background: ${variable('paginator.dropdown.background')}; color: ${variable('paginator.dropdown.color')}; border: 1px solid ${variable('paginator.dropdown.borderColor')}; border-radius: ${variable('paginator.dropdown.borderRadius')};`
        ),
        rule('.p-paginator > .p-dropdown:not(.p-disabled):hover', `border-color: ${variable('paginator.dropdown.hoverBorderColor')};`),
        rule('.p-paginator > .p-dropdown:not(.p-disabled).p-focus', `border-color: ${variable('paginator.dropdown.focusBorderColor')}; ${ring('paginator.dropdown.focusRing')}`),
        rule('.p-paginator > .p-dropdown .p-dropdown-label', `color: ${variable('paginator.dropdown.color')}; padding: ${variable('paginator.dropdown.paddingY')} ${variable('paginator.dropdown.paddingX')};`),
        rule('.p-paginator > .p-dropdown .p-dropdown-label.p-placeholder', `color: ${variable('paginator.dropdown.placeholderColor')};`),
        rule('.p-paginator > .p-dropdown .p-dropdown-trigger', `color: ${variable('paginator.dropdown.iconColor')}; width: ${variable('paginator.dropdown.triggerWidth')};`),
        rule('.p-paginator > .p-dropdown.p-disabled', `opacity: ${variable('paginator.dropdown.disabledOpacity')};`),
        filterCss({ name: 'paginator', part: 'pageInput', selector: '.p-paginator .p-paginator-page-input .p-inputnumber-input.p-inputtext' }),
        frameCss('virtualscroller'),
        rule('.p-virtualscroller:focus-visible', ring('virtualscroller.root.focusRing')),
        rule('.p-virtualscroller .p-virtualscroller-content', `background: ${variable('virtualscroller.content.background')}; color: ${variable('virtualscroller.content.color')};`),
        loadingCss('virtualscroller', '.p-virtualscroller .p-virtualscroller-loader.p-component-overlay', '.p-virtualscroller .p-virtualscroller-loading-icon')
    ].join('\n');
};
