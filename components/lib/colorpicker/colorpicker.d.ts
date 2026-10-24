/**
 *
 * ColorPicker is an input component to select a color.
 *
 * [Live Demo](https://www.primereact.org/colorpicker/)
 *
 * @module colorpicker
 *
 */
import * as React from 'react';
import { CSSTransitionProps as ReactCSSTransitionProps } from 'react-transition-group/CSSTransition';
import { ComponentHooks } from '../componentbase/componentbase';
import { CSSTransitionProps } from '../csstransition';
import { PassThroughOptions } from '../passthrough';
import { TooltipPassThroughOptions } from '../tooltip/tooltip';
import { TooltipOptions } from '../tooltip/tooltipoptions';
import { FormEvent } from '../ts-helpers';
import { PassThroughType } from '../utils/utils';

export declare type ColorPickerPassThroughType<T> = PassThroughType<T, ColorPickerPassThroughMethodOptions>;
export declare type ColorPickerPassThroughTransitionType = ReactCSSTransitionProps | ((options: ColorPickerPassThroughMethodOptions) => ReactCSSTransitionProps) | undefined;

/**
 * Custom passthrough(pt) option method.
 */
export interface ColorPickerPassThroughMethodOptions {
    props: ColorPickerProps;
    state: ColorPickerState;
}

/**
 * Custom passthrough(pt) options.
 * @see {@link ColorPickerProps.pt}
 */
export interface ColorPickerPassThroughOptions {
    /**
     * Uses to pass attributes to the root's DOM element.
     */
    root?: ColorPickerPassThroughType<React.HTMLAttributes<HTMLDivElement>>;
    /**
     * Uses to pass attributes to the input's DOM element.
     */
    input?: ColorPickerPassThroughType<React.HTMLAttributes<HTMLInputElement>>;
    /**
     * Uses to pass attributes to the panel's DOM element.
     */
    panel?: ColorPickerPassThroughType<React.HTMLAttributes<HTMLDivElement>>;
    /**
     * Uses to pass attributes to the content's DOM element.
     */
    content?: ColorPickerPassThroughType<React.HTMLAttributes<HTMLDivElement>>;
    /**
     * Uses to pass attributes to the selector's DOM element.
     */
    selector?: ColorPickerPassThroughType<React.HTMLAttributes<HTMLDivElement>>;
    /**
     * Uses to pass attributes to the color's DOM element.
     */
    color?: ColorPickerPassThroughType<React.HTMLAttributes<HTMLDivElement>>;
    /**
     * Uses to pass attributes to the color handle's DOM element.
     */
    colorHandle?: ColorPickerPassThroughType<React.HTMLAttributes<HTMLDivElement>>;
    /**
     * Uses to pass attributes to the hue's DOM element.
     */
    hue?: ColorPickerPassThroughType<React.HTMLAttributes<HTMLDivElement>>;
    /**
     * Uses to pass attributes to the hue handle's DOM element.
     */
    hueHandle?: ColorPickerPassThroughType<React.HTMLAttributes<HTMLDivElement>>;
    /**
     * Uses to pass attributes to the opacity section's DOM element.
     */
    alpha?: ColorPickerPassThroughType<React.HTMLAttributes<HTMLDivElement>>;
    /**
     * Uses to pass attributes to the opacity label's DOM element.
     */
    alphaLabel?: ColorPickerPassThroughType<React.HTMLAttributes<HTMLSpanElement>>;
    /**
     * Uses to pass attributes to the native opacity range input.
     */
    alphaSlider?: ColorPickerPassThroughType<React.InputHTMLAttributes<HTMLInputElement>>;
    /**
     * Uses to pass attributes to the opacity percentage's DOM element.
     */
    alphaValue?: ColorPickerPassThroughType<React.HTMLAttributes<HTMLSpanElement>>;
    /**
     * Uses to pass attributes to the checkerboard transparency preview.
     */
    alphaPreview?: ColorPickerPassThroughType<React.HTMLAttributes<HTMLDivElement>>;
    /**
     * Uses to pass attributes tooltip's DOM element.
     * @type {TooltipPassThroughOptions}
     */
    tooltip?: TooltipPassThroughOptions;
    /**
     * Used to manage all lifecycle hooks
     * @see {@link ComponentHooks}
     */
    hooks?: ComponentHooks;
    /**
     * Used to control React Transition API.
     */
    transition?: ColorPickerPassThroughTransitionType;
}

/**
 * Defines current inline state in ColorPicker component.
 */
export interface ColorPickerState {
    /**
     * Current overlay visible state as a boolean.
     * @defaultValue false
     */
    overlayVisible: boolean;
}

/**
 * RGB type of value
 */
interface ColorPickerRGBType {
    /**
     * Red channel from 0 to 255.
     */
    r: number;
    /**
     * Green channel from 0 to 255.
     */
    g: number;
    /**
     * Blue channel from 0 to 255.
     */
    b: number;
    /**
     * Opacity from 0 (transparent) to 1 (opaque), used only when alpha is enabled.
     * Missing or non-finite values default to 1; finite values are clamped to [0, 1].
     */
    a?: number;
}

/**
 * HSB type of value
 */
interface ColorPickerHSBType {
    /**
     * Hue from 0 to 360.
     */
    h: number;
    /**
     * Saturation from 0 to 100.
     */
    s: number;
    /**
     * Brightness from 0 to 100.
     */
    b: number;
    /**
     * Opacity from 0 (transparent) to 1 (opaque), used only when alpha is enabled.
     * Missing or non-finite values default to 1; finite values are clamped to [0, 1].
     */
    a?: number;
}

/**
 * Custom change event.
 * @see {@link ColorPickerProps.onChange}
 * @extends {FormEvent}
 * @event
 */
