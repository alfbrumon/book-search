import axios from 'axios';
import type { BookSearchResponse, SearchParams } from '../types';

const API_URL = 'https://openlibrary.org/search.json';
const MAX_RESULTS = 5; // for now, we'll limit the results
export const searchBooks = async (params: SearchParams): Promise<BookSearchResponse> => {
    const response = await axios.get<BookSearchResponse>(API_URL, {
        params: { q: params.q, limit: MAX_RESULTS }
    });

    return response.data;
};
