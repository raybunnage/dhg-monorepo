import { render, screen } from '@testing-library/react';
import { TestButton } from './TestButton';

describe('TestButton', () => {
  it('should render with label', () => {
    render(<TestButton label="Click me" />);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
}); 