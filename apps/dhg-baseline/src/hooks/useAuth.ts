import { useState, useEffect } from 'react';
import { authApi } from '../api/auth';

interface User {
  email?: string;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

interface LoginResponse {
  success: boolean;
  error?: string;
  debugInfo?: any;
}

// Remove unused API_URL if not needed

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true
  });
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

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

  const signIn = async (email: string, password: string): Promise<LoginResponse> => {
    setError(null);
    setDebugInfo(null);
    
    try {
      // Debug environment
      console.log('Environment check:', {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing',
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
      });
      
      // Log the attempt
      console.log('Attempting login for:', email);
      
      const response = await authApi.login({ email, password });
      
      // Log successful response
      console.log('Login response:', {
        success: !!response,
        user: response?.user ? 'Present' : 'Missing',
        session: response?.session ? 'Present' : 'Missing'
      });

      if (response?.user) {
        setAuthState({
          user: response.user,
          isLoading: false
        });
        return { success: true };
      }

      const debugInfo = {
        timestamp: new Date().toISOString(),
        responseStatus: response ? 'Received' : 'Empty',
        userPresent: !!response?.user,
        email
      };
      
      setDebugInfo(debugInfo);
      setError('Login failed - no user data received');
      
      return {
        success: false,
        error: 'Login failed',
        debugInfo
      };

    } catch (error) {
      const errorInfo = {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        email
      };
      
      console.error('Login error:', errorInfo);
      setError(errorInfo.error);
      setDebugInfo(errorInfo);
      
      return {
        success: false,
        error: errorInfo.error,
        debugInfo: errorInfo
      };
    }
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
    signIn,
    error,
    debugInfo,
    clearError: () => setError(null)
  };
}; 