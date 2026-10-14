// The legacy form DOM shares InputText internally, but each control exposes its
// own tokens so a component override does not change unrelated native inputs.
const fieldTokens = (overrides = {}) => ({
    background: '{formField.background}',
    borderColor: '{formField.borderColor}',
    borderRadius: '{formField.borderRadius}',
    color: '{formField.color}',
    paddingX: '{formField.paddingX}',
    paddingY: '{formField.paddingY}',
    hoverBorderColor: '{formField.hoverBorderColor}',
    focusBorderColor: '{formField.focusBorderColor}',
    placeholderColor: '{formField.placeholderColor}',
    filledBackground: '{formField.filledBackground}',
    invalidBorderColor: '{red.500}',
    disabledOpacity: '{disabledOpacity}',
    focusShadow: '0 0 0 {focusRing.width} {formField.focusBorderColor}',
    transitionDuration: '{formField.transitionDuration}',
    ...overrides
});

const panelTokens = (overrides = {}) => ({
    background: '{overlay.background}',
    borderColor: '{overlay.borderColor}',
    color: '{overlay.color}',
    borderRadius: '{formField.borderRadius}',
    shadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
    padding: '0.25rem',
    ...overrides
});

const optionTokens = () => ({
    background: 'transparent',
    color: '{overlay.color}',
    hoverBackground: 'color-mix(in srgb, {overlay.color}, transparent 94%)',
    focusBackground: 'color-mix(in srgb, {overlay.color}, transparent 94%)',
    selectedBackground: 'color-mix(in srgb, {primary.color}, transparent 84%)',
    selectedColor: '{overlay.color}',
    selectedFocusBackground: 'color-mix(in srgb, {primary.color}, transparent 76%)',
    borderRadius: '{borderRadius.sm}',
    paddingX: '{formField.paddingX}',
    paddingY: '{formField.paddingY}',
    disabledOpacity: '{disabledOpacity}'
});

const tokenTokens = () => ({
    background: 'color-mix(in srgb, {primary.color}, transparent 84%)',
    color: '{formField.color}',
    hoverBackground: 'color-mix(in srgb, {primary.color}, transparent 76%)',
    focusBackground: 'color-mix(in srgb, {primary.color}, transparent 76%)',
    borderRadius: '{formField.borderRadius}',
    paddingX: '0.5rem',
    paddingY: '0.25rem',
    gap: '0.5rem',
    focusShadow: '0 0 0 {focusRing.width} {focusRing.color}'
});

const buttonTokens = () => ({
    background: '{primary.color}',
    hoverBackground: '{primary.hoverColor}',
    activeBackground: '{primary.activeColor}',
    borderColor: '{primary.color}',
    hoverBorderColor: '{primary.hoverColor}',
    activeBorderColor: '{primary.activeColor}',
    color: '{primary.contrastColor}',
    borderRadius: '{formField.borderRadius}',
    width: '3rem',
    padding: '0.75rem',
    disabledOpacity: '1',
    focusShadow: '0 0 0 {focusRing.width} {focusRing.color}',
    transitionDuration: '{transitionDuration}'
});

