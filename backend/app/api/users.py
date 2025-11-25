from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.resume:
        raise HTTPException(status_code=404, detail="No resume found")
        
    return current_user.resume.content

@router.post("/me/resume")
async def update_my_resume(
    resume: PydanticResume, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume_content = resume.model_dump(mode='json')
    
    if current_user.resume:
        current_user.resume.content = resume_content
    else:
        db_resume = DBResume(user_id=current_user.id, content=resume_content)
        db.add(db_resume)
        
    db.commit()
    return {"status": "success"}

@router.post("/me/tailor", response_model=PydanticResume)
async def tailor_my_resume(
    jd: JobDescription, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Get user's base resume
    if not current_user.resume:
        raise HTTPException(status_code=400, detail="Please upload a base resume first")
    
    base_resume = PydanticResume(**current_user.resume.content)
    
    # 2. Analyze JD
    analysis = await analyze_job_description(jd)
    
    # 3. Tailor
    tailored_resume = await tailor_resume_content(base_resume, analysis)
    
    return tailored_resume

@router.post("/me/parse-pdf", response_model=PydanticResume)
async def parse_resume_pdf(
    file: UploadFile = File(...), 
    current_user: User = Depends(get_current_user)
):
    # Note: Parsing doesn't necessarily save to DB immediately, 
    # the frontend usually calls update_my_resume after parsing.
    resume = await parse_pdf_resume(file)
    return resume
