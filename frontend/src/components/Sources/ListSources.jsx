import React, { useState, useEffect } from 'react';
import './ListSources.css';

function ListSources({ setActiveTab }) {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSources, setSelectedSources] = useState({});
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deleteResult, setDeleteResult] = useState(null);

  useEffect(() => {
    fetchSources();
  }, []);

  // Effect to clear success message after 3 seconds
  useEffect(() => {
    let timer;
    if (deleteResult && deleteResult.success) {
      timer = setTimeout(() => {
        setDeleteResult(null);
        fetchSources(); // Refresh sources after clearing message
      }, 4000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [deleteResult]);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/delete/sources`);
      if (!response.ok) {
        throw new Error('Failed to fetch sources');
      }
      
      const data = await response.json();
      setSources(data.sources || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (source) => {
    setSelectedSources(prev => ({
      ...prev,
      [source]: !prev[source]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = sources.every(source => selectedSources[source]);
    
    if (allSelected) {
      // If all are selected, deselect all
      setSelectedSources({});
    } else {
      // Otherwise, select all
      const newSelected = {};
      sources.forEach(source => {
        newSelected[source] = true;
      });
      setSelectedSources(newSelected);
    }
  };

  const handleDeleteSelected = async () => {
    const sourcesToDelete = Object.keys(selectedSources).filter(source => selectedSources[source]);
    
    if (sourcesToDelete.length === 0) return;
    
    setDeleteInProgress(true);
    setDeleteResult(null);
    
    try {
      // Process each selected source one by one
      let successCount = 0;
      let failCount = 0;
      
      for (const source of sourcesToDelete) {
        try {
          const response = await fetch(`/api/delete/by-source?source=${encodeURIComponent(source)}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            failCount++;
            continue;
          }
          
          successCount++;
        } catch (err) {
          failCount++;
        }
      }
      
      // Set result message
      setDeleteResult({
        success: failCount === 0,
        message: `Successfully deleted ${successCount} source${successCount !== 1 ? 's' : ''}${failCount > 0 ? `, failed to delete ${failCount} source${failCount !== 1 ? 's' : ''}` : ''}.`
      });
      
      // Clear selections
      setSelectedSources({});
      
    } catch (err) {
      setDeleteResult({
        success: false,
        message: `Error: ${err.message}`
      });
    } finally {
      setDeleteInProgress(false);
    }
  };

  const selectedCount = Object.values(selectedSources).filter(Boolean).length;

  if (loading && sources.length === 0) {
    return <div className="sources-container">Loading sources...</div>;
  }

  if (error) {
    return <div className="sources-container error">Error: {error}</div>;
  }

  return (
    <div className="sources-layout">
      <div className="sources-container">
        <h2>Vector Database Files</h2>
        
        {sources.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">No vectors stored in the database.</p>
            <p className="empty-submessage">Upload a file or fetch documents to add vectors to the database.</p>
            <div className="empty-actions">
              <button 
                className="send-button"
                onClick={() => setActiveTab('upload')}
              >
                Upload File
              </button>
              <button 
                className="send-button"
                onClick={() => setActiveTab('confluence')}
              >
                Fetch Confluence Docs
              </button>
              <button 
                className="send-button"
                onClick={() => setActiveTab('github')}
              >
                Fetch GitHub Repo
              </button>
            </div>
          </div>
        ) : (
          <div className="sources-list">
            <div className="list-header">
              <button 
                className="clear-button"
                onClick={handleSelectAll}
              >
                {sources.every(source => selectedSources[source]) ? 'Deselect All' : 'Select All'}
              </button>
              {selectedCount > 0 && (
                <button 
                  className="send-button" 
                  onClick={handleDeleteSelected}
                  disabled={deleteInProgress}
                >
                  {deleteInProgress ? 'Deleting...' : `Delete Selected (${selectedCount})`}
                </button>
              )}
            </div>
            
            <ul className="sources-items">
              {sources.map((source, index) => (
                <li key={index} className="tree-item">
                  <label className="source-checkbox-label">
                  <span className="page-title">{source}</span>
                    <input
                      type="checkbox"
                      checked={!!selectedSources[source]}
                      onChange={() => handleCheckboxChange(source)}
                      className="page-checkbox"
                    />
                  </label>
                </li>
              ))}
            </ul>
            
            {deleteResult && (
              <div className={`${deleteResult.success ? 'success-message' : 'error-message'}`}>
                {deleteResult.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListSources; 