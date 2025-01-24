import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginError {
  message: string;
}

export function LoginPage(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    console.log('Attempting login with:', { email });

    try {
      await login({ email, password });
      console.log('Login successful');
      setSuccess('Successfully signed in! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      const error = err as LoginError;
      console.error('Login error:', error);
      setError(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <span className="flex items-center">
      <svg 
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
        />
      </svg>
      Signing in...
    </span>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-10">
        <div>
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">DH</span>
            </div>
          </div>
          <h1 className="text-center text-5xl font-bold text-indigo-600 mb-4">
            DHG Hub
          </h1>
          <h2 className="text-center text-2xl font-semibold text-gray-800">
            Sign in to your account
          </h2>
          <p className="mt-3 text-center text-base text-gray-600">
            Enter your credentials to access the dashboard
          </p>
        </div>

        <form 
          className="mt-8 space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100" 
          onSubmit={handleSubmit}
        >
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-base"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-base"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {success && (
            <div className="rounded-lg bg-green-50 p-4 border border-green-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-4 border border-red-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 