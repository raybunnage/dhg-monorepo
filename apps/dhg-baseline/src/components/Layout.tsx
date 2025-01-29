import React from 'react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header role="banner" className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <div className="text-sm text-gray-500">
            Status: {isLoggedIn ? '✅ Logged In' : '❌ Not Logged In'}
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
};

export default Layout; 