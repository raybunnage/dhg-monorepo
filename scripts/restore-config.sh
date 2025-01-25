#!/bin/bash

# Get current branch name
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# List available backups
list_backups() {
    if [ -d ".backups/${BRANCH_NAME}" ]; then
        echo "Available backups for branch ${BRANCH_NAME}:"
        ls -1t ".backups/${BRANCH_NAME}" | while read -r backup; do
            echo "  $backup"
            if [ -f ".backups/${BRANCH_NAME}/$backup/manifest.txt" ]; then
                echo "  └── Files in backup:"
                grep "^  - " ".backups/${BRANCH_NAME}/$backup/manifest.txt" | sed 's/^/      /'
            fi
        done
    else
        log "No backups found for branch: $BRANCH_NAME"
        exit 1
    fi
}

# Restore function with confirmation
restore_file() {
    local src=$1
    local dest=$(echo "$src" | sed "s|$BACKUP_DIR/||")
    if [ -f "$src" ]; then
        if [ -f "$dest" ]; then
            log "Warning: File exists: $dest"
            read -p "Do you want to overwrite? (y/N) " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                log "Skipped: $dest"
                return
            fi
        fi
        mkdir -p "$(dirname "$dest")"
        cp "$src" "$dest"
        log "Restored: $dest"
    else
        log "Not found in backup: $src"
    fi
}

# Define apps and packages (matching backup-config.sh)
APPS=(
    "dhg-baseline"
    "dhg-test"
)

PACKAGES=(
    "auth-service"
)

# If no timestamp provided, list available backups
if [ -z "$1" ]; then
    list_backups
    echo
    echo "Usage: $0 <timestamp> [--force]"
    exit 1
fi

TIMESTAMP=$1
BACKUP_DIR=".backups/${BRANCH_NAME}/${TIMESTAMP}"
FORCE_RESTORE=${2:-""}

# Check if backup exists
if [ ! -d "$BACKUP_DIR" ]; then
    log "Backup not found: $BACKUP_DIR"
    list_backups
    exit 1
fi

log "Starting restore from: $BACKUP_DIR"

# Read manifest and restore files
if [ -f "$BACKUP_DIR/manifest.txt" ]; then
    log "Reading manifest file..."
    
    # Show what will be restored
    log "Files to be restored:"
    grep "^  - " "$BACKUP_DIR/manifest.txt" | sed 's/^  - /  /'
    
    # Ask for confirmation unless --force is used
    if [ "$FORCE_RESTORE" != "--force" ]; then
        echo
        read -p "Do you want to proceed with restore? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "Restore cancelled"
            exit 1
        fi
    fi
    
    # Restore files
    while IFS= read -r line; do
        if [[ $line == "  - "* ]]; then
            file="${line:4}"
            restore_file "$BACKUP_DIR/$file"
        fi
    done < "$BACKUP_DIR/manifest.txt"
else
    log "Error: manifest.txt not found in backup"
    exit 1
fi

log "Restore completed from: $BACKUP_DIR" 