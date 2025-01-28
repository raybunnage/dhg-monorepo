import React, { createContext, useContext, useState } from 'react';

// Define a simple auth state type
interface AuthState {
  isLoggedIn: boolean;
  toggleLogin: () => void;
  login?: (email: string, password: string) => Promise<boolean>;
}

interface AuthProviderProps {
  children: React.ReactNode;
  initialState?: Partial<AuthState>;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children, initialState }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(initialState?.isLoggedIn ?? false);
  
  console.log('Auth State:', { isLoggedIn });

  const toggleLogin = () => {
    if (initialState?.toggleLogin) {
      initialState.toggleLogin();
    }
    setIsLoggedIn(!isLoggedIn);
    console.log('Toggling login state');
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple validation for testing
    if (email === 'test@example.com' && password === 'validpassword123') {
      toggleLogin();
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, toggleLogin, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
} 