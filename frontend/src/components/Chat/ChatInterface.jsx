import { useState } from 'react';
import 'highlight.js/styles/github-dark.css';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const styles = {
  chatInterfaceWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  }
};

function ChatInterface() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "ai" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);

  // Create a new session
  const startNewSession = () => {
    setSessionId(`session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
    setMessages([
      { id: 1, text: "Hello! How can I help you today?", sender: "ai" }
    ]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const newUserMessage = { id: messages.length + 1, text: input, sender: "user" };
    
    // Clear input and update messages
    const userQuery = input;
    setInput("");
    setMessages([...messages, newUserMessage]);
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Prepare history for API - take last messages (excluding the one just added)
      // Make sure to only include text and sender fields to avoid any unexpected fields
      const history = messages.map(msg => ({
        text: String(msg.text || ""), // Ensure text is always a string
        sender: msg.sender
      }));
      
      console.log("Sending history:", history);
      
      // Call the query API
      const response = await fetch('http://localhost:8000/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: userQuery,
          history: history
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server error:", errorData);
        throw new Error(`Failed to get response: ${response.status} ${errorData}`);
      }
      
      const data = await response.json();
      
      // Log the response structure to help debug
      console.log('API Response:', data);
      
      // Add AI response
      const aiResponse = { 
        id: messages.length + 2, 
        text: data.answer, 
        sender: "ai",
        sources: data.sources || []
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      // Handle error
      const errorResponse = { 
        id: messages.length + 2, 
        text: "Sorry, I encountered an error while processing your request. Please try again.", 
        sender: "ai" 
      };
      setMessages(prev => [...prev, errorResponse]);
      console.error("Error querying API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.chatInterfaceWrapper}>
      <div className="chat-container">
        <ChatHeader 
          sessionId={sessionId} 
          startNewSession={startNewSession} 
        />
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
        />
        <ChatInput 
          input={input} 
          setInput={setInput} 
          handleSendMessage={handleSendMessage} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}

export default ChatInterface;