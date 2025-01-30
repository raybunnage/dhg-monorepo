from fastapi import HTTPException
from .supabase_client import supabase
from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginCredentials(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    user: dict
    session: Optional[dict] = None
    message: str


class SignupCredentials(BaseModel):
    email: EmailStr
    password: str
    password_confirmation: str


class AuthService:
    @staticmethod
    async def login(credentials: LoginCredentials) -> AuthResponse:
        try:
            print(f"Attempting Supabase login for: {credentials.email}")  # Debug log
            auth_response = supabase.auth.sign_in_with_password(
                {"email": credentials.email, "password": credentials.password}
            )

            if not auth_response.user:
                raise HTTPException(status_code=401, detail="Invalid credentials")

            return AuthResponse(
                user=auth_response.user,
                session=auth_response.session,
                message="Login successful",
            )
        except Exception as e:
            print(f"Login error: {str(e)}, Type: {type(e)}")  # Enhanced debug log
            if hasattr(e, "status_code"):
                print(f"Status code: {e.status_code}")
            if hasattr(e, "response"):
                print(f"Response: {e.response}")
            raise HTTPException(status_code=401, detail="Invalid credentials")

    @staticmethod
    async def signout() -> dict:
        try:
            # Verify current session before signing out
            current_user = supabase.auth.get_user()
            if not current_user:
                raise HTTPException(status_code=401, detail="No active session")

            supabase.auth.sign_out()
            return {"message": "Signed out successfully"}
        except Exception as e:
            print(f"Signout error: {str(e)}")  # Replace with proper logging
            raise HTTPException(status_code=400, detail="Sign out failed")

    @staticmethod
    async def get_current_user() -> Optional[dict]:
        try:
            user = supabase.auth.get_user()
            if not user:
                return None
            return user.user
        except Exception as e:
            print(f"Get user error: {str(e)}")  # Replace with proper logging
            raise HTTPException(status_code=401, detail="Failed to get user info")

    @staticmethod
    async def signup(credentials: SignupCredentials) -> AuthResponse:
        # Validate passwords match
        if credentials.password != credentials.password_confirmation:
            raise HTTPException(status_code=400, detail="Passwords do not match")

        # Validate password strength
        if len(credentials.password) < 8:
            raise HTTPException(
                status_code=400,
                detail="Password must be at least 8 characters long",
            )

        try:
            auth_response = supabase.auth.sign_up(
                {"email": credentials.email, "password": credentials.password}
            )

            if not auth_response.user:
                raise HTTPException(status_code=400, detail="Signup failed")

            return AuthResponse(
                user=auth_response.user,
                session=auth_response.session,
                message="Signup successful. Please check your email for verification.",
            )

        except Exception as e:
            print(f"Signup error: {str(e)}")
            if "User already registered" in str(e):
                raise HTTPException(status_code=400, detail="Email already registered")
            raise HTTPException(
                status_code=400, detail="Signup failed. Please try again."
            )
