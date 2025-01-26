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

# Check if package.json exists and backup if it does
if [ -f "package.json" ]; then
  echo "Backing up existing package.json..."
  mv package.json package.json.bak
fi

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

# Initialize frontend Vite apps
cd apps/dhg-baseline
rm -rf package.json # Remove if exists
pnpm create vite . --template react-ts --force
cd ../dhg-test
rm -rf package.json # Remove if exists
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
mkdir -p backend/{core,services,api/v1}

# Shared packages directory
mkdir -p packages

# Scripts directory
mkdir -p scripts/{setup,build,deploy,dev,ci,utils}

# Add a comment about structure
cat > STRUCTURE.md << EOL
# DHG Monorepo Structure

## Current Structure
- \`apps/dhg-baseline\`: Frontend baseline app (Vite + React)
- \`apps/dhg-test\`: Frontend test app (Vite + React)
- \`backend/\`: Unified backend supporting all apps
  - \`core/\`: Core FastAPI setup
  - \`services/\`: Individual services (auth, etc.)
  - \`api/\`: API routes and endpoints

### Packages
- \`packages/\`: Shared frontend utilities

### Infrastructure
- Supabase for database and auth
- Vercel for frontend and backend deployment
EOL

# Create base configuration files
cat > pnpm-workspace.yaml << EOL
packages:
  - 'apps/*'
  - 'packages/*'
EOL 