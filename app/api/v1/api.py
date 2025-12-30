from fastapi import APIRouter
from app.api.v1.endpoints import auth, properties

api_router = APIRouter()

# This connects your "Auth" and "Properties" files to the main app
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(properties.router, prefix="/properties", tags=["Properties"])