import os
from typing import List
from dotenv import load_dotenv
from pinecone import Pinecone
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX_NAME"))

def embed_texts(texts: List[str], sources: List[str], namespace: str = "default", prefix: str = "doc") -> None:
    # 🔹 Create embeddings via OpenAI
    response = client.embeddings.create(
        input=texts,
        model="text-embedding-3-small"
    )

    embeddings = [record.embedding for record in response.data]

    # 🔹 Prepare and upsert to Pinecone
    vectors = [
        (f"{prefix}-id-{i}", embeddings[i], {
            "text": texts[i],
            "source": sources[i]
        }) for i in range(len(texts))
    ]

    index.upsert(vectors=vectors, namespace=namespace)
