/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';

beforeAll(() => {
  // Set up test environment
  process.env.NODE_ENV = 'test';
  process.env.COVERAGE = 'true';
}); 