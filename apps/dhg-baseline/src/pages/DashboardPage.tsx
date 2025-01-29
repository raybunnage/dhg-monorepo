import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiUsers, HiDocumentText, HiChartBar, HiClock } from 'react-icons/hi';

const DashboardPage = () => {
  const { toggleLogin, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Ocean Blue theme colors
  const theme = {
    background: '#b3e0ff',
    secondary: '#99d6ff',
    card: '#ffffff',
    buttonBg: '#99d6ff',
    buttonHover: '#80ccff',
  };

  const stats = [
    { 
      title: 'Total Users', 
      value: '1,234', 
      icon: HiUsers,
      change: '+12%',
      timeframe: 'from last month'
    },
    { 
      title: 'Active Projects', 
      value: '45', 
      icon: HiDocumentText,
      change: '+3',
      timeframe: 'this week'
    },
    { 
      title: 'Revenue', 
      value: '$12,345', 
      icon: HiChartBar,
      change: '+8%',
      timeframe: 'vs last quarter'
    },
    { 
      title: 'Avg Response Time', 
      value: '2.4h', 
      icon: HiClock,
      change: '-15%',
      timeframe: 'from last week'
    }
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'Created new project', time: '2 hours ago' },
    { user: 'Jane Smith', action: 'Updated documentation', time: '4 hours ago' },
    { user: 'Mike Johnson', action: 'Completed task', time: '6 hours ago' },
    { user: 'Sarah Wilson', action: 'Added new comment', time: '8 hours ago' },
  ];

  const handleLogout = () => {
    toggleLogin();
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            {isLoggedIn ? '✅ Logged In' : '❌ Not Logged In'}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-black text-sm font-medium"
            style={{ 
              backgroundColor: theme.buttonBg,
              transition: 'background-color 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = theme.buttonHover}
            onMouseOut={e => e.currentTarget.style.backgroundColor = theme.buttonBg}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div 
            key={stat.title} 
            className="p-6 rounded-lg shadow-sm"
            style={{ backgroundColor: theme.card }}
          >
            <div className="flex items-center justify-between">
              <stat.icon className="w-8 h-8 text-gray-600" />
              <span className="text-green-600 text-sm">{stat.change}</span>
            </div>
            <h3 className="text-gray-600 text-sm mt-4">{stat.title}</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-1">{stat.value}</p>
            <span className="text-gray-500 text-xs">{stat.timeframe}</span>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div 
        className="rounded-lg shadow-sm p-6"
        style={{ backgroundColor: theme.card }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between py-2"
              style={{ borderBottom: index !== recentActivity.length - 1 ? '1px solid #e5e7eb' : 'none' }}
            >
              <div>
                <p className="text-gray-800 font-medium">{activity.user}</p>
                <p className="text-gray-600 text-sm">{activity.action}</p>
              </div>
              <span className="text-gray-500 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 