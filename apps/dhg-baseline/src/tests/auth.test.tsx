import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext';
import { authApi } from '../api/auth';

// Mock the auth API
vi.mock('../api/auth', () => ({
  authApi: {
    login: vi.fn()
  }
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('successful login redirects to dashboard', async () => {
    // Mock successful login
    (authApi.login as any).mockResolvedValueOnce({
      user: { email: 'test@example.com' },
      session: { access_token: 'fake-token' }
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' }
    });

    // Submit the form
    fireEvent.click(screen.getByText(/sign in/i));

    // Verify redirect
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('failed login shows error message', async () => {
    // Mock failed login
    (authApi.login as any).mockRejectedValueOnce(new Error('Invalid credentials'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrong-password' }
    });
    fireEvent.click(screen.getByText(/sign in/i));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/login error/i)).toBeInTheDocument();
    });
  });
}); 