from app.models.job_description import JDAnalysis, JobDescription
from app.services.llm import llm_client
from app.services.cleaning import clean_text

async def analyze_job_description(jd: JobDescription) -> JDAnalysis:
    cleaned_text = clean_text(jd.raw_text)
    
    prompt = f"""
    Analyze the following job description and extract key information in JSON format.
    
    Job Description:
    {cleaned_text}
    
    Output JSON structure:
    {{
        "role_type": "string",
        "keywords": [
            {{"term": "string", "importance": int (1-5), "category": "string"}}
        ],
        "required_skills": ["string"],
        "preferred_skills": ["string"],
        "experience_level": "string",
        "key_responsibilities": ["string"]
    }}
    """
    
    result = await llm_client.generate_json(prompt)
    
    # Fallback if LLM fails or no key
    if "error" in result or not result:
        return JDAnalysis(
            role_type="Unknown",
            keywords=[],
            required_skills=[],
            preferred_skills=[],
            experience_level="Unknown",
            key_responsibilities=[]
        )
        
    return JDAnalysis(**result)
