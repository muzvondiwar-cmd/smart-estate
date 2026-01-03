from pydantic import BaseModel
from typing import List, Optional

# --- 1. USER SCHEMAS (This was missing!) ---
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: str = "user"

    class Config:
        from_attributes = True

# --- 2. PROPERTY SCHEMAS ---
class PropertyBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    location: str
    city: str
    suburb: str
    bedrooms: int
    bathrooms: int
    land_size: int
    listing_status: str
    property_type: str

class PropertyCreate(PropertyBase):
    images: Optional[List[dict]] = []

class PropertyImage(BaseModel):
    id: int
    image_url: str
    class Config:
        from_attributes = True

# --- 3. RESPONSE SCHEMA ---
class Property(PropertyBase):
    id: int
    owner_id: Optional[int] = None
    images: List[PropertyImage] = []

    # AI FIELDS
    risk_score: int = 0

    class Config:
        from_attributes = True

# --- 4. CONTACT SCHEMA ---
class ContactRequest(BaseModel):
    name: str
    email: str
    phone: str
    message: str