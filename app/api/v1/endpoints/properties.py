from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db import database, models, schemas

# (Keep your existing imports)

# router is likely already defined at the top
# router = APIRouter()

# --- ✅ NEW ENDPOINT: GET ALL PROPERTIES ---
@router.get("/", response_model=List[schemas.Property])
def read_properties(
        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(database.get_db)
):
    """
    Retrieve all properties.
    """
    properties = db.query(models.Property).offset(skip).limit(limit).all()
    return properties