interface ColorPickerChangeEvent extends FormEvent<string | ColorPickerRGBType | ColorPickerHSBType> {}

/**
 * Defines valid properties in ColorPicker component. In addition to these, all properties of HTMLInputElement can be used in this component.
 * @group Properties
 */
export interface ColorPickerProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange' | 'value' | 'ref'> {
    /**
     * Enables opacity selection and transparency previews. With alpha enabled, hex values are emitted as
     * lowercase RRGGBBAA without a leading # and rgb/hsb objects include an a field from 0 to 1.
     * Existing value and event contracts are unchanged when false.
     * @defaultValue false
     */
    alpha?: boolean | undefined;
    /**
     * Accessible name and visible label of the opacity control.
     * @defaultValue Opacity
     */
    alphaLabel?: string | undefined;
    /**
     * DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element and "self". The "self" value is used to render a component where it is located.
     * @defaultValue document.body
     */
    appendTo?: 'self' | HTMLElement | undefined | null | (() => HTMLElement);
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @defaultValue false
     */
    autoFocus?: boolean | undefined;
    /**
     * Hex color to display when value is null. With alpha enabled, accepts RRGGBB or RRGGBBAA,
     * with an optional leading #; six digits imply full opacity.
     * @defaultValue ff0000
     */
    defaultColor?: string | undefined;
    /**
     * Format to use in value binding.
     * @defaultValue hex
     */
    format?: 'hex' | 'rgb' | 'hsb' | undefined;
    /**
     * Whether to display as an overlay or not.
     * @defaultValue false
     */
    inline?: boolean | undefined;
    /**
     * Identifier of the focus input to match a label defined for the dropdown.
     */
    inputId?: string | undefined;
    /**
     * Reference of the input element.
     */
    inputRef?: React.Ref<HTMLInputElement> | undefined;
    /**
     * Inline style of the input field.
     */
    inputStyle?: React.CSSProperties | undefined;
    /**
     * Inline style of the input field.
     */
    inputClassName?: string | undefined;
    /**
     * Style class of the overlay panel.
     */
    panelClassName?: string | undefined;
    /**
     * Inline style of the overlay panel.
     */
    panelStyle?: React.CSSProperties | undefined;
    /**
     * Prevents changes to color, hue and opacity while keeping the preview focusable.
     * @defaultValue false
     */
    readOnly?: boolean | undefined;
    /**
     * Content of the tooltip.
     */
    tooltip?: string | undefined;
    /**
     * Configuration of the tooltip, refer to the tooltip documentation for more information.
     * @type {TooltipOptions}
     */
    tooltipOptions?: TooltipOptions | undefined;
    /**
     * The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties.
     * @type {CSSTransitionProps}
     */
    transitionOptions?: CSSTransitionProps | undefined;
    /**
     * Value of the component. With alpha enabled, hex accepts RRGGBB or RRGGBBAA (optional #)
     * and emits lowercase RRGGBBAA without #. AA is rounded to the nearest byte (00 to ff).
     * RGB/HSB objects accept optional a from 0 to 1 and always emit a when alpha is enabled.
     * Missing/non-finite alpha defaults to 1; finite alpha is clamped to [0, 1].
     * Object alpha precision is preserved during color/hue edits. Editing opacity uses whole percent
     * steps, emitting a = percent / 100, or the nearest alpha byte for hex.
     * Opacity-only edits preserve the supplied RGB channels or hex RGB bytes.
     * @type {string | ColorPickerRGBType | ColorPickerHSBType}
     */
    value?: string | ColorPickerRGBType | ColorPickerHSBType | undefined;
    /**
     * Callback to invoke when a color is selected.
     * @param {ColorPickerChangeEvent} event - Custom change event.
     */
    onChange?(event: ColorPickerChangeEvent): void;
    /**
     * Callback to invoke when overlay panel becomes visible.
     */
    onShow?(): void;
    /**
     * Callback to invoke when overlay panel becomes hidden.
     */
    onHide?(): void;
    /**
     * Used to get the child elements of the component.
     * @readonly
     */
    children?: React.ReactNode | undefined;
    /**
     * Uses to pass attributes to DOM elements inside the component.
     * @type {ColorPickerPassThroughOptions}
     */
    pt?: ColorPickerPassThroughOptions;
    /**
     * Used to configure passthrough(pt) options of the component.
     * @type {PassThroughOptions}
     */
    ptOptions?: PassThroughOptions;
    /**
     * When enabled, it removes component related styles in the core.
     * @defaultValue false
     */
    unstyled?: boolean;
}

/**
 * **MantleUI - ColorPicker**
 *
 * _ColorPicker is an input component to select a color._
 *
 * [Live Demo](https://www.primereact.org/colorpicker/)
 * --- ---
 * ![MantleUI](https://raw.githubusercontent.com/Mantle-UI/mantle-ui/feature/rebranding/public/images/mantle-ui-logo_100.png)
 *
 * @group Component
 */
export declare class ColorPicker extends React.Component<ColorPickerProps, any> {
    /**
     * Used to show the overlay.
     */
    public show(): void;
    /**
     * Used to hide the overlay.
     */
    public hide(): void;
    /**
     * Used to focus the component.
     */
    public focus(): void;
    /**
     * Used to get container element.
     * @return {HTMLDivElement | null} Container element
     */
    public getElement(): HTMLDivElement | null;
    /**
     * Used to get input element.
     * @return {HTMLInputElement | null} Input element
     */
    public getInput(): HTMLInputElement | null;
    /**
     * Used to get overlay element.
     * @return {HTMLElement | null} Overlay element
     */
    public getOverlay(): HTMLElement | null;
}
