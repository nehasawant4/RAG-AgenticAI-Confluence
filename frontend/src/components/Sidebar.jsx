import React from 'react';

function Sidebar({ activeTab, setActiveTab, isVisible }) {
  return (
    <aside className={`sidebar ${!isVisible ? 'hidden' : ''}`}>
      <div className="logo">
        <h2>RAG-AI</h2>
      </div>
      <nav className="sidebar-nav">
        <button 
          className={`sidebar-button ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button 
          className={`sidebar-button ${activeTab === 'confluence' ? 'active' : ''}`}
          onClick={() => setActiveTab('confluence')}
        >
          Fetch Confluence Doc
        </button>
        <button 
          className={`sidebar-button ${activeTab === 'github' ? 'active' : ''}`}
          onClick={() => setActiveTab('github')}
        >
          Fetch GitHub Repo
        </button>
        <button 
          className={`sidebar-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload File
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar; 