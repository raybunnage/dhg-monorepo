import { createContext, useContext, useState } from 'react';
import React from 'react';

type TestContextType = {
  value: string;
  updateValue: (newValue: string) => void;
};

const TestContext = React.createContext<TestContextType | undefined>(undefined);

export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  const [value, setValue] = React.useState('initial');
  
  const updateValue = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <TestContext.Provider value={{ value, updateValue }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTestContext = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTestContext must be used within a TestProvider');
  }
  return context;
}; 