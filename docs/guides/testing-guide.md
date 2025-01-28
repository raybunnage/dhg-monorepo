# Testing Guide

## Overview
We use Vitest as our testing framework along with React Testing Library for component testing.

## Current Testing Patterns

### Component Testing Pattern
```typescript
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Component } from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const handleClick = vi.fn();
    render(<Component onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Router Testing Pattern
```typescript
import { vi } from 'vitest';
import { renderWithProviders, mockNavigate } from '../test-utils';

// Mock setup needs to be before imports
vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Component with routing', () => {
  it('navigates on action', async () => {
    renderWithProviders(<Component />, {
      initialEntries: ['/start-path']
    });
    
    await userEvent.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/expected-path');
  });
});
```

### Context Testing Pattern
```typescript
import { renderWithProviders } from '../test-utils';

describe('Component with context', () => {
  it('uses context values', async () => {
    renderWithProviders(<Component />, {
      authValue: {
        isLoggedIn: true,
        toggleLogin: vi.fn()
      }
    });
    
    expect(screen.getByText(/logged in/i)).toBeInTheDocument();
  });
});
```

### API Mocking Pattern
```typescript
import { vi } from 'vitest';

vi.mock('../utils/api', () => ({
  api: {
    getData: vi.fn()
  }
}));

describe('Component with API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles API response', async () => {
    (api.getData as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: 'test'
    });
    
    render(<Component />);
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
```

### Error Boundary Testing Pattern
```typescript
import { vi } from 'vitest';

describe('ErrorBoundary', () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('catches errors', () => {
    render(
      <ErrorBoundary>
        <ComponentThatThrows />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/error message/i)).toBeInTheDocument();
  });
});
```

## Setup
- Vitest for test running and assertions
- React Testing Library for component testing
- @testing-library/jest-dom for DOM assertions
- jsdom for browser environment simulation

## Key Concepts

### Mocking
Use Vitest's mocking utilities:
```typescript
import { vi } from 'vitest';

// Function mocks
const mockFn = vi.fn();

// Module mocks
vi.mock('./path-to-module', () => ({
  someFunction: vi.fn()
}));
```

### Async Testing
```typescript
import { waitFor } from '@testing-library/react';

it('handles async operations', async () => {
  await waitFor(() => {
    expect(something).toBe(true);
  });
});
```

### Common Patterns
1. Component Testing:
```typescript
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

describe('Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText(/some text/i)).toBeInTheDocument();
  });
});
```

2. Mock Cleanup:
```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

## Running Tests
```bash
# Run all tests
pnpm --filter dhg-baseline test

# Run tests with coverage
pnpm --filter dhg-baseline test:coverage

# Watch mode
pnpm --filter dhg-baseline test:watch
```

### Watch Mode
Watch mode is a development-friendly way to run tests. When enabled:

1. Tests run automatically when files change
2. You get an interactive interface to:
   - Run all tests
   - Run only failed tests
   - Run tests that match a pattern
   - Run tests related to changed files

```bash
# Start watch mode
pnpm test:watch

# Watch mode interface options:
# Press a to run all tests
# Press f to run only failed tests
# Press t to filter by a test name regex pattern
# Press p to filter by a filename regex pattern
# Press q to quit watch mode
```

#### Example Workflow
1. Start watch mode: `pnpm test:watch`
2. Make changes to your code
3. Tests automatically re-run for changed files
4. Use the interactive interface to:
   - Press `f` to focus on failing tests
   - Press `t` to run tests matching a pattern
   - Press `p` to run tests in specific files

#### Benefits of Watch Mode
- Faster feedback loop during development
- Only runs relevant tests
- Interactive filtering and test selection
- Helps with TDD workflow

## Frontend Testing

### Testing Stack Overview

#### Core Tools
- **Jest**: Our primary test runner and assertion library
  - Provides a complete testing solution
  - Includes built-in mocking capabilities
  - Supports snapshot testing
  - Offers excellent CLI tools

- **React Testing Library**: For testing React components
  - Encourages testing user behavior over implementation
  - Provides DOM-based testing utilities
  - Focuses on accessibility and real user interactions

- **@testing-library/jest-dom**: Extended DOM matchers
  - Adds custom matchers like `toBeInTheDocument()`
  - Makes assertions more readable and specific

