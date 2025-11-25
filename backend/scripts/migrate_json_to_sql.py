import json
import sys
import os

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal, engine, Base
from app.models.sql_models import User, Resume

def migrate_data():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(User).count() > 0:
            print("Data already exists in DB. Skipping migration.")
            return

        json_path = "users_db.json"
        if not os.path.exists(json_path):
            print(f"{json_path} not found. Skipping migration.")
            return

        print(f"Reading from {json_path}...")
        with open(json_path, "r") as f:
            data = json.load(f)
            
        users_data = data.get("users", {})
        
        for username, user_info in users_data.items():
            print(f"Migrating user: {username}")
            
            # Create User
            db_user = User(
                username=username,
                hashed_password=user_info["password"]
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            
            # Create Resume if exists
            if "resume" in user_info and user_info["resume"]:
                db_resume = Resume(
                    user_id=db_user.id,
                    content=user_info["resume"]
                )
                db.add(db_resume)
                db.commit()
                
        print("Migration completed successfully!")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    migrate_data()
