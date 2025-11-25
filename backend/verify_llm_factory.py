from app.services.llm_factory import LLMFactory
from app.core.config import settings

def verify_factory():
    print(f"Current Provider: {settings.LLM_PROVIDER}")
    print(f"Bedrock Model: {settings.BEDROCK_MODEL}")
    
    try:
        llm = LLMFactory.create_llm()
        print(f"✅ LLM Created Successfully: {type(llm)}")
    except Exception as e:
        print(f"❌ LLM Creation Failed: {e}")

if __name__ == "__main__":
    verify_factory()
