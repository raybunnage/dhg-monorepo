from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    environment: str = "development"
    debug: bool = True
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str
    supabase_auth_disable_emails: bool = False
    supabase_jwt_secret: str

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
