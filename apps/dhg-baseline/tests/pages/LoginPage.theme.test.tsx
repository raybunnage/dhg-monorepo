import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { createContext } from 'react';

// Mock AuthContext
const MockAuthContext = createContext({
  isLoggedIn: false,
  toggleLogin: () => {},
});

const MockAuthProvider = ({ children }: { children: React.ReactNode }) => (
  <MockAuthContext.Provider value={{ isLoggedIn: false, toggleLogin: () => {} }}>
    {children}
  </MockAuthContext.Provider>
);

describe('Minimal Test', () => {
  it('should render with mocked auth', () => {
    render(
      <BrowserRouter>
        <MockAuthProvider>
          <div>Test</div>
        </MockAuthProvider>
      </BrowserRouter>
    );
  });
}); 