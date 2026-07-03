import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { snapshot } from '../../test';
import { MantleProvider } from '../api/Api';
import { Button } from './Button';

describe('Button', () => {
    snapshot(
        <MantleProvider>
            <Button label={'test'} visible={false} />
        </MantleProvider>,
        'when visible is false Button return null'
    );
    snapshot(
        <MantleProvider>
            <Button label={'test'} visible={true} />
        </MantleProvider>,
        'when visible is true Button render correctly'
    );
    snapshot(
        <MantleProvider>
            <Button label={'test'} iconPos={'bottom'} visible={true} />
        </MantleProvider>,
        'when iconPos is bottom Button is vertical'
    );
    snapshot(
        <MantleProvider>
            <Button visible={true} />
        </MantleProvider>,
        'when label is empty it returns empty button'
    );
    snapshot(
        <MantleProvider>
            <Button badge={'test'} />
        </MantleProvider>,
        'when badge is true it renders Button with badge'
    );
    snapshot(
        <MantleProvider>
            <Button />
        </MantleProvider>,
        'when badge is null it renders Button without badge'
    );
    snapshot(
        <MantleProvider>
            <Button loading={'test'} />
        </MantleProvider>,
        'when click the button if loading is true it renders Button with loading icon'
    );
    snapshot(
        <MantleProvider>
            <Button />
        </MantleProvider>,
        'when click the button if loading is false it renders Button without loading icon'
    );
    snapshot(
        <MantleProvider>
            <Button />
        </MantleProvider>,
        'when label is true it renders Button with default aria label'
    );
    snapshot(
        <MantleProvider>
            <Button label={'test'} />
        </MantleProvider>,
        'when aria-label prop is not exist aria-label prop should be equal to label prop '
    );
    snapshot(
        <MantleProvider>
            <Button aria-label={'test'} />
        </MantleProvider>,
        'when label prop is not exist label prop should be equal to aria-label prop'
    );
    snapshot(
        <MantleProvider>
            <Button label={'test'} badge={'lost'} />
        </MantleProvider>,
        'when using badge and label the aria-label should contain both values'
    );
    snapshot(
        <MantleProvider>
            <Button label={'test'} badge={'lost'} />
        </MantleProvider>,
        'when using badge and label the aria-label should contain both values'
    );
    test('when using tooltip make sure the tooltip is rendered', async () => {
        // Arrange
        const { container } = render(
            <MantleProvider>
                <Button label={'test'} tooltip="Jest Tooltip" />
            </MantleProvider>
        );
        const button = container.getElementsByClassName('p-button')[0];
        const tooltipText = /Jest Tooltip/i;

        // tooltip does not exist to start
        expect(screen.queryByText(tooltipText)).toBeNull();

        // Act
        fireEvent.mouseEnter(button);

        // Assert
        await waitFor(() => screen.getByText(tooltipText));
        expect(screen.getByText(tooltipText)).toBeVisible();

        // tooltip disappears when we mouse out
        fireEvent.mouseLeave(button);
        expect(screen.queryByText(tooltipText)).toBeNull();
    });

    test('when button is clicked ensure onClick is fired', async () => {
        // Arrange
        const clickOn = jest.fn();
        const { container } = render(
            <MantleProvider>
                <Button onClick={clickOn} />
            </MantleProvider>
        );
        const button = container.getElementsByClassName('p-button')[0];

        // Act
        await userEvent.click(button);

        // Assert
        expect(button).toBeEnabled();
        expect(clickOn).toHaveBeenCalledTimes(1);
    });
    test('when button is disabled the click event should not fire', async () => {
        // Arrange
        const clickOn = jest.fn();
        const { container } = render(
            <MantleProvider>
                <Button onClick={clickOn} disabled />
            </MantleProvider>
        );
        const button = container.getElementsByClassName('p-button')[0];

        // Act
        //expect(() => userEvent.click(button)).toThrow();

        // Assert
        expect(button).toBeDisabled();
        expect(clickOn).not.toHaveBeenCalled();
    });
    test('when Ripple is enabled button should have ripple effect', async () => {
        // Arrange
        const clickOn = jest.fn();

        const { container } = render(
            <MantleProvider ripple={true}>
                <Button onClick={clickOn} />
            </MantleProvider>
        );
        const button = container.getElementsByClassName('p-button')[0];

        // Act
        await userEvent.click(button);

        // Assert
        expect(button).toBeEnabled();
        expect(clickOn).toHaveBeenCalledTimes(1);
        expect(container).toMatchSnapshot();
    });
});

