# backend/app/services/rag_pipeline.py
import os
from openai import OpenAI
from pinecone import Pinecone
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional, Union
from PIL import Image
import pytesseract

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))

def extract_text_from_image(image_path: str) -> str:
    try:
        raw_text = pytesseract.image_to_string(Image.open(image_path))
        cleaned = raw_text.strip()
        return cleaned if cleaned else "[Unrecognizable]"
    except Exception as e:
        print(f"OCR extraction error: {e}")
        return "[Image processing failed]"

def query_rag(question: str, namespace: str = "default", top_k: int = 5,
              history: Optional[List[Union[Dict[str, str], Any]]] = None,
              image_text: Optional[str] = None) -> dict:
    # Merge question and image text
    if image_text:
        question += f"\n\n[Image Content]: {image_text}"
    # 🔹 Embed the query
    response = client.embeddings.create(
        input=[question],
        model="text-embedding-3-small"
    )
    query_embed = response.data[0].embedding

    # 🔹 Query Pinecone
    results = index.query(
        vector=query_embed,
        top_k=top_k,
        include_metadata=True,
        namespace=namespace
    )

    # 🔹 Filter and construct context
    matches = [m for m in results.matches if m.score >= 0.1]
    
    # Check if we have any relevant matches
    if not matches:
        sources = []
    else:
        sources = [m.metadata.get("source", "N/A") for m in matches]
        
    context = "\n\n".join([m.metadata.get("text", "") for m in matches])
    # 🔹 Build and log prompt
    system_message = """
    Format your responses using proper markdown syntax:
    - Use ## for section headings 
    - Use ### for subsection headings
    - Use proper bullet points and numbered lists when presenting items
    - Format code blocks with triple backticks and the appropriate language identifier
    - Use **bold** for emphasis on important points
    - Create tables with | and - when presenting tabular information
    - Use backticks for inline code or parameter names
    - Respond using markdown. Wrap all code in fenced blocks with language identifiers (like ```json, ```python, etc).
    - Ensure your textual response is well-structured, readable, and properly formatted.
    - You MUST ONLY answer based on the provided context. If the context doesn't contain relevant information to answer the question, state that you don't have enough information.
    - DO NOT answer from prior knowledge or assumptions.
    """
    
    # Build conversation history context
    conversation_context = ""
    if history and len(history) > 0:
        try:
            # Get up to 3 most recent user messages and 3 most recent AI messages
            user_messages = [msg for msg in history if isinstance(msg, dict) and msg.get("sender") == "user"][-3:]
            ai_messages = [msg for msg in history if isinstance(msg, dict) and msg.get("sender") == "ai"][-3:]
            
            # Format conversation history
            conversation_context = "Previous conversation:\n"
            
            # Interleave messages in chronological order
            all_messages = sorted(user_messages + ai_messages, 
                                 key=lambda x: history.index(x) if x in history else -1)
            
            for msg in all_messages:
                if isinstance(msg, dict) and "text" in msg and "sender" in msg:
                    sender = "User" if msg["sender"] == "user" else "Assistant"
                    conversation_context += f"{sender}: {msg['text']}\n\n"
        except Exception as e:
            # If there's any error processing history, just skip it
            print(f"Error processing history: {str(e)}")
            conversation_context = ""
    
    prompt = f"""You are an AI assistant answering based on retrieved documents only.

    ## User's Query:
    - Image Content: {image_text or '[No image provided]'}
    - Query Content: {question}

    ## Context from Vector Database:
    {context}

    ## Previous Conversation:
    {conversation_context}

    ## Instructions:
    - Check if the 'Image Content' contains any information that is relevant to the query or context.
    - If it does, incorporate it in your answer. If not, say that you dont have any information about it.
    """

    # 🔹 Call GPT
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt}
        ], 
        temperature=0.5,
        max_tokens=1500,
        top_p=1.0
    )

    return {
        "answer": completion.choices[0].message.content,
        "sources": sources
    }