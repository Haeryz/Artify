import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://artify-huf7baefeeceafff.southeastasia-01.azurewebsites.net',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://artify-huf7baefeeceafff.southeastasia-01.azurewebsites.net')
  }
})
