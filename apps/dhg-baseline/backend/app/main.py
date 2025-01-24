from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from .core.config import get_settings, Settings
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(title="DHG Baseline API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_supabase(settings: Settings = Depends(get_settings)) -> Client:
    return create_client(settings.supabase_url, settings.supabase_key)


@app.get("/api/health")
async def health_check(supabase: Client = Depends(get_supabase)):
    try:
        # Basic Supabase connection test
        await supabase.auth.get_user()
        supabase_status = True
    except Exception as e:
        logger.error(f"Supabase connection error: {e}")
        supabase_status = False

    return {"status": "healthy", "supabase_connected": supabase_status}


@app.get("/api/protected")
async def protected_route(supabase: Client = Depends(get_supabase)):
    return {"message": "This is a protected route", "data": "Secret data"}
