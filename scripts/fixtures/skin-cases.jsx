import * as React from 'react';
import { advancedSkinCases } from './advanced-skin-cases';
import { suiteSkinCases } from './suite-skin-cases';
import { stateSkinCases } from './state-skin-cases';
import { AutoComplete } from '../../components/lib/autocomplete/AutoComplete';
import { Button } from '../../components/lib/button/Button';
import { Calendar } from '../../components/lib/calendar/Calendar';
import { CascadeSelect } from '../../components/lib/cascadeselect/CascadeSelect';
import { Checkbox } from '../../components/lib/checkbox/Checkbox';
import { Chips } from '../../components/lib/chips/Chips';
import { ColorPicker } from '../../components/lib/colorpicker/ColorPicker';
import { Dropdown } from '../../components/lib/dropdown/Dropdown';
import { Editor } from '../../components/lib/editor/Editor';
import { FileUpload } from '../../components/lib/fileupload/FileUpload';
import { FloatLabel } from '../../components/lib/floatlabel/FloatLabel';
import { IconField } from '../../components/lib/iconfield/IconField';
import { InputIcon } from '../../components/lib/inputicon/InputIcon';
import { InputMask } from '../../components/lib/inputmask/InputMask';
import { InputNumber } from '../../components/lib/inputnumber/InputNumber';
import { InputOtp } from '../../components/lib/inputotp/InputOtp';
import { InputSwitch } from '../../components/lib/inputswitch/InputSwitch';
import { InputText } from '../../components/lib/inputtext/InputText';
import { InputTextarea } from '../../components/lib/inputtextarea/InputTextarea';
import { Knob } from '../../components/lib/knob/Knob';
import { ListBox } from '../../components/lib/listbox/ListBox';
import { Mention } from '../../components/lib/mention/Mention';
import { MultiSelect } from '../../components/lib/multiselect/MultiSelect';
import { MultiStateCheckbox } from '../../components/lib/multistatecheckbox/MultiStateCheckbox';
import { Password } from '../../components/lib/password/Password';
import { RadioButton } from '../../components/lib/radiobutton/RadioButton';
import { Rating } from '../../components/lib/rating/Rating';
import { SelectButton } from '../../components/lib/selectbutton/SelectButton';
import { Slider } from '../../components/lib/slider/Slider';
import { SplitButton } from '../../components/lib/splitbutton/SplitButton';
import { ToggleButton } from '../../components/lib/togglebutton/ToggleButton';
import { TreeSelect } from '../../components/lib/treeselect/TreeSelect';
import { TriStateCheckbox } from '../../components/lib/tristatecheckbox/TriStateCheckbox';

const options = ['One', 'Two'];

const onChange = () => {};

const field = (name, Component, selector, path, props = {}) => ({ name, Component, selector, path, props: { onChange, ...props }, property: 'backgroundColor' });
const border = (name, Component, selector, path, props = {}, focus) => ({ ...field(name, Component, selector, path, props), property: 'borderTopColor', focus });

