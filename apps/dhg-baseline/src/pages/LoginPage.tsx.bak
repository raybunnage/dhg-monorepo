import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

const LoginPage = () => {
  const { toggleLogin, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (email && password) {
      console.log('Login attempt:', { email, password: '***' });
      toggleLogin();
      if (!isLoggedIn) {
        navigate('/dashboard');
      }
    } else {
      setError('Please enter both email and password');
    }
    setIsLoading(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-${theme.colors.background.main} ${theme.componentGuidelines.spacing.padding.large}`}>
      <div className={`${theme.patterns.layout.card} max-w-md w-full space-y-8`}>
        <h1 className={`text-2xl font-bold mb-4 text-center text-${theme.colors.text.primary}`}>Login</h1>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4" role="form">
          <div>
            <label 
              htmlFor="email" 
              className={`block text-sm font-medium text-${theme.colors.text.secondary}`}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className={`mt-1 block w-full ${theme.patterns.inputs.text.base} ${theme.cursor.text}`}
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className={`block text-sm font-medium text-${theme.colors.text.secondary}`}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              className={`mt-1 block w-full ${theme.patterns.inputs.text.base} ${theme.cursor.text}`}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className={`w-full flex justify-center ${theme.patterns.buttons.primary.base} ${theme.patterns.buttons.primary.hover} ${theme.patterns.buttons.primary.focus} ${isLoading ? theme.cursor.loading : theme.cursor.interactive}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 