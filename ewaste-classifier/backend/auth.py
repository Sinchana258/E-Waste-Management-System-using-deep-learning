from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from bson import ObjectId
from dotenv import load_dotenv
import os

from database import users_collection

router = APIRouter(prefix="/auth")

load_dotenv()

# JWT + Password hashing setup
JWT_SECRET = os.getenv("JWT_SECRET", "super-secret")
JWT_ALGO = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")

def hash_password(password: str):
    try:
        return pwd_context.hash(password)
    except ValueError as e:
        # bcrypt limitation or other hashing issues
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # unexpected hashing error
        raise HTTPException(status_code=500, detail="Password hashing failed")



def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGO)

# Pydantic Models
class UserCreate(BaseModel):
    fullName: str
    email: str
    password: str
    phone: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserPublic(BaseModel):
    id: str
    fullName: str
    email: str
    phone: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


# ----------- SIGNUP -----------
@router.post("/signup", response_model=TokenResponse)
async def signup(user: UserCreate):
    existing = await users_collection.find_one({"email": user.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)

    user_doc = {
        "fullName": user.fullName,
        "email": user.email.lower(),
        "password_hash": hashed_pw,
        "phone": user.phone,
        "created_at": datetime.utcnow(),
    }

    result = await users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)

    token = create_access_token({"sub": user_id})

    public_user = UserPublic(
        id=user_id,
        fullName=user.fullName,
        email=user.email.lower(),
        phone=user.phone,
    )

    return TokenResponse(access_token=token, user=public_user)


# ----------- LOGIN -----------
@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    user_doc = await users_collection.find_one({"email": data.email.lower()})
    if not user_doc:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(data.password, user_doc["password_hash"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    user_id = str(user_doc["_id"])
    token = create_access_token({"sub": user_id})

    public_user = UserPublic(
        id=user_id,
        fullName=user_doc["fullName"],
        email=user_doc["email"],
        phone=user_doc["phone"],
    )

    return TokenResponse(access_token=token, user=public_user)
