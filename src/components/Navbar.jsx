import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200"
         style={{boxShadow:'0 1px 8px rgba(0,0,0,0.06)'}}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg">
          <Shield size={22} className="text-purple-600" />
          SafeMap India
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/map"
                className={`text-sm font-medium transition-colors ${
                  path==='/map' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}>Map</Link>
          <Link to="/about"
                className={`text-sm font-medium transition-colors ${
                  path==='/about' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}>About</Link>
          <Link to="/admin"
                className={`text-sm font-medium transition-colors ${
                  path==='/admin' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}>Admin</Link>
          <Link to="/report"
                className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"/>
            Report Incident
          </Link>
        </div>
      </div>
    </nav>
  );
}
