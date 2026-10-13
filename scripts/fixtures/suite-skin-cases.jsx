import * as React from 'react';
import { Accordion, AccordionTab } from '../../components/lib/accordion/Accordion';
import { Avatar } from '../../components/lib/avatar/Avatar';
import { AvatarGroup } from '../../components/lib/avatargroup/AvatarGroup';
import { Badge } from '../../components/lib/badge/Badge';
import { BreadCrumb } from '../../components/lib/breadcrumb/BreadCrumb';
import { Card } from '../../components/lib/card/Card';
import { Carousel } from '../../components/lib/carousel/Carousel';
import { Chip } from '../../components/lib/chip/Chip';
import { Column } from '../../components/lib/column/Column';
import { DataScroller } from '../../components/lib/datascroller/DataScroller';
import { DataTable } from '../../components/lib/datatable/DataTable';
import { DataView } from '../../components/lib/dataview/DataView';
import { Divider } from '../../components/lib/divider/Divider';
import { Dock } from '../../components/lib/dock/Dock';
import { Fieldset } from '../../components/lib/fieldset/Fieldset';
import { Galleria } from '../../components/lib/galleria/Galleria';
import { Image } from '../../components/lib/image/Image';
import { Inplace, InplaceContent, InplaceDisplay } from '../../components/lib/inplace/Inplace';
import { MegaMenu } from '../../components/lib/megamenu/MegaMenu';
import { Menubar } from '../../components/lib/menubar/Menubar';
import { Message } from '../../components/lib/message/Message';
import { Messages } from '../../components/lib/messages/Messages';
import { OrderList } from '../../components/lib/orderlist/OrderList';
import { Paginator } from '../../components/lib/paginator/Paginator';
import { Panel } from '../../components/lib/panel/Panel';
import { PanelMenu } from '../../components/lib/panelmenu/PanelMenu';
import { PickList } from '../../components/lib/picklist/PickList';
import { ProgressBar } from '../../components/lib/progressbar/ProgressBar';
import { ProgressSpinner } from '../../components/lib/progressspinner/ProgressSpinner';
import { ScrollPanel } from '../../components/lib/scrollpanel/ScrollPanel';
import { Skeleton } from '../../components/lib/skeleton/Skeleton';
import { Splitter, SplitterPanel } from '../../components/lib/splitter/Splitter';
import { Steps } from '../../components/lib/steps/Steps';
import { TabMenu } from '../../components/lib/tabmenu/TabMenu';
import { TabPanel, TabView } from '../../components/lib/tabview/TabView';
import { Tag } from '../../components/lib/tag/Tag';
import { Terminal } from '../../components/lib/terminal/Terminal';
import { Timeline } from '../../components/lib/timeline/Timeline';
import { Toast } from '../../components/lib/toast/Toast';
import { Toolbar } from '../../components/lib/toolbar/Toolbar';
import { Tree } from '../../components/lib/tree/Tree';
import { TreeTable } from '../../components/lib/treetable/TreeTable';
import { VirtualScroller } from '../../components/lib/virtualscroller/VirtualScroller';

const field = (name, render, selector, path, property = 'backgroundColor') => ({ name, render, selector, path, property });
const rows = [
    { id: 'one', name: 'One' },
    { id: 'two', name: 'Two' }
];
const nodes = [{ key: 'one', label: 'One', data: { name: 'One' } }];
const model = [{ label: 'One' }, { label: 'Two' }];

const onChange = () => {};

const Notice = ({ Component }) => {
    const ref = React.useRef();

    React.useEffect(() => {
        ref.current.show({ severity: 'info', summary: 'Info', detail: 'Details', sticky: true });
    }, []);

    return <Component ref={ref} transitionOptions={{ timeout: 0 }} />;
};

