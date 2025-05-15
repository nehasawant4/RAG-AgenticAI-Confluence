import { useState, useEffect } from 'react';

function UploadFile() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('namespace', 'default');

      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to upload file');
      }

      setMessage(data.message || 'File uploaded successfully');
      setFile(null);
      // Reset the file input
      e.target.reset();
    } catch (err) {
      setError(err.message || 'An error occurred during upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload File</h2>
      <p>Upload a text file to be processed and embedded in the vector database.</p>
      
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="file-input-container">
          <label 
            htmlFor="file-upload" 
            className={`file-input-label ${loading ? 'disabled' : ''}`}
          >
            {file ? file.name : 'Choose a file'}
          </label>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            className="file-input"
            accept=".txt,.md,.csv,.json"
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="upload-button"
          disabled={loading || !file}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default UploadFile; 