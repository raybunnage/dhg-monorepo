import React, { createContext, useContext, useState } from 'react';

// Define a simple auth state type
interface AuthState {
  isLoggedIn: boolean;
  toggleLogin: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
  initialState?: Partial<AuthState>;
}

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  toggleLogin: () => {}
});

export const AuthProvider = ({ children, initialState }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(initialState?.isLoggedIn ?? false);
  
  console.log('Auth State:', { isLoggedIn });

  const toggleLogin = () => {
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
} 