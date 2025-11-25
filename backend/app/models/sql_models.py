from sqlalchemy import Boolean, Column, Integer, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # Relationship
    resume = relationship("Resume", back_populates="owner", uselist=False)
    tailored_resumes = relationship("TailoredResume", back_populates="owner")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    content = Column(JSON)  # Store the entire resume JSON structure here
    
    # Relationship
    owner = relationship("User", back_populates="resume")

class TailoredResume(Base):
    __tablename__ = "tailored_resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    job_description = Column(String) # Store the JD used for tailoring
    content = Column(JSON) # Store the tailored resume JSON
    created_at = Column(String) # Simple string timestamp for now, or use DateTime
    
    # Relationship
    owner = relationship("User", back_populates="tailored_resumes")
