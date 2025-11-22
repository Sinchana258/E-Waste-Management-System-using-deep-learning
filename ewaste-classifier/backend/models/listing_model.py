from pydantic import BaseModel
from database import db  # keep your existing import

# Pydantic model used for responses
class Listing(BaseModel):
    id: str
    title: str
    price: float
    image_url: str
    category: str
    condition: str
    short_description: str
    stock: int

    class Config:
        orm_mode = True


# Mongo collection handle
listings_collection = db["listings"]
