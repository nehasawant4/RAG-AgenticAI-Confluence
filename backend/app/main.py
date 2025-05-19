# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import query, upload_file, ingest_confluence, ingest_github
from app.services import vector_delete
app = FastAPI(
    title="AgenticAI RAG Backend",
    description="Backend for Confluence & GitHub RAG system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://rag-assist.vercel.app/", "*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest_confluence.router, prefix="/ingest/confluence", tags=["Ingest - Confluence"])
app.include_router(ingest_github.router, prefix="/ingest/github", tags=["Ingest - GitHub"])
app.include_router(query.router, prefix="/query", tags=["RAG Query"])
app.include_router(upload_file.router, prefix="/upload", tags=["Upload"])
app.include_router(vector_delete.router, prefix="/delete", tags=["Vector Delete"])
#app.include_router(suggest_edits.router, prefix="/suggest", tags=["Suggestions"])

@app.get("/")
def root():
    return {"message": "AgenticAI RAG backend is running"}
