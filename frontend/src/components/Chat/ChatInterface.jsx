import { useState, useEffect } from 'react';
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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    // Retrieve existing sessionId from sessionStorage or create a new one
    return sessionStorage.getItem('chatSessionId') || 
      `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  });

  // Load messages from sessionStorage on initial render
  useEffect(() => {
    const savedMessages = sessionStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Set default welcome message if no saved messages
      setMessages([
        { id: 1, text: "Hello! How can I help you today?", sender: "ai" }
      ]);
    }
    
    // Save sessionId to sessionStorage
    sessionStorage.setItem('chatSessionId', sessionId);
  }, [sessionId]);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Create a new session
  const startNewSession = () => {
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setSessionId(newSessionId);
    const defaultMessages = [
      { id: 1, text: "Hello! How can I help you today?", sender: "ai" }
    ];
    setMessages(defaultMessages);
    sessionStorage.setItem('chatSessionId', newSessionId);
    sessionStorage.setItem('chatMessages', JSON.stringify(defaultMessages));
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
      const response = await fetch('https://rag-assist.up.railway.app/query/', {
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