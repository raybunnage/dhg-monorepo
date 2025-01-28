import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import LoginPage from '../src/pages/LoginPage';

describe('LoginPage', () => {
  it('renders login form', () => {
    renderWithProviders(<LoginPage />);
    
    // Check for essential elements
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('shows error when submitting empty form', async () => {
    renderWithProviders(<LoginPage />);
    
    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(submitButton);

    // Check for error message
    expect(screen.getByText('Please enter both email and password')).toBeInTheDocument();
  });

  it('handles form submission with credentials', () => {
    renderWithProviders(<LoginPage />);
    
    // Fill in the form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(submitButton);
    
    // Add assertions based on your expected behavior
    // For example, check if navigation occurred or error displayed
  });
}); 