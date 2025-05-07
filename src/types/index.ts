export interface Book {
    key: string;
    title: string;
    author_name?: string[];
    cover_i?: number;
    first_publish_year?: number;
    publisher?: string[];
    isbn?: string[];
    language?: string[];
    ebook_access?: string;
    edition_count?: number;
}

export interface BookSearchResponse {
    numFound: number;
    start: number;
    numFoundExact: boolean;
    docs: Book[];
}

export interface SearchParams {
    q: string;
    page?: number;
    limit?: number;
    sort?: string;
}
