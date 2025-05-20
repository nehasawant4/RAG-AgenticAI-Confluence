# RAG-AgenticAI-Confluence

## Installation

### Backend Setup

```bash
# Create and activate virtual environment
python3.10 -m venv venv
source venv/bin/activate

# Navigate to backend directory and install dependencies
cd backend/
pip install -r requirements.txt

# Start the backend server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend/

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

After starting both the backend and frontend servers, you can access the application through your web browser.

## Features

- Retrieval Augmented Generation (RAG)
- Integration with Confluence and GitHub repositories
