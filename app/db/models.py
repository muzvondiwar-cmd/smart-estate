from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    properties = relationship("Property", back_populates="owner")

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)

    # --- NEW FIELDS ---
    location = Column(String)  # <--- This was missing!
    city = Column(String, index=True)
    suburb = Column(String, index=True)

    bedrooms = Column(Integer)
    bathrooms = Column(Float)  # Changed from Integer to Float (allows 2.5 baths)
    land_size = Column(Integer)
    property_type = Column(String)

    listing_status = Column(String, default="For Sale") # <--- This was missing!
    electricity_status = Column(String) # <--- This was missing!
    created_at = Column(DateTime, default=datetime.utcnow) # <--- This was missing!

    # Risk Factors
    ownership_status = Column(String)
    water_source = Column(String)
    risk_score = Column(Integer, default=0)
    risk_notes = Column(Text)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="properties")

    images = relationship("PropertyImage", back_populates="property", cascade="all, delete-orphan")

class PropertyImage(Base):
    __tablename__ = "property_images"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"))
    image_url = Column(String)
    is_thumbnail = Column(Boolean, default=False)

    property = relationship("Property", back_populates="images")