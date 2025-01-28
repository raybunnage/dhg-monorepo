import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Debug login component with credential display
const DebugLogin = () => {
  const { isLoggedIn, toggleLogin } = useAuth();
  const [credentials, setCredentials] = React.useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Debug Login:', credentials);
    toggleLogin();
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
      <h2>Debug Login</h2>
      
      {/* Status Display */}
      <div style={{ marginBottom: '20px' }}>
        <strong>Status:</strong> {isLoggedIn ? '✅ Logged In' : '❌ Not Logged In'}
      </div>

      {/* Login Form */}
      {!isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Email"
              style={{ padding: '5px', width: '200px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Password"
              style={{ padding: '5px', width: '200px' }}
            />
          </div>
          <button type="submit" style={{ padding: '5px 10px' }}>
            Log In
          </button>
        </form>
      ) : (
        <div>
          <div style={{ marginBottom: '10px', color: '#666' }}>
            <p><strong>Debug Info:</strong></p>
            <p>Email: {credentials.email}</p>
            <p>Password: {credentials.password}</p>
          </div>
          <button onClick={() => toggleLogin()} style={{ padding: '5px 10px' }}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

// Main test app
export const TestApp = () => (
  <BrowserRouter>
    <AuthProvider>
      <div style={{ padding: '20px' }}>
        <h1>Auth Debug Interface</h1>
        <DebugLogin />
        
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#eee' }}>
          <p>Current Path: {window.location.pathname}</p>
        </div>
      </div>
    </AuthProvider>
  </BrowserRouter>
); 