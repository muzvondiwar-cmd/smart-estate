from typing import List
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from app.db import database, models, schemas

# --- DEFINE ROUTER ---
router = APIRouter()

# --- 1. UPLOAD IMAGE ENDPOINT (This fixes the "Not Found" error) ---
@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Accepts an image upload.
    For this demo, we return a professional placeholder image URL
    so your property cards look perfect immediately.
    """
    # In a real app, you would save 'file' to AWS S3 or Cloudinary here.
    # For the demo, we return a working real estate image URL.
    return {"url": "https://images.unsplash.com/photo-1600596542815-2a4d9fdb88b8?auto=format&fit=crop&w=800&q=80"}

# --- 2. GET ALL PROPERTIES ---
@router.get("/", response_model=List[schemas.Property])
def read_properties(
        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(database.get_db)
):
    properties = db.query(models.Property).offset(skip).limit(limit).all()
    return properties

# --- 3. CREATE PROPERTY ---
@router.post("/", response_model=schemas.Property)
def create_property(property: schemas.PropertyCreate, db: Session = Depends(database.get_db)):
    # Convert Pydantic schema to SQLAlchemy model
    db_property = models.Property(**property.dict())
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    return db_property

# --- 4. GET ONE PROPERTY ---
@router.get("/{property_id}", response_model=schemas.Property)
def read_property(property_id: int, db: Session = Depends(database.get_db)):
    db_property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if db_property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return db_property