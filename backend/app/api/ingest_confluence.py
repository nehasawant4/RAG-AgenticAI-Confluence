from fastapi import APIRouter, HTTPException, Query
from app.services.embedder import embed_texts
import requests
from bs4 import BeautifulSoup
from typing import Optional
import os
from dotenv import load_dotenv
from requests.auth import HTTPBasicAuth

load_dotenv()
router = APIRouter()

CONFLUENCE_EMAIL = os.getenv("CONFLUENCE_EMAIL")
CONFLUENCE_API = os.getenv("CONFLUENCE_API")
CONFLUENCE_BASE_URL = os.getenv("CONFLUENCE_URL")

auth = HTTPBasicAuth(CONFLUENCE_EMAIL, CONFLUENCE_API)

# ✅ 1. Embed a single Confluence page
@router.post("/")
def ingest_confluence_page(
    url: str = Query(..., description="Full URL to the Confluence page"),
    namespace: str = "confluence"
):
    try:
        headers = {"Content-Type": "application/json"}

        # Convert view URL to API URL
        api_url = url
        if "/pages/" in url:
            page_id = url.split("/pages/")[1].split("/")[0]
            base_url = url.split("/wiki")[0]
            api_url = f"{base_url}/wiki/rest/api/content/{page_id}?expand=body.storage"

        response = requests.get(api_url, auth=auth, headers=headers)
        if not response.ok:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch Confluence content")

        content = response.json()
        html_body = content["body"]["storage"]["value"]
        soup = BeautifulSoup(html_body, "html.parser")
        plain_text = soup.get_text(separator="\n").strip()

        if not plain_text:
            raise HTTPException(status_code=400, detail="No text found in Confluence page.")

        embed_texts([plain_text], [url], namespace=namespace)

        return {"message": "Confluence page embedded successfully", "source": url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ 2. List pages in a Confluence space or under a parent
@router.get("/list")
def list_confluence_pages(
    space_key: Optional[str] = Query(None, description="Optional Confluence space key"),
    parent_id: Optional[str] = Query(None, description="Optional ancestor page ID"),
    limit: int = 50
):
    try:
        headers = {"Content-Type": "application/json"}
        endpoint = f"{CONFLUENCE_BASE_URL}/wiki/rest/api/content"
        params = {
            "type": "page",
            "limit": limit,
            "expand": "ancestors"
        }
        if space_key:
            params["spaceKey"] = space_key
        if parent_id:
            params["ancestors"] = parent_id

        response = requests.get(endpoint, auth=auth, headers=headers, params=params)
        if not response.ok:
            raise HTTPException(status_code=response.status_code, detail=f"{response.status_code}: Failed to fetch pages")

        data = response.json()
        pages = []
        for item in data.get("results", []):
            pages.append({
                "id": item.get("id"),
                "title": item.get("title"),
                "ancestors": [a["title"] for a in item.get("ancestors", [])]
            })

        return {
            "count": len(pages),
            "pages": pages
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/content")
def get_confluence_page_content(id: str = Query(..., description="Confluence page ID")):
    try:
        headers = {"Content-Type": "application/json"}
        url = f"{CONFLUENCE_BASE_URL}/wiki/rest/api/content/{id}?expand=body.storage"

        response = requests.get(url, auth=auth, headers=headers)
        if not response.ok:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch page content")

        content = response.json()
        html = content["body"]["storage"]["value"]
        title = content["title"]

        return {
            "id": id,
            "title": title,
            "html": html
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/embed")
def embed_confluence_page_to_pinecone(
    id: str = Query(..., description="Confluence page ID"),
    namespace: str = "default"
):
    try:
        # Fetch page HTML using the existing Confluence API
        headers = {"Content-Type": "application/json"}
        url = f"{CONFLUENCE_BASE_URL}/wiki/rest/api/content/{id}?expand=body.storage"

        response = requests.get(url, auth=auth, headers=headers)
        if not response.ok:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch Confluence page")

        content = response.json()
        title = content["title"]
        html = content["body"]["storage"]["value"]

        # Convert HTML to plain text
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, "html.parser")
        text = soup.get_text(separator="\n").strip()

        if not text:
            raise HTTPException(status_code=400, detail="Page has no text content.")

        # Treat as one chunk
        texts = [text]
        sources = [f"confluence:{title}"]

        # Embed and store in Pinecone
        from app.services.embedder import embed_texts
        embed_texts(texts, sources, namespace=namespace, prefix=f"confluence-{id}")

        return {
            "message": f"1 chunk embedded from Confluence page '{title}' (ID: {id})"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
