# backend/app/api/upload_file.py
from fastapi import APIRouter, UploadFile, File, HTTPException
import io
from pypdf import PdfReader
from app.services.embedder import embed_texts

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...), namespace: str = "default"):
    try:
        # Read file content
        content = await file.read()
        
        # Check file extension to determine processing method
        if file.filename.lower().endswith('.pdf'):
            # Process PDF file
            pdf_file = io.BytesIO(content)
            pdf_reader = PdfReader(pdf_file)
            
            text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            text = text.strip()
        else:
            # Process as text file
            text = content.decode("utf-8").strip()

        if not text:
            raise ValueError("Uploaded file is empty or no text could be extracted.")

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

