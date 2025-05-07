import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --color-primary: #4a6fa5;
    --color-primary-light: rgba(74, 111, 165, 0.2);
    --color-text: #333;
    --color-text-light: #666;
    --color-placeholder: #999;
    --color-background: #f8f9fa;
    --color-card: #ffffff;
    --color-border: #e1e4e8;
    --color-header-bg: #f0f0f0;
    --color-input-bg: #ffffff;
    
    --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    --border-radius: 4px;
    
    --font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
  
  body {
    font-family: var(--font-primary);
    background-color: var(--color-background);
    color: var(--color-text);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    isolation: isolate; /* Create stacking context for the app */
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.25;
    margin-bottom: 0.5rem;
  }
  
  a {
    color: var(--color-primary);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  button {
    cursor: pointer;
  }

  #root {
    width: 100%;
    height: 100%;
    isolation: isolate; /* Create a stacking context for proper layer handling */
  }
`;

export default GlobalStyles; 