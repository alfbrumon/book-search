import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, setupUser, within } from '../../test/utils';
import type { UserEvent } from '@testing-library/user-event';
import SearchBar from './index';

describe('SearchBar', () => {
    const onSearchMock = vi.fn();
    let user: UserEvent;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        user = setupUser();
    });

    afterEach(() => {
        // Flush any pending timers before switching to real timers
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('renders correctly', () => {
        render(<SearchBar onSearch={onSearchMock} />);

        const searchInput = screen.getByRole('textbox');
        expect(searchInput).toBeInTheDocument();
        expect(searchInput).toHaveAttribute('placeholder', 'Quick search...');
    });

    it('calls onSearch after user stops typing for 300ms', async () => {
        const { container } = render(<SearchBar onSearch={onSearchMock} />);

        const searchContainer = within(container.firstChild as HTMLElement);
        const searchInput = searchContainer.getByRole('textbox');

        await user.type(searchInput, 'test query');

        // Fast-forward timers by 300ms
        act(() => {
            vi.advanceTimersByTime(300);
        });

        // Verify onSearch was called with the correct value
        expect(onSearchMock).toHaveBeenCalledWith('test query');
        expect(onSearchMock).toHaveBeenCalledTimes(1);
    });

    it('does not call onSearch for empty query', async () => {
        render(<SearchBar onSearch={onSearchMock} />);
        const searchInput = screen.getByRole('textbox');

        // Type spaces only
        await user.type(searchInput, '   ');

        // Fast-forward timers
        act(() => {
            vi.advanceTimersByTime(300);
        });

        // Ensure onSearch wasn't called
        expect(onSearchMock).not.toHaveBeenCalled();
    });

    it('calls onSearch with empty string when clearing input', async () => {
        render(<SearchBar onSearch={onSearchMock} />);
        const searchInput = screen.getByRole('textbox');

        // Type in the search input
        await user.type(searchInput, 'test query');

        // Fast-forward timers
        act(() => {
            vi.advanceTimersByTime(300);
        });

        // Clear the input
        await user.clear(searchInput);

        // Fast-forward timers again
        act(() => {
            vi.advanceTimersByTime(300);
        });

        // Verify onSearch was called with empty string when cleared
        expect(onSearchMock).toHaveBeenCalledWith('');
    });

    it('debounces search requests', async () => {
        render(<SearchBar onSearch={onSearchMock} />);
        const searchInput = screen.getByRole('textbox');

        await user.type(searchInput, 't');

        act(() => {
            vi.advanceTimersByTime(100);
        });

        await user.type(searchInput, 'e');

        act(() => {
            vi.advanceTimersByTime(100);
        });

        await user.type(searchInput, 's');

        act(() => {
            vi.advanceTimersByTime(100);
        });

        await user.type(searchInput, 't');

        // At this point, no search should have happened yet
        expect(onSearchMock).not.toHaveBeenCalled();

        // Now wait for debounce to complete
        act(() => {
            vi.advanceTimersByTime(300);
        });

        // Verify only one search happened with the final value
        expect(onSearchMock).toHaveBeenCalledTimes(1);
        expect(onSearchMock).toHaveBeenCalledWith('test');
    });

    it('handles keyboard navigation with custom keyDown handler', async () => {
        const onKeyDownMock = vi.fn();
        render(<SearchBar onSearch={onSearchMock} onKeyDown={onKeyDownMock} />);
        const searchInput = screen.getByRole('textbox');

        await user.click(searchInput);

        await user.keyboard('{ArrowDown}');

        // Verify the custom keyDown handler was called
        expect(onKeyDownMock).toHaveBeenCalled();
    });

    it('accepts custom id for the input element', () => {
        render(<SearchBar onSearch={onSearchMock} id="custom-search-id" />);

        const searchInput = screen.getByRole('textbox');
        expect(searchInput).toHaveAttribute('id', 'custom-search-id');
    });

    it('does not call onSearch for the same query twice', async () => {
        render(<SearchBar onSearch={onSearchMock} />);
        const searchInput = screen.getByRole('textbox');

        await user.type(searchInput, 'test query');

        act(() => {
            vi.advanceTimersByTime(300);
        });

        // Verify first call
        expect(onSearchMock).toHaveBeenCalledTimes(1);

        // Clear the mock to start fresh
        onSearchMock.mockClear();

        // select all text before deleting
        await user.tripleClick(searchInput);
        await user.keyboard('{Delete}');

        act(() => {
            vi.advanceTimersByTime(300);
        });

        await user.type(searchInput, 'test query');

        act(() => {
            vi.advanceTimersByTime(300);
        });

        // Verify onSearch is called with the new identical query
        expect(onSearchMock).toHaveBeenCalledTimes(2);
    });
}); 