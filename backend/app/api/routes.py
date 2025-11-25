from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.resume import Resume
from app.models.job_description import JobDescription, JDAnalysis

router = APIRouter()

from app.services.analysis import analyze_job_description
from app.services.tailoring import tailor_resume_content

@router.post("/analyze-jd", response_model=JDAnalysis)
async def analyze_jd(jd: JobDescription):
    """
    Analyze a job description to extract keywords and requirements.
    """
    return await analyze_job_description(jd)

@router.post("/tailor-resume", response_model=Resume)
async def tailor_resume(resume: Resume, jd_analysis: JDAnalysis):
    """
    Tailor the resume based on the analyzed job description.
    """
    return await tailor_resume_content(resume, jd_analysis)

from fastapi import Response
from app.services.latex import generate_latex
from app.services.compiler import compile_pdf

@router.post("/generate-pdf")
async def generate_pdf(resume: Resume, template_id: str = "default"):
    """
    Generate a PDF from the resume using the specified template.
    """
    try:
        latex_content = generate_latex(resume)
        pdf_bytes = compile_pdf(latex_content)
        return Response(content=pdf_bytes, media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
