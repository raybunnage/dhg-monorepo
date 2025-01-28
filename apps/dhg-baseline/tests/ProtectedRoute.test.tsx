import { screen } from '@testing-library/react';
import { renderWithProviders, mockNavigate } from './test-utils';
import { ProtectedRoute } from '../src/components/ProtectedRoute';
import { waitFor } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect when logged out', async () => {
    const mockAuthContext = {
      isLoggedIn: false,
      toggleLogin: vi.fn(),
      login: vi.fn()
    };

    await renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      { 
        initialEntries: ['/dashboard'],
        authValue: mockAuthContext
      }
    );
    
    await waitFor(() => {
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
}); 