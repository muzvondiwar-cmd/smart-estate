from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

# --- 1. USER MODEL (Updated with new fields) ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True) # <--- ADDED
    role = Column(String, default="agent")    # <--- ADDED

    # Relationship to properties
    properties = relationship("Property", back_populates="owner")

# --- 2. PROPERTY MODEL ---
class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float)
    location = Column(String)
    city = Column(String)
    suburb = Column(String)
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    land_size = Column(Integer)
    listing_status = Column(String)
    property_type = Column(String)

    # AI Risk Score
    risk_score = Column(Integer, default=0)

    # Owner Link
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", back_populates="properties")

    # Images
    images = relationship("PropertyImage", back_populates="property", cascade="all, delete-orphan")

# --- 3. IMAGE MODEL ---
class PropertyImage(Base):
    __tablename__ = "property_images"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"))
    image_url = Column(String)

    property = relationship("Property", back_populates="images")