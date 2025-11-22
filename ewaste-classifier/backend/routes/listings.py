from fastapi import APIRouter, HTTPException
from typing import List
from bson import ObjectId

from models.listing_model import listings_collection, Listing

router = APIRouter(prefix="/marketplace", tags=["marketplace"])


def listing_entity(doc) -> dict:
    """Convert Mongo document to a clean dict for API."""
    return {
        "id": str(doc["_id"]),
        "title": doc.get("title", ""),
        "price": float(doc.get("price", 0)),
        "image_url": doc.get("image_url", ""),
        "category": doc.get("category", ""),
        "condition": doc.get("condition", ""),
        "short_description": doc.get("short_description", ""),
        "stock": int(doc.get("stock", 0)),
    }


@router.get("/listings", response_model=List[Listing])
async def get_listings():
    cursor = listings_collection.find({})
    docs = await cursor.to_list(length=100)  # if using Motor (async)
    # If using sync PyMongo, use: docs = list(cursor)
    return [listing_entity(doc) for doc in docs]


@router.get("/listings/{listing_id}", response_model=Listing)
async def get_listing(listing_id: str):
    try:
        oid = ObjectId(listing_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid listing id")

    doc = await listings_collection.find_one({"_id": oid})
    # If sync: doc = listings_collection.find_one({"_id": oid})

    if not doc:
        raise HTTPException(status_code=404, detail="Listing not found")

    return listing_entity(doc)
