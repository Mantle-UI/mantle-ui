import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { MantleProvider } from '../../components/lib/api/Api';
import { ColorPicker } from '../../components/lib/colorpicker/ColorPicker';
import { Aura } from '../../components/lib/themes/themes';

const root = createRoot(document.getElementById('app'));
const staticTheme = document.documentElement.dataset.staticTheme === 'true';
const assertions = [];
const apis = {};
const inputs = {};
const updates = {};
const values = {};
const formats = ['hex', 'rgb', 'hsb'];
const initial = { hex: 'ff0000', rgb: { r: 255, g: 0, b: 0 }, hsb: { h: 0, s: 100, b: 100 } };
const blue = { hex: '0000ff', rgb: { r: 0, g: 0, b: 255 }, hsb: { h: 240, s: 100, b: 100 } };
const wait = () => new Promise((resolve) => setTimeout(resolve, 260));

const assert = (name, actual, expected) => {
    assertions.push({ name, actual, expected, passed: actual === expected });
    document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, phase: name, assertions });
    if (actual !== expected) throw new Error(`${name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
};

const Case = ({ format, inline, dt, disabled = false }) => {
    const id = `${format}-${inline ? 'inline' : 'popup'}${disabled ? '-disabled' : ''}`;
    const [value, setValue] = React.useState(initial[format]);

    apis[id] ||= React.createRef();
    inputs[id] ||= React.createRef();
    updates[id] = setValue;
    values[id] = value;

    return <ColorPicker id={id} ref={apis[id]} inputRef={inputs[id]} format={format} inline={inline} value={value} disabled={disabled} dt={dt} onChange={(event) => setValue(event.value)} />;
};

const render = (width = 200, height = 100) => {
    const dt = staticTheme ? undefined : { selector: { width: `${width}px`, height: `${height}px` }, hue: { width: '20px', height: `${height}px` }, content: { gap: '16px' }, panel: { padding: '16px', background: '#112233' } };
    const theme = staticTheme ? undefined : { preset: Aura, options: { prefix: 'picker-probe', darkModeSelector: '.app-dark' } };

    flushSync(() =>
        root.render(
            <React.StrictMode>
                <MantleProvider value={{ theme }}>
                    <style>{'*{box-sizing:border-box} #app{display:flex;flex-wrap:wrap;align-items:flex-start;gap:20px;padding:20px}'}</style>
                    {formats.flatMap((format) => [<Case key={format + '-popup'} format={format} dt={dt} />, <Case key={format + '-inline'} format={format} inline dt={dt} />])}
                    <Case format="hex" inline disabled dt={dt} />
                </MantleProvider>
            </React.StrictMode>
        )
    );
};

const pointer = (element, x, y) => {
    const rect = element.getBoundingClientRect();
    const event = { bubbles: true, clientX: rect.left + rect.width * x, clientY: rect.top + rect.height * y };

    element.dispatchEvent(new MouseEvent('mousedown', event));
    document.dispatchEvent(new MouseEvent('mouseup', event));
};

const run = async () => {
    render();
    await wait();

    for (const mode of staticTheme ? ['static'] : ['light', 'dark']) {
        document.getElementById('app').classList.toggle('app-dark', mode === 'dark');
        await wait();

        for (const format of formats) {
            for (const inline of [false, true]) {
                const id = `${format}-${inline ? 'inline' : 'popup'}`;
                const api = apis[id].current;

                if (!inline) inputs[id].current.click();
                await wait();
                const panel = api.getOverlay();
                const selector = panel.querySelector('.p-colorpicker-color-selector');
                const hue = panel.querySelector('.p-colorpicker-hue');
                const p = panel.getBoundingClientRect();
                const s = selector.getBoundingClientRect();
                const h = hue.getBoundingClientRect();

                assert(`${mode}/${id}: panel contains both controls`, s.x >= p.x && s.bottom <= p.bottom && h.right <= p.right && h.bottom <= p.bottom, true);
                assert(`${mode}/${id}: selector width follows tokens`, s.width, staticTheme ? 150 : 200);
                assert(`${mode}/${id}: selector height follows tokens`, s.height, staticTheme ? 150 : 100);
                assert(`${mode}/${id}: hue follows tokens`, h.height, s.height);
                assert(`${mode}/${id}: gradient scales with selector`, selector.querySelector('.p-colorpicker-color').getBoundingClientRect().height, s.height);
                assert(`${mode}/${id}: gap follows tokens`, h.x - s.right, staticTheme ? 8 : 16);
                assert(`${mode}/${id}: panel consumes local background`, getComputedStyle(panel).backgroundColor, staticTheme ? (document.documentElement.dataset.testGroup === 'dark' ? 'rgb(24, 24, 27)' : 'rgb(255, 255, 255)') : 'rgb(17, 34, 51)');
                assert(`${mode}/${id}: mode preserves portal location`, panel.parentElement === document.body, !inline);
                flushSync(() => updates[id](initial[format]));
                pointer(hue, 0.5, 0.5);
                await wait();
                pointer(selector, 0.5, 0.5);
                await wait();
                assert(`${mode}/${id}: picked format value matches dimensions`, JSON.stringify(values[id]), JSON.stringify(format === 'hex' ? '408080' : format === 'rgb' ? { r: 64, g: 128, b: 128 } : { h: 180, s: 50, b: 50 }));
                const handle = selector.querySelector('.p-colorpicker-color-handle');

                assert(
                    `${mode}/${id}: selection handles retain percentage positions`,
                    handle.style.left.endsWith('%') && handle.style.top.endsWith('%') && Math.abs(parseFloat(handle.style.left) - 50) < 1 && Math.abs(parseFloat(handle.style.top) - 50) < 1,
                    true
                );

                if (!inline) {
                    assert(`${mode}/${id}: preview reflects selected color`, getComputedStyle(inputs[id].current).backgroundColor, 'rgb(64, 128, 128)');
                    assert(`${mode}/${id}: public input ref is preserved`, api.getInput() === inputs[id].current, true);
                }

                flushSync(() => updates[id](blue[format]));
                await wait();
                assert(`${mode}/${id}: external value updates gradient`, getComputedStyle(selector).backgroundColor, 'rgb(0, 0, 255)');
                assert(`${mode}/${id}: external value updates handle`, selector.querySelector('.p-colorpicker-color-handle').style.left, '100%');

                if (!inline) {
                    assert(`${mode}/${id}: external value updates preview`, getComputedStyle(inputs[id].current).backgroundColor, 'rgb(0, 0, 255)');
                    inputs[id].current.click();
                    await wait();
                    assert(`${mode}/${id}: close removes overlay`, document.querySelector('.p-colorpicker-overlay-panel'), null);
                }
            }
        }
    }

    const disabled = document.getElementById('hex-inline-disabled').querySelector('.p-colorpicker-color-selector');

    pointer(disabled, 0.5, 0.5);
    await wait();
    assert('disabled inline preserves selected value', values['hex-inline-disabled'], 'ff0000');

    if (!staticTheme) {
        render(240, 120);
        await wait();
        const selector = document.getElementById('hex-inline').querySelector('.p-colorpicker-color-selector');

        assert('runtime token width replacement reaches selector', selector.getBoundingClientRect().width, 240);
        assert('runtime token height replacement reaches gradient', selector.querySelector('.p-colorpicker-color').getBoundingClientRect().height, 120);
        assert('percentage selection handle follows resized selector', selector.querySelector('.p-colorpicker-color-handle').getBoundingClientRect().x - selector.getBoundingClientRect().x + 5, 240);
    }

    flushSync(() => root.unmount());
    assert('StrictMode removes owned theme styles', document.querySelectorAll('style[data-mantle-theme]').length, 0);
    assert('unmount removes ColorPicker portals', document.querySelectorAll('.p-colorpicker-panel').length, 0);
};

run()
    .then(() => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: true, assertions });
    })
    .catch((error) => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, error: error.message, assertions });
    });
