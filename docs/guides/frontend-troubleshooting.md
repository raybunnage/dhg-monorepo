# Frontend Troubleshooting Guide

## Browser Developer Tools

### 1. Network Tab
```markdown
Key Steps:
1. Open Chrome DevTools (F12 or Right-click → Inspect)
2. Select Network tab
3. Filter by "Fetch/XHR" for API calls
4. Look for:
   - Red entries (failed requests)
   - Status codes (200 = success, 400/500 = errors)
   - Request/response data
   - CORS errors (blocked requests)
```

### 2. Console Tab
```markdown
Key Areas to Check:
1. Error messages (in red)
2. Console.log outputs
3. Unhandled promise rejections
4. Authentication flow logs
```

### 3. React Developer Tools
```markdown
Installation:
1. Install "React Developer Tools" Chrome extension
2. Reload your page
3. Look for React tab in DevTools

Key Features:
1. Components tab:
   - View component hierarchy
   - Inspect props and state
   - Check hooks values
   - Monitor re-renders

2. Profiler tab:
   - Performance monitoring
   - Render timing
   - Component updates
```

## Common Authentication Issues

### 1. Login Failures
```typescript
// Debug login attempt
console.log('Login attempt:', { email, password: '***' });

// Check API response
console.log('Login response:', {
  status: response.status,
  data: response.data,
  error: response.error
});
```

#### Troubleshooting Steps:
1. Check Network tab for request details
2. Verify credentials are correct
3. Look for CORS issues
4. Check Supabase connection

### 2. Session Issues
```typescript
// Debug session state
console.log('Session state:', {
  isAuthenticated: !!user,
  sessionData: session,
  tokens: {
    hasAccessToken: !!session?.access_token,
    hasRefreshToken: !!session?.refresh_token
  }
});
```

#### Common Problems:
1. Token expiration
2. Invalid token storage
3. Missing refresh logic
4. Incorrect auth state

### 3. Protected Route Issues
```typescript
// Debug route protection
console.log('Route access:', {
  path: location.pathname,
  isAuthenticated: !!user,
  isLoading,
  redirectTo: '/login'
});
```

## State Management Debugging

### 1. Context Issues
```typescript
// Debug context values
const authContext = useAuthContext();
console.log('Auth context:', {
  user: authContext.user,
  isLoading: authContext.isLoading,
  error: authContext.error
});
```

### 2. State Updates
```typescript
// Debug state changes
useEffect(() => {
  console.log('Auth state changed:', {
    user,
    isLoading,
    error
  });
}, [user, isLoading, error]);
```

## API Debugging

### 1. Request Issues
```typescript
// Debug API calls
const makeRequest = async () => {
  try {
    console.log('Making API request:', {
      url: '/api/endpoint',
      method: 'POST',
      headers: {
        Authorization: 'Bearer ***'
      }
    });
    
    const response = await fetch('/api/endpoint');
    console.log('API response:', await response.json());
  } catch (error) {
    console.error('API error:', error);
  }
};
```

### 2. CORS Problems
Common CORS error messages and solutions:
```markdown
1. "Access-Control-Allow-Origin missing"
   - Check backend CORS configuration
   - Verify allowed origins

2. "Credentials not supported if Allow-Origin is *"
   - Set specific origins instead of wildcard
   - Enable credentials in fetch calls

3. "Preflight response invalid"
   - Check OPTIONS route handling
   - Verify CORS headers
```

## Environment Issues

### 1. Environment Variables
```typescript
// Debug environment configuration
console.log('Environment:', {
  nodeEnv: process.env.NODE_ENV,
  apiUrl: import.meta.env.VITE_API_URL,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL
});
```

### 2. Build Issues
```markdown
Common build problems:
1. Missing environment variables
2. Invalid import paths
3. Type errors
4. Dependency conflicts
```

## Performance Debugging

### 1. React Profiler
```markdown
Using React Profiler:
1. Enable profiler in React DevTools
2. Record interaction
3. Analyze component renders
4. Look for:
   - Unnecessary re-renders
   - Slow components
   - Render cascades
```

### 2. Network Performance
```markdown
Network tab analysis:
1. Check request timing
2. Look for waterfall patterns
3. Identify slow requests
4. Monitor payload sizes
```

## Best Practices

### 1. Structured Logging
```typescript
// Use consistent log formats
const debugLog = (area: string, data: any) => {
  console.log(`[${area}]`, {
    timestamp: new Date().toISOString(),
    ...data
  });
};

debugLog('auth', { action: 'login', status: 'success' });
```

### 2. Error Boundaries
```typescript
// Implement error boundaries for graceful failures
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }
}
```

### 3. Development Tools
```markdown
Essential browser extensions:
1. React Developer Tools
2. Redux DevTools (if using Redux)
3. Apollo DevTools (if using GraphQL)
4. Network Panel filters
```

## Quick Reference

### Common Error Messages
```markdown
1. "Cannot read property 'x' of undefined"
   - Check null objects
   - Verify data loading
   - Use optional chaining

2. "Maximum update depth exceeded"
   - Check useEffect dependencies
   - Look for infinite loops
   - Verify state updates

3. "Invalid hook call"
   - Ensure hooks are at top level
   - Check component naming
   - Verify React version
```

### Debugging Checklist
```markdown
1. Check Console for errors
2. Inspect Network requests
3. Verify React component state
4. Check environment variables
5. Validate API responses
6. Review auth token status
``` 