import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { MantleProvider } from '../../components/lib/api/Api';
import { AutoComplete } from '../../components/lib/autocomplete/AutoComplete';
import { Calendar } from '../../components/lib/calendar/Calendar';
import { CascadeSelect } from '../../components/lib/cascadeselect/CascadeSelect';
import { Checkbox } from '../../components/lib/checkbox/Checkbox';
import { Chips } from '../../components/lib/chips/Chips';
import { Dropdown } from '../../components/lib/dropdown/Dropdown';
import { InputMask } from '../../components/lib/inputmask/InputMask';
import { InputNumber } from '../../components/lib/inputnumber/InputNumber';
import { InputSwitch } from '../../components/lib/inputswitch/InputSwitch';
import { InputText } from '../../components/lib/inputtext/InputText';
import { InputTextarea } from '../../components/lib/inputtextarea/InputTextarea';
import { MultiSelect } from '../../components/lib/multiselect/MultiSelect';
import { Password } from '../../components/lib/password/Password';
import { RadioButton } from '../../components/lib/radiobutton/RadioButton';
import { SelectButton } from '../../components/lib/selectbutton/SelectButton';
import { ToggleButton } from '../../components/lib/togglebutton/ToggleButton';
import { TreeSelect } from '../../components/lib/treeselect/TreeSelect';
import { TriStateCheckbox } from '../../components/lib/tristatecheckbox/TriStateCheckbox';
import { Aura, definePreset } from '../../components/lib/themes/themes';

const root = createRoot(document.getElementById('app'));
const staticTheme = document.documentElement.dataset.staticTheme === 'true';
const assertions = [];

const noop = () => {};

const wait = () => new Promise((resolve) => setTimeout(resolve, 90));

const assert = (name, actual, expected) => {
    assertions.push({ name, actual, expected, passed: actual === expected });
    document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, phase: name, assertions });
    if (actual !== expected) throw new Error(`${name}: expected ${expected}, got ${actual}`);
};

const cases = [
    { name: 'text', Component: InputText, part: '', target: '', props: { value: '' }, tokens: { root: { invalidBorderColor: '#ab1234', focusShadow: '0 0 0 2px #00aa66', focusBorderColor: '#00aa66' } } },
    { name: 'mask', Component: InputMask, part: '', target: '', props: { value: '', mask: '99/99' }, tokens: { root: { invalidBorderColor: '#ab1234' } } },
    { name: 'textarea', Component: InputTextarea, part: '', target: '', props: { value: '' }, tokens: { root: { invalidBorderColor: '#ab1234' } } },
    { name: 'number', Component: InputNumber, part: 'input', target: 'input', props: { value: null }, tokens: { root: { invalidBorderColor: '#ab1234' } } },
    { name: 'password', Component: Password, part: 'input', target: 'input', props: { value: '', feedback: false }, tokens: { input: { invalidBorderColor: '#ab1234' } } },
    { name: 'autocomplete', Component: AutoComplete, part: 'input', target: 'input', props: { value: '', suggestions: [] }, tokens: { root: { invalidBorderColor: '#ab1234' } } },
    { name: 'autocomplete-joined', Component: AutoComplete, part: '', target: 'input', props: { value: '', suggestions: [], dropdown: true }, tokens: { root: { invalidBorderColor: '#ab1234' } } },
    { name: 'chips', Component: Chips, part: 'ul', target: 'input', props: { value: [] }, tokens: { root: { invalidBorderColor: '#ab1234' } } },
    { name: 'dropdown', Component: Dropdown, part: '', target: 'input', props: { value: null, options: ['One'] }, tokens: { root: { invalidBorderColor: '#ab1234' } } },
    { name: 'multiselect', Component: MultiSelect, part: '', target: 'input', props: { value: [], options: ['One'] }, tokens: { root: { invalidBorderColor: '#ab1234' } } },
    { name: 'treeselect', Component: TreeSelect, part: '', target: 'input', props: { value: null, options: [] }, tokens: { root: { invalidBorderColor: '#ab1234' } } },
    { name: 'cascade', Component: CascadeSelect, part: '', target: 'input', props: { value: null, options: [] }, tokens: { root: { invalidBorderColor: '#ab1234' } } },
    { name: 'calendar', Component: Calendar, part: 'input', target: 'input', props: { value: null, showOnFocus: false }, tokens: { input: { invalidBorderColor: '#ab1234' } } },
    { name: 'calendar-joined', Component: Calendar, part: '', target: 'input', props: { value: null, showIcon: true, showOnFocus: false }, tokens: { input: { invalidBorderColor: '#ab1234' } } },
    { name: 'checkbox', Component: Checkbox, part: '.p-checkbox-box', target: 'input', props: { checked: true }, tokens: { root: { invalidBorderColor: '#ab1234', invalidFocusColor: '#ab1234' } } },
    { name: 'radio', Component: RadioButton, part: '.p-radiobutton-box', target: 'input', props: { checked: true }, tokens: { root: { invalidBorderColor: '#ab1234' } } },
    { name: 'switch', Component: InputSwitch, part: '.p-inputswitch-slider', target: 'input', props: { checked: true }, tokens: { root: { invalidBorderColor: '#ab1234' } } },
    { name: 'tristate', Component: TriStateCheckbox, part: '.p-checkbox-box', target: '.p-checkbox-box', props: { value: true }, tokens: { root: { invalidBorderColor: '#ab1234' } } },
    { name: 'selectbutton', Component: SelectButton, part: '[role="button"]', target: '[role="button"]', props: { value: 'One', options: ['One', 'Two'] }, tokens: { button: { invalidBorderColor: '#ab1234' } } },
    { name: 'toggle', Component: ToggleButton, part: '.p-button', target: 'input', props: { checked: true, onLabel: 'On', offLabel: 'Off' }, tokens: { root: { invalidBorderColor: '#ab1234' } } }
];

