import { beforeAll } from 'vitest';
import '@testing-library/jest-dom';

beforeAll(() => {
  // Set up test environment
  process.env.NODE_ENV = 'test';
  process.env.COVERAGE = 'true';
}); 