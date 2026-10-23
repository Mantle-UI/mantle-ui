import * as React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPicker } from './ColorPicker';

beforeEach(() => {
    // jsdom has no layout, so every offsetParent is null. Give overlay alignment the visible-element path.
    jest.spyOn(HTMLElement.prototype, 'offsetParent', 'get').mockImplementation(function () {
        return this.parentElement;
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});

const rectangle = (element) => jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 150, height: 150, right: 150, bottom: 150, x: 0, y: 0 });

const selectGreen = (container) => {
    const hue = container.querySelector('.p-colorpicker-hue');

    rectangle(hue);
    fireEvent.mouseDown(hue, { clientY: 100 });
    fireEvent.mouseUp(document);
};

const selectPartialColor = (container) => {
    const selector = container.querySelector('.p-colorpicker-color-selector');

    rectangle(selector);
    fireEvent.mouseDown(selector, { clientX: 75, clientY: 75 });
    fireEvent.mouseUp(document);
};

describe('ColorPicker legacy value contract', () => {
    it.each([
        ['hex', 'ff0000', '00ff00'],
        ['rgb', { r: 255, g: 0, b: 0 }, { r: 0, g: 255, b: 0 }],
        ['hsb', { h: 0, s: 100, b: 100 }, { h: 120, s: 100, b: 100 }]
    ])('keeps %s output and event metadata unchanged with alpha omitted or false', (format, value, expected) => {
        const onChange = jest.fn();
        const { container, rerender } = render(<ColorPicker inline format={format} value={value} onChange={onChange} name="color" id="picker" />);

        expect(screen.queryByRole('slider', { name: 'Opacity' })).not.toBeInTheDocument();
        selectGreen(container);
        expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: expected, target: { value: expected, name: 'color', id: 'picker' } }));
        rerender(<ColorPicker inline alpha={false} format={format} value={value} onChange={onChange} />);
        selectGreen(container);
        expect(onChange.mock.calls[1][0].value).toEqual(expected);
        expect(screen.queryByRole('slider', { name: 'Opacity' })).not.toBeInTheDocument();
    });
});

