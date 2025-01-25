from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    # Use service role key for backend, not anon key
    supabase_url: str = os.getenv(
        "SUPABASE_URL", "https://jdksnfkupzywjdfefkyj.supabase.co"
    )
    # Anon key for public operations
    supabase_key: str = os.getenv("SUPABASE_ANON_KEY", "")  # Default to anon key
    debug: bool = os.getenv("DEBUG", "False").lower() == "true"

    class Config:
        env_file = ".env"
        extra = "allow"  # Allow extra fields from env


@lru_cache()
def get_settings() -> Settings:
    return Settings()
