import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-purple-primary shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-8 w-8 text-white" />
            <span className="font-bold text-2xl tracking-tight text-white">SafeMap India</span>
          </div>
          <nav className="flex space-x-4">
            <Link to="/" className="text-white hover:text-purple-light transition-colors font-medium px-3 py-2 rounded-md">Map</Link>
            <Link to="/report" className="relative bg-purple-light hover:bg-white hover:text-purple-primary text-white font-bold px-4 py-2 rounded-md transition-colors shadow-sm">
              Report Incident
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse-dot"></span>
            </Link>
            <Link to="/about" className="text-white hover:text-purple-light transition-colors font-medium px-3 py-2 rounded-md">About</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
