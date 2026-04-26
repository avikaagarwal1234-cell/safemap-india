import { useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function useAlerts(onAlert) {
  const incidents = useRef([]);

  useEffect(() => {
    // Mock implementation for now - in production this would use Supabase real-time
    const mockInterval = setInterval(() => {
      // Simulate cluster detection logic
      const recent = incidents.current.filter(i => 
        Date.now() - new Date(i.created_at).getTime() < 30 * 60 * 1000
      );
      
      // Check for clusters (simplified logic for demo)
      if (recent.length >= 3) {
        const cities = {};
        recent.forEach(i => {
          cities[i.city] = (cities[i.city] || 0) + 1;
        });
        
        Object.entries(cities).forEach(([city, count]) => {
          if (count >= 3) {
            onAlert(`■ Cluster detected near ${city}: ${count} incidents in area`);
          }
        });
      }
    }, 10000); // Check every 10 seconds

    return () => {
      clearInterval(mockInterval);
    };
  }, [onAlert]);

  // Function to add incident for testing
  const addIncident = (incident) => {
    incidents.current.push(incident);
  };

  return { addIncident };
}
