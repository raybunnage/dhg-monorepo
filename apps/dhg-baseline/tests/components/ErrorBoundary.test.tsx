import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import ErrorBoundary from '../../components/ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should catch errors and display fallback UI', async () => {
    await renderWithProviders(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('should allow recovery via retry button', async () => {
    const onReset = jest.fn();
    
    await renderWithProviders(
      <ErrorBoundary onReset={onReset}>
        <ThrowError />
      </ErrorBoundary>
    );
    
    screen.getByRole('button', { name: /try again/i }).click();
    expect(onReset).toHaveBeenCalled();
  });
}); 