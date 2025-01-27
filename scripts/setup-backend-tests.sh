#!/bin/bash

# Exit on error
set -e

# Navigate to backend directory
cd backend

# Activate virtual environment
source .venv/bin/activate

# Ensure dependencies are installed
echo "Installing dependencies..."
uv pip install -r requirements.txt
uv pip freeze > requirements.frozen.txt

# Verify pytest installation
if ! command -v pytest &> /dev/null; then
    echo "pytest not found, installing..."
    uv pip install pytest pytest-asyncio pytest-cov httpx
fi

# Run tests with verbose output
echo "Running tests..."
python -m pytest -v

# Show test summary
echo "Tests completed!" 