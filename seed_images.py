# seed_images.py
from app.db.database import SessionLocal
from app.db import models

def seed_images():
    db = SessionLocal()

    print("🧹 Clearing old images...")
    db.query(models.PropertyImage).delete()
    db.commit()

    print("📸 Assigning realistic photos...")

    # A map of Property ID -> List of Image URLs
    # We use reliable Unsplash IDs to ensure they always load and look good.
    image_map = {
        # 1. Borrowdale Mansion (Luxury)
        1: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop", # Exterior
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop", # Garden
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1600&auto=format&fit=crop"  # Living Room
        ],
        # 2. Avondale Flat (Garden Flat)
        2: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop", # Apartment Block
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop"  # Interior
        ],
        # 3. Mt Pleasant Family Home (Older, large garden)
        3: [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop", # Brick House
            "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=1600&auto=format&fit=crop"  # Garden
        ],
        # 4. Madokero New Build (Modern, compact)
        4: [
            "https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=1600&auto=format&fit=crop", # Modern small house
            "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1600&auto=format&fit=crop"  # Kitchen
        ],
        # 5. Waterfalls Starter Home
        5: [
            "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=1600&auto=format&fit=crop"  # Simple house
        ],
        # 6. Stoneridge Unfinished (Construction)
        6: [
            "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600&auto=format&fit=crop"  # Construction site
        ],
        # 7. Carrick Creagh Land (Vacant, Views)
        7: [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop"  # Nature/Land
        ],
        # 8. Domboshava Plot (Rural/Nature)
        8: [
            "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1600&auto=format&fit=crop"  # Fields/Rural
        ]
    }

    count = 0
    for prop_id, urls in image_map.items():
        # Check if property exists first (in case IDs shifted)
        prop = db.query(models.Property).filter(models.Property.id == prop_id).first()
        if prop:
            for url in urls:
                img = models.PropertyImage(
                    property_id=prop.id,
                    image_url=url,
                    is_thumbnail=(urls.index(url) == 0) # First image is thumbnail
                )
                db.add(img)
                count += 1

    db.commit()
    print(f"✅ Successfully added {count} images to the database!")
    db.close()

if __name__ == "__main__":
    seed_images()