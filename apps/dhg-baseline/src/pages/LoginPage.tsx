import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSignup, setIsSignup] = React.useState(false);

  // Modern professional theme
  const theme = {
    background: 'bg-gradient-to-br from-blue-50 to-blue-100',
    card: 'bg-white shadow-lg rounded-lg',
    input: 'rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500',
    button: 'bg-blue-600 text-white hover:bg-blue-700 rounded-md',
    link: 'text-blue-600 hover:text-blue-800',
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const passwordConfirmation = formData.get('passwordConfirmation') as string;

      if (isSignup) {
        await signup(email, password, passwordConfirmation);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme.background}`}>
      <div className={`w-full max-w-md p-8 ${theme.card}`}>
        <h1 className="text-3xl font-bold mb-6 text-center">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
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
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className={`${theme.link} text-sm`}
            >
              {isSignup 
                ? 'Already have an account? Log in' 
                : 'Need an account? Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 