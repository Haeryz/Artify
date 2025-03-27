import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
// Import styles of packages that you've installed
import '@mantine/core/styles.css'
import './theme.css'
import { MantineProvider, LoadingOverlay } from '@mantine/core'

// Lazy load components that aren't needed immediately
const App = lazy(() => import('./App.tsx'))
const PaddleLoader = lazy(() => import('./components/PaddleLoader'))

// Configure with your Paddle vendor ID
const PADDLE_VENDOR_ID = import.meta.env.VITE_PADDLE_VENDOR_ID || '221415';
const PADDLE_ENVIRONMENT = import.meta.env.PROD ? 'production' : 'sandbox';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <Suspense fallback={<LoadingOverlay visible={true} />}>
        <PaddleLoader 
          vendorId={PADDLE_VENDOR_ID} 
          environment={PADDLE_ENVIRONMENT} 
        />
        <App />
      </Suspense>
    </MantineProvider>
  </StrictMode>,
)
