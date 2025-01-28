import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import LoginPage from '../../src/pages/LoginPage';

describe('LoginPage', () => {
  it('renders login form', async () => {
    await renderWithProviders(<LoginPage />);
    
    // Check for essential elements
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    await renderWithProviders(<LoginPage />);
    
    // Fill form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'validpassword123' } });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(submitButton);
    
    // Verify no error message appears
    expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
  });

  it('shows error for empty form submission', async () => {
    await renderWithProviders(<LoginPage />);
    
    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(submitButton);
    
    // Check for error message
    expect(screen.getByText(/please enter both email and password/i)).toBeInTheDocument();
  });
}); 