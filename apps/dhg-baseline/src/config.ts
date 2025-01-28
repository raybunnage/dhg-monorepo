interface Config {
  apiUrl: string;
  environment: string;
}

export const getConfig = (): Config => {
  const isDev = process.env.NODE_ENV === 'development';

  return {
    apiUrl: isDev ? 'http://localhost:3000' : 'https://api.dhg-hub.org',
    environment: process.env.NODE_ENV || 'development'
  };
};

export default getConfig(); 