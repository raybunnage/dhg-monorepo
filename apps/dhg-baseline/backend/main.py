from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""), os.getenv("SUPABASE_KEY", "")
)


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/api/protected")
async def protected_route():
    return {"message": "This is a protected route", "data": "Secret data"}