#### Additional Tools
- **@testing-library/user-event**: Simulates real user interactions
- **jest-dom**: DOM environment for Jest
- **MSW (Mock Service Worker)**: API mocking

### Test Types & Examples

#### 1. Component Tests

##### Basic Component Testing

Key Principles:
- Test what users see and interact with
- Use accessible queries (getByRole, getByLabelText)
- Focus on component behavior, not implementation

```typescript
// Example: InteractiveButton.test.tsx
import { render, screen } from '@testing-library/react';
import { InteractiveButton } from './InteractiveButton';

describe('InteractiveButton', () => {
  it('should render with label', () => {
    render(<InteractiveButton label="Click me" onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<InteractiveButton label="Click me" onClick={handleClick} />);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### 2. Error Boundary Testing

```typescript
// Example: ErrorBoundary.test.tsx
import ErrorBoundary from '../../src/components/ErrorBoundary';

// Mock component that throws an error
const ThrowError = () => {
  throw new Error('Test error');
  return null;
};

describe('ErrorBoundary', () => {
  beforeAll(() => {
    console.error = jest.fn(); // Prevent console.error spam
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders fallback UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
```

#### 3. Layout and Structure Tests

```typescript
// Example: Layout.test.tsx
describe('Layout', () => {
  it('renders header and main content', () => {
    renderWithProviders(<Layout>Test Content</Layout>);
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('shows login status', () => {
    renderWithProviders(<Layout>Test Content</Layout>);
    expect(screen.getByText(/status:/i)).toBeInTheDocument();
    expect(screen.getByText(/not logged in/i)).toBeInTheDocument();
  });
});
```

Focus Areas:
- Test structural components
- Verify proper content rendering
- Check responsive behavior

### Testing Best Practices

#### Test-Driven Development (TDD)

##### Overview
Test-Driven Development follows a "Red-Green-Refactor" cycle:
1. Write a failing test (Red)
2. Write minimal code to make the test pass (Green)
3. Improve the code while keeping tests passing (Refactor)

##### Writing Test Cases
We use Jest's `describe` and `it` functions to structure our tests:

```typescript
describe('ComponentName', () => {
  // 'describe' groups related tests
  describe('specific functionality', () => {
    // 'it' describes expected behavior in plain English
    it('should show loading state initially', () => {
      // Test implementation
    });

    it('should display error when API fails', () => {
      // Test implementation
    });
  });
});
```

##### Test Case Naming Conventions
- Start with "should" to describe expected behavior
- Use present tense for actions
- Be specific about expected outcomes

Good examples:
```typescript
it('should display error message when password is invalid', () => {});
it('should enable submit button when form is valid', () => {});
it('should call API with correct parameters', () => {});
```

Bad examples:
```typescript
it('test password validation', () => {}); // Too vague
it('button works', () => {}); // Not descriptive
it('when user clicks submit and the form is valid then the API is called', () => {}); // Too verbose
```

##### TDD Workflow Example

```typescript
// 1. Write the test first (Red)
describe('PasswordInput', () => {
  it('should show error when password is too short', () => {
    render(<PasswordInput />);
    
    const input = screen.getByLabelText(/password/i);
    fireEvent.change(input, { target: { value: '123' } });
    
    expect(screen.getByText(/password must be at least 8 characters/i))
      .toBeInTheDocument();
  });
});

// 2. Implement the component (Green)
const PasswordInput = () => {
  const [error, setError] = useState('');
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 8) {
      setError('Password must be at least 8 characters');
    } else {
      setError('');
    }
  };
  
  return (
    <div>
      <input 
        type="password"
        aria-label="password"
        onChange={handleChange}
      />
      {error && <span>{error}</span>}
    </div>
  );
};

// 3. Refactor while keeping tests passing
// - Extract validation logic
// - Improve error handling
// - Add types
// - etc.
```

##### Benefits of TDD
- Forces good component design
- Ensures testable code
- Provides living documentation
- Catches bugs early
- Makes refactoring safer

#### 1. Component Testing Guidelines
- Test behavior, not implementation
- Use semantic queries
- Write accessible components
- Test edge cases and error states

#### 2. Test Structure

```typescript
describe('ComponentName', () => {
  // Setup (if needed)
  beforeEach(() => {
    // Common setup
  });

  // Happy path tests
  it('should render successfully', () => {});
  it('should handle user interactions', () => {});

  // Edge cases
  it('should handle empty states', () => {});
  it('should handle error states', () => {});

  // Cleanup (if needed)
  afterEach(() => {
    // Common cleanup
  });
});
```

#### 3. Mock Files and Assets

```javascript
// Example: fileMock.js
module.exports = 'test-file-stub';
```

### Test Utils and Helpers

#### 1. Custom Render Function

```typescript
// test-utils.tsx
const renderWithProviders = (
  ui: React.ReactElement,
  {
    route = '/',
    authValue = { isLoggedIn: false, toggleLogin: () => {} },
    ...renderOptions
  } = {}
) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthContext.Provider value={authValue}>
        {ui}
      </AuthContext.Provider>
    </MemoryRouter>,
    renderOptions
  );
};
```

#### 2. Common Test Utilities

```typescript
// Mock navigation
export const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock file imports
// fileMock.js
module.exports = 'test-file-stub';
```

### Running Tests

#### Monorepo Test Commands
In our monorepo setup, we use Turbo to run commands across packages. The syntax is different from regular npm/pnpm commands:

```bash
# Basic syntax:
pnpm turbo test              # Run test script in all packages
pnpm turbo test --filter=app # Run test script in specific package

# Passing arguments through Turbo:
# First -- passes args to the underlying command
# Second -- passes args to Vitest itself
pnpm turbo test -- -- --coverage
```

#### Commands
```bash
# Run all tests
pnpm turbo test

# Watch mode
pnpm turbo test -- --watch

# Coverage report for all packages
pnpm vitest run --coverage

# Coverage for specific package
pnpm --filter=dhg-baseline vitest run --coverage

# Single file
pnpm turbo test -- path/to/test.tsx

# Run tests in specific directory
pnpm turbo test -- components/

# Run tests matching a pattern
pnpm turbo test -- -t "button"

# Update snapshots
pnpm turbo test -- -u

# Run tests with specific config
pnpm turbo test -- --config=vitest.config.ts
```

#### Understanding Turbo Command Structure
```bash
pnpm --filter=<package-name> vitest run --coverage
^    ^     ^
|     |     |
|     |     └─ Workspace filter
|     └─ Build tool
└─ Package manager
```

#### Running in CI Environment
```bash
# Install dependencies
pnpm install --frozen-lockfile

# Run tests in CI mode
pnpm turbo test -- --run

# Run tests with coverage in CI
pnpm turbo test -- -- --coverage
```

#### Debug Tests
```bash
# Run tests in debug mode
pnpm turbo test -- --mode=debug

# Run specific test file in debug mode
pnpm turbo test -- --mode=debug path/to/test.tsx
```

### Coverage Configuration
Coverage is configured in the `vitest.config.ts` file:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    // Prevent test hanging
    testTimeout: 10000,    // 10 second timeout for tests
    hookTimeout: 10000,    // 10 second timeout for hooks
    teardownTimeout: 5000, // 5 second timeout for teardown
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/test-utils.tsx'
      ]
    }
  }
});
```

### Coverage Requirements
- Overall coverage: 80%
- Critical paths: 100%
- New features: 90%

### Understanding Test Coverage

#### Coverage Types

1. **Statement Coverage**
   - Measures which lines of code have been executed
   - Basic metric but not sufficient alone
   - Example:
   ```typescript
   function validateEmail(email: string) {
     if (!email) return false;        // Line 1
     if (!email.includes('@')) {      // Line 2
       return false;                  // Line 3
     }
     return true;                     // Line 4
   }
   ```
   To achieve 100% statement coverage, need tests for:
   - Empty email
   - Invalid email (no @)
   - Valid email

2. **Branch Coverage**
   - Measures which decision paths have been executed
   - More thorough than statement coverage
   - Example:
   ```typescript
   function getDisplayName(user?: User) {
     if (!user) return 'Guest';
     if (user.fullName) return user.fullName;
     return user.username;
   }
   ```
   Need tests for all branches:
   - No user
   - User with fullName
   - User without fullName

3. **Function Coverage**
   - Measures which functions have been called
   - Should aim for 100% for exported functions

#### Running Coverage Reports

```bash
# Generate coverage report
pnpm vitest run --coverage

# Generate and watch coverage
pnpm vitest --coverage

# Generate detailed HTML report
pnpm vitest run --coverage --reporter=html
```

#### Coverage Report Output
```bash
--------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files          |   85.71 |    83.33 |   88.89 |   85.71 |
 components/       |   90.00 |    85.71 |   92.31 |   90.00 |
  Button.tsx       |  100.00 |    90.00 |  100.00 |  100.00 |
  Form.tsx         |   85.71 |    83.33 |   88.89 |   85.71 |
--------------------|---------|----------|---------|---------|
```

#### Coverage Thresholds
Configured in `vitest.config.ts`:
```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      },
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/test-utils.tsx'
      ]
    }
  }
});
```

#### Coverage Best Practices

1. **Focus Areas**
   - Business logic: 100% coverage
   - API endpoints: 100% coverage
   - UI components: 80%+ coverage
   - Utility functions: 90%+ coverage

2. **What to Test**
   - Happy paths
   - Edge cases
   - Error conditions
   - Boundary conditions

3. **What to Exclude**
   - Generated code
   - Test files
   - Build configuration
   - External types

4. **Coverage Maintenance**
   - Review coverage reports in PRs
   - Don't decrease coverage
   - Document coverage exceptions
   - Regular coverage audits

#### 4. Form Testing

```typescript
// Example: TestForm.test.tsx
describe('TestForm', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('should submit form data', () => {
    render(<TestForm onSubmit={mockSubmit} />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    fireEvent.submit(screen.getByRole('form'));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com'
    });
  });
});
```

#### 5. Hook Testing

```typescript
// Example: usePagination.test.tsx
describe('usePagination', () => {
  const setup = (props = {}) => {
    const defaultProps = {
      totalItems: 100,
      itemsPerPage: 10,
      initialPage: 1,
      ...props
    };
    
    return renderHook(() => usePagination(defaultProps));
  };

  it('should initialize with correct values', () => {
    const { result } = setup();
    
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(10);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPrevPage).toBe(false);
  });
});
```

#### 6. Route Protection Tests

```typescript
// Example: ProtectedRoute.test.tsx
describe('ProtectedRoute', () => {
  it('should redirect when not authenticated', () => {
    renderWithRouter(
      <RouteGuard isAuthenticated={false}>
        <TestComponent />
      </RouteGuard>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
```

### Continuous Integration

#### PR Checks
- All tests must pass
- Coverage thresholds met
- No TypeScript errors
- Linting passes

#### Automated Testing
- Tests run on push
- Coverage reports generated
- Performance metrics tracked

## Backend Testing

[Backend testing section to be expanded based on backend implementation]

### Resources
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)

### Troubleshooting

#### Git Commands for Test Fixing
When working with tests, these Git commands can be helpful:

```bash
# Stash only test files
git stash push -m "test fixes" $(git ls-files '*test.tsx' '*test.ts')

# Apply stashed test changes
git stash pop

# Show test file changes
git diff -- '*test.tsx' '*test.ts'

# Reset only test files
git checkout HEAD -- '*test.tsx' '*test.ts'

# Stage all test file changes
git add '*test.tsx' '*test.ts'

# Commit test fixes
git commit -m "test: fix failing tests"
```

#### Common Test Fix Workflow
```bash
# 1. Save current test changes
git stash push -m "wip tests" $(git ls-files '*test.tsx' '*test.ts')

# 2. Reset to last working state
git checkout HEAD -- '*test.tsx' '*test.ts'

# 3. Run tests to verify clean state
pnpm --filter dhg-baseline test

# 4. Reapply your changes
git stash pop

# 5. Fix tests incrementally
pnpm --filter dhg-baseline test:watch

# 6. Commit working test fixes
git add '*test.tsx' '*test.ts'
git commit -m "test: fix test suite"
```

#### Hanging Tests
If tests appear to hang or don't complete:

1. Check for unhandled promises or async operations
2. Ensure all mocks are properly cleaned up
3. Look for infinite loops or recursive calls
4. Verify timeouts are appropriate in vitest.config.ts

```typescript
// Example of proper async test cleanup
describe('Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('handles async operations', async () => {
    await act(async () => {
      // Test code
    });
  });
});
```