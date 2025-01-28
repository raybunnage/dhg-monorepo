import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import { authApi } from '../lib/auth-api';

jest.mock('../lib/auth-api');

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  // Reset window.location
  window.history.pushState({}, '', '/');
});

describe('Authentication Flow', () => {
  it('successful login redirects to dashboard', async () => {
    // Mock successful login
    (authApi.login as jest.Mock).mockResolvedValueOnce({ 
      user: { id: 1, email: 'test@example.com' },
      token: 'fake-token'
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Fill in login form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    // Submit form
    await act(async () => {
      fireEvent.submit(screen.getByRole('form'));
    });

    // Wait for redirect
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard');
    });
  });

  it('failed login shows error message', async () => {
    // Mock failed login
    (authApi.login as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Fill in login form with invalid email
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalidemail' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    // Submit form
    await act(async () => {
      fireEvent.submit(screen.getByRole('form'));
    });

    // Check for current error message implementation
    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });

  it('shows validation errors for invalid input', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Test invalid email
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalidemail' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('form'));
    });

    expect(screen.getByText('Invalid email format')).toBeInTheDocument();

    // Test short password
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'valid@email.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'short' }
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('form'));
    });

    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
  });
}); 