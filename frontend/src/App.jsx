import { useState } from 'react'
import Sidebar from './components/Sidebar'
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
      </main>
    </div>
  )
}

function ChatInterface() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "ai" }
  ])
  const [input, setInput] = useState("")

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const newUserMessage = { id: messages.length + 1, text: input, sender: "user" }
    
    // Clear input and update messages
    setInput("")
    setMessages([...messages, newUserMessage])
    
    // Simulate AI response (in a real app, you'd call your API here)
    setTimeout(() => {
      const aiResponse = { 
        id: messages.length + 2, 
        text: "I'm your AI assistant. I'm currently in development, but I'll be able to help you with your documents soon!", 
        sender: "ai" 
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  )
}

export default App
