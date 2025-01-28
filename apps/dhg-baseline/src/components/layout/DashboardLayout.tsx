import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiHome, HiUsers, HiDocument, HiCog, HiLogout } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { toggleLogin } = useAuth();

  const handleLogout = () => {
    toggleLogin(); // Set auth state to logged out
    navigate('/login'); // Redirect to login page
  };

  const menuItems = [
    { icon: HiHome, label: 'Dashboard', path: '/dashboard' },
    { icon: HiUsers, label: 'Users', path: '/users' },
    { icon: HiDocument, label: 'Reports', path: '/reports' },
    { icon: HiCog, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-soft">
        <div className="flex items-center h-16 px-6 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-brand-600">DHG Hub</h1>
        </div>
        <nav className="flex flex-col h-[calc(100%-4rem)] p-4">
          <div className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center w-full px-4 py-2.5 text-gray-600 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors duration-150"
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
          
          {/* Logout button at bottom */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-150"
          >
            <HiLogout className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="pl-64">
        <header className="h-16 bg-white shadow-soft">
          <div className="flex items-center justify-between h-full px-6">
            <h2 className="text-lg font-medium text-gray-800">Dashboard</h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 rounded-full hover:bg-gray-100">
                <HiCog className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                <span className="text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </header>
        <div className="p-6">
          <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
            {/* Example dashboard cards */}
            <div className="p-4 bg-white rounded-lg shadow-soft">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-brand-100 text-brand-600">
                  <HiUsers className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="mb-2 text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-lg font-semibold text-gray-700">
                    6,789
                  </p>
                </div>
              </div>
            </div>
            {/* Add more dashboard cards as needed */}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout; 