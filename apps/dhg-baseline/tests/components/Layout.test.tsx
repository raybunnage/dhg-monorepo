import { render, screen } from '@testing-library/react';
import Layout from '../../src/components/Layout';

describe('Layout', () => {
  it('renders header and main content', () => {
    render(<Layout>Test Content</Layout>, {
      authValue: {
        isLoggedIn: false,
        toggleLogin: () => {}
      }
    });
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('shows login status', () => {
    render(<Layout>Test Content</Layout>, {
      authValue: {
        isLoggedIn: false,
        toggleLogin: () => {}
      }
    });
    expect(screen.getByText(/status:/i)).toBeInTheDocument();
    expect(screen.getByText(/not logged in/i)).toBeInTheDocument();
  });
}); 