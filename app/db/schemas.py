from pydantic import BaseModel
from typing import List, Optional

# --- SHARED PROPERTIES ---
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

# --- RESPONSE SCHEMA ---
class Property(PropertyBase):
    id: int
    owner_id: Optional[int] = None
    images: List[PropertyImage] = []

    # ✅ INCLUDE RISK SCORE IN RESPONSE
    risk_score: int = 0

    class Config:
        from_attributes = True