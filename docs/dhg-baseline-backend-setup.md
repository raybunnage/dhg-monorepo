# DHG Baseline Backend Setup Guide

This guide explains the backend setup for the DHG Baseline application, designed for beginners to understand each component.

## Directory Structure 

apps/dhg-baseline/backend/
├── app/
│ ├── main.py # Main FastAPI application
│ ├── core/
│ │ └── config.py # Configuration management
├── .env # Environment variables
├── requirements.txt # Python dependencies
├── runtime.txt # Python version specification
└── pyproject.toml # Project metadata and tools config
```

## Key Files Explained

### 1. requirements.txt
This file lists all Python packages needed to run the backend. Here's what each major dependency does:

```txt
# Core Framework
fastapi==0.109.0          # Main web framework
uvicorn[standard]==0.27.0 # ASGI server for running the application

# Database & Auth
supabase==2.0.3          # Supabase client for auth and database
postgrest==0.13.0        # PostgreSQL REST interface
python-jose[cryptography] # JWT token handling

# Utilities
python-dotenv==1.0.0     # Environment variable management
pydantic==2.5.2          # Data validation
httpx==0.26.0            # HTTP client

# Additional Dependencies
websockets               # WebSocket support
typing-extensions       # Enhanced type hints
pydantic-settings      # Settings management
```

### 2. main.py
The main application file that sets up the FastAPI server:

```python
# Key components:
- FastAPI application setup
- CORS middleware configuration
- Supabase client initialization
- API endpoints definition
```

Important features:
- Health check endpoint (`/api/health`)
- Protected routes
- Error handling
- Logging configuration

### 3. config.py
Manages application configuration using environment variables:

```python
# Handles:
- Environment variables loading
- Application settings
- Supabase configuration
```

### 4. .env
Contains sensitive configuration values:
```env
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
DEBUG=true
```

### 5. runtime.txt
Specifies the Python version:
```txt
python-3.11.7
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