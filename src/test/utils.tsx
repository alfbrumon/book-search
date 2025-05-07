import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Make userEvent work with vi.useFakeTimers()
// See: https://github.com/testing-library/user-event/issues/1115
vi.stubGlobal('jest', {
    advanceTimersByTime: vi.advanceTimersByTime.bind(vi)
});

// Function to setup user event for testing
export function setupUser() {
    return userEvent.setup({
        // Configure to work with fake timers
        advanceTimers: vi.advanceTimersByTime.bind(vi),
        // Ensure user events are accessible
        pointerEventsCheck: 0
    });
}

// Custom render function that includes providers
const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => {
    return render(ui, {
        wrapper: ({ children }) => {
            return (
                <ThemeProvider theme={{}}>
                    {children}
                </ThemeProvider>
            );
        },
        ...options,
    });
};

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render }; 