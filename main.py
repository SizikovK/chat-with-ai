from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from pydantic import BaseModel
from typing import Literal
from fastapi import FastAPI
import json

from src.history import *
from src.prompt import get_prompt
from src.db import search
from src.llm_logic import create_llm

class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None

class ChatResponse(BaseModel):
    status: Literal["success", "need_details"]
    content: str
    session_id: str

llm = create_llm()
api = FastAPI(title="RAG Agent")

@api.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    session_id = get_or_create_session_id(request.session_id)
    history = get_history(session_id)

    docs = search(request.message, 3)
    context = "\n\n".join(doc.page_content for doc in docs)

    system_prompt = get_prompt(context)
    user_message = HumanMessage(content=request.message)

    messages = [
        SystemMessage(content=system_prompt),
        *history,
        user_message,
    ]

    response = llm.invoke(messages)

    ai_message = AIMessage(content=response.content)

    save_history(
        session_id=session_id,
        messages=[*history, user_message, ai_message],
    )

    try:
        data = json.loads(response.content)
        return ChatResponse(
            status=data["status"],
            content=data["content"],
            session_id=session_id,
        )
    except Exception:
        return ChatResponse(
            status="success",
            content=response.content,
            session_id=session_id,
        )
