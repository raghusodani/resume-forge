from fastapi import APIRouter, HTTPException, Header, Depends
from app.models.resume import Resume
from app.models.job_description import JobDescription, JDAnalysis
from app.services.analysis import analyze_job_description
from app.services.tailoring import tailor_resume_content
from app.db import get_user, update_user_resume

router = APIRouter()

async def get_current_user(x_token: str = Header(...)):
    # Mock auth: token is just the username
    user = get_user(x_token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return x_token

@router.get("/me/resume", response_model=Resume)
async def get_my_resume(username: str = Depends(get_current_user)):
    user = get_user(username)
    if not user.get("resume"):
        raise HTTPException(status_code=404, detail="No resume found")
    return user["resume"]

@router.post("/me/resume")
async def update_my_resume(resume: Resume, username: str = Depends(get_current_user)):
    update_user_resume(username, resume.model_dump(mode='json'))
    return {"status": "success"}

@router.post("/me/tailor", response_model=Resume)
async def tailor_my_resume(jd: JobDescription, username: str = Depends(get_current_user)):
    # 1. Get user's base resume
    user = get_user(username)
    if not user.get("resume"):
        raise HTTPException(status_code=400, detail="Please upload a base resume first")
    
    base_resume = Resume(**user["resume"])
    
    # 2. Analyze JD
    analysis = await analyze_job_description(jd)
    
    # 3. Tailor
    tailored_resume = await tailor_resume_content(base_resume, analysis)
    
    return tailored_resume

from fastapi import UploadFile, File
from app.services.parsing import parse_pdf_resume

@router.post("/me/parse-pdf", response_model=Resume)
async def parse_resume_pdf(file: UploadFile = File(...), username: str = Depends(get_current_user)):
    resume = await parse_pdf_resume(file)
    return resume
