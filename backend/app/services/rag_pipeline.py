import os
from openai import OpenAI
from pinecone import Pinecone
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional, Union

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))

def query_rag(question: str, namespace: str = "default", top_k: int = 5, history: Optional[List[Union[Dict[str, str], Any]]] = None) -> dict:
    """
    Query the RAG system with a question and optional conversation history.
    
    Args:
        question: The user's question
        namespace: Pinecone namespace
        top_k: Number of results to retrieve
        history: List of message objects with 'text' and 'sender' fields
        
    Returns:
        Dictionary with answer and sources
    """
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
    matches = [m for m in results.matches if m.score >= 0.5]
    
    # Check if we have any relevant matches
    if not matches:
        return {
            "answer": "I don't have enough information in my knowledge base to answer this question accurately.",
            "sources": []
        }
    
    context = "\n\n".join([m.metadata.get("text", "") for m in matches])
    sources = [m.metadata.get("source", "N/A") for m in matches]

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
    - Only answer based on the provided context. If the context doesn't contain relevant information to answer the question, state that you don't have enough information.
    - Do not make up or infer information that isn't present in the context.
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
    
    prompt = f"""Answer the question based on the following context:

{context}

{conversation_context}
Question: {question}"""

    # 🔹 Call GPT
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt}
        ], 
        temperature=0.3,
        max_tokens=1500,
        top_p=1.0
    )

    return {
        "answer": completion.choices[0].message.content,
        "sources": sources
    }