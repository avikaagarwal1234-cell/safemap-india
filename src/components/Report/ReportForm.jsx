import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { showToast } from '../UI/ToastContainer';
import { getCurrentLocation, reverseGeocode, validateIndianLocation } from '../../utils/geolocation';
import { MapPin, Check, X } from 'lucide-react';

// Fix for default marker icon in leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const incidentTypes = [
  { id: 'harassment', icon: '🚨', label: 'Harassment', color: 'bg-red-600 hover:bg-red-700 border-red-500' },
  { id: 'stalking', icon: '👁️', label: 'Stalking', color: 'bg-orange-600 hover:bg-orange-700 border-orange-500' },
  { id: 'assault', icon: '🤜', label: 'Physical Assault', color: 'bg-red-800 hover:bg-red-900 border-red-700' },
  { id: 'threat', icon: '🔪', label: 'Threatening Behavior', color: 'bg-orange-700 hover:bg-orange-800 border-orange-600' },
  { id: 'unsafe', icon: '🚫', label: 'Unsafe Area / No Lighting', color: 'bg-yellow-600 hover:bg-yellow-700 border-yellow-500' },
  { id: 'cyber', icon: '📱', label: 'Cyber Harassment', color: 'bg-blue-600 hover:bg-blue-700 border-blue-500' },
  { id: 'suspicious', icon: '🕵️', label: 'Suspicious Activity', color: 'bg-gray-600 hover:bg-gray-700 border-gray-500' },
  { id: 'theft', icon: '📦', label: 'Theft / Snatching', color: 'bg-amber-700 hover:bg-amber-800 border-amber-600' }
];

