import { memo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Authentication from './pages/Authentication'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Refunds from './pages/Refunds'

// Get the base URL for the router (useful for subdirectory deployments)
const getBasename = () => {
  // Check if we're in a production environment and if there's a basename to use
  return import.meta.env.BASE_URL !== '/' ? import.meta.env.BASE_URL : '';
};

// Memoize the App component to prevent unnecessary re-renders
const App = memo(function App() {
  return (
    <Router basename={getBasename()}>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refunds" element={<Refunds />} />
      </Routes>
    </Router>
  )
})

export default App
