import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Import styles of packages that you've installed
import '@mantine/core/styles.css'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core'
import PaddleLoader from './components/PaddleLoader'

// Configure with your Paddle vendor ID
const PADDLE_VENDOR_ID = import.meta.env.VITE_PADDLE_VENDOR_ID || '221415';
const PADDLE_ENVIRONMENT = import.meta.env.PROD ? 'production' : 'sandbox';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <PaddleLoader 
        vendorId={PADDLE_VENDOR_ID} 
        environment={PADDLE_ENVIRONMENT} 
      />
      <App />
    </MantineProvider>
  </StrictMode>,
)
