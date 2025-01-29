# Debug Tools for Auth & Routing

This directory contains debugging tools for testing authentication and routing functionality.

## TestColorApp

The TestColorApp provides a reference implementation for the login theme colors:
- Shows the exact color palette used
- Demonstrates proper theme implementation
- Can be used to test color changes

To use TestColorApp for testing:
1. In main.tsx, import TestColorApp
2. Replace <App /> with <TestColorApp />
3. Test color changes
4. Switch back to <App /> when done

## TestApp

The TestApp provides a simplified interface for testing:
- Auth state visualization
- Route navigation
- Login/Logout functionality
- Current path display

### Features
- Visual auth status indicator (✅ Logged In / ❌ Logged Out)
- Simple navigation between pages
- Clear display of current route
- Basic login/logout functionality

### Current Setup
The debug version is currently active in `main.tsx`. It provides:
1. A test interface for auth state
2. Basic routing between Home/Login/Test pages
3. Visual feedback for auth state changes
4. Path tracking for route changes

### To Restore Production Version
When needed, we can switch back to the production version by:
1. Saving the current debug version in `TestApp.tsx`
2. Restoring the original routing and auth flow

For now, we're keeping the debug version active as it's helping verify our auth and routing functionality. 