import React from 'react';
import { render, RenderOptions, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import { act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';

// Export mock navigate for tests
export const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Navigate: ({ to }: { to: string }) => {
    mockNavigate(to);
    return null;
  }
}));

interface ProvidersProps {
  children: React.ReactElement;
  initialEntries?: string[];
  authValue?: {
    isLoggedIn: boolean;
    toggleLogin: () => void;
    login?: (email: string, password: string) => Promise<boolean>;
  };
}

const AllTheProviders = ({ 
  children, 
  initialEntries = ['/'],
  authValue = {
    isLoggedIn: false,
    toggleLogin: () => {},
    login: async () => false
  }
}: ProvidersProps) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <AuthContext.Provider value={authValue}>
        <Routes>
          <Route path="*" element={children} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

export const renderWithProviders = async (
  ui: React.ReactElement,
  { 
    initialEntries,
    authValue,
    ...options 
  }: { 
    initialEntries?: string[];
    authValue?: ProvidersProps['authValue'];
  } & Omit<RenderOptions, 'wrapper'> = {}
) => {
  let result: ReturnType<typeof render>;
  await act(async () => {
    result = render(ui, {
      wrapper: ({ children }) => (
        <AllTheProviders 
          initialEntries={initialEntries}
          authValue={authValue}
        >
          {children as React.ReactElement}
        </AllTheProviders>
      ),
      ...options
    });
  });
  return result!;
};

export * from '@testing-library/react';

// Reset all mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
  mockNavigate.mockClear();
});

// Add helper for async operations
export const waitForElement = async (callback: () => void) => {
  await waitFor(() => {
    callback();
  }, { 
    timeout: 1000,
    onTimeout: (error) => {
      console.error('Timeout waiting for element:', error);
      return error;
    }
  });
}; 