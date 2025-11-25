import json
import os
from typing import Dict, Any

DB_FILE = "users_db.json"

def load_db() -> Dict[str, Any]:
    if not os.path.exists(DB_FILE):
        # Initialize with default admin user
        default_db = {
            "users": {
                "admin": {
                    "password": "password",
                    "resume": None  # Will store Resume JSON here
                }
            }
        }
        save_db(default_db)
        return default_db
    
    with open(DB_FILE, "r") as f:
        return json.load(f)

def save_db(data: Dict[str, Any]):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)

def get_user(username: str):
    db = load_db()
    return db["users"].get(username)

def update_user_resume(username: str, resume_data: Dict[str, Any]):
    db = load_db()
    if username in db["users"]:
        db["users"][username]["resume"] = resume_data
        save_db(db)
        return True
    return False
