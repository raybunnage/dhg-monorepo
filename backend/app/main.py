from fastapi import FastAPI, Response, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from .auth import AuthService, LoginCredentials

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
