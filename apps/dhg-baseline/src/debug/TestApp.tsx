import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';

// Test component that uses auth
const AuthStatus = () => {
  const { isLoggedIn, toggleLogin } = useAuth();
  const [formValues, setFormValues] = React.useState({ email: '', password: '' });

  const handleLogin = () => {
    if (!isLoggedIn) {
      console.log('Logging in with:', formValues);
    }
    toggleLogin();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ marginBottom: 20, padding: 10, background: '#f0f0f0' }}>
      <p>Auth Status: {isLoggedIn ? '✅ Logged In' : '❌ Logged Out'}</p>
      <div className="space-y-4">
        {!isLoggedIn && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formValues.email}
              onChange={handleInputChange}
              style={{ margin: '5px', padding: '5px' }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formValues.password}
              onChange={handleInputChange}
              style={{ margin: '5px', padding: '5px' }}
            />
          </>
        )}
      </div>
      {isLoggedIn && (
        <div style={{ marginTop: 10, fontSize: '0.9em', color: '#666' }}>
          <p>Debug Info:</p>
          <p>Email used: {formValues.email}</p>
          <p>Password used: {formValues.password}</p>
        </div>
      )}
      <button 
        onClick={handleLogin}
        style={{ padding: '5px 10px', marginTop: 10 }}
      >
        {isLoggedIn ? 'Log Out' : 'Log In'}
      </button>
    </div>
  );
};

export const TestApp = () => (
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