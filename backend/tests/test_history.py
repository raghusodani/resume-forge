from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from app.db.session import Base, get_db
from app.api.deps import get_current_user
from app.models.sql_models import User, TailoredResume

# Setup in-memory SQLite DB for testing
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

def override_get_current_user():
    db = TestingSessionLocal()
    user = db.query(User).filter(User.username == "testuser").first()
    if not user:
        user = User(username="testuser", hashed_password="fakehash")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user

client = TestClient(app)

def test_save_and_get_history():
    # 1. Save History
    response = client.post(
        "/api/v1/history/",
        json={
            "job_description": "Software Engineer at Google",
            "content": {"skills": ["Python", "FastAPI"]}
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["job_description"] == "Software Engineer at Google"
    assert data["content"]["skills"] == ["Python", "FastAPI"]
    resume_id = data["id"]

    # 2. Get History List
    response = client.get("/api/v1/history/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["id"] == resume_id

    # 3. Get Specific Resume
    response = client.get(f"/api/v1/history/{resume_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == resume_id
    assert data["job_description"] == "Software Engineer at Google"
