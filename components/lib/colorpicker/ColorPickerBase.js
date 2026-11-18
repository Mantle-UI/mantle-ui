import MantleUI from '../api/Api';
import { ComponentBase } from '../componentbase/ComponentBase';
import { classNames } from '../utils/Utils';

const classes = {
    root: ({ props }) =>
        classNames('p-colorpicker p-component', {
            'p-colorpicker-overlay': !props.inline,
            'p-colorpicker-alpha-enabled': props.alpha
        }),
    input: ({ props }) =>
        classNames('p-colorpicker-preview p-inputtext', props.inputClassName, {
            'p-disabled': props.disabled
        }),
    panel: ({ panelProps, context }) =>
        classNames('p-colorpicker-panel', panelProps.panelClassName, {
            'p-colorpicker-overlay-panel': !panelProps.inline,
            'p-colorpicker-alpha-enabled': panelProps.alpha,
            'p-disabled': panelProps.disabled,
            'p-input-filled': (context && context.inputStyle === 'filled') || MantleUI.inputStyle === 'filled',
            'p-ripple-disabled': (context && context.ripple === false) || MantleUI.ripple === false
        }),
    content: 'p-colorpicker-content',
    alpha: 'p-colorpicker-alpha',
    alphaLabel: 'p-colorpicker-alpha-label',
    alphaValue: 'p-colorpicker-alpha-value',
    alphaPreview: 'p-colorpicker-alpha-preview',
    alphaSlider: 'p-colorpicker-alpha-slider',
    hueHandle: 'p-colorpicker-hue-handle',
    hue: 'p-colorpicker-hue',
    colorHandle: 'p-colorpicker-color-handle',
    color: 'p-colorpicker-color',
    selector: 'p-colorpicker-color-selector',
    transition: 'p-connected-overlay'
};

