# backend/app/services/embedder.py
import os
from typing import List
from dotenv import load_dotenv
from pinecone import Pinecone
from openai import OpenAI
import os.path

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))

def embed_texts(texts: List[str], sources: List[str], namespace: str = "default", prefix: str = "doc") -> None:
    # 🔹 Augment the texts with source/filename information
    enriched_texts = []
    for i, text in enumerate(texts):
        source_path = sources[i]
        filename = os.path.basename(source_path)
        # Prepend the source information to the text that will be vectorized
        enriched_text = f"FILE: {source_path}\nFILENAME: {filename}\n\n{text}"
        enriched_texts.append(enriched_text)
    
    # 🔹 Create embeddings via OpenAI with enriched texts
    response = client.embeddings.create(
        input=enriched_texts,
        model="text-embedding-3-small"
    )

    embeddings = [record.embedding for record in response.data]

    # 🔹 Prepare and upsert to Pinecone
    vectors = [
        (f"{prefix}-id-{i}", embeddings[i], {
            "text": texts[i],  # Store the enriched text
            "source": sources[i],
        }) for i in range(len(texts))
    ]

    index.upsert(vectors=vectors, namespace=namespace)
