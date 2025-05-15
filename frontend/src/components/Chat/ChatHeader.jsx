import React from 'react';

const styles = {
  chatHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '8px 15px',
    borderBottom: '1px solid #333',
    backgroundColor: '#1a1a1a',
    marginBottom: '10px'
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

function ChatHeader({ sessionId, startNewSession }) {
  return (
    <div style={styles.chatHeader}>
      <button 
        onClick={startNewSession} 
        style={styles.newSessionButton}>
          Clear Chat
      </button>
    </div>
  );
}

export default ChatHeader; 