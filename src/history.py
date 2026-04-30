from langchain_core.messages import BaseMessage
from uuid import uuid4

memory_store: dict[str, list[BaseMessage]] = {}

def get_or_create_session_id(session_id: str | None) -> str:
    if session_id:
        return session_id
    return uuid4().hex

def get_history(session_id: str) -> list[BaseMessage]:
    return list(memory_store.get(session_id, []))

def save_history(session_id: str, messages: list[BaseMessage]) -> None:
    memory_store[session_id] = list(messages[-20:])