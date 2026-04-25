// Geolocation utility with India-specific features

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SafeMapIndia/1.0' // Required by Nominatim usage policy
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch address data');
    }

    const data = await response.json();
    
    // Extract Indian address components
    const address = data.address || {};
    const addressParts = data.display_name || '';
    
    // Extract specific Indian administrative divisions
    const extracted = {
      fullAddress: addressParts,
      city: address.city || address.town || address.village || address.suburb || '',
      state: address.state || '',
      district: address.county || address.district || '',
      postcode: address.postcode || '',
      country: address.country || '',
      country_code: address.country_code || '',
      // Additional Indian-specific fields
      village: address.village || '',
      subdistrict: address.subdistrict || '',
      region: address.region || '',
      road: address.road || '',
      neighbourhood: address.neighbourhood || '',
      // Coordinates
      latitude: parseFloat(lat),
      longitude: parseFloat(lon)
    };

    // Format a user-friendly Indian address
    extracted.formattedAddress = formatIndianAddress(extracted);
    
    return extracted;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw new Error('Failed to get address from coordinates');
  }
};

const formatIndianAddress = (address) => {
  const parts = [];
  
  // Add specific location details
  if (address.road) parts.push(address.road);
  if (address.neighbourhood) parts.push(address.neighbourhood);
  if (address.subdistrict) parts.push(address.subdistrict);
  
  // Add village/town/city
  if (address.village) parts.push(address.village);
  if (address.city) parts.push(address.city);
  
  // Add district
  if (address.district && !parts.includes(address.district)) {
    parts.push(address.district);
  }
  
  // Add state
  if (address.state) parts.push(address.state);
  
  // Add postcode
  if (address.postcode) parts.push(address.postcode);
  
  // Add country
  if (address.country && address.country !== 'India') parts.push(address.country);
  
  return parts.length > 0 ? parts.join(', ') : 'Location details unavailable';
};

export const validateIndianLocation = (lat, lon) => {
  // Rough bounding box for India
  const indiaBounds = {
    north: 37.6,
    south: 6.7,
    east: 97.4,
    west: 68.1
  };

  return (
    lat >= indiaBounds.south &&
    lat <= indiaBounds.north &&
    lon >= indiaBounds.west &&
    lon <= indiaBounds.east
  );
};

export const getLocationPermissionStatus = async () => {
  if (!navigator.geolocation) {
    return 'unsupported';
  }

  if ('permissions' in navigator) {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state;
    } catch (error) {
      console.warn('Permission API not available');
    }
  }

  return 'unknown';
};

// Utility to calculate distance between two points (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};
