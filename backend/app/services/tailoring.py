from app.models.resume import Resume
from app.models.job_description import JDAnalysis
from app.services.llm import llm_client

async def tailor_resume_content(resume: Resume, analysis: JDAnalysis) -> Resume:
    """
    Tailors a resume based on a job description analysis.
    
    Args:
        resume: The base resume to tailor.
        analysis: The analysis of the job description.
        
    Returns:
        Resume: The tailored resume.
    """
    # Convert resume to JSON string for prompt
    resume_json = resume.model_dump_json()
    analysis_json = analysis.model_dump_json()
    
    prompt = f"""
    Tailor the following resume content to match the job description analysis.
    
    Resume:
    {resume_json}
    
    Job Analysis:
    {analysis_json}
    
    Instructions:
    1. Rewrite experience bullet points to highlight relevant skills and achievements.
    2. Reorder skills to prioritize those required by the job.
    3. Update the summary to align with the role.
    4. Do NOT invent false information. Only rephrase or emphasize existing experience.
    
    """
    
    # Use the new LLM client
    result = await llm_client.generate_json(prompt)
    
    if "error" in result or not result:
        return resume
        
    # Merge result back into Resume object (handling potential partial returns or errors safely)
    # For now, we assume the LLM returns a valid full resume structure.
    try:
        return Resume(**result)
    except Exception as e:
        print(f"Tailoring Error: {e}")
        return resume
