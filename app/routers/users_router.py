from fastapi import APIRouter, Header, HTTPException
from app.services.chat_service import get_all_chats, create_chat, delete_chat, get_chat_for_user
from app.services.message_service import get_chat_messages_for_user, delete_message
from app.routers.utils import normalize_id

router = APIRouter(tags=["users", "chats", "messages"])


@router.get("/users/{user_id}/chats")
def get_all_chats_by_user_id(user_id: str):
    docs = get_all_chats(user_id)
    return normalize_id(docs)

@router.post("/users/{user_id}/chats")
def create_new_chat(user_id: str):
    return create_chat(user_id)


@router.get("/chats/{chat_id}")
def get_chat_by_id(chat_id: str, user_id: str = Header(alias="User-Id")):
    chat = get_chat_for_user(chat_id=chat_id, user_id=user_id)
    if chat is None:
        raise HTTPException(404, "chat not found")
    return normalize_id(chat)

@router.delete("/chats/{chat_id}")
def delete_chat_by_id(chat_id: str, user_id: str = Header(alias="User-Id")):
    return {"deleted": delete_chat(chat_id, user_id)}


@router.get("/chats/{chat_id}/messages")
def get_messages(chat_id: str, user_id: str = Header(alias="User-Id")):
    docs = get_chat_messages_for_user(chat_id, user_id)
    return normalize_id(docs)

@router.delete("/chats/{chat_id}/messages")
def delete_messages_by_id(chat_id: str, message_index: int, user_id: str = Header(alias="User-Id")):
    deleted_count = delete_message(chat_id, user_id, message_index)
    return {"deleted_count": deleted_count}
