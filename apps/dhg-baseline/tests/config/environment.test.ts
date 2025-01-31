import { getConfig } from '../../config';

describe('Environment Config', () => {
  it('should provide config values', () => {
    const config = getConfig();
    expect(config).toBeDefined();
    expect(config.environment).toBeDefined();
    expect(config.api.baseUrl).toBeDefined();
  });

  it('should have correct default values', () => {
    const config = getConfig();
    expect(config.api.baseUrl).toBe('http://localhost:8000');
    expect(config.api.timeout).toBe(5000);
  });

  it('should have auth config', () => {
    const config = getConfig();
    expect(config.auth.tokenKey).toBe('dhg_auth_token');
    expect(config.auth.refreshTokenKey).toBe('dhg_refresh_token');
  });
}); 