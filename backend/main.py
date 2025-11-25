from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.logger import logger
from app.core.exceptions import register_global_exception_handler
from app.db.session import engine, Base

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Resume Tailor API")

import os

# Configure CORS - restrict to specific origins
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://resume-forge-sable.vercel.app",  # Production Frontend
]

# Add origins from env var
env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    origins.extend([origin.strip() for origin in env_origins.split(",")])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# Register global exception handler
register_global_exception_handler(app)

from app.api.routes import router as api_router
from app.api.auth import router as auth_router
from app.api.users import router as users_router

app.include_router(api_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(users_router, prefix="/api/v1/users")

@app.get("/")
async def root():
    return {"message": "Resume Tailor API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
