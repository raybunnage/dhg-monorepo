# Frontend Debugging Guide

## Key Files for Debugging
```
apps/dhg-baseline/
├── src/
│   ├── main.tsx           # Application entry point
│   ├── App.tsx           # Main app component
│   ├── lib/
│   │   └── supabase.ts   # Supabase client setup
│   ├── context/
│   │   └── AuthContext.tsx # Auth state management
│   └── pages/
│       └── LoginPage.tsx  # Login page component
└── index.html            # HTML entry point
```

## Step-by-Step Debugging Process

### 0. Initial Problem Assessment
1. Check browser console for errors
2. Verify if app is mounting at all
3. Look for "Loading Application..." message
4. Check network requests
5. Verify environment variables

### 1. Start with Basic React
First, strip down to minimal React setup to verify basic functionality:

```typescript
// main.tsx
const TestApp = () => (
  <div>
    <h1>Basic React Test</h1>
  </div>
);
```

### 2. Incremental Feature Addition
Add features one at a time in this order:

1. **Basic React**
   - Verify React mounting
   - Check for console errors
   - Ensure DOM updates

2. **Router Setup**
   ```typescript
   const TestApp = () => (
     <BrowserRouter>
       <div>
         <nav>
           <Link to="/">Home</Link>
           <Link to="/test">Test</Link>
         </nav>
         <Routes>
           <Route path="/" element={<div>Home</div>} />
           <Route path="/test" element={<div>Test</div>} />
         </Routes>
       </div>
     </BrowserRouter>
   );
   ```

3. **Auth Context**
   ```typescript
   const AuthContext = createContext<AuthState | undefined>(undefined);
   
   export function AuthProvider({ children }: { children: React.ReactNode }) {
     const [isLoggedIn, setIsLoggedIn] = useState(false);
     return (
       <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
         {children}
       </AuthContext.Provider>
     );
   }
   ```

4. **Feature Components**
   - Add components one at a time
   - Test each integration point
   - Verify state management

### 3. Common Issues and Solutions

#### Environment Variables Not Loading
1. Check `.env` file location
2. Verify variable naming (must start with VITE_)
3. Restart dev server after changes

#### React Component Not Mounting
1. Check for JavaScript errors
2. Verify root element exists
3. Add console logs for debugging:
```typescript
console.log('🚀 Starting application...');
const root = document.getElementById('root');
console.log('Found root:', !!root);
```

#### Router Issues
1. Verify BrowserRouter wrapper
2. Check route paths
3. Add route debugging:
```typescript
const RouteDebugger = () => {
  const location = useLocation();
  useEffect(() => {
    console.log('Route changed:', location.pathname);
  }, [location]);
  return null;
};
```

### 4. Debugging Process

1. **Clean Environment**
```bash
cd apps/dhg-baseline
rm -rf node_modules .vite dist
pnpm install
pnpm dev
```

2. **Add Logging Points**
- Application start
- Component mounting
- State changes
- Route changes

3. **Verify Each Layer**
- DOM mounting
- React initialization
- Router functionality
- Context providers
- Feature components

### 5. Best Practices

1. **Incremental Development**
   - Start with minimal setup
   - Add features one at a time
   - Test each addition

2. **Clear Logging**
   - Use descriptive prefixes
   - Log state changes
   - Track component lifecycle

3. **Error Handling**
   - Wrap code in try/catch
   - Show user-friendly errors
   - Log debugging information

4. **Component Testing**
   - Test in isolation
   - Verify props and state
   - Check event handlers

## Example Debug Flow

```typescript
// 1. Basic React Test
const TestApp = () => <div>Basic React</div>;

// 2. Add Router
const TestApp = () => (
  <BrowserRouter>
    <Routes>...</Routes>
  </BrowserRouter>
);

// 3. Add Auth
const TestApp = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>...</Routes>
    </AuthProvider>
  </BrowserRouter>
);

// 4. Add Features
const TestApp = () => (
  <BrowserRouter>
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          ...
        </Routes>
      </Layout>
    </AuthProvider>
  </BrowserRouter>
);
```

## Related Documentation
- [TypeScript Frontend Guide](./typescript-frontend-guide.md)
- [Supabase Key Management](../setup/supabase-key-management.md)
- [Basic Auth Changes](../changes/feature-basic-auth-changes.md)

