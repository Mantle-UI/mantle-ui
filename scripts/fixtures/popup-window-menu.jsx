import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { MantleProvider } from '../../components/lib/api/Api';
import { Menu } from '../../components/lib/menu/Menu';

function MenuFixture({ ownerWindow }) {
    const menu = React.useRef(null);

    return (
        <MantleProvider value={{ appendTo: ownerWindow.document.body }}>
            <Menu popup model={[{ label: 'Action' }]} ref={menu} />
            <button id="trigger" onClick={(event) => menu.current.toggle(event)}>
                Show menu
            </button>
            <button id="outside">Outside</button>
        </MantleProvider>
    );
}

function trackWindowClicks(ownerWindow) {
    const listeners = new Set();
    const add = ownerWindow.addEventListener.bind(ownerWindow);
    const remove = ownerWindow.removeEventListener.bind(ownerWindow);

    ownerWindow.menuClickListeners = listeners;
    ownerWindow.addEventListener = (type, listener, options) => {
        if (type === 'click') listeners.add(listener);
        add(type, listener, options);
    };
    ownerWindow.removeEventListener = (type, listener, options) => {
        if (type === 'click') listeners.delete(listener);
        remove(type, listener, options);
    };
}

trackWindowClicks(window);
createRoot(document.getElementById('app')).render(<MenuFixture ownerWindow={window} />);

document.getElementById('open-popup').addEventListener('click', () => {
    const popup = window.open('', 'mantle-popup-test', 'width=600,height=400');

    if (!popup) throw new Error('Browser blocked the popup');

    trackWindowClicks(popup);
    const app = popup.document.createElement('div');

    popup.document.body.appendChild(app);
    createRoot(app).render(<MenuFixture ownerWindow={popup} />);
    window.popupFixture = popup;
});
