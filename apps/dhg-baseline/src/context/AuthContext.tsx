import React, { createContext, useContext, useState } from 'react';

// Define a simple auth state type
type AuthState = {
  isLoggedIn: boolean;
  toggleLogin: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  console.log('Auth State:', { isLoggedIn });

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
    console.log('Toggling login state');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, toggleLogin }}>
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