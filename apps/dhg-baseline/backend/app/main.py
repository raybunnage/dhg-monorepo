from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from .core.config import get_settings, Settings
import logging
from typing import Dict, Optional
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(title="DHG Baseline API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5177"],  # Updated port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_supabase(settings: Settings = Depends(get_settings)) -> Client:
    return create_client(settings.supabase_url, settings.supabase_key)


@app.get("/")
async def root():
    return {
        "message": "Welcome to DHG Baseline API",
        "docs": "/docs",
        "health": "/api/health",
    }


@app.get("/api/health", response_model=Dict[str, bool])
async def health_check(supabase: Client = Depends(get_supabase)) -> Dict[str, bool]:
    """
    Check the health of the API and Supabase connection.
    Returns:
        Dict with status indicators for API and Supabase connection
    """
    try:
        # Test a basic Supabase operation that doesn't require auth
        response = await supabase.auth.get_url()
        logger.info(f"Supabase URL response: {response}")
        logger.info("Health check - Supabase connection successful")
        return {"api_status": True, "supabase_connected": True}
    except Exception as e:
        logger.error(
            f"Health check failed - Supabase error: {type(e).__name__}: {str(e)}"
        )
        return {"api_status": True, "supabase_connected": False}


@app.get("/api/protected")
async def protected_route(supabase: Client = Depends(get_supabase)):
    return {"message": "This is a protected route", "data": "Secret data"}


@app.get("/api/auth/status", response_model=Dict[str, bool | Optional[str]])
async def auth_status(supabase: Client = Depends(get_supabase)):
    """
    Check authentication status and return user info if authenticated.
    Returns:
        Dict with auth status and user email if authenticated
    """
    try:
        response = await supabase.auth.get_session()
        is_authenticated = response.session is not None
        return {
            "is_authenticated": is_authenticated,
            "user_email": response.session.user.email if is_authenticated else None,
        }
    except Exception as e:
        logger.error(f"Auth status check failed: {str(e)}")
        return {
            "is_authenticated": False,
            "user_email": None,
        }


@app.get("/api/env")
async def get_environment():
    """Test endpoint to verify environment configuration"""
    return {
        "environment": os.getenv("VITE_APP_ENV", "not_set"),
        "supabase_url": os.getenv("VITE_SUPABASE_URL", "not_set"),
        # Don't expose the actual key, just whether it's set
        "has_supabase_key": bool(os.getenv("VITE_SUPABASE_ANON_KEY")),
        "debug_mode": os.getenv("DEBUG", "false").lower() == "true",
    }
