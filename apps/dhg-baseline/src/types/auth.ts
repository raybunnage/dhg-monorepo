/**
 * Auth Flow Types
 * @description Types of authentication flows supported by the login page
 */
export type AuthFlowType = 'login' | 'signup' | 'invite' | 'recovery';

/**
 * Login Page Props
 * @description URL parameters handled by the login page
 */
export interface LoginPageParams {
  type?: AuthFlowType;
  token?: string;
}

/**
 * Auth Flow States
 * @description Different states the login page can be in
 */
export interface AuthFlowState {
  isConfirmation: boolean;  // Show password setup form
  isSignup: boolean;        // Show signup form
  isLoading: boolean;       // Loading state
  error: string | null;     // Error message
} 