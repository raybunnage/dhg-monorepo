import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { toggleLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isConfirmation, setIsConfirmation] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSignup, setIsSignup] = React.useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Ocean Blue theme colors
  const theme = {
    background: '#b3e0ff',
    secondary: '#99d6ff',
    buttonBg: '#99d6ff',
    buttonHover: '#80ccff',
  };

  React.useEffect(() => {
    // Check if this is a signup confirmation
    const token = searchParams.get('token');
    if (token) {
      setIsConfirmation(true);
      setIsSignup(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

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
      console.log('Login attempt:', { email, password: '***' });
      toggleLogin();
      navigate('/dashboard');
    } else {
      setError('Please enter both email and password');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl mb-6 text-center">
          {isConfirmation 
            ? 'Set Your Password' 
            : (isSignup ? 'Create Account' : 'Login')}
        </h1>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
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
          />
        </div>
        
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
              className="w-full px-2 py-1 border border-black bg-white"
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
        </div>
      </form>
    </div>
  );
};

export default LoginPage; 