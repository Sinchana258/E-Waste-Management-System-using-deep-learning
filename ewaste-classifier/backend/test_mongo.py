# backend/test_mongo.py
import os
import certifi
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/ewaste_db")
uri_lower = MONGO_URI.lower()

if "+srv" in uri_lower or "mongodb.net" in uri_lower:
    print("Detected cloud URI — using TLS + certifi")
    client = MongoClient(MONGO_URI, tls=True, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=5000)
else:
    print("Detected local URI — connecting without TLS")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)

try:
    print(client.server_info())   # raises on failure
    print("Connected OK")
except Exception as e:
    print("Connection failed:", e)
