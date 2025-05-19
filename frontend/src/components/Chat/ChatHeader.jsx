import React from 'react';
import './Chat.css';
function ChatHeader({ sessionId, startNewSession }) {
  return (
    <div className="chat-header">
      <button 
        className="clear-button"
        onClick={startNewSession}>
          Clear Chat
      </button>
    </div>
  );
}

export default ChatHeader; 