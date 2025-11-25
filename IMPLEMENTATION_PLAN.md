# Focused Implementation Plan - Production Improvements

> [!NOTE]
> Based on user feedback, this plan focuses on immediate improvements while deferring: database migration, AWS credentials rotation, and API URL environment variables.

## Scope Overview

### Backend Improvements
1. **CORS Security** - Restrict to specific origins
2. **JWT Authentication** - Secure token-based authentication
3. **Password Hashing** - Add bcrypt for secure password storage
4. **Structured Logging** - Implement comprehensive logging
5. **Error Handling** - Add proper error responses and tracking

### Frontend Improvements
6. **Code Modularity** - Break down large page components
7. **Error Boundaries** - React error handling
8. **API Client** - Centralized API wrapper with error handling
9. **Auth Context** - Global authentication state management
10. **Loading States** - Consistent loading UX
11. **Component Library** - Extract reusable components

---

## Proposed Changes

### Backend Changes

#### 1. CORS Security Fix

##### [MODIFY] [main.py](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/backend/main.py#L7-L13)

**Current**:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ❌ Security risk
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Proposed**:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Development
        "http://127.0.0.1:3000",  # Alternative localhost
        # Add production domain when deployed
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "x-token"],
)
```

---

#### 2. JWT Authentication

##### [NEW] [app/core/security.py](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/backend/app/core/security.py)

Create JWT token management:

```python
from datetime import datetime, timedelta
from typing import Optional
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# JWT Configuration
SECRET_KEY = "your-secret-key-change-in-production"  # TODO: Move to .env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

security = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> dict:
    """Verify and decode a JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> str:
    """Dependency to get current user from JWT token."""
    token = credentials.credentials
    payload = verify_token(token)
    
    username = payload.get("sub")
    if username is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    return username
```

##### [MODIFY] [app/api/auth.py](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/backend/app/api/auth.py)

Update login endpoint to return JWT tokens:

```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db import get_db
from app.services.auth import verify_password
from app.core.security import create_access_token

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    username: str

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Authenticate user and return JWT token."""
    db = get_db()
    user = db["users"].get(request.username)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create JWT token
    access_token = create_access_token(data={"sub": request.username})
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        username=request.username
    )
```

##### [MODIFY] [app/api/users.py](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/backend/app/api/users.py)

Replace header token authentication with JWT:

```python
from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.db import get_db
from app.models.resume import Resume

router = APIRouter()

@router.get("/me/resume")
async def get_my_resume(username: str = Depends(get_current_user)):
    """Get the authenticated user's base resume."""
    db = get_db()
    user = db["users"].get(username)
    
    if not user or "resume" not in user:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return user["resume"]

@router.post("/me/resume")
async def update_my_resume(
    resume: Resume,
    username: str = Depends(get_current_user)
):
    """Update the authenticated user's base resume."""
    db = get_db()
    
    if username not in db["users"]:
        raise HTTPException(status_code=404, detail="User not found")
    
    db["users"][username]["resume"] = resume.model_dump()
    # Save to file
    import json
    with open("users_db.json", "w") as f:
        json.dump(db, f, indent=2)
    
    return {"message": "Resume updated successfully"}

# Similar updates for other endpoints (tailor, parse-pdf, etc.)
```

##### [MODIFY] [requirements.txt](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/backend/requirements.txt)

Add PyJWT dependency:

```txt
fastapi
uvicorn[standard]
pydantic
pydantic-settings
python-multipart
jinja2
openai
langchain
langchain-aws
python-dotenv
google-generativeai
httpx
pypdf
bcrypt
PyJWT  # NEW - for JWT tokens
```

---

#### 3. Password Hashing

##### [NEW] [app/services/auth.py](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/backend/app/services/auth.py)

Create new authentication service with password hashing:

```python
import bcrypt
from typing import Optional

