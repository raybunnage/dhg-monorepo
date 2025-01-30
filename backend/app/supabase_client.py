from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase client with anon key
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_ANON_KEY")
print(f"Initializing Supabase with URL: {url}")
print(f"Anon key starts with: {key[:10]}..." if key else "No anon key found!")

# Add timeout to Supabase client
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_ANON_KEY"),
    options={
        "auth": {
            "autoRefreshToken": True,
            "persistSession": True,
            "detectSessionInUrl": False,
        },
        "global": {
            "headers": {"x-client-info": "dhg-hub"},
            "timeout": 10,  # 10 seconds timeout
        },
    },
)
