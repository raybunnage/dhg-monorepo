import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Type for reset password errors
type ResetPasswordError = {
  email?: string;
  token?: string;
  general?: string;
};

const LoginPage = () => {
  const { toggleLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Get parameters from both URL and hash
  const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
  const accessToken = hashParams.get('access_token');
  
  // Check for recovery mode in both places
  const isRecoveryMode = searchParams.get('type') === 'recovery' || 
                        hashParams.get('type') === 'recovery';
  
  // Get token from either source
  const token = searchParams.get('token') || accessToken;

  console.log('🔍 Initial URL Check:', {
    fullUrl: window.location.href,
    isRecoveryMode,
    hasToken: !!token,
    params: {
      search: Object.fromEntries(searchParams.entries()),
      hash: Object.fromEntries(hashParams.entries())
    }
  });

  const [isConfirmation, setIsConfirmation] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSignup, setIsSignup] = React.useState(false);
  const [isResetPassword, setIsResetPassword] = React.useState(isRecoveryMode);
  const type = searchParams.get('type');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Ocean Blue theme colors
  const theme = {
    background: '#b3e0ff',
    secondary: '#99d6ff',
    buttonBg: '#99d6ff',
    buttonHover: '#80ccff',
    input: 'w-full px-2 py-1 border border-black bg-white'
  };

  React.useEffect(() => {
    const emailParam = searchParams.get('email') || hashParams.get('email');
    
    console.log('🔄 Recovery Flow Check:', {
      isRecoveryMode,
      token: token ? `${token.substring(0, 10)}...` : null,
      email: emailParam,
      currentUrl: window.location.href
    });

    // FORCE recovery mode when we have recovery params
    if (isRecoveryMode && token) {
      console.log('📧 Forcing recovery mode');
      setIsConfirmation(true);
      setIsResetPassword(true);
      setIsSignup(false);

      if (emailParam) {
        localStorage.setItem('recoveryEmail', emailParam);
      }

      // Move hash params to search params if needed
      if (accessToken && !searchParams.has('token')) {
        const newParams = new URLSearchParams(window.location.search);
        newParams.set('type', 'recovery');
        newParams.set('token', accessToken);
        window.history.replaceState(
          {},
          '',
          `${window.location.pathname}?${newParams.toString()}`
        );
      }
    }

    // Handle error cases
    const errorCode = hashParams.get('error_code');
    if (errorCode) {
      switch (errorCode) {
        case 'otp_expired':
          setError('Password reset link has expired. Please request a new one.');
          break;
        case 'access_denied':
          setError('Invalid or expired link. Please request a new password reset.');
          break;
        default:
          setError('Authentication error. Please try again.');
      }
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [searchParams, isRecoveryMode, token, accessToken]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log('📤 Form submission:', { 
      isConfirmation, 
      isSignup, 
      isResetPassword,
      hasToken: !!token 
    });
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('🔐 Login attempt:', { email, hasPassword: !!password });

    // Handle first-time password setup
    if (isConfirmation) {
      try {
        console.log('Setting password with token:', searchParams.get('token'));
        const response = await fetch(`${API_URL}/api/auth/set-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            token: searchParams.get('token'),
            password: password
          })
        });
        
        const data = await response.json();
        console.log('Set password response:', data);
        
        if (!response.ok) {
          throw new Error(data.detail || 'Failed to set password');
        }
        
        navigate('/dashboard');
      } catch (err) {
        console.error('Password setup error:', err);
        setError(err instanceof Error ? err.message : 'Failed to set password');
      }
      setIsLoading(false);
      return;
    }

    if (isSignup) {
      try {
        const passwordConfirmation = formData.get('passwordConfirmation') as string;
        const signupData = { 
          email, 
          password, 
          password_confirmation: passwordConfirmation 
        };
        console.log('Attempting signup with:', { 
          email, 
          passwordLength: password.length,
          passwordsMatch: password === passwordConfirmation,
          requestBody: signupData
        });

        const response = await fetch(`${API_URL}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(signupData)
        });
        
        const responseData = await response.json();
        console.log('Signup response:', {
          status: response.status,
          ok: response.ok,
          data: responseData,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        if (!response.ok) {
          throw new Error(responseData.detail || 'Signup failed');
        }

        // On successful signup, switch to login
        setIsSignup(false);
        setError('Account created! Please check your email for verification.');
      } catch (err) {
        console.error('Signup error:', err);
        setError(err instanceof Error ? err.message : 'Signup failed');
      }
      setIsLoading(false);
      return;
    }

    if (email && password) {
      console.log('🔐 Login attempt:', { email, hasPassword: !!password });
      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('📥 Login response:', { 
          status: response.status,
          ok: response.ok,
          data 
        });

        if (!response.ok) {
          throw new Error(data.detail || 'Login failed');
        }

        // Only set logged in if Supabase auth succeeded
        toggleLogin();
        navigate('/dashboard');
      } catch (err) {
        console.error('🚨 Login error:', err);
        setError(err instanceof Error ? err.message : 'Login failed');
      }
    } else {
      setError('Please enter both email and password');
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.detail?.includes('rate limit')) {
          setError('Please wait a few minutes before requesting another reset email.');
          return;
        }
        setError(data.detail || 'Failed to request password reset');
        return;
      }

      setSuccessMessage('If an account exists with this email, you will receive a password reset link');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

    } catch (error) {
      console.error('🚨 Reset password error:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Get the token from URL params
    const urlToken = searchParams.get('token') || token;
    const recoveryEmail = localStorage.getItem('recoveryEmail');
    console.log('🔑 Reset attempt:', {
      token: urlToken?.slice(0, 10) + '...',
      email: recoveryEmail,
      hasPassword: true
    });

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const passwordConfirmation = formData.get('passwordConfirmation') as string;

    if (!urlToken) {
      setError('Missing reset token');
      setIsLoading(false);
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/set-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: urlToken,
          password,
          email: recoveryEmail
        })
      });

      const data = await response.json();
      console.log('📡 Set password response:', {
        status: response.status,
        ok: response.ok,
        data
      });
      
      if (response.ok) {
        setIsResetPassword(false);
        setIsConfirmation(false);
        console.log('✅ Password reset successful');
        alert('Password has been reset successfully. Please login.');
      } else {
        throw new Error(data.detail || 'Failed to reset password');
      }
    } catch (error) {
      console.error('🚨 Set password error:', error);
      setError(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: theme.background }}>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-4xl mb-8 text-center">
          {(isRecoveryMode && token) ? 'Set New Password' : 
           isSignup ? 'Create Account' : 'Login'}
        </h1>

        {(isRecoveryMode && token) ? (
          <form onSubmit={handleSetNewPassword}>
            <div className="mb-4">
              <label htmlFor="password" className="text-2xl mr-2">
                New Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                className={theme.input}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="passwordConfirmation" className="text-2xl mr-2">
                Confirm Password
              </label>
              <input
                id="passwordConfirmation"
                type="password"
                name="passwordConfirmation"
                required
                className={theme.input}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-1 border border-black text-sm font-medium"
              style={{ 
                backgroundColor: theme.buttonBg,
                transition: 'background-color 0.2s'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Setting Password...' : 'Set New Password'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {error.general || error}
              </div>
            )}
            
            {!isConfirmation && (
              <div className="mb-4">
                <label htmlFor="email" className="text-2xl mr-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className={theme.input}
                  placeholder="you@example.com"
                  autoComplete="username email"
                />
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="password" className="text-2xl mr-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                className={theme.input}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {isSignup && (
              <div className="mb-4">
                <label htmlFor="passwordConfirmation" className="text-2xl mr-2">
                  Confirm Password
                </label>
                <input
                  id="passwordConfirmation"
                  type="password"
                  name="passwordConfirmation"
                  required
                  className={theme.input}
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              className="px-8 py-1 border border-black text-sm font-medium"
              style={{ 
                backgroundColor: theme.buttonBg,
                transition: 'background-color 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = theme.buttonHover}
              onMouseOut={e => e.currentTarget.style.backgroundColor = theme.buttonBg}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  {isSignup ? 'Creating Account...' : 'Logging in...'}
                </>
              ) : (
                isSignup ? 'Create Account' : 'Login'
              )}
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-blue-800 hover:text-blue-600 text-sm"
              >
                {isSignup 
                  ? 'Already have an account? Log in' 
                  : 'Need an account? Sign up'}
              </button>
              {!isSignup && (
                <button
                  type="button"
                  onClick={() => setIsResetPassword(true)}
                  className="text-blue-800 hover:text-blue-600 text-sm ml-4"
                >
                  Forgot password?
                </button>
              )}
            </div>
          </form>
        )}

        {successMessage && (
          <div className="mb-4 p-2 bg-green-50 border border-green-500 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-500 text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage; 