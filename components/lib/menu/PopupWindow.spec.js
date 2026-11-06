import * as React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { MantleProvider } from '../api/Api';
import { ContextMenu } from '../contextmenu/ContextMenu';
import { OverlayPanel } from '../overlaypanel/OverlayPanel';
import { TieredMenu } from '../tieredmenu/TieredMenu';
import { DomHandler } from '../utils/Utils';
import { Menu } from './Menu';

const components = [
    ['Menu', Menu, { popup: true, model: [{ label: 'Action' }] }, 'window'],
    ['OverlayPanel', OverlayPanel, {}, 'window'],
    ['ContextMenu', ContextMenu, { model: [{ label: 'Action' }] }, 'document'],
    ['TieredMenu', TieredMenu, { popup: true, model: [{ label: 'Action' }] }, 'document']
];

describe.each(components)('%s outside clicks', (name, Component, componentProps, listenerTarget) => {
    it.each(['main', 'popup'])('closes in the %s window and cleans up its listener', async (location) => {
        const frame = location === 'popup' ? document.createElement('iframe') : null;

        if (frame) document.body.appendChild(frame);

        const ownerDocument = frame ? frame.contentDocument : document;
        const ownerWindow = ownerDocument.defaultView;
        const mount = ownerDocument.createElement('div');

        ownerDocument.body.appendChild(mount);

        const observedTarget = listenerTarget === 'window' ? ownerWindow : ownerDocument;
        const addSpy = jest.spyOn(observedTarget, 'addEventListener');
        const removeSpy = jest.spyOn(observedTarget, 'removeEventListener');
        const resizeAddSpy = jest.spyOn(ownerWindow, 'addEventListener');
        const resizeRemoveSpy = jest.spyOn(ownerWindow, 'removeEventListener');
        const api = React.createRef();
        const onHide = jest.fn();
        const view = render(
            <MantleProvider value={{ appendTo: ownerDocument.body, cssTransition: false }}>
                <Component {...componentProps} ref={api} onHide={onHide} />
                <button type="button">Trigger</button>
            </MantleProvider>,
            { container: mount, baseElement: ownerDocument.body }
        );

        try {
            expect(DomHandler.getTargetElement(ownerWindow)).toBe(ownerWindow);
            expect(DomHandler.getTargetElement(ownerDocument)).toBe(ownerDocument);

            const trigger = mount.querySelector('button');
            const event = { currentTarget: trigger, target: trigger, pageX: 10, pageY: 10, stopPropagation: jest.fn(), preventDefault: jest.fn() };

            act(() => api.current.show(event));
            await waitFor(() => expect(api.current.getElement()).toBeInTheDocument());
            await waitFor(() => expect(addSpy.mock.calls.some(([type]) => type === 'click')).toBe(true));
            expect(resizeAddSpy.mock.calls.some(([type]) => type === 'resize')).toBe(true);

            const clickListener = addSpy.mock.calls.find(([type]) => type === 'click')[1];
            const resizeListener = resizeAddSpy.mock.calls.find(([type]) => type === 'resize')[1];

            if (name !== 'OverlayPanel') {
                fireEvent.click(api.current.getElement());
                expect(onHide).not.toHaveBeenCalled();
            }

            if (frame) {
                fireEvent.click(document.body);
                expect(onHide).not.toHaveBeenCalled();
            }

            fireEvent.click(ownerDocument.body);
            expect(onHide).toHaveBeenCalledTimes(1);

            view.unmount();
            expect(removeSpy.mock.calls.some(([type, listener]) => type === 'click' && listener === clickListener)).toBe(true);
            expect(resizeRemoveSpy.mock.calls.some(([type, listener]) => type === 'resize' && listener === resizeListener)).toBe(true);
        } finally {
            view.unmount();
            mount.remove();
            frame?.remove();
            jest.restoreAllMocks();
        }
    });
});