// Each case overrides a consumed component token and measures the actual part.
// State cases use public props/native focus; no fake state classes are added.
export const skinCases = [
    ...advancedSkinCases,
    ...stateSkinCases,
    ...suiteSkinCases,
    field('inputtext', InputText, '.p-inputtext', 'inputtext.root.background'),
    field('inputtext-filled', InputText, '.p-inputtext', 'inputtext.root.filledBackground', { variant: 'filled' }),
    border('inputtext-focus', InputText, '.p-inputtext', 'inputtext.root.focusBorderColor', {}, '.p-inputtext'),
    border('inputtext-invalid-focus', InputText, '.p-inputtext', 'inputtext.root.invalidBorderColor', { invalid: true }, '.p-inputtext'),
    { ...field('inputtext-disabled', InputText, '.p-inputtext', 'inputtext.root.disabledOpacity', { disabled: true }), property: 'opacity', value: '0.31', updated: '0.47' },
    field('inputmask', InputMask, '.p-inputmask', 'inputmask.root.background', { mask: '99-99' }),
    border('inputmask-invalid', InputMask, '.p-inputmask', 'inputmask.root.invalidBorderColor', { mask: '99', invalid: true }, '.p-inputmask'),
    field('inputnumber', InputNumber, '.p-inputnumber-input', 'inputnumber.input.background', { value: 1, showButtons: true }),
    field('inputnumber-button', InputNumber, '.p-inputnumber-button-up', 'inputnumber.button.background', { value: 1, showButtons: true }),
    border('inputnumber-invalid', InputNumber, '.p-inputnumber-input', 'inputnumber.input.invalidBorderColor', { value: 1, invalid: true }, '.p-inputnumber-input'),
    field('inputtextarea', InputTextarea, '.p-inputtextarea', 'inputtextarea.root.background'),
    field('inputotp', InputOtp, '.p-inputotp-input', 'inputotp.input.background', { value: '12' }),
    border('inputotp-focus', InputOtp, '.p-inputotp-input', 'inputotp.input.focusBorderColor', {}, '.p-inputotp-input'),
    field('password', Password, '.p-password-input', 'password.input.background', { feedback: false, toggleMask: true }),
    field('autocomplete', AutoComplete, '.p-autocomplete-input', 'autocomplete.input.background', { value: '', suggestions: options }),
    field('autocomplete-token', AutoComplete, '.p-autocomplete-token', 'autocomplete.token.background', { multiple: true, value: ['One'], suggestions: options }),
    field('chips', Chips, '.p-chips-multiple-container', 'chips.multipleContainer.background', { value: ['One'] }),
    field('chips-token', Chips, '.p-chips-token', 'chips.token.background', { value: ['One'] }),
    field('mention', Mention, '.p-mention-input', 'mention.input.background', { suggestions: options }),
    field('dropdown', Dropdown, '.p-dropdown', 'dropdown.root.background', { options }),
    field('multiselect', MultiSelect, '.p-multiselect', 'multiselect.root.background', { options }),
    border('multiselect-invalid', MultiSelect, '.p-multiselect', 'multiselect.root.invalidBorderColor', { options, invalid: true }, 'input'),
    field('listbox-selected', ListBox, '.p-listbox-item.p-highlight', 'listbox.option.selectedBackground', { options, value: 'One' }),
    field('treeselect', TreeSelect, '.p-treeselect', 'treeselect.root.background', { options: [{ key: '1', label: 'One' }] }),
    field('cascadeselect', CascadeSelect, '.p-cascadeselect', 'cascadeselect.root.background', { options: [{ label: 'One' }], optionLabel: 'label', optionGroupLabel: 'label', optionGroupChildren: ['children'] }),
    field('slider-range', Slider, '.p-slider-range', 'slider.range.background', { value: 25 }),
    { ...field('slider-focus', Slider, '.p-slider-handle', 'slider.handle.focusRing.color', { value: 25 }), property: 'outlineColor', focus: '.p-slider-handle' },
    { ...field('rating-selected', Rating, '.p-rating-item-active .p-rating-icon', 'rating.icon.activeColor', { value: 2 }), property: 'color' },
    { ...field('knob-value', Knob, '.p-knob-value', 'knob.value.color', { value: 25 }), property: 'stroke' },
    field('tristatecheckbox', TriStateCheckbox, '.p-checkbox-box', 'tristatecheckbox.root.checkedBackground', { value: true }),
    field('multistatecheckbox', MultiStateCheckbox, '.p-checkbox-box', 'multistatecheckbox.root.checkedBackground', { value: 'one', options: [{ value: 'one', icon: 'pi pi-check' }], optionValue: 'value' }),
    field('checkbox-selected', Checkbox, '.p-checkbox-box', 'checkbox.root.checkedBackground', { checked: true }),
    border('checkbox-invalid-focus', Checkbox, '.p-checkbox-box', 'checkbox.root.invalidBorderColor', { checked: true, invalid: true }, 'input'),
    field('radiobutton-selected', RadioButton, '.p-radiobutton-box', 'radiobutton.root.checkedBackground', { checked: true }),
    field('inputswitch-selected', InputSwitch, '.p-inputswitch-slider', 'inputswitch.root.checkedBackground', { checked: true }),
    field('selectbutton-selected', SelectButton, '.p-button.p-highlight', 'selectButton.button.selectedBackground', { options, value: 'One' }),
    field('togglebutton-selected', ToggleButton, '.p-button', 'toggleButton.root.selectedBackground', { checked: true }),
    field('calendar-input', Calendar, '.p-inputtext', 'calendar.input.background', { value: new Date(2026, 9, 12) }),
    field('calendar-selected-day', Calendar, '.p-datepicker td > .p-highlight', 'calendar.day.selectedBackground', { value: new Date(2026, 9, 12), inline: true }),
    border('colorpicker-preview', ColorPicker, '.p-colorpicker-preview', 'colorpicker.preview.borderColor', { value: 'ff0000' }),
    field('fileupload-content', FileUpload, '.p-fileupload-content', 'fileupload.content.background', { name: 'files' }),
    field('editor-content', Editor, '.ql-container', 'editor.content.background'),
    field('button', Button, '.p-button', 'button.root.background', { label: 'Action' }),
    field('button-danger', Button, '.p-button', 'button.danger.background', { label: 'Delete', severity: 'danger' }),
    { ...field('button-focus', Button, '.p-button', 'button.root.focusColor', { label: 'Action' }), property: 'outlineColor', focus: '.p-button' },
    field('splitbutton', SplitButton, '.p-splitbutton-defaultbutton', 'splitbutton.button.background', { label: 'Action', model: [{ label: 'One' }] }),
    {
        name: 'floatlabel',
        render: () => (
            <FloatLabel>
                <InputText id="float-input" />
                <label htmlFor="float-input">Name</label>
            </FloatLabel>
        ),
        selector: 'label',
        path: 'floatlabel.label.activeColor',
        property: 'color',
        focus: 'input'
    },
    {
        name: 'iconfield',
        render: () => (
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText />
            </IconField>
        ),
        selector: '.p-inputtext',
        path: 'iconfield.root.inputPadding',
        property: 'paddingLeft',
        value: '37px',
        updated: '43px'
    },
    {
        name: 'inputicon',
        render: () => (
            <IconField>
                <InputIcon className="pi pi-search" />
                <InputText />
            </IconField>
        ),
        selector: '.p-input-icon',
        path: 'inputicon.root.color',
        property: 'color'
    }
];

export const componentOverrides = (cases, updated = false) => {
    const components = {};

    cases.forEach(({ path, value = '#102030', updated: replacement = '#405060' }) => {
        const parts = path.split('.');
        const last = parts.pop();
        const group = parts.reduce((object, key) => (object[key] ||= {}), components);

        group[last] = updated ? replacement : value;
    });

    return { components };
};

export const SkinSubjects = ({ cases = skinCases }) =>
    cases.map((testCase) => {
        const Component = testCase.Component;

        return (
            <section key={testCase.name} data-skin-case={testCase.name}>
                {testCase.render ? testCase.render() : <Component {...testCase.props} />}
            </section>
        );
    });