const styles = `
@layer mantle {
    .p-colorpicker {
        display: inline-block;
    }
    
    .p-colorpicker-dragging {
        cursor: pointer;
    }
    
    .p-colorpicker-overlay {
        position: relative;
    }
    
    .p-colorpicker-panel {
        position: relative;
        width: 193px;
        height: 166px;
    }
    
    .p-colorpicker-overlay-panel {
        position: absolute;
        top: 0;
        left: 0;
    }
    
    .p-colorpicker-preview {
        cursor: pointer;
    }
    
    .p-colorpicker-panel .p-colorpicker-content {
        position: relative;
    }
    
    .p-colorpicker-panel .p-colorpicker-color-selector {
        width: 150px;
        height: 150px;
        top: 8px;
        left: 8px;
        position: absolute;
    }
    
    .p-colorpicker-panel .p-colorpicker-color {
        width: 150px;
        height: 150px;
    }
    
    .p-colorpicker-panel .p-colorpicker-color-handle {
        position: absolute;
        top: 0px;
        left: 150px;
        border-radius: 100%;
        width: 10px;
        height: 10px;
        border-width: 1px;
        border-style: solid;
        margin: -5px 0 0 -5px;
        cursor: pointer;
        opacity: 0.85;
    }
    
    .p-colorpicker-panel .p-colorpicker-hue {
        width: 17px;
        height: 150px;
        top: 8px;
        left: 167px;
        position: absolute;
        opacity: 0.85;
    }
    
    .p-colorpicker-panel .p-colorpicker-hue-handle {
        position: absolute;
        top: 150px;
        left: 0px;
        width: 21px;
        margin-left: -2px;
        margin-top: -5px;
        height: 10px;
        border-width: 2px;
        border-style: solid;
        opacity: 0.85;
        cursor: pointer;
    }
    
    .p-colorpicker-panel .p-colorpicker-color {
        background: linear-gradient(to top, #000 0%, rgb(0 0 0 / 0) 100%), linear-gradient(to right, #fff 0%, rgb(255 255 255 / 0) 100%)
    }
    .p-colorpicker-panel .p-colorpicker-hue {
        background: linear-gradient(0deg, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red)
    }
    .p-colorpicker-panel.p-colorpicker-alpha-enabled {
        height: 232px;
    }
    .p-colorpicker-alpha {
        position: absolute;
        top: 166px;
        left: 8px;
        right: 8px;
        display: grid;
        grid-template-columns: 24px 1fr auto;
        align-items: center;
        gap: 8px;
        color: var(--p-colorpicker-alpha-color, #fff);
    }
    .p-colorpicker-alpha-label {
        grid-column: 1 / 3;
    }
    .p-colorpicker-alpha-value {
        text-align: end;
    }
    .p-colorpicker-alpha-preview {
        width: 24px;
        height: 24px;
        border: 1px solid currentColor;
    }
    .p-colorpicker-alpha-slider {
        grid-column: 2 / 4;
        width: 100%;
        height: 1rem;
        margin: 0;
        appearance: none;
        -webkit-appearance: none;
        background: transparent;
        border-radius: 1rem;
        direction: ltr;
        cursor: pointer;
    }
    .p-colorpicker-alpha-slider::-webkit-slider-runnable-track {
        height: 0.75rem;
        border-radius: 1rem;
        background-image: linear-gradient(to right, rgba(var(--p-colorpicker-alpha-rgb, 255, 0, 0), 0), rgba(var(--p-colorpicker-alpha-rgb, 255, 0, 0), 1)), conic-gradient(#ddd 25%, #fff 0 50%, #ddd 0 75%, #fff 0);
        background-size: 100% 100%, 8px 8px;
        box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.35);
    }
    .p-colorpicker-alpha-slider::-moz-range-track {
        height: 0.75rem;
        border-radius: 1rem;
        background-image: linear-gradient(to right, rgba(var(--p-colorpicker-alpha-rgb, 255, 0, 0), 0), rgba(var(--p-colorpicker-alpha-rgb, 255, 0, 0), 1)), conic-gradient(#ddd 25%, #fff 0 50%, #ddd 0 75%, #fff 0);
        background-size: 100% 100%, 8px 8px;
        box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.35);
    }
    .p-colorpicker-alpha-slider::-webkit-slider-thumb {
        appearance: none;
        -webkit-appearance: none;
        width: 1rem;
        height: 1rem;
        margin-top: -0.125rem;
        border: 1px solid #fff;
        border-radius: 50%;
        background: #323232;
        box-shadow: 0 0 0 1px #000;
    }
    .p-colorpicker-alpha-slider::-moz-range-thumb {
        width: 1rem;
        height: 1rem;
        border: 1px solid #fff;
        border-radius: 50%;
        background: #323232;
        box-shadow: 0 0 0 1px #000;
    }
    .p-colorpicker-alpha-slider::-moz-range-progress {
        background: transparent;
    }
    .p-colorpicker-alpha-slider:focus-visible {
        outline: 2px solid var(--p-colorpicker-alpha-color, #fff);
        outline-offset: 3px;
    }
    .p-colorpicker-alpha-slider:disabled {
        cursor: default;
        opacity: 0.6;
    }
    .p-colorpicker-alpha-preview,
    .p-colorpicker-alpha-enabled .p-colorpicker-preview {
        background-image: linear-gradient(var(--p-colorpicker-preview-color), var(--p-colorpicker-preview-color)), conic-gradient(#ddd 25%, #fff 0 50%, #ddd 0 75%, #fff 0);
        background-size: 100% 100%, 8px 8px;
    }
}
`;

export const ColorPickerBase = ComponentBase.extend({
    defaultProps: {
        __TYPE: 'ColorPicker',
        alpha: false,
        alphaLabel: 'Opacity',
        appendTo: null,
        autoFocus: false,
        children: undefined,
        className: null,
        defaultColor: 'ff0000',
        disabled: false,
        format: 'hex',
        id: null,
        inline: false,
        inputClassName: null,
        inputId: null,
        inputRef: null,
        inputStyle: null,
        onChange: null,
        onHide: null,
        onShow: null,
        panelClassName: null,
        panelStyle: null,
        readOnly: false,
        style: null,
        tabIndex: null,
        tooltip: null,
        tooltipOptions: null,
        transitionOptions: null,
        value: null
    },
    css: {
        classes,
        styles
    }
});
