import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Layout from '../../components/Layout';

describe('Layout', () => {
  it('should render header and footer', async () => {
    await renderWithProviders(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
  });

  it('should render children content', async () => {
    await renderWithProviders(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });
}); 