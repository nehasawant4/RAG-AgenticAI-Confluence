import { useState } from 'react'
import Sidebar from './components/Sidebar'
import UploadFile from './components/UploadFile'
import ChatInterface from './components/ChatInterface'
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
        {activeTab === 'confluence' && <div className="placeholder-content">Confluence Integration Coming Soon</div>}
        {activeTab === 'github' && <div className="placeholder-content">GitHub Integration Coming Soon</div>}
        {activeTab === 'upload' && <UploadFile />}
      </main>
    </div>
  )
}

export default App
