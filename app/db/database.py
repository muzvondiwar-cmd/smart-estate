from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# --- FORCE SQLITE DATABASE ---
# We are hardcoding this to ensure it works on Render without complex setup.
SQLALCHEMY_DATABASE_URL = "sqlite:///./smart_estate.db"

# Create the database engine
# connect_args={"check_same_thread": False} is REQUIRED for SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Create the SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the Base class
Base = declarative_base()

# Dependency function to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()