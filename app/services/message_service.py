from app.database import chats_collection, messages_collections
from datetime import datetime

def save_message(chat_id: str, user_id: str, role: str, content: str):
    last_message = messages_collections.find_one(
        {"chat_id": chat_id, "user_id": user_id},
        sort=[("message_index", -1)]
    )

    message_index = 0
    if last_message is not None:
        message_index = last_message["message_index"] + 1

    message = {
        "chat_id": chat_id,
        "user_id": user_id,
        "message_index": message_index,
        "role": role,
        "content": content,
        "created_at":datetime.now(),
    }

    messages_collections.insert_one(message)
    
    chats_collection.update_one(
        {"_id": chat_id},
        {
            "$set": {
                "updated_at": datetime.now()
            }
        }
    )

def get_chat_messages_for_user(chat_id: str, user_id: str) -> list[dict]:
    return list(
        messages_collections
        .find({"chat_id": chat_id, "user_id": user_id})
        .sort("created_at", -1)
    )

def delete_message(chat_id: str, user_id: str, message_index: int):
    result = messages_collections.delete_many({
        "chat_id": chat_id,
        "user_id": user_id,
        "message_index": {
            "$gte": message_index
        }
    })

    return result.deleted_count
