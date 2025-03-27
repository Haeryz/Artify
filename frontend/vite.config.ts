import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { splitVendorChunkPlugin } from 'vite'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    viteCompression({
      algorithm: 'gzip',
      threshold: 10240, // only compress files larger than 10kb
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      threshold: 10240,
    }),
    process.env.ANALYZE === 'true' && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
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
    // Minify options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    },
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
          ],
          router: [
            'react-router-dom',
          ],
          ui: [
            '@mantine/core',
            '@mantine/hooks',
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
    },
    // Enable source map in development only
    sourcemap: process.env.NODE_ENV === 'development',
  }
})
