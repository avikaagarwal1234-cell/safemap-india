import React, { useState, useEffect } from 'react';

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const startLoading = () => {
      setIsLoading(true);
      setProgress(0);
    };

    const endLoading = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
    };

    // Simulate loading states (in real app, this would be connected to actual data loading)
    const loadingEvents = ['map-load', 'data-fetch', 'report-submit'];
    
    // Listen for custom loading events
    const handleStart = () => startLoading();
    const handleEnd = () => endLoading();

    loadingEvents.forEach(event => {
      window.addEventListener(`${event}-start`, handleStart);
      window.addEventListener(`${event}-end`, handleEnd);
    });

    return () => {
      loadingEvents.forEach(event => {
        window.removeEventListener(`${event}-start`, handleStart);
        window.removeEventListener(`${event}-end`, handleEnd);
      });
    };
  }, []);

  useEffect(() => {
    if (isLoading && progress < 90) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, progress]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-purple-primary/20">
        <div 
          className="h-full bg-purple-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
