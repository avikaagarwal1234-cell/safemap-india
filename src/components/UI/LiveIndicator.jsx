import React, { useState, useEffect } from 'react';
import { Activity, Wifi } from 'lucide-react';

const LiveIndicator = ({ lastUpdated, incidentCount }) => {
  const [timeAgo, setTimeAgo] = useState('just now');

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const diffInSeconds = Math.floor((now - lastUpdated) / 1000);

      if (diffInSeconds < 5) {
        setTimeAgo('just now');
      } else if (diffInSeconds < 60) {
        setTimeAgo(`${diffInSeconds} seconds ago`);
      } else if (diffInSeconds < 3600) {
        setTimeAgo(`${Math.floor(diffInSeconds / 60)} minutes ago`);
      } else {
        setTimeAgo(`${Math.floor(diffInSeconds / 3600)} hours ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-black/80 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-green-500/30">
      <div className="flex items-center space-x-3">
        {/* Live indicator with pulsing dot */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <span className="text-green-400 font-bold text-sm uppercase tracking-wider">Live</span>
        </div>

        {/* Separator */}
        <div className="w-px h-4 bg-gray-600"></div>

        {/* Last updated */}
        <div className="flex flex-col">
          <span className="text-gray-300 text-xs">Last updated</span>
          <span className="text-white text-sm font-medium">{timeAgo}</span>
        </div>

        {/* Separator */}
        <div className="w-px h-4 bg-gray-600"></div>

        {/* Incident count */}
        <div className="flex flex-col">
          <span className="text-gray-300 text-xs">In view</span>
          <span className="text-white text-sm font-medium">{incidentCount} incidents</span>
        </div>
      </div>
    </div>
  );
};

export default LiveIndicator;
