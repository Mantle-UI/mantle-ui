import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { snapshot } from '../../test';
import { MantleProvider } from '../api/Api';
import { Fieldset } from './Fieldset';

describe('Fieldset', () => {
    snapshot(
        <MantleProvider>
            <Fieldset />
        </MantleProvider>,
        'default'
    );
    snapshot(
        <MantleProvider>
            <Fieldset id="fieldset" legend="Simple Fieldset">
                Content
            </Fieldset>
        </MantleProvider>,
        'legend'
    );
    test('when Fieldset is toggleable it will toggle when clicked', async () => {
        // Arrange
        const toggleOn = jest.fn();
        const { container } = render(
            <MantleProvider>
                <Fieldset legend="Toggleable" toggleable onToggle={toggleOn}>
                    <p>Lorem ipsum dolor sit amet</p>
                </Fieldset>
            </MantleProvider>
        );
        const legend = container.querySelectorAll('[data-pc-section="toggler"]')[0];

        expect(container).toMatchSnapshot('toggleable-open');

        // Act
        userEvent.click(legend);

        // Assert
        await waitFor(() => {
            expect(toggleOn).toHaveBeenCalledTimes(1);
            expect(container).toMatchSnapshot('toggleable-closed');
        });
    });
    test('when Fieldset is toggleable it must expand and collapse', async () => {
        // Arrange
        const expandOn = jest.fn();
        const collapseOn = jest.fn();
        const { container } = render(
            <MantleProvider>
                <Fieldset legend="Expand/Collapse" toggleable onExpand={expandOn} onCollapse={collapseOn}>
                    <p>Lorem ipsum dolor sit amet</p>
                </Fieldset>
            </MantleProvider>
        );
        const legend = container.querySelectorAll('[data-pc-section="toggler"]')[0];

        expect(container).toMatchSnapshot('expandable-open');

        // Act
        userEvent.click(legend);

        // Assert
        await waitFor(() => {
            expect(expandOn).toHaveBeenCalledTimes(0);
            expect(collapseOn).toHaveBeenCalledTimes(1);
            expect(container).toMatchSnapshot('expandable-closed');
        });

        // Act
        userEvent.click(legend);

        // Assert
        await waitFor(() => {
            expect(expandOn).toHaveBeenCalledTimes(1);
            expect(collapseOn).toHaveBeenCalledTimes(1);
            expect(container).toMatchSnapshot('expandable-open');
        });
    });
});
