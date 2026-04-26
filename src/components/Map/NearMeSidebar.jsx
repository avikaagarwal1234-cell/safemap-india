import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Shield, AlertCircle, X } from 'lucide-react';

const NearMeSidebar = ({ userLocation, incidents, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [nearbyIncidents, setNearbyIncidents] = useState([]);
  const [safetyScore, setSafetyScore] = useState({ level: 'safe', count: 0, label: 'Safe' });

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in meters
  };

  // Calculate safety score based on nearby incidents
  const calculateSafetyScore = (incidentsNearby) => {
    const count = incidentsNearby.length;
    let level, label, color;

    if (count === 0) {
      level = 'safe';
      label = 'Safe';
      color = 'green';
    } else if (count <= 2) {
      level = 'low-risk';
      label = 'Low Risk';
      color = 'yellow-green';
    } else if (count <= 5) {
      level = 'moderate-risk';
      label = 'Moderate Risk';
      color = 'yellow';
    } else if (count <= 10) {
      level = 'high-risk';
      label = 'High Risk';
      color = 'orange';
    } else {
      level = 'very-high-risk';
      label = 'Very High Risk';
      color = 'red';
    }

    return { level, count, label, color };
  };

  // Filter incidents within 500m of user location
  useEffect(() => {
    if (!userLocation || !incidents.length) return;

    const nearby = incidents
      .map(incident => {
        const distance = calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          incident.latitude || incident.position?.[0], 
          incident.longitude || incident.position?.[1]
        );
        return { ...incident, distance };
      })
      .filter(incident => incident.distance <= 500)
      .sort((a, b) => a.distance - b.distance);

    setNearbyIncidents(nearby);
    setSafetyScore(calculateSafetyScore(nearby));
  }, [userLocation, incidents]);

  // Get incident icon and color
  const getIncidentData = (type) => {
    const incidentTypes = {
      harassment: { icon: '🚨', color: 'bg-red-600' },
      theft: { icon: '📦', color: 'bg-orange-600' },
      assault: { icon: '🤜', color: 'bg-red-800' },
      cyber: { icon: '📱', color: 'bg-blue-600' },
      unsafe: { icon: '🚫', color: 'bg-yellow-600' },
      stalking: { icon: '👁️', color: 'bg-orange-700' },
      threat: { icon: '🔪', color: 'bg-orange-800' },
      suspicious: { icon: '🕵️', color: 'bg-gray-600' }
    };
    return incidentTypes[type] || { icon: '⚠️', color: 'bg-gray-600' };
  };

  // Format distance
  const formatDistance = (distance) => {
    if (distance < 100) return `${Math.round(distance)}m`;
    return `${(distance / 1000).toFixed(1)}km`;
  };

  // Calculate days ago
  const getDaysAgo = (dateString) => {
    const incidentDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - incidentDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  // Get safety score styling
  const getSafetyScoreStyling = (color) => {
    const styles = {
      green: 'bg-green-100 text-green-800 border-green-200',
      'yellow-green': 'bg-lime-100 text-lime-800 border-lime-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      red: 'bg-red-100 text-red-800 border-red-200'
    };
    return styles[color] || styles.green;
  };

  if (!userLocation) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 h-full flex items-center justify-center">
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-sm">Enable location to see nearby safety data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Near You</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-sm text-gray-500">
          {userLocation.city}, {userLocation.state}
        </p>
      </div>

      {/* Safety Score Card */}
      <div className="p-4 border-b border-gray-200">
        <div className={`p-3 rounded-lg border ${getSafetyScoreStyling(safetyScore.color)}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {safetyScore.level === 'safe' ? (
                <Shield className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
              <span className="font-semibold">{safetyScore.label}</span>
            </div>
            <span className="text-2xl font-bold">{safetyScore.count}</span>
          </div>
          <p className="text-xs opacity-75">Incidents within 500m</p>
        </div>
      </div>

      {/* Nearby Incidents List */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto p-4">
          {nearbyIncidents.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 text-sm">No incidents reported in 500m</p>
              <p className="text-gray-500 text-xs mt-1">Stay alert</p>
            </div>
          ) : (
            <div className="space-y-3">
              {nearbyIncidents.map((incident) => {
                const incidentData = getIncidentData(incident.type);
                return (
                  <div
                    key={incident.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 ${incidentData.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                        {incidentData.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 capitalize text-sm">
                          {incident.type}
                        </p>
                        <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                          <span>{getDaysAgo(incident.date)}</span>
                          <span>•</span>
                          <span>{formatDistance(incident.distance)} away</span>
                        </div>
                        {incident.description && (
                          <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                            {incident.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Showing incidents from last 30 days
        </div>
      </div>
    </div>
  );
};

export default NearMeSidebar;
