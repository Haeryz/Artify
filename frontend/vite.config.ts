import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://artify-huf7baefeeceafff.southeastasia-01.azurewebsites.net',
        // target: 'http://localhost:5000',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://artify-huf7baefeeceafff.southeastasia-01.azurewebsites.net')
    // 'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:5000')
  },
  build: {
    // Increase the warning limit to avoid unnecessary warnings
    chunkSizeWarningLimit: 800,
    
    // Configure output chunking to optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries (node_modules) into separate chunks
          vendor: [
            'react', 
            'react-dom', 
            'react-router-dom',
            '@mantine/core',
            '@mantine/hooks'
          ],
          // UI libraries and icons
          ui: [
            'react-icons'
          ],
          // State management
          state: [
            'zustand'
          ],
          // HTTP client
          http: [
            'axios'
          ]
        }
      }
    }
  }
})
