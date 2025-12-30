from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- SHARED PROPERTIES ---
class PropertyBase(BaseModel):
    title: str
    description: str
    price: float
    location: str
    city: str
    suburb: str
    bedrooms: int

    # 1. CHANGE THIS: int -> float (to handle 2.5 baths)
    bathrooms: float

    land_size: int
    property_type: str
    listing_status: str
    ownership_status: str
    water_source: str
    electricity_status: str

# --- CREATE REQUEST ---
class PropertyCreate(PropertyBase):
    pass

# --- IMAGE RESPONSE ---
class ImageResponse(BaseModel):
    id: int
    image_url: str
    is_thumbnail: bool
    class Config:
        from_attributes = True

# --- API RESPONSE (READ) ---
class PropertyResponse(PropertyBase):
    id: int
    owner_id: int

    # 2. Make creation time optional (just in case old data misses it)
    created_at: Optional[datetime] = None

    risk_score: int
    risk_notes: Optional[str] = None
    images: List[ImageResponse] = []
    owner_email: Optional[str] = None

    class Config:
        from_attributes = True