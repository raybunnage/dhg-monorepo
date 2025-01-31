from fastapi import HTTPException, Depends
from .supabase_client import supabase
from pydantic import BaseModel, EmailStr
from typing import Optional
from supabase import create_client
from .config import get_settings
import uuid


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


class SetPasswordRequest(BaseModel):
    token: str
    password: str


class ResetPasswordRequest(BaseModel):
    email: EmailStr


class AuthService:
    @staticmethod
    async def login(credentials: LoginCredentials) -> AuthResponse:
        try:
            print(
                "🔑 Login attempt with:",
                {
                    "email": credentials.email,
                    "password_length": len(credentials.password),
                    "supabase_url": supabase.supabase_url[:30] + "...",
                    "has_key": bool(supabase.supabase_key),
                },
            )

            # Validate credentials
            if not credentials.email or not credentials.password:
                print("❌ Missing email or password")
                raise HTTPException(
                    status_code=400, detail="Email and password required"
                )

            try:
                print("📡 Attempting Supabase login...")
                auth_response = supabase.auth.sign_in_with_password(
                    {"email": credentials.email, "password": credentials.password}
                )
                print(
                    "📥 Supabase login response:",
                    {
                        "has_user": bool(auth_response.user),
                        "has_session": bool(auth_response.session),
                        "error": getattr(auth_response, "error", None),
                    },
                )

                if not auth_response.user:
                    print("❌ No user returned from Supabase")
                    raise HTTPException(status_code=401, detail="Invalid credentials")

                print("✅ Login successful")
                # Debug the session structure
                print(
                    "Session data:",
                    {
                        "raw": auth_response.session,
                        "keys": auth_response.session.__dict__
                        if auth_response.session
                        else None,
                    },
                )

                # Convert to dict safely
                user_dict = dict(auth_response.user)
                session_dict = (
                    {
                        "access_token": auth_response.session.access_token,
                        "refresh_token": auth_response.session.refresh_token,
                        "expires_at": auth_response.session.expires_at,
                    }
                    if auth_response.session
                    else None
                )

                return AuthResponse(
                    user=user_dict,
                    session=session_dict,
                    message="Login successful",
                )
            except Exception as supabase_error:
                print(f"🚨 Supabase auth error: {str(supabase_error)}")
                raise HTTPException(
                    status_code=401,
                    detail="Authentication failed. Please check your credentials.",
                )
        except Exception as e:
            print(f"🚨 Login error: {str(e)}")
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
        print(f"🔐 Starting signup process for email: {credentials.email}")
        print(f"🔑 Using Supabase URL: {supabase.supabase_url}")
        print(
            f"🔑 Has service role key: {bool(get_settings().supabase_service_role_key)}"
        )

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
            print("📡 Attempting Supabase signup with admin client...")
            settings = get_settings()
            admin_client = create_client(
                settings.supabase_url, settings.supabase_service_role_key
            )

            auth_response = admin_client.auth.sign_up(
                {"email": credentials.email, "password": credentials.password}
            )
            print(
                "📥 Supabase signup response:",
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
            print(f"❌ Signup error: {str(e)}")
            print(f"❌ Error type: {type(e)}")
            print(
                f"❌ Error details: {e.__dict__ if hasattr(e, '__dict__') else 'No details'}"
            )
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

    @staticmethod
    async def set_password(request: SetPasswordRequest) -> dict:
        try:
            print(
                "🔑 Received token:",
                {
                    "token": request.token[:10] + "..." if request.token else "None",
                    "length": len(request.token) if request.token else 0,
                },
            )

            # Clean the token - remove any URL encoding or extra characters
            cleaned_token = request.token.strip()
            if "#" in cleaned_token:
                cleaned_token = cleaned_token.split("#")[0]

            # Handle Supabase JWT access tokens
            if cleaned_token.startswith("ey"):  # JWT format
                try:
                    settings = get_settings()
                    admin_client = create_client(
                        settings.supabase_url, settings.supabase_service_role_key
                    )
                    user = admin_client.auth.get_user(cleaned_token)
                    if user and user.user:
                        cleaned_token = user.user.id
                        print("✅ Extracted user ID from JWT:", cleaned_token)
                except Exception as e:
                    print("❌ Failed to get user from JWT:", str(e))
                    raise HTTPException(status_code=400, detail="Invalid token")

            if not AuthService.is_valid_uuid(cleaned_token):
                print("❌ Invalid token format:", cleaned_token[:10] + "...")
                raise HTTPException(status_code=400, detail="Invalid token format")

            print(f"Attempting to set password with token: {cleaned_token[:10]}...")

            settings = get_settings()
            admin_client = create_client(
                settings.supabase_url, settings.supabase_service_role_key
            )

            response = admin_client.auth.admin.update_user_by_id(
                cleaned_token, {"password": request.password}
            )
            print("✅ Password update response:", response)
            return {"message": "Password updated successfully"}
        except Exception as e:
            print(f"🚨 Error setting password: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def is_valid_uuid(uuid_string: str) -> bool:
        try:
            uuid.UUID(uuid_string)
            return True
        except ValueError:
            return False

    @staticmethod
    async def request_reset_password(request: ResetPasswordRequest) -> dict:
        try:
            print("🔄 Requesting password reset for:", request.email)

            reset_options = {
                "redirect_to": "http://localhost:5177/login",
                "email_template": {"linktype": "recovery"},
            }
            print("📧 Reset options:", reset_options)

            auth_response = supabase.auth.reset_password_email(
                email=request.email, options=reset_options
            )

            print(
                "📨 Reset email status:",
                {"email": request.email, "sent": bool(auth_response)},
            )

            return {
                "message": "If an account exists with this email, you will receive a password reset link"
            }
        except Exception as e:
            print(f"🚨 Reset password error: {str(e)}")
            print(f"🚨 Error type: {type(e)}")
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    async def verify_email(token: str) -> dict:
        """Verify email with token from URL"""
        try:
            print(f"Verifying email with token: {token[:10]}...")
            result = supabase.auth.verify_email(token)
            return {"message": "Email verified successfully"}
        except Exception as e:
            print(f"Error verifying email: {e}")
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    async def handle_auth_callback(params: dict) -> dict:
        """Handle OAuth callback"""
        try:
            print("Processing auth callback...")
            session = supabase.auth.get_session_from_url(params)
            return {"session": session, "message": "Authentication successful"}
        except Exception as e:
            print(f"Error handling callback: {e}")
            raise HTTPException(status_code=400, detail=str(e))
