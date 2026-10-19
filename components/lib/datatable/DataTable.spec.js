import * as React from 'react';
import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MantleProvider } from '../api/Api';
import { Column } from '../column/Column';
import { TabPanel, TabView } from '../tabview/TabView';
import { DataTable } from './DataTable';

const records = [
    { id: 1, name: 'Alpha' },
    { id: 2, name: 'Beta' },
    { id: 3, name: 'Gamma' },
    { id: 4, name: 'Delta' }
];
const savedState = {
    first: 0,
    rows: 2,
    sortField: 'name',
    sortOrder: 1,
    multiSortMeta: [],
    filters: { name: { value: 'a', matchMode: 'contains' } },
    columnOrder: ['name', 'id'],
    expandedRows: { 1: true },
    selection: records[0]
};

function StatefulTable({ controlled = false, ...props }) {
    const [selection, setSelection] = React.useState(null);
    const [expandedRows, setExpandedRows] = React.useState(null);
    const [page, setPage] = React.useState({ first: 0, rows: 4 });
    const [sort, setSort] = React.useState({ sortField: null, sortOrder: null });
    const [filters, setFilters] = React.useState(null);
    const controlledProps = controlled
        ? {
              ...page,
              ...sort,
              filters,
              onPage: (event) => setPage({ first: event.first, rows: event.rows }),
              onSort: (event) => setSort({ sortField: event.sortField, sortOrder: event.sortOrder }),
              onFilter: (event) => setFilters(event.filters)
          }
        : {};

    return (
        <DataTable
            value={records}
            dataKey="id"
            paginator
            rows={4}
            reorderableColumns
            selectionMode="single"
            selection={selection}
            onSelectionChange={(event) => setSelection(event.value)}
            expandedRows={expandedRows}
            onRowToggle={(event) => setExpandedRows(event.data)}
            {...controlledProps}
            {...props}
        >
            <Column field="id" header="ID" />
            <Column field="name" header="Name" sortable />
        </DataTable>
    );
}

