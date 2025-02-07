# Vite on Netlify Guide

## Overview
Vite is a modern frontend build tool designed for speed and developer experience. This guide covers how to set up and deploy Vite projects on Netlify in our monorepo structure.

## Key Features
- Fast dependency pre-bundling
- Hot Module Replacement (HMR)
- TypeScript and JSX support out of the box
- Optimized builds
- Plugin extensibility

## Project Setup

### 1. Dependencies
```bash
# Install dependencies
pnpm add -D vite @vitejs/plugin-react

# For TypeScript support
pnpm add -D typescript @types/react @types/react-dom
```

### 2. Configuration Files

#### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Netlify Deployment

### Build Settings
- Build command: `pnpm build`
- Publish directory: `dist`
- Node version: 18.x or later

### Environment Variables
```env
VITE_API_URL=your_api_url
NODE_VERSION=18.14.0
```

### SPA Configuration
For single-page applications, add a `_redirects` file in the `public` directory:
```
/* /index.html 200
```

## Common Issues

### Path Aliases
If experiencing issues with `@/*` path aliases:
1. Verify vite.config.ts alias configuration
2. Check tsconfig.json paths
3. Ensure consistent usage across imports

### Build Performance
- Use pnpm for faster installations
- Enable build caching
- Optimize dependencies with `vite-plugin-optimize`

### Troubleshooting
1. Clear cache and node_modules:
```bash
rm -rf node_modules
rm -rf dist
pnpm install
```

2. Verify local build:
```bash
pnpm build
```

3. Check Netlify logs for specific errors

## Best Practices

### Monorepo Structure
```
apps/
  your-app/
    src/
    vite.config.ts
    tsconfig.json
    package.json
```

### Development Workflow
1. Local development: `pnpm dev`
2. Test build: `pnpm build`
3. Preview: `pnpm preview`

### Performance Optimization
- Use dynamic imports for code splitting
- Optimize images and assets
- Implement proper caching strategies

## Resources
- [Vite Documentation](https://vitejs.dev/)
- [Netlify Vite Guide](https://docs.netlify.com/frameworks/vite/)
- [TypeScript Configuration](https://www.typescriptlang.org/docs/)
