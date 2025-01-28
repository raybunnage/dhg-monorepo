import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { isLoggedIn, toggleLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    toggleLogin();
    if (!isLoggedIn) {
      console.log('Login successful, navigating to dashboard...');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoggedIn ? 'Log Out' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 