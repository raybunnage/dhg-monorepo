import { renderWithProviders, screen, fireEvent } from '../test-utils';
import { TestProvider, useTestContext } from './TestContext';

const TestComponent = () => {
  const { value, setValue } = useTestContext();
  return (
    <div>
      <div data-testid="value">{value}</div>
      <button onClick={() => setValue('updated')}>Update Value</button>
    </div>
  );
};

describe('TestContext', () => {
  it('should provide initial value', () => {
    renderWithProviders(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );
    
    expect(screen.getByTestId('value')).toHaveTextContent('initial');
  });

  it('should update value when button clicked', () => {
    renderWithProviders(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('value')).toHaveTextContent('updated');
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderWithProviders(<TestComponent />);
    }).toThrow('useTestContext must be used within a TestProvider');
    
    consoleSpy.mockRestore();
  });
}); 