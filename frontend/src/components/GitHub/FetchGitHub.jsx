import React, { useState } from 'react';
import './FetchGitHub.css';
import GitHubPreview from './GitHubPreview';

function FetchGitHub() {
  const [repoUrl, setRepoUrl] = useState('https://github.com/nehasawant4/RAG-AgenticAI-Confluence');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileTree, setFileTree] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [ingesting, setIngesting] = useState(false);
  const [ingestResults, setIngestResults] = useState({});
  const [previewFile, setPreviewFile] = useState(null);

  const fetchGitHubRepo = async () => {
    if (!repoUrl) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/ingest/github?repo_url=${encodeURIComponent(repoUrl)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch GitHub repository');
      }
      
      const data = await response.json();
      setFileTree(data.files);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (path) => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleCheckboxChange = (item) => {
    const newSelectedFiles = { ...selectedFiles };
    
    if (newSelectedFiles[item.path]) {
      delete newSelectedFiles[item.path];
    } else {
      newSelectedFiles[item.path] = {
        path: item.path,
        type: item.type,
        download_url: item.download_url
      };
    }
    
    // If it's a folder being selected, select all children
    if (item.type === 'folder' && !selectedFiles[item.path]) {
      const selectAllChildren = (children) => {
        children.forEach(child => {
          newSelectedFiles[child.path] = {
            path: child.path,
            type: child.type,
            download_url: child.download_url
          };
          
          if (child.type === 'folder' && child.children) {
            selectAllChildren(child.children);
          }
        });
      };
      
      if (item.children) {
        selectAllChildren(item.children);
      }
    }
    
    // If it's a folder being deselected, deselect all children
    if (item.type === 'folder' && selectedFiles[item.path]) {
      const deselectAllChildren = (children) => {
        children.forEach(child => {
          delete newSelectedFiles[child.path];
          
          if (child.type === 'folder' && child.children) {
            deselectAllChildren(child.children);
          }
        });
      };
      
      if (item.children) {
        deselectAllChildren(item.children);
      }
    }
    
    setSelectedFiles(newSelectedFiles);
  };

  const handleAddToPinecone = async () => {
    const selectedFilePaths = Object.keys(selectedFiles)
      .filter(path => selectedFiles[path].type === 'file');
    
    if (selectedFilePaths.length === 0) {
      setError('Please select at least one file to add to the vector database');
      return;
    }
    
    setIngesting(true);
    const results = {};
    
    try {
      // Process each selected file one by one
      for (const filePath of selectedFilePaths) {
        const fileInfo = selectedFiles[filePath];
        
        try {
          const response = await fetch(
            `http://localhost:8000/ingest/github/embed?file_url=${encodeURIComponent(fileInfo.download_url)}&file_path=${encodeURIComponent(fileInfo.path)}`, 
            { method: 'POST' }
          );
          
          if (!response.ok) {
            throw new Error(`Failed to ingest file ${fileInfo.path}`);
          }
          
          const result = await response.json();
          results[filePath] = { success: true, message: result.message };
        } catch (err) {
          results[filePath] = { success: false, error: err.message };
        }
      }
      
      setIngestResults(results);
      
      // Show success message or handle errors
      const successCount = Object.values(results).filter(r => r.success).length;
      alert(`Successfully added ${successCount} out of ${selectedFilePaths.length} files to the vector database.`);
      
    } catch (err) {
      setError(`Error ingesting files: ${err.message}`);
    } finally {
      setIngesting(false);
    }
  };

  const handlePreviewFile = (item) => {
    if (item.type === 'file') {
      setPreviewFile({
        path: item.path,
        download_url: item.download_url
      });
    }
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  const renderFileTree = (items) => {
    return (
      <ul className="confluence-tree">
        {items.map(item => (
          <li key={item.path}>
            <div className="tree-item">
              {item.type === 'folder' ? (
                <span 
                  className={`expand-icon ${expandedItems[item.path] ? 'expanded' : ''}`}
                  onClick={() => toggleExpand(item.path)}
                >
                  {expandedItems[item.path] ? '▼' : '►'}
                </span>
              ) : (
                <span></span>
              )}
              <span 
                className="page-title"
                onClick={() => item.type === 'file' ? handlePreviewFile(item) : toggleExpand(item.path)}
              >
                {item.path.split('/').pop()}
              </span>
              <input
                type="checkbox"
                className="page-checkbox"
                checked={!!selectedFiles[item.path]}
                onChange={() => handleCheckboxChange(item)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {item.type === 'folder' && item.children && expandedItems[item.path] && (
              renderFileTree(item.children)
            )}
          </li>
        ))}
      </ul>
    );
  };

  const selectedCount = Object.keys(selectedFiles)
    .filter(path => selectedFiles[path].type === 'file')
    .length;

  return (
    <div className="confluence-layout">
      <div className="confluence-container">
        <h2>GitHub Repository Files</h2>
        
        <div className="repo-input">
          <input 
            type="text" 
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="Enter GitHub repository URL (e.g., https://github.com/username/repo)"
            className="repo-url-input"
          />
          <button 
            onClick={fetchGitHubRepo}
            disabled={loading}
            className="send-button"
          >
            {loading ? 'Fetching...' : 'Fetch'}
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {loading && <div className="loading">Loading repository files...</div>}
        
        {fileTree.length > 0 && (
          <div className="confluence-explorer">
            {renderFileTree(fileTree)}
            
            <div className="selected-pages-actions">
              <p className="page-title">
                {selectedCount} file{selectedCount !== 1 ? 's' : ''} selected
              </p>
              
              {selectedCount > 0 && (
                <div className="selected-pages-list">
                  <h4>Selected Files:</h4>
                  <ul>
                    {Object.entries(selectedFiles)
                      .filter(([_, file]) => file.type === 'file')
                      .map(([path, file]) => (
                        <li key={path} onClick={() => handlePreviewFile(file)} className="preview-link">
                          {file.path}
                        </li>
                      ))}
                  </ul>
                  <div className="selected-pages-buttons">
                    <button 
                      className="send-button" 
                      onClick={handleAddToPinecone}
                      disabled={ingesting}
                    >
                      {ingesting ? 'Adding...' : 'Add to Vector DB'}
                    </button>
                    <button 
                      className="clear-button"
                      onClick={() => setSelectedFiles({})}
                      disabled={ingesting}
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
        {previewFile && (
          <div className="confluence-preview-container">
            <GitHubPreview 
              downloadUrl={previewFile.download_url}
              filePath={previewFile.path}
              onClose={closePreview}
            />
          </div>
        )}
    </div>
  );
}

export default FetchGitHub; 