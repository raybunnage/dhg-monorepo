import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type RouteGuardProps = {
  children: ReactNode;
  isAuthenticated: boolean;
  redirectTo?: string;
  roles?: string[];
  userRole?: string;
};

export const RouteGuard = ({
  children,
  isAuthenticated,
  redirectTo = '/login',
  roles = [],
  userRole = ''
}: RouteGuardProps) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}; 