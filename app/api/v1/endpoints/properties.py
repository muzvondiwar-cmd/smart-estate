from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
import shutil
import uuid
import re
import os

from app.db import models
from app.db.database import get_db
from app.schemas import property as schemas
from app.core.ai_search import interpret_search_query
from app.api import deps

router = APIRouter()

# --- SEARCH ROUTE ---
@router.post("/search", response_model=List[schemas.PropertyResponse])
def search_properties(query: Optional[str] = None, db: Session = Depends(get_db)):
    # Debugging: Print audit of who owns what
    all_properties = db.query(models.Property).all()
    print("\n--------- 🕵️ DATABASE AUDIT REPORT ---------")
    for prop in all_properties:
        print(f"🏠 ID: {prop.id} | Title: {prop.title[:15]}... | Owner ID: {prop.owner_id}")
    print("--------------------------------------------\n")

    sql_query = db.query(models.Property)

    if not query:
        return sql_query.all()

    print(f"🔍 Processing Query: '{query}'")
    ai_filters = interpret_search_query(query)
    active_filters = {k: v for k, v in ai_filters.items() if v is not None}

    if len(active_filters) > 0:
        print(f"🤖 AI Success. Filters: {active_filters}")
        if active_filters.get("min_price"):
            sql_query = sql_query.filter(models.Property.price >= active_filters["min_price"])
        if active_filters.get("max_price"):
            sql_query = sql_query.filter(models.Property.price <= active_filters["max_price"])
        if active_filters.get("bedrooms"):
            sql_query = sql_query.filter(models.Property.bedrooms >= active_filters["bedrooms"])
        if active_filters.get("suburb"):
            sql_query = sql_query.filter(models.Property.suburb.ilike(f"%{active_filters['suburb']}%"))
        if active_filters.get("city"):
            sql_query = sql_query.filter(models.Property.city.ilike(f"%{active_filters['city']}%"))
        if active_filters.get("property_type"):
            sql_query = sql_query.filter(models.Property.property_type.ilike(f"%{active_filters['property_type']}%"))
        return sql_query.all()

    print("⚠️ AI failed or returned nothing. Switching to Manual Fallback.")

    numbers = re.findall(r'\b(\d+)\b', query)
    if numbers:
        min_beds = int(numbers[0])
        sql_query = sql_query.filter(models.Property.bedrooms >= min_beds)

    search_terms = query.split()
    for term in search_terms:
        if term.lower() in ['in', 'at', 'with', 'for', 'house', 'home', 'sale', 'rent', 'bedroom', 'bedrooms']:
            continue
        term_clean = f"%{term}%"
        sql_query = sql_query.filter(
            or_(
                models.Property.title.ilike(term_clean),
                models.Property.description.ilike(term_clean),
                models.Property.suburb.ilike(term_clean),
                models.Property.city.ilike(term_clean)
            )
        )

    return sql_query.all()

# --- GET SINGLE PROPERTY ---
@router.get("/{id}", response_model=schemas.PropertyResponse)
def get_property(id: int, db: Session = Depends(get_db)):
    prop = db.query(models.Property).filter(models.Property.id == id).first()

    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")

    response_data = schemas.PropertyResponse.model_validate(prop)
    if prop.owner:
        response_data.owner_email = prop.owner.email

    return response_data

# --- CREATE PROPERTY ---
@router.post("/", response_model=schemas.PropertyResponse)
def create_property(
        item: schemas.PropertyCreate,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(deps.get_current_user)
):
    print(f"📝 Creating Property for User: {current_user.email} (ID: {current_user.id})")

    risk_score = 0
    risk_notes = []

    if item.ownership_status == "cession_developer":
        risk_score += 40
        risk_notes.append("Developer Cession carries higher risk than Title Deeds.")
    elif item.ownership_status == "cession_council":
        risk_score += 20
        risk_notes.append("Council Cession requires verification.")
    if item.water_source == "municipal":
        risk_score += 15
        risk_notes.append("Municipal water supply may be inconsistent.")

    db_item = models.Property(
        **item.model_dump(),
        owner_id=current_user.id,
        risk_score=risk_score,
        risk_notes=" | ".join(risk_notes)
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    print(f"✅ Property Created! ID: {db_item.id}, Owner ID: {db_item.owner_id}")
    return db_item

# --- SELLER DASHBOARD ---
@router.get("/mine/listings", response_model=List[schemas.PropertyResponse])
def get_my_properties(
        db: Session = Depends(get_db),
        current_user: models.User = Depends(deps.get_current_user)
):
    print(f"🕵️ DEBUG: User {current_user.email} (ID: {current_user.id}) asking for dashboard.")
    properties = db.query(models.Property).filter(models.Property.owner_id == current_user.id).all()
    print(f"✅ DEBUG: Found {len(properties)} properties for this user.")
    return properties

# --- UPLOAD IMAGES ---
@router.post("/{id}/images", response_model=schemas.ImageResponse)
def upload_property_image(
        id: int,
        file: UploadFile = File(...),
        db: Session = Depends(get_db),
        current_user: models.User = Depends(deps.get_current_user)
):
    property = db.query(models.Property).filter(models.Property.id == id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")

    if property.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this property")

    if not os.path.exists("uploads"):
        os.makedirs("uploads")

    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"uploads/{unique_filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db_image = models.PropertyImage(
        property_id=id,
        image_url=f"http://localhost:8000/uploads/{unique_filename}",
        is_thumbnail=False
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)

    return db_image

# --- NEW: UPDATE PROPERTY (For Editing) ---
@router.put("/{id}", response_model=schemas.PropertyResponse)
def update_property(
        id: int,
        item: schemas.PropertyCreate,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(deps.get_current_user)
):
    # 1. Find the property
    property = db.query(models.Property).filter(models.Property.id == id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")

    # 2. Security Check: Are you the owner?
    if property.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to edit this property")

    # 3. Update the fields
    for key, value in item.model_dump().items():
        setattr(property, key, value)

    db.commit()
    db.refresh(property)
    return property


# --- NEW: DELETE PROPERTY ---
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_property(
        id: int,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(deps.get_current_user)
):
    # 1. Find the property
    property = db.query(models.Property).filter(models.Property.id == id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")

    # 2. Security Check: Are you the owner?
    if property.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to delete this property")

    # 3. Delete it
    db.delete(property)
    db.commit()

    return None