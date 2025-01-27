import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  
  console.log('🔒 Protected Route Check:', { isLoggedIn });

  if (!isLoggedIn) {
    console.log('🚫 Access denied - redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}; 