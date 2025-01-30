from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase client with service key
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # Using the service role key
) 