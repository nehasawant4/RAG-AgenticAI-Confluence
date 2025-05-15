import React, { useRef, useEffect } from 'react';

function ChatInput({ input, setInput, handleSendMessage, isLoading }) {
  const textareaRef = useRef(null);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Send message with Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
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
  );
}

export default ChatInput; 