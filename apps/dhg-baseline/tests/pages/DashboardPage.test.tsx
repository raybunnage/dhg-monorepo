import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import DashboardPage from '../../src/pages/DashboardPage';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';

describe('DashboardPage', () => {
  it('renders dashboard content', async () => {
    await renderWithProviders(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/welcome to the dashboard/i)).toBeInTheDocument();
  });

  it('shows login status', async () => {
    await renderWithProviders(<DashboardPage />, {
      authValue: {
        isLoggedIn: true,
        toggleLogin: () => {}
      }
    });
    
    expect(screen.getByText(/✅ logged in/i)).toBeInTheDocument();
  });

  it('handles logout', async () => {
    const user = userEvent.setup();
    const mockToggleLogin = jest.fn();
    
    renderWithProviders(<DashboardPage />, {
      authValue: {
        isLoggedIn: true,
        toggleLogin: mockToggleLogin
      }
    });
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    // Wait for state updates and navigation
    await act(async () => {
      await Promise.resolve();
    });
    
    expect(mockToggleLogin).toHaveBeenCalledTimes(1);
  });

  it('shows not logged in status', async () => {
    await renderWithProviders(<DashboardPage />, {
      authValue: {
        isLoggedIn: false,
        toggleLogin: () => {}
      }
    });
    
    expect(screen.getByText(/❌ not logged in/i)).toBeInTheDocument();
  });
}); 