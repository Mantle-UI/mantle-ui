import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MobileNav } from './MobileNav';

const model = [{ label: 'Components', id: 'components', icon: 'pi pi-box', items: [{ label: 'Button', url: '/button' }] }];

describe('MobileNav', () => {
    test('renders an accessible navigation tree in a drawer', () => {
        render(<MobileNav visible model={model} />);

        expect(screen.getByRole('navigation', { name: 'Navigation' })).toBeVisible();
        expect(screen.getByRole('button', { name: 'Components' })).toHaveAttribute('aria-expanded', 'false');
        expect(document.querySelectorAll('.p-mobilenav-icon .pi')).toHaveLength(1);
        expect(document.querySelector('.p-mobilenav-submenu-wrapper')).not.toHaveClass('p-mobilenav-submenu-expanded');
        expect(document.querySelector('.p-mobilenav-submenu-wrapper')).toHaveAttribute('aria-hidden', 'true');
        expect(screen.getByRole('link', { name: 'Button', hidden: true })).toHaveAttribute('tabindex', '-1');
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
        await new Promise((resolve) => setTimeout(resolve, 0));
        fireEvent.click(screen.getByRole('link', { name: 'Button' }));

        expect(onHide).toHaveBeenCalledTimes(1);
    });
});
