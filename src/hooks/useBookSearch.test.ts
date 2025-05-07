import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import useBookSearch from './useBookSearch';
import * as api from '../services/api';
import { server } from '../test/mocks/server';
import { successfulResponse } from '../test/mocks/handlers';

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// Reset any request handlers that we may add during the tests
afterEach(() => {
    server.resetHandlers();
    vi.restoreAllMocks();
});
// Clean up after the tests
afterAll(() => server.close());

describe('useBookSearch', () => {
    it('should initialize with empty books, no loading state and no error', () => {
        const { result } = renderHook(() => useBookSearch());

        expect(result.current.books).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should fetch books successfully for valid query', async () => {
        const { result } = renderHook(() => useBookSearch());

        // Call the search function with a valid query
        await act(async () => {
            result.current.search('valid-query');
        });

        // Wait for the API call to complete and books to be populated
        await waitFor(() => {
            expect(result.current.books.length).toBeGreaterThan(0);
        });

        // Verify books are fetched and no error
        expect(result.current.books).toEqual(successfulResponse.docs);
        expect(result.current.error).toBeNull();
    });

    it('should handle empty results gracefully', async () => {
        const { result } = renderHook(() => useBookSearch());

        // Call the search function with 'empty' query which returns empty results
        await act(async () => {
            result.current.search('empty');
        });

        // Wait for the API call to complete
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Verify empty books array and no error
        expect(result.current.books).toEqual([]);
        expect(result.current.error).toBeNull();
    });

    it('should handle server errors', async () => {
        const { result } = renderHook(() => useBookSearch());

        // Spy on console.error to avoid test output noise
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        // Call the search function with 'error' query which triggers a server error
        await act(async () => {
            result.current.search('error');
        });

        // Wait for the API call to complete and verify books array is empty
        await waitFor(() => {
            expect(result.current.books).toEqual([]);
        });

        // Restore console.error
        consoleErrorSpy.mockRestore();
    });

    it('should handle invalid response format', async () => {
        const { result } = renderHook(() => useBookSearch());

        // Spy on console.error to avoid test output noise
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        // Call the search function with 'invalid' query which returns an invalid response
        await act(async () => {
            result.current.search('invalid');
        });

        // Wait for the API call to complete
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Verify books array is empty
        expect(result.current.books).toEqual([]);

        // Restore console.error
        consoleErrorSpy.mockRestore();
    });

    it('should do nothing for empty query', async () => {
        const { result } = renderHook(() => useBookSearch());

        // Mock console.error to prevent it from appearing in test output
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        // Initial state
        expect(result.current.books).toEqual([]);
        expect(result.current.loading).toBe(false);

        // Call the search function with empty query
        await act(async () => {
            result.current.search('');
        });

        // Verify the state doesn't change
        expect(result.current.loading).toBe(false);
        expect(result.current.books).toEqual([]);

        // Restore console.error
        consoleErrorSpy.mockRestore();
    });

    it('should handle whitespace-only query', async () => {
        const { result } = renderHook(() => useBookSearch());

        // Call the search function with whitespace-only query
        await act(async () => {
            result.current.search('   ');
        });

        // Verify the state doesn't change since it's trimmed to empty
        expect(result.current.loading).toBe(false);
        expect(result.current.books).toEqual([]);
    });

    it('should update books when search completes', async () => {
        const { result } = renderHook(() => useBookSearch());

        // First search
        await act(async () => {
            result.current.search('first-query');
        });

        // Wait for first search to complete
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Second search
        await act(async () => {
            result.current.search('second-query');
        });

        // Wait for second search to complete
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Verify new results
        expect(result.current.books).toEqual(successfulResponse.docs);
    });

    it('should handle non-Error objects thrown', async () => {
        const { result } = renderHook(() => useBookSearch());

        // Mock searchBooks to throw a non-Error object
        const searchBooksMock = vi.spyOn(api, 'searchBooks').mockImplementation(() => {
            throw 'This is a string, not an Error object';
        });

        // Spy on console.error to avoid test output noise
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        // Call the search function
        await act(async () => {
            result.current.search('any-query');
        });

        // Wait for the error state to be set
        await waitFor(() => {
            expect(result.current.error).not.toBeNull();
        });

        // Verify the error is properly created from the non-Error object
        expect(result.current.error?.message).toBe('An unknown error occurred');
        expect(result.current.books).toEqual([]);
        expect(result.current.loading).toBe(false);

        // Restore mocks
        searchBooksMock.mockRestore();
        consoleErrorSpy.mockRestore();
    });
}); 