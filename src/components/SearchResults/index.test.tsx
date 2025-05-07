import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import SearchResults from './index';
import { successfulResponse } from '../../test/mocks/handlers';

describe('SearchResults', () => {
    it('renders loading state correctly', () => {
        render(<SearchResults books={[]} loading error={null} />);

        // Check for loading message (one of the random loading messages)
        const loadingElement = screen.getByText(/.*\.\.\./i); // Any text ending with "..."
        expect(loadingElement).toBeVisible();
    });

    it('renders error state correctly', () => {
        const testError = new Error('Test error message');
        render(<SearchResults books={[]} loading={false} error={testError} />);

        const errorElement = screen.getByText(/Error: Test error message/i);
        expect(errorElement).toBeVisible();
    });

    it('renders empty state correctly', () => {
        render(<SearchResults books={[]} loading={false} error={null} />);

        const emptyElement = screen.getByText(/No results found/i);
        expect(emptyElement).toBeVisible();
    });

    it('renders book list correctly', () => {
        const books = successfulResponse.docs;
        render(<SearchResults books={books} loading={false} error={null} />);

        // Check for book titles
        expect(screen.getByText('Test Book 1')).toBeVisible();
        expect(screen.getByText('Test Book 2')).toBeVisible();

        // Check for author names
        expect(screen.getByText('Test Author 1')).toBeVisible();
        expect(screen.getByText('Test Author 2')).toBeVisible();
    });

    it('renders book links with correct amazon urls', () => {
        const books = successfulResponse.docs;
        const { container } = render(<SearchResults books={books} loading={false} error={null} />);

        // Check for Amazon search links
        const links = container.querySelectorAll('a');
        expect(links.length).toBe(2);

        // Test first link
        expect(links[0]).toHaveAttribute(
            'href',
            expect.stringContaining('https://www.amazon.com/s?k=Test%20Book%201+Test%20Author%201&i=stripbooks')
        );

        // Test second link
        expect(links[1]).toHaveAttribute(
            'href',
            expect.stringContaining('https://www.amazon.com/s?k=Test%20Book%202+Test%20Author%202&i=stripbooks')
        );
    });

    it('opens amazon links in new tab', () => {
        const books = successfulResponse.docs;
        const { container } = render(<SearchResults books={books} loading={false} error={null} />);

        const links = container.querySelectorAll('a');

        // Check that links have target="_blank" and rel attributes
        expect(links[0]).toHaveAttribute('target', '_blank');
        expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('displays placeholder for books without cover images', () => {
        const booksWithoutCovers = [
            {
                key: '/works/test123',
                title: 'Book Without Cover',
                author_name: ['No Cover Author']
            }
        ];

        const { container } = render(<SearchResults books={booksWithoutCovers} loading={false} error={null} />);

        // Verify the book title and author are displayed
        expect(screen.getByText('Book Without Cover')).toBeVisible();
        expect(screen.getByText('No Cover Author')).toBeVisible();

        // Check that we have a BookThumbnail element even without cover
        // This looks for any div that has styles from the BookThumbnail styled component
        const bookItems = container.querySelectorAll('a');
        expect(bookItems.length).toBe(1);
    });

    it('displays "Unknown author" for books without author information', () => {
        const booksWithoutAuthor = [
            {
                key: '/works/noauthor',
                title: 'Book Without Author'
            }
        ];

        render(<SearchResults books={booksWithoutAuthor} loading={false} error={null} />);

        // Verify the book title is displayed
        expect(screen.getByText('Book Without Author')).toBeVisible();

        // Verify the "Unknown author" text is displayed
        expect(screen.getByText('Unknown author')).toBeVisible();
    });

    it('handles multiple authors correctly', () => {
        const booksWithMultipleAuthors = [
            {
                key: '/works/multiauthor',
                title: 'Book With Multiple Authors',
                author_name: ['First Author', 'Second Author', 'Third Author']
            }
        ];

        render(<SearchResults books={booksWithMultipleAuthors} loading={false} error={null} />);

        // Verify the book title is displayed
        expect(screen.getByText('Book With Multiple Authors')).toBeVisible();

        // Verify all authors are displayed (joined with commas)
        expect(screen.getByText('First Author, Second Author, Third Author')).toBeVisible();
    });
}); 