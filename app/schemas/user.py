from pydantic import BaseModel, EmailStr
from typing import Optional

# Base Schema
class UserBase(BaseModel):
    email: EmailStr

# For Signup (we need a password)
class UserCreate(UserBase):
    password: str

# For Reading User Data (never return the password!)
class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

# For the Token Response
class Token(BaseModel):
    access_token: str
    token_type: str