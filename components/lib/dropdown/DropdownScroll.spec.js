import * as React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import MantleUI, { MantleProvider } from '../api/Api';
import { Dialog } from '../dialog/Dialog';
import { Dropdown } from './Dropdown';

const cases = [
    ['without a provider, keep open', null, false, false],
    ['without a provider, hide', null, true, true],
    ['provider false overrides global true', false, true, false],
    ['provider true overrides global false', true, false, true]
];

describe('Dropdown scroll inside Dialog', () => {
    const originalHide = MantleUI.hideOverlaysOnDocumentScrolling;
    const originalTransition = MantleUI.cssTransition;

    afterEach(() => {
        MantleUI.hideOverlaysOnDocumentScrolling = originalHide;
        MantleUI.cssTransition = originalTransition;
    });

    it.each(cases)('%s', async (name, providerValue, globalValue, shouldHide) => {
        MantleUI.hideOverlaysOnDocumentScrolling = globalValue;
        MantleUI.cssTransition = false;

        const dropdown = React.createRef();
        const onHide = jest.fn();
        const content = (
            <Dialog visible onHide={() => {}}>
                <div data-testid="scroll-container" style={{ overflow: 'auto' }}>
                    <Dropdown ref={dropdown} options={['One', 'Two']} onHide={onHide} />
                </div>
            </Dialog>
        );
        const view = render(providerValue === null ? content : <MantleProvider value={{ cssTransition: false, hideOverlaysOnDocumentScrolling: providerValue }}>{content}</MantleProvider>);

        for (let attempt = 0; attempt < 2; attempt++) {
            act(() => dropdown.current.show());
            await waitFor(() => expect(view.getByRole('listbox', { hidden: true })).toBeInTheDocument());
            fireEvent.scroll(view.getByTestId('scroll-container'));

            if (shouldHide) {
                await waitFor(() => expect(view.queryByRole('listbox', { hidden: true })).not.toBeInTheDocument());
                expect(onHide).toHaveBeenCalledTimes(attempt + 1);
            } else {
                expect(view.getByRole('listbox', { hidden: true })).toBeInTheDocument();
                expect(onHide).not.toHaveBeenCalled();
                act(() => dropdown.current.hide());
                onHide.mockClear();
                await waitFor(() => expect(view.queryByRole('listbox', { hidden: true })).not.toBeInTheDocument());
            }
        }
    });
});
