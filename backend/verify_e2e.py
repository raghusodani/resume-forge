import asyncio
import httpx
import json
import os

BASE_URL = "http://localhost:8000/api/v1"
USERNAME = "admin"
PDF_PATH = "Raghu_Raj_Sodani_Final.pdf"

SAMPLE_JD = {
    "title": "Senior Software Engineer",
    "company": "TechCorp",
    "raw_text": """
    We are looking for a Senior Software Engineer to join our team.
    Requirements:
    - 5+ years of experience in Python and FastAPI.
    - Experience with AWS services (Bedrock, Lambda).
    - Strong understanding of LLMs and LangChain.
    - Ability to write clean, maintainable code.
    - Experience with React and TypeScript is a plus.
    """
}

async def run_e2e_test():
    print("🚀 Starting End-to-End Integration Test...")
    
    headers = {"x-token": USERNAME}
    
    async with httpx.AsyncClient(timeout=300.0) as client:
        # 1. Parse PDF
        print(f"\n📄 Parsing PDF: {PDF_PATH}...")
        if not os.path.exists(PDF_PATH):
            print(f"❌ PDF file not found: {PDF_PATH}")
            return

        with open(PDF_PATH, "rb") as f:
            files = {"file": (PDF_PATH, f, "application/pdf")}
            response = await client.post(f"{BASE_URL}/users/me/parse-pdf", headers=headers, files=files)
        
        if response.status_code != 200:
            print(f"❌ Parsing failed: {response.text}")
            return
        
        parsed_resume = response.json()
        print("✅ PDF Parsed Successfully!")
        # print(json.dumps(parsed_resume, indent=2))
        
        # 2. Update User Resume (Save Base Resume)
        print("\n💾 Saving Base Resume...")
        response = await client.post(f"{BASE_URL}/users/me/resume", headers=headers, json=parsed_resume)
        if response.status_code != 200:
            print(f"❌ Saving resume failed: {response.text}")
            return
        print("✅ Base Resume Saved!")
        
        # 3. Tailor Resume
        print("\n✨ Tailoring Resume with Bedrock...")
        response = await client.post(f"{BASE_URL}/users/me/tailor", headers=headers, json=SAMPLE_JD)
        if response.status_code != 200:
            print(f"❌ Tailoring failed: {response.text}")
            return
            
        tailored_resume = response.json()
        print("✅ Resume Tailored Successfully!")
        # print(json.dumps(tailored_resume, indent=2))
        
        # 4. Generate PDF
        print("\n🖨️ Generating Tailored PDF...")
        response = await client.post(f"{BASE_URL}/generate-pdf", json=tailored_resume)
        if response.status_code != 200:
            print(f"❌ PDF Generation failed: {response.text}")
            return
            
        output_pdf = "Tailored_Resume.pdf"
        with open(output_pdf, "wb") as f:
            f.write(response.content)
            
        print(f"✅ Tailored PDF Generated: {output_pdf}")
        print("\n🎉 End-to-End Test Completed Successfully!")

if __name__ == "__main__":
    asyncio.run(run_e2e_test())
