import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import { useAuth } from '../context/AuthContext';
import { AuthProvider } from '../context/AuthContext';

const TestComponent = () => {
  const { isLoggedIn, toggleLogin } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">
        {isLoggedIn ? 'logged-in' : 'logged-out'}
      </div>
      <button onClick={toggleLogin} data-testid="auth-toggle">
        Toggle Auth
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  it('should provide auth state', async () => {
    await renderWithProviders(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-out');
  });

  it('should toggle auth state', async () => {
    await renderWithProviders(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    fireEvent.click(screen.getByTestId('auth-toggle'));
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in');
  });
}); 