import { fireEvent, render } from '@testing-library/react';
import { Calendar } from './Calendar';

describe('Calendar child identity', () => {
    it('renders and navigates built-in views without missing child keys', () => {
        const errors = jest.spyOn(console, 'error').mockImplementation(() => {});
        const warningsByView = [];

        try {
            for (const props of [{}, { showWeek: true }, { numberOfMonths: 2 }, { showTime: true }, { timeOnly: true }, { view: 'month' }, { view: 'year' }, { monthNavigator: true, yearNavigator: true, yearRange: '2020:2030' }]) {
                const start = errors.mock.calls.length;
                const { container, unmount } = render(<Calendar inline value={new Date(2026, 9, 14)} {...props} />);

                const next = container.querySelector('.p-datepicker-next');

                if (next) fireEvent.click(next);
                unmount();
                const messages = errors.mock.calls.slice(start).filter((call) => call.some((value) => typeof value === 'string' && /unique.*key|same key/.test(value)));

                if (messages.length) warningsByView.push({ props, messages });
            }

            const keyWarnings = errors.mock.calls.filter((call) => call.some((value) => typeof value === 'string' && /unique.*key|same key/.test(value)));

            expect({ keyWarnings, warningsByView }).toEqual({ keyWarnings: [], warningsByView: [] });
        } finally {
            errors.mockRestore();
        }
    });
});
