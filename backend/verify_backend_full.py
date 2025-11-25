import requests
import json
import os

BASE_URL = "http://localhost:8000/api/v1"

def test_auth():
    print("Testing Auth...")
    # Test Login
    payload = {"username": "admin", "password": "password"}
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=payload)
        if response.status_code == 200:
            print("✅ Login successful")
            return response.json()["token"]
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return None

def test_users(token):
    print("\nTesting Users...")
    headers = {"x-token": token}
    
    # Get Resume
    response = requests.get(f"{BASE_URL}/users/me/resume", headers=headers)
    if response.status_code == 200:
        print("✅ Get Resume successful")
    else:
        print(f"❌ Get Resume failed: {response.status_code} - {response.text}")

def test_pdf_parsing(token):
    print("\nTesting PDF Parsing...")
    headers = {"x-token": token}
    
    # Create a dummy PDF if not exists
    if not os.path.exists("dummy_resume.pdf"):
        print("❌ dummy_resume.pdf not found. Please provide a sample PDF.")
        return

    files = {'file': open('dummy_resume.pdf', 'rb')}
    response = requests.post(f"{BASE_URL}/users/me/parse-pdf", headers=headers, files=files)
    
    if response.status_code == 200:
        print("✅ PDF Parsing successful")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"❌ PDF Parsing failed: {response.status_code} - {response.text}")

if __name__ == "__main__":
    token = test_auth()
    if token:
        test_users(token)
        test_pdf_parsing(token)
