from supabase import create_client
from .config import get_settings

settings = get_settings()

# Initialize Supabase client
supabase = create_client(settings.supabase_url, settings.supabase_anon_key)
