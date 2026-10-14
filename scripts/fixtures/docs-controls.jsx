import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { MantleProvider } from '../../components/lib/api/Api';
import { AutoComplete } from '../../components/lib/autocomplete/AutoComplete';
import { Button } from '../../components/lib/button/Button';
import { Calendar } from '../../components/lib/calendar/Calendar';
import { CascadeSelect } from '../../components/lib/cascadeselect/CascadeSelect';
import { Checkbox } from '../../components/lib/checkbox/Checkbox';
import { Aura } from '../../components/lib/themes/themes';

const assertions = [];
const root = createRoot(document.getElementById('app'));
const staticTheme = document.documentElement.dataset.staticTheme === 'true';
const staticFocus = document.documentElement.dataset.testGroup === 'dark' ? 'rgb(52, 211, 153)' : 'rgb(16, 185, 129)';

const noop = () => {};

const settle = () => new Promise((resolve) => setTimeout(resolve, 60));
const find = (selector) => document.querySelector(selector);
const style = (selector) => getComputedStyle(find(selector));
const api = React.createRef();
const input = React.createRef();
const calendarApi = React.createRef();
const calendarInput = React.createRef();
const dt = staticTheme
    ? undefined
    : {
          root: { disabledOpacity: '0.4', invalidBorderColor: '#bb0000' },
          input: { focusBorderColor: '#123456', focusShadow: '0 0 0 2px #123456', borderRadius: '8px' },
          multipleContainer: { focusBorderColor: '#654321', focusShadow: '0 0 0 2px #654321', borderRadius: '10px' }
      };

