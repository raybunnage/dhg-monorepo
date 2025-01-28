import { renderWithProviders } from './test-utils';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { waitFor } from '@testing-library/react';

describe('ProtectedRoute', () => {
  it('should redirect when logged out', async () => {
    window.history.pushState({}, '', '/');
    await renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });
}); 