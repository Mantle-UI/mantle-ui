import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { MantleProvider } from '../../components/lib/api/Api';
import { Dropdown } from '../../components/lib/dropdown/Dropdown';
import { FloatLabel } from '../../components/lib/floatlabel/FloatLabel';
import { Aura, definePreset } from '../../components/lib/themes/themes';

const root = createRoot(document.getElementById('app'));
const staticTheme = document.documentElement.dataset.staticTheme === 'true';
const assertions = [];
const variants = ['normal', 'floating', 'editable', 'invalid', 'editable-invalid', 'filled', 'disabled', 'clear'];
const sizes = [
    { name: 'small', padding: 8, className: 'p-inputtext-sm' },
    { name: 'default', padding: 12, className: '' },
    { name: 'large', padding: 16, className: 'p-inputtext-lg' }
];
const refs = Object.fromEntries(variants.map((name) => [name, React.createRef()]));
const wait = () => new Promise((resolve) => setTimeout(resolve, 220));
const heights = {};

const assert = (name, actual, expected) => {
    assertions.push({ name, actual, expected, passed: actual === expected });
    document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, phase: name, assertions });
    if (actual !== expected) throw new Error(`${name}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
};

const Case = ({ variant, size }) => {
    const [value, setValue] = React.useState(variant === 'clear' || variant === 'filled' ? 'One' : null);
    const control = (
        <Dropdown
            id={variant}
            inputId={`${variant}-input`}
            ref={refs[variant]}
            value={value}
            onChange={(event) => setValue(event.value)}
            options={['One', 'Two']}
            editable={variant.includes('editable')}
            invalid={variant.includes('invalid')}
            disabled={variant === 'disabled'}
            variant={variant === 'filled' ? 'filled' : 'outlined'}
            showClear={variant === 'clear'}
            className={staticTheme ? size.className : undefined}
            placeholder={variant === 'floating' ? undefined : 'Choose'}
            dt={staticTheme ? undefined : { root: { background: '#112233', borderColor: '#334455', focusBorderColor: '#00aa66', invalidBorderColor: '#bb0000', borderRadius: '10px' } }}
        />
    );

    return variant === 'floating' ? (
        <FloatLabel>
            {control}
            <label htmlFor={`${variant}-input`}>Choose</label>
        </FloatLabel>
    ) : (
        control
    );
};

const render = (size) => {
    const theme = staticTheme ? undefined : { preset: definePreset(Aura, { semantic: { formField: { paddingY: `${size.padding}px` } } }), options: { prefix: 'border-probe', darkModeSelector: '.app-dark' } };

    flushSync(() =>
        root.render(
            <React.StrictMode>
                <MantleProvider value={{ theme }}>
                    <style>{'*{box-sizing:border-box} #app{display:flex;flex-wrap:wrap;align-items:flex-start;gap:20px;padding:20px} .p-dropdown{width:240px}'}</style>
                    {variants.map((variant) => (
                        <Case key={variant} variant={variant} size={size} />
                    ))}
                </MantleProvider>
            </React.StrictMode>
        )
    );
};

const run = async () => {
    for (const mode of staticTheme ? ['static'] : ['light', 'dark']) {
        document.getElementById('app').classList.toggle('app-dark', mode === 'dark');

        for (const size of sizes) {
            render(size);
            await wait();

            for (const variant of variants) {
                const control = document.getElementById(variant);
                const label = control.querySelector('.p-dropdown-label');
                const input = control.querySelector('input');
                const outer = getComputedStyle(control);
                const inner = getComputedStyle(label);
                const name = `${mode}/${size.name}/${variant}`;

                assert(`${name}: border belongs to outer control`, outer.borderTopWidth, '1px');
                assert(`${name}: label has no inner border`, inner.borderTopWidth, '0px');
                assert(`${name}: label has no extra background`, inner.backgroundColor, 'rgba(0, 0, 0, 0)');
                assert(`${name}: label has no inner corner frame`, inner.borderTopLeftRadius, '0px');
                assert(`${name}: own outer radius is preserved`, outer.borderTopLeftRadius, staticTheme ? '6px' : '10px');
                assert(`${name}: field width is preserved`, control.getBoundingClientRect().width, 240);
                assert(`${name}: provider token padding or static padding is preserved`, inner.paddingTop, `${staticTheme ? 12 : size.padding}px`);
                if (staticTheme) assert(`${name}: size class font is preserved`, inner.fontSize, `${size.name === 'small' ? 14 : size.name === 'large' ? 20 : 16}px`);
                heights[`${mode}/${size.name}/${variant}`] = control.getBoundingClientRect().height;
                assert(`${name}: public root ref is preserved`, refs[variant].current.getElement() === control, true);

                if (variant === 'disabled') {
                    assert(`${name}: input remains disabled`, input.disabled, true);
                    assert(`${name}: disabled opacity applied once`, outer.opacity, '0.6');
                } else {
                    input.focus();
                    await wait();
                    const focus = getComputedStyle(control);
                    const expected = variant.includes('invalid')
                        ? staticTheme
                            ? 'rgb(239, 68, 68)'
                            : 'rgb(187, 0, 0)'
                        : staticTheme
                          ? document.documentElement.dataset.testGroup === 'dark'
                              ? 'rgb(52, 211, 153)'
                              : 'rgb(16, 185, 129)'
                          : 'rgb(0, 170, 102)';

                    assert(`${name}: focused border uses own valid/error token`, focus.borderTopColor, expected);
                    assert(`${name}: keyboard focus ring remains on root`, focus.boxShadow.includes(expected), true);
                    assert(`${name}: focused label has no inner ring`, getComputedStyle(label).boxShadow, 'none');
                    assert(`${name}: focused label has no inner border`, getComputedStyle(label).borderTopWidth, '0px');
                    input.blur();
                }
            }

            const floating = document.getElementById('floating');

            floating.click();
            await wait();
            document.querySelector('.p-dropdown-panel .p-dropdown-item').click();
            await wait();
            assert(`${mode}/${size.name}: selected floating label remains visible`, getComputedStyle(floating.querySelector('.p-dropdown-label')).visibility, 'visible');
            assert(`${mode}/${size.name}: selected floating label stays borderless`, getComputedStyle(floating.querySelector('.p-dropdown-label')).borderTopWidth, '0px');
            assert(`${mode}/${size.name}: menu selection works`, floating.querySelector('.p-dropdown-label').textContent, 'One');
        }

        assert(`${mode}: small/default/large maintain increasing field height`, heights[`${mode}/small/normal`] < heights[`${mode}/default/normal`] && heights[`${mode}/default/normal`] < heights[`${mode}/large/normal`], true);
    }

    flushSync(() => root.unmount());
    assert('StrictMode cleans owned styles', document.querySelectorAll('style[data-mantle-theme]').length, 0);
    assert('unmount removes Dropdown overlays', document.querySelectorAll('.p-dropdown-panel').length, 0);
};

run()
    .then(() => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: true, assertions });
    })
    .catch((error) => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, error: error.message, assertions });
    });