describe('ColorPicker alpha values', () => {
    it.each([
        ['ff000000', 0, '00ff0000'],
        ['#ff000080', 50, '00ff0080'],
        ['FF0000FF', 100, '00ff00ff'],
        ['#ff0000', 100, '00ff00ff'],
        ['ff0000', 100, '00ff00ff']
    ])('reads hex %s and preserves alpha when hue changes', (value, percent, expected) => {
        const onChange = jest.fn();
        const { container } = render(<ColorPicker inline alpha value={value} onChange={onChange} />);

        expect(screen.getByRole('slider', { name: 'Opacity' })).toHaveValue(String(percent));
        selectGreen(container);
        expect(onChange.mock.calls[0][0].value).toBe(expected);
        expect(onChange.mock.calls[0][0].target.value).toBe(expected);
    });

    it.each(['rgb', 'hsb'])('preserves zero, partial, opaque and supplied fractional alpha for %s', (format) => {
        const onChange = jest.fn();
        const base = format === 'rgb' ? { r: 255, g: 0, b: 0 } : { h: 0, s: 100, b: 100 };
        const expected = format === 'rgb' ? { r: 0, g: 255, b: 0 } : { h: 120, s: 100, b: 100 };
        const { container, rerender } = render(<ColorPicker inline alpha format={format} value={{ ...base, a: 0 }} onChange={onChange} />);

        for (const a of [0, 0.5, 0.123456, 1]) {
            rerender(<ColorPicker inline alpha format={format} value={{ ...base, a }} onChange={onChange} />);
            expect(screen.getByRole('slider', { name: 'Opacity' })).toHaveValue(String(Math.round(a * 100)));
            selectGreen(container);
            expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: { ...expected, a } }));
        }
    });

    it.each(['rgb', 'hsb'])('normalizes missing, non-finite and out-of-range %s alpha', (format) => {
        const onChange = jest.fn();
        const base = format === 'rgb' ? { r: 255, g: 0, b: 0 } : { h: 0, s: 100, b: 100 };
        const { container, rerender } = render(<ColorPicker inline alpha format={format} value={base} onChange={onChange} />);

        for (const [a, expected] of [
            [undefined, 1],
            [NaN, 1],
            [Infinity, 1],
            [-Infinity, 1],
            [-0.25, 0],
            [1.25, 1]
        ]) {
            rerender(<ColorPicker inline alpha format={format} value={{ ...base, a }} onChange={onChange} />);
            expect(screen.getByRole('slider', { name: 'Opacity' })).toHaveValue(String(expected * 100));
            selectGreen(container);
            expect(onChange.mock.lastCall[0].value.a).toBe(expected);
        }
    });

    it.each([
        ['hex', 'ff000000', '80404000'],
        ['hex', 'ff00007f', '8040407f'],
        ['rgb', { r: 255, g: 0, b: 0, a: 0.123456 }, { r: 128, g: 64, b: 64, a: 0.123456 }],
        ['hsb', { h: 0, s: 100, b: 100, a: 0 }, { h: 0, s: 50, b: 50, a: 0 }]
    ])('preserves alpha during saturation/brightness edits in %s', (format, value, expected) => {
        const onChange = jest.fn();
        const { container } = render(<ColorPicker inline alpha format={format} value={value} onChange={onChange} />);

        selectPartialColor(container);
        expect(onChange.mock.lastCall[0].value).toEqual(expected);
    });

    it.each([
        ['hex', 'ff000080', ['ff000000', 'ff000040', 'ff000080', 'ff0000ff']],
        ['rgb', { r: 255, g: 0, b: 0, a: 0.123456 }, [0, 0.25, 0.5, 1].map((a) => ({ r: 255, g: 0, b: 0, a }))],
        ['hsb', { h: 0, s: 100, b: 100, a: 0.123456 }, [0, 0.25, 0.5, 1].map((a) => ({ h: 0, s: 100, b: 100, a }))]
    ])('emits transparent, partial and opaque opacity edits in %s', (format, value, expected) => {
        const onChange = jest.fn();

        render(<ColorPicker inline alpha format={format} value={value} onChange={onChange} name="color" id="picker" />);
        const slider = screen.getByRole('slider', { name: 'Opacity' });

        for (const [index, percent] of [0, 25, 50, 100].entries()) {
            fireEvent.change(slider, { target: { value: String(percent) } });
            expect(onChange.mock.lastCall[0].value).toEqual(expected[index]);
            expect(onChange.mock.lastCall[0].target).toEqual({ name: 'color', id: 'picker', value: expected[index] });
            expect(slider).toHaveValue(String(percent));
        }
    });

    it('synchronizes controlled alpha values, formats, defaultColor and alpha toggling without emitting', () => {
        const onChange = jest.fn();
        const { rerender } = render(<ColorPicker inline alpha value="ff000000" onChange={onChange} />);

        expect(screen.getByRole('slider', { name: 'Opacity' })).toHaveValue('0');
        rerender(<ColorPicker inline alpha value="0000ff80" onChange={onChange} />);
        expect(screen.getByRole('slider', { name: 'Opacity' })).toHaveValue('50');
        rerender(<ColorPicker inline alpha format="rgb" value={{ r: 0, g: 255, b: 0, a: 0.25 }} onChange={onChange} />);
        expect(screen.getByRole('slider', { name: 'Opacity' })).toHaveValue('25');
        rerender(<ColorPicker inline alpha format="hsb" value={{ h: 240, s: 100, b: 100, a: 0.75 }} onChange={onChange} />);
        expect(screen.getByRole('slider', { name: 'Opacity' })).toHaveValue('75');
        rerender(<ColorPicker inline alpha defaultColor="ff000000" onChange={onChange} />);
        expect(screen.getByRole('slider', { name: 'Opacity' })).toHaveValue('0');
        rerender(<ColorPicker inline alpha defaultColor="00ff00ff" onChange={onChange} />);
        expect(screen.getByRole('slider', { name: 'Opacity' })).toHaveValue('100');
        rerender(<ColorPicker inline alpha={false} value="ff0000" onChange={onChange} />);
        expect(screen.queryByRole('slider', { name: 'Opacity' })).not.toBeInTheDocument();
        rerender(<ColorPicker inline alpha value="ff0000" onChange={onChange} />);
        expect(screen.getByRole('slider', { name: 'Opacity' })).toHaveValue('100');
        expect(onChange).not.toHaveBeenCalled();
    });

    it.each(['value', 'alpha'])('cancels a drag and applies a controlled %s replacement immediately', (property) => {
        const onChange = jest.fn();
        const { container, rerender } = render(<ColorPicker inline alpha value="ff000080" onChange={onChange} />);
        const selector = container.querySelector('.p-colorpicker-color-selector');

        rectangle(selector);
        fireEvent.mouseDown(selector, { clientX: 75, clientY: 75 });
        expect(onChange).toHaveBeenCalledTimes(1);

        if (property === 'value') {
            rerender(<ColorPicker inline alpha value="0000ff40" onChange={onChange} />);
            expect(screen.getByRole('slider', { name: 'Opacity' })).toHaveValue('25');
            expect(container.querySelector('.p-colorpicker-alpha-preview').style.getPropertyValue('--p-colorpicker-preview-color')).toBe(`rgba(0, 0, 255, ${64 / 255})`);
        } else {
            rerender(<ColorPicker inline alpha={false} value="ff0000" onChange={onChange} />);
            expect(screen.queryByRole('slider', { name: 'Opacity' })).not.toBeInTheDocument();
        }

        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
        fireEvent.mouseUp(document);
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('continues a drag when the controlled parent accepts emitted values', () => {
        const onChange = jest.fn();

        const ControlledPicker = () => {
            const [value, setValue] = React.useState({ r: 255, g: 0, b: 0, a: 0.5 });

            return (
                <ColorPicker
                    inline
                    alpha
                    format="rgb"
                    value={value}
                    onChange={(event) => {
                        onChange(event);
                        setValue(event.value);
                    }}
                />
            );
        };

        const { container } = render(<ControlledPicker />);
        const selector = container.querySelector('.p-colorpicker-color-selector');

        rectangle(selector);
        fireEvent.mouseDown(selector, { clientX: 75, clientY: 75 });
        fireEvent.mouseMove(document, { clientX: 100, clientY: 50 });
        fireEvent.mouseMove(document, { clientX: 125, clientY: 25 });
        fireEvent.mouseUp(document);
        expect(onChange).toHaveBeenCalledTimes(3);
        expect(onChange.mock.calls[1][0].value).not.toEqual(onChange.mock.calls[0][0].value);
        expect(onChange.mock.calls[2][0].value).not.toEqual(onChange.mock.calls[1][0].value);

        for (const [event] of onChange.mock.calls) expect(event.value.a).toBe(0.5);

        expect(screen.getByRole('slider', { name: 'Opacity' })).toHaveValue('50');
    });

    it('uses defaultColor as hex even with an object value format', () => {
        const onChange = jest.fn();

        render(<ColorPicker inline alpha format="rgb" defaultColor="0000ff80" onChange={onChange} />);
        const slider = screen.getByRole('slider', { name: 'Opacity' });

        expect(slider).toHaveValue('50');
        fireEvent.change(slider, { target: { value: '25' } });
        expect(onChange.mock.lastCall[0].value).toEqual({ r: 0, g: 0, b: 255, a: 0.25 });
    });

    it('preserves caller-owned object values when opacity or hue changes', () => {
        const value = Object.freeze({ h: 0, s: 100, b: 100, a: 0.123456 });
        const onChange = jest.fn();
        const { container } = render(<ColorPicker inline alpha format="hsb" value={value} onChange={onChange} />);

        fireEvent.change(screen.getByRole('slider', { name: 'Opacity' }), { target: { value: '25' } });
        expect(value).toEqual({ h: 0, s: 100, b: 100, a: 0.123456 });
        selectGreen(container);
        expect(value).toEqual({ h: 0, s: 100, b: 100, a: 0.123456 });
        expect(onChange.mock.lastCall[0].value).toEqual({ h: 120, s: 100, b: 100, a: 0.25 });
    });

    it.each([
        ['hex', '001177ff', '00117780'],
        ['rgb', { r: 0, g: 17, b: 119, a: 1 }, { r: 0, g: 17, b: 119, a: 0.5 }]
    ])('preserves exact %s channels when only opacity changes', (format, value, expected) => {
        const onChange = jest.fn();
        const { container } = render(<ColorPicker inline alpha format={format} value={value} onChange={onChange} />);
        const preview = container.querySelector('.p-colorpicker-alpha-preview');

        expect(preview.style.getPropertyValue('--p-colorpicker-preview-color')).toBe('rgba(0, 17, 119, 1)');
        fireEvent.change(screen.getByRole('slider', { name: 'Opacity' }), { target: { value: '50' } });
        expect(onChange.mock.lastCall[0].value).toEqual(expected);
        expect(preview.style.getPropertyValue('--p-colorpicker-preview-color')).toBe('rgba(0, 17, 119, 0.5)');
    });
});

