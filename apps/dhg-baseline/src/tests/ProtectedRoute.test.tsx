import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { mockNavigate } from './test-utils';

describe('ProtectedRoute', () => {
  it('should redirect when logged out', () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
}); 