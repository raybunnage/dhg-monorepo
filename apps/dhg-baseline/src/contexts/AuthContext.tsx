import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, User } from '@dhg/auth-service';
import { AuthContextType } from '../types/auth';

const authService = new AuthService(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    authService.getCurrentUser().then((currentUser: User | null) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    // Subscribe to auth changes
    const { data: authListener } = authService.onAuthStateChange((authUser: User | null) => {
      setUser(authUser);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    const { user: authUser } = await authService.signIn(email, password);
    setUser(authUser);
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 