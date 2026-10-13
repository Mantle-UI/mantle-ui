import * as React from 'react';
import { Accordion, AccordionTab } from '../../components/lib/accordion/Accordion';
import { Avatar } from '../../components/lib/avatar/Avatar';
import { Button } from '../../components/lib/button/Button';
import { Calendar } from '../../components/lib/calendar/Calendar';
import { Checkbox } from '../../components/lib/checkbox/Checkbox';
import { Column } from '../../components/lib/column/Column';
import { DataTable } from '../../components/lib/datatable/DataTable';
import { InputNumber } from '../../components/lib/inputnumber/InputNumber';
import { InputText } from '../../components/lib/inputtext/InputText';
import { ListBox } from '../../components/lib/listbox/ListBox';
import { Menubar } from '../../components/lib/menubar/Menubar';
import { Paginator } from '../../components/lib/paginator/Paginator';
import { Rating } from '../../components/lib/rating/Rating';
import { SelectButton } from '../../components/lib/selectbutton/SelectButton';
import { Slider } from '../../components/lib/slider/Slider';
import { Tree } from '../../components/lib/tree/Tree';

const field = (name, render, selector, path, pseudo = ['hover'], property = 'backgroundColor', pseudoSelector = selector) => ({ name, render, selector, path, pseudo, property, pseudoSelector, group: 'states' });

const noop = () => {};

// CDP forces Chromium's real pseudo states; native focus and selection are
// exercised separately. State classes are never fabricated by the fixture.
export const stateSkinCases = [
    field('button-hover', () => <Button label="Action" />, '.p-button', 'button.root.hoverBackground'),
    field('button-active', () => <Button label="Action" />, '.p-button', 'button.root.activeBackground', ['hover', 'active']),
    field('button-disabled-hover', () => <Button label="Action" disabled />, '.p-button', 'button.root.background'),
    field('inputtext-hover', () => <InputText />, '.p-inputtext', 'inputtext.root.hoverBorderColor', ['hover'], 'borderTopColor'),
    field('inputnumber-active', () => <InputNumber showButtons value={1} onValueChange={noop} />, '.p-inputnumber-button-up', 'inputnumber.button.activeBackground', ['hover', 'active']),
    field('checkbox-checked-hover', () => <Checkbox checked onChange={noop} />, '.p-checkbox-box', 'checkbox.root.checkedHoverBackground', ['hover'], 'backgroundColor', '.p-checkbox-input'),
    field('slider-range-hover', () => <Slider value={25} onChange={noop} />, '.p-slider-range', 'slider.range.hoverBackground', ['hover'], 'backgroundColor', '.p-slider'),
    field('slider-handle-active', () => <Slider value={25} onChange={noop} />, '.p-slider-handle', 'slider.handle.activeBackground', ['hover', 'active']),
    field('rating-selected-hover', () => <Rating value={2} onChange={noop} />, '.p-rating-item-active .p-rating-icon', 'rating.icon.activeHoverColor', ['hover'], 'color', '.p-rating-item-active'),
    field('selectbutton-selected-hover', () => <SelectButton options={['One', 'Two']} value="One" onChange={noop} />, '.p-button.p-highlight', 'selectButton.button.selectedHoverBackground'),
    field('listbox-selected-hover', () => <ListBox options={['One', 'Two']} value="One" onChange={noop} />, '.p-listbox-item.p-highlight', 'listbox.option.selectedHoverBackground'),
    field(
        'accordion-hover',
        () => (
            <Accordion>
                <AccordionTab header="One">Content</AccordionTab>
            </Accordion>
        ),
        '.p-accordion-header-link',
        'accordion.header.hoverBackground'
    ),
    field(
        'datatable-hover',
        () => (
            <DataTable value={[{ name: 'One' }]} selectionMode="single" onSelectionChange={noop}>
                <Column field="name" header="Name" />
            </DataTable>
        ),
        'tbody tr',
        'datatable.row.hoverBackground'
    ),
    field(
        'datatable-sorted-hover',
        () => (
            <DataTable value={[{ name: 'One' }]} sortField="name" sortOrder={1}>
                <Column field="name" header="Name" sortable />
            </DataTable>
        ),
        'thead th',
        'datatable.columnHeader.selectedHoverBackground'
    ),
    field('tree-hover', () => <Tree value={[{ key: 'one', label: 'One' }]} selectionMode="single" onSelectionChange={noop} />, '.p-treenode-content', 'tree.node.hoverBackground'),
    field('paginator-selected-hover', () => <Paginator first={0} rows={10} totalRecords={30} onPageChange={noop} />, '.p-paginator-page.p-highlight', 'paginator.pageButton.selectedHoverBackground'),
    field('menubar-hover', () => <Menubar model={[{ label: 'One' }]} />, '.p-menuitem-content', 'menubar.item.hoverBackground', ['hover'], 'backgroundColor', '.p-menuitem-link'),
    field('avatar-hover', () => <Avatar label="A" tabIndex={0} onClick={noop} />, '.p-avatar', 'avatar.root.hoverBackground'),
    field('calendar-day-hover', () => <Calendar inline value={new Date(2026, 9, 12)} onChange={noop} />, 'td > span:not(.p-highlight):not(.p-disabled)', 'calendar.day.hoverBackground')
];
