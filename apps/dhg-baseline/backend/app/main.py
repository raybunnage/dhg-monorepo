from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from .core.config import get_settings, Settings
import logging
from typing import Dict

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
        # Test basic Supabase connectivity
        response = await supabase.auth.get_session()
        logger.info("Health check - Supabase connection successful")
        return {
            "api_status": True,
            "supabase_connected": True,
            "has_session": response.session is not None,
        }
    except Exception as e:
        logger.error(f"Health check failed - Supabase error: {str(e)}")
        return {
            "api_status": True,  # API is still running
            "supabase_connected": False,
            "has_session": False,
        }


@app.get("/api/protected")
async def protected_route(supabase: Client = Depends(get_supabase)):
    return {"message": "This is a protected route", "data": "Secret data"}
