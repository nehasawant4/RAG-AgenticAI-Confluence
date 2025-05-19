from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.services.rag_pipeline import query_rag, extract_text_from_image
from typing import List, Optional
import json

router = APIRouter()

@router.post("/")
async def query_docs(
    question: str = Form(...),
    history: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    try:
        # Parse history JSON string if provided
        parsed_history = json.loads(history) if history else []

        # Extract image text if an image is uploaded
        image_text = None
        if image:
            try:
                contents = await image.read()
                with open("temp.jpg", "wb") as f:
                    f.write(contents)
                image_text = extract_text_from_image("temp.jpg")
            except Exception as e:
                print(f"Failed to process uploaded image: {str(e)}")
                image_text = "[Image processing failed]"
            print(image_text)

        # Call RAG pipeline with optional image text
        result = query_rag(question=question, history=parsed_history, image_text=image_text)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
