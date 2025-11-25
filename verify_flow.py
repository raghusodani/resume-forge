import requests
import json
import sys

BASE_URL = "http://localhost:8003/api/v1"

def test_flow():
    # Load sample resume
    with open("sample_resume.json", "r") as f:
        resume_data = json.load(f)
        
    jd_data = {
        "raw_text": "We are looking for a Senior Software Engineer with Python and AWS experience. Leadership skills are a plus."
    }
    
    print("1. Testing JD Analysis...")
    try:
        resp = requests.post(f"{BASE_URL}/analyze-jd", json=jd_data)
        resp.raise_for_status()
        analysis = resp.json()
        print("   Analysis Success:", analysis.keys())
    except Exception as e:
        print(f"   Analysis Failed: {e}")
        return

    print("\n2. Testing Resume Tailoring...")
    try:
        resp = requests.post(f"{BASE_URL}/tailor-resume", json={"resume": resume_data, "jd_analysis": analysis})
        resp.raise_for_status()
        tailored_resume = resp.json()
        print("   Tailoring Success:", tailored_resume["contact_info"]["name"])
    except Exception as e:
        print(f"   Tailoring Failed: {e}")
        return

    print("\n3. Testing PDF Generation...")
    try:
        resp = requests.post(f"{BASE_URL}/generate-pdf", json=tailored_resume)
        resp.raise_for_status()
        with open("output.pdf", "wb") as f:
            f.write(resp.content)
        print("   PDF Generation Success: output.pdf created")
    except Exception as e:
        print(f"   PDF Generation Failed: {e}")
        return

if __name__ == "__main__":
    test_flow()
