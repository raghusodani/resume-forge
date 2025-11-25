from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.db.session import get_db
from app.models.sql_models import User, TailoredResume
from app.api.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

# Pydantic models for response
class TailoredResumeResponse(BaseModel):
    id: int
    job_description: str
    content: dict
    created_at: str

    class Config:
        orm_mode = True

class CreateHistoryRequest(BaseModel):
    job_description: str
    content: dict

@router.get("/", response_model=List[TailoredResumeResponse])
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all tailored resumes for the current user."""
    return db.query(TailoredResume).filter(TailoredResume.user_id == current_user.id).all()

@router.post("/", response_model=TailoredResumeResponse)
def save_tailored_resume(
    request: CreateHistoryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Save a tailored resume to history."""
    new_resume = TailoredResume(
        user_id=current_user.id,
        job_description=request.job_description,
        content=request.content,
        created_at=datetime.now().isoformat()
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    return new_resume

@router.get("/{resume_id}", response_model=TailoredResumeResponse)
def get_tailored_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific tailored resume."""
    resume = db.query(TailoredResume).filter(
        TailoredResume.id == resume_id,
        TailoredResume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return resume
