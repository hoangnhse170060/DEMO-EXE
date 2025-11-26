import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import History from './pages/History';
import EventDetail from './pages/EventDetail';
import HistoricalFigures from './pages/HistoricalFigures';
import FigureDetail from './pages/FigureDetail';
import Archives from './pages/Archives';
import ArchiveDetail from './pages/ArchiveDetail';

function App() {
  return (
    <Router>
  <div className="min-h-screen bg-gradient-dark-gold">
        <Sidebar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/event/detail" element={<EventDetail />} />
            <Route path="/culture/historical-figures" element={<HistoricalFigures />} />
            <Route path="/culture/historical-figures/:id" element={<FigureDetail />} />
            <Route path="/culture/archives" element={<Archives />} />
            <Route path="/culture/archives/:id" element={<ArchiveDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
