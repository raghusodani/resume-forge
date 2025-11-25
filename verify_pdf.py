import requests
import json

BASE_URL = "http://localhost:8021/api/v1"

def test_pdf_parsing():
    print("1. Logging in...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin", "password": "password"})
        resp.raise_for_status()
        token = resp.json()["token"]
        print("   Login Success.")
    except Exception as e:
        print(f"   Login Failed: {e}")
        return

    print("\n2. Uploading PDF for Parsing...")
    try:
        files = {'file': ('dummy_resume.pdf', open('dummy_resume.pdf', 'rb'), 'application/pdf')}
        headers = {'x-token': token}
        
        resp = requests.post(f"{BASE_URL}/users/me/parse-pdf", files=files, headers=headers)
        
        if resp.status_code == 200:
            data = resp.json()
            print(f"   Parsing Success!")
            print(f"   Name: {data.get('contact_info', {}).get('name')}")
            print(f"   Summary: {data.get('summary')}")
        else:
            print(f"   Parsing Failed: {resp.status_code} - {resp.text}")
            
    except Exception as e:
        print(f"   Error: {e}")

if __name__ == "__main__":
    test_pdf_parsing()
