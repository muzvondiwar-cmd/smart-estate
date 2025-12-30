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

# --- CREATION SCHEMA (What we send to API) ---
class PropertyCreate(PropertyBase):
    pass

# --- RESPONSE SCHEMA (What API sends back) ---
class Property(PropertyBase):
    id: int
    owner_id: Optional[int] = None  # Make optional for now to prevent errors

    class Config:
        from_attributes = True  # Required for Pydantic V2 to read SQLAlchemy models