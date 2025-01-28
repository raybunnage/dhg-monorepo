import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

const App = () => {
  console.log('🎯 App Component Mounting');
  console.log('Loading imports:', { LoginPage: true, AuthProvider: true, BrowserRouter: true });

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
