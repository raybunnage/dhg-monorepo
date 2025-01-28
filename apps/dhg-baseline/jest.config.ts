import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment: 'jsdom',
  testMatch: [
    "<rootDir>/tests/**/*.test.{ts,tsx}"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/tests/jest.setup.ts"
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};

export default config; 