export const auraFormComponents = {
    inputtext: {
        root: fieldTokens()
    },
    inputmask: {
        root: fieldTokens()
    },
    inputnumber: {
        root: {
            disabledOpacity: '{disabledOpacity}',
            invalidBorderColor: '{inputnumber.input.invalidBorderColor}'
        },
        input: fieldTokens({ disabledOpacity: '1' }),
        button: buttonTokens()
    },
    inputtextarea: {
        root: fieldTokens()
    },
    inputotp: {
        root: {
            gap: '0.5rem',
            disabledOpacity: '{disabledOpacity}'
        },
        input: fieldTokens({ disabledOpacity: '1', width: '2.5rem', paddingX: '0.5rem' })
    },
    password: {
        root: {
            disabledOpacity: '{disabledOpacity}'
        },
        input: fieldTokens({ disabledOpacity: '1', iconPadding: '2.5rem' }),
        icon: {
            color: '{text.mutedColor}',
            hoverColor: '{text.color}',
            focusShadow: '0 0 0 {focusRing.width} {focusRing.color}'
        },
        panel: panelTokens({ padding: '1rem' }),
        meter: {
            background: '{formField.filledBackground}',
            borderRadius: '{borderRadius.sm}',
            height: '10px',
            marginBottom: '0.5rem',
            transitionDuration: '1s',
            weakBackground: '{red.500}',
            mediumBackground: '{orange.500}',
            strongBackground: '{primary.color}'
        },
        info: {
            color: '{text.mutedColor}',
            weakColor: '{red.500}',
            mediumColor: '{orange.500}',
            strongColor: '{primary.color}'
        }
    },
    autocomplete: {
        root: {
            invalidBorderColor: '{red.500}',
            disabledOpacity: '{disabledOpacity}'
        },
        input: fieldTokens({ disabledOpacity: '1', invalidBorderColor: '{autocomplete.root.invalidBorderColor}' }),
        multipleContainer: fieldTokens({ disabledOpacity: '1', paddingY: '0.375rem', invalidBorderColor: '{autocomplete.root.invalidBorderColor}', gap: '0.25rem' }),
        multipleInput: {
            background: 'transparent',
            color: '{autocomplete.multipleContainer.color}',
            placeholderColor: '{autocomplete.multipleContainer.placeholderColor}'
        },
        dropdown: buttonTokens(),
        token: tokenTokens(),
        tokenIcon: {
            color: '{autocomplete.token.color}',
            hoverColor: '{primary.color}',
            focusShadow: '0 0 0 {focusRing.width} {focusRing.color}'
        },
        loader: {
            color: '{text.mutedColor}'
        },
        panel: panelTokens(),
        option: {
            ...optionTokens(),
            groupBackground: 'color-mix(in srgb, {overlay.color}, transparent 90%)',
            groupColor: '{overlay.color}'
        },
        footer: {
            borderColor: '{overlay.borderColor}',
            color: '{text.mutedColor}',
            padding: '0.75rem'
        }
    },
    chips: {
        root: {
            disabledOpacity: '{disabledOpacity}',
            invalidBorderColor: '{chips.multipleContainer.invalidBorderColor}'
        },
        multipleContainer: fieldTokens({ disabledOpacity: '1', paddingY: '0.375rem', gap: '0.25rem' }),
        input: {
            background: 'transparent',
            color: '{chips.multipleContainer.color}',
            placeholderColor: '{chips.multipleContainer.placeholderColor}'
        },
        token: tokenTokens(),
        tokenIcon: {
            color: '{chips.token.color}',
            hoverColor: '{primary.color}',
            focusShadow: '0 0 0 {focusRing.width} {focusRing.color}'
        }
    },
    mention: {
        root: {
            disabledOpacity: '{disabledOpacity}',
            invalidBorderColor: '{red.500}'
        },
        input: fieldTokens({ disabledOpacity: '1', invalidBorderColor: '{mention.root.invalidBorderColor}' }),
        panel: panelTokens(),
        option: optionTokens()
    }
};

// Invalid state overrides local primary focus tokens only on the affected field.
// Repeated state selectors outrank instance declarations without !important.
const fieldCss = ({ prefix, token, invalidToken = token, selector, hoverSelector, focusSelector, invalidSelector, disabledSelector, filledSelector, placeholderSelector }) => `
${selector} {
    background: var(--${prefix}-${token}-background);
    border: 1px solid var(--${prefix}-${token}-border-color);
    border-radius: var(--${prefix}-${token}-border-radius);
    color: var(--${prefix}-${token}-color);
    padding: var(--${prefix}-${token}-padding-y) var(--${prefix}-${token}-padding-x);
    transition: background var(--${prefix}-${token}-transition-duration), border-color var(--${prefix}-${token}-transition-duration), box-shadow var(--${prefix}-${token}-transition-duration);
}

${filledSelector} {
    background: var(--${prefix}-${token}-filled-background);
}

${hoverSelector} {
    border-color: var(--${prefix}-${token}-hover-border-color);
}

${focusSelector} {
    border-color: var(--${prefix}-${token}-focus-border-color);
    box-shadow: var(--${prefix}-${token}-focus-shadow);
    outline: 0;
}

${placeholderSelector} {
    color: var(--${prefix}-${token}-placeholder-color);
    opacity: 1;
}

${invalidSelector.replaceAll('.p-invalid', '.p-invalid.p-invalid.p-invalid').replaceAll('[aria-invalid="true"]', '[aria-invalid="true"][aria-invalid="true"][aria-invalid="true"]')} {
    border-color: var(--${prefix}-${invalidToken}-invalid-border-color);
    --${prefix}-${token}-focus-border-color: var(--${prefix}-${invalidToken}-invalid-border-color);
    --${prefix}-${token}-focus-shadow: 0 0 0 var(--${prefix}-focus-ring-width) var(--${prefix}-${invalidToken}-invalid-border-color);
}

${disabledSelector} {
    opacity: var(--${prefix}-${token}-disabled-opacity);
}
`;

