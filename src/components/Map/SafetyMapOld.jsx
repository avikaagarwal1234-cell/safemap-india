import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  getNCRBCityData, 
  getCrimeRateColor, 
  getMarkerRadius, 
  formatCrimeNumber,
  getTop3Crimes 
} from '../../utils/ncrbData';
import MiniBarChart from '../UI/MiniBarChart';
import { createCustomIcon } from '../UI/CustomMarker';

// Fix for default marker icon in leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const SafetyMap = ({ 
  incidents = [], 
  center = [22.9734, 78.6569], 
  zoom = 5,
  className = '',
  style = {}
}) => {
  const [activeLayer, setActiveLayer] = useState('live'); // 'live' or 'ncrb'
  const [ncrbData, setNcrbData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load NCRB data
    const loadNCRBData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = getNCRBCityData();
        setNcrbData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading NCRB data:', error);
        setLoading(false);
      }
    };

    loadNCRBData();
  }, []);

  // Create custom NCRB city marker
  const createNCRBMarker = (cityData) => {
    const { coordinates, color, radius, city, totalCrimes, crimeRate } = cityData;
    
    // Create a circle marker for NCRB data
    return L.circleMarker(coordinates, {
      radius: radius / 3, // Scale down for circle marker
      fillColor: color,
      color: '#ffffff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.7,
      className: 'ncrb-marker'
    });
  };

  // Create popup content for NCRB city
  const createNCRBPopup = (cityData) => {
    const { city, state, totalCrimes, crimeRate, year, topCrimes } = cityData;
    const top3Crimes = getTop3Crimes(topCrimes);

    return `
      <div class="ncrb-popup" style="min-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 12px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">
            ${city}, ${state}
          </h3>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">
            Source: NCRB Crime in India Report ${year}
          </p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
          <div style="text-align: center; padding: 8px; background: #f9fafb; border-radius: 6px;">
            <div style="font-size: 20px; font-weight: 700; color: #1f2937;">
              ${formatCrimeNumber(totalCrimes)}
            </div>
            <div style="font-size: 12px; color: #6b7280;">
              Total Crimes
            </div>
          </div>
          <div style="text-align: center; padding: 8px; background: #f9fafb; border-radius: 6px;">
            <div style="font-size: 20px; font-weight: 700; color: #1f2937;">
              ${crimeRate.toFixed(1)}
            </div>
            <div style="font-size: 11px; color: #6b7287; margin-top: 2px;">
              Rate per 1L Population
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 12px;">
          <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #374151;">
            Top 3 Crime Categories
          </h4>
          <div id="mini-chart-${cityData.city.replace(/\s+/g, '-')}"></div>
        </div>
        
        <div style="font-size: 11px; color: #9ca3af; padding-top: 8px; border-top: 1px solid #f3f4f6;">
          <div style="margin-bottom: 4px;">
            <strong>${top3Crimes[0]?.category || 'N/A'}:</strong> ${formatCrimeNumber(top3Crimes[0]?.count || 0)} (${top3Crimes[0]?.percentage || 0}%)
          </div>
          <div style="margin-bottom: 4px;">
            <strong>${top3Crimes[1]?.category || 'N/A'}:</strong> ${formatCrimeNumber(top3Crimes[1]?.count || 0)} (${top3Crimes[1]?.percentage || 0}%)
          </div>
          <div>
            <strong>${top3Crimes[2]?.category || 'N/A'}:</strong> ${formatCrimeNumber(top3Crimes[2]?.count || 0)} (${top3Crimes[2]?.percentage || 0}%)
          </div>
        </div>
      </div>
    `;
  };

  // Handle popup open to render mini chart
  const handlePopupOpen = (cityData) => {
    setTimeout(() => {
      const chartElement = document.getElementById(`mini-chart-${cityData.city.replace(/\s+/g, '-')}`);
      if (chartElement && cityData.topCrimes) {
        // Simple SVG chart instead of React component for better compatibility
        const top3Crimes = getTop3Crimes(cityData.topCrimes);
        const maxHeight = 60;
        const maxValue = Math.max(...top3Crimes.map(item => item.percentage));
        
        const svgContent = top3Crimes.map((item, index) => {
          const barHeight = (item.percentage / maxValue) * maxHeight;
          const colors = ['#dc2626', '#ea580c', '#f59e0b'];
          const x = index * 25;
          const y = maxHeight - barHeight;
          
          return `
            <g transform="translate(${x}, 0)">
              <rect x="2" y="${y}" width="20" height="${barHeight}" fill="${colors[index]}" rx="2"/>
              <text x="12" y="${y - 5}" text-anchor="middle" font-size="10" fill="#374151">${item.percentage}%</text>
              <text x="12" y="${maxHeight + 12}" text-anchor="middle" font-size="9" fill="#6b7287">${item.category.substring(0, 8)}</text>
            </g>
          `;
        }).join('');
        
        chartElement.innerHTML = `
          <svg width="80" height="${maxHeight + 20}" xmlns="http://www.w3.org/2000/svg">
            ${svgContent}
          </svg>
        `;
      }
    }, 100);
  };

  // Layer control component
  const LayerControl = () => (
    <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 p-2">
      <div className="flex flex-col space-y-1">
        <button
          onClick={() => setActiveLayer('live')}
          className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
            activeLayer === 'live'
              ? 'bg-purple-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🚨 Live Reports
        </button>
        <button
          onClick={() => setActiveLayer('ncrb')}
          className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
            activeLayer === 'ncrb'
              ? 'bg-purple-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📊 NCRB Historical
        </button>
      </div>
    </div>
  );

  // Filter control component
  const FilterControl = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    
    const incidentTypes = ['all', 'harassment', 'stalking', 'assault', 'threat', 'unsafe', 'cyber', 'suspicious', 'theft'];
    
    const handleFilterChange = (filter) => {
      setSelectedFilter(filter);
      // Filter logic would be implemented here
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: { 
            message: `Filter applied: ${filter === 'all' ? 'All incidents' : filter}`, 
            type: 'info',
            duration: 2000
          }
        }));
      }
    };
    
    return (
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 p-2">
        <div className="flex flex-col space-y-1">
          <select
            value={selectedFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-primary"
          >
            <option value="all">All Incidents</option>
            <option value="harassment">Harassment</option>
            <option value="stalking">Stalking</option>
            <option value="assault">Assault</option>
            <option value="threat">Threat</option>
            <option value="unsafe">Unsafe Area</option>
            <option value="cyber">Cyber</option>
            <option value="suspicious">Suspicious</option>
            <option value="theft">Theft</option>
          </select>
        </div>
      </div>
    );
  };

  // Near Me button component
  const NearMeButton = () => {
    const handleNearMe = async () => {
      try {
        if (!navigator.geolocation) {
          alert('Geolocation is not supported by your browser');
          return;
        }

        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });

        const { latitude, longitude } = position.coords;
        
        // Update map center to user's location
        // This would require access to the map instance, for now show a toast
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { 
              message: `Located at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, 
              type: 'success',
              duration: 3000
            }
          }));
        }
      } catch (error) {
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { 
              message: 'Unable to get your location. Please check permissions.', 
              type: 'error',
              duration: 3000
            }
          }));
        }
      }
    };

    return (
      <div className="absolute bottom-4 right-4 z-[1000]">
        <button
          onClick={handleNearMe}
          className="bg-purple-primary hover:bg-purple-light text-white p-3 rounded-full shadow-lg transition-colors"
          title="Find incidents near me"
        >
          🎯
        </button>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} style={style}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Filter Control */}
        <FilterControl />
        
        {/* Layer Control */}
        <LayerControl />
        
        {/* Near Me Button */}
        <NearMeButton />
        
        {/* Live Reports Layer */}
        {activeLayer === 'live' && incidents.map((incident) => (
          <Marker 
            key={`live-${incident.id}`} 
            position={incident.position}
            icon={L.divIcon(createCustomIcon(incident.type, incident.isNew))}
          >
            <Popup>
              <div className="text-navy-dark font-semibold">
                <h3 className="text-sm font-bold border-b border-gray-200 pb-1 mb-1 capitalize">
                  {incident.type} reported
                </h3>
                <p className="text-xs">{incident.city}</p>
                <p className="text-xs text-gray-500 mt-1">{incident.date}, {incident.time}</p>
                {incident.verified && (
                  <span className="inline-block mt-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                    Verified
                  </span>
                )}
                {incident.isNew && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded ml-1">
                    New Report
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* NCRB Historical Layer */}
        {activeLayer === 'ncrb' && !loading && ncrbData.map((cityData) => (
          <Circle
            key={`ncrb-${cityData.city}`}
            center={cityData.coordinates}
            radius={cityData.radius * 1000} // Convert to meters
            fillColor={cityData.color}
            color="#ffffff"
            weight={2}
            opacity={1}
            fillOpacity={0.6}
            className="ncrb-circle-marker"
            eventHandlers={{
              popupopen: () => handlePopupOpen(cityData)
            }}
          >
            <Popup>
              <div dangerouslySetInnerHTML={{ __html: createNCRBPopup(cityData) }} />
            </Popup>
          </Circle>
        ))}
        
        {/* Loading indicator for NCRB layer */}
        {activeLayer === 'ncrb' && loading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-purple-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 text-sm">Loading NCRB data...</span>
            </div>
          </div>
        )}
        
        {/* Legend for NCRB layer */}
        {activeLayer === 'ncrb' && !loading && (
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Crime Rate per 1L Population</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#86efac' }}></div>
                <span className="text-xs text-gray-600">&lt; 50 (Low)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#fde047' }}></div>
                <span className="text-xs text-gray-600">50-100 (Moderate)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#fb923c' }}></div>
                <span className="text-xs text-gray-600">100-200 (High)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }}></div>
                <span className="text-xs text-gray-600">200-300 (Very High)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#991b1b' }}></div>
                <span className="text-xs text-gray-600">300+ (Critical)</span>
              </div>
            </div>
          </div>
        )}
      </MapContainer>
    </div>
  );
};

export default SafetyMap;
