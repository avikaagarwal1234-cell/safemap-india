import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { incidentEmojis } from './CustomMarker';

const RecentActivity = ({ recentActivity, getTimeAgo }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newItems, setNewItems] = useState(new Set());

  useEffect(() => {
    // Track new items for animation
    if (recentActivity.length > 0) {
      const latestId = recentActivity[0]?.id;
      if (latestId) {
        setNewItems(prev => new Set(prev).add(latestId));
        
        // Remove from new items after animation
        setTimeout(() => {
          setNewItems(prev => {
            const updated = new Set(prev);
            updated.delete(latestId);
            return updated;
          });
        }, 500);
      }
    }
  }, [recentActivity]);

  const getIncidentColor = (type) => {
    const colors = {
      harassment: 'bg-red-600',
      stalking: 'bg-orange-600',
      assault: 'bg-red-800',
      threat: 'bg-orange-700',
      unsafe: 'bg-yellow-600',
      cyber: 'bg-blue-600',
      suspicious: 'bg-gray-600',
      theft: 'bg-amber-700'
    };
    return colors[type] || 'bg-gray-600';
  };

  if (!recentActivity || recentActivity.length === 0) {
    return null;
  }

  return (
    <div className={`absolute top-4 right-4 z-[1000] transition-all duration-300 ${
      isCollapsed ? 'w-12' : 'w-80'
    }`}>
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-600 overflow-hidden">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {!isCollapsed && (
            <>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-purple-light" />
                <span className="text-white font-semibold text-sm">Live Reports Feed</span>
              </div>
              <ChevronUp className="w-4 h-4 text-gray-400" />
            </>
          )}
          {isCollapsed && (
            <div className="flex justify-center w-full">
              <Activity className="w-4 h-4 text-purple-light" />
            </div>
          )}
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="max-h-96 overflow-y-auto">
            {recentActivity.map((incident, index) => (
              <div
                key={incident.id}
                className={`
                  p-3 border-b border-purple-light/20 last:border-b-0
                  hover:bg-black/40 transition-all duration-300
                  ${newItems.has(incident.id) ? 'animate-slideIn bg-purple-primary/10' : ''}
                `}
              >
                <div className="flex items-start space-x-3">
                  {/* Incident icon */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${getIncidentColor(incident.type)}
                  `}>
                    <span className="text-sm">{incidentEmojis[incident.type] || '⚠️'}</span>
                  </div>

                  {/* Incident details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white text-sm font-medium capitalize truncate">
                        {incident.type}
                      </p>
                      {incident.verified && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/50">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs truncate">{incident.city}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {getTimeAgo(incident.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Footer */}
            <div className="p-3 text-center border-t border-purple-light/20">
              <p className="text-gray-500 text-xs">
                Showing {recentActivity.length} most recent reports
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
