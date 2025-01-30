from fastapi import HTTPException
from .supabase_client import supabase
from pydantic import BaseModel, EmailStr
from typing import Optional
from supabase import create_client
from .config import get_settings


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
        print(f"Starting signup process for email: {credentials.email}")
        # Validate passwords match
        if credentials.password != credentials.password_confirmation:
            print("Password mismatch during signup")
            raise HTTPException(status_code=400, detail="Passwords do not match")

        # Validate password strength
        if len(credentials.password) < 8:
            print("Password too short during signup")
            raise HTTPException(
                status_code=400, detail="Password must be at least 8 characters long"
            )

        try:
            print("Attempting Supabase signup with admin client...")
            # Create admin client with service role key
            settings = get_settings()
            admin_client = create_client(
                settings.supabase_url, settings.supabase_service_role_key
            )

            auth_response = admin_client.auth.sign_up(
                {"email": credentials.email, "password": credentials.password}
            )
            print(
                "Supabase signup response received:",
                {
                    "has_user": bool(auth_response.user),
                    "has_session": bool(auth_response.session),
                    "response": str(auth_response),
                    "using": "admin client",
                },
            )

            if not auth_response.user:
                print("No user returned from Supabase signup")
                raise HTTPException(status_code=400, detail="Signup failed")

            user_dict = dict(auth_response.user)
            session_dict = (
                dict(auth_response.session) if auth_response.session else None
            )

            print("Signup successful, returning response")
            return AuthResponse(
                user=user_dict,
                session=session_dict,
                message="Signup successful. Please check your email for verification.",
            )

        except Exception as e:
            print(f"Signup error: {str(e)}")
            error_msg = str(e).lower()
            if "user already registered" in error_msg:
                raise HTTPException(status_code=400, detail="Email already registered")
            if "duplicate key value" in error_msg:
                raise HTTPException(status_code=400, detail="Email already registered")
            if "user not allowed" in error_msg:
                # Try direct signup without checking existing users
                try:
                    auth_response = supabase.auth.sign_up(
                        {"email": credentials.email, "password": credentials.password}
                    )
                    if auth_response.user:
                        return AuthResponse(
                            user=dict(auth_response.user),
                            session=dict(auth_response.session)
                            if auth_response.session
                            else None,
                            message="Signup successful. Please check your email for verification.",
                        )
                except Exception as signup_error:
                    print(f"Direct signup error: {str(signup_error)}")
            raise HTTPException(
                status_code=400, detail="Signup failed. Please try again."
            )
