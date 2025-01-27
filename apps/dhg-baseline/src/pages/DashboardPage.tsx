import React from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { isLoggedIn } = useAuth();
  
  console.log('📊 Dashboard Render:', { isLoggedIn });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Login Status: {isLoggedIn ? '✅ Logged In' : '❌ Not Logged In'}</p>
    </div>
  );
};

export default DashboardPage; 