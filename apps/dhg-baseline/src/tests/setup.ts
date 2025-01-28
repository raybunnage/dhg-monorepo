import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { jest } from '@jest/globals';

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

// Mock router
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom') as typeof import('react-router-dom');
  const mockNavigate = jest.fn();
  let mockLocation = { pathname: '/' };

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    Navigate: ({ to }: { to: string }) => {
      mockLocation = { pathname: to };
      return null;
    }
  };
});

// Clean up after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
}); 