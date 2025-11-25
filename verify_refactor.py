import requests
import json
import sys

BASE_URL = "http://localhost:8017/api/v1"

def test_refactor_flow():
    print("1. Testing Login...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin", "password": "password"})
        resp.raise_for_status()
        data = resp.json()
        token = data["token"]
        print(f"   Login Success. Token: {token}")
    except Exception as e:
        print(f"   Login Failed: {e}")
        return

    print("\n2. Testing Get Base Resume (Should be empty initially)...")
    headers = {"x-token": token}
    try:
        resp = requests.get(f"{BASE_URL}/users/me/resume", headers=headers)
        if resp.status_code == 404:
            print("   Success: No resume found as expected.")
        else:
            print(f"   Unexpected status: {resp.status_code}")
    except Exception as e:
        print(f"   Get Resume Failed: {e}")

    print("\n3. Testing Update Base Resume...")
    # Load sample resume
    with open("sample_resume.json", "r") as f:
        resume_data = json.load(f)
    
    try:
        resp = requests.post(f"{BASE_URL}/users/me/resume", json=resume_data, headers=headers)
        resp.raise_for_status()
        print("   Update Success.")
    except Exception as e:
        print(f"   Update Failed: {e}")
        return

    print("\n4. Testing Tailor with Stored Resume...")
    jd_data = {
        "raw_text": "Looking for a Python expert."
    }
    try:
        resp = requests.post(f"{BASE_URL}/users/me/tailor", json=jd_data, headers=headers)
        resp.raise_for_status()
        tailored = resp.json()
        print(f"   Tailoring Success: {tailored['contact_info']['name']}")
    except Exception as e:
        print(f"   Tailoring Failed: {e}")

if __name__ == "__main__":
    test_refactor_flow()
