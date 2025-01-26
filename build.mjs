import { execSync } from 'child_process';

// Build packages first
console.log('Building packages...');
execSync('pnpm --filter "@dhg/*" build', { stdio: 'inherit' });

// Then build apps
console.log('Building apps...');
execSync('pnpm --filter "./apps/*" build', { stdio: 'inherit' }); 