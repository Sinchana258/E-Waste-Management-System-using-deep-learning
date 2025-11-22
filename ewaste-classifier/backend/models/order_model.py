from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId
from database import db

from .listing_model import PyObjectId


class Order(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    listing_id: PyObjectId
    amount: float
    user_email: str
    payment_status: str = "pending"  # "pending" | "paid"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        orm_mode = True


orders_collection = db["orders"]
