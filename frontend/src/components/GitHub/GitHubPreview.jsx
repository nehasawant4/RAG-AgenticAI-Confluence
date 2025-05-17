import React, { useState, useEffect } from 'react';
import './GitHubPreview.css';

function GitHubPreview({ downloadUrl, filePath, onClose }) {
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (downloadUrl) {
      fetchFileContent();
    }
  }, [downloadUrl]);

  const fetchFileContent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/ingest/github/fetch-file-content?download_url=${encodeURIComponent(downloadUrl)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch file content');
      }

      const data = await response.json();
      setFileContent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="confluence-preview">
        <div className="preview-header">
          <h3>Loading...</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="preview-loading">Loading file content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="confluence-preview">
        <div className="preview-header">
          <h3>Error</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="preview-error">
          <p>Failed to load file content: {error}</p>
          <button className="retry-button" onClick={fetchFileContent}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="confluence-preview">
      <div className="preview-header">
        <h3>{filePath || 'File Preview'}</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="preview-content">
        {fileContent ? (
          <pre className="file-content">{fileContent.content}</pre>
        ) : (
          <p>No content available</p>
        )}
      </div>
    </div>
  );
}

export default GitHubPreview; 