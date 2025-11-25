from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.db import get_user

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    username: str

@router.post("/login", response_model=LoginResponse)
async def login(creds: LoginRequest):
    user = get_user(creds.username)
    if not user or user["password"] != creds.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # In a real app, generate a JWT here. For now, just return the username as a mock token.
    return LoginResponse(token=creds.username, username=creds.username)
