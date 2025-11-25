from typing import Optional, Literal
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Application settings managed by Pydantic.
    Reads from environment variables and .env file.
    """
    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True, extra="ignore")

    # App Settings
    APP_NAME: str = "Resume Tailor"
    API_V1_STR: str = "/api/v1"
    
    # LLM Configuration
    # Options: "gemini", "openai", "bedrock"
    LLM_PROVIDER: Literal["gemini", "openai", "bedrock"] = "bedrock"
    
    # Provider-specific settings
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    # AWS Settings (automatically picked up by boto3, but defined here for clarity)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    
    # Model Names (can be overridden)
    GEMINI_MODEL: str = "gemini-2.0-flash"
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    BEDROCK_MODEL: str = "anthropic.claude-3-sonnet-20240229-v1:0"

settings = Settings()
