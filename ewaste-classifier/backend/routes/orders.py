from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List
from bson import ObjectId
from datetime import datetime

from models.listing_model import listings_collection
from database import db

router = APIRouter(prefix="/orders", tags=["orders"])

orders_collection = db["orders"]


class CartItem(BaseModel):
    listing_id: str
    quantity: int


class CreateOrderRequest(BaseModel):
    user_email: str
    items: List[CartItem]


class OrderResponse(BaseModel):
    id: str
    user_email: str
    items: List[dict]
    total_amount: float
    status: str
    created_at: datetime


def order_entity(doc) -> dict:
    return {
        "id": str(doc["_id"]),
        "user_email": doc.get("user_email", ""),
        "items": doc.get("items", []),
        "total_amount": float(doc.get("total_amount", 0)),
        "status": doc.get("status", "placed"),
        "created_at": doc.get("created_at"),
    }


@router.post("/create", response_model=OrderResponse)
async def create_order(payload: CreateOrderRequest):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    order_items = []
    total_amount = 0.0

    for cart_item in payload.items:
        try:
            listing_oid = ObjectId(cart_item.listing_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid listing id")

        listing = await listings_collection.find_one({"_id": listing_oid})
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")

        if listing.get("stock", 0) < cart_item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for {listing.get('title', 'item')}",
            )

        price = float(listing["price"])
        subtotal = price * cart_item.quantity
        total_amount += subtotal

        order_items.append(
            {
                "listing_id": str(listing["_id"]),
                "title": listing.get("title", ""),
                "price": price,
                "quantity": cart_item.quantity,
                "subtotal": subtotal,
            }
        )

    order_doc = {
        "user_email": payload.user_email,
        "items": order_items,
        "total_amount": total_amount,
        "status": "placed",  # simple booking status
        "created_at": datetime.utcnow(),
    }

    res = await orders_collection.insert_one(order_doc)
    order_doc["_id"] = res.inserted_id

    # decrease stock
    for item in order_items:
        await listings_collection.update_one(
            {"_id": ObjectId(item["listing_id"])},
            {"$inc": {"stock": -item["quantity"]}},
        )

    return order_entity(order_doc)
@router.get("/history", response_model=List[OrderResponse])
async def get_order_history(user_email: str = Query(...)):
    cursor = orders_collection.find({"user_email": user_email}).sort("created_at", -1)
    docs = await cursor.to_list(length=100)
    return [order_entity(doc) for doc in docs]