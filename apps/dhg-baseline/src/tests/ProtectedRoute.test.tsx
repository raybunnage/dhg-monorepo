import { screen } from '@testing-library/react';
import { renderWithProviders, mockNavigate } from './test-utils';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect when logged out', async () => {
    const mockAuthContext = {
      isLoggedIn: false,
      toggleLogin: jest.fn(),
      login: jest.fn()
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