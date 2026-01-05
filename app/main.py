from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import database, models
from app.api.v1.api import api_router

# Create Database Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="SmartEstate AI API")

# --- CRITICAL FIX: ENABLE CORS ---
# This allows your Vercel frontend to talk to this Render backend
origins = ["*"]  # In production, replace "*" with your Vercel URL

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "SmartEstate AI Backend is Running!"}