const pseudo = async (selector, classes) => {
    const response = await fetch('/pseudo', { method: 'POST', body: JSON.stringify({ selector, classes }) });

    if (!response.ok) throw new Error(await response.text());
    await wait();
};

const run = async () => {
    const theme = staticTheme ? undefined : { preset: definePreset(Aura, { semantic: { focusRing: { width: '2px' } } }), options: { prefix: 'error-probe', darkModeSelector: '.app-dark' } };
    const subjects = cases.flatMap(({ name, Component, props, tokens }) => [
        <Component key={name + '-error'} id={name + '-error'} {...props} invalid dt={staticTheme ? undefined : tokens} onChange={noop} />,
        <Component key={name + '-valid'} id={name + '-valid'} {...props} onChange={noop} />
    ]);

    flushSync(() =>
        root.render(
            <React.StrictMode>
                <MantleProvider value={{ theme }}>
                    <style>{'*{box-sizing:border-box} #app{display:flex;flex-direction:column;gap:8px;max-width:350px}'}</style>
                    {subjects}
                </MantleProvider>
            </React.StrictMode>
        )
    );
    await wait();

    for (const mode of staticTheme ? ['static'] : ['light', 'dark']) {
        document.getElementById('app').classList.toggle('app-dark', mode === 'dark');
        await wait();

        for (const test of cases) {
            for (const state of ['error', 'valid']) {
                const id = `#${test.name}-${state}`;
                const field = document.querySelector(id + (test.part ? ' ' + test.part : ''));
                const target = document.querySelector(id + (test.target ? ' ' + test.target : ''));

                if (!field || !target) throw new Error(`Missing focus target ${id}`);
                target.focus();
                await pseudo(id + (test.target ? ' ' + test.target : ''), ['focus', 'focus-visible']);
                const styles = getComputedStyle(field);
                const expected =
                    state === 'error'
                        ? staticTheme
                            ? 'rgb(239, 68, 68)'
                            : 'rgb(171, 18, 52)'
                        : staticTheme
                          ? document.documentElement.dataset.testGroup === 'dark'
                              ? 'rgb(52, 211, 153)'
                              : 'rgb(16, 185, 129)'
                          : mode === 'dark'
                            ? 'rgb(52, 211, 153)'
                            : 'rgb(16, 185, 129)';

                assert(`${mode}/${test.name}/${state}: focus border color`, styles.borderTopColor, expected);
                const shadow = styles.boxShadow !== 'none';
                const outlined = !['none', 'hidden'].includes(styles.outlineStyle) && parseFloat(styles.outlineWidth) > 0;

                assert(`${mode}/${test.name}/${state}: keyboard focus remains visible`, shadow || outlined, true);
                assert(`${mode}/${test.name}/${state}: focus uses coherent color`, shadow ? styles.boxShadow.includes(expected) : styles.outlineColor === expected, true);
                await pseudo(id + (test.target ? ' ' + test.target : ''), []);
                target.blur();
            }
        }
    }

    flushSync(() => root.unmount());
    assert('StrictMode cleanup removes owned theme sheets', document.querySelectorAll('style[data-mantle-theme]').length, 0);
};

run()
    .then(() => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: true, assertions });
    })
    .catch((error) => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, error: error.message, assertions });
    });
