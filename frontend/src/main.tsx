import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Import styles of packages that you've installed
import '@mantine/core/styles.css'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <App />
    </MantineProvider>
  </StrictMode>,
)
