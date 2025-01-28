import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import App from '../../App';

describe('Navigation', () => {
  it('should render home page by default', async () => {
    await renderWithProviders(<App />);
    expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
  });

  it('should handle 404 page', async () => {
    window.history.pushState({}, '', '/nonexistent');
    await renderWithProviders(<App />);
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });

  it('should navigate between pages', async () => {
    await renderWithProviders(<App />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3); // Home, Login, Dashboard
  });
}); 