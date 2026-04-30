from langchain_ollama import ChatOllama

def create_llm():
    return ChatOllama(
        model="llama3.1",
        base_url="localhost:11434"
    )