#!/bin/bash

# Usage function
usage() {
    echo "Usage: $0 -a app_name [-d description]"
    echo "Example: $0 -a dhg-lovable -d 'backup before feature x'"
    exit 1
}

# Parse command line arguments
while getopts "a:d:" opt; do
    case $opt in
        a) APP_NAME="$OPTARG";;
        d) DESCRIPTION="$OPTARG";;
        *) usage;;
    esac
done

# Validate required parameters
if [ -z "$APP_NAME" ]; then
    echo "Error: App name is required"
    usage
fi

# Set default description if not provided
if [ -z "$DESCRIPTION" ]; then
    DESCRIPTION="backup"
fi

# Create timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Define backup directory structure
BACKUP_DIR=".backups/${DESCRIPTION}/${TIMESTAMP}"
mkdir -p "$BACKUP_DIR"

# Create manifest file
MANIFEST_FILE="${BACKUP_DIR}/manifest.txt"
touch "$MANIFEST_FILE"

# Function to backup a file if it exists
backup_file() {
    local src="$1"
    local dest_dir="$BACKUP_DIR/$(dirname "$src")"
    
    if [ -f "$src" ]; then
        mkdir -p "$dest_dir"
        cp "$src" "$dest_dir/"
        echo "$src" >> "$MANIFEST_FILE"
        echo "Backed up: $src"
    fi
}

# List of important files to backup for the specified app
backup_app_files() {
    local app_name="$1"
    
    # App-specific files
    backup_file "apps/${app_name}/.env"
    backup_file "apps/${app_name}/.env.local"
    backup_file "apps/${app_name}/vite.config.ts"
    backup_file "apps/${app_name}/tsconfig.json"
    backup_file "apps/${app_name}/package.json"
    
    # Source files
    backup_file "apps/${app_name}/src/App.tsx"
    backup_file "apps/${app_name}/src/main.tsx"
    backup_file "apps/${app_name}/src/vite-env.d.ts"
    
    # Config files
    backup_file "apps/${app_name}/src/config/index.ts"
    backup_file "apps/${app_name}/src/config/constants.ts"
    
    # Layout components
    backup_file "apps/${app_name}/src/components/layout/Header.tsx"
    backup_file "apps/${app_name}/src/components/layout/MainLayout.tsx"
    
    # Documentation
    backup_file "apps/${app_name}/docs/database/experts-table.md"
    
    # Pages
    for page in "Index" "Experts" "NotFound"; do
        backup_file "apps/${app_name}/src/pages/${page}.tsx"
    done
}

# Backup app files
backup_app_files "$APP_NAME"

# Backup shared configuration files
backup_file "package.json"
backup_file "pnpm-workspace.yaml"
backup_file "tsconfig.base.json"
backup_file ".env"

# Print summary
echo -e "\nBackup completed!"
echo "Location: $BACKUP_DIR"
echo "Files backed up:"
cat "$MANIFEST_FILE" 