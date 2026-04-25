import { useState, useEffect, useCallback } from 'react';

// Mock Supabase client for demo - in production this would be actual Supabase
const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => ({
          then: (resolve) => resolve({ data: [], error: null })
        })
      })
    })
  }),
  channel: () => ({
    on: () => ({
      subscribe: () => ({ unsubscribe: () => {} })
    })
  })
};

export const useIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [recentActivity, setRecentActivity] = useState([]);

  // Load test data from JSON file
  const loadTestData = async () => {
    try {
      const response = await fetch('/data/test-incidents.json');
      if (!response.ok) {
        throw new Error('Failed to load test data');
      }
      const testData = await response.json();
      return testData;
    } catch (error) {
      console.error('Error loading test data:', error);
      // Fallback to mock data if test data fails to load
      return [
        { 
          id: 'fallback-1', 
          type: 'harassment', 
          position: [28.6139, 77.2090], 
          city: 'Delhi', 
          state: 'Delhi',
          date: '2025-04-25', 
          time: '14:30', 
          verified: false,
          created_at: new Date(Date.now() - 300000).toISOString()
        },
        { 
          id: 'fallback-2', 
          type: 'stalking', 
          position: [19.0760, 72.8777], 
          city: 'Mumbai', 
          state: 'Maharashtra',
          date: '2025-04-25', 
          time: '16:45', 
          verified: true,
          created_at: new Date(Date.now() - 600000).toISOString()
        }
      ];
    }
  };

  useEffect(() => {
    // Initial load
    const loadIncidents = async () => {
      try {
        setLoading(true);
        
        // Load test data
        const testData = await loadTestData();
        
        setIncidents(testData);
        setRecentActivity(testData.slice(0, 5));
        setLastUpdated(new Date());
        setLoading(false);
        
        // Trigger loading events for progress bar
        window.dispatchEvent(new CustomEvent('data-fetch-start'));
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('data-fetch-end'));
        }, 500);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadIncidents();

    // Set up real-time subscription
    const setupRealtimeSubscription = () => {
      // Mock real-time updates - in production this would be actual Supabase
      const realtimeInterval = setInterval(() => {
        // Simulate random new incident
        if (Math.random() > 0.7) { // 30% chance every 10 seconds
          const newIncident = {
            id: Date.now(),
            type: ['harassment', 'stalking', 'unsafe', 'cyber', 'theft'][Math.floor(Math.random() * 5)],
            position: [
              20 + Math.random() * 10,
              75 + Math.random() * 10
            ],
            city: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'][Math.floor(Math.random() * 5)],
            state: ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal'][Math.floor(Math.random() * 5)],
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0].substring(0, 5),
            verified: false,
            created_at: new Date().toISOString()
          };

          // Handle INSERT event
          handleRealtimeEvent('INSERT', newIncident);
        }

        // Simulate random verification
        if (Math.random() > 0.9 && incidents.length > 0) { // 10% chance
          const randomIncident = incidents[Math.floor(Math.random() * incidents.length)];
          if (!randomIncident.verified) {
            // Handle UPDATE event
            handleRealtimeEvent('UPDATE', { ...randomIncident, verified: true });
          }
        }
      }, 10000); // Every 10 seconds

      return () => clearInterval(realtimeInterval);
    };

    const cleanup = setupRealtimeSubscription();

    return cleanup;
  }, []);

  const handleRealtimeEvent = useCallback((eventType, payload) => {
    switch (eventType) {
      case 'INSERT':
        // Add new incident with bounce animation
        const newIncident = { ...payload, isNew: true };
        setIncidents(prev => [...prev, newIncident]);
        setRecentActivity(prev => [newIncident, ...prev.slice(0, 4)]);
        setLastUpdated(new Date());
        
        // Show toast notification
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { 
              message: `New ${payload.type} reported in ${payload.city}!`, 
              type: 'info',
              duration: 5000
            }
          }));
        }
        
        // Remove "new" status after animation
        setTimeout(() => {
          setIncidents(prev => prev.map(inc => 
            inc.id === newIncident.id ? { ...inc, isNew: false } : inc
          ));
        }, 3000);
        break;

      case 'UPDATE':
        // Update incident (e.g., mark as verified)
        setIncidents(prev => prev.map(inc => 
          inc.id === payload.id ? { ...inc, ...payload } : inc
        ));
        setRecentActivity(prev => prev.map(inc => 
          inc.id === payload.id ? { ...inc, ...payload } : inc
        ));
        setLastUpdated(new Date());
        
        // Show verification toast
        if (payload.verified && typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { 
              message: `Incident in ${payload.city} has been verified`, 
              type: 'success',
              duration: 3000
            }
          }));
        }
        break;

      default:
        break;
    }
  }, []);

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getLastUpdatedTimeAgo = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - lastUpdated) / 1000);

    if (diffInSeconds < 5) return 'just now';
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  };

  return {
    incidents,
    recentActivity,
    loading,
    error,
    lastUpdated,
    getLastUpdatedTimeAgo,
    getTimeAgo,
    handleRealtimeEvent
  };
};
