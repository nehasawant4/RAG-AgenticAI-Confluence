import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Add CSS styles for the new components
const styles = {
  chatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    borderBottom: '1px solid #333',
    backgroundColor: '#1a1a1a'
  },
  sessionId: {
    fontSize: '0.9rem',
    color: '#888',
    margin: 0
  },
  newSessionButton: {
    backgroundColor: '#4a4a4a',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#5a5a5a'
    }
  }
};

function ChatInterface() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "ai" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Ensure scroll to bottom when page loads
  useEffect(() => {
    scrollToBottom();
  }, []);

  // Copy code to clipboard
  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

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

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Send message with Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="chat-container">
      <div style={styles.chatHeader}>
        <h3 style={styles.sessionId}>Session ID: {sessionId.substring(0, 12)}...</h3>
        <button 
          onClick={startNewSession} 
          style={styles.newSessionButton}>
          Start New Session
        </button>
      </div>
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <ReactMarkdown 
              children={msg.text}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeId = `code-${msg.id}-${Math.random().toString(36).substring(2, 9)}`;
                  return !inline && match ? (
                    <div className="code-block-container">
                      <div className="code-header">
                        <span className="code-language">{match[1]}</span>
                        <button 
                          className="copy-button" 
                          onClick={() => copyToClipboard(String(children).replace(/\n$/, ''), codeId)}
                        >
                          {copiedCode === codeId ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        showLineNumbers={true}
                        wrapLines={true}
                        lineNumberStyle={{ color: '#666', minWidth: '2.5em', paddingRight: '1em', userSelect: 'none' }}
                        customStyle={{ 
                          margin: 0, 
                          padding: '16px',
                          backgroundColor: '#1e1e1e'
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                p({node, children}) {
                  return <p style={{ margin: '0.5em 0' }}>{children}</p>
                },
                ul({node, children}) {
                  return <ul style={{ marginLeft: '1.5em' }}>{children}</ul>
                },
                ol({node, children}) {
                  return <ol style={{ marginLeft: '1.5em' }}>{children}</ol>
                },
                li({node, children}) {
                  return <li style={{ margin: '0.3em 0' }}>{children}</li>
                },
                h1({node, children}) {
                  return <h1 style={{ margin: '0.8em 0 0.5em', fontSize: '1.5em' }}>{children}</h1>
                },
                h2({node, children}) {
                  return <h2 style={{ margin: '0.7em 0 0.5em', fontSize: '1.3em' }}>{children}</h2>
                },
                h3({node, children}) {
                  return <h3 style={{ margin: '0.6em 0 0.5em', fontSize: '1.1em' }}>{children}</h3>
                },
                table({node, children}) {
                  return (
                    <div style={{ overflowX: 'auto', margin: '1em 0' }}>
                      <table style={{ borderCollapse: 'collapse', width: '100%' }}>{children}</table>
                    </div>
                  )
                },
                th({node, children}) {
                  return <th style={{ padding: '0.5em', borderBottom: '1px solid #555', textAlign: 'left' }}>{children}</th>
                },
                td({node, children}) {
                  return <td style={{ padding: '0.5em', borderBottom: '1px solid #333' }}>{children}</td>
                }
              }}
            />
            {msg.sources && msg.sources.length > 0 && (
              <div className="message-sources">
                <p className="sources-title">Sources:</p>
                <ul>
                  {msg.sources.map((source, index) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="message ai loading">
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
          className="chat-input"
          disabled={isLoading}
          rows={1}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatInterface;