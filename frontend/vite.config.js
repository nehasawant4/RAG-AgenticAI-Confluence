import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Disable HTTPS for local development since localhost backend doesn't support it
    https: false,
    // Configure CORS to allow requests from any origin
    cors: true,
    // Proxy API requests to avoid mixed content issues
    proxy: {
      '/api': {
        //target: 'https://rag-assist.up.railway.app',
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false, // Set to false for HTTP targets
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
