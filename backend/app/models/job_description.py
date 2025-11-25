from typing import List, Optional
from pydantic import BaseModel

class JobDescription(BaseModel):
    raw_text: str
    title: Optional[str] = None
    company: Optional[str] = None
    url: Optional[str] = None

class Keyword(BaseModel):
    term: str
    importance: int  # 1-5 scale
    category: str  # e.g., "Technical", "Soft Skill", "Domain"

class JDAnalysis(BaseModel):
    role_type: Optional[str] = "Unknown"
    keywords: List[Keyword] = []
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    experience_level: Optional[str] = "Unknown"
    key_responsibilities: List[str] = []
