from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.db import database, models, schemas
from app.core import security # Assuming you have a security util for hashing

router = APIRouter()

@router.post("/signup", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # 1. CHECK IF USER EXISTS
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        # Return a clear 400 error if they exist
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. CREATE NEW USER
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user