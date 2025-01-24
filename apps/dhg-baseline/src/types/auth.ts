export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
} 