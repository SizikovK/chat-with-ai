from typing import Annotated, Any, Literal, TypedDict
import json
from fastapi import FastAPI
from uuid import uuid4

from langchain_community.embeddings.sentence_transformer import SentenceTransformerEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader

from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, BaseMessage
from pydantic import BaseModel
from langgraph.graph.message import add_messages

POLICIES = [
    "Отвечай по контексту из базы знаний, но дополняй текст чтобы его было приятно и понятно читать, дополняй текст, чтобы он был не сухим, основную инфу бери из базы.",
    "Если пользователь пишет тебе что то не относящееся к теме, то не используй информацию из базы, а просто ответь пользователю так, чтобы он вернулся к теме, по которой ты консультируешь",
    "Если контекста мало, используй инструмент search_knowledge_base.",
    "Если ответа все равно нет, честно скажи, что в базе знаний этого нет.",
    "Если данных недостаточно или город непонятен, попроси пользователя уточнить детали.",
    "Не галлюцинируй и не придумывай информацию.",
    "Если тебе кажется, что пришедший ответ от базы знаний не полный, используй инструмент search_knowledge_base.",
    'В ответ верни только валидный JSON вида {{"status": "success", "content": "Ответ"}} или {{"status": "need_details", "content": "Что нужно уточнить"}}.',
]

def get_prompt(context: str) -> str:
    prompt = (
        "Ты RAG-агент который помогает искать информацию в базе знаний.\n\n"
        f"Контекст из базы знаний:\n{context}\n\n"
        "Правила:\n"
        + "\n".join(f"- {policy}" for policy in POLICIES)
    )
    return prompt

file_path_pdf="./ignitebook-sample.pdf"

loader = PyPDFLoader(file_path_pdf)
pages = loader.load_and_split()
print ("Page counts: ", len(pages))

text_splitter = CharacterTextSplitter (chunk_size=1000, chunk_overlap=100)
docs = text_splitter.split_documents(pages)

embedding_function = HuggingFaceEmbeddings(model_name ="sentence-transformers/all-MiniLM-L6-v2")

db = Chroma.from_documents(
    documents=docs,
    embedding=embedding_function,
    persist_directory="./chroma_db",
    collection_name="ignite_docs",
)

llm = ChatOllama(
    model="llama3.1",
    base_url="localhost:11434"
)

def format_docs():
    '''Добавляет весь текст из файла'''
    return "\n\n".join([doc.page_content for doc in docs])

def search(question, k):
    '''Поиск в бд по запросу'''
    return db.similarity_search(question, k=k)

class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None

class ChatResponse(BaseModel):
    '''Ответ модели'''
    status: Literal["success", "need_details"]
    content: str
    session_id: str

memory_store: dict[str, list[BaseMessage]] = {}

def get_or_create_session_id(session_id: str | None) -> str:
    if session_id:
        return session_id
    return uuid4().hex

def get_history(session_id: str) -> list[BaseMessage]:
    return list(memory_store.get(session_id, []))

def save_history(session_id: str, messages: list[BaseMessage]) -> None:
    memory_store[session_id] = list(messages[-20:])


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
