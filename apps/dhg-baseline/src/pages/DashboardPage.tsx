import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { signOut, user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <p>Welcome to your dashboard</p>
      </div>
    </div>
  );
};

export default DashboardPage; 