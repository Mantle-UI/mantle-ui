import * as React from 'react';
import { MantleContext, MantleProvider } from '../../components/lib/api/Api';
import { AutoComplete } from '../../components/lib/autocomplete/AutoComplete';
import { BlockUI } from '../../components/lib/blockui/BlockUI';
import { Calendar } from '../../components/lib/calendar/Calendar';
import { CascadeSelect } from '../../components/lib/cascadeselect/CascadeSelect';
import { ColorPicker } from '../../components/lib/colorpicker/ColorPicker';
import { Column } from '../../components/lib/column/Column';
import { ConfirmDialog, confirmDialog } from '../../components/lib/confirmdialog/ConfirmDialog';
import { ConfirmPopup, confirmPopup } from '../../components/lib/confirmpopup/ConfirmPopup';
import { ContextMenu } from '../../components/lib/contextmenu/ContextMenu';
import { DataTable } from '../../components/lib/datatable/DataTable';
import { Dialog } from '../../components/lib/dialog/Dialog';
import { Galleria } from '../../components/lib/galleria/Galleria';
import { Image } from '../../components/lib/image/Image';
import { Menu } from '../../components/lib/menu/Menu';
import { MobileNav } from '../../components/lib/mobilenav/MobileNav';
import { MultiSelect } from '../../components/lib/multiselect/MultiSelect';
import { OverlayPanel } from '../../components/lib/overlaypanel/OverlayPanel';
import { Password } from '../../components/lib/password/Password';
import { Sidebar } from '../../components/lib/sidebar/Sidebar';
import { SlideMenu } from '../../components/lib/slidemenu/SlideMenu';
import { TieredMenu } from '../../components/lib/tieredmenu/TieredMenu';
import { Toast } from '../../components/lib/toast/Toast';
import { Tooltip } from '../../components/lib/tooltip/Tooltip';
import { TreeSelect } from '../../components/lib/treeselect/TreeSelect';
import { Aura, definePreset } from '../../components/lib/themes/themes';

export const overlayPreset = definePreset(Aura, {
    semantic: { colorScheme: { light: { overlay: { background: '#112233' } }, dark: { overlay: { background: '#223344' } } } }
});
export const sourceEvent = (target) => ({ target, currentTarget: target, pageX: 20, pageY: 20, clientX: 20, clientY: 20, stopPropagation: () => {}, preventDefault: () => {} });
const show = ({ api }) => api.current.show();
const showAtTarget = ({ api, target }) => api.current.show(sourceEvent(target));
const model = [{ label: 'One' }];
const query = (selector) => () => document.querySelector(selector);

