import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <div className="text-sm text-gray-500">
            Status: {isLoggedIn ? '✅ Logged In' : '❌ Not Logged In'}
          </div>
        </div>
      </header>
      <nav role="navigation" aria-label="main navigation">
        <div className="max-w-7xl mx-auto px-4 py-2">
          {isLoggedIn ? (
            <span>Welcome back!</span>
          ) : (
            <span>Please log in</span>
          )}
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
};

export default Layout; 