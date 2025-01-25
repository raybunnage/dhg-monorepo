#!/bin/bash

# From monorepo root
find . -type f -name "*.pyc" -delete
find . -type d -name "__pycache__" -exec rm -r {} + 