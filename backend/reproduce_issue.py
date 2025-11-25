import requests
import json
import os

BASE_URL = "http://localhost:8000/api/v1"

def reproduce_issue():
    print("Reproducing PDF Parsing Issue...")
    
    # Login first
    login_payload = {"username": "admin", "password": "password"}
    login_response = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    if login_response.status_code != 200:
        print("❌ Login failed")
        return
    
    token = login_response.json()["token"]
    headers = {"x-token": token}
    
    pdf_path = "Raghu_Raj_Sodani_Final.pdf"
    if not os.path.exists(pdf_path):
        print(f"❌ {pdf_path} not found")
        return

    files = {'file': open(pdf_path, 'rb')}
    try:
        response = requests.post(f"{BASE_URL}/users/me/parse-pdf", headers=headers, files=files)
        
        if response.status_code == 200:
            print("✅ PDF Parsing successful (Unexpected)")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"❌ PDF Parsing failed as expected: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    reproduce_issue()
