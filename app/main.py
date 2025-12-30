from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Import your routes and database models
from app.api.v1.api import api_router
from app.db.database import engine
from app.db import models

# 1. Initialize the Database Tables
models.Base.metadata.create_all(bind=engine)

# 2. Create the App
app = FastAPI(title="SmartEstate AI API")

# 3. CORS SETTINGS (Crucial for Deployment)
# We are allowing ["*"] so your Frontend (Vercel) can talk to this Backend (Render) without blocking.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # <--- ALLOWS ALL CONNECTIONS
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. IMAGE HANDLING
# Check if "uploads" folder exists, if not, create it.
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# Mount the folder so images can be accessed via URL (e.g., http://.../uploads/image.jpg)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# 5. CONNECT ROUTES
# This connects all your logic (Auth, Properties, Search) to the app.
app.include_router(api_router, prefix="/api/v1")

# 6. ROOT CHECK
# A simple message to verify the server is running.
@app.get("/")
def read_root():
    return {"message": "✅ SmartEstate AI Backend is Running!"}