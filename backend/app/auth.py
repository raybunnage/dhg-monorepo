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
            print(f"Attempting Supabase login for: {credentials.email}")
            print("Calling Supabase auth.sign_in_with_password...")
            print("Request structure:", {"email": credentials.email, "password": "***"})

            try:
                print("Before Supabase auth call")
                auth_response = await supabase.auth.sign_in_with_password(
                    {"email": credentials.email, "password": credentials.password}
                )
                print("After Supabase auth call")
            except Exception as supabase_error:
                print(f"Supabase auth error: {str(supabase_error)}")
                raise HTTPException(
                    status_code=401,
                    detail="Authentication failed. Please check your credentials.",
                )

            # Log response details safely
            print(
                "Supabase response structure:",
                {
                    "has_user": auth_response.user is not None,
                    "has_session": auth_response.session is not None,
                    "user_email": auth_response.user.email
                    if auth_response.user
                    else None,
                },
            )

            if not auth_response.user:
                print("No user returned from Supabase")
                raise HTTPException(status_code=401, detail="Invalid credentials")

            try:
                user_dict = dict(auth_response.user)
                session_dict = (
                    dict(auth_response.session) if auth_response.session else None
                )
            except Exception as convert_error:
                print(f"Error converting response to dict: {str(convert_error)}")
                raise HTTPException(
                    status_code=500, detail="Error processing login response"
                )

            return AuthResponse(
                user=user_dict,
                session=session_dict,
                message="Login successful",
            )
        except Exception as e:
            print(f"Login error: {str(e)}, Type: {type(e)}")  # Enhanced debug log
            # Log the full error details
            print("Full error details:")
            print(f"  - Error type: {type(e).__name__}")
            print(f"  - Error message: {str(e)}")
            print(
                f"  - Error dict: {e.__dict__ if hasattr(e, '__dict__') else 'No dict'}"
            )
            if hasattr(e, "status_code"):
                print(f"Status code: {e.status_code}")
            if hasattr(e, "response"):
                print(f"Response: {e.response}")
            raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")

    @staticmethod
    async def signout() -> dict:
        try:
            # Verify current session before signing out
            current_user = await supabase.auth.get_user()
            if not current_user:
                raise HTTPException(status_code=401, detail="No active session")

            await supabase.auth.sign_out()
            return {"message": "Signed out successfully"}
        except Exception as e:
            print(f"Signout error: {str(e)}")  # Replace with proper logging
            raise HTTPException(status_code=400, detail="Sign out failed")

    @staticmethod
    async def get_current_user() -> Optional[dict]:
        try:
            user = await supabase.auth.get_user()
            if not user:
                return None
            return user.user
        except Exception as e:
            print(f"Get user error: {str(e)}")  # Replace with proper logging
            raise HTTPException(status_code=401, detail="Failed to get user info")

    @staticmethod
    async def signup(credentials: SignupCredentials) -> AuthResponse:
        print(f"Processing signup in AuthService for: {credentials.email}")
        # Validate passwords match
        if credentials.password != credentials.password_confirmation:
            print("Password mismatch")
            raise HTTPException(status_code=400, detail="Passwords do not match")

        # Validate password strength
        if len(credentials.password) < 8:
            print("Password too short")
            raise HTTPException(
                status_code=400,
                detail="Password must be at least 8 characters long",
            )

        try:
            print("Attempting Supabase signup")
            auth_response = await supabase.auth.sign_up(
                {"email": credentials.email, "password": credentials.password}
            )

            if not auth_response.user:
                print("Supabase signup failed - no user returned")
                raise HTTPException(status_code=400, detail="Signup failed")

            print("Signup successful")
            # Convert User and Session objects to dictionaries
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
            print(f"Signup error in AuthService: {str(e)}")
            if "User already registered" in str(e):
                raise HTTPException(status_code=400, detail="Email already registered")
            raise HTTPException(
                status_code=400, detail="Signup failed. Please try again."
            )
