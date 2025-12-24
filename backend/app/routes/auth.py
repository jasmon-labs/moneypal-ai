from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import User
from app.utils.auth import get_password_hash, verify_password, create_access_token, get_current_user
from app.config import settings
from datetime import timedelta
from pydantic import BaseModel

router = APIRouter(tags=["Authentication"])

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest):
    # FIXED: Using a dictionary for the lookup to avoid AttributeError
    user = await User.find_one({"email": login_data.username})
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}