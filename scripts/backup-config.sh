#!/bin/bash

# Get current branch name
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=".backups/${BRANCH_NAME}/${TIMESTAMP}"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Backup function
backup_file() {
    local src=$1
    local dest="$BACKUP_DIR/$(dirname "$1")"
    if [ -f "$src" ]; then
        mkdir -p "$dest"
        cp "$src" "$dest/"
        log "Backed up: $src"
    else
        log "Skipped (not found): $src"
    fi
}

log "Starting backup for branch: $BRANCH_NAME"

# Define apps to backup
APPS=(
    "dhg-baseline"
    "dhg-test"
)

# Define packages to backup
PACKAGES=(
    "auth-service"
)

# List of files to backup
FILES_TO_BACKUP=()

# Add package files
for package in "${PACKAGES[@]}"; do
    log "Checking files for package: ${package}"
    package_files=(
        # Environment files (not in git)
        "packages/${package}/.env"
        "packages/${package}/.env.local"
        "packages/${package}/.env.development"
        "packages/${package}/.env.production"
        
        # Local configuration overrides
        "packages/${package}/tsconfig.local.json"
    )
    FILES_TO_BACKUP+=("${package_files[@]}")
    log "Added ${#package_files[@]} potential files for package ${package}"
done

# Add files for each app
for app in "${APPS[@]}"; do
    log "Checking files for app: ${app}"
    # Temporary array for this app's files
    app_files=(
        # Environment files (not in git)
        "apps/${app}/.env"
        "apps/${app}/backend/.env"
        
        # Any local override files
        "apps/${app}/.env.local"
        "apps/${app}/.env.development.local"
        "apps/${app}/.env.production.local"
        
        # Backend environment files
        "apps/${app}/backend/.env.local"
        "apps/${app}/backend/.env.development.local"
        "apps/${app}/backend/.env.production.local"
        
        # Local configuration overrides (only if they exist)
        "apps/${app}/vercel.local.json"        # Local Vercel overrides
        "apps/${app}/vite.config.local.ts"     # Local Vite overrides
        "apps/${app}/tsconfig.local.json"      # Local TypeScript overrides
        "apps/${app}/package.local.json"       # Local package overrides
    )
    # Add this app's files to main array
    FILES_TO_BACKUP+=("${app_files[@]}")
    log "Added ${#app_files[@]} potential files for ${app}"
done

# Debug: Print all files that will be backed up
log "Files to backup:"
printf '%s\n' "${FILES_TO_BACKUP[@]}"
log "Total files to check: ${#FILES_TO_BACKUP[@]}"

# Backup each file
for file in "${FILES_TO_BACKUP[@]}"; do
    backup_file "$file"
done

# Create manifest file
echo "Branch: $BRANCH_NAME" > "$BACKUP_DIR/manifest.txt"
echo "Timestamp: $TIMESTAMP" >> "$BACKUP_DIR/manifest.txt"
echo "Files:" >> "$BACKUP_DIR/manifest.txt"
for file in "${FILES_TO_BACKUP[@]}"; do
    if [ -f "$file" ]; then
        echo "  - $file" >> "$BACKUP_DIR/manifest.txt"
    fi
done

log "Backup completed: $BACKUP_DIR" 