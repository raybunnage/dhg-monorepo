from fastapi import FastAPI, Response, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from .auth import AuthService, LoginCredentials, SignupCredentials

# Create the FastAPI app first
app = FastAPI(title="DHG Hub API")

# Configure CORS immediately after app creation and before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5177"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Create auth router
auth_router = APIRouter(prefix="/api/auth", tags=["auth"])


@auth_router.post("/login")
async def login(request: LoginCredentials, response: Response):
    print(f"Login attempt for email: {request.email}")  # Debug log
    auth_response = await AuthService.login(request)
    if auth_response.session:
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
    print(f"Received signup request for: {credentials.email}")  # Debug log
    return await AuthService.signup(credentials)


@auth_router.options("/{path:path}")
async def auth_options(path: str):
    return Response(status_code=200)


# Add root endpoint
@app.get("/")
async def root():
    return {"message": "Backend server is running"}


@app.get("/api/health")
async def health_check():
    return Response(
        content='{"status": "healthy"}',
        media_type="application/json",
        headers={
            "Access-Control-Allow-Origin": "http://localhost:5177",
            "Access-Control-Allow-Credentials": "true",
        }
    )

# Include routers after CORS configuration
app.include_router(auth_router)
