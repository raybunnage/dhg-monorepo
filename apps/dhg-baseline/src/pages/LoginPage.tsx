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
    <div className={`
      min-h-screen flex items-center justify-center 
      bg-[#cce3ff]
      px-4 py-12 sm:px-6 lg:px-8
    `}>
      <div className={`
        w-full max-w-md space-y-6
        bg-[#e6f0ff] rounded-xl shadow-lg
        p-8 sm:p-10
      `}>
        {/* Status Section */}
        <div className="flex items-center space-x-2 text-sm mb-6 bg-[#cce3ff] p-3 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-slate-900">Status: ❌ Not Logged In</span>
        </div>
        
        {/* Title Section */}
        <div>
          <h1 className={`
            text-4xl font-bold text-center text-black
            tracking-tight
          `}>Login</h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            Please log in to access your account
          </p>
        </div>
        
        {error && (
          <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6" role="form">
          <div>
            <label 
              htmlFor="email" 
              className="block text-xl font-medium text-black mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className={`
                block w-full 
                px-4 py-3
                border border-gray-300
                text-slate-900
                rounded-lg
                shadow-sm
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                placeholder:text-slate-400
                transition-colors duration-200
                bg-white
              `}
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-xl font-medium text-black mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              className={`
                block w-full
                px-4 py-3
                border border-gray-300
                text-slate-900
                rounded-lg
                shadow-sm
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                placeholder:text-slate-400
                transition-colors duration-200
                bg-white
              `}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className={`
              w-full flex justify-center items-center
              px-4 py-3
              border border-transparent
              text-sm font-medium text-black
              bg-[#cce3ff] hover:bg-[#b3d9ff]
              rounded-lg
              shadow-sm
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
            `}
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
    </div>
  );
};

export default LoginPage; 