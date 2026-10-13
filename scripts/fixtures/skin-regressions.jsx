import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { MantleProvider } from '../../components/lib/api/Api';
import { Column } from '../../components/lib/column/Column';
import { ConfirmDialog } from '../../components/lib/confirmdialog/ConfirmDialog';
import { Dialog } from '../../components/lib/dialog/Dialog';
import { Galleria } from '../../components/lib/galleria/Galleria';
import { Menu } from '../../components/lib/menu/Menu';
import { Messages } from '../../components/lib/messages/Messages';
import { SlideMenu } from '../../components/lib/slidemenu/SlideMenu';
import { Stepper } from '../../components/lib/stepper/Stepper';
import { StepperPanel } from '../../components/lib/stepperpanel/StepperPanel';
import { Steps } from '../../components/lib/steps/Steps';
import { TabMenu } from '../../components/lib/tabmenu/TabMenu';
import { Toast } from '../../components/lib/toast/Toast';
import { TreeTable } from '../../components/lib/treetable/TreeTable';
import { Aura, definePreset } from '../../components/lib/themes/themes';

const assertions = [];
const root = createRoot(document.getElementById('app'));
const options = { prefix: 'regression', darkModeSelector: false };
const transparent = 'rgba(0, 0, 0, 0)';
const settle = (milliseconds = 25) => new Promise((resolve) => setTimeout(resolve, milliseconds));
let stageIndex = 0;

const publish = (phase) => {
    document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, phase, assertions });
};

const assert = (name, actual, expected) => {
    assertions.push({ name, actual, expected, passed: actual === expected });
    publish(name);
};

const find = (selector) => {
    const element = document.querySelector(selector);

    if (!element) {
        throw new Error(`Regression target missing: ${selector}`);
    }

    return element;
};

const waitFor = async (selector, timeout = 1500) => {
    const deadline = performance.now() + timeout;

    while (performance.now() < deadline) {
        const element = document.querySelector(selector);

        if (element) {
            return element;
        }

        await settle(10);
    }

    throw new Error(`Regression phase did not appear: ${selector}`);
};

const pseudo = async (selector, classes = [], pointer = false) => {
    const response = await fetch('/pseudo', { method: 'POST', body: JSON.stringify({ selector, classes, pointer }) });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    await settle();
};

const fixtureCss = `
.regression-stage { max-width: 360px; margin: 12px; }
#regression-parking { margin: 12px; }
.regression-exit .p-message-exit-active,
.regression-exit .p-toast-message-exit-active {
    transition: max-height 0.04s linear, opacity 0.04s linear, margin 0.04s linear !important;
}
#regression-galleria.p-galleria-enter-active {
    transition: opacity 0.04s linear, transform 0.04s linear !important;
}
`;

const mount = async (subject, components = {}) => {
    stageIndex += 1;

    flushSync(() =>
        root.render(
            <React.StrictMode>
                <MantleProvider key={stageIndex} value={{ theme: { preset: definePreset(Aura, { components }), options } }}>
                    <style>{fixtureCss}</style>
                    <button id="regression-parking">Move pointer away</button>
                    <section className="regression-stage">{subject}</section>
                </MantleProvider>
            </React.StrictMode>
        )
    );
    await settle();
};

const paintStates = {
    normal: { background: 'rgba(255, 0, 0, 0.25)', color: 'rgb(17, 34, 51)', icon: 'rgb(34, 51, 68)' },
    hover: { background: 'rgba(255, 0, 0, 0.4)', color: 'rgb(51, 68, 85)', icon: 'rgb(102, 119, 136)' },
    focus: { background: 'rgba(0, 255, 0, 0.5)', color: 'rgb(68, 85, 102)', icon: 'rgb(119, 136, 153)' },
    press: { background: 'rgba(0, 0, 255, 0.5)', color: 'rgb(85, 102, 119)', icon: 'rgb(136, 153, 170)' }
};