const nativeFieldCss = ({ prefix, token, invalidToken, selector, root }) => {
    const wrapperFocus = root ? `,\n${root}:focus-within ${selector.split(' ').pop()}:enabled` : '';
    const wrapperInvalid = root ? `,\n${root}.p-invalid ${selector.split(' ').pop()},\n${root}.p-invalid ${selector.split(' ').pop()}:hover,\n${root}.p-invalid ${selector.split(' ').pop()}:focus` : '';

    return fieldCss({
        prefix,
        token,
        invalidToken,
        selector,
        hoverSelector: `${selector}:enabled:hover`,
        focusSelector: `${selector}:enabled:focus${wrapperFocus}`,
        invalidSelector: `${selector}.p-invalid,\n${selector}.p-invalid:hover,\n${selector}.p-invalid:focus,\n${selector}[aria-invalid="true"],\n${selector}[aria-invalid="true"]:hover,\n${selector}[aria-invalid="true"]:focus${wrapperInvalid}`,
        disabledSelector: `${selector}:disabled,\n${selector}.p-disabled`,
        filledSelector: `${selector}.p-variant-filled,\n.p-input-filled ${selector}`,
        placeholderSelector: `${selector}::placeholder`
    });
};

const panelCss = ({ prefix, component, selector }) => `
${selector} {
    background: var(--${prefix}-${component}-panel-background);
    border: 1px solid var(--${prefix}-${component}-panel-border-color);
    border-radius: var(--${prefix}-${component}-panel-border-radius);
    box-shadow: var(--${prefix}-${component}-panel-shadow);
    color: var(--${prefix}-${component}-panel-color);
    padding: var(--${prefix}-${component}-panel-padding);
}
`;

const buttonCss = ({ prefix, token, selector }) => `
${selector} {
    background: var(--${prefix}-${token}-background);
    border: 1px solid var(--${prefix}-${token}-border-color);
    border-radius: var(--${prefix}-${token}-border-radius);
    color: var(--${prefix}-${token}-color);
    padding: var(--${prefix}-${token}-padding);
    width: var(--${prefix}-${token}-width);
    transition: background var(--${prefix}-${token}-transition-duration), border-color var(--${prefix}-${token}-transition-duration), box-shadow var(--${prefix}-${token}-transition-duration);
}

${selector}:enabled:hover {
    background: var(--${prefix}-${token}-hover-background);
    border-color: var(--${prefix}-${token}-hover-border-color);
}

${selector}:enabled:active {
    background: var(--${prefix}-${token}-active-background);
    border-color: var(--${prefix}-${token}-active-border-color);
}

${selector}:enabled:focus-visible {
    box-shadow: var(--${prefix}-${token}-focus-shadow);
    outline: 0;
}

${selector}:disabled {
    opacity: var(--${prefix}-${token}-disabled-opacity);
}
`;

const optionCss = ({ prefix, component, selector, selectedSelector }) => `
${selector} {
    background: var(--${prefix}-${component}-option-background);
    border-radius: var(--${prefix}-${component}-option-border-radius);
    color: var(--${prefix}-${component}-option-color);
    padding: var(--${prefix}-${component}-option-padding-y) var(--${prefix}-${component}-option-padding-x);
}

${selector}:not(.p-disabled):not([data-p-disabled="true"]):hover {
    background: var(--${prefix}-${component}-option-hover-background);
}

${selector}:not(.p-disabled):not([data-p-disabled="true"]).p-focus,
${selector}:not(.p-disabled):not([data-p-disabled="true"]):focus-visible {
    background: var(--${prefix}-${component}-option-focus-background);
}

${selectedSelector} {
    background: var(--${prefix}-${component}-option-selected-background);
    color: var(--${prefix}-${component}-option-selected-color);
}

${selectedSelector
    .split(',')
    .flatMap((selected) => [`${selected.trim()}:not(.p-disabled):not([data-p-disabled="true"]):hover`, `${selected.trim()}:not(.p-disabled):not([data-p-disabled="true"]).p-focus`])
    .join(',\n')} {
    background: var(--${prefix}-${component}-option-selected-focus-background);
    color: var(--${prefix}-${component}-option-selected-color);
}

${selector}.p-disabled,
${selector}[data-p-disabled="true"] {
    opacity: var(--${prefix}-${component}-option-disabled-opacity);
}
`;

