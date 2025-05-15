import React, { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import LoadingMessage from './LoadingMessage';

function MessageList({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

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

  return (
    <div className="chat-messages">
      {messages.map(message => (
        <MessageItem key={message.id} message={message} />
      ))}
      {isLoading && <LoadingMessage />}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList; 