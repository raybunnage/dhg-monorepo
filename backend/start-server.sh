#!/bin/bash

# Port for the unified backend
PORT=8000

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Kill existing process on port
kill_existing() {
    local pid=$(lsof -ti :$PORT)
    if [ ! -z "$pid" ]; then
        log "Killing existing process on port $PORT (PID: $pid)"
        kill -9 $pid
    fi
}

# Activate virtual environment if it exists
if [ -d ".venv" ]; then
    log "Activating virtual environment"
    source .venv/bin/activate
    # Ensure dependencies are in sync
    uv pip sync requirements.frozen.txt
    # Ensure we're using the venv's Python and uvicorn
    export PATH="$PWD/.venv/bin:$PATH"
else
    log "Warning: No virtual environment found at .venv"
fi

# Kill any existing process
kill_existing

# Start uvicorn server with new core app structure
log "Starting unified backend server on port $PORT"
python -m uvicorn core.app:app --reload --port $PORT --log-level debug --host 0.0.0.0 