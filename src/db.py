from langchain_community.embeddings.sentence_transformer import SentenceTransformerEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader

file_path_pdf="./data/ignitebook-sample.pdf"

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

def format_docs():
    '''Добавляет весь текст из файла'''
    return "\n\n".join([doc.page_content for doc in docs])

def search(question, k):
    '''Поиск в бд по запросу'''
    return db.similarity_search(question, k=k)