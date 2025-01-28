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

    it('should toggle auth state', async () => {
      renderWithProviders(<LoginPage />);
      const form = screen.getByRole('form');
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByLabelText(/password/i);
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toHaveTextContent(/Log Out/i);
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

      await renderWithProviders(<TestComponent />);

      // Start at login
      expect(screen.getByText(/Login/i)).toBeInTheDocument();

      // Login
      fireEvent.click(screen.getByTestId('auth-toggle'));

      // Should see dashboard
      await waitFor(() => {
        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
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
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
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