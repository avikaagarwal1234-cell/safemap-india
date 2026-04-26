import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Add custom CSS for map container fixes and animations
const mapStyles = `
  .leaflet-container {
    height: 600px !important;
    width: 100% !important;
    z-index: 0;
    touch-action: none;
    overflow: hidden;
  }
  
  .safety-map-wrapper {
    height: 600px;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  
  .safety-map-wrapper .leaflet-control-container {
    z-index: 999;
  }
  
  /* User location pulse animation */
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(2.5);
      opacity: 0;
    }
  }
  
  .user-location-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid #3B82F6;
    animation: pulse 2s infinite;
    pointer-events: none;
  }
  
  .user-location-marker {
    background: #3B82F6;
    border: 3px solid white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 1000;
  }
  
  /* Live tracking badge */
  .live-tracking-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #DC2626;
    color: white;
    font-size: 10px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 10px;
    animation: pulse 1.5s infinite;
  }
  
  /* Location banner */
  .location-banner {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    background: #FEF3C7;
    border: 1px solid #F59E0B;
    color: #92400E;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mapStyles;
  document.head.appendChild(styleSheet);
}
import { 
  getNCRBCityData, 
  getCrimeRateColor, 
  getMarkerRadius, 
  formatCrimeNumber,
  getTop3Crimes 
} from '../../utils/ncrbData';
import MiniBarChart from '../UI/MiniBarChart';
import { createCustomIcon } from '../UI/CustomMarker';
import NearMeSidebar from './NearMeSidebar';
import { Crosshair, Navigation, NavigationOff } from 'lucide-react';

// Fix for default marker icon in leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const SafetyMap = ({ 
  incidents = [], 
  center = [20.5937, 78.9629], // Center on India
  zoom = 5,
  className = '',
  style = {}
}) => {
  const [activeLayer, setActiveLayer] = useState('live'); // 'live' or 'ncrb'
  const [ncrbData, setNcrbData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center
  const [mapZoom, setMapZoom] = useState(5); // India zoom level
  const [mapTitle, setMapTitle] = useState('Safety Map of India');
  const [showLocationBanner, setShowLocationBanner] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const mapRef = useRef(null);
  const watchIdRef = useRef(null);
  
  // Global marker arrays for filtering
  const liveMarkersRef = useRef([]);
  const ncrbMarkersRef = useRef([]);
  const leafletMapRef = useRef(null);

  // Coordinate validation helper (moved here to fix TDZ error)
  const isValidCoordinate = (lat, lng) => {
    return lat !== undefined && lat !== null && 
           lng !== undefined && lng !== null &&
           !isNaN(lat) && !isNaN(lng) &&
           lat >= -90 && lat <= 90 &&
           lng >= -180 && lng <= 180;
  };

  // Haversine distance calculation
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

  // Get nearby incidents within 500m
  const getNearbyIncidents = (userLat, userLng, radius = 500) => {
    if (!userLat || !userLng || !incidents.length) return [];
    
    return incidents.filter(incident => {
      const incidentLat = incident.lat || incident.latitude;
      const incidentLng = incident.lng || incident.longitude;
      
      if (!isValidCoordinate(incidentLat, incidentLng)) return false;
      
      const distance = calculateDistance(userLat, userLng, incidentLat, incidentLng);
      return distance <= radius;
    });
  };

  // Calculate safety score based on nearby incidents
  const getSafetyScore = (nearbyIncidents) => {
    const count = nearbyIncidents.length;
    if (count === 0) return { level: 'Safe', color: 'green', badge: 'Safe' };
    if (count <= 2) return { level: 'Low Risk', color: 'yellow-green', badge: 'Low Risk' };
    if (count <= 5) return { level: 'Moderate Risk', color: 'yellow', badge: 'Moderate Risk' };
    if (count <= 10) return { level: 'High Risk', color: 'orange', badge: 'High Risk' };
    return { level: 'Very High Risk', color: 'red', badge: 'Very High Risk' };
  };

  // Validate and set safe center coordinates
  const getSafeCenter = (center) => {
    const [lat, lng] = center || [20.5937, 78.9629];
    return isValidCoordinate(lat, lng) ? [lat, lng] : [20.5937, 78.9629];
  };

  const safeMapCenter = getSafeCenter(mapCenter);

  // Geolocation options
  const geoOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000
  };

  // Reverse geocoding function
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        {
          headers: {
            'Accept-Language': 'en'
          }
        }
      );
      const data = await response.json();
      
      const address = data.address || {};
      const city = address.city || address.town || address.village || 'Unknown';
      const state = address.state || 'Unknown';
      const district = address.district || address.county || '';
      
      return { city, state, district, fullAddress: data.display_name || '' };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return { city: 'Unknown', state: 'Unknown', district: '', fullAddress: '' };
    }
  };

  // Get user location on component mount
  useEffect(() => {
    const getUserLocation = async () => {
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser');
        setShowLocationBanner(true);
        return;
      }

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, geoOptions);
        });

        const { latitude, longitude } = position.coords;
        
        // Validate geolocation coordinates
        if (!isValidCoordinate(latitude, longitude)) {
          throw new Error('Invalid geolocation coordinates received');
        }
        
        // Set user location
        setUserLocation({
          lat: latitude,
          lng: longitude,
          accuracy: position.coords.accuracy
        });

        // Center map on user location with neighborhood-level zoom
        setMapCenter([latitude, longitude]);
        setMapZoom(13); // Neighborhood level zoom for Indian cities

        // Reverse geocode to get address
        const addressData = await reverseGeocode(latitude, longitude);
        setUserLocation(prev => ({ ...prev, ...addressData }));

        // Update map title
        setMapTitle(`Safety Map — ${addressData.city}, ${addressData.state}`);

        // Show success toast
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { 
              message: 'Showing safety data for your area', 
              type: 'success',
              duration: 3000
            }
          }));
        }
      } catch (error) {
        setLocationError('Unable to get your location. Please check permissions.');
        setShowLocationBanner(true);
        
        // Center on India as fallback
        setMapCenter([20.5937, 78.9629]);
        setMapZoom(5);
        setMapTitle('Safety Map of India');
        
        // Show error toast
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { 
              message: 'Enable location for personalized safety data', 
              type: 'warning',
              duration: 5000
            }
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    getUserLocation();
  }, []);

  // Load NCRB data
  useEffect(() => {
    const loadNCRBData = async () => {
      try {
        setLoading(true);
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

  // Direct Leaflet map initialization
  useEffect(() => {
    // Initialize map directly without react-leaflet
    if (!document.getElementById('safety-map')) return;
    
    try {
      // Create map instance
      const map = L.map('safety-map', {
        center: safeMapCenter,
        zoom: mapZoom,
        scrollWheelZoom: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        zoomControl: true
      });
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 4
      }).addTo(map);
      
      // Store map reference
      leafletMapRef.current = map;
      
      // Set loading to false
      setLoading(false);
      
      // Setup geolocation
      setTimeout(() => {
        if (map && !map._removed) {
          try {
            map.locate({ setView: true, maxZoom: 12 });
            map.on('locationfound', (e) => {
              if (isValidCoordinate(e.latlng.lat, e.latlng.lng)) {
                setUserLocation({
                  lat: e.latlng.lat,
                  lng: e.latlng.lng,
                  accuracy: e.accuracy || 100
                });
              }
            });
          } catch (err) {
            console.warn('Geolocation setup failed:', err);
          }
        }
      }, 500);
      
    } catch (error) {
      console.error('Error initializing direct Leaflet map:', error);
      setLoading(false);
    }
    
    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.off();
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        } catch (error) {
          console.warn('Error during map cleanup:', error);
        }
      }
      liveMarkersRef.current = [];
      ncrbMarkersRef.current = [];
    };
  }, [safeMapCenter, mapZoom]); // Dependencies for map initialization

  // Live tracking functionality
  const startLiveTracking = () => {
    if (!navigator.geolocation) return;

    setIsTracking(true);
    
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Validate coordinates
        if (!isValidCoordinate(latitude, longitude)) {
          console.warn('Invalid coordinates from watchPosition');
          return;
        }
        
        setUserLocation({
          lat: latitude,
          lng: longitude,
          accuracy: position.coords.accuracy
        });

        // Update map center to follow user smoothly
        setMapCenter([latitude, longitude]);
        setMapZoom(13);

        // Show live tracking toast
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { 
              message: 'Live tracking active', 
              type: 'info',
              duration: 2000
            }
          }));
        }
      },
      (error) => {
        console.error('Geolocation watch error:', error);
        setIsTracking(false);
        
        // Show error toast
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { 
              message: 'Live tracking stopped', 
              type: 'error',
              duration: 3000
            }
          }));
        }
      },
      geoOptions
    );
  };

  const stopLiveTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    
    // Show stop tracking toast
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { 
          message: 'Live tracking stopped', 
          type: 'info',
          duration: 2000
        }
      }));
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

// Create custom "You are here" marker
const createUserLocationMarker = () => {
  return L.divIcon({
    html: `
      <div style="position: relative;">
        <div style="
          width: 24px;
          height: 24px;
          background: #3B82F6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          z-index: 1000;
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          background: #3B82F6;
          border-radius: 50%;
          animation: pulse 2s infinite;
          z-index: 999;
        "></div>
      </div>
    `,
    className: 'user-location-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

  // Filter functionality
  const applyFilter = (query) => {
    if (!leafletMapRef.current) return;
    
    const map = leafletMapRef.current;
    const activeMarkers = activeLayer === 'live' ? liveMarkersRef.current : ncrbMarkersRef.current;
    const normalizedQuery = query.trim().toLowerCase();
    
    // Filter out null/undefined markers and apply filter
    activeMarkers.forEach(marker => {
      if (!marker) return; // Skip null/undefined markers
      
      try {
        const incidentType = marker.incidentType || '';
        
        if (normalizedQuery === '' || incidentType.includes(normalizedQuery)) {
          // Show marker
          if (map && marker && !map.hasLayer(marker)) {
            marker.addTo(map);
          }
        } else {
          // Hide marker
          if (map && marker && map.hasLayer(marker)) {
            map.removeLayer(marker);
          }
        }
      } catch (error) {
        console.warn('Error applying filter to marker:', error);
      }
    });
  };

  // Handle filter input change
  const handleFilterChange = (query) => {
    setFilterQuery(query);
    applyFilter(query);
    
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { 
          message: query ? `Filtering: ${query}` : 'Filter cleared', 
          type: 'info',
          duration: 2000
        }
      }));
    }
  };

  // Handle layer switching with filter reset
  const handleLayerSwitch = (layer) => {
    setActiveLayer(layer);
    setFilterQuery(''); // Clear filter
    applyFilter(''); // Show all markers for new layer
  };

  // Separate component for Live Report Markers to fix hooks violation
  const LiveReportMarker = React.memo(({ incident, index, filterQuery, applyFilter }) => {
    const markerRef = useRef(null);
    
    useEffect(() => {
      // Add cleanup to prevent enqueueJob errors
      return () => {
        if (markerRef.current && leafletMapRef.current) {
          try {
            // Remove from markers array on cleanup
            const markerIndex = liveMarkersRef.current.indexOf(markerRef.current);
            if (markerIndex > -1) {
              liveMarkersRef.current.splice(markerIndex, 1);
            }
          } catch (error) {
            console.warn('Error during marker cleanup:', error);
          }
        }
      };
    }, []);

    useEffect(() => {
      if (markerRef.current && leafletMapRef.current) {
        try {
          const marker = markerRef.current;
          marker.incidentType = incident.type?.toLowerCase() || 'unknown';
          
          // Add to live markers array if not already there
          if (!liveMarkersRef.current.includes(marker)) {
            liveMarkersRef.current.push(marker);
          }
          
          // Apply current filter with null check
          if (applyFilter && typeof applyFilter === 'function') {
            applyFilter(filterQuery);
          }
        } catch (error) {
          console.warn('Error in marker useEffect:', error);
        }
      }
    }, [markerRef.current, incident.type, filterQuery, applyFilter]);
    
    // Comprehensive data validation
    if (!incident || typeof incident !== 'object') {
      console.warn('Invalid incident data:', incident);
      return null;
    }
    
    // Validate coordinates before rendering
    const lat = incident.lat || incident.latitude;
    const lng = incident.lng || incident.longitude;
    
    if (!isValidCoordinate(lat, lng)) {
      console.warn('Invalid coordinates for incident:', incident);
      return null; // Skip rendering if coordinates are invalid
    }
    
    // Validate incident type
    const incidentType = incident.type || 'unknown';
    
    try {
      return (
        <Marker
          key={`live-${index}`}
          position={[lat, lng]}
          icon={createCustomIcon(incidentType)}
          ref={markerRef}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-gray-900 capitalize mb-2">
                {incidentType}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                {incident.description || 'No description available'}
              </p>
              <p className="text-xs text-gray-500">
                {incident.city || 'Unknown'}, {incident.state || 'Unknown'} • {incident.date || 'Unknown date'}
              </p>
            </div>
          </Popup>
        </Marker>
      );
    } catch (error) {
      console.error('Error rendering LiveReportMarker:', error, incident);
      return null;
    }
  });

  // Separate component for NCRB Circles to fix hooks violation
  const NCRBCircle = React.memo(({ cityData, filterQuery, applyFilter }) => {
    const circleRef = useRef(null);
    
    useEffect(() => {
      // Add cleanup to prevent enqueueJob errors
      return () => {
        if (circleRef.current && leafletMapRef.current) {
          try {
            // Remove from markers array on cleanup
            const circleIndex = ncrbMarkersRef.current.indexOf(circleRef.current);
            if (circleIndex > -1) {
              ncrbMarkersRef.current.splice(circleIndex, 1);
            }
          } catch (error) {
            console.warn('Error during circle cleanup:', error);
          }
        }
      };
    }, []);

    useEffect(() => {
      if (circleRef.current && leafletMapRef.current) {
        try {
          const circle = circleRef.current;
          circle.incidentType = 'ncrb'; // NCRB data type
          
          // Add to NCRB markers array if not already there
          if (!ncrbMarkersRef.current.includes(circle)) {
            ncrbMarkersRef.current.push(circle);
          }
          
          // Apply current filter with null check
          if (applyFilter && typeof applyFilter === 'function') {
            applyFilter(filterQuery);
          }
        } catch (error) {
          console.warn('Error in circle useEffect:', error);
        }
      }
    }, [circleRef.current, filterQuery, applyFilter]);
    
    // Comprehensive data validation
    if (!cityData || typeof cityData !== 'object') {
      console.warn('Invalid city data:', cityData);
      return null;
    }
    
    // Validate coordinates before rendering
    const lat = cityData.latitude || cityData.lat;
    const lng = cityData.longitude || cityData.lng;
    
    if (!isValidCoordinate(lat, lng)) {
      console.warn('Invalid coordinates for city data:', cityData);
      return null; // Skip rendering if coordinates are invalid
    }
    
    // Validate required data fields
    const totalCrimes = cityData.totalCrimes || 0;
    const crimeRate = cityData.crimeRate || 0;
    const cityName = cityData.city || 'Unknown';
    const stateName = cityData.state || 'Unknown';
    
    try {
      return (
        <Circle
          center={[lat, lng]}
          radius={getMarkerRadius(totalCrimes)}
          fillColor={getCrimeRateColor(crimeRate)}
          fillOpacity={0.6}
          color={getCrimeRateColor(crimeRate)}
          weight={2}
          ref={circleRef}
        >
          <Popup>
            <div className="text-gray-900 font-semibold">
              <h3 className="text-sm font-bold border-b border-gray-200 pb-1 mb-1">
                {cityName}, {stateName}
              </h3>
              <div className="text-xs space-y-1">
                <p><strong>Total Crimes (2022):</strong> {formatCrimeNumber(totalCrimes)}</p>
                <p><strong>Crime Rate:</strong> {crimeRate}/1 lakh population</p>
                <p><strong>Top Categories:</strong></p>
                <ul className="ml-2">
                  {getTop3Crimes(cityData.topCrimes || []).map((crime, index) => (
                    <li key={index} className="text-xs">
                      {crime.category}: {formatCrimeNumber(crime.count)}
                    </li>
                  ))}
                </ul>
                <div id={`mini-chart-${cityName.replace(/\s+/g, '-')}`}></div>
                <p className="text-xs text-gray-500 mt-2 italic">
                  Source: NCRB Crime in India Report 2022
                </p>
              </div>
            </div>
          </Popup>
        </Circle>
      );
    } catch (error) {
      console.error('Error rendering NCRBCircle:', error, cityData);
      return null;
    }
  });

  // Combined control panel component
  const ControlPanel = () => {
    const incidentTypes = ['all', 'harassment', 'stalking', 'assault', 'threat', 'unsafe', 'cyber', 'suspicious', 'theft'];
    
    return (
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-xl border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-3 space-y-3" style={{ minWidth: '200px' }}>
        {/* Layer Controls */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Map Layers</p>
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleLayerSwitch('live')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                activeLayer === 'live'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🚨 Live Reports
            </button>
            <button
              onClick={() => handleLayerSwitch('ncrb')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                activeLayer === 'ncrb'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 NCRB Historical
            </button>
          </div>
        </div>
        
        {/* Filter Control */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Filter</p>
          <input
            type="text"
            id="filterInput"
            value={filterQuery}
            onChange={(e) => handleFilterChange(e.target.value)}
            placeholder="Type to filter..."
            className="w-full px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15"
          />
          <div className="text-xs text-gray-500">
            {filterQuery ? `Filtering: "${filterQuery}"` : 'Showing all incidents'}
          </div>
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
          navigator.geolocation.getCurrentPosition(resolve, reject, geoOptions);
        });

        const { latitude, longitude } = position.coords;
        
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 11);
        }

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
      <div className="absolute bottom-4 right-4 z-[1000] pointer-events-none">
        <button
          onClick={handleNearMe}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-colors duration-200 pointer-events-auto"
          title="Find incidents near me"
        >
          <Crosshair className="w-5 h-5" />
        </button>
      </div>
    );
  };

  // Live tracking button
  const LiveTrackingButton = () => (
    <div className="absolute bottom-4 right-20 z-[1000] pointer-events-none">
      <button
        onClick={isTracking ? stopLiveTracking : startLiveTracking}
        className={`relative px-4 py-2 rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-colors duration-200 pointer-events-auto ${
          isTracking 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        <div className="flex items-center space-x-2">
          {isTracking ? <NavigationOff className="w-4 h-4" /> : <Navigation className="w-4 h-4" />}
          <span className="text-sm font-medium">
            {isTracking ? 'Stop Tracking' : 'Live Track'}
          </span>
        </div>
        {isTracking && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
        )}
      </button>
    </div>
  );

  // Location banner
  const LocationBanner = () => (
    showLocationBanner && (
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[1000]">
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-full shadow-lg">
          <p className="text-sm font-medium">
            Enable location for personalized safety data
          </p>
        </div>
      </div>
    )
  );

  // Map Error Boundary Component
  const MapErrorBoundary = ({ children }) => {
    return (
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    );
  };

  // Validate incidents data before rendering
  const validIncidents = React.useMemo(() => {
    if (!Array.isArray(incidents)) return [];
    return incidents.filter(incident => 
      incident && 
      typeof incident === 'object' &&
      isValidCoordinate(incident.lat || incident.latitude, incident.lng || incident.longitude)
    );
  }, [incidents]);

  // Validate NCRB data before rendering
  const validNcrbData = React.useMemo(() => {
    if (!Array.isArray(ncrbData)) return [];
    return ncrbData.filter(cityData => 
      cityData && 
      typeof cityData === 'object' &&
      isValidCoordinate(cityData.latitude || cityData.lat, cityData.longitude || cityData.lng)
    );
  }, [ncrbData]);

  // Safely render markers with error handling
  const SafeLiveReportMarker = React.memo((props) => {
    try {
      return <LiveReportMarker {...props} />;
    } catch (error) {
      console.error('Error in SafeLiveReportMarker:', error);
      return null;
    }
  });

  // Safely render circles with error handling
  const SafeNCRBCircle = React.memo((props) => {
    try {
      return <NCRBCircle {...props} />;
    } catch (error) {
      console.error('Error in SafeNCRBCircle:', error);
      return null;
    }
  });

  return (
    <div className={`safety-map-wrapper relative ${className}`} style={{ ...style }}>
      {/* Map Title */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <h2 className="text-lg font-bold text-gray-900">{mapTitle}</h2>
      </div>

      {/* Show loading state while map is initializing */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl z-[1001]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Safety Map...</p>
          </div>
        </div>
      )}

      {/* Direct Leaflet Map Implementation */}
      <div 
        id="safety-map" 
        className="rounded-xl border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
        style={{ height: '600px', width: '100%' }}
      ></div>

      {/* Near Me Sidebar */}
      <NearMeSidebar 
        userLocation={userLocation}
        incidents={incidents}
      />
    </div>
  );
};

export default SafetyMap;