const assert = (name, actual, expected) => {
    assertions.push({ name, actual, expected, passed: actual === expected });
    document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, phase: name, assertions });

    if (actual !== expected) {
        throw new Error(`${name}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
    }
};

const icon = (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <path d="M4 6l4 4 4-4" />
    </svg>
);
const errorTokens = staticTheme ? undefined : { root: { invalidBorderColor: '#bb0000', invalidCheckedBackground: '#bb0000', invalidCheckedHoverBackground: '#aa0000', invalidHoverBorderColor: '#aa0000', invalidFocusColor: '#bb0000' } };
const cascadeTokens = staticTheme ? undefined : { panel: { background: '#112233' } };
const cascadeOptions = [{ name: 'Country', states: [{ name: 'State', cities: [{ label: 'City' }] }] }];
const subjects = (
    <>
        <style>{'* { box-sizing: border-box; } .docs-control-row { display: flex; gap: 12px; margin: 20px; align-items: flex-start; }'}</style>
        <div className="docs-control-row">
            <AutoComplete id="single" ref={api} inputRef={input} value="" dropdown dt={dt} onChange={noop} />
            <AutoComplete id="multiple" value={['One']} multiple dropdown dt={dt} onChange={noop} />
            <AutoComplete id="invalid" value="" dropdown invalid dt={dt} onChange={noop} />
            <AutoComplete id="invalid-multiple" value={['One']} multiple dropdown invalid dt={dt} onChange={noop} />
        </div>
        <div className="docs-control-row">
            <AutoComplete id="disabled" value="" dropdown disabled dt={dt} onChange={noop} />
            <AutoComplete id="disabled-multiple" value={['One']} multiple dropdown disabled dt={dt} onChange={noop} />
            <Calendar id="disabled-calendar" value={null} showIcon disabled onChange={noop} />
            <Calendar id="calendar-left" ref={calendarApi} inputRef={calendarInput} value={null} showIcon iconPos="left" dt={staticTheme ? undefined : { input: dt.input }} onChange={noop} />
            <Button id="only-icon" icon={icon} aria-label="Choose" />
            <Button id="labelled" icon={icon} label="Choose" />
        </div>
        <div className="docs-control-row">
            <Calendar id="calendar-error" value={null} showIcon invalid onChange={noop} />
            <Checkbox id="error-off" checked={false} invalid dt={errorTokens} onChange={noop} />
            <Checkbox id="error-on" checked invalid dt={errorTokens} onChange={noop} />
            <Checkbox id="error-disabled" checked invalid disabled dt={errorTokens} onChange={noop} />
            <Checkbox id="valid-on" checked onChange={noop} />
            <CascadeSelect id="docs-cascade" value={null} options={cascadeOptions} optionLabel="label" optionGroupLabel="name" optionGroupChildren={['states', 'cities']} dt={cascadeTokens} onChange={noop} />
        </div>
    </>
);

const run = async () => {
    const value = staticTheme ? {} : { theme: { preset: Aura, options: { prefix: 'docs-check', darkModeSelector: '.app-dark' } } };

    flushSync(() =>
        root.render(
            <React.StrictMode>
                <MantleProvider value={value}>{subjects}</MantleProvider>
            </React.StrictMode>
        )
    );
    await settle();

    for (const mode of staticTheme ? ['static'] : ['light', 'dark']) {
        document.getElementById('app').classList.toggle('app-dark', mode === 'dark');
        input.current.focus();
        await settle();
        assert(`${mode}/single: input ref is preserved`, api.current.getInput() === input.current, true);
        assert(`${mode}/single: wrapper has field border`, style('#single').borderTopWidth, '1px');
        assert(`${mode}/single: wrapper focus uses input tokens`, style('#single').borderTopColor, staticTheme ? staticFocus : 'rgb(18, 52, 86)');
        assert(`${mode}/single: wrapper holds focus ring`, style('#single').boxShadow.includes(staticTheme ? staticFocus : 'rgb(18, 52, 86)'), true);
        assert(`${mode}/single: input has no inner focus ring`, style('#single input').boxShadow, 'none');
        assert(`${mode}/single: input has no inner border`, style('#single input').borderTopWidth, '0px');
        find('#single button').focus();
        await settle();
        assert(`${mode}/single: trigger focus keeps wrapper ring`, style('#single').boxShadow !== 'none', true);
        find('#multiple input').focus();
        await settle();
        assert(`${mode}/multiple: own field tokens reach wrapper`, style('#multiple').borderTopColor, staticTheme ? staticFocus : 'rgb(101, 67, 33)');
        assert(`${mode}/multiple: own radius reaches wrapper`, style('#multiple').borderTopLeftRadius, staticTheme ? '6px' : '10px');
        assert(`${mode}/multiple: inner list has no focus border`, style('#multiple ul').borderTopWidth, '0px');
        assert(`${mode}/multiple: inner list has no focus ring`, style('#multiple ul').boxShadow, 'none');

        for (const id of ['invalid', 'invalid-multiple']) {
            find(`#${id} input`).focus();
            await settle();
            assert(`${mode}/${id}: invalid wrapper border survives focus`, style(`#${id}`).borderTopColor, staticTheme ? 'rgb(239, 68, 68)' : 'rgb(187, 0, 0)');
            assert(`${mode}/${id}: invalid focus uses matching color`, style(`#${id}`).boxShadow.includes(staticTheme ? 'rgb(239, 68, 68)' : 'rgb(187, 0, 0)'), true);
        }

        for (const id of ['disabled', 'disabled-multiple']) {
            assert(`${mode}/${id}: whole control dims once`, style(`#${id}`).opacity, staticTheme ? '0.6' : '0.4');
            assert(`${mode}/${id}: input remains natively disabled`, find(`#${id} input`).disabled, true);
            assert(`${mode}/${id}: trigger remains natively disabled`, find(`#${id} button`).disabled, true);
            assert(`${mode}/${id}: trigger is not dimmed twice`, style(`#${id} button`).opacity, '1');
            const disabledField = id.endsWith('multiple') ? 'ul' : 'input';

            assert(`${mode}/${id}: field is not dimmed twice`, style(`#${id} ${disabledField}`).opacity, '1');
            assert(`${mode}/${id}: no focus ring`, style(`#${id}`).boxShadow, 'none');
        }

        assert(`${mode}/calendar: disabled trigger stays disabled`, find('#disabled-calendar button').disabled, true);
        assert(`${mode}/calendar: parent dims once`, style('#disabled-calendar').opacity, '0.6');
        assert(`${mode}/calendar: trigger is not dimmed twice`, style('#disabled-calendar button').opacity, '1');
        assert(`${mode}/calendar right: input keeps square inner corners`, style('#disabled-calendar input').borderTopRightRadius, '0px');
        assert(`${mode}/calendar right: trigger keeps square inner corners`, style('#disabled-calendar button').borderTopLeftRadius, '0px');
        assert(`${mode}/calendar left: input keeps square inner corners`, style('#calendar-left input').borderTopLeftRadius, '0px');
        assert(`${mode}/calendar left: trigger keeps square inner corners`, style('#calendar-left button').borderTopRightRadius, '0px');
        calendarInput.current.focus();
        await settle();
        assert(`${mode}/calendar: input ref is preserved`, calendarApi.current.getInput() === calendarInput.current, true);
        assert(`${mode}/calendar: compound border consumes local field tokens`, style('#calendar-left').borderTopColor, staticTheme ? staticFocus : 'rgb(18, 52, 86)');
        assert(`${mode}/calendar: outer focus ring consumes local field tokens`, style('#calendar-left').boxShadow.includes(staticTheme ? staticFocus : 'rgb(18, 52, 86)'), true);
        assert(`${mode}/calendar: input has no inner ring`, style('#calendar-left input').boxShadow, 'none');
        find('#calendar-left button').focus();
        assert(`${mode}/calendar: trigger focus keeps compound ring`, style('#calendar-left').boxShadow !== 'none', true);
        flushSync(() => calendarApi.current.hide());
        find('#calendar-error input').focus();
        await settle();
        assert(`${mode}/calendar: invalid compound border wins focus`, style('#calendar-error').borderTopColor, 'rgb(239, 68, 68)');
        assert(`${mode}/calendar: invalid compound ring matches border`, style('#calendar-error').boxShadow.includes('rgb(239, 68, 68)'), true);

        const error = staticTheme ? 'rgb(239, 68, 68)' : 'rgb(187, 0, 0)';
        const errorHover = staticTheme ? 'rgb(220, 38, 38)' : 'rgb(170, 0, 0)';

        assert(`${mode}/checkbox: unchecked invalid border consumes local error token`, style('#error-off .p-checkbox-box').borderTopColor, error);
        assert(`${mode}/checkbox: checked invalid fill consumes local error token`, style('#error-on .p-checkbox-box').backgroundColor, error);
        assert(`${mode}/checkbox: disabled checked invalid keeps error fill`, style('#error-disabled .p-checkbox-box').backgroundColor, error);
        assert(`${mode}/checkbox: valid sibling keeps primary fill`, style('#valid-on .p-checkbox-box').backgroundColor, staticTheme ? staticFocus : mode === 'dark' ? 'rgb(52, 211, 153)' : 'rgb(16, 185, 129)');
        await fetch('/pseudo', { method: 'POST', body: JSON.stringify({ selector: '#error-off input', classes: ['hover'] }) });
        await settle();
        assert(`${mode}/checkbox: unchecked invalid hover consumes local error token`, style('#error-off .p-checkbox-box').borderTopColor, errorHover);
        await fetch('/pseudo', { method: 'POST', body: JSON.stringify({ selector: '#error-off input', classes: ['hover', 'focus-visible'] }) });
        await settle();
        assert(`${mode}/checkbox: unchecked invalid focus consumes local error token`, style('#error-off .p-checkbox-box').outlineColor, error);
        await fetch('/pseudo', { method: 'POST', body: JSON.stringify({ selector: '#error-off input', classes: [] }) });
        await fetch('/pseudo', { method: 'POST', body: JSON.stringify({ selector: '#error-on input', classes: ['hover'] }) });
        await settle();
        assert(`${mode}/checkbox: invalid checked hover consumes local error token`, style('#error-on .p-checkbox-box').backgroundColor, errorHover);
        await fetch('/pseudo', { method: 'POST', body: JSON.stringify({ selector: '#error-on input', classes: ['hover', 'focus-visible'] }) });
        await settle();
        assert(`${mode}/checkbox: invalid focus outline consumes local error token`, style('#error-on .p-checkbox-box').outlineColor, error);
        await fetch('/pseudo', { method: 'POST', body: JSON.stringify({ selector: '#error-on input', classes: [] }) });
        flushSync(() => find('#docs-cascade').click());
        await settle();
        const overlay = find('div.p-cascadeselect-panel');
        const cascadeBackground = staticTheme ? (document.documentElement.dataset.testGroup === 'dark' ? 'rgb(24, 24, 27)' : 'rgb(255, 255, 255)') : 'rgb(17, 34, 51)';

        assert(`${mode}/cascade: portal consumes local panel token`, getComputedStyle(overlay).backgroundColor, cascadeBackground);
        flushSync(() => overlay.querySelector('.p-cascadeselect-item-content').click());
        await settle();
        assert(`${mode}/cascade: submenu consumes same local panel token`, getComputedStyle(overlay.querySelector('.p-cascadeselect-item-active .p-cascadeselect-sublist')).backgroundColor, cascadeBackground);
        assert(`${mode}/cascade: list item does not paint a legacy selection`, getComputedStyle(overlay.querySelector('li.p-highlight')).backgroundColor, 'rgba(0, 0, 0, 0)');
        flushSync(() => overlay.querySelector('.p-cascadeselect-item-active .p-cascadeselect-sublist .p-cascadeselect-item-content').click());
        await settle();
        flushSync(() => overlay.querySelector('.p-cascadeselect-item-active .p-cascadeselect-item-active .p-cascadeselect-sublist .p-cascadeselect-item-content').click());
        await new Promise((resolve) => setTimeout(resolve, 180));
        assert(`${mode}/cascade: leaf selection closes actual popup`, !!find('div.p-cascadeselect-panel'), false);
        assert(`${mode}/button: icon-only label leaves flex layout`, style('#only-icon .p-button-label').display, 'none');
        assert(`${mode}/button: labelled button keeps text visible`, style('#labelled .p-button-label').display !== 'none', true);
        const button = find('#only-icon').getBoundingClientRect();
        const arrow = find('#only-icon svg').getBoundingClientRect();

        assert(`${mode}/button: icon stays horizontally centered`, Math.abs(arrow.x + arrow.width / 2 - button.x - button.width / 2) < 0.6, true);
    }

    flushSync(() => root.unmount());
    assert('StrictMode cleanup removes component and provider sheets', document.querySelectorAll('style[data-mantle-theme]').length, 0);
};

run()
    .then(() => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: true, assertions });
    })
    .catch((error) => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, error: error.message, assertions });
    });
