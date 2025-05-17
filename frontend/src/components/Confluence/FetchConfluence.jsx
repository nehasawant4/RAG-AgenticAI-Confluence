import React, { useState, useEffect } from 'react';
import ConfluencePreview from './ConfluencePreview';
import './FetchConfluence.css';

function FetchConfluence() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [selectedPageTitle, setSelectedPageTitle] = useState(null);
  const [selectedPages, setSelectedPages] = useState({});
  const [ingesting, setIngesting] = useState(false);
  const [ingestResults, setIngestResults] = useState({});

  useEffect(() => {
    fetchConfluencePages();
  }, []);

  const fetchConfluencePages = async (spaceKey = null) => {
    setLoading(true);
    try {
      let url = 'https://rag-assist.up.railway.app/ingest/confluence/list';
      if (spaceKey) {
        url += `?space_key=${spaceKey}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch Confluence pages');
      }
      
      const data = await response.json();
      
      // Organize pages into a tree structure
      const organizedData = organizeIntoTree(data.pages);
      setSpaces(organizedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const organizeIntoTree = (pages) => {
    const rootItems = [];
    const childrenMap = {};

    // First, identify root pages (no ancestors)
    pages.forEach(page => {
      if (!page.ancestors || page.ancestors.length === 0) {
        rootItems.push({
          id: page.id,
          title: page.title,
          children: []
        });
      } else {
        // For pages with ancestors, store them by parent title
        const parentTitle = page.ancestors[page.ancestors.length - 1];
        if (!childrenMap[parentTitle]) {
          childrenMap[parentTitle] = [];
        }
        childrenMap[parentTitle].push({
          id: page.id,
          title: page.title,
          children: []
        });
      }
    });

    // Recursively add children to their parents
    const addChildrenToParent = (item) => {
      if (childrenMap[item.title]) {
        item.children = childrenMap[item.title];
        item.children.forEach(child => addChildrenToParent(child));
      }
      return item;
    };

    // Apply the function to all root items
    return rootItems.map(item => addChildrenToParent(item));
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handlePageClick = async (pageId, pageTitle) => {
    setSelectedPageId(pageId);
    setSelectedPageTitle(pageTitle);
  };

  const closePreview = () => {
    setSelectedPageId(null);
    setSelectedPageTitle(null);
  };

  const handleCheckboxChange = (item) => {
    const newSelectedPages = { ...selectedPages };
    const isCurrentlySelected = !!newSelectedPages[item.id];
    
    // Toggle the current item
    if (isCurrentlySelected) {
      delete newSelectedPages[item.id];
    } else {
      newSelectedPages[item.id] = true;
    }
    
    // If item has children and is being selected, select all children
    if (!isCurrentlySelected && item.children && item.children.length > 0) {
      const selectAllChildren = (children) => {
        children.forEach(child => {
          newSelectedPages[child.id] = true;
          if (child.children && child.children.length > 0) {
            selectAllChildren(child.children);
          }
        });
      };
      selectAllChildren(item.children);
    }
    
    // If item has children and is being deselected, deselect all children
    if (isCurrentlySelected && item.children && item.children.length > 0) {
      const deselectAllChildren = (children) => {
        children.forEach(child => {
          delete newSelectedPages[child.id];
          if (child.children && child.children.length > 0) {
            deselectAllChildren(child.children);
          }
        });
      };
      deselectAllChildren(item.children);
    }
    
    setSelectedPages(newSelectedPages);
  };

  // Find page titles for selected pages
  const getSelectedPageTitles = () => {
    const selectedIds = Object.keys(selectedPages);
    const titles = {};
    
    const findTitles = (items) => {
      items.forEach(item => {
        if (selectedPages[item.id]) {
          titles[item.id] = item.title;
        }
        if (item.children && item.children.length > 0) {
          findTitles(item.children);
        }
      });
    };
    
    findTitles(spaces);
    return titles;
  };


  const handleAddToPinecone = async () => {
    const selectedIds = Object.keys(selectedPages);
    if (selectedIds.length === 0) return;
    
    setIngesting(true);
    const results = {};
    
    try {
      // Process each selected page one by one
      for (const pageId of selectedIds) {
        try {
          const response = await fetch(`https://rag-assist.up.railway.app/ingest/confluence/embed?id=${pageId}`, {
            method: 'POST',
          });
          
          if (!response.ok) {
            throw new Error(`Failed to ingest page ${pageId}`);
          }
          
          const result = await response.json();
          results[pageId] = { success: true, message: result.message };
        } catch (err) {
          results[pageId] = { success: false, error: err.message };
        }
      }
      
      setIngestResults(results);
      
      // Show success message or handle errors
      const successCount = Object.values(results).filter(r => r.success).length;
      alert(`Successfully added ${successCount} out of ${selectedIds.length} pages to the vector database.`);
      
    } catch (err) {
      setError(`Error ingesting pages: ${err.message}`);
    } finally {
      setIngesting(false);
    }
  };

  const renderTree = (items) => {
    return (
      <ul className="confluence-tree">
        {items.map(item => (
          <li key={item.id}>
            <div className="tree-item">
              {item.children && item.children.length > 0 ? (
                <span 
                  className={`expand-icon ${expandedItems[item.id] ? 'expanded' : ''}`}
                  onClick={() => toggleExpand(item.id)}
                >
                  {expandedItems[item.id] ? '▼' : '►'}
                </span>
              ) : (
                <span className="no-children-icon"></span>
              )}
              <span 
                className="page-title"
                onClick={() => handlePageClick(item.id, item.title)}
              >
                {item.title}
              </span>
              <input
                type="checkbox"
                className="page-checkbox"
                checked={!!selectedPages[item.id]}
                onChange={() => handleCheckboxChange(item)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {item.children && item.children.length > 0 && expandedItems[item.id] && (
              renderTree(item.children)
            )}
          </li>
        ))}
      </ul>
    );
  };

  if (loading && spaces.length === 0) {
    return <div className="confluence-container">Loading Confluence spaces...</div>;
  }

  if (error) {
    return <div className="confluence-container error">Error: {error}</div>;
  }

  const selectedCount = Object.keys(selectedPages).length;
  const selectedPageTitles = getSelectedPageTitles();

  return (
    <div className="confluence-layout">
      <div className="confluence-container">
        <h2>Confluence Documents</h2>
        {spaces.length === 0 ? (
          <p>No Confluence pages found.</p>
        ) : (
          <div className="confluence-explorer">
            {renderTree(spaces)}
            
            <div className="selected-pages-actions">
              <p className="page-title">
                {selectedCount} page{selectedCount !== 1 ? 's' : ''} selected
              </p>
              
              {selectedCount > 0 && (
                <div className="selected-pages-list">
                  <h4>Selected Pages:</h4>
                  <ul>
                    {Object.entries(selectedPageTitles).map(([id, title]) => (
                      <li key={id}>{title}</li>
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
                      onClick={() => setSelectedPages({})}
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
      
      {selectedPageId && (
        <div className="confluence-preview-container">
          <ConfluencePreview 
            pageId={selectedPageId} 
            onClose={closePreview}
          />
        </div>
      )}
    </div>
  );
}

export default FetchConfluence;
