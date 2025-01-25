#!/bin/bash

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Check if app name is provided
if [ -z "$1" ]; then
    log "Error: Please provide an app name"
    log "Usage: ./start-frontend.sh <app-name>"
    log "Available apps:"
    ls -1 apps/
    exit 1
fi

APP_NAME=$1
APP_PATH="apps/$APP_NAME"

# Check if app exists
if [ ! -d "$APP_PATH" ]; then
    log "Error: App not found at $APP_PATH"
    log "Available apps:"
    ls -1 apps/
    exit 1
fi

# Navigate to app directory
cd "$APP_PATH" || exit 1
log "Changed to directory: $APP_PATH"

# Check for package.json
if [ ! -f "package.json" ]; then
    log "Error: package.json not found in $APP_PATH"
    exit 1
fi

# Kill any existing Vite dev servers
kill_port() {
    local port=$1
    local pid=$(lsof -ti :$port)
    if [ ! -z "$pid" ]; then
        log "Killing existing process on port $port (PID: $pid)"
        kill -9 $pid
    fi
}

# Default Vite ports
kill_port 5173  # Default Vite port
kill_port 5174  # Common alternative
kill_port 5175  # Just in case
kill_port 5176  # Just in case
kill_port 5177  # Just in case

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    log "Installing dependencies..."
    pnpm install
fi

# Start the development server
log "Starting frontend development server for $APP_NAME"
pnpm dev 