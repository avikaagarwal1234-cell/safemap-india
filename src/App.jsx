import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import ReportPage from './pages/ReportPage';
import Navbar from './components/Navbar';
import ToastContainer from './components/UI/ToastContainer';

function App() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/report" element={<ReportPage />} />
          {/* Add more routes like /dashboard, etc. later */}
        </Routes>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
