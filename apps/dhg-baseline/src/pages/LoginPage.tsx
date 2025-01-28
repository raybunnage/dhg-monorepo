import React from 'react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (email && password) {
      await login(email, password);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} role="form">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" required />
        
        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" required />
        
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage; 