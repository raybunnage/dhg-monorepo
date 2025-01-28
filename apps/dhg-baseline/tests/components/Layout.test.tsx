import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Layout from '../../src/components/Layout';

describe('Layout', () => {
  it('renders header and main content', () => {
    renderWithProviders(<Layout>Test Content</Layout>);
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('shows login status', () => {
    renderWithProviders(<Layout>Test Content</Layout>);
    expect(screen.getByText(/status:/i)).toBeInTheDocument();
    expect(screen.getByText(/not logged in/i)).toBeInTheDocument();
  });
}); 