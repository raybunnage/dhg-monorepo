import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import App from '../../src/App';

describe('Navigation', () => {
  it('renders main navigation', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
  });
}); 