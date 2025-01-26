#!/bin/bash

# Function for logging with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Default app is dhg-baseline if none specified
APP_NAME=${1:-"dhg-baseline"}

# Validate app exists
if [ ! -d "apps/$APP_NAME" ]; then
    log "Error: App '$APP_NAME' not found in apps directory"
    log "Available apps:"
    ls -1 apps/
    exit 1
fi

log "Starting frontend app: $APP_NAME"

# Change to app directory and start dev server
cd "apps/$APP_NAME" || exit
pnpm dev 