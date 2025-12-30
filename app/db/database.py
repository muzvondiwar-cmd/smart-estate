from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# --- FORCE SQLITE DATABASE ---
# We are hardcoding this so the server HAS to use the file.
SQLALCHEMY_DATABASE_URL = "sqlite:///./smart_estate.db"

# connect_args={"check_same_thread": False} is REQUIRED for SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()