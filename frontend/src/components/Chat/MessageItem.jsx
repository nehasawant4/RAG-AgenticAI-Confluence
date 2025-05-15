import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MessageItem({ message }) {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  return (
    <div className={`message ${message.sender}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\\w+)/.exec(className || '');
            const lang = match?.[1]?.toLowerCase() || 'plaintext';
            const codeContent = String(children).replace(/\n$/, '');
            const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;

            const handleClick = () => {
              navigator.clipboard.writeText(codeContent).then(() => {
                setCopiedCode(codeId);
                setTimeout(() => setCopiedCode(null), 1500);
              });
            };
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
                onClick={() => {
                  navigator.clipboard.writeText(codeContent).then(() => {
                    setCopiedCode(codeId);
                    setTimeout(() => setCopiedCode(null), 1500);
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
          li: ({ children }) => <li style={{ margin: '0.3em 0' }}>{children}</li>,
          h1: ({ children }) => <h1 style={{ margin: '0.8em 0 0.5em', fontSize: '1.5em' }}>{children}</h1>,
          h2: ({ children }) => <h2 style={{ margin: '0.7em 0 0.5em', fontSize: '1.3em' }}>{children}</h2>,
          h3: ({ children }) => <h3 style={{ margin: '0.6em 0 0.5em', fontSize: '1.1em' }}>{children}</h3>,
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
          <p className="sources-title">Sources:</p>
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
