from fastapi import APIRouter
from app.services.chat_service import get_all_chats, create_chat, delete_chat
from app.services.message_service import get_chat_messages_for_user, delete_message
from app.routers.utils import normalize_id

router = APIRouter(prefix="/users/{user_id}", tags=["users"])

@router.get("/chats")
def get_all_chats_by_user_id(user_id: str):
    docs = get_all_chats(user_id)
    return normalize_id(docs)

@router.get("/chats/{chat_id}/messages")
def get_messages(user_id: str, chat_id: str):
    docs = get_chat_messages_for_user(chat_id, user_id)
    return normalize_id(docs)

@router.post("/chats")
def create_new_chat(user_id: str):
    return create_chat(user_id)

@router.delete("/chats/{chat_id}")
def delete_chat_by_id(user_id: str, chat_id: str):
    return delete_chat(chat_id, user_id)

@router.delete("/chats/{chat_id}/message")
def delete_messages_by_id(user_id: str, chat_id: str, message_index: int):
    return delete_message(chat_id, user_id, message_index)