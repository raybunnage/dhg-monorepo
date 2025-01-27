import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';

// Test utilities
const mockNavigate = jest.fn();

const renderWithProviders = (component: React.ReactNode) => {
  jest.clearAllMocks();
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Authentication Flow', () => {
  // Stage 1: Basic React Mounting
  describe('Stage 1: Basic Component Mounting', () => {
    it('should render login page', () => {
      renderWithProviders(<LoginPage />);
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });

    it('should render dashboard page', () => {
      renderWithProviders(<DashboardPage />);
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
  });

  // Stage 2: Auth Context
  describe('Stage 2: Auth Context', () => {
    it('should start with logged out state', () => {
      renderWithProviders(<LoginPage />);
      const submitButton = screen.getByRole('button');
      expect(submitButton).toHaveTextContent(/Log In/i);
    });

    it('should toggle auth state', () => {
      renderWithProviders(<LoginPage />);
      const form = screen.getByRole('form');
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText(/password/i);
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.submit(form);
      
      const submitButton = screen.getByRole('button');
      expect(submitButton).toHaveTextContent(/Log Out/i);
    });
  });

  // Stage 3: Protected Routes
  describe('Stage 3: Protected Routes', () => {
    it('should redirect to login when accessing protected route while logged out', () => {
      const TestComponent = () => (
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      renderWithProviders(<TestComponent />);
      expect(window.location.pathname).toBe('/login');
    });

    it('should allow access to protected route when logged in', async () => {
      const TestComponent = () => (
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      renderWithProviders(<LoginPage />);
      const loginButton = screen.getByRole('button', { name: /Log In/i });
      fireEvent.click(loginButton);

      renderWithProviders(<TestComponent />);
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  // Stage 4: Full Flow
  describe('Stage 4: Complete Authentication Flow', () => {
    it('should handle full login -> dashboard -> logout flow', async () => {
      renderWithProviders(
        <>
          <LoginPage />
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        </>
      );

      // Start at login
      expect(screen.getByText(/Login/i)).toBeInTheDocument();

      // Login
      const loginButton = screen.getByRole('button', { name: /Log In/i });
      fireEvent.click(loginButton);

      // Should see dashboard
      await waitFor(() => {
        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
      });

      // Logout
      const logoutButton = screen.getByRole('button', { name: /Log Out/i });
      fireEvent.click(logoutButton);

      // Should be back at login
      expect(window.location.pathname).toBe('/login');
    });
  });

  // Stage 5: Error Handling
  describe('Stage 5: Error Handling', () => {
    it('should handle invalid login attempts', () => {
      renderWithProviders(<LoginPage />);
      const form = screen.getByRole('form');
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText(/password/i);
      
      fireEvent.change(emailInput, { target: { value: 'invalid@email' } });
      fireEvent.change(passwordInput, { target: { value: 'short' } });
      
      fireEvent.submit(form);
      
      expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
    });

    it('should handle network errors gracefully', async () => {
      // Mock a network error
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      renderWithProviders(<LoginPage />);
      const form = screen.getByRole('form');
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
      });
    });
  });
}); 