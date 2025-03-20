import { memo } from 'react'
import Authentication from './pages/Authentication'

// Memoize the App component to prevent unnecessary re-renders
const App = memo(function App() {
  return (
    <Authentication />
  )
})

export default App
