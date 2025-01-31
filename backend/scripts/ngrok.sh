#!/bin/bash

# Get the backend directory
BACKEND_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

# Activate the virtual environment
source "$BACKEND_DIR/.venv/bin/activate"

# Print debug info
echo "Python location: $(which python)"
echo "Pip location: $(which pip)"
echo "Checking pyngrok installation..."
python -c "from pyngrok import ngrok; print('Pyngrok is installed')"

# Run ngrok using pyngrok
if [ "$1" = "config" ] && [ "$2" = "add-authtoken" ]; then
    echo "Setting auth token..."
    python -c "from pyngrok.conf import PyngrokConfig; from pyngrok import ngrok; ngrok.set_auth_token('$3')"
    echo "Auth token set successfully"
else
    echo "Starting ngrok tunnel..."
    python -c "
from pyngrok import ngrok
import time

# Start tunnel
url = ngrok.connect($2, '$1')
print(f'\nNgrok tunnel established at: {url}')
print('Press Ctrl+C to stop the tunnel')

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print('\nClosing ngrok tunnel...')
    ngrok.kill()
"
fi 