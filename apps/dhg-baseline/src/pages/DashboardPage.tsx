import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { isLoggedIn, toggleLogin } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    toggleLogin(); // Set auth state to logged out
    navigate('/login'); // Redirect to login page
  };

  console.log('📊 Dashboard Render:', { isLoggedIn });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Welcome to the dashboard!</p>
        <p className="mt-2">Login Status: {isLoggedIn ? '✅ Logged In' : '❌ Not Logged In'}</p>
        
        {/* Add logout button */}
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage; 