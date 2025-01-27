import { supabase } from '../lib/supabase';

const API_BASE = '/api';

// Add debug logging
const DEBUG = true;  // Toggle this to control logging

// Log configuration on init
if (DEBUG) {
  console.log('Auth API Configuration:', {
    apiBase: API_BASE,
    supabaseConfigured: !!(supabase?.auth),
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
  });
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: any;  // Type this properly based on your user model
}

export const authApi = {
  // Supabase direct auth
  login: async (credentials: LoginCredentials) => {
    if (DEBUG) {
      console.log('Login attempt:', { 
        email: credentials.email,
        hasPassword: !!credentials.password 
      });
    }
    
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    
    if (DEBUG) {
      console.log('Login response:', {
        success: !!data && !error,
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        error: error?.message
      });
    }
    
    if (error) throw error;
    return data;
  },

  // Backend health/status check
  status: async () => {
    const response = await fetch(`${API_BASE}/health`);
    return response.json();
  },

  // Backend-specific auth endpoints
  verifySession: async () => {
    const response = await fetch(`${API_BASE}/auth/verify`);
    return response.json();
  }
}; 