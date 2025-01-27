import { render, screen } from '@testing-library/react';

test('smoke test', () => {
  render(<div>Hello</div>);
  expect(screen.getByText('Hello')).toBeInTheDocument();
}); 