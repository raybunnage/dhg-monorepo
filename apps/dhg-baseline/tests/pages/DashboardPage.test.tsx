import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import DashboardPage from '../../src/pages/DashboardPage';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';

const mockNavigate = vi.fn();

beforeEach(() => {
  vi.mock('react-router-dom', () => ({
    ...vi.importActual('react-router-dom'),
    useNavigate: () => mockNavigate
  }));
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('DashboardPage', () => {
  it('renders dashboard elements', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('shows login status', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/logged in/i)).toBeInTheDocument();
  });

  it('shows not logged in status', async () => {
    await render(<DashboardPage />, {
      authValue: {
        isLoggedIn: false,
        toggleLogin: () => {}
      }
    });
    
    expect(screen.getByText(/❌ not logged in/i)).toBeInTheDocument();
  });
}); 