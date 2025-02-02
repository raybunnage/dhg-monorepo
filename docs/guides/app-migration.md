# Migrating Lovable App to Monorepo

## 1. Create New App Directory
```bash
# From monorepo root
mkdir -p apps/dhg-lovable
cd apps/dhg-lovable

# Initialize package.json
pnpm init
```

## 2. Copy Core Files
```bash
# Core structure
cp -r /path/to/lovable-app/src/* apps/dhg-lovable/src/
cp /path/to/lovable-app/package.json apps/dhg-lovable/
cp /path/to/lovable-app/vite.config.ts apps/dhg-lovable/
cp /path/to/lovable-app/tsconfig.json apps/dhg-lovable/
```

## 3. Update Package Configuration
```diff:apps/dhg-lovable/package.json
{
-  "name": "your-lovable-app",
+  "name": "dhg-lovable",
   "private": true,
   "version": "0.0.0",
+  "scripts": {
+    "dev": "vite",
+    "build": "tsc && vite build",
+    "preview": "vite preview"
+  }
}
```

## 4. Update Workspace Config
```diff:pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'backend'
+ # Ensure dhg-lovable is included in workspace
```

## 5. Update Vite Config
```diff:apps/dhg-lovable/vite.config.ts
export default defineConfig({
  server: {
    port: 5179, // Different port from other apps
    proxy: {
-       target: 'http://your-old-api',
+       target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
```

## 6. Update Auth Configuration
```diff:apps/dhg-lovable/src/config/auth.ts
- // Remove direct Supabase configuration
- export const supabaseConfig = {
-   url: process.env.VITE_SUPABASE_URL,
-   key: process.env.VITE_SUPABASE_KEY
- }

+ // Use shared auth configuration
+ import { AUTH_CONFIG } from '@dhg/shared-auth'
+ 
+ export const authConfig = {
+   ...AUTH_CONFIG,
+   apiUrl: process.env.VITE_API_URL || 'http://localhost:8000'
+ }
```

## 7. Install Dependencies
```bash
# From monorepo root
pnpm install --filter dhg-lovable
```

## 8. Test the Migration
```bash
# Start the backend
cd backend
pnpm dev

# In another terminal, start the app
cd apps/dhg-lovable
pnpm dev
```

## Common Issues & Solutions

### 1. Path Resolution
```diff:apps/dhg-lovable/tsconfig.json
{
  "compilerOptions": {
+    "paths": {
+      "@/*": ["./src/*"],
+      "@dhg/shared-auth": ["../../packages/shared-auth/src"]
+    }
  }
}
```

### 2. Environment Variables
```env:apps/dhg-lovable/.env
- VITE_SUPABASE_URL=your_old_url
- VITE_SUPABASE_KEY=your_old_key
+ VITE_API_URL=http://localhost:8000
```

### 3. Auth Service Updates
```typescript:apps/dhg-lovable/src/services/auth.ts
- // Remove direct Supabase usage
- import { supabase } from '../lib/supabase'

+ // Use shared auth service
+ import { AuthService } from '@dhg/shared-auth'
+ const authService = AuthService.getInstance()
```

## Testing Checklist

- [ ] App builds successfully
- [ ] Development server starts
- [ ] Auth flow works through backend
- [ ] All routes work correctly
- [ ] Styles are applied properly
- [ ] API calls are properly proxied

## Next Steps

1. Integrate with shared packages
2. Update deployment configuration
3. Add to CI/CD pipeline
4. Update documentation

---

**Note**: Keep the original Lovable app as a backup until the migration is fully tested and working. 