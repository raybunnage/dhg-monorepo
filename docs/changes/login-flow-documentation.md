# Login Flow Documentation

## Overview
This document captures the working login functionality as of January 2024. Use this as a reference when making changes to ensure existing functionality isn't broken.

## Backend Components

### Configuration
**File: backend/app/config.py**
- Manages environment variables through Pydantic settings
- Provides Supabase credentials
- Required env vars:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY

### Supabase Client
**File: backend/app/supabase_client.py**
```python
from supabase import create_client
from .config import get_settings

settings = get_settings()
supabase = create_client(
    settings.supabase_url,
    settings.supabase_anon_key
)
```

### Auth Models & Service
**File: backend/app/auth.py**

Key models:
```python
class LoginCredentials(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    user: Optional[dict] = None
    session: Optional[dict] = None
    message: str
```

Login service:
```python
@staticmethod
async def login(credentials: LoginCredentials) -> AuthResponse:
    try:
        auth_response = await supabase.auth.sign_in_with_password(
            {"email": credentials.email, "password": credentials.password}
        )
        
        if not auth_response.user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
        user_dict = dict(auth_response.user)
        session_dict = dict(auth_response.session) if auth_response.session else None
        
        return AuthResponse(
            user=user_dict,
            session=session_dict,
            message="Login successful"
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")
```

### FastAPI Routes
**File: backend/app/main.py**
```python
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
```

## Frontend Components

### Auth Context
**File: apps/dhg-baseline/src/context/AuthContext.tsx**
```typescript
interface AuthState {
  isLoggedIn: boolean;
  toggleLogin: () => void;
}

export const AuthProvider = ({ children, initialState }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(initialState?.isLoggedIn ?? false);
  
  const toggleLogin = () => {
    if (initialState?.toggleLogin) {
      initialState.toggleLogin();
    }
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, toggleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Login Page
**File: apps/dhg-baseline/src/pages/LoginPage.tsx**
```typescript
const LoginPage = () => {
  const { toggleLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (email && password) {
      toggleLogin();
      navigate('/dashboard');
    } else {
      setError('Please enter both email and password');
    }
    setIsLoading(false);
  };
}
```

## Environment Configuration

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## CORS Configuration
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5177"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Authentication Flow
1. User enters credentials on LoginPage
2. Form submission triggers handleSubmit
3. Backend receives POST to /api/auth/login
4. AuthService attempts Supabase login
5. Success path:
   - Sets auth cookie
   - Returns user data
   - Frontend toggles login state
   - Redirects to dashboard
6. Error path:
   - Returns 401 error
   - Frontend displays error message

## Testing Invite Flow
1. Get invite token:
   ```bash
   curl http://localhost:8000/api/auth/debug/invite-token/user@example.com
   ```
2. Use token in URL:
   ```
   http://localhost:5177/login?token={USER_ID}&type=invite
   ```
3. Verify:
   - Password setup screen appears
   - Can set new password
   - Redirects to dashboard after success

## Important Notes
- CORS must be configured before routes
- Cookie settings are critical for auth persistence
- Frontend uses environment variables for API and Supabase config
- Error handling includes both frontend and backend validation 

## Using ngrok for Development

### What is ngrok?
ngrok is a tool that creates a secure tunnel to expose your local development server to the internet. This is essential for:
- Testing email verification flows
- Testing invite links
- Simulating how your app behaves in production
- Testing from different devices/networks

### Setup and Usage
1. Start your local servers:
   ```bash
   # Terminal 1: Frontend (localhost:5177)
   pnpm dev

   # Terminal 2: Backend (localhost:8000)
   uvicorn app.main:app --reload
   ```

2. Start ngrok tunnel:
   ```bash
   # Terminal 3: Creates public URL for frontend
   ./scripts/ngrok.sh http 5177
   ```

### Testing Different Flows
1. Regular Login/Signup:
   - Use the ngrok URL directly (e.g., https://your-ngrok-url.ngrok-free.app)
   - Works same as localhost

2. Email Verification:
   - Sign up with email on ngrok URL
   - Click verification link in email
   - Link will go through ngrok to your local server

3. First-time Password Setup:
   - More complex because it involves multiple steps:
     1. User gets invite email
     2. Clicks link that goes to ngrok URL
     3. Sets password through ngrok tunnel
   - For testing, use debug endpoint with ngrok URL:
     ```
     https://your-ngrok-url.ngrok-free.app/login?token={USER_ID}&type=invite
     ```

### Common Issues
- CORS: Make sure ngrok domain is allowed in backend CORS config
- Cookies: Some browsers block third-party cookies from ngrok domains
- Timeouts: ngrok free tier has connection limits 