import { render, screen } from '@testing-library/react';
import { TestProvider, useTestContext } from './TestContext';

const TestComponent = () => {
  const { value } = useTestContext();
  return <div>{value}</div>;
};

describe('TestContext', () => {
  it('provides context value', () => {
    render(
      <TestProvider>
        <TestComponent />
      </TestProvider>
    );
    expect(screen.getByText('test')).toBeInTheDocument();
  });
}); 