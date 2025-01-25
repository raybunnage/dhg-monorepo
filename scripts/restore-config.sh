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
        ls -1 ".backups/${BRANCH_NAME}"
    else
        log "No backups found for branch: $BRANCH_NAME"
        exit 1
    fi
}

# Restore function
restore_file() {
    local src=$1
    local dest=$(echo "$src" | sed "s|$BACKUP_DIR/||")
    if [ -f "$src" ]; then
        mkdir -p "$(dirname "$dest")"
        cp "$src" "$dest"
        log "Restored: $dest"
    fi
}

# If no timestamp provided, list available backups
if [ -z "$1" ]; then
    log "Available backups for branch $BRANCH_NAME:"
    list_backups
    echo "Usage: $0 <timestamp>"
    exit 1
fi

TIMESTAMP=$1
BACKUP_DIR=".backups/${BRANCH_NAME}/${TIMESTAMP}"

# Check if backup exists
if [ ! -d "$BACKUP_DIR" ]; then
    log "Backup not found: $BACKUP_DIR"
    log "Available backups:"
    list_backups
    exit 1
fi

log "Starting restore from: $BACKUP_DIR"

# Read manifest and restore files
while IFS= read -r line; do
    if [[ $line == "  - "* ]]; then
        file="${line:4}"
        restore_file "$BACKUP_DIR/$file"
    fi
done < "$BACKUP_DIR/manifest.txt"

log "Restore completed from: $BACKUP_DIR" 