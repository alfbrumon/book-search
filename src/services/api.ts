import type { BookSearchResponse, SearchParams } from '../types';

const API_URL = 'https://openlibrary.org/search.json';
const MAX_RESULTS = 5; // for now, we'll limit the results

export const searchBooks = async (params: SearchParams): Promise<BookSearchResponse> => {
    const url = new URL(API_URL);
    url.searchParams.append('q', params.q);
    url.searchParams.append('limit', MAX_RESULTS.toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
};
