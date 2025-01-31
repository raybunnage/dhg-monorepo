from fastapi import FastAPI, Response, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .auth import AuthService, LoginCredentials, SignupCredentials, SetPasswordRequest
from .supabase_client import supabase
from .config import get_settings
from supabase import create_client

# Create auth router
auth_router = APIRouter(prefix="/api/auth", tags=["auth"])


@auth_router.post("/login")
async def login(request: LoginCredentials, response: Response):
    auth_response = await AuthService.login(request)
    response.set_cookie(
        key="sb-access-token",
        value=auth_response.session.access_token,
        httponly=True,
        secure=True,
        samesite="lax",
    )
    return {"user": auth_response.user, "message": "Login successful"}


@auth_router.post("/signout")
async def signout(response: Response):
    result = await AuthService.signout()
    response.delete_cookie("sb-access-token")
    return result


@auth_router.get("/user")
async def get_user():
    return await AuthService.get_current_user()


@auth_router.post("/signup")
async def signup(credentials: SignupCredentials):
    print(f"Received signup request for: {credentials.email}")
    return await AuthService.signup(credentials)


@auth_router.get("/debug/users")
async def list_users():
    try:
        settings = get_settings()
        admin_client = create_client(
            settings.supabase_url, settings.supabase_service_role_key
        )
        users = admin_client.auth.admin.list_users()
        print("Current users:", users)
        return {"users": users}
    except Exception as e:
        print(f"Error listing users: {e}")
        return {"error": str(e)}


@auth_router.get("/debug/invite-token/{email}")
async def get_invite_token(email: str):
    try:
        settings = get_settings()
        admin_client = create_client(
            settings.supabase_url, settings.supabase_service_role_key
        )
        # Generate invite link for testing
        result = admin_client.auth.admin.invite_user(
            email=email, data={"testing": True}
        )
        print(f"Generated invite token for {email}")
        return {"token": result.token}
    except Exception as e:
        print(f"Error generating token: {e}")
        return {"error": str(e)}


@auth_router.post("/set-password")
async def set_password(request: SetPasswordRequest):
    return await AuthService.set_password(request)


# Main app
app = FastAPI(title="DHG Hub API")


# Add root endpoint
@app.get("/")
async def root():
    return {"message": "Backend server is running"}


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5177"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
