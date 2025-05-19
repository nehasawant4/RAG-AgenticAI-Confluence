import React from 'react';

function Sidebar({ activeTab, setActiveTab, isVisible }) {
  return (
    <aside className={`sidebar ${!isVisible ? 'hidden' : ''}`}>
      <div className="logo" onClick={() => setActiveTab('')}>
        <div className="logo-container">
          <svg className="logo-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0,0,256,256">
            <g fill="#63da95" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{mixBlendMode: "normal"}}>
              <g transform="scale(10.66667,10.66667)">
                <path d="M12,2.09961l-11,9.90039h3v9h7v-6h2v6h7v-9h3zM12,4.79102l6,5.40039v0.80859v8h-3v-6h-6v6h-3v-8.80859z"></path>
              </g>
            </g>
          </svg>

        </div>
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
        <button 
          className={`sidebar-button ${activeTab === 'sources' ? 'active' : ''}`}
          onClick={() => setActiveTab('sources')}
        >
          Vector Database
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar; 