export const overlayCases = [
    { name: 'dialog', Component: Dialog, props: { visible: true, header: 'Header', onHide: () => {} }, root: query('.p-dialog'), extraRoot: query('.p-dialog-mask'), consumesBackground: true },
    { name: 'autocomplete', Component: AutoComplete, props: { suggestions: ['One'] }, open: show, root: query('.p-autocomplete-panel'), consumesBackground: true },
    { name: 'multiselect', Component: MultiSelect, props: { options: ['One'] }, open: show, root: query('.p-multiselect-panel'), consumesBackground: true },
    { name: 'calendar', Component: Calendar, open: show, root: query('.p-datepicker'), consumesBackground: true },
    { name: 'calendar-touch', Component: Calendar, props: { touchUI: true }, open: show, root: query('.p-datepicker'), extraRoot: query('.p-datepicker-mask'), consumesBackground: true },
    { name: 'calendar-touch-self', Component: Calendar, props: { touchUI: true, appendTo: 'self' }, open: show, root: query('.p-datepicker'), extraRoot: query('.p-datepicker-mask'), consumesBackground: true, isSelf: true },
    { name: 'colorpicker', Component: ColorPicker, props: { value: 'ff0000' }, open: show, root: query('.p-colorpicker-panel') },
    { name: 'treeselect', Component: TreeSelect, props: { options: [{ key: 'one', label: 'One' }] }, open: show, root: query('.p-treeselect-panel') },
    {
        name: 'cascadeselect',
        Component: CascadeSelect,
        props: { options: [{ label: 'One' }], optionLabel: 'label', optionGroupLabel: 'label', optionGroupChildren: ['children'] },
        open: ({ api }) => api.current.getElement().click(),
        root: query('.p-cascadeselect-panel')
    },
    { name: 'password', Component: Password, open: ({ api }) => api.current.getInput().focus(), root: query('.p-password-panel') },
    { name: 'menu', Component: Menu, props: { popup: true, model }, open: showAtTarget, root: query('.p-menu'), imperative: true, consumesBackground: true },
    { name: 'tieredmenu', Component: TieredMenu, props: { popup: true, model }, open: showAtTarget, root: query('.p-tieredmenu'), imperative: true, consumesBackground: true },
    { name: 'slidemenu', Component: SlideMenu, props: { popup: true, model }, open: showAtTarget, root: query('.p-slidemenu'), imperative: true },
    { name: 'contextmenu', Component: ContextMenu, props: { model }, open: showAtTarget, root: query('.p-contextmenu'), imperative: true, consumesBackground: true },
    { name: 'overlaypanel', Component: OverlayPanel, open: showAtTarget, root: query('.p-overlaypanel'), imperative: true, consumesBackground: true },
    { name: 'tooltip', Component: Tooltip, props: { content: 'Hint' }, open: showAtTarget, root: query('.p-tooltip'), imperative: true },
    { name: 'sidebar', Component: Sidebar, props: { visible: true, onHide: () => {} }, root: query('.p-sidebar'), extraRoot: query('.p-sidebar-mask'), consumesBackground: true },
    { name: 'mobilenav', Component: MobileNav, props: { visible: true, model }, root: query('.p-mobilenav'), extraRoot: query('.p-mobilenav-mask'), consumesSurfaceBackground: true },
    { name: 'confirmdialog', Component: ConfirmDialog, props: { visible: true, message: 'Confirm?' }, root: query('.p-confirm-dialog'), consumesBackground: true },
    { name: 'confirmdialog-imperative', Component: ConfirmDialog, open: ({ target }) => confirmDialog({ target, message: 'Confirm?' }), root: query('.p-confirm-dialog'), imperative: true, consumesBackground: true },
    { name: 'confirmpopup', Component: ConfirmPopup, open: ({ target }) => confirmPopup({ target, message: 'Confirm?' }), root: query('.p-confirm-popup'), imperative: true },
    { name: 'toast', Component: Toast, props: { appendTo: () => document.body }, open: ({ api }) => api.current.show({ severity: 'info', summary: 'Info', sticky: true }), root: query('.p-toast') },
    { name: 'blockui', Component: BlockUI, props: { blocked: true, fullScreen: true }, root: query('.p-blockui-document') },
    { name: 'galleria', Component: Galleria, props: { fullScreen: true, visible: true, value: [{ item: 'One' }], item: () => <span>One</span>, thumbnail: () => <span>One</span> }, root: query('.p-galleria-mask') },
    { name: 'image', Component: Image, props: { preview: true, src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' }, open: show, root: query('.p-image-mask') },
    {
        name: 'columnfilter',
        Component: DataTable,
        props: { value: [{ name: 'One' }] },
        children: <Column field="name" header="Name" filter />,
        open: ({ api }) => api.current.getElement().querySelector('[data-pc-section="filtermenubutton"]').click(),
        root: query('.p-column-filter-overlay')
    },
    {
        name: 'dragselection',
        Component: DataTable,
        props: { value: [{ name: 'One' }], dragSelection: true, selectionMode: 'multiple', selection: [], onSelectionChange: () => {} },
        children: <Column field="name" header="Name" />,
        open: ({ api }) =>
            api.current
                .getElement()
                .querySelector('tbody tr')
                .dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 20, clientY: 20 })),
        root: query('.p-datatable-drag-selection-helper')
    }
];

const Controls = ({ capture }) => {
    const context = React.useContext(MantleContext);

    React.useEffect(() => {
        capture(context);
    }, [capture, context]);

    return null;
};

export const OverlayFixture = ({ testCase, api, capture, prefix = 'case', dark = true }) => {
    const Component = testCase.Component;
    const transitionProps = ['blockui', 'mobilenav', 'tooltip', 'image', 'columnfilter', 'dragselection'].includes(testCase.name) ? {} : { transitionOptions: { timeout: 0 } };
    const subject = (
        <Component ref={api} {...testCase.props} {...transitionProps}>
            {testCase.children}
        </Component>
    );

    return (
        <MantleProvider value={{ theme: { preset: overlayPreset, options: { prefix, darkModeSelector: '.app-dark' } } }}>
            <Controls capture={capture} />
            <section id="overlay-origin" className={dark ? 'app-dark' : ''}>
                <button id="overlay-trigger">Trigger</button>
                {!testCase.imperative && subject}
            </section>
            {testCase.imperative && subject}
        </MantleProvider>
    );
};
