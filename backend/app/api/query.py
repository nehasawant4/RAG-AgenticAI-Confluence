# backend/app/api/query.py
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from app.services.rag_pipeline import query_rag
from typing import List, Optional, Dict, Any, Union
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class Message(BaseModel):
    text: str
    sender: str

class QueryRequest(BaseModel):
    question: str
    history: Optional[List[Dict[str, Any]]] = None

@router.post("/")
async def query_docs(request: QueryRequest, req: Request):
    try:
        # Log the request body for debugging
        request_body = await req.json()
        logger.info(f"Received request: {request_body}")
        
        # Get history from request or default to empty list
        history = request.history or []
        
        # Log history for debugging
        logger.info(f"History count: {len(history)}")
        if history:
            logger.info(f"First history item type: {type(history[0])}")
        
        # Call the RAG pipeline
        result = query_rag(request.question, history=history)
        return result
    except Exception as e:
        logger.error(f"Error in query_docs: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
