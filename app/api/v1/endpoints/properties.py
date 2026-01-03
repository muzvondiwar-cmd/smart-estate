from typing import List, Optional
import random
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Query
from sqlalchemy.orm import Session
from app.db import database, models, schemas

router = APIRouter()

# --- 1. UPLOAD IMAGE (Returns a working absolute URL) ---
@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    # Returns a random high-quality house image for the demo
    # ensuring the URL is absolute (starts with http) to avoid broken images
    random_id = random.randint(1, 1000)
    return {"url": f"https://images.unsplash.com/photo-1600596542815-2a4d9fdb88b8?auto=format&fit=crop&w=800&q=80&sig={random_id}"}

# --- 2. GET PROPERTIES (With "My Listings" Filter) ---
@router.get("/", response_model=List[schemas.Property])
def read_properties(
        skip: int = 0,
        limit: int = 100,
        owner_id: Optional[int] = None, # <--- NEW FILTER PARAMETER
        db: Session = Depends(database.get_db)
):
    query = db.query(models.Property)

    # If owner_id is passed (e.g., from Dashboard), only show their properties
    if owner_id:
        query = query.filter(models.Property.owner_id == owner_id)

    properties = query.offset(skip).limit(limit).all()
    return properties

# --- 3. CREATE PROPERTY (Assign to User 1) ---
@router.post("/", response_model=schemas.Property)
def create_property(property: schemas.PropertyCreate, db: Session = Depends(database.get_db)):

    # Generate random Risk Score
    ai_risk_score = random.randint(5, 35)

    # Create Property with owner_id = 1 (Simulating "You")
    db_property = models.Property(
        **property.dict(exclude={"images"}),
        risk_score=ai_risk_score,
        owner_id=1  # <--- ASSIGN TO SELLER (YOU)
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

# --- 5. CONTACT ENDPOINT ---
class ContactRequest(schemas.BaseModel):
    name: str
    email: str
    phone: str
    message: str

@router.post("/{property_id}/contact")
def contact_seller(property_id: int, contact: ContactRequest, db: Session = Depends(database.get_db)):
    return {"status": "success", "message": "Inquiry sent!"}

# --- 6. REPORT ENDPOINT ---
@router.get("/{property_id}/report")
def generate_report(property_id: int, db: Session = Depends(database.get_db)):
    db_property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if db_property is None:
        raise HTTPException(status_code=404, detail="Property not found")

    return {
        "property_id": db_property.id,
        "risk_score": db_property.risk_score,
        "valuation": {"estimated_value": db_property.price * 0.95, "market_trend": "Rising"},
        "legal_checks": [
            {"check": "Title Deed", "status": "PASSED", "details": "Verified."},
            {"check": "Encumbrances", "status": "PASSED", "details": "Clean."}
        ]
    }