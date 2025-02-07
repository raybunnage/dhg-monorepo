# Path Alias Debugging Guide (@/lib/utils)

## Common Error

## Checklist

### 1. Local File Structure
```bash
# Verify file exists in correct location
ls -la src/lib/utils.ts

# Expected location
src/
  lib/
    utils.ts
```

### 2. Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### 3. TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 4. Dependencies
```bash
# Verify required dependencies
pnpm add clsx tailwind-merge

# Check utils.ts content
cat src/lib/utils.ts
```

### 5. Netlify Build Settings
- Build command: `pnpm build`
- Publish directory: `dist`
- Node.js version: 18.x (or your project's version)

## Debugging Steps

1. **Local vs Production**
   - Test build locally: `pnpm build`
   - Check if error occurs locally or only on Netlify

2. **Clean Build**
```bash
rm -rf node_modules
rm -rf dist
pnpm install
pnpm build
```

3. **Path Resolution**
   - Verify imports use correct case sensitivity
   - Check for circular dependencies
   - Ensure no conflicting path aliases

4. **Netlify Specific**
   - Review Netlify deployment logs
   - Check Node.js version matches local
   - Verify build command matches package.json

## Utils File Content
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```