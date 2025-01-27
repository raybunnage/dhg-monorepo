from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from typing import Dict
from datetime import datetime
from ..core.config import get_settings
from .auth import get_supabase

router = APIRouter(tags=["health"])

async def check_supabase_auth(supabase: Client) -> Dict:
    try:
        # Try to get anon JWT - if this works, auth is configured
        jwt = await supabase.auth.get_session()
        return {
            "auth_status": "healthy",
            "message": "Supabase auth connection verified"
        }
    except Exception as e:
        return {
            "auth_status": "unhealthy",
            "error": str(e)
        }

async def check_supabase_db(supabase: Client) -> Dict:
    try:
        # Simple query to verify database connection
        result = await supabase.table('health_checks').select("*").limit(1).execute()
        return {
            "db_status": "healthy",
            "message": "Database connection verified"
        }
    except Exception as e:
        return {
            "db_status": "unhealthy",
            "error": str(e)
        }

@router.get("/health")
async def health_check(supabase: Client = Depends(get_supabase)) -> Dict:
    """
    Comprehensive health check endpoint that verifies:
    1. Backend server status
    2. Supabase authentication service
    3. Supabase database connection
    4. Environment configuration
    """
    timestamp = datetime.utcnow().isoformat()
    settings = get_settings()

    # Check Supabase services
    auth_status = await check_supabase_auth(supabase)
    db_status = await check_supabase_db(supabase)

    # Determine overall health
    is_healthy = (
        auth_status.get("auth_status") == "healthy" and 
        db_status.get("db_status") == "healthy"
    )

    response = {
        "timestamp": timestamp,
        "status": "healthy" if is_healthy else "unhealthy",
        "environment": settings.environment,
        "services": {
            "backend": {
                "status": "healthy",
                "version": "1.0.0"  # You can make this dynamic
            },
            "supabase": {
                "auth": auth_status,
                "database": db_status
            }
        }
    }

    if not is_healthy:
        raise HTTPException(
            status_code=503,
            detail=response
        )

    return response 