const menuTokens = (state) => ({
    root: { background: '#ffffff', color: '#000000' },
    item: {
        background: paintStates.normal.background,
        color: '#112233',
        hoverBackground: paintStates.hover.background,
        hoverColor: '#334455',
        // Pointer movement also sets Menu's real p-focus item metadata.
        focusBackground: state === 'hover' ? paintStates.hover.background : paintStates.focus.background,
        focusColor: state === 'hover' ? '#334455' : '#445566',
        activeBackground: paintStates.press.background,
        activeColor: '#556677',
        padding: '11px',
        gap: '5px'
    },
    icon: { color: '#223344', hoverColor: '#667788', focusColor: state === 'hover' ? '#667788' : '#778899', activeColor: '#8899aa' }
});

const menuTemplate = (item, templateOptions) => (
    <a href="#" className={templateOptions.className} tabIndex={templateOptions.tabIndex} onClick={templateOptions.onClick} onMouseMove={templateOptions.onMouseMove}>
        <span className={templateOptions.iconClassName} aria-hidden="true" />
        <span className={templateOptions.labelClassName}>{item.label}</span>
    </a>
);

const checkMenuPainting = async () => {
    for (const shape of ['wrapped', 'template']) {
        for (const state of Object.keys(paintStates)) {
            publish(`Menu ${shape} ${state}`);
            const model = [{ id: 'paint-item', label: 'Paint', icon: 'pi pi-star', ...(shape === 'template' ? { template: menuTemplate } : {}) }];

            await mount(<Menu id="regression-paint" model={model} />, { menu: menuTokens(state) });
            await pseudo('#regression-parking', [], true);
            const selector = '#regression-paint .p-menuitem-link';
            const action = find(selector);
            const wrapper = action.parentElement.classList.contains('p-menuitem-content') ? action.parentElement : null;

            if (state === 'hover' || state === 'press') {
                await pseudo(selector, [state === 'press' ? 'active' : 'hover'], true);
                assert(`Menu ${shape} ${state}: native pointer pseudo-state`, action.matches(state === 'press' ? ':active' : ':hover'), true);
            } else if (state === 'focus') {
                action.focus();
                await pseudo(selector, ['focus-visible']);
                assert(`Menu ${shape} focus: actual focus owner`, document.activeElement === action, true);
            }

            const expected = paintStates[state];
            const actionStyle = getComputedStyle(action);
            const painterStyle = getComputedStyle(wrapper || action);

            assert(`Menu ${shape} ${state}: actual action shape`, !!wrapper, shape === 'wrapped');
            assert(`Menu ${shape} ${state}: translucent background consumer`, painterStyle.backgroundColor, expected.background);
            assert(`Menu ${shape} ${state}: painted item layers`, [wrapper, action].filter((element) => element && getComputedStyle(element).backgroundColor !== transparent).length, 1);

            if (wrapper) {
                assert(`Menu wrapped ${state}: child action stays transparent`, actionStyle.backgroundColor, transparent);
            }

            assert(`Menu ${shape} ${state}: action text color`, actionStyle.color, expected.color);
            assert(`Menu ${shape} ${state}: label color`, getComputedStyle(action.querySelector('.p-menuitem-text')).color, expected.color);
            assert(`Menu ${shape} ${state}: icon color`, getComputedStyle(action.querySelector('.p-menuitem-icon')).color, expected.icon);
            assert(`Menu ${shape} ${state}: action padding`, actionStyle.paddingTop, '11px');
            assert(`Menu ${shape} ${state}: action gap`, actionStyle.gap, '5px');

            if (state === 'focus') {
                await pseudo(selector);
            }
        }
    }

    await mount(<SlideMenu id="regression-slide" model={[{ label: 'Slide' }]} />, { slidemenu: { root: { color: '#000000' }, item: { color: '#123456' } } });
    await pseudo('#regression-parking', [], true);
    assert('SlideMenu normal action consumes item.color', getComputedStyle(find('#regression-slide .p-menuitem-link')).color, 'rgb(18, 52, 86)');
};

