interface Config {
  api: {
    baseUrl: string;
    timeout: number;
  };
  auth: {
    tokenKey: string;
    refreshTokenKey: string;
  };
  environment: 'development' | 'production' | 'test';
}

const config: Config = {
  api: {
    baseUrl: process.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 5000,
  },
  auth: {
    tokenKey: 'dhg_auth_token',
    refreshTokenKey: 'dhg_refresh_token',
  },
  environment: (process.env.NODE_ENV || 'development') as Config['environment'],
};

export const getConfig = (): Config => config;

export default config; 