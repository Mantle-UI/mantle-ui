const field = () => ({
    background: '{formField.background}',
    filledBackground: '{formField.filledBackground}',
    color: '{formField.color}',
    placeholderColor: '{formField.placeholderColor}',
    borderColor: '{formField.borderColor}',
    hoverBorderColor: '{formField.hoverBorderColor}',
    focusBorderColor: '{formField.focusBorderColor}',
    invalidBorderColor: '{red.500}',
    borderRadius: '{formField.borderRadius}',
    paddingX: '{formField.paddingX}',
    paddingY: '{formField.paddingY}',
    disabledOpacity: '{disabledOpacity}'
});

const panel = () => ({ background: '{overlay.background}', color: '{overlay.color}', borderColor: '{overlay.borderColor}', borderRadius: '{borderRadius.md}', padding: '0.75rem', shadow: '{overlay.root.shadow}' });
const action = () => ({
    color: '{text.mutedColor}',
    hoverColor: '{text.color}',
    hoverBackground: '{surface.100}',
    activeColor: '{text.color}',
    activeBackground: '{surface.200}',
    size: '2rem',
    borderRadius: '{borderRadius.md}',
    focusColor: '{focusRing.color}',
    disabledOpacity: '{disabledOpacity}'
});

export const auraSpecialFormComponents = {
    button: {
        root: { fontSize: '1rem', fontWeight: '600', gap: '0.5rem', disabledOpacity: '{disabledOpacity}', focusColor: '{focusRing.color}', focusWidth: '{focusRing.width}', focusStyle: '{focusRing.style}', focusOffset: '{focusRing.offset}' },
        icon: { size: '1rem' },
        small: { fontSize: '0.875rem', paddingX: '1rem', paddingY: '0.625rem' },
        large: { fontSize: '1.25rem', paddingX: '1.5rem', paddingY: '0.875rem' }
    },
    splitbutton: {
        root: { borderRadius: '{button.root.borderRadius}', disabledOpacity: '{disabledOpacity}' },
        button: { background: '{button.root.background}', color: '{button.root.color}', hoverBackground: '{button.root.hoverBackground}', activeBackground: '{button.root.activeBackground}' },
        menuButton: { width: '3rem' },
        panel: panel()
    },
    floatlabel: { label: { color: '{text.mutedColor}', activeColor: '{primary.color}', invalidColor: '{red.500}', offsetX: '{formField.paddingX}', activeTop: '-0.75rem', activeFontSize: '0.75rem', transitionDuration: '{transitionDuration}' } },
    iconfield: { root: { iconOffset: '{formField.paddingX}', inputPadding: '2.75rem' } },
    inputicon: { root: { color: '{text.mutedColor}', size: '1rem' } },
    calendar: {
        input: { ...field(), focusShadow: '0 0 0 {focusRing.width} {formField.focusBorderColor}', transitionDuration: '{formField.transitionDuration}' },
        panel: panel(),
        header: { background: '{overlay.background}', color: '{text.color}', borderColor: '{surface.border}', padding: '0.5rem', fontWeight: '600' },
        navigationButton: action(),
        dropdown: { background: '{primary.color}', color: '{primary.contrastColor}', hoverBackground: '{primary.hoverColor}', width: '3rem' },
        day: {
            color: '{text.color}',
            hoverBackground: '{surface.100}',
            hoverColor: '{text.color}',
            selectedBackground: '{primary.color}',
            selectedColor: '{primary.950}',
            todayBackground: '{surface.200}',
            todayColor: '{text.color}',
            otherMonthColor: '{text.mutedColor}',
            size: '2.5rem',
            borderRadius: '50%',
            focusColor: '{focusRing.color}',
            disabledOpacity: '{disabledOpacity}'
        },
        month: { color: '{text.color}', hoverBackground: '{surface.100}', selectedBackground: '{primary.color}', selectedColor: '{primary.950}', padding: '0.5rem', borderRadius: '{borderRadius.md}' },
        year: { color: '{text.color}', hoverBackground: '{surface.100}', selectedBackground: '{primary.color}', selectedColor: '{primary.950}', padding: '0.5rem', borderRadius: '{borderRadius.md}' },
        timePicker: { color: '{text.color}', borderColor: '{surface.border}', padding: '0.5rem', gap: '0.5rem', fontSize: '1.125rem' },
        buttonbar: {
            borderColor: '{surface.border}',
            padding: '0.75rem 0 0',
            gap: '0.5rem',
            button: { background: 'transparent', color: '{text.color}', hoverBackground: '{surface.100}', hoverColor: '{text.color}', activeBackground: '{surface.200}', activeColor: '{text.color}', disabledOpacity: '{disabledOpacity}' }
        },
        mask: { background: 'rgba(0, 0, 0, 0.4)' },
        colorScheme: {
            dark: {
                navigationButton: { hoverBackground: '{surface.800}', activeBackground: '{surface.700}' },
                day: { hoverBackground: '{surface.800}', todayBackground: '{surface.700}' },
                month: { hoverBackground: '{surface.800}' },
                year: { hoverBackground: '{surface.800}' },
                buttonbar: { button: { hoverBackground: '{surface.800}', activeBackground: '{surface.700}' } }
            }
        }
    },
    colorpicker: {
        root: { disabledOpacity: '{disabledOpacity}' },
        preview: { width: '2rem', height: '2rem', borderColor: '{formField.borderColor}', hoverBorderColor: '{formField.hoverBorderColor}', focusBorderColor: '{formField.focusBorderColor}', borderRadius: '{formField.borderRadius}' },
        panel: panel(),
        selector: { width: '150px', height: '150px' },
        hue: { width: '17px', height: '150px' },
        handle: { borderColor: '#ffffff', shadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }
    },
    fileupload: {
        root: { borderRadius: '{borderRadius.md}', disabledOpacity: '{disabledOpacity}' },
        buttonbar: { background: '{surface.50}', color: '{text.color}', borderColor: '{surface.border}', padding: '1rem', gap: '0.5rem' },
        content: { background: '{surface.card}', color: '{text.color}', borderColor: '{surface.border}', padding: '1rem', highlightBackground: '{surface.100}', highlightBorderColor: '{primary.color}' },
        file: { color: '{text.color}', borderColor: '{surface.border}', padding: '0.75rem', gap: '1rem' },
        button: { background: '{button.root.background}', color: '{button.root.color}', hoverBackground: '{button.root.hoverBackground}', borderRadius: '{button.root.borderRadius}', focusColor: '{focusRing.color}', padding: '0.75rem 1rem' }
    },
    editor: {
        root: { borderColor: '{formField.borderColor}', borderRadius: '{formField.borderRadius}', focusBorderColor: '{formField.focusBorderColor}', invalidBorderColor: '{red.500}', disabledOpacity: '{disabledOpacity}' },
        toolbar: { background: '{surface.50}', borderColor: '{surface.border}', padding: '0.5rem' },
        content: { background: '{formField.background}', color: '{formField.color}', padding: '0.75rem', placeholderColor: '{formField.placeholderColor}', fontFamily: 'inherit', fontSize: '1rem' },
        tool: { color: '{text.mutedColor}', hoverColor: '{primary.color}', activeColor: '{primary.color}', hoverBackground: '{surface.100}' },
        tooltip: { background: '{overlay.background}', color: '{overlay.color}', borderColor: '{overlay.borderColor}', borderRadius: '{borderRadius.md}' }
    }
};

