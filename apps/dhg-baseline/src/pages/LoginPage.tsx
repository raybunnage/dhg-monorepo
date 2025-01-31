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
  const [isConfirmation, setIsConfirmation] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSignup, setIsSignup] = React.useState(false);
  const [isResetPassword, setIsResetPassword] = React.useState(false);
  const type = searchParams.get('type');
  const token = searchParams.get('token');

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
    // Debug all URL parameters
    const allParams = Object.fromEntries(searchParams.entries());
    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
    const errorCode = hashParams.get('error_code');
    const errorDescription = hashParams.get('error_description');

    // Extract token from either query params or hash
    const accessToken = hashParams.get('access_token');
    const queryToken = searchParams.get('token');
    const effectiveToken = queryToken || accessToken;
    const emailParam = searchParams.get('email');
    const storedEmail = localStorage.getItem('recoveryEmail');
    const effectiveEmail = emailParam || storedEmail;

    console.log('🔄 Auth flow check:', { 
      type,
      token: effectiveToken,
      email: effectiveEmail,
      allParams,
      hashParams: Object.fromEntries(hashParams.entries()),
      accessToken: accessToken?.slice(0, 10) + '...',
      queryToken: queryToken?.slice(0, 10) + '...',
      currentUrl: window.location.href
    });

    // Check if this is a recovery flow
    const isRecoveryFlow = type === 'recovery';
    const recoveryToken = token || searchParams.get('token');

    console.log('🔍 URL Parameters:', { 
      allParams,
      type,
      token,
      hashError: errorCode,
      hashErrorDescription: errorDescription,
      currentUrl: window.location.href
    });

    // Handle error cases from hash
    if (errorCode) {
      console.log('⚠️ Auth error:', { errorCode, errorDescription });
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
      // Clear hash to prevent showing error again on refresh
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }

    console.log('🔑 Auth flow:', { 
      type, 
      hasToken: !!effectiveToken,
      isConfirmation,
      isSignup,
      isResetPassword,
      currentPath: window.location.pathname,
      states: {
        isConfirmation,
        isResetPassword,
        isSignup
      }
    });

    if (effectiveToken) {
      console.log('🎫 Token found:', effectiveToken.slice(0, 10) + '...');
      switch (type) {
        case 'invite':
          setIsConfirmation(true);
          setIsSignup(false);
          console.log('👋 Invite flow:', { token: effectiveToken.slice(0, 10) + '...' });
          break;
        case 'recovery':
          console.log('🔄 Starting recovery flow with token');
          setIsConfirmation(true);
          setIsResetPassword(true);
          setIsSignup(false);
          if (effectiveEmail) {
            localStorage.setItem('recoveryEmail', effectiveEmail);
            console.log('📧 Using recovery email:', effectiveEmail);
          }
          // If we got a hash token, convert it to query param
          if (accessToken && !queryToken) {
            const newParams = new URLSearchParams(searchParams);
            newParams.set('token', accessToken);
            window.history.replaceState(
              {},
              '',
              `${window.location.pathname}?${newParams.toString()}`
            );
          }
          break;
        case 'signup':
          setIsConfirmation(true);
          setIsSignup(true);
          console.log('📝 Signup verification:', { token: effectiveToken.slice(0, 10) + '...' });
          break;
        default:
          console.log('⚠️ Unknown type with token:', type);
          setIsConfirmation(false);
          setIsResetPassword(false);
          setIsSignup(false);
      }
    } else {
      console.log('🔒 No token found, type:', type);
      setIsConfirmation(false);
      if (type !== 'recovery') {
        setIsResetPassword(false);
      }
      setIsSignup(false);
    }
  }, [type, token, searchParams]);

  // Debug render states
  React.useEffect(() => {
    console.log('🎨 Render state:', {
      isConfirmation,
      isResetPassword,
      isSignup,
      hasToken: !!token,
      type,
      showingForm: isResetPassword ? (token ? 'SetNewPassword' : 'RequestReset') : (isSignup ? 'Signup' : 'Login')
    });
  }, [isConfirmation, isResetPassword, isSignup, token, type]);

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
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    console.log('📧 Requesting reset for:', email);

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setSuccessMessage('If an account exists with this email, you will receive a password reset link');
        console.log('✅ Reset email requested');
      } else {
        const error = await response.json();
        setError(error.detail || 'Failed to request password reset');
      }
    } catch (error) {
      setError('Failed to connect to server');
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

  // Add debug display
  const DebugInfo = () => {
    if (!import.meta.env.DEV) return null;
    
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded text-xs">
        <pre>
          {JSON.stringify({
            type,
            token: token?.slice(0, 10) + '...',
            email: searchParams.get('email'),
            isConfirmation,
            isResetPassword,
            isSignup,
            recoveryEmail: localStorage.getItem('recoveryEmail'),
            currentUrl: window.location.href
          }, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        {/* Debug controls - only in development */}
        {import.meta.env.DEV && (
          <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
            <p className="font-bold mb-2">Debug Controls:</p>
            <div className="space-x-2">
              <button
                onClick={() => {
                  const searchParams = new URLSearchParams(window.location.search);
                  searchParams.set('type', 'recovery');
                  searchParams.set('email', 'bunnage.ray+test2@gmail.com');
                  window.history.pushState(
                    {},
                    '',
                    `${window.location.pathname}?${searchParams.toString()}`
                  );
                  window.location.reload();
                }}
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
              >
                Test Recovery Flow
              </button>
              <button
                onClick={() => {
                  console.log('Current State:', {
                    isConfirmation,
                    isResetPassword,
                    isSignup,
                    type,
                    token,
                    searchParams: Object.fromEntries(searchParams.entries())
                  });
                }}
                className="bg-green-500 text-white px-2 py-1 rounded text-xs"
              >
                Log State
              </button>
            </div>
          </div>
        )}

        <h2 className="text-2xl mb-6 text-center">
          {isResetPassword ? (token ? 'Set New Password' : 'Reset Password') : isSignup ? 'Create Account' : 'Login'}
        </h2>

        {isResetPassword ? (
          token ? (
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
            <form onSubmit={handleResetPassword}>
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
              <button
                type="submit"
                className="px-8 py-1 border border-black text-sm font-medium"
                style={{ 
                  backgroundColor: theme.buttonBg,
                  transition: 'background-color 0.2s'
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsResetPassword(false)}
                  className="text-blue-800 hover:text-blue-600 text-sm"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )
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
      <DebugInfo />
    </div>
  );
};

export default LoginPage; 