describe('ColorPicker opacity interaction', () => {
    it.each([true, false])('updates the transparency preview in inline=%s mode', (inline) => {
        const inputRef = React.createRef();
        const { container } = render(<ColorPicker inline={inline} alpha format="rgb" value={{ r: 255, g: 0, b: 0, a: 0.5 }} inputRef={inputRef} transitionOptions={{ disabled: true }} />);

        if (!inline) fireEvent.click(inputRef.current);

        const preview = document.querySelector('.p-colorpicker-alpha-preview');
        const slider = screen.getByRole('slider', { name: 'Opacity' });

        expect(preview).toBeVisible();
        expect(preview.style.getPropertyValue('--p-colorpicker-preview-color')).toBe('rgba(255, 0, 0, 0.5)');
        fireEvent.change(slider, { target: { value: '0' } });
        expect(preview.style.getPropertyValue('--p-colorpicker-preview-color')).toBe('rgba(255, 0, 0, 0)');
        fireEvent.change(slider, { target: { value: '100' } });
        expect(preview.style.getPropertyValue('--p-colorpicker-preview-color')).toBe('rgba(255, 0, 0, 1)');
        const panel = inline ? container : preview.closest('.p-colorpicker-panel');

        selectGreen(panel);
        expect(preview.style.getPropertyValue('--p-colorpicker-preview-color')).toBe('rgba(0, 255, 0, 1)');

        if (!inline) expect(inputRef.current.style.getPropertyValue('--p-colorpicker-preview-color')).toBe('rgba(0, 255, 0, 1)');
    });

    it('provides a labelled native percent slider and supports a translated label', () => {
        const { rerender } = render(<ColorPicker inline alpha value="ff000080" />);
        const slider = screen.getByRole('slider', { name: 'Opacity' });

        expect(slider).toHaveAttribute('type', 'range');
        expect(slider).toHaveAttribute('min', '0');
        expect(slider).toHaveAttribute('max', '100');
        expect(slider).toHaveAttribute('step', '1');
        expect(slider).toHaveAttribute('aria-valuetext', '50%');
        rerender(<ColorPicker inline alpha alphaLabel="Deckkraft" value="ff000080" />);
        expect(screen.getByRole('slider', { name: 'Deckkraft' })).toBe(slider);
    });

    it.each(['disabled', 'readOnly'])('blocks opacity, mouse and touch edits when %s', (property) => {
        const onChange = jest.fn();
        const { container } = render(<ColorPicker inline alpha value="ff000080" onChange={onChange} {...{ [property]: true }} />);
        const slider = screen.getByRole('slider', { name: 'Opacity' });
        const selector = container.querySelector('.p-colorpicker-color-selector');
        const hue = container.querySelector('.p-colorpicker-hue');

        rectangle(selector);
        rectangle(hue);
        expect(slider).toBeDisabled();
        fireEvent.change(slider, { target: { value: '25' } });
        fireEvent.mouseDown(selector, { clientX: 75, clientY: 75 });
        fireEvent.mouseDown(hue, { clientY: 100 });
        fireEvent.touchStart(selector, { changedTouches: [{ pageX: 75, pageY: 75, clientX: 75, clientY: 75 }] });
        fireEvent.touchStart(hue, { changedTouches: [{ pageY: 100, clientY: 100 }] });
        fireEvent.touchEnd(selector);
        fireEvent.mouseUp(document);
        expect(onChange).not.toHaveBeenCalled();
    });

    it.each(['disabled', 'readOnly'])('stops an active drag when %s changes', (property) => {
        const onChange = jest.fn();
        const { container, rerender } = render(<ColorPicker inline alpha value="ff000080" onChange={onChange} />);
        const selector = container.querySelector('.p-colorpicker-color-selector');

        rectangle(selector);
        fireEvent.mouseDown(selector, { clientX: 75, clientY: 75 });
        expect(onChange).toHaveBeenCalledTimes(1);
        rerender(<ColorPicker inline alpha value="ff000080" onChange={onChange} {...{ [property]: true }} />);
        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
        fireEvent.mouseUp(document);
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it.each([' ', 'Enter'])('opens the alpha popup with %s and focuses opacity; Escape returns focus', async (key) => {
        const user = userEvent.setup();
        const inputRef = React.createRef();

        render(<ColorPicker alpha inputRef={inputRef} value="ff000080" transitionOptions={{ disabled: true }} />);
        inputRef.current.focus();
        await user.keyboard(key === ' ' ? '[Space]' : '[Enter]');
        const slider = await screen.findByRole('slider', { name: 'Opacity' });

        await waitFor(() => expect(slider).toHaveFocus());
        await user.keyboard('[Escape]');
        await waitFor(() => expect(screen.queryByRole('slider', { name: 'Opacity' })).not.toBeInTheDocument());
        expect(inputRef.current).toHaveFocus();
    });

    it.each(['[Space]', '[Enter]'])('focuses opacity with %s when the popup is already open', async (key) => {
        const user = userEvent.setup();
        const inputRef = React.createRef();

        render(<ColorPicker alpha inputRef={inputRef} value="ff000080" transitionOptions={{ disabled: true }} />);
        await user.click(inputRef.current);
        const slider = screen.getByRole('slider', { name: 'Opacity' });

        inputRef.current.focus();
        await user.keyboard(key);
        expect(slider).toHaveFocus();
        expect(slider).toBeVisible();
    });

    it('lets Tab reach opacity from the popup trigger', async () => {
        const user = userEvent.setup();
        const inputRef = React.createRef();

        render(<ColorPicker alpha inputRef={inputRef} value="ff000080" appendTo="self" transitionOptions={{ disabled: true }} />);
        await user.click(inputRef.current);
        const slider = screen.getByRole('slider', { name: 'Opacity' });

        inputRef.current.focus();
        await user.tab();
        expect(slider).toHaveFocus();
        expect(slider).toBeVisible();
    });

    it.each([false, true])('closes the popup and restores logical focus when tabbing out, shift=%s', async (shift) => {
        const user = userEvent.setup();
        const inputRef = React.createRef();

        render(
            <>
                <ColorPicker alpha inputRef={inputRef} value="ff000080" transitionOptions={{ disabled: true }} />
                <button type="button">Next control</button>
            </>
        );
        inputRef.current.focus();
        await user.keyboard('[Enter]');
        const slider = screen.getByRole('slider', { name: 'Opacity' });

        expect(slider).toHaveFocus();
        await user.tab({ shift });
        expect(screen.queryByRole('slider', { name: 'Opacity' })).not.toBeInTheDocument();
        expect(shift ? inputRef.current : screen.getByRole('button', { name: 'Next control' })).toHaveFocus();
    });

    it('tabs from opacity to an ordinary anchor and skips unavailable controls', async () => {
        const user = userEvent.setup();
        const inputRef = React.createRef();

        render(
            <>
                <ColorPicker alpha inputRef={inputRef} value="ff000080" transitionOptions={{ disabled: true }} />
                <button type="button" disabled>
                    Disabled control
                </button>
                <div hidden>
                    <button type="button">Hidden control</button>
                </div>
                <a href="#target">Next link</a>
                <button type="button">Later control</button>
            </>
        );
        inputRef.current.focus();
        await user.keyboard('[Enter]');
        expect(screen.getByRole('slider', { name: 'Opacity' })).toHaveFocus();
        await user.tab();
        expect(screen.queryByRole('slider', { name: 'Opacity' })).not.toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Next link' })).toHaveFocus();
    });

    it('handles opacity edits in a popup and preserves the imperative/input refs', () => {
        const api = React.createRef();
        const inputRef = React.createRef();
        const onChange = jest.fn();

        render(<ColorPicker alpha ref={api} inputRef={inputRef} value="ff000080" onChange={onChange} transitionOptions={{ disabled: true }} />);
        expect(api.current.getInput()).toBe(inputRef.current);
        fireEvent.click(inputRef.current);
        const slider = screen.getByRole('slider', { name: 'Opacity' });

        expect(api.current.getOverlay()).toContainElement(slider);
        fireEvent.change(slider, { target: { value: '0' } });
        expect(onChange.mock.lastCall[0].value).toBe('ff000000');
    });
});
