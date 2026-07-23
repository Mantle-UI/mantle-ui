import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MantleProvider } from '../api/Api';
import { ListBox } from './ListBox';

describe('ListBox', () => {
    test('provides a default accessible name for the listbox', () => {
        render(
            <MantleProvider>
                <ListBox options={['Amsterdam']} />
            </MantleProvider>
        );

        expect(screen.getByRole('listbox', { name: 'Option List' })).toBeInTheDocument();
    });

    test('uses an explicit accessible name when provided', () => {
        render(
            <MantleProvider>
                <ListBox aria-label="Cities" options={['Amsterdam']} />
            </MantleProvider>
        );

        expect(screen.getByRole('listbox', { name: 'Cities' })).toBeInTheDocument();
    });
});
