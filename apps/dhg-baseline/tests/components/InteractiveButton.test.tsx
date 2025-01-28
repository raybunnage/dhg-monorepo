import { render, screen, fireEvent } from '@testing-library/react';
import { InteractiveButton } from './InteractiveButton';
import { vi } from 'vitest';

describe('InteractiveButton', () => {
  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<InteractiveButton label="Click me" onClick={handleClick} />);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render with correct label', () => {
    render(<InteractiveButton label="Test Label" onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('Test Label');
  });
}); 