const tokenCss = ({ prefix, component, selector, enabledRoot }) => `
${selector} {
    background: var(--${prefix}-${component}-token-background);
    border-radius: var(--${prefix}-${component}-token-border-radius);
    color: var(--${prefix}-${component}-token-color);
    gap: var(--${prefix}-${component}-token-gap);
    padding: var(--${prefix}-${component}-token-padding-y) var(--${prefix}-${component}-token-padding-x);
}

${enabledRoot} .p-${component}-token:hover {
    background: var(--${prefix}-${component}-token-hover-background);
}

${enabledRoot} .p-${component}-token:focus-within,
${enabledRoot} .p-${component}-token.p-focus,
${enabledRoot} .p-${component}-token[data-p-focused="true"] {
    background: var(--${prefix}-${component}-token-focus-background);
    box-shadow: var(--${prefix}-${component}-token-focus-shadow);
}

${selector} .p-${component}-token-icon {
    color: var(--${prefix}-${component}-token-icon-color);
}

${enabledRoot} .p-${component}-token-icon:hover {
    color: var(--${prefix}-${component}-token-icon-hover-color);
}

${enabledRoot} .p-${component}-token-icon:focus-visible {
    box-shadow: var(--${prefix}-${component}-token-icon-focus-shadow);
    outline: 0;
}
`;

