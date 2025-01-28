import { getConfig } from '../../config';

describe('Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should load development config', () => {
    process.env.NODE_ENV = 'development';
    const config = getConfig();
    expect(config.apiUrl).toBe('http://localhost:3000');
  });

  it('should load production config', () => {
    process.env.NODE_ENV = 'production';
    const config = getConfig();
    expect(config.apiUrl).toBe('https://api.dhg-hub.org');
  });
}); 