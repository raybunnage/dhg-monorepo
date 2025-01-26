import { execSync } from 'child_process';

// Build frontend apps
console.log('Building frontend apps...');
execSync('pnpm --filter "./apps/*" build', { stdio: 'inherit' });

// Build backend
console.log('Building backend...');
execSync('cd backend && uv pip sync requirements.frozen.txt', { stdio: 'inherit' }); 