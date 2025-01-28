import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Silence React Router warnings
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('React Router')) return;
  originalConsoleWarn(...args);
};

// Clean up after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// This will be expanded later
export {}; 

// Add any global test setup here 