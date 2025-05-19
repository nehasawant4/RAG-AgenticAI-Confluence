import React, { useRef, useEffect, useState } from 'react';

function ChatInput({ input, setInput, handleSendMessage, isLoading, onImageSelect }) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

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
      handleSubmit(e);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      onImageSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Wrapper for handleSendMessage to clear the image after sending
  const handleSubmit = (e) => {
    handleSendMessage(e);
    // Clear the selected image after sending
    setSelectedImage(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="chat-input-container">
      {selectedImage && (
        <div className="selected-image-preview">
          <img 
            src={URL.createObjectURL(selectedImage)} 
            alt="Selected" 
            className="image-preview"
          />
          <button 
            type="button" 
            className="remove-image-button"
            onClick={handleRemoveImage}
          >
            ×
          </button>
        </div>
      )}
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <button 
          type="button" 
          className="attach-button"
          onClick={triggerFileInput}
          disabled={isLoading}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.44 11.05L12.25 20.24C11.1217 21.3683 9.59005 22.0017 8 22.0017C6.40995 22.0017 4.87825 21.3683 3.75 20.24C2.62175 19.1117 1.98835 17.58 1.98835 15.99C1.98835 14.4 2.62175 12.8683 3.75 11.74L12.93 2.55C13.7106 1.76945 14.7631 1.33197 15.86 1.33197C16.9569 1.33197 18.0094 1.76945 18.79 2.55C19.5706 3.33055 20.0081 4.38305 20.0081 5.48C20.0081 6.57695 19.5706 7.62945 18.79 8.41L9.6 17.59C9.21043 17.9793 8.66848 18.1968 8.105 18.1968C7.54152 18.1968 6.99957 17.9793 6.61 17.59C6.22043 17.2005 6.00296 16.6585 6.00296 16.095C6.00296 15.5315 6.22043 14.9896 6.61 14.6L15.79 5.41" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
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
          disabled={isLoading || (!input.trim() && !selectedImage)}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatInput; 