const checkNavigation = async () => {
    await mount(<Steps id="regression-steps" model={[{ label: 'Current' }, { label: 'Next' }]} readOnly={false} />, {
        steps: { number: { activeBackground: '#123456', hoverBackground: '#abcdef' } }
    });
    await pseudo('#regression-steps .p-steps-current > .p-menuitem-link', ['hover'], true);
    assert('Steps current number retains active background while hovered', getComputedStyle(find('#regression-steps .p-steps-current .p-steps-number')).backgroundColor, 'rgb(18, 52, 86)');
    await pseudo('#regression-steps .p-steps-item:not(.p-steps-current) > .p-menuitem-link', ['hover'], true);
    assert('Steps noncurrent number consumes hover background', getComputedStyle(find('#regression-steps .p-steps-item:not(.p-steps-current) .p-steps-number')).backgroundColor, 'rgb(171, 205, 239)');

    await mount(<TabMenu id="regression-tabs" model={[{ label: 'Selected' }, { label: 'Other' }]} activeIndex={0} />, {
        tabmenu: { item: { activeBorderColor: '#123456', hoverBorderColor: '#abcdef' } }
    });
    await pseudo('#regression-tabs .p-tabmenuitem.p-highlight > .p-menuitem-link', ['hover'], true);
    assert('TabMenu selected border retains active color while hovered', getComputedStyle(find('#regression-tabs .p-tabmenuitem.p-highlight > .p-menuitem-link')).borderBottomColor, 'rgb(18, 52, 86)');
    await pseudo('#regression-tabs .p-tabmenuitem:not(.p-highlight) > .p-menuitem-link', ['hover'], true);
    assert('TabMenu unselected border consumes hover color', getComputedStyle(find('#regression-tabs .p-tabmenuitem:not(.p-highlight) > .p-menuitem-link')).borderBottomColor, 'rgb(171, 205, 239)');
};

const checkTreeTable = async () => {
    const nodes = [
        { key: 'first', data: { name: 'First' } },
        { key: 'context', data: { name: 'Context selection' } }
    ];

    await mount(
        <TreeTable id="regression-tree" value={nodes} stripedRows rowHover selectionMode="single" contextMenuSelectionKey="context">
            <Column field="name" header="Name" />
        </TreeTable>,
        { treetable: { row: { stripedBackground: '#abcdef', selectedBackground: '#123456', hoverBackground: '#fedcba' } } }
    );
    await pseudo('#regression-parking', [], true);
    const row = find('#regression-tree .p-treetable-tbody > tr.p-highlight-contextmenu');

    assert('TreeTable context selection uses actual odd striped row', row.classList.contains('p-row-odd'), true);
    assert('TreeTable context-selected striped row retains selected background', getComputedStyle(row).backgroundColor, 'rgb(18, 52, 86)');
    assert('TreeTable context-selected cell inherits selected background', getComputedStyle(row.querySelector('td')).backgroundColor, 'rgb(18, 52, 86)');
    await pseudo('#regression-tree .p-highlight-contextmenu', ['hover'], true);
    assert('TreeTable context-selected striped row remains selected on hover', getComputedStyle(row).backgroundColor, 'rgb(18, 52, 86)');
};

const checkStepper = async () => {
    for (const activeStep of [0, 1]) {
        await mount(
            <Stepper id="regression-stepper" orientation="vertical" activeStep={activeStep} end={<span>End slot</span>}>
                <StepperPanel header="First">First content</StepperPanel>
                <StepperPanel header="Last">Last content</StepperPanel>
            </Stepper>,
            { stepper: { content: { verticalPadding: '5px 7px 9px 11px', lastVerticalPadding: '13px 15px 17px 19px' }, end: { padding: '23px 25px 27px 29px' } } }
        );
        const panel = find('#regression-stepper .p-stepper-panel-active');
        const content = panel.querySelector('.p-stepper-content');
        const end = find('#regression-stepper > .p-stepper-end');

        assert(`Stepper vertical ${activeStep}: real end slot follows panels`, end === end.parentElement.lastElementChild, true);
        assert(`Stepper vertical ${activeStep}: panel is not root last child`, panel.matches(':last-child'), false);
        assert(`Stepper vertical ${activeStep}: content padding follows panel position`, getComputedStyle(content).padding, activeStep === 1 ? '13px 15px 17px 19px' : '5px 7px 9px 11px');
        assert(`Stepper vertical ${activeStep}: end slot keeps its own padding`, getComputedStyle(end).padding, '23px 25px 27px 29px');
    }
};

