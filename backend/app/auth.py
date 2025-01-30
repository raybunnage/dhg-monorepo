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


class SignupCredentials(BaseModel):
    email: EmailStr
    password: str
    password_confirmation: str


class AuthService:
    @staticmethod
    async def login(credentials: LoginCredentials) -> AuthResponse:
        try:
            print(
                "Login attempt with:",
                {
                    "email": credentials.email,
                    "supabase_url": supabase.supabase_url[:30]
                    + "...",  # Truncate for security
                    "has_key": bool(supabase.supabase_key),
                },
            )

            # Validate credentials before attempting login
            if not credentials.email or not credentials.password:
                raise HTTPException(
                    status_code=400, detail="Email and password required"
                )

            try:
                print("Attempting Supabase login...")
                auth_response = supabase.auth.sign_in_with_password(
                    {"email": credentials.email, "password": credentials.password}
                )
                print(
                    "Supabase response received:",
                    {
                        "has_user": bool(auth_response.user),
                        "has_session": bool(auth_response.session),
                    },
                )

                if not auth_response.user:
                    raise HTTPException(status_code=401, detail="Invalid credentials")

                return AuthResponse(
                    user=auth_response.user,
                    session=auth_response.session,
                    message="Login successful",
                )
            except Exception as supabase_error:
                print(f"Supabase auth error details: {str(supabase_error)}")
                raise HTTPException(
                    status_code=401,
                    detail="Authentication failed. Please check your credentials.",
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

    @staticmethod
    async def signup(credentials: SignupCredentials) -> AuthResponse:
        # Validate passwords match
        if credentials.password != credentials.password_confirmation:
            raise HTTPException(status_code=400, detail="Passwords do not match")

        # Validate password strength
        if len(credentials.password) < 8:
            raise HTTPException(
                status_code=400, detail="Password must be at least 8 characters long"
            )

        try:
            auth_response = supabase.auth.sign_up(
                {"email": credentials.email, "password": credentials.password}
            )

            if not auth_response.user:
                raise HTTPException(status_code=400, detail="Signup failed")

            user_dict = dict(auth_response.user)
            session_dict = (
                dict(auth_response.session) if auth_response.session else None
            )

            return AuthResponse(
                user=user_dict,
                session=session_dict,
                message="Signup successful. Please check your email for verification.",
            )

        except Exception as e:
            if "User already registered" in str(e):
                raise HTTPException(status_code=400, detail="Email already registered")
            raise HTTPException(
                status_code=400, detail="Signup failed. Please try again."
            )
