#!/bin/bash

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check and install pnpm if not present
if ! command_exists pnpm; then
  echo "pnpm is not installed. Installing pnpm..."
  # Check if npm exists, if not install Node.js first
  if ! command_exists npm; then
    echo "npm is not installed. Please install Node.js first from: https://nodejs.org/"
    echo "After installing Node.js, run this script again."
    exit 1
  fi
  # Install pnpm using npm
  npm install -g pnpm
fi

# Check and install Vercel CLI if not present
if ! command_exists vercel; then
  echo "Vercel CLI is not installed. Installing Vercel..."
  npm install -g vercel
fi

echo "Initializing monorepo workspace..."

# Initialize the monorepo workspace
pnpm init

# Initialize Vite apps using pnpm
cd apps/dhg-baseline
pnpm create vite . --template react-ts --force
cd ../dhg-test
pnpm create vite . --template react-ts --force
cd ../..

# Install dependencies at root
pnpm install

# Install app-specific dependencies
cd apps/dhg-baseline
pnpm install
pnpm add -D @types/react @types/react-dom
cd ../dhg-test
pnpm install
pnpm add -D @types/react @types/react-dom
cd ../..

# Create the basic directory structure
mkdir -p apps/dhg-baseline
mkdir -p apps/dhg-test
# Future backend directories (commented out for now)
# mkdir -p apps/dhg-baseline-api
# mkdir -p apps/dhg-test-api

# Shared packages directory
mkdir -p packages
# Future shared package directories (commented out for now)
# mkdir -p packages/ui-components
# mkdir -p packages/api-client
# mkdir -p packages/db-types
# mkdir -p packages/shared-utils

# Scripts directory
mkdir -p scripts/{setup,build,deploy,dev,ci,utils}

# Add a comment about future structure
cat > STRUCTURE.md << EOL
# DHG Monorepo Structure

## Current Structure
- \`apps/dhg-baseline\`: Frontend baseline app (Vite + React)
- \`apps/dhg-test\`: Frontend test app (Vite + React)

## Future Structure
### Apps
- \`apps/dhg-baseline\`: Frontend baseline app (Vite + React)
- \`apps/dhg-baseline-api\`: Backend baseline API (FastAPI + Python 3.11)
- \`apps/dhg-test\`: Frontend test app (Vite + React)
- \`apps/dhg-test-api\`: Backend test API (FastAPI + Python 3.11)

### Packages
- \`packages/ui-components\`: Shared React components
- \`packages/api-client\`: Shared API client utilities
- \`packages/db-types\`: Shared database types and schemas
- \`packages/shared-utils\`: Common utilities

### Infrastructure
- Supabase for database and auth
- Vercel for frontend deployment
- TBD for backend deployment
EOL

# Create base configuration files
cat > pnpm-workspace.yaml << EOL
packages:
  - 'apps/*'
  - 'packages/*'
EOL

# Create root package.json with workspaces
printf '%s\n' '{
  "name": "dhg-monorepo",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test"
  },
  "devDependencies": {
    "turbo": "latest"
  }
}' > package.json 