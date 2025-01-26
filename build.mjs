import { execSync } from 'child_process';

// Build apps
console.log('Building apps...');
execSync('pnpm --filter "./apps/*" build', { stdio: 'inherit' }); 