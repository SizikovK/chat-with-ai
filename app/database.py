from pymongo import MongoClient
import os

client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("MONGO_DB", "database")]

users_collection = db["users"]
chats_collection = db["chats"]
messages_collections = db["messages"]