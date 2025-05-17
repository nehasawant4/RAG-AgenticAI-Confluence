# backend/app/services/vector_delete.py
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import os
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

pc = Pinecone(api_key=os.getenv("PINECONE_API"))
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))

@router.delete("/by-source")
def delete_vectors_by_source(
    source: str = Query(..., description="Exact value of the source metadata (e.g. 'confluence:Overview')"),
    namespace: str = "default"
):
    try:
        # Construct filter
        delete_filter = {
            "source": source
        }

        # Call delete with filter
        index.delete(filter=delete_filter, namespace=namespace)

        return {
            "message": f"Delete initiated for vectors where source = '{source}' in namespace '{namespace}'."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
