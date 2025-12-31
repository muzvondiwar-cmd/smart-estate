from typing import List
import random # <--- Import this for the AI simulation
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from app.db import database, models, schemas
from pydantic import BaseModel

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

# --- 5. GENERATE FULL AI REPORT ---
@router.get("/{property_id}/report")
def generate_report(property_id: int, db: Session = Depends(database.get_db)):
    """
    Generates a detailed AI Due Diligence Report.
    """
    db_property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if db_property is None:
        raise HTTPException(status_code=404, detail="Property not found")

    # 🤖 SIMULATE DEEP ANALYSIS DATA
    # In a real app, this would query the Deeds Office API.
    return {
        "property_id": db_property.id,
        "generated_at": "2025-01-01",
        "risk_score": db_property.risk_score,
        "valuation": {
            "estimated_value": db_property.price * 0.95,
            "market_trend": "Rising (+5% this year)",
            "price_per_sqm": db_property.price / db_property.land_size if db_property.land_size else 0
        },
        "legal_checks": [
            {"check": "Title Deed Authenticity", "status": "PASSED", "details": "Deed #4529 matches central registry."},
            {"check": "Encumbrances / Liens", "status": "PASSED", "details": "No outstanding bank loans found."},
            {"check": "Seller Identity", "status": "PASSED", "details": "Biometric ID match confirmed."},
            {"check": "Zoning Regulations", "status": "WARNING", "details": "Property is near a wetland buffer zone."}
        ],
        "history": [
            {"date": "2023-05-12", "event": "Property Listed for Sale"},
            {"date": "2018-11-04", "event": "Ownership Transfer (Sold)"},
            {"date": "2010-02-20", "event": "Initial Registration"}
        ]
    }

# --- SIMPLE SCHEMA FOR MESSAGES ---
class ContactRequest(BaseModel):
    name: str
    email: str
    phone: str
    message: str

# --- 6. CONTACT SELLER ENDPOINT ---
@router.post("/{property_id}/contact")
def contact_seller(property_id: int, contact: ContactRequest, db: Session = Depends(database.get_db)):
    """
    Simulates sending an inquiry email to the property owner.
    """
    # Check if property exists
    db_property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if not db_property:
        raise HTTPException(status_code=404, detail="Property not found")

    # In a real app, we would trigger an email service like SendGrid here.
    # For now, we just acknowledge receipt.
    print(f"📩 NEW LEAD for Property {property_id}: {contact.name} ({contact.email}) says: {contact.message}")

    return {"status": "success", "message": "Inquiry sent successfully! The agent will contact you shortly."}