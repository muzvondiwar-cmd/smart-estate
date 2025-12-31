from typing import List
import random # <--- Import this for the AI simulation
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from app.db import database, models, schemas

router = APIRouter()

# --- 1. UPLOAD IMAGE ---
@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    # Returns a random high-quality house image for the demo
    random_id = random.randint(1, 1000)
    return {"url": f"https://images.unsplash.com/photo-1600596542815-2a4d9fdb88b8?auto=format&fit=crop&w=800&q=80&sig={random_id}"}

# --- 2. GET ALL PROPERTIES ---
@router.get("/", response_model=List[schemas.Property])
def read_properties(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    properties = db.query(models.Property).offset(skip).limit(limit).all()
    return properties

# --- 3. CREATE PROPERTY (WITH AI SCORING) ---
@router.post("/", response_model=schemas.Property)
def create_property(property: schemas.PropertyCreate, db: Session = Depends(database.get_db)):

    # 🤖 AI LOGIC: Calculate Risk Score
    # In a real app, this would check title deeds.
    # For the demo, we generate a realistic score between 10 (Safe) and 80 (Risky)
    ai_risk_score = random.randint(5, 35) # Mostly safe for demo purposes

    # Create the Property Model
    db_property = models.Property(
        **property.dict(exclude={"images"}), # Exclude images for now
        risk_score=ai_risk_score # <--- Save the score!
    )

    db.add(db_property)
    db.commit()
    db.refresh(db_property)

    # Handle Images
    if property.images:
        for img in property.images:
            db_image = models.PropertyImage(property_id=db_property.id, image_url=img['image_url'])
            db.add(db_image)
        db.commit()

    return db_property

# --- 4. GET ONE PROPERTY ---
@router.get("/{property_id}", response_model=schemas.Property)
def read_property(property_id: int, db: Session = Depends(database.get_db)):
    db_property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if db_property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return db_property