describe.each([false, true])('DataTable state restoration (StrictMode: %s)', (strict) => {
    const Wrapper = strict ? React.StrictMode : React.Fragment;

    afterEach(() => {
        cleanup();
        sessionStorage.clear();
        localStorage.clear();
    });

    it.each(['session', 'local', 'custom'])('restores %s state before any save and continues saving changes', (storageType) => {
        const stateKey = `restore-${storageType}-${strict}`;
        const storage = storageType === 'local' ? localStorage : sessionStorage;
        let customState = savedState;
        const onStateRestore = jest.fn();
        const onStateSave = jest.fn();
        const customRestoreState = jest.fn(() => customState);
        const customSaveState = jest.fn((state) => {
            customState = state;
        });
        const readState = () => (storageType === 'custom' ? customState : JSON.parse(storage.getItem(stateKey)));

        storage.setItem(stateKey, JSON.stringify(savedState));
        render(
            <Wrapper>
                <MantleProvider>
                    <StatefulTable stateStorage={storageType} stateKey={stateKey} customRestoreState={customRestoreState} customSaveState={customSaveState} onStateRestore={onStateRestore} onStateSave={onStateSave} />
                </MantleProvider>
            </Wrapper>
        );

        expect(onStateRestore).toHaveBeenCalledTimes(1);
        expect(onStateRestore).toHaveBeenCalledWith(savedState);
        expect(screen.getByText('Alpha').closest('tr')).toHaveAttribute('aria-selected', 'true');
        expect(screen.queryByText('Gamma')).not.toBeInTheDocument();
        expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual(['Name', 'ID']);
        expect(readState()).toEqual(savedState);
        expect(onStateSave).toHaveBeenCalled();
        onStateSave.mock.calls.forEach(([state]) => expect(state).toEqual(savedState));

        if (storageType === 'custom') {
            expect(customRestoreState).toHaveBeenCalledTimes(1);
            expect(customSaveState).toHaveBeenCalled();
        }

        fireEvent.click(screen.getByText('Beta'));
        expect(readState()).toEqual({ ...savedState, selection: records[1] });
        fireEvent.click(screen.getByRole('button', { name: 'Next Page' }));
        expect(readState()).toEqual({ ...savedState, first: 2, selection: records[1] });
        fireEvent.click(screen.getByRole('columnheader', { name: 'Name' }));
        expect(readState()).toEqual({ ...savedState, sortOrder: -1, selection: records[1] });
    });

    it('restores controlled state without a provider before saving', () => {
        const stateKey = `controlled-${strict}`;
        const onStateSave = jest.fn();
        const { multiSortMeta, ...singleSortState } = savedState;

        sessionStorage.setItem(stateKey, JSON.stringify(singleSortState));
        render(
            <Wrapper>
                <StatefulTable controlled stateKey={stateKey} stateStorage="session" onStateSave={onStateSave} />
            </Wrapper>
        );

        expect(screen.getByText('Alpha').closest('tr')).toHaveAttribute('aria-selected', 'true');
        expect(onStateSave).toHaveBeenCalled();
        onStateSave.mock.calls.forEach(([state]) => expect(state).toEqual(savedState));
        fireEvent.click(screen.getByText('Beta'));
        expect(JSON.parse(sessionStorage.getItem(stateKey))).toEqual({ ...savedState, selection: records[1] });
    });

    it('restores multiple sort fields and a nonzero page', () => {
        const stateKey = `multiple-sort-${strict}`;
        const { sortField, sortOrder, ...state } = savedState;
        const multipleSortState = {
            ...state,
            first: 2,
            selection: records[2],
            multiSortMeta: [
                { field: 'name', order: 1 },
                { field: 'id', order: -1 }
            ]
        };
        const onStateSave = jest.fn();

        sessionStorage.setItem(stateKey, JSON.stringify(multipleSortState));
        render(
            <Wrapper>
                <StatefulTable stateKey={stateKey} sortMode="multiple" onStateSave={onStateSave} />
            </Wrapper>
        );

        expect(screen.getByText('Gamma').closest('tr')).toHaveAttribute('aria-selected', 'true');
        expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
        expect(onStateSave).toHaveBeenCalled();
        onStateSave.mock.calls.forEach(([saved]) => expect(saved).toEqual(multipleSortState));
        fireEvent.click(screen.getByRole('button', { name: 'Previous Page' }));
        expect(JSON.parse(sessionStorage.getItem(stateKey))).toEqual({ ...multipleSortState, first: 0 });
    });

    it('saves subsequent selection when no state has been stored yet', () => {
        const stateKey = `empty-${strict}`;

        render(
            <Wrapper>
                <StatefulTable stateKey={stateKey} />
            </Wrapper>
        );
        fireEvent.click(screen.getByText('Beta'));
        expect(JSON.parse(sessionStorage.getItem(stateKey))).toMatchObject({ first: 0, rows: 4, selection: records[1] });
    });

    it.each(['session', 'custom'])('restores %s state on lazy TabView activation and remount', (storageType) => {
        const stateKey = `tab-${storageType}-${strict}`;
        let customState = savedState;
        const onStateRestore = jest.fn();
        const onStateSave = jest.fn();
        const customRestoreState = () => customState;

        const customSaveState = (state) => {
            customState = state;
        };

        const readState = () => (storageType === 'custom' ? customState : JSON.parse(sessionStorage.getItem(stateKey)));

        sessionStorage.setItem(stateKey, JSON.stringify(savedState));
        render(
            <Wrapper>
                <MantleProvider>
                    <TabView renderActiveOnly>
                        <TabPanel header="Other">Other content</TabPanel>
                        <TabPanel header="Table">
                            <StatefulTable stateStorage={storageType} stateKey={stateKey} customRestoreState={customRestoreState} customSaveState={customSaveState} onStateRestore={onStateRestore} onStateSave={onStateSave} />
                        </TabPanel>
                    </TabView>
                </MantleProvider>
            </Wrapper>
        );

        expect(onStateRestore).not.toHaveBeenCalled();
        expect(onStateSave).not.toHaveBeenCalled();
        fireEvent.click(screen.getByRole('tab', { name: 'Table' }));
        expect(onStateRestore).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Alpha').closest('tr')).toHaveAttribute('aria-selected', 'true');
        onStateSave.mock.calls.forEach(([state]) => expect(state).toEqual(savedState));
        fireEvent.click(screen.getByText('Beta'));
        expect(readState()).toEqual({ ...savedState, selection: records[1] });
        fireEvent.click(screen.getByRole('tab', { name: 'Other' }));
        expect(screen.queryByText('Beta')).not.toBeInTheDocument();
        onStateSave.mockClear();
        fireEvent.click(screen.getByRole('tab', { name: 'Table' }));
        expect(onStateRestore).toHaveBeenCalledTimes(2);
        expect(screen.getByText('Beta').closest('tr')).toHaveAttribute('aria-selected', 'true');
        expect(onStateSave).toHaveBeenCalled();
        onStateSave.mock.calls.forEach(([state]) => expect(state).toEqual({ ...savedState, selection: records[1] }));
    });
});
