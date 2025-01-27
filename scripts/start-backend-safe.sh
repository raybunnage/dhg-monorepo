#!/bin/bash

# Function to kill process on port 8000
kill_port() {
    local port=8000
    echo "Checking for process on port $port..."
    
    if command -v lsof >/dev/null 2>&1; then
        # Using lsof if available (macOS/Linux)
        pid=$(lsof -t -i:$port)
    elif command -v netstat >/dev/null 2>&1; then
        # Using netstat as fallback (Windows)
        pid=$(netstat -ano | grep ":$port" | awk '{print $5}')
    fi

    if [ ! -z "$pid" ]; then
        echo "Killing process $pid on port $port..."
        kill -9 $pid
        sleep 1  # Give the port time to be released
    else
        echo "No process found on port $port"
    fi
}

# Ensure clean port before starting
kill_port

# Activate virtual environment and start server
cd backend && \
source .venv/bin/activate && \
uvicorn app.main:app --reload --port 8000 --log-level debug --host 0.0.0.0 