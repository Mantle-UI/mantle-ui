import '@testing-library/jest-dom';
import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MobileNav } from './MobileNav';

const model = [{ label: 'Components', id: 'components', icon: 'pi pi-box', items: [{ label: 'Button', url: '/button' }] }];

describe('MobileNav', () => {
    test('renders and activates an accessible navigation tree in a drawer', async () => {
        render(<MobileNav visible model={model} />);

        expect(screen.getByRole('navigation', { name: 'Navigation' })).toBeVisible();
        await waitFor(() => expect(document.querySelector('.p-mobilenav')).toHaveClass('p-mobilenav-active'));
        expect(document.querySelector('.p-mobilenav-mask')).toHaveClass('p-mobilenav-mask-active');
        expect(screen.getByRole('button', { name: 'Components' })).toHaveAttribute('aria-expanded', 'false');
        expect(document.querySelectorAll('.p-mobilenav-icon .pi')).toHaveLength(1);
        expect(document.querySelector('.p-mobilenav-submenu-wrapper')).not.toHaveClass('p-mobilenav-submenu-expanded');
        expect(document.querySelector('.p-mobilenav-submenu-wrapper')).toHaveAttribute('aria-hidden', 'true');
        expect(screen.getByRole('link', { name: 'Button', hidden: true })).toHaveAttribute('tabindex', '-1');
    });

    test('applies mask and root pass-through options', () => {
        render(<MobileNav visible model={model} pt={{ mask: { 'data-testid': 'mask' }, root: { 'data-testid': 'root' } }} />);

        expect(screen.getByTestId('mask')).toHaveClass('p-mobilenav-mask');
        expect(screen.getByTestId('root')).toHaveClass('p-mobilenav');
    });

    test('uses unique render keys when sibling item ids are duplicated', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <MobileNav
                visible
                model={[
                    { id: 'duplicate', label: 'First' },
                    { id: 'duplicate', label: 'Second' }
                ]}
            />
        );

        expect(consoleError).not.toHaveBeenCalledWith(expect.stringContaining('unique "key" prop'));
        consoleError.mockRestore();
    });

    test('expands a branch and closes after selecting a leaf', async () => {
        const onHide = jest.fn();

        render(<MobileNav visible model={model} onHide={onHide} />);
        await new Promise((resolve) => setTimeout(resolve, 0));
        const submenu = document.querySelector('.p-mobilenav-submenu-wrapper');
        const getComputedStyle = window.getComputedStyle;

        window.getComputedStyle = (element) => (element === submenu && submenu.classList.contains('hidden') ? { display: 'none' } : getComputedStyle(element));
        fireEvent.click(screen.getByRole('button', { name: 'Components' }));
        expect(submenu).not.toHaveClass('hidden');
        window.getComputedStyle = getComputedStyle;
        expect(screen.getByRole('button', { name: 'Components' }).closest('.p-mobilenav-item')).toHaveClass('p-mobilenav-item-expanded');
        expect(screen.getByRole('button', { name: 'Components' })).toHaveAttribute('aria-expanded', 'true');
        fireEvent.click(screen.getByRole('button', { name: 'Components' }));
        expect(screen.getByRole('button', { name: 'Components' }).closest('.p-mobilenav-item')).not.toHaveClass('p-mobilenav-item-expanded');
        expect(screen.getByRole('button', { name: 'Components' })).toHaveAttribute('aria-expanded', 'false');
        fireEvent.click(screen.getByRole('link', { name: 'Button', hidden: true }));

        expect(onHide).toHaveBeenCalledTimes(1);
    });

    test('moves focus into the drawer, traps tab navigation and restores the trigger focus', async () => {
        const FocusDemo = () => {
            const [visible, setVisible] = React.useState(false);

            return (
                <>
                    <button type="button" onClick={() => setVisible(true)}>
                        Open navigation
                    </button>
                    <MobileNav visible={visible} model={model} onHide={() => setVisible(false)} />
                </>
            );
        };

        render(<FocusDemo />);
        const trigger = screen.getByRole('button', { name: 'Open navigation' });

        trigger.focus();
        fireEvent.click(trigger);

        const branch = await screen.findByRole('button', { name: 'Components' });

        await waitFor(() => expect(branch).toHaveFocus());
        fireEvent.click(branch);

        const leaf = screen.getByRole('link', { name: 'Button' });

        fireEvent.keyDown(branch, { key: 'Tab' });
        expect(leaf).toHaveFocus();
        fireEvent.keyDown(leaf, { key: 'Tab' });
        expect(branch).toHaveFocus();
        fireEvent.keyDown(branch, { key: 'Tab', shiftKey: true });
        expect(leaf).toHaveFocus();
        fireEvent.click(leaf);

        await waitFor(() => expect(trigger).toHaveFocus());
    });
});