const dialogOverrides = {
    dialog: {
        root: { borderRadius: '17px' },
        header: { background: '#abcdef' },
        content: { background: '#aabbcc' },
        footer: { background: '#bbccdd' },
        title: { color: '#ccddee' },
        closeButton: { size: '26px' }
    },
    confirmdialog: {
        header: { background: '#123456' },
        content: { background: '#223344' },
        footer: { background: '#334455' },
        title: { color: '#445566' },
        closeButton: { size: '44px' }
    }
};

const checkDialogs = async () => {
    const inner = (
        <Dialog id="regression-inner-dialog" visible appendTo="self" header="Ordinary dialog" footer={<span>Ordinary footer</span>} modal={false} focusOnShow={false} draggable={false} resizable={false} onHide={() => {}}>
            Inner content
        </Dialog>
    );

    await mount(<ConfirmDialog id="regression-confirm-dialog" visible header={<>{inner}Confirm dialog</>} message="Confirm?" modal={false} focusOnShow={false} draggable={false} resizable={false} />, dialogOverrides);
    const confirm = await waitFor('#regression-confirm-dialog.p-confirm-dialog');
    const ordinary = await waitFor('#regression-inner-dialog.p-dialog');

    assert('ConfirmDialog contains an actual appendTo=self ordinary Dialog', confirm.contains(ordinary), true);

    for (const [part, outerColor, innerColor] of [
        ['header', 'rgb(18, 52, 86)', 'rgb(171, 205, 239)'],
        ['content', 'rgb(34, 51, 68)', 'rgb(170, 187, 204)'],
        ['footer', 'rgb(51, 68, 85)', 'rgb(187, 204, 221)']
    ]) {
        assert(`ConfirmDialog own ${part} consumes confirmation token`, getComputedStyle(confirm.querySelector(`:scope > .p-dialog-${part}`)).backgroundColor, outerColor);
        assert(`Nested ordinary Dialog ${part} keeps its own token`, getComputedStyle(ordinary.querySelector(`:scope > .p-dialog-${part}`)).backgroundColor, innerColor);
    }

    assert('ConfirmDialog own title token', getComputedStyle(confirm.querySelector(':scope > .p-dialog-header > .p-dialog-title')).color, 'rgb(68, 85, 102)');
    assert('Nested ordinary Dialog title token', getComputedStyle(ordinary.querySelector(':scope > .p-dialog-header > .p-dialog-title')).color, 'rgb(204, 221, 238)');
    assert('ConfirmDialog own close button size', getComputedStyle(confirm.querySelector(':scope > .p-dialog-header > .p-dialog-header-icons > .p-dialog-header-close')).width, '44px');
    assert('Nested ordinary Dialog close button size', getComputedStyle(ordinary.querySelector(':scope > .p-dialog-header > .p-dialog-header-icons > .p-dialog-header-close')).width, '26px');

    for (const hasFooter of [false, true]) {
        await mount(
            <Dialog id="regression-radius-dialog" visible appendTo="self" header="Radius" modal={false} focusOnShow={false} onHide={() => {}} footer={hasFooter ? <span>Footer</span> : null}>
                Content
            </Dialog>,
            dialogOverrides
        );
        const dialog = await waitFor('#regression-radius-dialog');
        const content = dialog.querySelector(':scope > .p-dialog-content');

        assert(`Dialog ${hasFooter ? 'with footer' : 'footerless'}: FocusTrap sentinels exist`, dialog.querySelectorAll(':scope > [data-p-hidden-focusable="true"]').length, 2);
        assert(`Dialog ${hasFooter ? 'with footer' : 'footerless'}: resizer exists`, !!dialog.querySelector(':scope > .p-resizable-handle'), true);
        assert(`Dialog ${hasFooter ? 'with footer' : 'footerless'}: content is not last child`, content.matches(':last-child'), false);
        assert(`Dialog ${hasFooter ? 'with footer' : 'footerless'}: lower content radius`, getComputedStyle(content).borderBottomLeftRadius, hasFooter ? '0px' : '17px');
    }
};

