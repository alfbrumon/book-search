import { http, HttpResponse } from 'msw';
import type { BookSearchResponse } from '../../types';

// Define mock responses
export const successfulResponse: BookSearchResponse = {
    numFound: 2,
    start: 0,
    numFoundExact: true,
    docs: [
        {
            key: '/works/OL1234567M',
            title: 'Test Book 1',
            author_name: ['Test Author 1'],
            cover_i: 12345,
            first_publish_year: 2020
        },
        {
            key: '/works/OL7654321M',
            title: 'Test Book 2',
            author_name: ['Test Author 2'],
            cover_i: 54321,
            first_publish_year: 2021
        }
    ]
};

export const emptyResponse: BookSearchResponse = {
    numFound: 0,
    start: 0,
    numFoundExact: true,
    docs: []
};

export const invalidResponse = {
    error: 'Invalid response format'
};

// Define the api endpoint
const API_URL = 'https://openlibrary.org/search.json';

// Define request handlers
export const handlers = [
    // Success handler
    http.get(API_URL, ({ request }) => {
        const url = new URL(request.url);
        const query = url.searchParams.get('q');

        // Return empty results for 'empty' query
        if (query === 'empty') {
            return HttpResponse.json(emptyResponse);
        }

        // Return error for 'error' query
        if (query === 'error') {
            return new HttpResponse(null, { status: 500 });
        }

        // Return invalid response for 'invalid' query
        if (query === 'invalid') {
            return HttpResponse.json(invalidResponse);
        }

        // Return successful response for other queries
        return HttpResponse.json(successfulResponse);
    })
]; 