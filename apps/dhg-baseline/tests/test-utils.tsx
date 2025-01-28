import React from 'react';
import { render, RenderOptions, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';

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

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  authValue?: {
    isLoggedIn: boolean;
    toggleLogin: () => void;
  };
}

export const renderWithProviders = async (
  ui: React.ReactElement,
  { 
    initialEntries = ['/'],
    authValue = {
      isLoggedIn: false,
      toggleLogin: () => {}
    },
    ...options 
  }: RenderWithProvidersOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider initialState={{ isLoggedIn: authValue.isLoggedIn, toggleLogin: authValue.toggleLogin }}>
        <Routes>
          <Route path="*" element={children} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

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

// Export testing library utilities
export * from '@testing-library/react'; 