import { memo } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Authentication from './pages/Authentication'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Refunds from './pages/Refunds'
import Pricing from './pages/Pricing'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'

// Get the base URL for the router (useful for subdirectory deployments)
const getBasename = () => {
  // Check if we're in a production environment and if there's a basename to use
  return import.meta.env.BASE_URL !== '/' ? import.meta.env.BASE_URL : '';
};

// Memoize the App component to prevent unnecessary re-renders
const App = memo(function App() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const AppContent = () => (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
    >
      <AppShell.Header>
        <Navbar 
          toggleMobile={toggleMobile}
          toggleDesktop={toggleDesktop}
          mobileOpened={mobileOpened}
          desktopOpened={desktopOpened}
        />
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/authentication" element={<Authentication />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refunds" element={<Refunds />} />
          <Route path="/pricing" element={<Pricing />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );

  return (
    <Router basename={getBasename()}>
      <AppContent />
    </Router>
  );
});

export default App;
