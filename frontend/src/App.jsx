import { useState } from 'react'
import Sidebar from './components/Sidebar'
import UploadFile from './components/Upload/UploadFile'
import ChatInterface from './components/Chat/ChatInterface'
import FetchConfluence from './components/Confluence/FetchConfluence'
import FetchGitHub from './components/GitHub/FetchGitHub'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('chat')
  const [sidebarVisible, setSidebarVisible] = useState(true)

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isVisible={sidebarVisible} 
      />
      <main className={`main-content ${!sidebarVisible ? 'full-width' : ''}`}>
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'confluence' && <FetchConfluence />}
        {activeTab === 'github' && <FetchGitHub />}
        {activeTab === 'upload' && <UploadFile />}
      </main>
    </div>
  )
}

export default App
