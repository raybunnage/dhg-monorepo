import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { UserList } from './UserList';
import { testApi } from '../utils/test-api';

// Mock the API
vi.mock('../utils/test-api', () => ({
  testApi: {
    getUsers: vi.fn()
  }
}));

describe('UserList', () => {
  beforeEach(() => {
    // Reset mock before each test
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    // Setup mock to delay
    (testApi.getUsers as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<UserList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render users after loading', async () => {
    // Setup mock to return test data
    (testApi.getUsers as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: 1, name: 'Test User', email: 'test@example.com' }
    ]);

    render(<UserList />);
    
    // Wait for loading to finish
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    
    // Check if user is rendered
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });

  it('should show error message on failure', async () => {
    // Setup mock to reject
    (testApi.getUsers as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('API Error'));

    render(<UserList />);
    
    // Wait for loading to finish
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    
    // Check if error is shown
    expect(screen.getByRole('alert')).toHaveTextContent(/failed to load users/i);
  });
}); 