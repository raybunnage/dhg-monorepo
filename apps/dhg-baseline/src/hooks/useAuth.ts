import { useState, useEffect } from 'react';

interface User {
  email?: string;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

const API_URL = 'http://localhost:8000';  // Your backend URL

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true
  });

  const signOut = async () => {
    try {
      // TODO: Call unified backend signout endpoint
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include'
      });
      setAuthState(prev => ({ ...prev, user: null }));
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // TODO: Call unified backend auth check endpoint
        const response = await fetch('/api/auth/user', {
          credentials: 'include'
        });
        if (response.ok) {
          const user = await response.json();
          setAuthState({ user, isLoading: false });
        } else {
          setAuthState({ user: null, isLoading: false });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({ user: null, isLoading: false });
      }
    };

    checkAuth();
  }, []);

  return {
    ...authState,
    signOut,
    signIn
  };
}; 