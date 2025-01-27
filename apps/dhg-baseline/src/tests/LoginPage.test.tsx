import { renderWithProviders, screen, fireEvent } from './test-utils';
import LoginPage from '../pages/LoginPage';

describe('LoginPage', () => {
  it('should render form elements', () => {
    renderWithProviders(<LoginPage />);
    
    // Check basic elements
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    renderWithProviders(<LoginPage />);
    
    // Fill form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen.getByRole('form');
    
    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(passwordInput, {
      target: { value: 'password123' }
    });
    
    // Submit
    fireEvent.submit(form);
    
    // Verify error message doesn't appear
    expect(screen.queryByText(/Invalid email format/i)).not.toBeInTheDocument();
  });
  
  it('should show error for invalid email', async () => {
    renderWithProviders(<LoginPage />);
    
    // Fill form with invalid email
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen.getByRole('form');
    
    fireEvent.change(emailInput, {
      target: { value: 'invalid-email' }
    });
    fireEvent.change(passwordInput, {
      target: { value: 'password123' }
    });
    
    // Submit
    fireEvent.submit(form);
    
    // Verify error message appears
    expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
  });

  it('should show error for short password', async () => {
    renderWithProviders(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const form = screen.getByRole('form');
    
    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(passwordInput, {
      target: { value: 'short' }
    });
    
    fireEvent.submit(form);
    
    expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
  });
}); 