from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader
from pathlib import Path

DATA_PATH = Path("data")
DB_PATH = "./chroma_db"

embedding_function = HuggingFaceEmbeddings(model_name ="sentence-transformers/all-MiniLM-L6-v2")

db = Chroma(
    embedding_function=embedding_function,
    persist_directory=DB_PATH,
    collection_name="ignite_docs",
)

def is_db_empty():
    return db._collection.count() == 0

def read_pdf(file_path: str):
    loader = PyPDFLoader(file_path)
    pages = loader.load_and_split()

    text_splitter = CharacterTextSplitter (chunk_size=1000, chunk_overlap=100)
    return text_splitter.split_documents(pages)

def read_file(file_path: str):
    with open(file_path, "r") as file:
        return file.read()

def parse_documents():
    for file_path in DATA_PATH.rglob("*"):
        if not file_path.is_file():
            continue

        if file_path.suffix.lower() == ".pdf":
            docs = read_pdf(str(file_path))
            db.add_documents(docs)
        else:
            text = read_file(str(file_path))
            db.add_texts([text])

def search(question, k):
    return db.similarity_search(question, k=k)

if is_db_empty():
    parse_documents()