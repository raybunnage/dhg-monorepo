import React from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { isLoggedIn } = useAuth();
  
  console.log('📊 Dashboard Render:', { isLoggedIn });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Welcome to the dashboard!</p>
        <p className="mt-2">Login Status: {isLoggedIn ? '✅ Logged In' : '❌ Not Logged In'}</p>
      </div>
    </div>
  );
};

export default DashboardPage; 