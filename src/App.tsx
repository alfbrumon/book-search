import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import useBookSearch from './hooks/useBookSearch';
import { useState } from 'react';

const AppContainer = styled.div`
  display: grid;
  grid-template-areas:
    "header header"
    "content results";
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr;
  height: 100vh;
  width: 100%;
`;

const Header = styled.header`
  grid-area: header;
  background-color: var(--color-header-bg);
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid var(--color-border);
`;

const Logo = styled.div`
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--color-text);
`;

const SearchArea = styled.div`
  width: 15rem;
`;

const ResultsWrapper = styled.div`
  grid-area: results;
  align-self: start;
  margin-top: 0.5rem;
  margin-right: 1rem;
  width: 15rem;
`;

const ContentArea = styled.div`
  grid-area: content;
  padding: 1rem;
  background-color: var(--color-background);
  overflow: auto;
`;

const MainContent = styled.div`
  width: 100%;
  height: 100%;
  background: var(--color-card);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1rem;
`;

const App = () => {
  const { books, loading, error, search } = useBookSearch();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setIsSearching(!!query);
    search(query);
  };

  return (
    <>
      <GlobalStyles />
      <AppContainer>
        <Header>
          <Logo>App</Logo>
          <SearchArea>
            <SearchBar onSearch={handleSearch} />
          </SearchArea>
        </Header>
        <ContentArea>
          <MainContent>
            <div>App content</div>
          </MainContent>
        </ContentArea>
        {isSearching && (
          <ResultsWrapper>
            <SearchResults
              books={books}
              loading={loading}
              error={error}
            />
          </ResultsWrapper>
        )}
      </AppContainer>
    </>
  );
};

export default App;
