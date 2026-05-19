from uuid import uuid4
from datetime import datetime
from app.database import chats_collection, messages_collections


def create_chat(user_id: str, title: str = "Новый чат") -> str:
    chat_id = uuid4().hex

    chat = {
        "_id": chat_id,
        "user_id": user_id,
        "title": title,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
    }

    chats_collection.insert_one(chat)

    return chat_id

def get_chat(chat_id: str) -> dict | None:
    return chats_collection.find_one({
        "_id": chat_id
    })

def get_chat_for_user(chat_id: str, user_id: str) -> dict | None:
    return chats_collection.find_one({
        "_id": chat_id,
        "user_id": user_id,
    })

def get_all_chats(user_id: str) -> list[dict]:
    return list(
        chats_collection
        .find({"user_id": user_id})
        .sort("updated_at", -1)
    )

def delete_chat(chat_id: str, user_id: str) -> bool:
    chat_result = chats_collection.delete_one({
        "_id": chat_id,
        "user_id": user_id,
    })

    messages_collections.delete_many({
        "chat_id": chat_id,
        "user_id": user_id,
    })

    return chat_result.deleted_count > 0
