# DHG Baseline Backend Setup Guide

This guide explains the backend setup for the DHG Baseline application.

## Current Directory Structure 

```
apps/dhg-baseline/backend/
├── app/
│   ├── main.py           # Main FastAPI application
│   └── core/
│       ├── __init__.py   # Makes core a package
│       └── config.py     # Configuration management
├── pyproject.toml        # Project metadata and dependencies
└── start-server.sh       # Server startup script
```

## Key Files Explained

### 1. pyproject.toml
This file manages project metadata and dependencies:

```toml
[project]
name = "dhg-baseline-backend"
version = "1.0.0"
requires-python = ">=3.11"
dependencies = [
    "fastapi==0.109.0",
    "uvicorn[standard]==0.27.0",
    "python-dotenv==1.0.0",
    "supabase==2.0.3"
]
```

### 2. main.py
The main FastAPI application:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from .core.config import get_settings
import logging

app = FastAPI(title="DHG Baseline API")

# Health check and environment endpoints
```

### 3. core/config.py
Manages application configuration:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    environment: str = "development"
    debug: bool = True
    supabase_url: str
    supabase_key: str
```

### 4. start-server.sh
Server startup script:
```bash
#!/bin/bash
PORT=8000
uvicorn app.main:app --reload --port $PORT --log-level debug --host 0.0.0.0
```

## Setup Process

1. **Environment Setup**
   ```bash
   # Create virtual environment
   uv venv

   # Activate virtual environment
   source .venv/bin/activate  # Unix/macOS
   .venv\Scripts\activate     # Windows
   ```

2. **Install Dependencies**
   ```bash
   uv pip sync requirements.txt
   ```

3. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials

4. **Run the Server**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## Key Features

### Authentication
- Uses Supabase for authentication
- JWT token-based auth
- Protected routes with auth middleware

### API Endpoints
1. **Health Check** (`GET /api/health`)
   - Checks server status
   - Verifies Supabase connection

2. **Protected Route** (`GET /api/protected`)
   - Requires authentication
   - Example of secured endpoint

### Error Handling
- Comprehensive error responses
- Proper HTTP status codes
- Detailed error logging

### Security
- CORS configuration
- Environment variable protection
- Secure token handling

## Development Tools

### UV Package Manager
- Fast dependency installation
- Reliable environment management
- Better dependency resolution

### FastAPI Features
- Automatic API documentation
- Type checking
- Request validation

## Common Issues and Solutions

1. **Module Not Found Errors**
   - Check virtual environment activation
   - Verify requirements installation
   - Check Python path

2. **Supabase Connection Issues**
   - Verify credentials in .env
   - Check network connectivity
   - Validate Supabase project status

3. **CORS Errors**
   - Check allowed origins in main.py
   - Verify frontend URL configuration
   - Enable credentials if needed

## Best Practices

1. **Environment Management**
   - Keep .env out of version control
   - Use different keys for development/production
   - Regular credential rotation

2. **Code Organization**
   - Modular structure
   - Clear separation of concerns
   - Consistent naming conventions

3. **Security**
   - Regular dependency updates
   - Proper error handling
   - Secure configuration management

## Next Steps

1. **Additional Features**
   - Add database models
   - Implement more auth features
   - Add custom middleware

2. **Production Deployment**
   - Configure production settings
   - Set up CI/CD
   - Monitor performance

3. **Testing**
   - Add unit tests
   - Set up integration tests
   - Implement API tests

## Running the Backend

You can start the backend server in two ways:

1. From the monorepo root:
```bash
pnpm run backend
```

2. From any subdirectory using the workspace flag:
```bash
pnpm -w run backend
```

Note: The backend script must be run with access to the workspace root since
it's defined in the root package.json.