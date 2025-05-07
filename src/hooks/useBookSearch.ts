import { useState, useCallback } from 'react';
import type { Book } from '../types';
import { searchBooks } from '../services/api';

interface UseBookSearchReturn {
    books: Book[];
    loading: boolean;
    error: Error | null;
    search: (query: string) => void;
}

const useBookSearch = (): UseBookSearchReturn => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const search = useCallback(async (query: string) => {
        // Trim the query and check if it's empty
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            setBooks([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await searchBooks({ q: trimmedQuery });

            if (response && response.docs) {
                setBooks(response.docs);
            } else {
                throw new Error('Invalid response format from API');
            }
        } catch (err) {
            console.error('Error fetching books:', err);
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            setBooks([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        books,
        loading,
        error,
        search
    };
};

export default useBookSearch; 