from pydantic import BaseModel
from typing import List, Optional

# --- 1. USER SCHEMAS ---
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: str = "agent"  # Default role
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

class Property(PropertyBase):
    id: int
    owner_id: Optional[int] = None
    images: List[PropertyImage] = []
    risk_score: int = 0
    class Config:
        from_attributes = True

# --- 3. EXTRAS ---
class ContactRequest(BaseModel):
    name: str
    email: str
    phone: str
    message: str