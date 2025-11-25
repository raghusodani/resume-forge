from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, HttpUrl

class ContactInfo(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    linkedin: Optional[HttpUrl] = None
    github: Optional[HttpUrl] = None
    website: Optional[HttpUrl] = None
    location: Optional[str] = None

class EducationItem(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    gpa: Optional[str] = None
    description: Optional[str] = None

class ExperienceItem(BaseModel):
    company: str
    position: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    current: bool = False
    description: List[str] = []
    technologies: List[str] = []

class ProjectItem(BaseModel):
    name: str
    description: str
    url: Optional[HttpUrl] = None
    technologies: List[str] = []

class SkillCategory(BaseModel):
    category: str
    skills: List[str] = []

class Resume(BaseModel):
    """
    Represents a structured resume.
    """
    contact_info: ContactInfo
    summary: Optional[str] = None
    education: List[EducationItem] = []
    experience: List[ExperienceItem] = []
    projects: List[ProjectItem] = []
    skills: List[SkillCategory] = []
    certifications: List[str] = []
    languages: List[str] = []
