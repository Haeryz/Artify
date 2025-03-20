import { memo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Authentication from './pages/Authentication'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Refunds from './pages/Refunds'

// Memoize the App component to prevent unnecessary re-renders
const App = memo(function App() {
  return (
    <Router>
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
