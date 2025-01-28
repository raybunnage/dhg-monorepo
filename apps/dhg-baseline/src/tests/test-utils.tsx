import React from 'react';
import { render, RenderOptions, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { act } from '@testing-library/react';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
};

export const renderWithProviders = async (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  // Clear any previous mocks
  jest.clearAllMocks();
  
  let result: ReturnType<typeof render>;
  await act(async () => {
    result = render(ui, { wrapper: AllTheProviders, ...options });
  });
  return result!;
};

// Re-export everything
export * from '@testing-library/react';

// Mock navigation functions
export const mockNavigate = jest.fn();

// Setup router mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Reset all mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
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