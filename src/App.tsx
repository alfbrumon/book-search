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
  grid-template-columns: 1fr 0;
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
  position: relative;
`;

const Logo = styled.div`
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--color-text);
`;

const SearchArea = styled.div`
  width: 15rem;
  position: relative;
`;

const ResultsWrapper = styled.div`
  grid-area: results;
  align-self: start;
  justify-self: end;
  margin-right: 1rem;
  width: 22rem;
  display: flex;
  flex-direction: column;
`;

const ResultsContainer = styled.div`
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
`;

const Arrow = styled.div`
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid white;
  margin-left: auto;
  margin-right: 7.5rem;
  position: relative;
  z-index: 1;
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
            <ResultsContainer>
              <Arrow />
              <SearchResults
                books={books}
                loading={loading}
                error={error}
              />
            </ResultsContainer>
          </ResultsWrapper>
        )}
      </AppContainer>
    </>
  );
};

export default App;