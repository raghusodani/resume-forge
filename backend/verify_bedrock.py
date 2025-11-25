import asyncio
import os
from app.services.llm import llm_client
from app.core.config import settings

async def test_bedrock():
    print("Testing Bedrock Connection...")
    
    # Debug: Print loaded config (masked)
    print(f"Configured Provider: {settings.LLM_PROVIDER}")
    print(f"Configured Region: {settings.AWS_REGION}")
    key_id = settings.AWS_ACCESS_KEY_ID
    if key_id:
        print(f"AWS_ACCESS_KEY_ID: {key_id[:4]}...{key_id[-4:]}")
    else:
        print("AWS_ACCESS_KEY_ID: Not set in settings")
        
    # Check actual env vars seen by os
    env_key = os.environ.get("AWS_ACCESS_KEY_ID")
    if env_key:
         print(f"OS Env AWS_ACCESS_KEY_ID: {env_key[:4]}...{env_key[-4:]}")
    else:
         print("OS Env AWS_ACCESS_KEY_ID: Not set")

    if not llm_client.llm:
        print("❌ Bedrock client not initialized.")
        return

    prompt = "Generate a JSON object with a key 'message' and value 'Hello from Bedrock!'"
    try:
        result = await llm_client.generate_json(prompt)
        print("✅ Bedrock Response:", result)
    except Exception as e:
        print(f"❌ Bedrock Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_bedrock())
