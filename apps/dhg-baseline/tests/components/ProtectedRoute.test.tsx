import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import { ProtectedRoute } from '../../src/components/ProtectedRoute';

describe('ProtectedRoute', () => {
  it('renders children when authenticated', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        authValue: {
          isLoggedIn: true,
          toggleLogin: () => {}
        }
      }
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects when not authenticated', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      {
        authValue: {
          isLoggedIn: false,
          toggleLogin: () => {}
        }
      }
    );

    // Content should not be rendered
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
}); 