from supabase import create_client
from pydantic import BaseModel
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str
    DEBUG: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
# Use anon key for client-side operations
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
