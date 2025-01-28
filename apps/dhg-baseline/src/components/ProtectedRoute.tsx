import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  
  console.log('🔒 Protected Route Check:', { isLoggedIn });

  if (!isLoggedIn) {
    console.log('🚫 Access denied - redirecting to login');
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}; 