export const auraSpecialFormCss = ({ prefix = 'mantle' } = {}) => {
    const variable = (path) => `var(--${prefix}-${path})`;
    const buttons = `.p-button { font-size: ${variable('button-root-font-size')}; font-weight: ${variable('button-root-font-weight')}; gap: ${variable('button-root-gap')}; }
    .p-button:disabled, .p-button.p-disabled { opacity: ${variable('button-root-disabled-opacity')}; }
    .p-button:focus-visible, .p-button.p-focus { outline: ${variable('button-root-focus-width')} ${variable('button-root-focus-style')} ${variable('button-root-focus-color')}; outline-offset: ${variable('button-root-focus-offset')}; }
    .p-button .p-button-icon { width: ${variable('button-icon-size')}; height: ${variable('button-icon-size')}; font-size: ${variable('button-icon-size')}; }
    .p-button.p-button-sm { font-size: ${variable('button-small-font-size')}; padding: ${variable('button-small-padding-y')} ${variable('button-small-padding-x')}; }
    .p-button.p-button-lg { font-size: ${variable('button-large-font-size')}; padding: ${variable('button-large-padding-y')} ${variable('button-large-padding-x')}; }
    .p-splitbutton.p-disabled { opacity: ${variable('splitbutton-root-disabled-opacity')}; }
    .p-splitbutton.p-disabled > .p-button { opacity: 1; }
    .p-splitbutton > .p-button.p-button:first-child { border-radius: ${variable('splitbutton-root-border-radius')} 0 0 ${variable('splitbutton-root-border-radius')}; }
    .p-splitbutton > .p-button.p-button:last-child { border-radius: 0 ${variable('splitbutton-root-border-radius')} ${variable('splitbutton-root-border-radius')} 0; }
    .p-splitbutton .p-splitbutton-menubutton { width: ${variable('splitbutton-menu-button-width')}; }
    .p-splitbutton-menu.p-tieredmenu { background: ${variable('splitbutton-panel-background')}; color: ${variable('splitbutton-panel-color')}; border-color: ${variable('splitbutton-panel-border-color')}; border-radius: ${variable('splitbutton-panel-border-radius')}; padding: ${variable('splitbutton-panel-padding')}; box-shadow: ${variable('splitbutton-panel-shadow')}; }`;
    const split = '.p-splitbutton:not(.p-button-secondary):not(.p-button-success):not(.p-button-info):not(.p-button-warning):not(.p-button-danger):not(.p-button-help):not(.p-button-text):not(.p-button-outlined) > .p-button';
    const splitButtons = `${split} { background: ${variable('splitbutton-button-background')}; color: ${variable('splitbutton-button-color')}; border-color: ${variable('splitbutton-button-background')}; }
    ${split}:not(:disabled):hover { background: ${variable('splitbutton-button-hover-background')}; border-color: ${variable('splitbutton-button-hover-background')}; }
    ${split}:not(:disabled):active { background: ${variable('splitbutton-button-active-background')}; border-color: ${variable('splitbutton-button-active-background')}; }`;
    const utilities = `.p-float-label > label { color: ${variable('floatlabel-label-color')}; left: ${variable('floatlabel-label-offset-x')}; transition-duration: ${variable('floatlabel-label-transition-duration')}; }
    .p-float-label:focus-within > label, .p-float-label:has(.p-inputwrapper-focus) > label { color: ${variable('floatlabel-label-active-color')}; }
    .p-float-label:has(.p-filled) > label, .p-float-label:focus-within > label, .p-float-label:has(.p-inputwrapper-filled) > label { top: ${variable('floatlabel-label-active-top')}; font-size: ${variable('floatlabel-label-active-font-size')}; }
    .p-float-label:has(.p-invalid) > label { color: ${variable('floatlabel-label-invalid-color')}; }
    .p-icon-field { position: relative; }
    .p-icon-field > .p-input-icon { position: absolute; top: 50%; margin-top: calc(${variable('inputicon-root-size')} / -2); }
    .p-icon-field-left > .p-input-icon { left: ${variable('iconfield-root-icon-offset')}; }
    .p-icon-field-right > .p-input-icon { right: ${variable('iconfield-root-icon-offset')}; }
    .p-icon-field-left > .p-inputtext { padding-left: ${variable('iconfield-root-input-padding')}; }
    .p-icon-field-right > .p-inputtext { padding-right: ${variable('iconfield-root-input-padding')}; }
    .p-input-icon { color: ${variable('inputicon-root-color')}; width: ${variable('inputicon-root-size')}; height: ${variable('inputicon-root-size')}; font-size: ${variable('inputicon-root-size')}; }`;
    const fields = `.p-calendar > .p-inputtext {
        background: ${variable('calendar-input-background')}; color: ${variable('calendar-input-color')};
        border: 1px solid ${variable('calendar-input-border-color')}; border-radius: ${variable('calendar-input-border-radius')};
        padding: ${variable('calendar-input-padding-y')} ${variable('calendar-input-padding-x')};
    }
    .p-calendar > .p-inputtext::placeholder { color: ${variable('calendar-input-placeholder-color')}; }
    .p-calendar:not(.p-calendar-disabled) > .p-inputtext:hover { border-color: ${variable('calendar-input-hover-border-color')}; }
    .p-calendar > .p-inputtext:focus { border-color: ${variable('calendar-input-focus-border-color')}; }
    .p-calendar.p-invalid.p-invalid > .p-inputtext { border-color: ${variable('calendar-input-invalid-border-color')}; }
    .p-calendar.p-invalid.p-invalid:not(.p-calendar-w-btn).p-focus > .p-inputtext,
    .p-calendar.p-invalid.p-invalid:not(.p-calendar-w-btn) > .p-inputtext:focus { box-shadow: 0 0 0 var(--${prefix}-focus-ring-width) ${variable('calendar-input-invalid-border-color')}; outline-color: ${variable('calendar-input-invalid-border-color')}; }
    .p-calendar > .p-inputtext.p-variant-filled { background: ${variable('calendar-input-filled-background')}; }
    .p-calendar.p-calendar-disabled { opacity: ${variable('calendar-input-disabled-opacity')}; }
    .p-calendar.p-calendar-disabled > .p-inputtext, .p-calendar.p-calendar-disabled > .p-button { opacity: 1; }
    .p-calendar .p-datepicker-trigger { background: ${variable('calendar-dropdown-background')}; border-color: ${variable('calendar-dropdown-background')}; color: ${variable('calendar-dropdown-color')}; width: ${variable('calendar-dropdown-width')}; }
    .p-calendar .p-datepicker-trigger:not(:disabled):hover { background: ${variable('calendar-dropdown-hover-background')}; border-color: ${variable('calendar-dropdown-hover-background')}; }
    .p-calendar.p-calendar-w-btn { border: 1px solid ${variable('calendar-input-border-color')}; border-radius: ${variable('calendar-input-border-radius')}; transition: border-color ${variable('calendar-input-transition-duration')}, box-shadow ${variable('calendar-input-transition-duration')}; }
    .p-calendar.p-calendar-w-btn:not(.p-calendar-disabled):not(.p-invalid):hover { border-color: ${variable('calendar-input-hover-border-color')}; }
    .p-calendar.p-calendar-w-btn:not(.p-calendar-disabled):not(.p-invalid):is(:focus-within, .p-focus) { border-color: ${variable('calendar-input-focus-border-color')}; box-shadow: ${variable('calendar-input-focus-shadow')}; }
    .p-calendar.p-calendar-w-btn.p-invalid { border-color: ${variable('calendar-input-invalid-border-color')}; }
    .p-calendar.p-calendar-w-btn.p-invalid:is(:focus-within, .p-focus) { box-shadow: 0 0 0 var(--${prefix}-focus-ring-width) ${variable('calendar-input-invalid-border-color')}; }
    .p-calendar.p-calendar-w-btn > .p-inputtext, .p-calendar.p-calendar-w-btn > .p-inputtext:enabled:focus { border: 0; box-shadow: none; border-radius: max(0px, calc(${variable('calendar-input-border-radius')} - 1px)); }
    .p-calendar.p-calendar-w-btn > .p-datepicker-trigger.p-button, .p-calendar.p-calendar-w-btn > .p-datepicker-trigger.p-button:focus-visible { border: 0; box-shadow: none; outline: 0; border-radius: max(0px, calc(${variable('calendar-input-border-radius')} - 1px)); }
    .p-calendar.p-calendar-w-btn-right > .p-inputtext { border-top-right-radius: 0; border-bottom-right-radius: 0; }
    .p-calendar.p-calendar-w-btn-right > .p-datepicker-trigger.p-button { border-top-left-radius: 0; border-bottom-left-radius: 0; }
    .p-calendar.p-calendar-w-btn-left > .p-inputtext { border-top-left-radius: 0; border-bottom-left-radius: 0; }
    .p-calendar.p-calendar-w-btn-left > .p-datepicker-trigger.p-button { border-top-right-radius: 0; border-bottom-right-radius: 0; }
    .p-datepicker { background: ${variable('calendar-panel-background')}; color: ${variable('calendar-panel-color')}; border: 1px solid ${variable('calendar-panel-border-color')}; border-radius: ${variable('calendar-panel-border-radius')}; padding: ${variable('calendar-panel-padding')}; box-shadow: ${variable('calendar-panel-shadow')}; }
    .p-datepicker .p-datepicker-header { background: ${variable('calendar-header-background')}; color: ${variable('calendar-header-color')}; border-bottom: 1px solid ${variable('calendar-header-border-color')}; padding: ${variable('calendar-header-padding')}; font-weight: ${variable('calendar-header-font-weight')}; }
    .p-datepicker .p-datepicker-title > button { color: ${variable('calendar-header-color')}; font-weight: ${variable('calendar-header-font-weight')}; }
    .p-datepicker .p-datepicker-prev, .p-datepicker .p-datepicker-next, .p-datepicker .p-timepicker button { color: ${variable('calendar-navigation-button-color')}; background: transparent; border: 0; width: ${variable('calendar-navigation-button-size')}; height: ${variable('calendar-navigation-button-size')}; border-radius: ${variable('calendar-navigation-button-border-radius')}; }
    .p-datepicker .p-datepicker-prev:not(:disabled):hover, .p-datepicker .p-datepicker-next:not(:disabled):hover, .p-datepicker .p-timepicker button:not(:disabled):hover { color: ${variable('calendar-navigation-button-hover-color')}; background: ${variable('calendar-navigation-button-hover-background')}; }
    .p-datepicker .p-datepicker-prev:not(:disabled):active, .p-datepicker .p-datepicker-next:not(:disabled):active, .p-datepicker .p-timepicker button:not(:disabled):active { color: ${variable('calendar-navigation-button-active-color')}; background: ${variable('calendar-navigation-button-active-background')}; }
    .p-datepicker .p-datepicker-prev:disabled, .p-datepicker .p-datepicker-next:disabled, .p-datepicker .p-timepicker button:disabled { opacity: ${variable('calendar-navigation-button-disabled-opacity')}; }
    .p-datepicker button:focus-visible { outline: 1px solid ${variable('calendar-navigation-button-focus-color')}; outline-offset: 2px; }
    .p-datepicker table td > span { color: ${variable('calendar-day-color')}; width: ${variable('calendar-day-size')}; height: ${variable('calendar-day-size')}; border-radius: ${variable('calendar-day-border-radius')}; }
    .p-datepicker table td > span:not(.p-disabled):not(.p-highlight):hover { background: ${variable('calendar-day-hover-background')}; color: ${variable('calendar-day-hover-color')}; }
    .p-datepicker table td.p-datepicker-today > span:not(.p-highlight) { background: ${variable('calendar-day-today-background')}; color: ${variable('calendar-day-today-color')}; }
    .p-datepicker table td.p-datepicker-other-month > span { color: ${variable('calendar-day-other-month-color')}; }
    .p-datepicker table td > span.p-highlight { background: ${variable('calendar-day-selected-background')}; color: ${variable('calendar-day-selected-color')}; }
    .p-datepicker table td > span.p-disabled { opacity: ${variable('calendar-day-disabled-opacity')}; }
    .p-datepicker table td > span:focus-visible { outline: 1px solid ${variable('calendar-day-focus-color')}; outline-offset: 2px; }
    .p-datepicker .p-timepicker { color: ${variable('calendar-time-picker-color')}; padding: ${variable('calendar-time-picker-padding')}; gap: ${variable('calendar-time-picker-gap')}; border-top: 1px solid ${variable('calendar-time-picker-border-color')}; font-size: ${variable('calendar-time-picker-font-size')}; }
    .p-datepicker .p-datepicker-buttonbar { border-top: 1px solid ${variable('calendar-buttonbar-border-color')}; padding: ${variable('calendar-buttonbar-padding')}; gap: ${variable('calendar-buttonbar-gap')}; }
    .p-datepicker .p-datepicker-buttonbar > .p-button.p-button.p-button.p-button-text { background: ${variable('calendar-buttonbar-button-background')}; color: ${variable('calendar-buttonbar-button-color')}; border-color: transparent; opacity: 1; }
    .p-datepicker .p-datepicker-buttonbar > .p-button.p-button.p-button.p-button-text:not(:disabled):not(.p-disabled):hover { background: ${variable('calendar-buttonbar-button-hover-background')}; color: ${variable('calendar-buttonbar-button-hover-color')}; }
    .p-datepicker .p-datepicker-buttonbar > .p-button.p-button.p-button.p-button-text:not(:disabled):not(.p-disabled):active { background: ${variable('calendar-buttonbar-button-active-background')}; color: ${variable('calendar-buttonbar-button-active-color')}; }
    .p-datepicker .p-datepicker-buttonbar > .p-button.p-button.p-button.p-button-text:disabled, .p-datepicker .p-datepicker-buttonbar > .p-button.p-button.p-button.p-button-text.p-disabled { opacity: ${variable('calendar-buttonbar-button-disabled-opacity')}; }
    .p-datepicker-mask { background: ${variable('calendar-mask-background')}; }`;
    const periods = ['month', 'year']
        .map((period) => {
            const selector = `.p-datepicker .p-${period}picker-${period}`;

            return `${selector} { color: ${variable(`calendar-${period}-color`)}; padding: ${variable(`calendar-${period}-padding`)}; border-radius: ${variable(`calendar-${period}-border-radius`)}; }
        ${selector}:not(.p-disabled):not(.p-highlight):hover { background: ${variable(`calendar-${period}-hover-background`)}; }
        ${selector}.p-highlight { background: ${variable(`calendar-${period}-selected-background`)}; color: ${variable(`calendar-${period}-selected-color`)}; }
        ${selector}.p-disabled { opacity: ${variable('calendar-day-disabled-opacity')}; }
        ${selector}:focus-visible { outline: 1px solid ${variable('calendar-day-focus-color')}; outline-offset: 2px; }`;
        })
        .join('\n');
    const picker = `.p-colorpicker:has(.p-colorpicker-preview:disabled), .p-colorpicker-panel.p-disabled { opacity: ${variable('colorpicker-root-disabled-opacity')}; }
    .p-colorpicker .p-colorpicker-preview { width: ${variable('colorpicker-preview-width')}; height: ${variable('colorpicker-preview-height')}; padding: 0; border: 1px solid ${variable('colorpicker-preview-border-color')}; border-radius: ${variable('colorpicker-preview-border-radius')}; }
    .p-colorpicker .p-colorpicker-preview:not(:disabled):hover { border-color: ${variable('colorpicker-preview-hover-border-color')}; }
    .p-colorpicker .p-colorpicker-preview:focus { border-color: ${variable('colorpicker-preview-focus-border-color')}; outline: 1px solid ${variable('colorpicker-preview-focus-border-color')}; }
    .p-colorpicker-panel { background: ${variable('colorpicker-panel-background')}; color: ${variable('colorpicker-panel-color')}; border: 1px solid ${variable('colorpicker-panel-border-color')}; border-radius: ${variable('colorpicker-panel-border-radius')}; padding: ${variable('colorpicker-panel-padding')}; box-shadow: ${variable('colorpicker-panel-shadow')}; width: auto; height: auto; }
    .p-colorpicker-panel .p-colorpicker-color-selector { width: ${variable('colorpicker-selector-width')}; height: ${variable('colorpicker-selector-height')}; }
    .p-colorpicker-panel .p-colorpicker-hue { width: ${variable('colorpicker-hue-width')}; height: ${variable('colorpicker-hue-height')}; }
    .p-colorpicker-panel .p-colorpicker-color-handle, .p-colorpicker-panel .p-colorpicker-hue-handle { border-color: ${variable('colorpicker-handle-border-color')}; box-shadow: ${variable('colorpicker-handle-shadow')}; }`;
    const upload = `.p-fileupload { border-radius: ${variable('fileupload-root-border-radius')}; }
    .p-fileupload:has(input[type="file"]:disabled) { opacity: ${variable('fileupload-root-disabled-opacity')}; }
    .p-fileupload .p-fileupload-buttonbar { background: ${variable('fileupload-buttonbar-background')}; color: ${variable('fileupload-buttonbar-color')}; border: 1px solid ${variable('fileupload-buttonbar-border-color')}; padding: ${variable('fileupload-buttonbar-padding')}; gap: ${variable('fileupload-buttonbar-gap')}; border-radius: ${variable('fileupload-root-border-radius')} ${variable('fileupload-root-border-radius')} 0 0; }
    .p-fileupload .p-fileupload-content { background: ${variable('fileupload-content-background')}; color: ${variable('fileupload-content-color')}; border: 1px solid ${variable('fileupload-content-border-color')}; padding: ${variable('fileupload-content-padding')}; border-radius: 0 0 ${variable('fileupload-root-border-radius')} ${variable('fileupload-root-border-radius')}; }
    .p-fileupload .p-fileupload-content.p-fileupload-highlight { background: ${variable('fileupload-content-highlight-background')}; border-color: ${variable('fileupload-content-highlight-border-color')}; }
    .p-fileupload .p-fileupload-row { color: ${variable('fileupload-file-color')}; border-bottom: 1px solid ${variable('fileupload-file-border-color')}; padding: ${variable('fileupload-file-padding')}; gap: ${variable('fileupload-file-gap')}; }
    .p-fileupload .p-button { background: ${variable('fileupload-button-background')}; color: ${variable('fileupload-button-color')}; border-color: ${variable('fileupload-button-background')}; border-radius: ${variable('fileupload-button-border-radius')}; padding: ${variable('fileupload-button-padding')}; }
    .p-fileupload .p-button:not(:disabled):not(.p-disabled):hover { background: ${variable('fileupload-button-hover-background')}; border-color: ${variable('fileupload-button-hover-background')}; }
    .p-fileupload .p-button:focus-visible, .p-fileupload .p-button.p-focus { outline: 1px solid ${variable('fileupload-button-focus-color')}; outline-offset: 2px; }`;
    const editor = `[data-pc-name="editor"] { border: 1px solid ${variable('editor-root-border-color')}; border-radius: ${variable('editor-root-border-radius')}; overflow: hidden; }
    [data-pc-name="editor"]:focus-within { border-color: ${variable('editor-root-focus-border-color')}; }
    [data-pc-name="editor"].p-invalid.p-invalid { border-color: ${variable('editor-root-invalid-border-color')}; }
    [data-pc-name="editor"].p-invalid:focus-within { outline: var(--${prefix}-focus-ring-width) solid ${variable('editor-root-invalid-border-color')}; outline-offset: var(--${prefix}-focus-ring-offset); }
    [data-pc-name="editor"]:has(.ql-disabled) { opacity: ${variable('editor-root-disabled-opacity')}; }
    [data-pc-name="editor"] .ql-toolbar { background: ${variable('editor-toolbar-background')}; border: 0; border-bottom: 1px solid ${variable('editor-toolbar-border-color')}; padding: ${variable('editor-toolbar-padding')}; }
    [data-pc-name="editor"] .ql-container { background: ${variable('editor-content-background')}; color: ${variable('editor-content-color')}; border: 0; font-family: ${variable('editor-content-font-family')}; font-size: ${variable('editor-content-font-size')}; }
    [data-pc-name="editor"] .ql-editor { padding: ${variable('editor-content-padding')}; }
    [data-pc-name="editor"] .ql-editor.ql-blank::before { color: ${variable('editor-content-placeholder-color')}; }
    [data-pc-name="editor"] .ql-toolbar button, [data-pc-name="editor"] .ql-picker { color: ${variable('editor-tool-color')}; }
    [data-pc-name="editor"] .ql-toolbar .ql-stroke { stroke: ${variable('editor-tool-color')}; }
    [data-pc-name="editor"] .ql-toolbar .ql-fill { fill: ${variable('editor-tool-color')}; }
    [data-pc-name="editor"] .ql-toolbar button:hover { color: ${variable('editor-tool-hover-color')}; background: ${variable('editor-tool-hover-background')}; }
    [data-pc-name="editor"] .ql-toolbar button:hover .ql-stroke { stroke: ${variable('editor-tool-hover-color')}; }
    [data-pc-name="editor"] .ql-toolbar button:hover .ql-fill { fill: ${variable('editor-tool-hover-color')}; }
    [data-pc-name="editor"] .ql-toolbar button.ql-active, [data-pc-name="editor"] .ql-picker-label.ql-active { color: ${variable('editor-tool-active-color')}; }
    [data-pc-name="editor"] .ql-toolbar button.ql-active .ql-stroke { stroke: ${variable('editor-tool-active-color')}; }
    [data-pc-name="editor"] .ql-toolbar button.ql-active .ql-fill { fill: ${variable('editor-tool-active-color')}; }
    [data-pc-name="editor"] .ql-tooltip { background: ${variable('editor-tooltip-background')}; color: ${variable('editor-tooltip-color')}; border: 1px solid ${variable('editor-tooltip-border-color')}; border-radius: ${variable('editor-tooltip-border-radius')}; }`;

    return [buttons, splitButtons, utilities, fields, periods, picker, upload, editor].join('\n');
};
