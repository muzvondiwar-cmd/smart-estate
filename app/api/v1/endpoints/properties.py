from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db import database, models, schemas

# --- DEFINE ROUTER FIRST ---
router = APIRouter()

# --- 1. GET ALL PROPERTIES (The Fix for your Homepage) ---
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

# --- 2. CREATE A PROPERTY ---
@router.post("/", response_model=schemas.Property)
def create_property(property: schemas.PropertyCreate, db: Session = Depends(database.get_db)):
    """
    Create a new property listing.
    """
    # Convert Pydantic schema to SQLAlchemy model
    db_property = models.Property(**property.dict())
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    return db_property

# --- 3. GET ONE PROPERTY (By ID) ---
@router.get("/{property_id}", response_model=schemas.Property)
def read_property(property_id: int, db: Session = Depends(database.get_db)):
    """
    Get a specific property by its ID.
    """
    db_property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if db_property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return db_property