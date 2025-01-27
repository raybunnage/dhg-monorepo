import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import { AuthProvider, useAuth } from '../context/AuthContext';

const TestComponent = () => {
  const { isLoggedIn, toggleLogin } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isLoggedIn ? 'logged-in' : 'logged-out'}</div>
      <button onClick={toggleLogin}>Toggle</button>
    </div>
  );
};

describe('AuthContext', () => {
  it('should provide auth state', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-out');
  });

  it('should toggle auth state', () => {
    renderWithProviders(<TestComponent />);
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in');
  });
}); 