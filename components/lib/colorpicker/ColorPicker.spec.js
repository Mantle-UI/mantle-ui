import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { ColorPicker } from './ColorPicker';

const rectangle = (element, { left = 10, top = 10, width = 200, height = 100 } = {}) => jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top });

describe('ColorPicker selected color', () => {
    it.each([
        ['hex', 'ff0000', '0000ff', '404080'],
        ['rgb', { r: 255, g: 0, b: 0 }, { r: 0, g: 0, b: 255 }, { r: 64, g: 64, b: 128 }],
        ['hsb', { h: 0, s: 100, b: 100 }, { h: 240, s: 100, b: 100 }, { h: 240, s: 50, b: 50 }]
    ])('emits %s values using the rendered selector and hue dimensions', (format, initial, blue, selected) => {
        const onChange = jest.fn();
        const { container } = render(<ColorPicker inline format={format} value={initial} onChange={onChange} />);
        const hue = container.querySelector('.p-colorpicker-hue');
        const selector = container.querySelector('.p-colorpicker-color-selector');

        rectangle(hue, { height: 180 });
        rectangle(selector, { top: 20 });
        fireEvent.mouseDown(hue, { clientY: 70 });
        fireEvent.mouseUp(document);
        expect(onChange.mock.calls[0][0].value).toEqual(blue);
        fireEvent.mouseDown(selector, { clientX: 110, clientY: 70 });
        fireEvent.mouseUp(document);
        expect(onChange.mock.calls[1][0].value).toEqual(selected);
        expect(onChange.mock.calls[1][0].target.value).toEqual(selected);
        expect(selector).toHaveStyle({ backgroundColor: 'rgb(0, 0, 255)' });
        const handle = container.querySelector('.p-colorpicker-color-handle');

        expect(handle).toHaveStyle({ left: '50%', top: '50%' });
    });

    it('updates the preview on hue selection without an onChange handler and preserves refs', () => {
        const api = React.createRef();
        const input = React.createRef();
        const { container } = render(<ColorPicker ref={api} inputRef={input} value="ff0000" />);

        fireEvent.click(input.current);
        const hue = api.current.getOverlay().querySelector('.p-colorpicker-hue');

        rectangle(hue, { height: 150 });
        fireEvent.mouseDown(hue, { clientY: 110 });
        fireEvent.mouseUp(document);
        expect(input.current).toHaveStyle({ backgroundColor: 'rgb(0, 255, 0)' });
        expect(api.current.getInput()).toBe(input.current);
        expect(api.current.getElement()).toBe(container.querySelector('.p-colorpicker'));
    });

    it('supports touch coordinates at zero without falling back to absent mouse data', () => {
        const onChange = jest.fn();
        const { container } = render(<ColorPicker inline value="ff0000" onChange={onChange} />);
        const selector = container.querySelector('.p-colorpicker-color-selector');

        rectangle(selector, { left: 0, top: 0, width: 240, height: 80 });
        fireEvent.touchStart(selector, { changedTouches: [{ clientX: 0, clientY: 0 }] });
        expect(onChange.mock.calls[0][0].value).toBe('ffffff');
        fireEvent.touchMove(selector, { changedTouches: [{ clientX: 120, clientY: 40 }] });
        fireEvent.touchEnd(selector);
        expect(onChange.mock.calls[1][0].value).toBe('804040');
    });

    it('updates the preview and handles on controlled value and defaultColor replacement', () => {
        const { container, rerender } = render(<ColorPicker value="ff0000" />);
        const input = container.querySelector('input');

        rerender(<ColorPicker value="0000ff" />);
        expect(input).toHaveStyle({ backgroundColor: 'rgb(0, 0, 255)' });
        rerender(<ColorPicker defaultColor="00ff00" />);
        expect(input).toHaveStyle({ backgroundColor: 'rgb(0, 255, 0)' });
        rerender(<ColorPicker defaultColor="0000ff" />);
        expect(input).toHaveStyle({ backgroundColor: 'rgb(0, 0, 255)' });
    });

    it('keeps disabled inline selectors from changing the value', () => {
        const onChange = jest.fn();
        const { container } = render(<ColorPicker inline disabled value="ff0000" onChange={onChange} />);
        const selector = container.querySelector('.p-colorpicker-color-selector');

        rectangle(selector);
        fireEvent.mouseDown(selector, { clientX: 50, clientY: 50 });
        expect(onChange).not.toHaveBeenCalled();
    });

    it('keeps an inline inputRef empty because inline mode has no preview input', () => {
        const input = React.createRef();
        const api = React.createRef();

        render(
            <React.StrictMode>
                <ColorPicker inline value="ff0000" ref={api} inputRef={input} />
            </React.StrictMode>
        );
        expect(input.current).toBeNull();
        expect(api.current.getInput()).toBeNull();
        expect(api.current.getOverlay().querySelector('.p-colorpicker-color-selector')).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
    });
});
