# backend/database.py
import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient

# Read env
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/ewaste_db")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", None)

# Heuristic: enable TLS only for cloud/atlas SRV URIs or mongodb.net hosts.
uri_lower = (MONGO_URI or "").lower()
if "+srv" in uri_lower or "mongodb.net" in uri_lower:
    # Cloud (Atlas) -> require TLS + certifi CA bundle
    client = AsyncIOMotorClient(
        MONGO_URI,
        tls=True,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=10000,
    )
    using_tls = True
else:
    # Local dev -> don't force TLS
    client = AsyncIOMotorClient(
        MONGO_URI,
        serverSelectionTimeoutMS=10000,
    )
    using_tls = False

# Choose DB
if MONGO_DB_NAME:
    db = client[MONGO_DB_NAME]
else:
    # If URI contains a DB, this returns it, else fallback
    try:
        db = client.get_default_database()
    except Exception:
        db = client["ewaste_db"]

# Collections exported for app
users_collection = db["users"]
bookings_collection = db["bookings"]

print(f"[database] MONGO_URI='{MONGO_URI[:60]}...' using_tls={using_tls} db='{db.name}'")
