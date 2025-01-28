import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

describe('AuthContext', () => {
  it('provides initial auth state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    expect(result.current.isLoggedIn).toBe(false);
  });

  it('toggles login state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    
    act(() => {
      result.current.toggleLogin();
    });
    
    expect(result.current.isLoggedIn).toBe(true);
  });

  // Remove or update login-specific tests since we're using toggleLogin now
}); 