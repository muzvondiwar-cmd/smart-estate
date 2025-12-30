from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core import security
from app.db import database, models

# Ensure this matches the Token URL in your main.py
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    print(f"\n🔐 DEBUG: Checking Token: {token[:15]}...") # Print first 15 chars

    try:
        # Decode the token
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        user_id: str = payload.get("sub")

        print(f"🔐 DEBUG: Token Decoded. User ID inside is: '{user_id}' (Type: {type(user_id)})")

        if user_id is None:
            print("❌ DEBUG: Token has no 'sub' field.")
            raise credentials_exception

    except JWTError as e:
        print(f"❌ DEBUG: Token Signature Failed! Error: {e}")
        # This confirms if the Key is mismatched
        raise credentials_exception

    # Validate DB User
    try:
        # We try to convert to int, just in case
        user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    except ValueError:
        print(f"❌ DEBUG: User ID '{user_id}' is not a number.")
        raise credentials_exception

    if user is None:
        print(f"❌ DEBUG: User ID {user_id} not found in DB.")
        raise credentials_exception

    print(f"✅ DEBUG: User Authorized: {user.email}")
    return user