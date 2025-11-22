from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from database import db
from bson import ObjectId

router = APIRouter(prefix="/users", tags=["users"])

users_collection = db["users"]

class UserProfile(BaseModel):
    email: str
    name: str | None = None
    phone: str | None = None
    address: str | None = None

def user_entity(doc):
    return {
        "id": str(doc["_id"]),
        "email": doc.get("email", ""),
        "name": doc.get("name"),
        "phone": doc.get("phone"),
        "address": doc.get("address"),
    }

@router.get("/me", response_model=UserProfile)
async def get_profile(email: str = Query(...)):
    user = await users_collection.find_one({"email": email})
    if user:
        return user_entity(user)

    # Create profile if missing
    new_doc = {"email": email, "name": None, "phone": None, "address": None}
    res = await users_collection.insert_one(new_doc)
    new_doc["_id"] = res.inserted_id
    return user_entity(new_doc)

@router.put("/me", response_model=UserProfile)
async def update_profile(profile: UserProfile):
    result = await users_collection.update_one(
        {"email": profile.email},
        {"$set": profile.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    updated = await users_collection.find_one({"email": profile.email})
    return user_entity(updated)
