import { supabase } from '../lib/supabase';

const API_BASE = '/api';

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
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
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