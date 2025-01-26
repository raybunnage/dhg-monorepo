from fastapi import HTTPException
from .supabase_client import supabase
from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginCredentials(BaseModel):
    email: EmailStr  # Add validation for email
    password: str


class AuthResponse(BaseModel):
    user: dict
    session: Optional[dict] = None
    message: str


class AuthService:
    @staticmethod
    async def login(credentials: LoginCredentials) -> AuthResponse:
        try:
            # Validate credentials before attempting login
            if not credentials.email or not credentials.password:
                raise HTTPException(
                    status_code=400, detail="Email and password required"
                )

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
            # Log the error here (but don't expose internal details)
            print(f"Login error: {str(e)}")  # Replace with proper logging
            raise HTTPException(
                status_code=401,
                detail="Authentication failed. Please check your credentials.",
            )

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
