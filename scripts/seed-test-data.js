// Database Seeding Script for SafeMap India
// Inserts 50 realistic fake incidents across major Indian cities

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration (replace with your actual credentials)
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Major Indian cities with coordinates
const indianCities = [
  { name: 'Delhi', state: 'Delhi', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lon: 72.8777 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lon: 78.4867 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873 },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462 },
  { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lon: 78.0081 },
  { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lon: 77.4126 },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577 },
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lon: 79.0882 },
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lon: 72.8311 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lon: 72.5714 }
];

// Incident types
const incidentTypes = [
  'harassment',
  'stalking', 
  'assault',
  'threat',
  'unsafe',
  'cyber',
  'suspicious',
  'theft'
];

// Realistic incident descriptions
const incidentDescriptions = {
  harassment: [
    'Verbal harassment near bus stop',
    'Unwanted advances in marketplace',
    'Inappropriate comments on street',
    'Harassment near educational institution',
    'Street harassment during evening walk'
  ],
  stalking: [
    'Followed by unknown person for several blocks',
    'Suspicious person loitering near residence',
    'Repeated sightings of same individual',
    'Being watched from distance',
    'Car following slowly through neighborhood'
  ],
  assault: [
    'Physical altercation in public space',
    'Attempted assault near ATM',
    'Violent incident in crowded area',
    'Attack during late night hours',
    'Assault near transportation hub'
  ],
  threat: [
    'Verbal threats with weapon display',
    'Intimidation by group of individuals',
    'Threatening behavior near workplace',
    'Armed robbery threat',
    'Menacing behavior in isolated area'
  ],
  unsafe: [
    'Poorly lit street with no security',
    'Abandoned building attracting suspicious activity',
    'Unsafe area due to lack of street lighting',
    'Isolated area with no phone coverage',
    'Dangerous intersection with no traffic control'
  ],
  cyber: [
    'Online harassment and threats',
    'Cyberstalking through social media',
    'Revenge porn threats',
    'Online blackmail attempts',
    'Digital harassment campaign'
  ],
  suspicious: [
    'Unusual activity near residential area',
    'Suspicious vehicle parked for extended time',
    'Strange behavior in public space',
    'Unauthorized person in restricted area',
    'Suspicious package left unattended'
  ],
  theft: [
    'Phone snatching in crowded area',
    'Bag theft from public transportation',
    'Pickpocketing in marketplace',
    'Vehicle break-in and theft',
    'Chain snatching incident'
  ]
};

// Generate random coordinates within city bounds
function generateRandomCoordinates(city) {
  const offset = 0.01 + Math.random() * 0.04; // 0.01-0.05 degrees offset
  const angle = Math.random() * 2 * Math.PI;
  
  const lat = city.lat + (offset * Math.cos(angle));
  const lon = city.lon + (offset * Math.sin(angle));
  
  return { lat, lon };
}

// Generate random date within last 30 days
function generateRandomDate() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
  
  return {
    date: date.toISOString().split('T')[0],
    time: date.toTimeString().split(' ')[0].substring(0, 5)
  };
}

// Generate random severity (1-5) with weighted distribution
function generateRandomSeverity() {
  const weights = [0.1, 0.2, 0.3, 0.25, 0.15]; // More medium severity incidents
  const random = Math.random();
  
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return i + 1; // Severity 1-5
    }
  }
  return 3; // Default to medium
}

// Generate 50 realistic fake incidents
function generateTestIncidents() {
  const incidents = [];
  
  for (let i = 0; i < 50; i++) {
    const city = indianCities[Math.floor(Math.random() * indianCities.length)];
    const incidentType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
    const coordinates = generateRandomCoordinates(city);
    const dateTime = generateRandomDate();
    const severity = generateRandomSeverity();
    const descriptions = incidentDescriptions[incidentType];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    const incident = {
      id: `test-${i + 1}`,
      type: incidentType,
      city: city.name,
      state: city.state,
      latitude: coordinates.lat,
      longitude: coordinates.lon,
      description: description,
      severity: severity,
      date: dateTime.date,
      time: dateTime.time,
      verified: Math.random() > 0.7, // 30% chance of being verified
      created_at: new Date().toISOString()
    };
    
    incidents.push(incident);
  }
  
  return incidents;
}

// Main seeding function
async function seedTestData() {
  try {
    console.log('🌱 Starting to seed test data...');
    
    // Generate test incidents
    const testIncidents = generateTestIncidents();
    
    console.log(`📍 Generated ${testIncidents.length} test incidents`);
    
    // Insert incidents into Supabase
    const { data, error } = await supabase
      .from('incidents')
      .insert(testIncidents)
      .select();
    
    if (error) {
      console.error('❌ Error inserting data:', error);
      throw error;
    }
    
    console.log(`✅ Successfully inserted ${data.length} incidents into Supabase`);
    
    // Display summary
    const summary = {
      totalIncidents: data.length,
      cities: [...new Set(data.map(inc => inc.city))].length,
      incidentTypes: [...new Set(data.map(inc => inc.type))].length,
      verifiedIncidents: data.filter(inc => inc.verified).length,
      avgSeverity: (data.reduce((sum, inc) => sum + inc.severity, 0) / data.length).toFixed(1),
      dateRange: {
        earliest: Math.min(...data.map(inc => new Date(inc.created_at))),
        latest: Math.max(...data.map(inc => new Date(inc.created_at)))
      }
    };
    
    console.log('\n📊 Seeding Summary:');
    console.log(`   Total incidents: ${summary.totalIncidents}`);
    console.log(`   Cities covered: ${summary.cities}`);
    console.log(`   Incident types: ${summary.incidentTypes}`);
    console.log(`   Verified incidents: ${summary.verifiedIncidents}`);
    console.log(`   Average severity: ${summary.avgSeverity}`);
    console.log(`   Date range: ${new Date(summary.dateRange.earliest).toLocaleDateString()} - ${new Date(summary.dateRange.latest).toLocaleDateString()}`);
    
    // Show city distribution
    const cityDistribution = {};
    data.forEach(inc => {
      cityDistribution[inc.city] = (cityDistribution[inc.city] || 0) + 1;
    });
    
    console.log('\n🏙️ City Distribution:');
    Object.entries(cityDistribution)
      .sort(([,a], [,b]) => b - a)
      .forEach(([city, count]) => {
        console.log(`   ${city}: ${count} incidents`);
      });
    
    return data;
    
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    throw error;
  }
}

// Run the seeding script
if (require.main === module) {
  seedTestData()
    .then(() => {
      console.log('\n🎉 Test data seeding completed successfully!');
      console.log('🗺️  Check your map to see the populated incidents.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedTestData, generateTestIncidents };
