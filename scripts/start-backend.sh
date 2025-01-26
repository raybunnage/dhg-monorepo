#!/bin/bash

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

BACKEND_PATH="backend"

# Check if backend exists
if [ ! -d "$BACKEND_PATH" ]; then
    log "Error: Backend not found at $BACKEND_PATH"
    exit 1
fi

# Navigate to backend
cd "$BACKEND_PATH" || exit 1
log "Changed to directory: $BACKEND_PATH"

# Check for virtual environment
if [ ! -d ".venv" ]; then
    log "Error: No virtual environment found at $BACKEND_PATH/.venv"
    log "Please create and set up the virtual environment first"
    exit 1
fi

# Activate virtual environment
log "Activating virtual environment"
source .venv/bin/activate

# Check for start-server.sh
if [ ! -f "./start-server.sh" ]; then
    log "Error: start-server.sh not found in $BACKEND_PATH"
    exit 1
fi

# Make sure start-server.sh is executable
chmod +x ./start-server.sh

# Start the server
log "Starting unified backend server"
./start-server.sh 