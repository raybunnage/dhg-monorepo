import { render, screen, fireEvent } from '@testing-library/react';
import { TestForm } from './TestForm';

describe('TestForm', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('should render form elements', () => {
    render(<TestForm onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should submit form data', () => {
    render(<TestForm onSubmit={mockSubmit} />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    fireEvent.submit(screen.getByRole('form'));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com'
    });
  });

  it('should populate initial values', () => {
    const initialValues = {
      username: 'initial-user',
      email: 'initial@example.com'
    };
    
    render(<TestForm onSubmit={mockSubmit} initialValues={initialValues} />);
    
    expect(screen.getByLabelText(/username/i)).toHaveValue('initial-user');
    expect(screen.getByLabelText(/email/i)).toHaveValue('initial@example.com');
  });

  it('should require fields', () => {
    render(<TestForm onSubmit={mockSubmit} />);
    
    fireEvent.submit(screen.getByRole('form'));
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });
}); 