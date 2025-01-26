from fastapi import APIRouter, Depends, HTTPException
from supabase import create_client, Client
from pydantic import BaseModel
import os

router = APIRouter()

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_SERVICE_KEY", "")
)

class UserAuth(BaseModel):
    email: str
    password: str

@router.post("/verify-token")
async def verify_token(token: str):
    try:
        user = supabase.auth.get_user(token)
        return {"valid": True, "user": user}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token") 