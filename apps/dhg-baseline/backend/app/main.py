from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from .core.config import get_settings
import logging
import os
from typing import Dict
import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(title="DHG Baseline API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5177"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "service": "DHG Baseline API",
        "version": "1.0.0",  # Should match pyproject.toml
        "docs": "/docs",
        "health": "/api/health",
        "status": "/api/status",
    }


@app.get("/api/health")
async def health_check():
    """Basic health check endpoint"""
    try:
        settings = get_settings()
        supabase = create_client(settings.supabase_url, settings.supabase_key)
        await supabase.auth.get_url()
        return {"status": "healthy", "supabase_connected": True}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {"status": "unhealthy", "supabase_connected": False}


@app.get("/api/status")
async def service_status() -> Dict:
    """Detailed service status endpoint"""
    settings = get_settings()
    return {
        "service": "dhg-baseline",
        "status": "operational",
        "environment": settings.environment,
        "debug": settings.debug,
        "version": "1.0.0",  # Should match pyproject.toml
        "timestamp": datetime.datetime.utcnow().isoformat(),
    }


@app.get("/api/version")
async def get_version():
    """API version information"""
    return {
        "version": "1.0.0",  # Should match pyproject.toml
        "min_client_version": "1.0.0",
        "build_date": datetime.datetime.utcnow().date().isoformat(),
    }


@app.get("/api/env")
async def get_environment():
    """Environment configuration endpoint"""
    settings = get_settings()
    return {"environment": settings.environment, "debug_mode": settings.debug}
