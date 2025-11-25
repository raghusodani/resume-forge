from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.core.security import get_current_user as get_current_user_dep
from app.models.resume import Resume as PydanticResume
from app.models.job_description import JobDescription
from app.services.analysis import analyze_job_description
from app.services.tailoring import tailor_resume_content
from app.services.parsing import parse_pdf_resume
from app.db.session import get_db
from app.models.sql_models import User, Resume as DBResume

router = APIRouter()

@router.get("/me/resume", response_model=PydanticResume)
async def get_my_resume(
    username: str = Depends(get_current_user_dep),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if not user.resume:
        raise HTTPException(status_code=404, detail="No resume found")
        
    return user.resume.content

@router.post("/me/resume")
async def update_my_resume(
    resume: PydanticResume, 
    username: str = Depends(get_current_user_dep),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    resume_content = resume.model_dump(mode='json')
    
    if user.resume:
        user.resume.content = resume_content
    else:
        db_resume = DBResume(user_id=user.id, content=resume_content)
        db.add(db_resume)
        
    db.commit()
    return {"status": "success"}

@router.post("/me/tailor", response_model=PydanticResume)
async def tailor_my_resume(
    jd: JobDescription, 
    username: str = Depends(get_current_user_dep),
    db: Session = Depends(get_db)
):
    # 1. Get user's base resume
    user = db.query(User).filter(User.username == username).first()
    if not user or not user.resume:
        raise HTTPException(status_code=400, detail="Please upload a base resume first")
    
    base_resume = PydanticResume(**user.resume.content)
    
    # 2. Analyze JD
    analysis = await analyze_job_description(jd)
    
    # 3. Tailor
    tailored_resume = await tailor_resume_content(base_resume, analysis)
    
    return tailored_resume

@router.post("/me/parse-pdf", response_model=PydanticResume)
async def parse_resume_pdf(
    file: UploadFile = File(...), 
    username: str = Depends(get_current_user_dep)
):
    # Note: Parsing doesn't necessarily save to DB immediately, 
    # the frontend usually calls update_my_resume after parsing.
    resume = await parse_pdf_resume(file)
    return resume
