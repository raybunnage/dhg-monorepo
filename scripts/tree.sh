#!/bin/bash

# Directories and files to show
SHOW_DIRS=(
  "apps"
  "packages"
  "backend"
  "docs"
  "scripts"
)

# Files to include
INCLUDE_FILES=(
  "*.tsx"
  "*.ts"
  "*.py"
  "*.md"
  "*.json"
  "*.yaml"
  "*.yml"
  "ngrok.sh"
)

# Directories to exclude
EXCLUDE_DIRS=(
  "node_modules"
  "dist"
  "build"
  "__pycache__"
  ".next"
  ".turbo"
  "coverage"
  ".git"
  ".venv"
  "venv"
)

# Files to exclude
EXCLUDE_FILES=(
  "*.test.*"
  "*.spec.*"
  "*.d.ts"
  "*.map"
)

# Build the find command
FIND_CMD="find ${SHOW_DIRS[@]} -type f"

# Add include patterns
FIND_CMD+=" \( -false"
for pattern in "${INCLUDE_FILES[@]}"; do
  FIND_CMD+=" -o -name \"$pattern\""
done
FIND_CMD+=" \)"

# Add exclude directories
for dir in "${EXCLUDE_DIRS[@]}"; do
  FIND_CMD+=" -not -path \"*/$dir/*\""
done

# Add exclude files
for pattern in "${EXCLUDE_FILES[@]}"; do
  FIND_CMD+=" -not -name \"$pattern\""
done

# Execute and sort
eval "$FIND_CMD" | sort 