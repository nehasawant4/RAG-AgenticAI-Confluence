import React from 'react';
import './LandingPage.css';
import logo from '../../assets/logo.png';

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-hero">
        <a href="https://github.com/nehasawant4/RAG-AgenticAI-Confluence" target="_blank" rel="noopener noreferrer" className="logo-link">
          <img src={logo} alt="RAG Assist Logo" className="hero-logo" />
        </a>
        <h1>Welcome to GitFluence</h1>
        <p className="tagline">An AI that speaks GitHub, Confluence, and your stack.</p>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0,0,256,256">
                <g fill="#ffffff" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{mixBlendMode: "normal"}}>
                  <g transform="scale(5.12,5.12)">
                    <path d="M45.403,25.562c-0.506,-1.89 -1.518,-3.553 -2.906,-4.862c1.134,-2.665 0.963,-5.724 -0.487,-8.237c-1.391,-2.408 -3.636,-4.131 -6.322,-4.851c-1.891,-0.506 -3.839,-0.462 -5.669,0.088c-1.743,-2.318 -4.457,-3.7 -7.372,-3.7c-4.906,0 -9.021,3.416 -10.116,7.991c-0.01,0.001 -0.019,-0.003 -0.029,-0.002c-2.902,0.36 -5.404,2.019 -6.865,4.549c-1.391,2.408 -1.76,5.214 -1.04,7.9c0.507,1.891 1.519,3.556 2.909,4.865c-1.134,2.666 -0.97,5.714 0.484,8.234c1.391,2.408 3.636,4.131 6.322,4.851c0.896,0.24 1.807,0.359 2.711,0.359c1.003,0 1.995,-0.161 2.957,-0.45c1.742,2.322 4.445,3.703 7.373,3.703c4.911,0 9.028,-3.422 10.12,-8.003c2.88,-0.35 5.431,-2.006 6.891,-4.535c1.39,-2.408 1.759,-5.214 1.039,-7.9zM35.17,9.543c2.171,0.581 3.984,1.974 5.107,3.919c1.049,1.817 1.243,4 0.569,5.967c-0.099,-0.062 -0.193,-0.131 -0.294,-0.19l-9.169,-5.294c-0.312,-0.179 -0.698,-0.177 -1.01,0.006l-10.198,6.041l-0.052,-4.607l8.663,-5.001c1.947,-1.124 4.214,-1.421 6.384,-0.841zM29.737,22.195l0.062,5.504l-4.736,2.805l-4.799,-2.699l-0.062,-5.504l4.736,-2.805zM14.235,14.412c0,-4.639 3.774,-8.412 8.412,-8.412c2.109,0 4.092,0.916 5.458,2.488c-0.105,0.056 -0.214,0.103 -0.318,0.163l-9.17,5.294c-0.312,0.181 -0.504,0.517 -0.5,0.877l0.133,11.851l-4.015,-2.258zM6.528,23.921c-0.581,-2.17 -0.282,-4.438 0.841,-6.383c1.06,-1.836 2.823,-3.074 4.884,-3.474c-0.004,0.116 -0.018,0.23 -0.018,0.348v10.588c0,0.361 0.195,0.694 0.51,0.872l10.329,5.81l-3.964,2.348l-8.662,-5.002c-1.946,-1.123 -3.338,-2.936 -3.92,-5.107zM14.83,40.457c-2.171,-0.581 -3.984,-1.974 -5.107,-3.919c-1.053,-1.824 -1.249,-4.001 -0.573,-5.97c0.101,0.063 0.196,0.133 0.299,0.193l9.169,5.294c0.154,0.089 0.327,0.134 0.5,0.134c0.177,0 0.353,-0.047 0.51,-0.14l10.198,-6.041l0.052,4.607l-8.663,5.001c-1.946,1.125 -4.214,1.424 -6.385,0.841zM35.765,35.588c0,4.639 -3.773,8.412 -8.412,8.412c-2.119,0 -4.094,-0.919 -5.459,-2.494c0.105,-0.056 0.216,-0.098 0.32,-0.158l9.17,-5.294c0.312,-0.181 0.504,-0.517 0.5,-0.877l-0.134,-11.85l4.015,2.258zM42.631,32.462c-1.056,1.83 -2.84,3.086 -4.884,3.483c0.004,-0.12 0.018,-0.237 0.018,-0.357v-10.588c0,-0.361 -0.195,-0.694 -0.51,-0.872l-10.329,-5.81l3.964,-2.348l8.662,5.002c1.946,1.123 3.338,2.937 3.92,5.107c0.581,2.17 0.282,4.438 -0.841,6.383z"></path>
                  </g>
                </g>
              </svg>
            </div>
            <h3>AI Chat Interface</h3>
            <p>Interact with an AI assistant that uses your knowledge base to provide contextual responses. Powered by OpenAI and Pinecone.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                <linearGradient id="confluenceGradient1" x1="2" x2="44" y1="34.5" y2="34.5" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#2684ff"></stop>
                  <stop offset=".28" stopColor="#1f7bf6"></stop>
                  <stop offset=".742" stopColor="#0c62dd"></stop>
                  <stop offset=".994" stopColor="#0052cc"></stop>
                </linearGradient>
                <path fill="url(#confluenceGradient1)" d="M3.589,35.049c-0.453,0.738-0.962,1.595-1.394,2.277c-0.387,0.653-0.179,1.495,0.467,1.894	l9.063,5.572c0.655,0.404,1.514,0.201,1.919-0.453c0.004-0.007,0.008-0.013,0.012-0.02c0.363-0.606,0.83-1.393,1.338-2.236	c3.59-5.92,7.201-5.196,13.713-2.089l8.986,4.269c0.695,0.331,1.527,0.036,1.858-0.659c0.006-0.012,0.012-0.025,0.017-0.037	l4.315-9.75c0.305-0.696-0.005-1.508-0.697-1.825c-1.896-0.891-5.668-2.667-9.063-4.304C21.909,21.76,11.529,22.143,3.589,35.049z"></path>
                <linearGradient id="confluenceGradient2" x1="4" x2="46" y1="12.5" y2="12.5" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#0052cc"></stop>
                  <stop offset=".044" stopColor="#0255cf"></stop>
                  <stop offset=".665" stopColor="#1c77f2"></stop>
                  <stop offset="1" stopColor="#2684ff"></stop>
                </linearGradient>
                <path fill="url(#confluenceGradient2)" d="M44.412,11.968c0.453-0.737,0.961-1.593,1.393-2.274c0.387-0.652,0.179-1.494-0.467-1.892	l-9.057-5.564c-0.638-0.429-1.504-0.261-1.934,0.377c-0.018,0.027-0.035,0.054-0.051,0.082c-0.362,0.605-0.829,1.391-1.338,2.233	c-3.588,5.912-7.197,5.189-13.703,2.087l-8.952-4.243c-0.695-0.33-1.526-0.035-1.857,0.658C8.441,3.444,8.435,3.456,8.429,3.469	l-4.312,9.738c-0.305,0.695,0.005,1.506,0.697,1.822c1.895,0.89,5.664,2.664,9.057,4.299C26.104,25.239,36.477,24.843,44.412,11.968	z"></path>
              </svg>
            </div>
            <h3>Confluence Integration</h3>
            <p>Browse and select Confluence documents to add to your knowledge base.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0,0,256,256">
                <g fill="#ffffff" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{mixBlendMode: "normal"}}>
                  <g transform="scale(8.53333,8.53333)">
                    <path d="M15,3c-6.627,0 -12,5.373 -12,12c0,5.623 3.872,10.328 9.092,11.63c-0.056,-0.162 -0.092,-0.35 -0.092,-0.583v-2.051c-0.487,0 -1.303,0 -1.508,0c-0.821,0 -1.551,-0.353 -1.905,-1.009c-0.393,-0.729 -0.461,-1.844 -1.435,-2.526c-0.289,-0.227 -0.069,-0.486 0.264,-0.451c0.615,0.174 1.125,0.596 1.605,1.222c0.478,0.627 0.703,0.769 1.596,0.769c0.433,0 1.081,-0.025 1.691,-0.121c0.328,-0.833 0.895,-1.6 1.588,-1.962c-3.996,-0.411 -5.903,-2.399 -5.903,-5.098c0,-1.162 0.495,-2.286 1.336,-3.233c-0.276,-0.94 -0.623,-2.857 0.106,-3.587c1.798,0 2.885,1.166 3.146,1.481c0.896,-0.307 1.88,-0.481 2.914,-0.481c1.036,0 2.024,0.174 2.922,0.483c0.258,-0.313 1.346,-1.483 3.148,-1.483c0.732,0.731 0.381,2.656 0.102,3.594c0.836,0.945 1.328,2.066 1.328,3.226c0,2.697 -1.904,4.684 -5.894,5.097c1.098,0.573 1.899,2.183 1.899,3.396v2.734c0,0.104 -0.023,0.179 -0.035,0.268c4.676,-1.639 8.035,-6.079 8.035,-11.315c0,-6.627 -5.373,-12 -12,-12z"></path>
                  </g>
                </g>
              </svg>
            </div>
            <h3>GitHub Integration</h3>
            <p>Connect to GitHub repositories, explore file structure, and add code files to your knowledge base.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>File Upload</h3>
            <p>Upload local files (PDF, TXT, CSV, JSON) to include in your knowledge base.</p>
          </div>
        </div>
      </div>

      <div className="how-to-section">
        <h2>How to Use</h2>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Add Your Documents</h3>
              <p>Use the sidebar to connect your Confluence space, GitHub repository, or upload files directly. These documents form your knowledge base.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Process and Index</h3>
              <p>Select the documents you want to work with. They'll be embedded and stored in the vector database for AI-powered retrieval.</p>
            </div>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Chat with AI</h3>
              <p>Head to the Chat tab and ask questions. The AI will respond with contextually accurate answers drawn from your uploaded content.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="tech-section">
        <h2>Tech Stack</h2>
        <div className="tech-details">
          <div className="tech-stack">
            <h4 style={{color: 'white', textAlign: 'center'}}>React · FastAPI · OpenAI API · Pinecone</h4>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="footer-content">
          <p>Developed by: Neha Sawant</p>
          <a href="https://github.com/nehasawant4" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0,0,256,256" className="footer-logo">
              <g fill="#ffffff" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{mixBlendMode: "normal"}}>
                <g transform="scale(8.53333,8.53333)">
                  <path d="M15,3c-6.627,0 -12,5.373 -12,12c0,5.623 3.872,10.328 9.092,11.63c-0.056,-0.162 -0.092,-0.35 -0.092,-0.583v-2.051c-0.487,0 -1.303,0 -1.508,0c-0.821,0 -1.551,-0.353 -1.905,-1.009c-0.393,-0.729 -0.461,-1.844 -1.435,-2.526c-0.289,-0.227 -0.069,-0.486 0.264,-0.451c0.615,0.174 1.125,0.596 1.605,1.222c0.478,0.627 0.703,0.769 1.596,0.769c0.433,0 1.081,-0.025 1.691,-0.121c0.328,-0.833 0.895,-1.6 1.588,-1.962c-3.996,-0.411 -5.903,-2.399 -5.903,-5.098c0,-1.162 0.495,-2.286 1.336,-3.233c-0.276,-0.94 -0.623,-2.857 0.106,-3.587c1.798,0 2.885,1.166 3.146,1.481c0.896,-0.307 1.88,-0.481 2.914,-0.481c1.036,0 2.024,0.174 2.922,0.483c0.258,-0.313 1.346,-1.483 3.148,-1.483c0.732,0.731 0.381,2.656 0.102,3.594c0.836,0.945 1.328,2.066 1.328,3.226c0,2.697 -1.904,4.684 -5.894,5.097c1.098,0.573 1.899,2.183 1.899,3.396v2.734c0,0.104 -0.023,0.179 -0.035,0.268c4.676,-1.639 8.035,-6.079 8.035,-11.315c0,-6.627 -5.373,-12 -12,-12z"></path>
                </g>
              </g>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/nehasawant4/" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="22" height="22" viewBox="0,0,256,256" className="footer-logo">
              <g fill="#ffffff" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{mixBlendMode: "normal"}}>
                <g transform="scale(5.12,5.12)">
                  <path d="M41,4h-32c-2.76,0 -5,2.24 -5,5v32c0,2.76 2.24,5 5,5h32c2.76,0 5,-2.24 5,-5v-32c0,-2.76 -2.24,-5 -5,-5zM17,20v19h-6v-19zM11,14.47c0,-1.4 1.2,-2.47 3,-2.47c1.8,0 2.93,1.07 3,2.47c0,1.4 -1.12,2.53 -3,2.53c-1.8,0 -3,-1.13 -3,-2.53zM39,39h-6c0,0 0,-9.26 0,-10c0,-2 -1,-4 -3.5,-4.04h-0.08c-2.42,0 -3.42,2.06 -3.42,4.04c0,0.91 0,10 0,10h-6v-19h6v2.56c0,0 1.93,-2.56 5.81,-2.56c3.97,0 7.19,2.73 7.19,8.26z"></path>
                </g>
              </g>
            </svg>
          </a>
          <a href="https://nehasawant.vercel.app/" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" className="footer-logo">
              <g fill="#ffffff" className="color000000 svgShape">
                <path d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0-6a2 2 0 1 1-2 2 2 2 0 0 1 2-2zm0 8a7 7 0 0 0-7 7 1 1 0 0 0 2 0 5 5 0 0 1 10 0 1 1 0 0 0 2 0 7 7 0 0 0-7-7z" fill="#ffffff" className="color000000 svgShape"></path>
              </g>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default LandingPage; 