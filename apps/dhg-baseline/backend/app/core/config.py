from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    # Use service role key for backend, not anon key
    supabase_url: str = os.getenv("VITE_SUPABASE_URL", "")
    # Anon key for public operations
    supabase_key: str = os.getenv("VITE_SUPABASE_ANON_KEY", "")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    environment: str = os.getenv("VITE_APP_ENV", "development")

    class Config:
        env_file = ".env"
        extra = "allow"  # Allow extra fields from env


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    Uses LRU cache to avoid reading env file multiple times.
    """
    return Settings()
