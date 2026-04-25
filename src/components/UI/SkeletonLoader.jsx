import React from 'react';

const SkeletonLoader = ({ type = 'map' }) => {
  if (type === 'map') {
    return (
      <div className="relative w-full h-full bg-navy-dark overflow-hidden">
        {/* Map skeleton shimmer effect */}
        <div className="absolute inset-0">
          <div className="skeleton-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-purple-primary/10 to-transparent animate-shimmer" />
          
          {/* Simulated map grid */}
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-px p-4">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="bg-purple-primary/5 rounded" />
            ))}
          </div>
          
          {/* Loading text overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-light border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-purple-light text-lg font-medium">Loading map...</p>
              <p className="text-gray-400 text-sm mt-2">Preparing safety data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="bg-purple-primary/20 border border-purple-light/30 rounded-lg p-6 animate-pulse">
        <div className="h-4 bg-purple-primary/30 rounded w-3/4 mb-4" />
        <div className="h-3 bg-purple-primary/20 rounded w-1/2 mb-2" />
        <div className="h-3 bg-purple-primary/20 rounded w-2/3" />
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-purple-primary/10 rounded-lg p-4 animate-pulse">
            <div className="flex space-x-4">
              <div className="h-4 bg-purple-primary/20 rounded w-16" />
              <div className="h-4 bg-purple-primary/20 rounded w-24" />
              <div className="h-4 bg-purple-primary/20 rounded w-32" />
              <div className="h-4 bg-purple-primary/20 rounded w-24" />
              <div className="h-4 bg-purple-primary/20 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
