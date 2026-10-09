import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { Dialog } from './Dialog';

describe('Dialog', () => {
    test('minimizes without unmounting its content and restores its modal behavior', async () => {
        const hideOn = jest.fn();

        render(
            <>
                <button type="button">Page action</button>
                <Dialog header="Details" visible minimizable blockScroll onHide={hideOn}>
                    <input aria-label="Name" defaultValue="Retained value" />
                </Dialog>
            </>
        );

        const dialog = await screen.findByRole('dialog');
        const input = screen.getByLabelText('Name');

        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(document.body).toHaveClass('p-overflow-hidden');

        fireEvent.click(screen.getByRole('button', { name: 'Minimize' }));

        await waitFor(() => expect(dialog).toHaveClass('p-dialog-minimized'));
        expect(dialog).not.toHaveAttribute('aria-modal');
        expect(dialog).not.toHaveAttribute('aria-describedby');
        expect(input).not.toBeVisible();
        expect(input).toHaveValue('Retained value');
        expect(document.body).not.toHaveClass('p-overflow-hidden');
        expect(screen.getByRole('button', { name: 'Page action' })).toBeVisible();

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(hideOn).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: 'Restore' }));

        await waitFor(() => expect(dialog).not.toHaveClass('p-dialog-minimized'));
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(input).toBeVisible();
        expect(input).toHaveValue('Retained value');
        expect(document.body).toHaveClass('p-overflow-hidden');
    });

    test('uses onMinimize as the controlled minimized state callback', async () => {
        const minimizeOn = jest.fn();

        render(
            <Dialog header="Details" visible minimizable minimized={false} onHide={() => {}} onMinimize={minimizeOn}>
                Content
            </Dialog>
        );

        fireEvent.click(await screen.findByRole('button', { name: 'Minimize' }));

        expect(minimizeOn).toHaveBeenCalledWith(expect.objectContaining({ minimized: true }));
        expect(screen.getByRole('dialog')).not.toHaveClass('p-dialog-minimized');
    });

    test('keeps scrolling blocked while another visible dialog requires it', async () => {
        render(
            <>
                <Dialog header="First" visible minimizable blockScroll onHide={() => {}}>
                    First content
                </Dialog>
                <Dialog header="Second" visible blockScroll onHide={() => {}}>
                    Second content
                </Dialog>
            </>
        );

        await screen.findByText('First content');
        expect(document.body).toHaveClass('p-overflow-hidden');

        fireEvent.click(screen.getByRole('button', { name: 'Minimize' }));

        await waitFor(() => expect(screen.getByLabelText('First')).toHaveClass('p-dialog-minimized'));
        expect(document.body).toHaveClass('p-overflow-hidden');
    });

    test('keeps the configured size available after restoring a compact titlebar', async () => {
        render(
            <Dialog header="A very long dialog title that is compacted when minimized" visible minimizable style={{ width: '42rem', minWidth: '30rem' }} onHide={() => {}}>
                Content
            </Dialog>
        );

        const dialog = await screen.findByRole('dialog');

        expect(dialog).toHaveStyle({ width: '42rem', minWidth: '30rem' });

        fireEvent.click(screen.getByRole('button', { name: 'Minimize' }));
        await waitFor(() => expect(dialog).toHaveClass('p-dialog-minimized'));
        expect(dialog).toHaveStyle({ width: '42rem', minWidth: '30rem' });

        fireEvent.click(screen.getByRole('button', { name: 'Restore' }));
        await waitFor(() => expect(dialog).not.toHaveClass('p-dialog-minimized'));
        expect(dialog).toHaveStyle({ width: '42rem', minWidth: '30rem' });
    });

    test('exposes minimize state and actions to headless content', async () => {
        render(
            <Dialog
                visible
                onHide={() => {}}
                content={({ minimized, minimize, restore }) => (
                    <div>
                        <span>{minimized ? 'Minimized' : 'Expanded'}</span>
                        <button type="button" onClick={(event) => minimize(event)}>
                            Minimize headless dialog
                        </button>
                        <button type="button" onClick={(event) => restore(event)}>
                            Restore headless dialog
                        </button>
                    </div>
                )}
            />
        );

        await screen.findByText('Expanded');
        fireEvent.click(screen.getByRole('button', { name: 'Minimize headless dialog' }));
        await screen.findByText('Minimized');
        expect(screen.getByRole('dialog')).toHaveClass('p-dialog-minimized');

        fireEvent.click(screen.getByRole('button', { name: 'Restore headless dialog' }));
        await screen.findByText('Expanded');
        expect(screen.getByRole('dialog')).not.toHaveClass('p-dialog-minimized');
    });

    test('transitions directly between minimized and maximized states', async () => {
        render(
            <Dialog header="Details" visible minimizable maximizable onHide={() => {}}>
                Content
            </Dialog>
        );

        const dialog = await screen.findByRole('dialog');
        const maximizeButton = () => dialog.querySelector('.p-dialog-header-maximize');

        fireEvent.click(screen.getByRole('button', { name: 'Minimize' }));
        await waitFor(() => expect(dialog).toHaveClass('p-dialog-minimized'));

        fireEvent.click(maximizeButton());
        await waitFor(() => expect(dialog).not.toHaveClass('p-dialog-minimized'));
        expect(dialog).toHaveClass('p-dialog-maximized');

        fireEvent.click(screen.getByRole('button', { name: 'Minimize' }));
        await waitFor(() => expect(dialog).toHaveClass('p-dialog-minimized'));
        expect(dialog).not.toHaveClass('p-dialog-maximized');

        fireEvent.click(screen.getByRole('button', { name: 'Restore' }));
        await waitFor(() => expect(dialog).not.toHaveClass('p-dialog-minimized'));
        expect(dialog).toHaveClass('p-dialog-maximized');
    });

    test('coordinates direct minimize and maximize transitions when both states are controlled', async () => {
        const maximizeOn = jest.fn();
        const minimizeOn = jest.fn();

        function ControlledDialog() {
            const [maximized, setMaximized] = React.useState(false);
            const [minimized, setMinimized] = React.useState(false);

            return (
                <Dialog
                    header="Details"
                    visible
                    minimizable
                    maximizable
                    maximized={maximized}
                    minimized={minimized}
                    onHide={() => {}}
                    onMaximize={(event) => {
                        maximizeOn(event);
                        setMaximized(event.maximized);
                    }}
                    onMinimize={(event) => {
                        minimizeOn(event);
                        setMinimized(event.minimized);
                    }}
                >
                    Content
                </Dialog>
            );
        }

        render(<ControlledDialog />);

        const dialog = await screen.findByRole('dialog');
        const maximizeButton = () => dialog.querySelector('.p-dialog-header-maximize');

        fireEvent.click(screen.getByRole('button', { name: 'Minimize' }));
        await waitFor(() => expect(dialog).toHaveClass('p-dialog-minimized'));

        fireEvent.click(maximizeButton());
        await waitFor(() => expect(dialog).toHaveClass('p-dialog-maximized'));
        expect(dialog).not.toHaveClass('p-dialog-minimized');
        expect(minimizeOn).toHaveBeenLastCalledWith(expect.objectContaining({ minimized: false }));
        expect(maximizeOn).toHaveBeenLastCalledWith(expect.objectContaining({ maximized: true }));
    });

    test('uses pi-minus and pi-expand defaults for minimize and restore', async () => {
        render(
            <Dialog header="Details" visible minimizable onHide={() => {}}>
                Content
            </Dialog>
        );

        const minimizeButton = await screen.findByRole('button', { name: 'Minimize' });

        expect(minimizeButton.querySelector('.pi-minus')).toBeInTheDocument();
        fireEvent.click(minimizeButton);
        expect(screen.getByRole('button', { name: 'Restore' }).querySelector('.pi-expand')).toBeInTheDocument();
    });

    test('preserves custom minimize and restore icon overrides', async () => {
        render(
            <Dialog header="Details" visible minimizable minimizableIcon="custom-minimize" restoreIcon="custom-restore" onHide={() => {}}>
                Content
            </Dialog>
        );

        const minimizeButton = await screen.findByRole('button', { name: 'Minimize' });

        expect(minimizeButton.querySelector('.custom-minimize')).toBeInTheDocument();
        fireEvent.click(minimizeButton);
        expect(screen.getByRole('button', { name: 'Restore' }).querySelector('.custom-restore')).toBeInTheDocument();
    });
});
