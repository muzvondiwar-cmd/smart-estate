from app.db.database import SessionLocal, engine
from app.db import models
from app.core.security import get_password_hash
from datetime import datetime

def seed():
    # 1. FORCE RESET THE DATABASE
    # This deletes the tables entirely so they can be rebuilt with new columns
    print("🔥 Dropping old database tables...")
    models.Base.metadata.drop_all(bind=engine)

    print("🏗️ Creating new database tables...")
    models.Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # 2. Create a Test User
    print("👤 Creating test user...")
    test_user = models.User(
        email="test@test.com",
        hashed_password=get_password_hash("password123")
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)

    # 3. Add Properties (Now valid because tables are brand new)
    print("🏠 Seeding properties...")
    properties = [
        models.Property(
            title="Modern 5-Bed Mansion in Borrowdale",
            description="Luxury living at its finest. Double storey, swimming pool, borehole.",
            price=450000.0,
            location="Borrowdale Brooke",
            city="Harare",
            suburb="Borrowdale",
            bedrooms=5,
            bathrooms=4.5,
            land_size=2000,
            property_type="House",
            listing_status="For Sale",
            ownership_status="title_deed",
            water_source="borehole",
            electricity_status="good",
            owner_id=test_user.id,
            created_at=datetime.now(),
            risk_score=10,
            risk_notes="Low risk. Title Deeds available."
        ),
        models.Property(
            title="2 Bed Garden Flat",
            description="Secure complex, close to shopping center. Sectional title.",
            price=85000.0,
            location="Avondale West",
            city="Harare",
            suburb="Avondale",
            bedrooms=2,
            bathrooms=1.0,
            land_size=300,
            property_type="Apartment",
            listing_status="For Sale",
            ownership_status="sectional_title",
            water_source="municipal",
            electricity_status="intermittent",
            owner_id=test_user.id,
            created_at=datetime.now(),
            risk_score=15,
            risk_notes="Municipal water unreliable."
        ),
        # You can add more listings here if you want
    ]

    for prop in properties:
        db.add(prop)

    db.commit()
    print("✅ Database successfully reset and seeded!")
    db.close()

if __name__ == "__main__":
    seed()