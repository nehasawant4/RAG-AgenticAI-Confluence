import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MessageItem({ message }) {
  const [copiedCode, setCopiedCode] = useState(null);

  return (
    <div className={`message ${message.sender}`}>
      {message.hasImage && message.sender === "user" && message.imageUrl && (
        <div className="message-image-indicator">
          <img 
            src={message.imageUrl} 
            alt="Uploaded" 
            className="message-image"
          />
        </div>
      )}
      
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\\w+)/.exec(className || '');
            const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;

            return !inline && match ? (
              <div className="code-block-container">
                <div className="code-header">
                  <span className="code-language">{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  showLineNumbers
                  wrapLines
                  lineNumberStyle={{
                    color: '#666',
                    minWidth: '2.5em',
                    paddingRight: '1em',
                    userSelect: 'none'
                  }}
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
              <code
                className={className}
                {...props}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  navigator.clipboard.writeText(e.target.innerText).then(() => {
                    setCopiedCode(codeId);
                    setTimeout(() => setCopiedCode(null), 2000);
                  });
                }}
              >
                {children}
              </code>
            );
          },
          p: ({ children }) => <p style={{ margin: '0.5em 0' }}>{children}</p>,
          ul: ({ children }) => <ul style={{ marginLeft: '1.5em' }}>{children}</ul>,
          ol: ({ children }) => <ol style={{ marginLeft: '1.5em' }}>{children}</ol>,
          li: ({ children }) => <li style={{ margin: '0.5em 0' }}>{children}</li>,
          h1: ({ children }) => <h1 style={{ margin: '0.8em 0 0.5em', fontSize: '1.3em' }}>{children}</h1>,
          h2: ({ children }) => <h2 style={{ textAlign: 'left', fontWeight: 'bold', margin: '0.7em 0 0.5em', fontSize: '1.2em', color: '#63da95' }}>{children}</h2>,
          h3: ({ children }) => <h3 style={{ margin: '0.6em 0 0.5em', fontSize: '1em', color: '#63da95' }}>{children}</h3>,
          table: ({ children }) => (
            <div style={{ overflowX: 'auto', margin: '1em 0' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th style={{ padding: '0.5em', borderBottom: '1px solid #555', textAlign: 'left' }}>{children}</th>
          ),
          td: ({ children }) => (
            <td style={{ padding: '0.5em', borderBottom: '1px solid #333' }}>{children}</td>
          )
        }}
      >
        {message.text}
      </ReactMarkdown>

      {message.sources?.length > 0 && (
        <div className="message-sources">
          <h3 className="sources-title" style={{ margin: '0.6em 0 0.5em', fontSize: '1em', color: '#63da95' }}>Sources:</h3>
          <ul>
            {message.sources.map((source, index) => (
              <li key={index}>{source}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MessageItem;
