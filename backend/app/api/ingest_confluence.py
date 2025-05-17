# backend/app/api/ingest_confluence.py
from fastapi import APIRouter, HTTPException, Query
from app.services.embedder import embed_texts
import requests
from bs4 import BeautifulSoup
from typing import Optional
import os
from dotenv import load_dotenv
from requests.auth import HTTPBasicAuth
import re

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
    space_key: Optional[str] = "~712020d3bfc769adc846d283161672a94500f9",
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
        
        # Create a patched version of the HTML that browsers can render
        patched_html = html
        
        # Regex patterns to match Confluence code blocks
        # These often use the ac:structured-macro format
        code_block_pattern = r'<ac:structured-macro ac:name="code"[^>]*>(.*?)</ac:structured-macro>'
        
        # Find all code blocks in the HTML
        code_blocks = re.findall(code_block_pattern, html, re.DOTALL)
        
        # For each code block, extract its content and replace with proper HTML
        for i, block in enumerate(code_blocks):
            # Try to find the actual code content
            code_content = ""
            
            # Look for plain-text-body content first
            plain_text_match = re.search(r'<ac:plain-text-body[^>]*?><!\[CDATA\[(.*?)]]></ac:plain-text-body>', block, re.DOTALL)
            if plain_text_match:
                code_content = plain_text_match.group(1)
            else:
                # Try other patterns that might contain code
                rich_text_match = re.search(r'<ac:rich-text-body[^>]*?>(.*?)</ac:rich-text-body>', block, re.DOTALL)
                if rich_text_match:
                    code_content = rich_text_match.group(1)
                else:
                    # If we can't find content, use any text within the block
                    code_content = re.sub(r'<[^>]+>', '', block)
                    code_content = code_content.strip()
            
            # Create a properly formatted HTML pre block
            replacement = f'<pre class="confluence-code-block">{code_content}</pre>'
            
            # Replace the original macro with our new pre block - limit to one replacement per code block
            patched_html = re.sub(code_block_pattern, replacement, patched_html, count=1, flags=re.DOTALL)
        
        # Handle other types of Confluence macros that might contain code
        patched_html = re.sub(r'<ac:structured-macro ac:name="codeblock"[^>]*>(.*?)</ac:structured-macro>', 
                             r'<pre class="confluence-code-block">\1</pre>', patched_html, flags=re.DOTALL)
        
        # Remove CDATA tags but keep their content
        patched_html = re.sub(r'<!\[CDATA\[(.*?)]]>', r'\1', patched_html, flags=re.DOTALL)
        
        # Process with BeautifulSoup for final cleanup
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(patched_html, "html.parser")
        
        # Get the final HTML
        processed_html = str(soup)
        
        # Add fallback inline styling for code blocks
        processed_html = processed_html.replace('<pre class="confluence-code-block">', 
                          '<pre class="confluence-code-block" style="display:block; white-space:pre; overflow-x:auto; background-color:#1e1e1e; color:#e0e0e0; padding:16px; border-radius:4px; font-family:monospace; line-height:1.4; border:1px solid #444; max-height:500px;">')
        
        return {
            "id": id,
            "title": title,
            "html": processed_html
        }

    except Exception as e:
        import traceback
        print(traceback.format_exc())
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
        sources = [f"Confluence: {title}"]

        # Embed and store in Pinecone
        from app.services.embedder import embed_texts
        embed_texts(texts, sources, namespace=namespace, prefix=f"confluence-{id}")

        return {
            "message": f"1 chunk embedded from Confluence page '{title}' (ID: {id})"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
