import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import { ProtectedRoute } from '../../src/components/ProtectedRoute';

describe.skip('ProtectedRoute', () => {
  it('redirects to login when not authenticated', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText(/redirecting to login/i)).toBeInTheDocument();
  });

  it('shows content when authenticated', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
}); 