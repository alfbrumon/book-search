import { describe, it, expect, vi, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';
import { render, screen, waitForElementToBeRemoved, setupUser } from './test/utils';
import type { UserEvent } from '@testing-library/user-event';
import App from './App';
import { server } from './test/mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// Reset any request handlers that we may add during the tests
afterEach(() => {
    server.resetHandlers();
    vi.restoreAllMocks();
    // Clean up timers
    vi.clearAllTimers();
    vi.useRealTimers();
});
// Clean up after the tests
afterAll(() => server.close());

describe('App', () => {
    let user: UserEvent;

    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: false });
        user = setupUser();
    });

    it('renders the header with logo', () => {
        render(<App />);
        expect(screen.getByText('App')).toBeVisible();
    });

    it('renders the search bar', () => {
        render(<App />);
        expect(screen.getByRole('textbox')).toBeVisible();
    });

    it('displays search results when searching', async () => {
        render(<App />);

        const searchInput = screen.getByRole('textbox');

        // Type a search query
        await user.type(searchInput, 'test query');

        const book1 = await screen.findByText('Test Book 1');
        expect(book1).toBeVisible();
        expect(screen.getByText('Test Book 2')).toBeVisible();
    });

    it('hides search results when search is cleared', async () => {
        render(<App />);

        const searchInput = screen.getByRole('textbox');

        await user.type(searchInput, 'test query');

        const book1 = await screen.findByText('Test Book 1');
        expect(book1).toBeVisible();

        await user.clear(searchInput);

        await waitForElementToBeRemoved(() => screen.queryByText('Test Book 1'));
    });

    it('shows search results container when searching', async () => {
        render(<App />);

        const searchInput = screen.getByRole('textbox');

        // Initially no search results should be in the document
        expect(screen.queryByText('Test Book 1')).not.toBeInTheDocument();

        await user.type(searchInput, 'test query');

        const book1 = await screen.findByText('Test Book 1');
        expect(book1).toBeVisible();
    });

    it('displays error state when search fails', async () => {
        // Temporarily suppress console.error during this test
        const originalConsoleError = console.error;
        console.error = vi.fn();

        try {
            render(<App />);

            const searchInput = screen.getByRole('textbox');

            // Type the error-triggering query
            await user.type(searchInput, 'error');

            const errorMessage = await screen.findByText(/Error:/i);
            expect(errorMessage).toBeVisible();
        } finally {
            // Restore console.error
            console.error = originalConsoleError;
        }
    });

    it('renders main content', () => {
        render(<App />);
        expect(screen.getByText('App content')).toBeVisible();
    });
}); 