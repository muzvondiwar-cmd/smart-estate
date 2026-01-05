from fastapi import APIRouter
from app.api.v1.endpoints import properties, auth

api_router = APIRouter()

# Connect the endpoints
api_router.include_router(properties.router, prefix="/properties", tags=["properties"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"]) # critical code