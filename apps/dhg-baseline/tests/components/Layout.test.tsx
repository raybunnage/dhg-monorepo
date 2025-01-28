import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Layout from '../../src/components/Layout';

describe('Layout', () => {
  it('renders header and main content', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText('DHG Baseline')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows login status', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>,
      {
        authValue: {
          isLoggedIn: true,
          toggleLogin: () => {}
        }
      }
    );

    expect(screen.getByText(/✅ logged in/i)).toBeInTheDocument();
  });
}); 