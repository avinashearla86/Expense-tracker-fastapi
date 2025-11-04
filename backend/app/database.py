import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# ✅ Load environment variables from .env file (optional but helpful)
load_dotenv()

# ✅ 1. Get DATABASE_URL from environment, fallback to local SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./expenses.db")

# ✅ 2. Handle special SQLite connection arguments
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

# ✅ 3. Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ 4. Base class for models
Base = declarative_base()

# ✅ 5. Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
