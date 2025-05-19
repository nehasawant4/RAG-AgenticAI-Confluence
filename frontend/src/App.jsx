import { useState } from 'react'
import Sidebar from './components/Sidebar'
import UploadFile from './components/Upload/UploadFile'
import ChatInterface from './components/Chat/ChatInterface'
import FetchConfluence from './components/Confluence/FetchConfluence'
import FetchGitHub from './components/GitHub/FetchGitHub'
import ListSources from './components/Sources/ListSources'
import LandingPage from './components/Landing/LandingPage'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    // Get the active tab from sessionStorage, default to empty string if not found
    return sessionStorage.getItem('activeTab') || ''
  })
  const [sidebarVisible, setSidebarVisible] = useState(true)

  // Update sessionStorage whenever activeTab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    sessionStorage.setItem('activeTab', tab)
  }

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        isVisible={sidebarVisible} 
      />
      <main className={`main-content ${!sidebarVisible ? 'full-width' : ''}`}>
        {activeTab === '' && <LandingPage />}
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'confluence' && <FetchConfluence />}
        {activeTab === 'github' && <FetchGitHub />}
        {activeTab === 'upload' && <UploadFile />}
        {activeTab === 'sources' && <ListSources setActiveTab={handleTabChange} />}
      </main>
    </div>
  )
}

export default App
