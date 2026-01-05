from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import database, models, schemas
# from passlib.context import CryptContext  <-- COMMENT THIS OUT FOR NOW

router = APIRouter()

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") <-- COMMENT OUT

def get_password_hash(password):
    return password + "notreallyhashed" # <-- DUMMY HASH FOR TESTING

@router.post("/signup", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # 1. Check if email exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered. Please log in.")

    # 2. Hash the password (Simple version)
    hashed_password = get_password_hash(user.password)

    # 3. Create the user
    try:
        db_user = models.User(
            email=user.email,
            hashed_password=hashed_password,
            full_name=user.full_name,
            role="agent"
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        print(f"CRASH HERE: {e}") # This will show in logs if it fails
        raise HTTPException(status_code=500, detail=str(e))