const checkExitTransitions = async () => {
    for (const name of ['messages', 'toast']) {
        const api = React.createRef();
        const transitionOptions = { timeout: { enter: 0, exit: 500 } };
        const subject =
            name === 'messages' ? (
                <Messages id="regression-messages" ref={api} className="regression-exit" transitionOptions={transitionOptions} />
            ) : (
                <Toast id="regression-toast" ref={api} className="regression-exit" transitionOptions={transitionOptions} />
            );

        await mount(subject, { messages: { root: { margin: '17px 0' } }, toast: { message: { margin: '0 0 19px' } } });
        flushSync(() => api.current.show({ severity: 'info', summary: 'Exit regression', sticky: true }));
        const selector = name === 'messages' ? '#regression-messages .p-message' : '#regression-toast .p-toast-message';
        const message = await waitFor(selector);

        await settle();
        assert(`${name}: nonzero React exit timeout`, api.current.props.transitionOptions.timeout.exit, 500);
        assert(`${name}: nonzero initial margin`, getComputedStyle(message)[name === 'messages' ? 'marginTop' : 'marginBottom'], name === 'messages' ? '17px' : '19px');
        flushSync(() => api.current.clear());
        await waitFor(`${selector}.${name === 'messages' ? 'p-message' : 'p-toast-message'}-exit-active`);
        await settle(100);
        assert(`${name}: exit node remains connected during nonzero timeout`, message.isConnected, true);
        assert(`${name}: actual exit-active class remains`, message.classList.contains(`${name === 'messages' ? 'p-message' : 'p-toast-message'}-exit-active`), true);
        assert(`${name}: fixture enables actual CSS margin transition`, getComputedStyle(message).transitionDuration.includes('0.04s'), true);
        assert(`${name}: exit margin collapses before unmount`, getComputedStyle(message)[name === 'messages' ? 'marginTop' : 'marginBottom'], '0px');
    }
};

const checkGalleria = async () => {
    const api = React.createRef();

    await mount(
        <Galleria
            ref={api}
            id="regression-galleria"
            fullScreen
            value={[{ label: 'First' }, { label: 'Second' }]}
            item={(item) => <span>{item.label}</span>}
            showThumbnails={false}
            showItemNavigators
            transitionOptions={{ timeout: { enter: 500, exit: 0 } }}
        />,
        { galleria: { itemNavigator: { disabledOpacity: '0.63' } } }
    );
    flushSync(() => api.current.show());
    const gallery = await waitFor('#regression-galleria.p-galleria-enter-active');
    const previous = gallery.querySelector('.p-galleria-item-prev');
    const next = gallery.querySelector('.p-galleria-item-next');

    assert('Galleria entering state comes from its actual imperative show API', gallery.classList.contains('p-galleria-enter-active'), true);
    assert('Galleria: nonzero React enter timeout', api.current.props.transitionOptions.timeout.enter, 500);
    assert('Galleria: fixture enables actual CSS entry transition', getComputedStyle(gallery).transitionDuration.includes('0.04s'), true);
    assert('Galleria first previous navigator is natively disabled', previous.disabled, true);
    assert('Galleria entering disabled navigator stays hidden', getComputedStyle(previous).opacity, '0');
    assert('Galleria entering enabled navigator stays hidden', getComputedStyle(next).opacity, '0');
    await settle(550);
    assert('Galleria disabled navigator consumes opacity after entry', getComputedStyle(previous).opacity, '0.63');
};

const run = async () => {
    await checkMenuPainting();
    await checkNavigation();
    await checkTreeTable();
    await checkStepper();
    await checkDialogs();
    await checkExitTransitions();
    await checkGalleria();
    assert('Scoped regression tokens do not leak to document root', getComputedStyle(document.documentElement).getPropertyValue('--regression-menu-item-background'), '');
    flushSync(() => root.unmount());
    assert('Regression provider sheets are removed on unmount', document.querySelectorAll('style[data-mantle-theme]').length, 0);
};

run()
    .then(() => {
        const failed = assertions.filter((item) => !item.passed);

        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: failed.length === 0, ...(failed.length ? { error: `${failed.length} skin regression assertions failed` } : {}), assertions });
    })
    .catch((error) => {
        document.getElementById('portal-theme-test-results').textContent = JSON.stringify({ passed: false, error: error.message, assertions });
    });
