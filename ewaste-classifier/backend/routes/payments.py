from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime

from models.listing_model import listings_collection
from database import db

orders_collection = db["orders"]

router = APIRouter(prefix="/payments", tags=["payments"])


class CreateOrderRequest(BaseModel):
    listing_id: str
    user_email: str


class CreateOrderResponse(BaseModel):
    order_id: str
    amount: float
    message: str = "Order created (payment simulated)"


@router.post("/create-order", response_model=CreateOrderResponse)
async def create_order(data: CreateOrderRequest):
    try:
        oid = ObjectId(data.listing_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid listing id")

    listing = await listings_collection.find_one({"_id": oid})
    # If sync: listing = listings_collection.find_one({"_id": oid})

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    if listing.get("stock", 0) <= 0:
        raise HTTPException(status_code=400, detail="Item out of stock")

    amount = float(listing["price"])

    # simple order dict, no Pydantic model
    order_doc = {
        "listing_id": str(listing["_id"]),
        "amount": amount,
        "user_email": data.user_email,
        "payment_status": "paid",  # simulate success
        "created_at": datetime.utcnow(),
    }

    res = await orders_collection.insert_one(order_doc)
    # If sync: res = orders_collection.insert_one(order_doc)

    order_id = str(res.inserted_id)

    # decrease stock by 1
    await listings_collection.update_one(
        {"_id": listing["_id"]}, {"$inc": {"stock": -1}}
    )
    # If sync: listings_collection.update_one(...)

    return CreateOrderResponse(order_id=order_id, amount=amount)
