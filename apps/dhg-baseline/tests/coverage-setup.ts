import { beforeAll } from 'vitest';

beforeAll(() => {
  // Ensure coverage is initialized
  process.env.COVERAGE = 'true';
}); 