### Browser Debugging Tools
1. **Clear Cache and Hard Reload**
   ```markdown
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"
   ```

2. **Console Filtering**
   ```markdown
   - Use filter box in console
   - Filter by "supabase" or other keywords
   - Check "Preserve log" for page reloads
   ```

3. **Source Mapping**
   ```markdown
   - Map local files to browser sources
   - Use "Select folder" in Sources panel
   - Enable proper debugging
   ```

### Environment Variable Debugging
```typescript
// Add to supabase.ts
console.log('Supabase Config:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlValue: supabaseUrl?.substring(0, 10) + '...',
  mode: import.meta.env.MODE
});
```

### Progressive Testing Steps
1. Verify HTML loading
2. Check React mounting
3. Test router functionality
4. Validate auth context
5. Add feature components
6. Connect to Supabase

## Troubleshooting Checklist
- [ ] Clear browser cache
- [ ] Clean install dependencies
- [ ] Verify environment variables
- [ ] Check console logs
- [ ] Test basic React mounting
- [ ] Verify router setup
- [ ] Test auth context
- [ ] Add features incrementally 

## Browser Developer Tools Guide

### Opening and Navigating DevTools
1. **Opening DevTools**
   - Press F12 or right-click → Inspect
   - Key panels:
     - Console: For logging
     - Sources: For debugging code
     - Network: For API requests
     - Elements: For DOM inspection

### Console Panel Tips
1. **Clearing and Filtering**
   ```markdown
   - Click 🚫 icon to clear console
   - Use filter box: type "supabase" to filter logs
   - Select "All levels" in dropdown to see all logs
   - Check "Preserve log" to keep logs during refresh
   ```

2. **Finding the Right Source File**
   ```markdown
   - In Sources panel, you might see multiple versions:
     - Bundled version (shows processed code)
     - Source version (your actual code)
   - Look for files under src/ directory
   - Ignore files under @react-refresh or similar
   ```

### Setting Up Source Maps
1. **Workspace Setup**
   ```markdown
   1. See "To sync edits to the workspace..." message
   2. Click "Select folder"
   3. Navigate to apps/dhg-baseline
   4. Select folder to enable proper source mapping
   ```

2. **Benefits of Source Mapping**
   - See actual source code
   - Set breakpoints
   - Debug in context
   - Edit code directly in DevTools

### Debugging with Breakpoints
1. **Setting Breakpoints**
   ```typescript
   // Method 1: In code
   debugger; // Add this line in your code

   // Method 2: In DevTools
   // Click line number in Sources panel
   ```

2. **Using Breakpoints**
   ```markdown
   - Step Over (F10): Execute current line
   - Step Into (F11): Enter function call
   - Step Out (Shift+F11): Exit current function
   - Continue (F8): Run until next breakpoint
   ```

3. **Inspecting Variables**
   ```markdown
   - Hover over variables in code
   - Use Watch panel to track values
   - Console is available in debug mode
   ```

### Example Debugging Session
```markdown
1. Open DevTools (F12)
2. Go to Sources panel
3. Find src/lib/supabase.ts
4. Set breakpoint at client creation:
   ```typescript
   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```
5. Refresh page
6. When breakpoint hits:
   - Inspect supabaseUrl and supabaseAnonKey
   - Check environment variables
   - Step through code
```

### Common Debugging Scenarios
1. **Environment Variables**
   ```markdown
   - Set breakpoint in supabase.ts
   - Check import.meta.env values
   - Verify VITE_ prefix on variables
   ```

2. **React Component Mounting**
   ```markdown
   - Break on component function
   - Check props and state
   - Verify render flow
   ```

3. **Auth Flow**
   ```markdown
   - Break on login function
   - Track state changes
   - Follow redirect flow
   ```

### Tips for Effective Debugging
1. **Console Methods**
   ```typescript
   console.log('Basic log');
   console.info('Info message');
   console.warn('Warning message');
   console.error('Error message');
   console.group('Group label');
   console.groupEnd();
   ```

2. **Conditional Breakpoints**
   - Right-click line number
   - Add condition (e.g., `isLoggedIn === true`)

3. **Network Monitoring**
   - Use Network tab
   - Filter by "Fetch/XHR"
   - Check Supabase API calls

4. **React DevTools**
   - Install React DevTools extension
   - Components tab for hierarchy
   - Profiler for performance 