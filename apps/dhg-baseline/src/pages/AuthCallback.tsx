import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔄 Auth callback:', {
      params: Object.fromEntries(searchParams),
      from: document.referrer,
      timestamp: new Date().toISOString(),
      path: window.location.pathname
    });
    // Handle the callback and redirect appropriately
    navigate('/dashboard');
  }, [searchParams, navigate]);

  return <div>Processing authentication...</div>;
};

export default AuthCallback; 