from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.auth import verify_password, hash_password
from app.core.security import create_access_token
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.sql_models import User

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token."""
    # Query user from DB
    user = db.query(User).filter(User.username == request.username).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create JWT token
    access_token = create_access_token(data={"sub": request.username})
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        username=request.username
    )

class SignupRequest(BaseModel):
    username: str
    password: str

@router.post("/signup", response_model=LoginResponse)
async def signup(request: SignupRequest, db: Session = Depends(get_db)):
    """Register a new user and return JWT token."""
    # Check if user exists
    if db.query(User).filter(User.username == request.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Hash password
    hashed_pw = hash_password(request.password)
    
    # Create user
    new_user = User(username=request.username, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create JWT token
    access_token = create_access_token(data={"sub": request.username})
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        username=request.username
    )
