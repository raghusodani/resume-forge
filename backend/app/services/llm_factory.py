from langchain_core.language_models.chat_models import BaseChatModel
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class LLMFactory:
    """
    Factory class to create LLM instances based on configuration.
    Supports: Gemini, OpenAI, Bedrock.
    """
    
    @staticmethod
    def create_llm() -> BaseChatModel:
        provider = settings.LLM_PROVIDER.lower()
        
        try:
            if provider == "gemini":
                from langchain_google_genai import ChatGoogleGenerativeAI
                if not settings.GEMINI_API_KEY:
                    raise ValueError("GEMINI_API_KEY is missing")
                
                return ChatGoogleGenerativeAI(
                    model=settings.GEMINI_MODEL,
                    google_api_key=settings.GEMINI_API_KEY,
                    temperature=0.0,
                    convert_system_message_to_human=True
                )
                
            elif provider == "openai":
                from langchain_openai import ChatOpenAI
                if not settings.OPENAI_API_KEY:
                    raise ValueError("OPENAI_API_KEY is missing")
                
                return ChatOpenAI(
                    model=settings.OPENAI_MODEL,
                    api_key=settings.OPENAI_API_KEY,
                    temperature=0.0
                )
                
            elif provider == "bedrock":
                from langchain_aws import ChatBedrock
                import os
                
                # ChatBedrock relies on boto3, which checks env vars.
                # We explicitly set them here from our settings if they aren't already set.
                if settings.AWS_ACCESS_KEY_ID:
                    os.environ["AWS_ACCESS_KEY_ID"] = settings.AWS_ACCESS_KEY_ID
                if settings.AWS_SECRET_ACCESS_KEY:
                    os.environ["AWS_SECRET_ACCESS_KEY"] = settings.AWS_SECRET_ACCESS_KEY
                if settings.AWS_REGION:
                    os.environ["AWS_DEFAULT_REGION"] = settings.AWS_REGION
                    
                return ChatBedrock(
                    model_id=settings.BEDROCK_MODEL,
                    model_kwargs={"temperature": 0.0},
                    region_name=settings.AWS_REGION
                )
                
            else:
                raise ValueError(f"Unsupported LLM provider: {provider}")
                
        except Exception as e:
            logger.error(f"Failed to initialize LLM provider '{provider}': {e}")
            raise e
