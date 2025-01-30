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

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const login = async (email: string, password: string) => {
    const LOGIN_URL = `${API_URL}/api/auth/login`;
    console.log('Starting login attempt...');
    
    try {
      // First test if the backend is reachable
      const healthCheck = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include',
        mode: 'cors'
      });
      
      const healthData = await healthCheck.json();
      console.log('Health check result:', healthData);

      if (!healthData || healthData.status !== 'healthy') {
        throw new Error('Backend health check failed');
      }

      console.log('Attempting login to:', LOGIN_URL);
      const payload = { email, password };
      console.log('Login payload:', { email, password: '***' });
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
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
      console.error('Login error:', error);
      throw error instanceof Error ? error : new Error('Login failed');
    }
  };

  const signup = async (email: string, password: string, passwordConfirmation: string) => {
    try {
      console.log('Starting signup attempt for:', email);
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, password_confirmation: passwordConfirmation })
      });

      console.log('Signup response status:', response.status);
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        let error;
        try {
          error = JSON.parse(responseText);
        } catch {
          error = { detail: responseText };
        }
        console.error('Signup error response:', error);
        throw new Error(error.detail || 'Signup failed');
      }

      const data = JSON.parse(responseText);
      console.log('Signup success data:', data);
      setUser(data.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/signout`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
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