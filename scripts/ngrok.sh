#!/bin/bash

# Get the monorepo root directory
REPO_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

# Activate the virtual environment
source "$REPO_ROOT/tools/ngrok/venv/bin/activate"

# Print debug info
echo "Python location: $(which python)"
echo "Pip location: $(which pip)"
echo "Looking for ngrok in venv..."
find "$REPO_ROOT/tools/ngrok/venv" -name ngrok

# Run ngrok using pyngrok
if [ "$1" = "config" ] && [ "$2" = "add-authtoken" ]; then
    python -c "from pyngrok.conf import PyngrokConfig; from pyngrok import ngrok; ngrok.set_auth_token('$3')"
else
    python -c "from pyngrok import ngrok; ngrok.connect($2, '$1')"
fi 