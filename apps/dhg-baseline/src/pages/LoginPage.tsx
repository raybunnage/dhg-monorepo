import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSignup, setIsSignup] = React.useState(false);

  // Ocean Blue theme colors (preserved from original)
  const theme = {
    background: '#b3e0ff',
    secondary: '#99d6ff',
    buttonBg: '#99d6ff',
    buttonHover: '#80ccff',
    input: 'w-full px-2 py-1 border border-black bg-white',
    button: 'px-8 py-1 border border-black text-sm font-medium',
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      if (isSignup) {
        const passwordConfirmation = formData.get('passwordConfirmation') as string;
        await signup(email, password, passwordConfirmation);
      } else {
        await login(email, password);
      }
      setIsLoading(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login/Signup error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-start justify-start p-4"
      style={{ backgroundColor: theme.background }}>
      
      <h1 className="text-4xl font-bold mb-8 px-4"
        style={{ backgroundColor: theme.background }}>
        {isSignup ? 'Create Account' : 'Login'}
      </h1>
      
      {error && (
        <div className="mb-4 text-red-600">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md" role="form">
        <div>
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
        
        <div>
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
          <div>
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
          className={theme.button}
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