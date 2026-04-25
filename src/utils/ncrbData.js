// NCRB Historical Crime Data Processing Utilities

// Mock NCRB data for major Indian cities with crime statistics
// In production, this would be processed from actual CSV files
const mockNCRBData = [
  {
    city: 'Delhi',
    state: 'Delhi',
    coordinates: [28.6139, 77.2090],
    population: 16787941, // ~1.68 crore
    totalCrimes: 152342,
    crimeRate: 907.8, // per 1 lakh population
    year: 2022,
    topCrimes: [
      { category: 'Theft', count: 45321, percentage: 29.7 },
      { category: 'Hurt/Grievous Hurt', count: 32145, percentage: 21.1 },
      { category: 'Auto Theft', count: 28976, percentage: 19.0 },
      { category: 'Assault on Women', count: 18765, percentage: 12.3 },
      { category: 'Burglary', count: 15678, percentage: 10.3 }
    ]
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    coordinates: [19.0760, 72.8777],
    population: 12442373,
    totalCrimes: 45678,
    crimeRate: 367.2,
    year: 2022,
    topCrimes: [
      { category: 'Theft', count: 15678, percentage: 34.3 },
      { category: 'Cheating', count: 8976, percentage: 19.6 },
      { category: 'Hurt/Grievous Hurt', count: 7654, percentage: 16.8 },
      { category: 'Assault on Women', count: 5432, percentage: 11.9 },
      { category: 'Burglary', count: 4321, percentage: 9.5 }
    ]
  },
  {
    city: 'Bangalore',
    state: 'Karnataka',
    coordinates: [12.9716, 77.5946],
    population: 8443675,
    totalCrimes: 38765,
    crimeRate: 458.9,
    year: 2022,
    topCrimes: [
      { category: 'Theft', count: 12345, percentage: 31.8 },
      { category: 'Hurt/Grievous Hurt', count: 8765, percentage: 22.6 },
      { category: 'Cheating', count: 6543, percentage: 16.9 },
      { category: 'Assault on Women', count: 4321, percentage: 11.2 },
      { category: 'Auto Theft', count: 3210, percentage: 8.3 }
    ]
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    coordinates: [13.0827, 80.2707],
    population: 4681087,
    totalCrimes: 23456,
    crimeRate: 501.0,
    year: 2022,
    topCrimes: [
      { category: 'Theft', count: 7890, percentage: 33.6 },
      { category: 'Hurt/Grievous Hurt', count: 5432, percentage: 23.2 },
      { category: 'Cheating', count: 3210, percentage: 13.7 },
      { category: 'Assault on Women', count: 2876, percentage: 12.3 },
      { category: 'Burglary', count: 1987, percentage: 8.5 }
    ]
  },
  {
    city: 'Kolkata',
    state: 'West Bengal',
    coordinates: [22.5726, 88.3639],
    population: 4496694,
    totalCrimes: 19876,
    crimeRate: 442.0,
    year: 2022,
    topCrimes: [
      { category: 'Theft', count: 6789, percentage: 34.2 },
      { category: 'Hurt/Grievous Hurt', count: 4567, percentage: 23.0 },
      { category: 'Cheating', count: 2987, percentage: 15.0 },
      { category: 'Assault on Women', count: 2345, percentage: 11.8 },
      { category: 'Burglary', count: 1876, percentage: 9.4 }
    ]
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    coordinates: [17.3850, 78.4867],
    population: 6809970,
    totalCrimes: 28765,
    crimeRate: 422.7,
    year: 2022,
    topCrimes: [
      { category: 'Theft', count: 8765, percentage: 30.5 },
      { category: 'Hurt/Grievous Hurt', count: 6543, percentage: 22.8 },
      { category: 'Cheating', count: 4321, percentage: 15.0 },
      { category: 'Assault on Women', count: 3456, percentage: 12.0 },
      { category: 'Auto Theft', count: 2876, percentage: 10.0 }
    ]
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    coordinates: [18.5204, 73.8567],
    population: 3124458,
    totalCrimes: 15678,
    crimeRate: 501.7,
    year: 2022,
    topCrimes: [
      { category: 'Theft', count: 5432, percentage: 34.7 },
      { category: 'Hurt/Grievous Hurt', count: 3210, percentage: 20.5 },
      { category: 'Cheating', count: 2345, percentage: 15.0 },
      { category: 'Assault on Women', count: 1987, percentage: 12.7 },
      { category: 'Auto Theft', count: 1543, percentage: 9.8 }
    ]
  },
  {
    city: 'Jaipur',
    state: 'Rajasthan',
    coordinates: [26.9124, 75.7873],
    population: 3073350,
    totalCrimes: 12345,
    crimeRate: 401.6,
    year: 2022,
    topCrimes: [
      { category: 'Theft', count: 4321, percentage: 35.0 },
      { category: 'Hurt/Grievous Hurt', count: 2876, percentage: 23.3 },
      { category: 'Cheating', count: 1876, percentage: 15.2 },
      { category: 'Assault on Women', count: 1543, percentage: 12.5 },
      { category: 'Burglary', count: 987, percentage: 8.0 }
    ]
  },
  {
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    coordinates: [26.8467, 80.9462],
    population: 2817105,
    totalCrimes: 18765,
    crimeRate: 665.9,
    year: 2022,
    topCrimes: [
      { category: 'Theft', count: 5432, percentage: 28.9 },
      { category: 'Hurt/Grievous Hurt', count: 4567, percentage: 24.3 },
      { category: 'Assault on Women', count: 3210, percentage: 17.1 },
      { category: 'Cheating', count: 2345, percentage: 12.5 },
      { category: 'Burglary', count: 1876, percentage: 10.0 }
    ]
  },
  {
    city: 'Ahmedabad',
    state: 'Gujarat',
    coordinates: [23.0225, 72.5714],
    population: 5577940,
    totalCrimes: 22109,
    crimeRate: 396.4,
    year: 2022,
    topCrimes: [
      { category: 'Theft', count: 7890, percentage: 35.7 },
      { category: 'Hurt/Grievous Hurt', count: 5432, percentage: 24.6 },
      { category: 'Cheating', count: 2987, percentage: 13.5 },
      { category: 'Assault on Women', count: 2345, percentage: 10.6 },
      { category: 'Auto Theft', count: 1987, percentage: 9.0 }
    ]
  }
];

