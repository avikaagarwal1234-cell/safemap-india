import React, { useState } from 'react';
import { showToast } from '../UI/ToastContainer';
import { getCurrentLocation, reverseGeocode, validateIndianLocation } from '../../utils/geolocation';

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
  const [formData, setFormData] = useState({
    incidentType: '',
    description: '',
    location: '',
    date: '',
    time: '',
    coordinates: null
  });

  const handleIncidentSelect = (incidentType) => {
    setSelectedIncident(incidentType);
    setFormData(prev => ({ ...prev, incidentType }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        time: ''
      });
    }, 2000);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      {/* Step 1: What happened? */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-purple-light">Step 1 — What happened?</h2>
        <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">Select the type of incident you experienced or witnessed:</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {incidentTypes.map((incident) => (
            <button
              key={incident.id}
              type="button"
              onClick={() => handleIncidentSelect(incident.id)}
              className={`
                p-4 sm:p-6 rounded-xl border-2 transition-all duration-200 transform animate-scale-up
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
      {selectedIncident && (
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-semibold text-purple-light">Step 2 — Tell us more</h2>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description of what happened
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-navy-dark/50 border border-purple-light/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-light focus:border-transparent"
              placeholder="Please describe what happened in as much detail as you're comfortable sharing..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                Location (optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-48 bg-navy-dark/50 border border-purple-light/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-light focus:border-transparent"
                  placeholder="Where did this happen?"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={isLoadingLocation}
                    className="px-2 py-1.5 bg-purple-primary hover:bg-purple-light text-white text-xs font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="px-2 py-1.5 bg-purple-primary hover:bg-purple-light text-white text-xs font-medium rounded transition-colors"
                  >
                    '🗺️ Select on Map'
                  </button>
                </div>
              </div>
              {locationData && (
                <div className="mt-2 p-2 bg-green-600/20 border border-green-500/50 rounded text-xs">
                  <p className="text-green-400">
                    📍 {locationData.city}, {locationData.state}
                    {locationData.district && `, ${locationData.district}`}
                  </p>
                  {formData.coordinates && (
                    <p className="text-green-300 text-xs mt-1">
                      Accuracy: ±{Math.round(formData.coordinates.accuracy)}m
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                Date (optional)
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-navy-dark/50 border border-purple-light/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-light focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-2">
              Time (optional)
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-navy-dark/50 border border-purple-light/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-light focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      {selectedIncident && (
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="px-8 py-4 bg-purple-primary hover:bg-purple-light text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-light focus:ring-offset-2 focus:ring-offset-navy-dark"
          >
            Submit Anonymous Report
          </button>
        </div>
      )}

      {/* Reassurance Message */}
      <div className="text-center pt-8 border-t border-purple-light/20">
        <p className="text-gray-400 text-sm">
          Thank you for your courage. Your report helps create a safer community for everyone.
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Remember: You are completely anonymous. No personal information is collected.
        </p>
      </div>
    </form>
  );
}

export default ReportForm;
