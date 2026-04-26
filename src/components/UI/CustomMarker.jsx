import React from 'react';

const incidentEmojis = {
  harassment: '🚨',
  stalking: '👁️',
  assault: '🤜',
  threat: '🔪',
  unsafe: '🚫',
  cyber: '📱',
  suspicious: '🕵️',
  theft: '📦'
};

const incidentColors = {
  harassment: '#dc2626', // red
  stalking: '#ea580c',   // orange
  assault: '#991b1b',    // dark red
  threat: '#c2410c',     // orange
  unsafe: '#ca8a04',     // yellow
  cyber: '#2563eb',      // blue
  suspicious: '#6b7280', // gray
  theft: '#b45309'       // brown
};

const CustomMarker = ({ type, isNew = false, onClick }) => {
  const emoji = incidentEmojis[type] || '⚠️';
  const color = incidentColors[type] || '#6b7280';

  return (
    <div 
      className={`
        relative cursor-pointer transform transition-all duration-200
        ${isNew ? 'animate-bounce' : 'hover:scale-110'}
      `}
      onClick={onClick}
    >
      {/* Outer glow effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 animate-pulse"
        style={{ background: color }}
      />
      
      {/* Main marker circle */}
      <div 
        className="relative w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
        style={{ background: color }}
      >
        <span className="text-sm">{emoji}</span>
      </div>
      
      {/* New indicator */}
      {isNew && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse-dot" />
      )}
    </div>
  );
};

// For Leaflet integration
const createCustomIcon = (type, isNew = false) => {
  const emoji = incidentEmojis[type] || '⚠️';
  const color = incidentColors[type] || '#6b7280';
  
  const iconHtml = `
    <div class="custom-marker ${isNew ? 'animate-bounce' : ''}">
      <div class="marker-glow" style="background: ${color}; opacity: 0.3;"></div>
      <div class="marker-circle" style="background: ${color};">
        <span class="marker-emoji">${emoji}</span>
      </div>
      ${isNew ? '<div class="new-indicator"></div>' : ''}
    </div>
  `;
  
  return {
    html: iconHtml,
    className: 'custom-marker-container',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  };
};

export default CustomMarker;
export { createCustomIcon, incidentEmojis, incidentColors };