// Get crime rate color based on crime rate per lakh population
export const getCrimeRateColor = (crimeRate) => {
  if (crimeRate < 50) return '#86efac'; // light green
  if (crimeRate < 100) return '#fde047'; // yellow
  if (crimeRate < 200) return '#fb923c'; // orange
  if (crimeRate < 300) return '#ef4444'; // red
  return '#991b1b'; // dark red / maroon
};

// Get marker radius based on total crime count (proportional scaling)
export const getMarkerRadius = (totalCrimes) => {
  // Scale radius between 15 and 50 pixels based on crime count
  const minRadius = 15;
  const maxRadius = 50;
  const minCrimes = 10000;
  const maxCrimes = 200000;
  
  const normalized = (totalCrimes - minCrimes) / (maxCrimes - minCrimes);
  const clamped = Math.max(0, Math.min(1, normalized));
  
  return minRadius + (maxRadius - minRadius) * clamped;
};

// Get top 3 crime categories for a city
export const getTop3Crimes = (topCrimes) => {
  return topCrimes.slice(0, 3).map(crime => ({
    category: crime.category,
    count: crime.count,
    percentage: crime.percentage
  }));
};

// Format crime numbers for display
export const formatCrimeNumber = (number) => {
  if (number >= 100000) {
    return (number / 100000).toFixed(1) + 'L';
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  return number.toString();
};

// Get all NCRB data for visualization
export const getNCRBCityData = () => {
  return mockNCRBData.map(city => ({
    ...city,
    color: getCrimeRateColor(city.crimeRate),
    radius: getMarkerRadius(city.totalCrimes),
    top3Crimes: getTop3Crimes(city.topCrimes)
  }));
};

// Get city data by name
export const getCityData = (cityName) => {
  return mockNCRBData.find(city => 
    city.city.toLowerCase() === cityName.toLowerCase()
  );
};

// Get crime statistics summary
export const getCrimeStatsSummary = () => {
  const data = mockNCRBData;
  const totalCities = data.length;
  const totalCrimesAll = data.reduce((sum, city) => sum + city.totalCrimes, 0);
  const avgCrimeRate = data.reduce((sum, city) => sum + city.crimeRate, 0) / totalCities;
  const highestCrimeCity = data.reduce((max, city) => 
    city.crimeRate > max.crimeRate ? city : max
  );
  const lowestCrimeCity = data.reduce((min, city) => 
    city.crimeRate < min.crimeRate ? city : min
  );

  return {
    totalCities,
    totalCrimesAll,
    avgCrimeRate: avgCrimeRate.toFixed(1),
    highestCrimeCity: highestCrimeCity.city,
    highestCrimeRate: highestCrimeCity.crimeRate,
    lowestCrimeCity: lowestCrimeCity.city,
    lowestCrimeRate: lowestCrimeCity.crimeRate
  };
};
