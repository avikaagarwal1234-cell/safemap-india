import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProgressBar from './components/UI/ProgressBar';
import ToastContainer from './components/UI/ToastContainer';
import MapPage from './pages/MapPage';
import ReportPage from './pages/ReportPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-dark text-white font-sans">
      <ProgressBar />
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* Add more routes like /dashboard, etc. later */}
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
}

export default App;
