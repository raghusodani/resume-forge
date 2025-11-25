"""
Exception utilities and global error handler for the backend.
"""
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from .logger import logger

class ServiceError(HTTPException):
    """Base class for service‑level errors."""
    def __init__(self, status_code: int = 500, detail: str = "Internal server error"):
        super().__init__(status_code=status_code, detail=detail)

def register_global_exception_handler(app):
    """Register a catch‑all exception handler that logs the error and returns a JSON response.
    
    Usage:
        from app.core.exceptions import register_global_exception_handler
        register_global_exception_handler(app)
    """
    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception: {exc}", exc_info=True)
        # If it's an HTTPException we can preserve its status code and detail
        if isinstance(exc, HTTPException):
            return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
        # Otherwise return a generic 500 response
        return JSONResponse(status_code=500, content={"detail": "Internal server error"})
