import { renderWithProviders, screen, fireEvent } from '../test-utils';
import { TestProvider, useTestContext } from './TestContext';

const TestComponent = () => {
  const { value, updateValue } = useTestContext();
  return (
    <div>
      <div data-testid="value">{value}</div>
      <button onClick={() => updateValue('updated')}>Update</button>
    </div>
  );
};

describe('TestContext', () => {
  it('should provide initial value', async () => {
    await renderWithProviders(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );
    
    expect(screen.getByTestId('value')).toHaveTextContent('initial');
  });

  it('should update value when button clicked', async () => {
    await renderWithProviders(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('value')).toHaveTextContent('updated');
  });

  it('should throw error when used outside provider', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    try {
      await renderWithProviders(<TestComponent />);
      // If we get here, the test should fail
      expect(true).toBe(false); // Force failure if no error thrown
    } catch (error) {
      expect((error as Error).message).toContain(
        'useTestContext must be used within a TestProvider'
      );
    }
    
    consoleSpy.mockRestore();
  });
}); 