# backend/test_connect_atlas.py
import certifi, os
from pymongo import MongoClient

uri = os.getenv("MONGO_URI_TEST") or "mongodb://localhost:27017"
print("Testing URI (masked):", uri[:60] + "...")

try:
    client = MongoClient(uri, tls=True, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=15000)
    print("server_info:", client.server_info())
    print("Connected OK")
except Exception as e:
    import traceback; traceback.print_exc()
