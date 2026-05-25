from fastapi import APIRouter, Header, HTTPException
from openai import APITimeoutError
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, SystemMessage

from app.services.chat_service import get_chat_for_user, update_chat_title
from app.services.message_service import get_chat_messages_for_user, save_message
from app.routers.utils import AI, USER, doc_to_message

from app.agent.agent import get_agent
from app.agent.prompt import SYSTEM_PROMPT

class ChatRequest(BaseModel):
    message: str

router = APIRouter(prefix="/chats", tags=["messages"])
agent = get_agent()

def run_chat(chat_id: str, user_id: str, message: str) -> dict:
    history = get_chat_messages_for_user(chat_id, user_id)
    is_first_message = len(history) == 0
    history_messages = [doc_to_message(doc) for doc in history]
    history_messages.reverse()

    save_message(
        chat_id=chat_id,
        user_id=user_id,
        role=USER,
        content=message
    )

    result = agent.invoke(
        {
            "messages": [
                SystemMessage(content=SYSTEM_PROMPT),
                *history_messages,
                HumanMessage(content=message),
            ]
        }
    )
    last_message = result["messages"][-1]
    response_content = last_message.content

    save_message(
        chat_id=chat_id,
        user_id=user_id,
        role=AI,
        content=response_content
    )

    if is_first_message:
        try:
            title = str(message).strip().strip('"').strip("'")
            title = title[:20].strip()
            if title:
                update_chat_title(chat_id=chat_id, user_id=user_id, title=title)
        except Exception:
            pass

    return {
        "chat_id": chat_id,
        "content": response_content,
    }

@router.post("/{chat_id}/messages")
def chat(chat_id: str, request: ChatRequest, user_id: str = Header(alias="User-Id")):
    chat = get_chat_for_user(chat_id=chat_id, user_id=user_id)
    if chat is None:
        raise HTTPException(status_code=404, detail="chat not found")
    try:
        return run_chat(chat_id=chat_id, user_id=user_id, message=request.message)
    except APITimeoutError:
        raise HTTPException(status_code=504, detail="LLM request timed out. Try again.")
