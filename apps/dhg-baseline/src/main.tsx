import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';
import LoginPage from './pages/LoginPage';

console.log('🚀 Starting application...');

// Test component that uses auth
const AuthStatus = () => {
  const { isLoggedIn, toggleLogin } = useAuth();
  return (
    <div style={{ marginBottom: 20, padding: 10, background: '#f0f0f0' }}>
      <p>Auth Status: {isLoggedIn ? '✅ Logged In' : '❌ Logged Out'}</p>
      <button 
        onClick={toggleLogin}
        style={{ padding: '5px 10px', marginTop: 10 }}
      >
        {isLoggedIn ? 'Log Out' : 'Log In'}
      </button>
    </div>
  );
};

const TestApp = () => (
  <BrowserRouter>
    <AuthProvider>
      <div style={{ padding: 20 }}>
        <h1>React Router Test</h1>
        
        <AuthStatus />
        
        {/* Navigation */}
        <nav style={{ marginBottom: 20 }}>
          <Link to="/" style={{ marginRight: 10 }}>Home</Link>
          <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
          <Link to="/test">Test Page</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/test" element={<div>Test Page</div>} />
        </Routes>

        <div style={{ marginTop: 20 }}>
          Current Path: {window.location.pathname}
        </div>
      </div>
    </AuthProvider>
  </BrowserRouter>
);

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
);
