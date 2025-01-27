import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import LoginPage from '../pages/LoginPage';

describe('Test Setup', () => {
  it('should render with providers', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });
}); 