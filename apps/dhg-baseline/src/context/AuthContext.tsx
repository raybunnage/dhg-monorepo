import React, { useContext, useState } from 'react';

// Define a simple auth state type
interface AuthState {
  isLoggedIn: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = React.createContext<AuthState>({
  isLoggedIn: false,
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {}
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    const API_URL = 'http://localhost:8000/api/auth/login';
    console.log('Starting login attempt...');
    
    try {
      // First test if the backend is reachable
      const healthCheck = await fetch('http://localhost:8000/api/health')
        .then(res => res.json())
        .catch(err => {
          console.error('Health check failed:', err);
          return null;
        });
      
      console.log('Health check result:', healthCheck);

      if (!healthCheck) {
        throw new Error('Backend appears to be unreachable');
      }

      console.log('Attempting login to:', API_URL);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Login error response:', error);
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      console.log('Login success data:', data);
      setUser(data.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login error details:', {
        error,
        message: error.message,
        type: error.constructor.name
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string, passwordConfirmation: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, password_confirmation: passwordConfirmation })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Signup failed');
      }

      const data = await response.json();
      setUser(data.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:8000/api/auth/signout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, logout }}>
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