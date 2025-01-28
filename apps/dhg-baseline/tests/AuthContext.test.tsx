import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../src/context/AuthContext';
import { AuthProvider } from '../src/context/AuthContext';

describe('AuthContext', () => {
  it('provides initial auth state', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider initialState={{ isLoggedIn: false }}>
          {children}
        </AuthProvider>
      ),
    });

    expect(result.current.isLoggedIn).toBe(false);
  });

  it('toggles login state', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider initialState={{ isLoggedIn: false }}>
          {children}
        </AuthProvider>
      ),
    });

    act(() => {
      result.current.toggleLogin();
    });

    expect(result.current.isLoggedIn).toBe(true);
  });

  it('handles login with valid credentials', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider>
          {children}
        </AuthProvider>
      ),
    });

    let success;
    await act(async () => {
      success = await result.current.login?.('test@example.com', 'validpassword123');
    });

    expect(success).toBe(true);
    expect(result.current.isLoggedIn).toBe(true);
  });

  it('handles login with invalid credentials', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider>
          {children}
        </AuthProvider>
      ),
    });

    let success;
    await act(async () => {
      success = await result.current.login?.('wrong@email.com', 'wrongpassword');
    });

    expect(success).toBe(false);
    expect(result.current.isLoggedIn).toBe(false);
  });
}); 