/** Flat component rules are scoped by Aura after this module is appended. */
export const auraFormCss = ({ prefix = 'mantle' } = {}) => {
    const nativeFields = [
        { token: 'inputtext-root', selector: '.p-inputtext' },
        { token: 'inputmask-root', selector: '.p-inputmask.p-inputtext' },
        { token: 'inputtextarea-root', selector: '.p-inputtextarea.p-inputtext' },
        { token: 'inputnumber-input', invalidToken: 'inputnumber-root', selector: '.p-inputnumber .p-inputnumber-input', root: '.p-inputnumber' },
        { token: 'inputotp-input', selector: '.p-inputotp .p-inputotp-input' },
        { token: 'password-input', selector: '.p-password .p-password-input', root: '.p-password' },
        { token: 'autocomplete-input', selector: '.p-autocomplete .p-autocomplete-input', root: '.p-autocomplete' },
        { token: 'mention-input', selector: '.p-mention .p-mention-input', root: '.p-mention' }
    ];
    const autocompleteContainer = '.p-autocomplete .p-autocomplete-multiple-container';
    const chipsContainer = '.p-chips .p-chips-multiple-container';
    const autocompleteOption = '.p-autocomplete-panel .p-autocomplete-items .p-autocomplete-item';
    const mentionOption = '.p-mention-panel .p-mention-items .p-mention-item';

    return `
${nativeFields.map((field) => nativeFieldCss({ prefix, ...field })).join('\n')}
${fieldCss({
    prefix,
    token: 'autocomplete-multiple-container',
    selector: autocompleteContainer,
    hoverSelector: `${autocompleteContainer}:not(.p-disabled):hover`,
    focusSelector: `${autocompleteContainer}:not(.p-disabled).p-focus,\n${autocompleteContainer}:not(.p-disabled)[data-p-focus="true"],\n${autocompleteContainer}:not(.p-disabled):focus-within`,
    invalidSelector: `.p-autocomplete.p-invalid .p-autocomplete-multiple-container,\n.p-autocomplete.p-invalid .p-autocomplete-multiple-container:hover,\n.p-autocomplete.p-invalid .p-autocomplete-multiple-container.p-focus,\n.p-autocomplete.p-invalid .p-autocomplete-multiple-container[data-p-focus="true"],\n.p-autocomplete.p-invalid .p-autocomplete-multiple-container:focus-within`,
    disabledSelector: `${autocompleteContainer}.p-disabled`,
    filledSelector: `${autocompleteContainer}.p-variant-filled,\n.p-input-filled ${autocompleteContainer}`,
    placeholderSelector: `${autocompleteContainer} .p-autocomplete-input-token input::placeholder`
})}
${fieldCss({
    prefix,
    token: 'chips-multiple-container',
    invalidToken: 'chips-root',
    selector: chipsContainer,
    hoverSelector: `.p-chips:not(.p-disabled) .p-chips-multiple-container:hover`,
    focusSelector: `.p-chips:not(.p-disabled).p-focus .p-chips-multiple-container,\n.p-chips:not(.p-disabled) .p-chips-multiple-container[data-p-focus="true"],\n.p-chips:not(.p-disabled) .p-chips-multiple-container:focus-within`,
    invalidSelector: `.p-chips.p-invalid .p-chips-multiple-container,\n.p-chips.p-invalid .p-chips-multiple-container:hover,\n.p-chips.p-invalid.p-focus .p-chips-multiple-container,\n.p-chips.p-invalid .p-chips-multiple-container[data-p-focus="true"],\n.p-chips.p-invalid .p-chips-multiple-container:focus-within`,
    disabledSelector: `.p-chips.p-disabled .p-chips-multiple-container`,
    filledSelector: `${chipsContainer}.p-variant-filled,\n.p-input-filled ${chipsContainer}`,
    placeholderSelector: `${chipsContainer} .p-chips-input-token input::placeholder`
})}

.p-inputnumber:has(.p-inputnumber-input:disabled) {
    opacity: var(--${prefix}-inputnumber-root-disabled-opacity);
}

.p-inputotp:has(.p-inputotp-input:disabled) {
    opacity: var(--${prefix}-inputotp-root-disabled-opacity);
}

.p-password:has(.p-password-input:disabled) {
    opacity: var(--${prefix}-password-root-disabled-opacity);
}

.p-autocomplete:has(> .p-autocomplete-input:disabled),
.p-autocomplete:has(> .p-autocomplete-multiple-container .p-autocomplete-input-token input:disabled) {
    opacity: var(--${prefix}-autocomplete-root-disabled-opacity);
}

.p-chips.p-disabled {
    opacity: var(--${prefix}-chips-root-disabled-opacity);
}

.p-mention:has(.p-mention-input:disabled) {
    opacity: var(--${prefix}-mention-root-disabled-opacity);
}

.p-inputnumber.p-invalid .p-inputnumber-input,
.p-inputnumber.p-invalid .p-inputnumber-input:hover,
.p-inputnumber.p-invalid .p-inputnumber-input:focus {
    border-color: var(--${prefix}-inputnumber-root-invalid-border-color);
}

.p-chips.p-invalid .p-chips-multiple-container,
.p-chips.p-invalid .p-chips-multiple-container:hover,
.p-chips.p-invalid.p-focus .p-chips-multiple-container,
.p-chips.p-invalid .p-chips-multiple-container[data-p-focus="true"],
.p-chips.p-invalid .p-chips-multiple-container:focus-within {
    border-color: var(--${prefix}-chips-root-invalid-border-color);
}

.p-mention.p-invalid .p-mention-input,
.p-mention.p-invalid .p-mention-input:hover,
.p-mention.p-invalid .p-mention-input:focus {
    border-color: var(--${prefix}-mention-root-invalid-border-color);
}

.p-inputotp {
    display: inline-flex;
    align-items: center;
    gap: var(--${prefix}-inputotp-root-gap);
}

.p-inputotp .p-inputotp-input {
    width: var(--${prefix}-inputotp-input-width);
    text-align: center;
}

.p-password .p-icon-field-right .p-password-input {
    padding-right: var(--${prefix}-password-input-icon-padding);
}

.p-password .p-icon-field-left .p-password-input {
    padding-left: var(--${prefix}-password-input-icon-padding);
}

.p-password .p-password-show-icon,
.p-password .p-password-hide-icon {
    color: var(--${prefix}-password-icon-color);
}

.p-password:not(:has(.p-password-input:disabled)) .p-password-show-icon:hover,
.p-password:not(:has(.p-password-input:disabled)) .p-password-hide-icon:hover {
    color: var(--${prefix}-password-icon-hover-color);
}

.p-password:not(:has(.p-password-input:disabled)) .p-password-show-icon:focus-visible,
.p-password:not(:has(.p-password-input:disabled)) .p-password-hide-icon:focus-visible {
    box-shadow: var(--${prefix}-password-icon-focus-shadow);
    outline: 0;
}

.p-autocomplete .p-autocomplete-multiple-container {
    gap: var(--${prefix}-autocomplete-multiple-container-gap);
}

.p-chips .p-chips-multiple-container {
    gap: var(--${prefix}-chips-multiple-container-gap);
}

.p-autocomplete .p-autocomplete-multiple-container .p-autocomplete-input-token input {
    background: var(--${prefix}-autocomplete-multiple-input-background);
    border: 0;
    border-radius: 0;
    box-shadow: none;
    color: var(--${prefix}-autocomplete-multiple-input-color);
    outline: 0;
    padding: 0;
    opacity: 1;
}

.p-autocomplete .p-autocomplete-multiple-container .p-autocomplete-input-token input::placeholder {
    color: var(--${prefix}-autocomplete-multiple-input-placeholder-color);
}

.p-chips .p-chips-multiple-container .p-chips-input-token input {
    background: var(--${prefix}-chips-input-background);
    border: 0;
    border-radius: 0;
    box-shadow: none;
    color: var(--${prefix}-chips-input-color);
    outline: 0;
    padding: 0;
    opacity: 1;
}

.p-chips .p-chips-multiple-container .p-chips-input-token input::placeholder {
    color: var(--${prefix}-chips-input-placeholder-color);
}

.p-autocomplete .p-autocomplete-loader {
    color: var(--${prefix}-autocomplete-loader-color);
}

${buttonCss({ prefix, token: 'inputnumber-button', selector: '.p-inputnumber .p-inputnumber-button.p-button.p-button.p-button' })}
${buttonCss({ prefix, token: 'autocomplete-dropdown', selector: '.p-autocomplete .p-autocomplete-dropdown.p-button.p-button.p-button' })}

/* Keep the corner and padding structure of joined legacy controls. */
.p-inputnumber.p-inputnumber-buttons-stacked .p-inputnumber-input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.p-inputnumber.p-inputnumber-buttons-stacked .p-inputnumber-button-up.p-button.p-button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    padding: 0;
}

.p-inputnumber.p-inputnumber-buttons-stacked .p-inputnumber-button-down.p-button.p-button {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 0;
    padding: 0;
}

.p-inputnumber.p-inputnumber-buttons-horizontal .p-inputnumber-input,
.p-inputnumber.p-inputnumber-buttons-vertical .p-inputnumber-input {
    border-radius: 0;
}

.p-inputnumber.p-inputnumber-buttons-horizontal .p-inputnumber-button-up.p-button.p-button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.p-inputnumber.p-inputnumber-buttons-horizontal .p-inputnumber-button-down.p-button.p-button {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.p-inputnumber.p-inputnumber-buttons-vertical .p-inputnumber-button-up.p-button.p-button {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    width: 100%;
}

.p-inputnumber.p-inputnumber-buttons-vertical .p-inputnumber-button-down.p-button.p-button {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    width: 100%;
}

.p-autocomplete.p-autocomplete-dd .p-autocomplete-input.p-inputtext,
.p-autocomplete.p-autocomplete-dd .p-autocomplete-multiple-container.p-inputtext {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.p-autocomplete.p-autocomplete-dd .p-autocomplete-dropdown.p-button.p-button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

/* The joined input and trigger have one field boundary and focus indicator. */
.p-autocomplete.p-autocomplete-dd {
    border: 1px solid var(--${prefix}-autocomplete-input-border-color);
    border-radius: var(--${prefix}-autocomplete-input-border-radius);
    transition: border-color var(--${prefix}-autocomplete-input-transition-duration), box-shadow var(--${prefix}-autocomplete-input-transition-duration);
}

.p-autocomplete.p-autocomplete-dd:not(:has(:disabled)):not(.p-invalid):hover {
    border-color: var(--${prefix}-autocomplete-input-hover-border-color);
}

.p-autocomplete.p-autocomplete-dd:not(:has(:disabled)):not(.p-invalid):focus-within {
    border-color: var(--${prefix}-autocomplete-input-focus-border-color);
    box-shadow: var(--${prefix}-autocomplete-input-focus-shadow);
}

.p-autocomplete.p-autocomplete-dd.p-autocomplete-multiple {
    border-radius: var(--${prefix}-autocomplete-multiple-container-border-radius);
    transition: border-color var(--${prefix}-autocomplete-multiple-container-transition-duration), box-shadow var(--${prefix}-autocomplete-multiple-container-transition-duration);
}

.p-autocomplete.p-autocomplete-dd.p-autocomplete-multiple:not(.p-invalid) {
    border-color: var(--${prefix}-autocomplete-multiple-container-border-color);
}

.p-autocomplete.p-autocomplete-dd.p-autocomplete-multiple:not(:has(:disabled)):not(.p-invalid):hover {
    border-color: var(--${prefix}-autocomplete-multiple-container-hover-border-color);
}

.p-autocomplete.p-autocomplete-dd.p-autocomplete-multiple:not(:has(:disabled)):not(.p-invalid):focus-within {
    border-color: var(--${prefix}-autocomplete-multiple-container-focus-border-color);
    box-shadow: var(--${prefix}-autocomplete-multiple-container-focus-shadow);
}

.p-autocomplete.p-autocomplete-dd.p-invalid {
    border-color: var(--${prefix}-autocomplete-root-invalid-border-color);
}

.p-autocomplete.p-autocomplete-dd.p-invalid:focus-within {
    box-shadow: 0 0 0 1px var(--${prefix}-autocomplete-root-invalid-border-color);
}

.p-autocomplete.p-autocomplete-dd > .p-autocomplete-input.p-inputtext,
.p-autocomplete.p-autocomplete-dd > .p-autocomplete-input.p-inputtext:enabled:focus,
.p-autocomplete.p-autocomplete-dd > .p-autocomplete-multiple-container.p-inputtext,
.p-autocomplete.p-autocomplete-dd > .p-autocomplete-multiple-container.p-inputtext:focus-within,
.p-autocomplete.p-autocomplete-dd > .p-autocomplete-multiple-container.p-inputtext.p-focus {
    border: 0;
    box-shadow: none;
}

.p-autocomplete.p-autocomplete-dd > .p-autocomplete-dropdown.p-button.p-button.p-button {
    border: 0;
    box-shadow: none;
}

.p-autocomplete.p-autocomplete-dd > .p-autocomplete-input.p-inputtext {
    border-top-left-radius: max(0px, calc(var(--${prefix}-autocomplete-input-border-radius) - 1px));
    border-bottom-left-radius: max(0px, calc(var(--${prefix}-autocomplete-input-border-radius) - 1px));
}

.p-autocomplete.p-autocomplete-dd > .p-autocomplete-multiple-container.p-inputtext {
    border-top-left-radius: max(0px, calc(var(--${prefix}-autocomplete-multiple-container-border-radius) - 1px));
    border-bottom-left-radius: max(0px, calc(var(--${prefix}-autocomplete-multiple-container-border-radius) - 1px));
}

.p-autocomplete.p-autocomplete-dd > .p-autocomplete-dropdown.p-button.p-button.p-button {
    border-top-right-radius: max(0px, calc(var(--${prefix}-autocomplete-input-border-radius) - 1px));
    border-bottom-right-radius: max(0px, calc(var(--${prefix}-autocomplete-input-border-radius) - 1px));
}

.p-autocomplete.p-autocomplete-dd.p-autocomplete-multiple > .p-autocomplete-dropdown.p-button.p-button.p-button {
    border-top-right-radius: max(0px, calc(var(--${prefix}-autocomplete-multiple-container-border-radius) - 1px));
    border-bottom-right-radius: max(0px, calc(var(--${prefix}-autocomplete-multiple-container-border-radius) - 1px));
}

.p-autocomplete.p-autocomplete-dd:has(:disabled) {
    opacity: var(--${prefix}-autocomplete-root-disabled-opacity);
}

.p-autocomplete.p-autocomplete-dd .p-autocomplete-input:disabled,
.p-autocomplete.p-autocomplete-dd .p-autocomplete-multiple-container.p-disabled {
    opacity: 1;
}

.p-inputgroup > .p-inputtext.p-inputtext,
.p-inputgroup > .p-inputwrapper > .p-inputtext.p-inputtext,
.p-inputgroup > .p-float-label > .p-inputtext.p-inputtext {
    border-radius: 0;
}

.p-inputgroup > .p-inputtext.p-inputtext:first-child,
.p-inputgroup > .p-inputwrapper:first-child > .p-inputtext.p-inputtext,
.p-inputgroup > .p-float-label:first-child > .p-inputtext.p-inputtext {
    border-top-left-radius: var(--${prefix}-form-field-border-radius);
    border-bottom-left-radius: var(--${prefix}-form-field-border-radius);
}

.p-inputgroup > .p-inputtext.p-inputtext:last-child,
.p-inputgroup > .p-inputwrapper:last-child > .p-inputtext.p-inputtext,
.p-inputgroup > .p-float-label:last-child > .p-inputtext.p-inputtext {
    border-top-right-radius: var(--${prefix}-form-field-border-radius);
    border-bottom-right-radius: var(--${prefix}-form-field-border-radius);
}

${tokenCss({ prefix, component: 'autocomplete', selector: '.p-autocomplete .p-autocomplete-multiple-container .p-autocomplete-token', enabledRoot: '.p-autocomplete .p-autocomplete-multiple-container:not(.p-disabled)' })}
${tokenCss({ prefix, component: 'chips', selector: '.p-chips .p-chips-multiple-container .p-chips-token', enabledRoot: '.p-chips:not(.p-disabled)' })}
${panelCss({ prefix, component: 'password', selector: '.p-password-panel' })}
${panelCss({ prefix, component: 'autocomplete', selector: '.p-autocomplete-panel' })}
${panelCss({ prefix, component: 'mention', selector: '.p-mention-panel' })}
${optionCss({ prefix, component: 'autocomplete', selector: autocompleteOption, selectedSelector: `${autocompleteOption}.p-highlight,\n${autocompleteOption}.selected,\n${autocompleteOption}[aria-selected="true"]` })}
${optionCss({ prefix, component: 'mention', selector: mentionOption, selectedSelector: `${mentionOption}.p-highlight,\n${mentionOption}[aria-selected="true"]` })}

.p-autocomplete-panel .p-autocomplete-items .p-autocomplete-item-group {
    background: var(--${prefix}-autocomplete-option-group-background);
    border-radius: var(--${prefix}-autocomplete-option-border-radius);
    color: var(--${prefix}-autocomplete-option-group-color);
    padding: var(--${prefix}-autocomplete-option-padding-y) var(--${prefix}-autocomplete-option-padding-x);
}

.p-autocomplete-panel .p-autocomplete-footer {
    border-top: 1px solid var(--${prefix}-autocomplete-footer-border-color);
    color: var(--${prefix}-autocomplete-footer-color);
    padding: var(--${prefix}-autocomplete-footer-padding);
}

.p-password-panel .p-password-meter {
    background: var(--${prefix}-password-meter-background);
    border-radius: var(--${prefix}-password-meter-border-radius);
    height: var(--${prefix}-password-meter-height);
    margin-bottom: var(--${prefix}-password-meter-margin-bottom);
}

.p-password-panel .p-password-strength {
    border-radius: var(--${prefix}-password-meter-border-radius);
    transition: width var(--${prefix}-password-meter-transition-duration) ease-in-out, background var(--${prefix}-password-meter-transition-duration);
}

.p-password-panel .p-password-strength.weak {
    background: var(--${prefix}-password-meter-weak-background);
}

.p-password-panel .p-password-strength.medium {
    background: var(--${prefix}-password-meter-medium-background);
}

.p-password-panel .p-password-strength.strong {
    background: var(--${prefix}-password-meter-strong-background);
}

.p-password-panel .p-password-info {
    color: var(--${prefix}-password-info-color);
}

.p-password-panel .p-password-info.weak {
    color: var(--${prefix}-password-info-weak-color);
}

.p-password-panel .p-password-info.medium {
    color: var(--${prefix}-password-info-medium-color);
}

.p-password-panel .p-password-info.strong {
    color: var(--${prefix}-password-info-strong-color);
}
`;
};
