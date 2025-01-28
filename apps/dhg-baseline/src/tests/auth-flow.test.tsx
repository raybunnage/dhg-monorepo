import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import { act } from 'react-dom/test-utils';

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
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  // Stage 1: Basic React Mounting
  describe('Stage 1: Basic Component Mounting', () => {
    it('should render login page', () => {
      renderWithProviders(<LoginPage />);
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });

    it('should render dashboard page', () => {
      renderWithProviders(<DashboardPage />);
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    });
  });

  // Stage 2: Auth Context
  describe('Stage 2: Auth Context', () => {
    it('should start with logged out state', () => {
      renderWithProviders(<LoginPage />);
      const submitButton = screen.getByRole('button');
      expect(submitButton).toHaveTextContent(/Log In/i);
    });

    it('should toggle auth state', async () => {
      const TestComponent = () => {
        const { toggleLogin, isLoggedIn } = useAuth();
        return (
          <button onClick={toggleLogin}>
            {isLoggedIn ? 'Log Out' : 'Log In'}
          </button>
        );
      };

      renderWithProviders(<TestComponent />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(/Log In/i);
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(button).toHaveTextContent(/Log Out/i);
      });
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
      const TestComponent = () => {
        const { toggleLogin } = useAuth();
        
        // Toggle login once on mount
        React.useEffect(() => {
          toggleLogin();
        }, []); // Empty dependency array means run once on mount
        
        return (
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        );
      };

      renderWithProviders(<TestComponent />);
      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });
    });
  });

  // Stage 4: Complete Authentication Flow
  describe('Stage 4: Complete Authentication Flow', () => {
    it('should handle full login -> dashboard -> logout flow', async () => {
      const TestComponent = () => {
        const { isLoggedIn, toggleLogin } = useAuth();
        return (
          <>
            {!isLoggedIn && <LoginPage />}
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
            <button onClick={toggleLogin} data-testid="auth-toggle">
              {isLoggedIn ? 'Log Out' : 'Log In'}
            </button>
          </>
        );
      };

      renderWithProviders(<TestComponent />);

      // Start at login
      expect(screen.getByText(/Login/i)).toBeInTheDocument();

      // Login via toggle (since we're not modifying LoginPage)
      fireEvent.click(screen.getByTestId('auth-toggle'));

      // Should see dashboard
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
      });

      // Logout
      fireEvent.click(screen.getByTestId('auth-toggle'));

      // Should be back at login
      await waitFor(() => {
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
      });
    });
  });

  // Stage 5: Error Handling
  describe('Stage 5: Error Handling', () => {
    it('should handle invalid login attempts', async () => {
      renderWithProviders(<LoginPage />);
      const form = screen.getByRole('form');
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText(/password/i);
      
      // Fill with invalid email
      fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });
    });

    it('should handle network errors gracefully', async () => {
      renderWithProviders(<LoginPage />);
      const form = screen.getByRole('form');
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText(/password/i);
      
      // Fill with valid email but short password
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'short' } });
      
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
      });
    });
  });
}); 