#!/bin/bash

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Check if app name is provided
if [ -z "$1" ]; then
    log "Error: Please provide an app name"
    log "Usage: ./start-backend.sh <app-name>"
    log "Available apps:"
    ls -1 apps/
    exit 1
fi

APP_NAME=$1
APP_PATH="apps/$APP_NAME/backend"

# Check if app exists
if [ ! -d "$APP_PATH" ]; then
    log "Error: App backend not found at $APP_PATH"
    log "Available apps:"
    ls -1 apps/
    exit 1
fi

# Navigate to app backend
cd "$APP_PATH" || exit 1
log "Changed to directory: $APP_PATH"

# Check for virtual environment
if [ ! -d ".venv" ]; then
    log "Error: No virtual environment found at $APP_PATH/.venv"
    log "Please create and set up the virtual environment first"
    exit 1
fi

# Activate virtual environment
log "Activating virtual environment"
source .venv/bin/activate

# Check for start-server.sh
if [ ! -f "./start-server.sh" ]; then
    log "Error: start-server.sh not found in $APP_PATH"
    exit 1
fi

# Make sure start-server.sh is executable
chmod +x ./start-server.sh

# Start the server
log "Starting backend server for $APP_NAME"
./start-server.sh 