import React, { useState, useEffect, useRef } from 'react';
import './ConfluencePreview.css';

function ConfluencePreview({ pageId, onClose }) {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (pageId) {
      fetchPageContent();
    }
  }, [pageId]);

  useEffect(() => {
    // Process any structured macros that might still exist in the rendered content
    if (contentRef.current && pageContent) {
      processMacrosInDOM();
    }
  }, [pageContent]);

  const fetchPageContent = async () => {
    setLoading(true);
    try {
      // Use the /content endpoint to fetch page content
      const response = await fetch(`https://rag-assist.up.railway.app/ingest/confluence/content?id=${pageId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch page content');
      }

      const data = await response.json();
      setPageContent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Process any structured macros that might be in the DOM after rendering
  const processMacrosInDOM = () => {
    if (!contentRef.current) return;

    // Find all elements that might be structured macros
    const macroElements = contentRef.current.querySelectorAll('[ac\\:name]');
    const structuredMacros = contentRef.current.querySelectorAll('ac\\:structured-macro');
    const allMacros = [...macroElements, ...structuredMacros];

    allMacros.forEach(macro => {
      // Create a pre element to replace the macro
      const pre = document.createElement('pre');
      pre.className = 'confluence-code-block';
      pre.textContent = macro.textContent || '[Code block]';
      
      // Replace the macro with the pre element
      if (macro.parentNode) {
        macro.parentNode.replaceChild(pre, macro);
      }
    });
  };

  if (loading) {
    return (
      <div className="confluence-preview">
        <div className="preview-header">
          <h3>Loading...</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="preview-loading">Loading page content...</div>
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
          <p>Failed to load page content: {error}</p>
          <button className="retry-button" onClick={fetchPageContent}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="confluence-preview">
      <div className="preview-header">
        <h3>{pageContent?.title || 'Page Preview'}</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="preview-content">
        {pageContent ? (
          <div className="page-content" ref={contentRef} dangerouslySetInnerHTML={{ __html: pageContent.html }} />
        ) : (
          <p>No content available</p>
        )}
      </div>
    </div>
  );
}

export default ConfluencePreview;
