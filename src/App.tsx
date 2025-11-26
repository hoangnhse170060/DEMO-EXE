import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import History from './pages/History';
import EventDetail from './pages/EventDetail';
import HistoricalFigures from './pages/HistoricalFigures';
import FigureDetail from './pages/FigureDetail';
import Archives from './pages/Archives';
import ArchiveDetail from './pages/ArchiveDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Services from './pages/Services';
import Contact from './pages/Contact';

// Layout component to conditionally show Sidebar/Footer
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<History />} />
        <Route path="/event/detail" element={<EventDetail />} />
        <Route path="/culture/historical-figures" element={<HistoricalFigures />} />
        <Route path="/culture/historical-figures/:id" element={<FigureDetail />} />
        <Route path="/culture/archives" element={<Archives />} />
        <Route path="/culture/archives/:id" element={<ArchiveDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-dark-gold">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
