import { useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import styled from 'styled-components';

interface SearchBarProps {
    onSearch: (query: string) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    id?: string;
}

const SearchContainer = styled.div`
  display: flex;
  width: 100%;
`;

const SearchInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  width: 100%;
  font-size: 0.875rem;
  background-color: #f0f0f0;
  color: var(--color-text);
  transition: all 0.2s ease;
  
  &::placeholder {
    color: var(--color-placeholder);
  }
  
  &:focus {
    outline: none;
    background-color: var(--color-input-bg);
    border-color: var(--color-primary);
    box-shadow: 0 0 0 1px var(--color-primary-light);
  }
`;

const SearchBar = ({ onSearch, onKeyDown, id }: SearchBarProps) => {
    const [query, setQuery] = useState('');
    const [prevQuery, setPrevQuery] = useState('');

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            const trimmedQuery = query.trim();

            if (trimmedQuery && trimmedQuery !== prevQuery) {
                setPrevQuery(trimmedQuery);
                onSearch(trimmedQuery);
            } else if (!trimmedQuery && prevQuery !== '') {
                setPrevQuery('');
                onSearch('');
            }
        }, 300);

        return () => {
            clearTimeout(debounceTimeout);
        };
    }, [query, prevQuery, onSearch]);

    return (
        <SearchContainer>
            <SearchInput
                id={id}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Quick search..."
            />
        </SearchContainer>
    );
};

export default SearchBar;
