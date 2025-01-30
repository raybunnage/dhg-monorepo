import React, { useContext, useState } from 'react';

// Define a simple auth state type
interface AuthState {
  isLoggedIn: boolean;
  toggleLogin: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
  initialState?: Partial<AuthState>;
}

export const AuthContext = React.createContext<AuthState>({
  isLoggedIn: false,
  toggleLogin: () => {}
});

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

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      toggleLogin
    }}>
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