export const suiteSkinCases = [
    field(
        'accordion-active',
        () => (
            <Accordion activeIndex={0}>
                <AccordionTab header="Header">Content</AccordionTab>
            </Accordion>
        ),
        '.p-accordion-header-link',
        'accordion.header.activeBackground'
    ),
    field('card', () => <Card title="Title">Content</Card>, '.p-card', 'card.root.background'),
    field('divider', () => <Divider>Label</Divider>, '.p-divider-content', 'divider.content.background'),
    field('fieldset', () => <Fieldset legend="Legend">Content</Fieldset>, '.p-fieldset-legend', 'fieldset.legend.background'),
    field('panel', () => <Panel header="Header">Content</Panel>, '.p-panel-header', 'panel.header.background'),
    field(
        'scrollpanel',
        () => (
            <ScrollPanel style={{ width: '150px', height: '100px' }}>
                <div style={{ height: '200px' }}>Content</div>
            </ScrollPanel>
        ),
        '.p-scrollpanel-bar',
        'scrollpanel.bar.background'
    ),
    field(
        'splitter',
        () => (
            <Splitter>
                <SplitterPanel>One</SplitterPanel>
                <SplitterPanel>Two</SplitterPanel>
            </Splitter>
        ),
        '.p-splitter-gutter',
        'splitter.gutter.background'
    ),
    field(
        'tabview-active',
        () => (
            <TabView>
                <TabPanel header="One">Content</TabPanel>
            </TabView>
        ),
        '.p-tabview-selected .p-tabview-nav-link',
        'tabview.header.selectedBackground'
    ),
    field('toolbar', () => <Toolbar start="Start" end="End" />, '.p-toolbar', 'toolbar.root.background'),
    field(
        'datatable-header',
        () => (
            <DataTable value={rows}>
                <Column field="name" header="Name" />
            </DataTable>
        ),
        'thead th',
        'datatable.columnHeader.background'
    ),
    field(
        'datatable-selected-row',
        () => (
            <DataTable value={rows} selectionMode="single" selection={rows[0]} onSelectionChange={onChange}>
                <Column field="name" header="Name" />
            </DataTable>
        ),
        'tbody .p-highlight',
        'datatable.row.selectedBackground'
    ),
    field('dataview', () => <DataView value={rows} itemTemplate={(row) => <span>{row.name}</span>} />, '.p-dataview-content', 'dataview.content.background'),
    field('datascroller', () => <DataScroller value={rows} rows={2} header="Header" itemTemplate={(row) => <span>{row.name}</span>} />, '.p-datascroller-header', 'datascroller.header.background'),
    field('tree-selected-node', () => <Tree value={nodes} selectionMode="single" selectionKeys="one" onSelectionChange={onChange} />, '.p-treenode-content.p-highlight', 'tree.node.selectedBackground'),
    field(
        'treetable-header',
        () => (
            <TreeTable value={nodes}>
                <Column field="name" header="Name" expander />
            </TreeTable>
        ),
        'thead th',
        'treetable.columnHeader.background'
    ),
    {
        ...field('orderlist-selected-item', () => <OrderList value={rows} itemTemplate={(row) => <span>{row.name}</span>} />, '.p-orderlist-item.p-highlight', 'orderlist.item.selectedBackground'),
        prepare: (container) => container.querySelector('.p-orderlist-item').click()
    },
    field('picklist-source', () => <PickList source={rows} target={[]} itemTemplate={(row) => <span>{row.name}</span>} />, '.p-picklist-source', 'picklist.source.listBackground'),
    field('paginator-selected-page', () => <Paginator rows={10} totalRecords={30} first={0} onPageChange={onChange} />, '.p-paginator-page.p-highlight', 'paginator.pageButton.selectedBackground'),
    field('virtualscroller', () => <VirtualScroller items={rows} itemSize={30} scrollHeight="100px" itemTemplate={(row) => <div>{row.name}</div>} />, '.p-virtualscroller', 'virtualscroller.root.background'),
    field('breadcrumb', () => <BreadCrumb model={model} />, '.p-breadcrumb', 'breadcrumb.root.background'),
    field('dock', () => <Dock model={[{ label: 'One', icon: () => <span>Icon</span> }]} />, '.p-dock-list-container', 'dock.container.background'),
    field('megamenu', () => <MegaMenu model={[{ label: 'One', items: [[{ label: 'Group', items: model }]] }]} />, '.p-megamenu', 'megamenu.root.background'),
    field('menubar', () => <Menubar model={model} />, '.p-menubar', 'menubar.root.background'),
    field('panelmenu', () => <PanelMenu model={[{ key: 'one', label: 'One', items: model }]} expandedKeys={{ one: true }} />, '.p-panelmenu-header-content', 'panelmenu.header.activeBackground'),
    field('steps-active', () => <Steps model={model} activeIndex={0} />, '.p-highlight .p-steps-number', 'steps.number.activeBackground'),
    field('tabmenu-active', () => <TabMenu model={model} activeIndex={0} />, '.p-highlight .p-menuitem-link', 'tabmenu.item.activeBackground'),
    field('badge', () => <Badge value="2" />, '.p-badge', 'badge.root.background'),
    field('chip', () => <Chip label="Label" removable />, '.p-chip', 'chip.root.background'),
    field('message-info', () => <Message severity="info" text="Info" />, '.p-inline-message', 'message.info.background'),
    field('messages-info', () => <Notice Component={Messages} />, '.p-message-info', 'messages.info.background'),
    field('toast-info', () => <Notice Component={Toast} />, '.p-toast-message-info', 'toast.info.background'),
    field('progressbar', () => <ProgressBar value={25} />, '.p-progressbar-value', 'progressbar.value.background'),
    field('progressspinner', () => <ProgressSpinner />, '.p-progress-spinner-circle', 'progressspinner.circle.color', 'stroke'),
    field('skeleton', () => <Skeleton />, '.p-skeleton', 'skeleton.root.background'),
    field('tag-success', () => <Tag value="Done" severity="success" />, '.p-tag', 'tag.success.background'),
    field('avatar', () => <Avatar label="A" />, '.p-avatar', 'avatar.root.background'),
    field(
        'avatargroup',
        () => (
            <AvatarGroup>
                <Avatar label="A" />
                <Avatar label="B" />
            </AvatarGroup>
        ),
        '.p-avatar',
        'avatargroup.avatar.borderColor',
        'borderTopColor'
    ),
    field('carousel-active', () => <Carousel value={rows} numVisible={1} numScroll={1} itemTemplate={(row) => <span>{row.name}</span>} />, '.p-carousel-indicator.p-highlight button', 'carousel.indicator.activeBackground'),
    field('galleria', () => <Galleria value={rows} item={(row) => <span>{row.name}</span>} thumbnail={(row) => <span>{row.name}</span>} />, '.p-galleria', 'galleria.root.background'),
    field('image-preview', () => <Image preview alt="Preview fixture" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />, '.p-image-preview-indicator', 'image.indicator.background'),
    field('timeline', () => <Timeline value={rows} content={(row) => row.name} />, '.p-timeline-event-marker', 'timeline.marker.background'),
    field(
        'inplace',
        () => (
            <Inplace>
                <InplaceDisplay>Display</InplaceDisplay>
                <InplaceContent>Content</InplaceContent>
            </Inplace>
        ),
        '.p-inplace-display',
        'inplace.display.background'
    ),
    field('terminal', () => <Terminal welcomeMessage="Hello" />, '.p-terminal', 'terminal.root.background')
].map((testCase, index) => ({ ...testCase, group: index < 9 ? 'containers' : index < 19 ? 'data' : index < 26 ? 'navigation' : index < 35 ? 'feedback' : 'media' }));