it('closes a popup Menu on its own window scroll and removes the scroll listener', async () => {
    const frame = document.createElement('iframe');

    document.body.appendChild(frame);

    const ownerDocument = frame.contentDocument;
    const ownerWindow = frame.contentWindow;
    const mount = ownerDocument.createElement('div');

    ownerDocument.body.appendChild(mount);

    const addSpy = jest.spyOn(ownerWindow, 'addEventListener');
    const removeSpy = jest.spyOn(ownerWindow, 'removeEventListener');
    const api = React.createRef();
    const onHide = jest.fn();
    const view = render(
        <MantleProvider value={{ appendTo: ownerDocument.body, cssTransition: false, hideOverlaysOnDocumentScrolling: true }}>
            <Menu popup model={[{ label: 'Action' }]} ref={api} onHide={onHide} />
            <button type="button">Trigger</button>
        </MantleProvider>,
        { container: mount, baseElement: ownerDocument.body }
    );

    try {
        const trigger = mount.querySelector('button');

        act(() => api.current.show({ currentTarget: trigger, target: trigger }));
        await waitFor(() => expect(addSpy.mock.calls.some(([type]) => type === 'scroll')).toBe(true));

        const scrollListener = addSpy.mock.calls.find(([type]) => type === 'scroll')[1];

        fireEvent.scroll(window);
        expect(onHide).not.toHaveBeenCalled();
        fireEvent.scroll(ownerWindow);
        expect(onHide).toHaveBeenCalledTimes(1);

        view.unmount();
        expect(removeSpy.mock.calls.some(([type, listener]) => type === 'scroll' && listener === scrollListener)).toBe(true);
    } finally {
        view.unmount();
        mount.remove();
        frame.remove();
        jest.restoreAllMocks();
    }
});

it('opens a global ContextMenu from the popup document only', async () => {
    const frame = document.createElement('iframe');

    document.body.appendChild(frame);

    const ownerDocument = frame.contentDocument;
    const mount = ownerDocument.createElement('div');

    ownerDocument.body.appendChild(mount);

    const onShow = jest.fn();
    const view = render(
        <MantleProvider value={{ appendTo: ownerDocument.body, cssTransition: false }}>
            <ContextMenu global model={[{ label: 'Action' }]} onShow={onShow} />
        </MantleProvider>,
        { container: mount, baseElement: ownerDocument.body }
    );

    try {
        fireEvent.contextMenu(document.body);
        expect(onShow).not.toHaveBeenCalled();
        fireEvent.contextMenu(ownerDocument.body);
        expect(onShow).toHaveBeenCalledTimes(1);
    } finally {
        view.unmount();
        mount.remove();
        frame.remove();
    }
});

it('passes a popup resize event to TieredMenu hide', async () => {
    const frame = document.createElement('iframe');

    document.body.appendChild(frame);

    const ownerDocument = frame.contentDocument;
    const mount = ownerDocument.createElement('div');

    ownerDocument.body.appendChild(mount);

    const api = React.createRef();
    const onHide = jest.fn();
    const view = render(
        <MantleProvider value={{ appendTo: ownerDocument.body, cssTransition: false }}>
            <TieredMenu popup model={[{ label: 'Action' }]} ref={api} onHide={onHide} />
            <button type="button">Trigger</button>
        </MantleProvider>,
        { container: mount, baseElement: ownerDocument.body }
    );

    try {
        const trigger = mount.querySelector('button');

        act(() => api.current.show({ currentTarget: trigger, target: trigger }));
        fireEvent.resize(window);
        expect(onHide).not.toHaveBeenCalled();

        const resizeEvent = new ownerDocument.defaultView.Event('resize');

        fireEvent(ownerDocument.defaultView, resizeEvent);
        expect(onHide).toHaveBeenCalledWith(resizeEvent);
    } finally {
        view.unmount();
        mount.remove();
        frame.remove();
    }
});

it('removes a popup Menu listener when unmounted while open', async () => {
    const frame = document.createElement('iframe');

    document.body.appendChild(frame);

    const ownerDocument = frame.contentDocument;
    const ownerWindow = frame.contentWindow;
    const mount = ownerDocument.createElement('div');

    ownerDocument.body.appendChild(mount);

    const addSpy = jest.spyOn(ownerWindow, 'addEventListener');
    const removeSpy = jest.spyOn(ownerWindow, 'removeEventListener');
    const api = React.createRef();
    const view = render(
        <MantleProvider value={{ appendTo: ownerDocument.body, cssTransition: false }}>
            <Menu popup model={[{ label: 'Action' }]} ref={api} />
            <button type="button">Trigger</button>
        </MantleProvider>,
        { container: mount, baseElement: ownerDocument.body }
    );

    try {
        const trigger = mount.querySelector('button');

        act(() => api.current.show({ currentTarget: trigger, target: trigger }));
        await waitFor(() => expect(addSpy.mock.calls.some(([type]) => type === 'click')).toBe(true));

        const clickListener = addSpy.mock.calls.find(([type]) => type === 'click')[1];

        view.unmount();
        expect(removeSpy.mock.calls.some(([type, listener]) => type === 'click' && listener === clickListener)).toBe(true);
    } finally {
        view.unmount();
        mount.remove();
        frame.remove();
        jest.restoreAllMocks();
    }
});
