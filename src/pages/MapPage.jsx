import React, { useState } from 'react';
import SafetyMap from '../components/Map/SafetyMap';
import { useIncidents } from '../hooks/useIncidents';
import { useAlerts } from '../hooks/useAlerts';
import { showToast } from '../components/UI/ToastContainer';

// Helper functions for incident display
function getIncidentEmoji(type) {
  const map = {
    harassment: '■',
    stalking: '■■',
    assault: '■',
    cyber: '■',
    unsafe: '■',
    theft: '■',
    other: '■■'
  };
  return map[type?.toLowerCase()] || '■■';
}

function getBadgeColor(type) {
  const map = {
    harassment: 'bg-red-100 text-red-600',
    stalking: 'bg-orange-100 text-orange-600',
    assault: 'bg-rose-100 text-rose-700',
    cyber: 'bg-blue-100 text-blue-600',
    unsafe: 'bg-yellow-100 text-yellow-700',
    theft: 'bg-amber-100 text-amber-700',
    other: 'bg-gray-100 text-gray-600'
  };
  return map[type?.toLowerCase()] || 'bg-gray-100 text-gray-600';
}

function formatTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} min ago`;
  return 'Just now';
}

// Incident Feed Item Component
const IncidentFeedItem = ({ incident }) => {
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors">
      {/* Colored icon circle */}
      <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm ${getBadgeColor(incident.incident_type)}`}>
        {getIncidentEmoji(incident.incident_type)}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900 text-sm capitalize">
            {incident.incident_type}
          </span>
          {incident.verified && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Verified</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{incident.city}</p>
        <p className="text-xs text-gray-400">{formatTimeAgo(incident.created_at)}</p>
      </div>
    </div>
  );
};

const MapPage = () => {
  const { incidents, loading } = useIncidents();
  const [tab, setTab] = useState('live');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Use alerts hook for cluster detection
  useAlerts((message) => {
    showToast(message, 'alert');
  });

  // Filter incidents based on active filter
  const filteredIncidents = incidents.filter(incident => 
    activeFilter === 'all' || incident.incident_type?.toLowerCase() === activeFilter
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Clean white header bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Safety Map</h1>
          <p className="text-xs text-gray-500">Live incidents + NCRB historical data</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
            LIVE
          </div>
          <span className="text-xs text-gray-400">Updated just now</span>
        </div>
      </div>

      {/* Map container with panels */}
      <div className="relative h-[calc(100vh-64px)]">
        {/* Filter Panel */}
        <div className="absolute top-3 left-3 z-20 bg-white border border-gray-200 rounded-xl shadow-md p-3 w-56">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Filter Incidents
          </p>
          
          {/* Type filter buttons */}
          <div className="flex flex-wrap gap-1 mb-3">
            {['All', 'Harassment', 'Stalking', 'Assault', 'Cyber', 'Unsafe', 'Theft'].map(type => (
              <button 
                key={type} 
                onClick={() => setActiveFilter(type.toLowerCase())}
                className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                  activeFilter === type.toLowerCase()
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          {/* Incident counter */}
          <div className="text-xs text-gray-500 border-t border-gray-100 pt-2">
            <span className="font-semibold text-purple-600">{filteredIncidents.length}</span> incidents in view
          </div>
        </div>

        {/* Live Reports Feed Panel */}
        <div className="absolute top-0 right-0 h-full w-72 bg-white border-l border-gray-200 flex flex-col z-10 shadow-lg" style={{overflow:'hidden'}}>
          {/* Panel header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
              <span className="font-semibold text-gray-900 text-sm">Live Reports Feed</span>
            </div>
            
            {/* Tab buttons */}
            <div className="flex gap-2">
              <button 
                onClick={() => setTab('live')}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                  tab === 'live'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Live Reports
              </button>
              <button 
                onClick={() => setTab('ncrb')}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                  tab === 'ncrb'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                NCRB Historical
              </button>
            </div>
          </div>
          
          {/* Scrollable feed */}
          <div className="flex-1 overflow-y-auto">
            {tab === 'live' && filteredIncidents.map(incident => (
              <IncidentFeedItem key={incident.id} incident={incident} />
            ))}
            {tab === 'ncrb' && (
              <div className="p-4 text-center text-gray-500 text-sm">
                NCRB historical data coming soon...
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="w-full h-full">
          <SafetyMap 
            incidents={filteredIncidents}
            center={[22.9734, 78.6569]}
            zoom={5}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
