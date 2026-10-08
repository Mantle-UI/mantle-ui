import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
});