function ReportForm() {
  const [selectedIncident, setSelectedIncident] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  
  const [formData, setFormData] = useState({
    incidentType: '',
    description: '',
    location: '',
    date: '',
    time: '',
    coordinates: null
  });

  // Create draggable marker
  const createDraggableMarker = (position) => {
    return L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  const handleIncidentSelect = (incidentType) => {
    setSelectedIncident(incidentType);
    setFormData(prev => ({ ...prev, incidentType }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    
    try {
      // Get current location with high accuracy
      const position = await getCurrentLocation();
      
      // Validate if location is within India
      if (!validateIndianLocation(position.latitude, position.longitude)) {
        showToast('Location detected outside India. Please ensure you are reporting from within India.', 'warning');
        setIsLoadingLocation(false);
        return;
      }
      
      // Get address using reverse geocoding
      const addressData = await reverseGeocode(position.latitude, position.longitude);
      
      // Update form with location data
      setLocationData(addressData);
      setSelectedLocation({
        lat: position.latitude,
        lng: position.longitude,
        accuracy: position.accuracy
      });
      
      setFormData(prev => ({
        ...prev,
        location: addressData.formattedAddress,
        coordinates: {
          latitude: position.latitude,
          longitude: position.longitude,
          accuracy: position.accuracy
        }
      }));
      
      showToast('Location detected successfully!', 'success');
      
    } catch (error) {
      console.error('Location error:', error);
      showToast(error.message || 'Failed to get your location. Please try again.', 'error');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleMarkerDragEnd = async (e) => {
    const marker = e.target;
    const position = marker.getLatLng();
    
    const newLocation = {
      lat: position.lat,
      lng: position.lng
    };
    
    setSelectedLocation(newLocation);
    
    // Reverse geocode the new position
    try {
      const addressData = await reverseGeocode(position.lat, position.lng);
      setLocationData(addressData);
      
      setFormData(prev => ({
        ...prev,
        location: addressData.formattedAddress,
        coordinates: {
          latitude: position.lat,
          longitude: position.lng,
          accuracy: 0
        }
      }));
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  const confirmLocation = () => {
    if (selectedLocation && locationData) {
      setIsLocationConfirmed(true);
      setShowMiniMap(false);
      showToast('Location confirmed successfully!', 'success');
    }
  };

  const openMiniMap = () => {
    if (selectedLocation) {
      setShowMiniMap(true);
      setIsLocationConfirmed(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.incidentType || !formData.description) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    
    // Handle form submission here
    console.log('Report submitted:', formData);
    
    // Show success toast
    showToast('Report submitted successfully! Thank you for helping keep our community safe.', 'success');
    
    // Reset form after successful submission
    setTimeout(() => {
      setSelectedIncident('');
      setFormData({
        incidentType: '',
        description: '',
        location: '',
        date: '',
        time: '',
        coordinates: null
      });
      setLocationData(null);
      setSelectedLocation(null);
      setIsLocationConfirmed(false);
      setShowMiniMap(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Report an Incident</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: What happened? */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">What happened?</h2>
              <p className="text-gray-600 mb-6">Select the type of incident you experienced or witnessed:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {incidentTypes.map((incident) => (
                  <button
                    key={incident.id}
                    type="button"
                    onClick={() => handleIncidentSelect(incident.id)}
                    className={`
                      p-4 rounded-xl border-2 transition-all duration-200 transform
                      ${selectedIncident === incident.id 
                        ? `${incident.color} ring-4 ring-white/30 shadow-xl` 
                        : `${incident.color} opacity-80 hover:opacity-100`
                      }
                    `}
                  >
                    <div className="text-4xl mb-3">{incident.icon}</div>
                    <div className="text-lg font-medium text-white">{incident.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Tell us more */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Tell us more</h2>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 text-[15px]"
                  placeholder="Please describe what happened in as much detail as you're comfortable sharing..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Date (optional)
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 text-[15px]"
                  />
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    Time (optional)
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 text-[15px]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Where did it happen? */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Where did it happen?</h2>
              
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-48 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 text-[15px]"
                  placeholder="Where did this happen?"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={isLoadingLocation}
                    className="px-2 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingLocation ? (
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Getting...</span>
                      </div>
                    ) : (
                      '📍 Use Current'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Map selection feature coming soon! Please use "Use Current Location" or enter location manually.', 'info');
                    }}
                    className="px-2 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                  >
                    '🗺️ Select on Map'
                  </button>
                </div>
              </div>

              {/* Location Details */}
              {locationData && (
                <div className="mt-4 space-y-3">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-green-800 font-medium">
                          {locationData.city}, {locationData.state}
                          {locationData.district && `, ${locationData.district}`}
                        </p>
                        <p className="text-green-700 text-sm mt-1">
                          {locationData.fullAddress}
                        </p>
                        {formData.coordinates && (
                          <p className="text-green-600 text-xs mt-2">
                            Latitude: {formData.coordinates.latitude.toFixed(4)} | Longitude: {formData.coordinates.longitude.toFixed(4)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mini Map */}
                  {selectedLocation && (
                    <div className="space-y-3">
                      {!showMiniMap && !isLocationConfirmed && (
                        <button
                          type="button"
                          onClick={openMiniMap}
                          className="w-full px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium rounded-lg transition-colors"
                        >
                          📍 Adjust Location on Map
                        </button>
                      )}

                      {isLocationConfirmed && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Check className="w-5 h-5 text-blue-600" />
                            <span className="text-blue-800 font-medium">Location confirmed</span>
                            <button
                              type="button"
                              onClick={openMiniMap}
                              className="ml-auto text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      )}

                      {showMiniMap && (
                        <div className="space-y-3">
                          <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
                            <MapContainer
                              center={[selectedLocation.lat, selectedLocation.lng]}
                              zoom={16}
                              style={{ height: '100%', width: '100%' }}
                              ref={mapRef}
                            >
                              <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />
                              
                              <Marker
                                position={[selectedLocation.lat, selectedLocation.lng]}
                                icon={createDraggableMarker()}
                                draggable={true}
                                ref={markerRef}
                                eventHandlers={{
                                  dragend: handleMarkerDragEnd,
                                }}
                              >
                                <Popup>
                                  <div className="text-gray-900 text-sm">
                                    <p className="font-medium">Drag to adjust location</p>
                                    <p className="text-xs text-gray-600 mt-1">
                                      {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                                    </p>
                                  </div>
                                </Popup>
                              </Marker>
                            </MapContainer>
                          </div>
                          
                          <div className="flex space-x-3">
                            <button
                              type="button"
                              onClick={confirmLocation}
                              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                            >
                              <Check className="w-4 h-4 inline mr-2" />
                              Confirm This Location
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowMiniMap(false)}
                              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600/15"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportForm;
