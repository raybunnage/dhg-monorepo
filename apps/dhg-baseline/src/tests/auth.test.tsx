import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext';
import { authApi } from '../api/auth';

// Mock the auth API
jest.mock('../api/auth', () => ({
  authApi: {
    login: jest.fn()
  }
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', async () => {
  const actual = jest.requireActual('react-router-dom') as typeof import('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen.getByRole('form');

    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(passwordInput, {
      target: { value: 'password123' }
    });

    // Submit the form
    fireEvent.submit(form);

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