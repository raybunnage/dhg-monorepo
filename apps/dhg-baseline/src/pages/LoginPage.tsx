import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { toggleLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Ocean Blue theme colors
  const theme = {
    background: '#b3e0ff',
    secondary: '#99d6ff',
    buttonBg: '#99d6ff',
    buttonHover: '#80ccff',
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

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
        <h1 className="text-4xl font-bold mb-8 px-4"
          style={{ backgroundColor: theme.background }}>
          Login
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
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginPage; 