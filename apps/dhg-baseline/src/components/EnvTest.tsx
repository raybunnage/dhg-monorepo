import React, { useState, useEffect } from 'react';

export function EnvTest() {
  const [envInfo, setEnvInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkEnv = async () => {
      try {
        // Frontend env variables
        const frontendEnv = {
          VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
          VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
          HAS_SUPABASE_KEY: Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY),
        };

        // Backend env check
        const response = await fetch('/api/env');
        const backendEnv = await response.json();

        setEnvInfo({
          frontend: frontendEnv,
          backend: backendEnv
        });
      } catch (err) {
        setError('Failed to fetch environment info');
        console.error(err);
      }
    };

    checkEnv();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!envInfo) return <div>Loading environment info...</div>;

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Environment Test</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Frontend Environment:</h3>
          <pre className="bg-white p-2 rounded">
            {JSON.stringify(envInfo.frontend, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold">Backend Environment:</h3>
          <pre className="bg-white p-2 rounded">
            {JSON.stringify(envInfo.backend, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 