# Frontend Testing Setup Guide

## Overview
This guide outlines a step-by-step approach to setting up testing in React applications using Jest and React Testing Library. Breaking down the setup into smaller, verifiable steps helps reduce troubleshooting cycles and ensures a solid testing foundation.

## Prerequisites
- Node.js and pnpm installed
- React application using TypeScript
- Vite as the build tool

## Step 1: Basic Dependencies
First, install the core testing dependencies:

```bash
cd apps/your-app
pnpm add -D jest @types/jest ts-jest jest-environment-jsdom
```

## Step 2: Testing Library Dependencies
Add React Testing Library and related utilities:

```bash
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

## Step 3: Configuration Files

### Jest Configuration
Create `jest.config.ts`:
```typescript
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.ts'],
  moduleNameMapper: {
    // Handle CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/tests/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }]
  },
  testMatch: [
    '<rootDir>/src/tests/**/*.test.{ts,tsx}'
  ],
  moduleDirectories: ['node_modules', 'src']
};
```

### TypeScript Test Configuration
Create `tsconfig.test.json`:
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "types": ["jest", "@testing-library/jest-dom"]
  },
  "include": ["src/**/*.test.ts", "src/**/*.test.tsx", "src/tests/**/*"]
}
```

### Jest Setup File
Create `src/tests/jest.setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

## Step 4: Verify Setup
Create a smoke test to verify the setup is working:

```typescript
// src/tests/smoke.test.tsx
import { render, screen } from '@testing-library/react';

test('smoke test', () => {
  render(<div>Hello</div>);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

Run the test:
```bash
pnpm test src/tests/smoke.test.tsx
```

## Step 5: Test Utilities
Create a utilities file for common test setup:

```typescript
// src/tests/test-utils.tsx
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
};

export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Re-export everything
export * from '@testing-library/react';
```

## Step 6: Writing Component Tests
After verifying the setup, you can write component tests:

```typescript
// src/tests/LoginPage.test.tsx
import { renderWithProviders, screen, fireEvent } from './test-utils';
import LoginPage from '../pages/LoginPage';

describe('LoginPage', () => {
  it('should render form elements', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  it('should handle form submission', () => {
    renderWithProviders(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.submit(screen.getByRole('form'));
  });
});
```

## Best Practices

1. **Incremental Setup**
   - Start with minimal configuration
   - Add features one at a time
   - Verify each step before moving forward

2. **Test Organization**
   - Keep tests close to components
   - Use descriptive test names
   - Group related tests using describe blocks

3. **Component Testing**
   - Test component behavior, not implementation
   - Use semantic queries (getByRole, getByLabelText)
   - Test user interactions and state changes

4. **Error Handling**
   - Test both success and error cases
   - Verify error messages appear correctly
   - Test form validation

## Troubleshooting

Common issues and solutions:

1. **Jest Configuration**
   - Verify moduleNameMapper paths
   - Check transform settings for TypeScript
   - Ensure setupFilesAfterEnv points to correct file

2. **TypeScript Errors**
   - Update tsconfig.test.json types
   - Check import paths
   - Verify type definitions are installed

3. **React Testing Library**
   - Use correct queries (prefer getByRole)
   - Handle async operations with waitFor
   - Mock external dependencies

## Scripts
Add these scripts to package.json:

```json
{
  "scripts": {
    "test": "jest --verbose",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Resources
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about) 