import styled from 'styled-components';
import type { Book } from '../../types';

interface SearchResultsProps {
  books: Book[];
  loading: boolean;
  error: Error | null;
}

const ResultsContainer = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  overflow: hidden;
  max-height: 20rem;
  overflow-y: auto;
  isolation: isolate;
  margin-top: -1px;
`;

const ResultItem = styled.a`
  display: flex;
  align-items: flex-start;
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  text-decoration: none;
  color: inherit;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: var(--color-background);
    cursor: pointer;
    text-decoration: none;
  }
`;

const BookThumbnail = styled.div`
  width: 3rem;
  height: 3.6rem;
  background-color: var(--color-header-bg);
  margin-right: 0.75rem;
`;

const BookCoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const BookInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const BookTitle = styled.div`
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BookAuthor = styled.div`
  color: var(--color-text-light);
  font-size: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Message = styled.div`
  padding: 1rem;
  text-align: center;
  color: var(--color-text-light);
  font-size: 0.875rem;
`;

const loadingMessages = [
  "Rummaging through the shelves...",
  "Interrogating the librarians...",
  "Dusting off ancient tomes...",
  "Bribing the bookworms for intel...",
  "Investigating the literary suspects...",
  "Stalking rare editions in the wild...",
  "Summoning books from the void...",
  "Consulting the oracle of literature...",
  "Hunting the elusive first editions...",
  "Decoding the Dewey Decimal mystery...",
  "Poking bookmarks for clues...",
  "Speed-dating book covers...",
  "Negotiating with stubborn book spines...",
  "Persuading shy novels to appear...",
  "Luring books with reading glasses...",
  "Sending carrier pigeons to distant libraries...",
  "Translating librarian whispers...",
  "Scanning bookshelves at warp speed...",
  "Tickling the index for answers...",
  "Charming books out of hiding..."
];
const SearchResults = ({ books, loading, error }: SearchResultsProps) => {
  const getAmazonSearchUrl = (book: Book) => {
    const titleQuery = encodeURIComponent(book.title);
    const authorQuery = book.author_name && book.author_name.length > 0
      ? encodeURIComponent(book.author_name[0])
      : '';

    let searchQuery = titleQuery;
    if (authorQuery) {
      searchQuery += `+${authorQuery}`;
    }
    // i=stripbooks specifies that the search should be performed within the "Books" department
    return `https://www.amazon.com/s?k=${searchQuery}&i=stripbooks`;
  };

  if (loading) {
    return (
      <ResultsContainer>
        <Message>{loadingMessages[Math.floor(Math.random() * loadingMessages.length)]}</Message>
      </ResultsContainer>
    );
  }

  if (error) {
    return (
      <ResultsContainer>
        <Message>Error: {error.message}</Message>
      </ResultsContainer>
    );
  }

  if (books.length === 0) {
    return (
      <ResultsContainer>
        <Message>No results found. </Message>
      </ResultsContainer>
    );
  }

  return (
    <ResultsContainer>
      {books.map((book) => (
        <ResultItem
          key={book.key}
          href={getAmazonSearchUrl(book)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <BookThumbnail>
            {book.cover_i && (
              <BookCoverImage
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                alt={book.title}
              />
            )}
          </BookThumbnail>
          <BookInfo>
            <BookTitle>{book.title}</BookTitle>
            <BookAuthor>{book.author_name ? book.author_name.join(', ') : 'Unknown author'}</BookAuthor>
          </BookInfo>
        </ResultItem>
      ))}
    </ResultsContainer>
  );
};

export default SearchResults; 