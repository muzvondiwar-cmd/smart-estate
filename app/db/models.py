from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    role = Column(String, default="user")

class Property(Base):
    __tablename__ = "properties"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    location = Column(String)
    city = Column(String)
    suburb = Column(String)
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    land_size = Column(Integer)
    listing_status = Column(String)
    property_type = Column(String)

    # ✅ AI FIELDS
    risk_score = Column(Integer, default=0) # We added this!

    owner_id = Column(Integer, ForeignKey("users.id"))
    images = relationship("PropertyImage", back_populates="property")

class PropertyImage(Base):
    __tablename__ = "property_images"
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"))
    image_url = Column(String)

    property = relationship("Property", back_populates="images")