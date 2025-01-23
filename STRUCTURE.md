# DHG Monorepo Structure

## Current Structure
- `apps/dhg-baseline`: Frontend baseline app (Vite + React)
- `apps/dhg-test`: Frontend test app (Vite + React)

## Future Structure
### Apps
- `apps/dhg-baseline`: Frontend baseline app (Vite + React)
- `apps/dhg-baseline-api`: Backend baseline API (FastAPI + Python 3.11)
- `apps/dhg-test`: Frontend test app (Vite + React)
- `apps/dhg-test-api`: Backend test API (FastAPI + Python 3.11)

### Packages
- `packages/ui-components`: Shared React components
- `packages/api-client`: Shared API client utilities
- `packages/db-types`: Shared database types and schemas
- `packages/shared-utils`: Common utilities

### Infrastructure
- Supabase for database and auth
- Vercel for frontend deployment
- TBD for backend deployment
