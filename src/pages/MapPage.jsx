import { useState, useEffect } from 'react';
import L from 'leaflet';
import SkeletonLoader from '../components/UI/SkeletonLoader';
import EmptyState from '../components/UI/EmptyState';
import { useIncidents } from '../hooks/useIncidents';
import LiveIndicator from '../components/UI/LiveIndicator';
import RecentActivity from '../components/UI/RecentActivity';
import SafetyMap from '../components/Map/SafetyMap';

// Fix for default marker icon in leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapPage = () => {
  // Center map roughly over central India
  const indiaCenter = [22.9734, 78.6569];
  const [hasError, setHasError] = useState(false);
  
  // Use real-time incidents hook
  const { 
    incidents, 
    recentActivity, 
    loading, 
    error, 
    lastUpdated,
    getLastUpdatedTimeAgo,
    getTimeAgo 
  } = useIncidents();

  useEffect(() => {
    // Handle errors from the useIncidents hook
    if (error) {
      setHasError(true);
    }
  }, [error]);

  const handleRetry = () => {
    setHasError(false);
    window.location.reload(); // Simple retry by reloading
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center relative p-6">
        <div className="w-full text-center mb-6">
          <h1 className="text-4xl font-extrabold text-white mb-2 shadow-sm">Real-time Safety Map</h1>
          <p className="text-purple-light text-lg">Anonymous incident reporting and awareness across India.</p>
        </div>
        <div className="w-full max-w-6xl h-[60vh] rounded-xl overflow-hidden shadow-2xl border-4 border-purple-primary flex-grow">
          <SkeletonLoader type="map" />
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center relative p-6">
        <div className="w-full text-center mb-6">
          <h1 className="text-4xl font-extrabold text-white mb-2 shadow-sm">Real-time Safety Map</h1>
          <p className="text-purple-light text-lg">Anonymous incident reporting and awareness across India.</p>
        </div>
        <div className="w-full max-w-6xl h-[60vh] rounded-xl overflow-hidden shadow-2xl border-4 border-purple-primary flex-grow">
          <EmptyState type="error" onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  if (incidents.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center relative p-6">
        <div className="w-full text-center mb-6">
          <h1 className="text-4xl font-extrabold text-white mb-2 shadow-sm">Real-time Safety Map</h1>
          <p className="text-purple-light text-lg">Anonymous incident reporting and awareness across India.</p>
        </div>
        <div className="w-full max-w-6xl h-[60vh] rounded-xl overflow-hidden shadow-2xl border-4 border-purple-primary flex-grow">
          <EmptyState type="map" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative p-4 sm:p-6">
      <div className="w-full text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 shadow-sm">Real-time Safety Map</h1>
        <p className="text-purple-light text-sm sm:text-base md:text-lg">Anonymous incident reporting and awareness across India.</p>
      </div>
      
      <div className="w-full max-w-full sm:max-w-6xl h-[50vh] sm:h-[60vh] md:h-[70vh] rounded-xl overflow-hidden shadow-2xl border-4 border-purple-primary flex-grow relative">
        {/* Live Indicator */}
        <LiveIndicator 
          lastUpdated={lastUpdated} 
          incidentCount={incidents.length} 
        />
        
        {/* Recent Activity Panel */}
        <RecentActivity 
          recentActivity={recentActivity} 
          getTimeAgo={getTimeAgo} 
        />
        
        {/* SafetyMap with NCRB layer integration */}
        <SafetyMap 
          incidents={incidents}
          center={indiaCenter}
          zoom={5}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default MapPage;
