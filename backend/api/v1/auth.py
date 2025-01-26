from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from ..services.auth.supabase_client import supabase

router = APIRouter(prefix="/api/v1/auth")

@router.get("/status")
async def auth_status():
    return {"authenticated": False}  # Will be enhanced with actual auth check 