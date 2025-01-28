import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';

// Rename the component to avoid conflict with the imported Routes
const AppRoutes = () => {
  return (
    <RouterRoutes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </RouterRoutes>
  );
};

export default AppRoutes; 