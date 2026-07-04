import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';
import * as React from 'react';
import { snapshotParent } from '../../test';
import { MantleProvider } from '../api/Api';
import { Panel } from '../panel/Panel';
import { BlockUI } from './BlockUI';

describe('BlockUI', () => {
    snapshotParent(
        <MantleProvider>
            <BlockUI blocked={true} fullScreen />
        </MantleProvider>,
        'block fullscreen'
    );
    snapshotParent(
        <MantleProvider>
            <BlockUI blocked={true}>
                <Panel>blocked</Panel>
            </BlockUI>
        </MantleProvider>,
        'block panel'
    );
    snapshotParent(
        <MantleProvider>
            <BlockUI blocked={false}>
                <Panel>unblocked</Panel>
            </BlockUI>
        </MantleProvider>,
        'unblock panel'
    );
    test('block and unblock panel events', async () => {
        // Arrange
        const ref = React.createRef();
        const { container } = render(
            <MantleProvider>
                <BlockUI ref={ref} blocked={false}>
                    <Panel>unblocked</Panel>
                </BlockUI>
            </MantleProvider>
        );

        // Act
        act(() => {
            ref.current.block();
            ref.current.getElement();
        });

        // Assert
        expect(container).toMatchSnapshot('blocked-event');

        // Act
        act(() => {
            ref.current.unblock();
        });

        // Assert
        expect(container).toMatchSnapshot('unblocked-event');
    });
    test('block and unblock fullscreen events', async () => {
        // Arrange
        const ref = React.createRef();
        const { container } = render(
            <MantleProvider>
                <BlockUI ref={ref} blocked={false} fullScreen />
            </MantleProvider>
        );

        // Act
        act(() => {
            ref.current.block();
        });

        // Assert
        expect(container.parentElement).toMatchSnapshot('blocked-event-fullscreen');

        // Act
        act(() => {
            ref.current.unblock();
        });

        // Assert
        expect(container.parentElement).toMatchSnapshot('unblocked-event-fullscreen');
    });
    snapshotParent(
        <MantleProvider>
            <BlockUI blocked={true} className="block-jest" style={{ cursor: 'move' }} containerClassName="container-jest" containerStyle={{ cursor: 'pointer' }}>
                <Panel>style + class</Panel>
            </BlockUI>
        </MantleProvider>,
        'container style and className'
    );
});
