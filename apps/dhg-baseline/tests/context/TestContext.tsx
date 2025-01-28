import { useContext } from 'react';
import React from 'react';

const TestContext = React.createContext<{ value: string }>({ value: '' });

export const useTestContext = () => useContext(TestContext);

export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TestContext.Provider value={{ value: 'test' }}>
      {children}
    </TestContext.Provider>
  );
}; 