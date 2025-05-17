# api/github_fetcher.py
from fastapi import APIRouter, HTTPException, Query
import requests
from app.services.embedder import embed_texts
import os
from dotenv import load_dotenv
load_dotenv()
router = APIRouter()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

@router.get("/")
def fetch_github_repo(repo_url: str = Query(..., description="GitHub repo URL like https://github.com/user/repo")):
    try:
        # Parse user/repo from URL
        parts = repo_url.strip("/").split("/")
        if len(parts) < 5:
            raise HTTPException(status_code=400, detail="Invalid GitHub repo URL")

        user, repo = parts[3], parts[4]

        # GitHub API URL
        api_url = f"https://api.github.com/repos/{user}/{repo}/contents"
        headers = {
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {GITHUB_TOKEN}",
            "X-GitHub-Api-Version": "2022-11-28"
        }

        def fetch_contents(path=""):
            full_url = f"{api_url}/{path}" if path else api_url
            response = requests.get(full_url, headers=headers)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.json().get("message", "Error fetching files"))
            
            items = []
            for item in response.json():
                if item["type"] == "file":
                    items.append({
                        "path": item["path"],
                        "download_url": item["download_url"],
                        "type": "file"
                    })
                elif item["type"] == "dir":
                    items.append({
                        "path": item["path"],
                        "type": "folder",
                        "children": fetch_contents(item["path"])
                    })
            return items

        file_tree = fetch_contents()
        return {"repo": f"{user}/{repo}", "files": file_tree}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/embed")
async def embed_github_file(
    file_url: str = Query(..., description="Download URL of the GitHub file"),
    file_path: str = Query(..., description="Path of the file in the repository"),
    namespace: str = "default"
):
    try:
        # Download file content
        response = requests.get(file_url)
        if not response.ok:
            raise HTTPException(status_code=response.status_code, detail="Failed to download file from GitHub")
        
        # Try to decode as text
        try:
            text = response.content.decode("utf-8").strip()
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="File is not a text file or contains non-UTF-8 characters")
        
        if not text:
            raise HTTPException(status_code=400, detail="File is empty")
        
        # Treat the whole file as one chunk
        texts = [text]
        sources = [file_path]
        
        # Embed and store in Pinecone
        embed_texts(texts, sources, namespace=namespace, prefix=file_path.replace("/", "_"))
        
        return {
            "message": f"1 chunk embedded and stored from file: {file_path}"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/fetch-file-content")
def fetch_file_content(download_url: str = Query(..., description="Direct GitHub download URL of the file")):
    try:
        response = requests.get(download_url)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch file content")
        return {
            "content": response.text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))