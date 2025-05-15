from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.embedder import embed_texts

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...), namespace: str = "default"):
    try:
        # Read file content
        content = await file.read()
        text = content.decode("utf-8").strip()

        if not text:
            raise ValueError("Uploaded file is empty.")

        # Treat the whole file as one chunk
        texts = [text]
        sources = [file.filename]

        # Embed and store in Pinecone
        embed_texts(texts, sources, namespace=namespace, prefix=file.filename.replace(" ", "_"))

        return {
            "message": f"1 chunk embedded and stored from file: {file.filename}"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

