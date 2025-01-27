import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// Route debugger component
function RouteDebugger() {
  const location = useLocation();
  
  useEffect(() => {
    console.log('=== Route Change ===', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash
    });
  }, [location]);

  return null;
}

function App() {
  console.log('🎯 App Component Mounting');
  console.log('Loading imports:', {
    LoginPage: !!LoginPage,
    AuthProvider: !!AuthProvider,
    BrowserRouter: !!BrowserRouter
  });

  return (
    <BrowserRouter>
      <AuthProvider>
        <RouteDebugger />
        <Routes>
          <Route 
            path="/login" 
            element={<LoginPage />}  // Remove Suspense temporarily
          />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