def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against a hash."""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
```

##### [MODIFY] [app/api/auth.py](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/backend/app/api/auth.py)

Update login endpoint to use hashed passwords:
- Import new auth service functions
- Verify password using `verify_password()` instead of direct comparison
- Update user creation to hash passwords

##### [MODIFY] [users_db.json](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/backend/users_db.json)

Update admin password to hashed version (one-time migration)

---

#### 3. Structured Logging

##### [NEW] [app/core/logging.py](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/backend/app/core/logging.py)

Create logging configuration:

```python
import logging
import sys
from pathlib import Path

def setup_logging(log_level: str = "INFO"):
    """Configure structured logging for the application."""
    
    # Create logs directory
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Configure logging format
    logging.basicConfig(
        level=getattr(logging, log_level),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler(log_dir / "app.log"),
        ]
    )
    
    # Create logger
    logger = logging.getLogger("resume_tailor")
    return logger

logger = setup_logging()
```

##### [MODIFY] [main.py](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/backend/main.py)

Add logging initialization and middleware

##### [MODIFY] API Endpoints

Add logging to:
- `app/api/auth.py` - Login attempts, failures
- `app/api/routes.py` - API calls, errors
- `app/api/users.py` - User operations
- `app/services/llm.py` - LLM calls, token usage
- `app/services/parsing.py` - PDF parsing attempts

---

#### 4. Error Handling Enhancement

##### [NEW] [app/core/exceptions.py](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/backend/app/core/exceptions.py)

Create custom exception classes:

```python
from fastapi import HTTPException, status

class ResumeNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )

class AuthenticationException(HTTPException):
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail
        )

class LLMException(HTTPException):
    def __init__(self, detail: str = "LLM processing failed"):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=detail
        )

class PDFParsingException(HTTPException):
    def __init__(self, detail: str = "PDF parsing failed"):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=detail
        )
```

##### [MODIFY] [main.py](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/backend/main.py)

Add global exception handler:

```python
from app.core.exceptions import *
from app.core.logging import logger

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )
```

##### [MODIFY] Service Files

Update to use custom exceptions:
- `app/services/llm.py`
- `app/services/parsing.py`  
- `app/api/auth.py`
- `app/api/users.py`

---

#### 5. Requirements Update

##### [MODIFY] [requirements.txt](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/backend/requirements.txt)

```txt
fastapi
uvicorn[standard]
pydantic
pydantic-settings
python-multipart
jinja2
openai
langchain
langchain-aws
python-dotenv
google-generativeai
httpx
pypdf
bcrypt  # NEW - for password hashing
```

Remove duplicate `python-multipart`, add versions for reproducibility.

---

### Frontend Changes

#### 6. Component Extraction - Hero Page

##### [NEW] Components

Create modular components from [page.tsx](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/frontend/src/app/page.tsx):

**File Structure**:
```
components/
├── landing/
│   ├── AnimatedBackground.tsx    - Mesh gradient & floating orbs
│   ├── Navigation.tsx             - Top nav bar
│   ├── HeroSection.tsx            - Main headline & CTA
│   ├── FeatureCard.tsx            - Feature card component
│   ├── FeatureGrid.tsx            - Grid of features
│   └── Footer.tsx                 - Footer section
```

##### [MODIFY] [app/page.tsx](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/frontend/src/app/page.tsx)

Refactor from 413 lines to ~80 lines of composition:

```tsx
export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <AnimatedBackground />
      <Navigation />
      <main className="relative">
        <HeroSection />
        <FeatureGrid />
      </main>
      <Footer />
    </div>
  );
}
```

---

#### 7. Component Extraction - Login Page

##### [NEW] Components

Create modular components from [login/page.tsx](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/frontend/src/app/login/page.tsx):

**File Structure**:
```
components/
├── login/
│   ├── CompanyStars.tsx          - Floating company logos
│   ├── ShootingStar.tsx          - Shooting star animation
│   ├── BackgroundText.tsx        - Rotated background text
│   ├── LoginForm.tsx             - Login form with inputs
│   └── DemoCredentials.tsx       - Demo badge
```

##### [NEW] Hooks

```
hooks/
├── useShootingStars.ts           - Shooting star logic
└── useAuth.ts                    - Authentication hook
```

##### [NEW] Constants

```
constants/
└── companies.ts                  - Company data array
```

##### [MODIFY] [app/login/page.tsx](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/frontend/src/app/login/page.tsx)

Refactor from 501 lines to ~100 lines of composition

---

#### 8. Error Boundaries

##### [NEW] [components/ErrorBoundary.tsx](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/frontend/src/components/ErrorBoundary.tsx)

```tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error boundary caught:', error, errorInfo);
    // TODO: Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 bg-cyan-600 rounded-lg hover:bg-cyan-500"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

##### [MODIFY] [app/layout.tsx](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/frontend/src/app/layout.tsx)

Wrap application with ErrorBoundary

---

#### 9. API Client Wrapper

##### [NEW] [lib/api-client.ts](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/frontend/src/lib/api-client.ts)

Create centralized API client:

```typescript
class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string = 'http://localhost:8000/api/v1';

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          error.detail || 'Request failed',
          error
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(0, 'Network error', error);
    }
  }

  // Authenticated request with JWT Bearer token
  private async authRequest<T>(
    endpoint: string,
    token: string,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Bearer ${token}`,  // JWT Bearer authentication
      },
    });
  }

  // Public methods
  async login(username: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getResume(token: string) {
    return this.authRequest('/users/me/resume', token);
  }

  async updateResume(token: string, resume: any) {
    return this.authRequest('/users/me/resume', token, {
      method: 'POST',
      body: JSON.stringify(resume),
    });
  }

  async tailorResume(token: string, jd: any) {
    return this.authRequest('/users/me/tailor', token, {
      method: 'POST',
      body: JSON.stringify(jd),
    });
  }

  async parsePdf(token: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/users/me/parse-pdf`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`  // JWT Bearer authentication
      },
      body: formData,
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'PDF parsing failed');
    }

    return response.json();
  }

  async generatePdf(resume: any): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/generate-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resume),
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'PDF generation failed');
    }

    return response.blob();
  }
}

export const apiClient = new ApiClient();
export { ApiError };
```

##### [MODIFY] [lib/api.ts](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/frontend/src/lib/api.ts)

Update to use new API client:
```typescript
// Re-export from api-client
export * from './api-client';
export { apiClient as api } from './api-client';
```

---

#### 10. Authentication Context

##### [NEW] [contexts/AuthContext.tsx](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/frontend/src/contexts/AuthContext.tsx)

```typescript
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

interface AuthContextType {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    
    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const data = await apiClient.login(username, password);
      
      // JWT response: { access_token, token_type, username }
      setToken(data.access_token);
      setUsername(data.username);
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('username', data.username);
      
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        isAuthenticated: !!token,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

##### [MODIFY] [app/layout.tsx](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/frontend/src/app/layout.tsx)

Wrap with AuthProvider

---

#### 11. Loading States

##### [NEW] [components/ui/LoadingState.tsx](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/frontend/src/components/ui/LoadingState.tsx)

Consistent loading component:

```tsx
import { motion } from 'framer-motion';
import { Loader } from './Loader';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ 
  message = 'Loading...', 
  fullScreen = false 
}: LoadingStateProps) {
  const className = fullScreen
    ? 'min-h-screen flex items-center justify-center bg-black'
    : 'flex items-center justify-center p-12';

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Loader size="lg" />
        <p className="mt-4 text-gray-400">{message}</p>
      </motion.div>
    </div>
  );
}
```

##### [NEW] [components/ui/ErrorState.tsx](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/frontend/src/components/ui/ErrorState.tsx)

Consistent error component

---

#### 12. Dashboard Refactoring

##### [MODIFY] [app/dashboard/page.tsx](file:///Users/raghurrs/.gemini/antigravity/scratch/resume_tailor/frontend/src/app/dashboard/page.tsx)

Extract components:
- `DashboardHeader.tsx` - Top navigation with logout
- `ResumeUploadCard.tsx` - PDF upload section
- `JobDescriptionCard.tsx` - JD input section
- `ResumeEditorCard.tsx` - Resume JSON editor
- `TailoringResultCard.tsx` - Results display

---

## Verification Plan

### Backend Testing

#### Unit Tests
```bash
# Create test file
cat > backend/tests/test_auth.py << 'EOF'
import pytest
from app.services.auth import hash_password, verify_password

def test_password_hashing():
    password = "secure_password"
    hashed = hash_password(password)
    
    assert hashed != password
    assert verify_password(password, hashed)
    assert not verify_password("wrong_password", hashed)
EOF

# Run tests
cd backend
pytest tests/
```

#### Manual Testing
```bash
# Test CORS
curl -X OPTIONS http://localhost:8000/api/v1/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Should see CORS headers with allowed origin

# Test logging
tail -f backend/logs/app.log
# Make API calls and verify logs appear

# Test error handling
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"wrong","password":"wrong"}'
# Should return proper error JSON
```

### Frontend Testing

#### Component Testing
```bash
# After refactoring, verify components render
npm run dev
# Visit http://localhost:3000 and verify:
# - Hero page looks identical
# - Login page works as before
# - Dashboard functionality unchanged
```

#### E2E Testing
```bash
# Run existing E2E tests
npm run test:e2e

# All tests should pass after refactoring
```

#### Error Boundary Testing
```typescript
// Manually trigger error in dev mode
// Add to any component temporarily:
throw new Error('Test error boundary');
// Verify error boundary catches and displays fallback
```

---

## Implementation Order

### Phase 1: Backend Security & Foundation (Day 1-2)
1. ✅ CORS fix
2. ✅ JWT authentication setup
3. ✅ Update login endpoint to return JWT tokens
4. ✅ Update protected endpoints to use JWT validation
5. ✅ Password hashing implementation
6. ✅ Update admin password in users_db.json
7. ✅ Structured logging setup
8. ✅ Custom exceptions
9. ✅ Update requirements.txt

### Phase 2: Backend Error Handling (Day 3)
10. ✅ Global exception handler
11. ✅ Add logging to all endpoints
12. ✅ Use custom exceptions in services

### Phase 3: Frontend Foundation (Day 4-5)
13. ✅ API client wrapper (with JWT Bearer auth)
14. ✅ Auth context (handle JWT tokens)
15. ✅ Error boundary
16. ✅ Loading/Error state components

### Phase 4: Frontend Refactoring (Day 6-8)
17. ✅ Extract Hero page components
18. ✅ Extract Login page components
19. ✅ Extract Dashboard components
20. ✅ Create custom hooks

### Phase 5: Testing & Verification (Day 9-10)
21. ✅ Run all E2E tests
22. ✅ Manual testing of all pages
23. ✅ Verify error handling
24. ✅ Performance check
25. ✅ Test JWT token expiration
26. ✅ Test protected endpoints

---

## Success Criteria

- [ ] Backend passes all E2E tests
- [ ] Frontend passes all E2E tests
- [ ] JWT tokens are properly generated and validated
- [ ] Protected endpoints require valid JWT tokens
- [ ] Token expiration is handled correctly
- [ ] No component exceeds 200 lines
- [ ] All API calls use centralized client with JWT Bearer auth
- [ ] All errors are properly logged
- [ ] Error boundaries catch component errors
- [ ] Loading states show for all async operations
- [ ] CORS only allows localhost origins
- [ ] Admin password is hashed in database
- [ ] All pages maintain current functionality

---

## Notes

- **Backwards Compatibility**: All changes maintain existing functionality
- **No Breaking Changes**: API contracts remain unchanged
- **Incremental**: Can be implemented in phases
- **Testable**: Each phase can be tested independently
