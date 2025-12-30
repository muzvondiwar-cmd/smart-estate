from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.db import models
from app.db.database import engine

# Create the database tables automatically (if they don't exist)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartEstate AI API")

# --- 🔓 SECURITY SETTINGS (CORS) ---
# We use ["*"] to allow ALL connections. This fixes the connection error
# between your Vercel Frontend and Render Backend.
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Allows any website to connect
    allow_credentials=True,
    allow_methods=["*"],         # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],         # Allows all headers
)

# --- ROUTES ---
# Include all your API endpoints (properties, auth, etc.)
app.include_router(api_router, prefix="/api/v1")

# --- HEALTH CHECK ---
# This is the message you saw on the blue docs page
@app.get("/")
def root():
    return {"message": "✅ SmartEstate AI Backend is Running!"}