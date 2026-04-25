import React from 'react';
import { MapPin, RefreshCw, AlertTriangle, Leaf } from 'lucide-react';

const EmptyState = ({ type = 'map', onRetry }) => {
  if (type === 'map') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-navy-dark p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">
            No incidents reported here
          </h3>
          <p className="text-green-400 text-lg mb-6">
            This area appears safe! 🌱
          </p>
          <p className="text-gray-400 text-sm">
            No incidents have been reported in this area. Keep staying aware and safe.
          </p>
        </div>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-navy-dark p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">
            Map failed to load
          </h3>
          <p className="text-gray-300 mb-6">
            We're having trouble loading the map. This might be a connection issue.
          </p>
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-primary hover:bg-purple-light text-white font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try refreshing</span>
          </button>
        </div>
      </div>
    );
  }

  if (type === 'no-data') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-purple-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-8 h-8 text-purple-light" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">
            No data available
          </h3>
          <p className="text-gray-400">
            No data is currently available for this view.
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default EmptyState;
