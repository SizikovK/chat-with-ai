from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from datetime import datetime

USER = "user"
AI = "ai"
SYSTEM = "system"

def message_to_doc(chat_id: str, msg: BaseMessage) -> dict:
    '''Превращает классы BaseMessage на строковые роли'''
    role = SYSTEM
    if isinstance(msg, HumanMessage):
        role = USER
    elif isinstance(msg, AIMessage):
        role = AI

    return {
        "chat_id": chat_id,
        "role": role,
        "content": msg.content,
        "created_at": datetime.utcnow(),
    }

def doc_to_message(doc: dict) -> BaseMessage:
    '''Заменяет строковые роли user/ai/system на классы BaseMessage'''
    role = doc["role"]
    content = doc["content"]
    if role == USER:
        return HumanMessage(content=content)
    if role == AI:
        return AIMessage(content=content)
    return SystemMessage(content=content)

def normalize_id(data):
    '''Проходит по документу и превращает "_id" в "id"'''
    if isinstance(data, list):
        return [normalize_id(item) for item in data]

    if isinstance(data, dict):
        out = {}
        for key, value in data.items():
            new_key = "id" if key == "_id" else key
            out[new_key] = normalize_id(value)
        return out

    return str(data) if type(data).__name__ == "ObjectId" else data