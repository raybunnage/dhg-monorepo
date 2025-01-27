#!/bin/bash

# Kill any process using port 5177
lsof -ti:5177 | xargs kill -9 2>/dev/null || true

# Start vite dev server
pnpm vite 