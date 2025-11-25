from fastapi import UploadFile
import pypdf
import io
from app.services.llm import llm_client
from app.models.resume import Resume

async def parse_pdf_resume(file: UploadFile) -> Resume:
    """
    Parses a PDF resume file and returns a structured Resume object.
    
    Args:
        file: The uploaded PDF file.
        
    Returns:
        Resume: The structured resume data.
    """
    # 1. Extract text from PDF
    content = await file.read()
    pdf_file = io.BytesIO(content)
    reader = pypdf.PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
        
        # Extract links from annotations (e.g., LinkedIn, GitHub)
        if "/Annots" in page:
            for annot in page["/Annots"]:
                try:
                    obj = annot.get_object()
                    if "/A" in obj and "/URI" in obj["/A"]:
                        uri = obj["/A"]["/URI"]
                        text += f"\n[LINK FOUND]: {uri}\n"
                except Exception:
                    pass
    
    print(f"Extracted text length: {len(text)} characters")
    
    # 2. Use LLM to structure the data
    prompt = f"""
    You are an expert resume parser. Extract the following information from the resume text below and structure it into a JSON object that matches the following schema:
    
    Resume Schema:
    - contact_info: {{ name, email, phone, linkedin, github, website, location }}
    - summary: string
    - education: [ {{ institution, degree, field_of_study, start_date, end_date }} ]
    - experience: [ {{ company, position, start_date, end_date, location, description (list of strings) }} ]
    - projects: [ {{ name, description, technologies (list of strings), url }} ]
    - skills: [ {{ category, skills (list of strings) }} ]
    
    IMPORTANT: 
    - If a field is missing, use an empty string "" or empty list [] as appropriate. Do NOT use null.
    - 'experience.description' MUST be a list of strings (bullet points), not a single string.
    
    Resume Text:
    {text}
    """
    
    # Use the new LLM client which returns a Dict
    data = await llm_client.generate_json(prompt)
    
    # Sanitize data to match Pydantic strictness
    if "skills" in data:
        for skill_cat in data["skills"]:
            # Remap 'items' to 'skills' if LLM uses the wrong key
            if "items" in skill_cat and "skills" not in skill_cat:
                skill_cat["skills"] = skill_cat.pop("items")
                
    if "contact_info" not in data:
        data["contact_info"] = {}

    if "contact_info" in data:
        ci = data["contact_info"]
        
        # Handle required Name
        if "name" not in ci or not ci["name"]:
            ci["name"] = "Unknown Candidate"
        # Handle optional URLs
        for field in ["linkedin", "github", "website"]:
            if field in ci:
                val = ci[field]
                if not val or val == "N/A" or val == "":
                    ci[field] = None
                elif isinstance(val, str):
                    # Basic URL cleanup
                    val = val.strip()
                    if not val.startswith("http"):
                        # If it looks like a domain, prepend https://
                        if "." in val and " " not in val:
                             ci[field] = f"https://{val}"
                        else:
                             # If it's just garbage text, set to None to avoid validation error
                             ci[field] = None
        
        # Handle required Email
        if "email" in ci and (not ci["email"] or ci["email"] == ""):
             ci["email"] = "missing@example.com" # Placeholder
             
    # Sanitize projects URLs
    if "projects" in data:
        for proj in data["projects"]:
            if "url" in proj:
                val = proj["url"]
                if not val or val == "N/A" or val == "":
                    proj["url"] = None
                elif isinstance(val, str):
                    val = val.strip()
                    if not val.startswith("http"):
                        if "." in val and " " not in val:
                             proj["url"] = f"https://{val}"
                        else:
                             proj["url"] = None
                
    # 3. Return as Resume model
    return Resume(**data)
