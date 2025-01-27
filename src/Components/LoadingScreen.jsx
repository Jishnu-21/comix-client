import React, { useState, useEffect } from 'react';
import '../Assets/Css/LoadingScreen.scss';

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Prevent scrolling when loading screen is visible
    document.body.style.overflow = 'hidden';
    
    // Show loading screen for 2 seconds before starting fade out
    const showTimer = setTimeout(() => {
      setIsFading(true);
      
      // Start fade out after showing
      const fadeTimer = setTimeout(() => {
        setIsVisible(false);
        // Re-enable scrolling after loading screen is gone
        document.body.style.overflow = 'auto';
      }, 500); // 500ms fade out duration
      
      return () => clearTimeout(fadeTimer);
    }, 2000); // 2 seconds display time

    return () => {
      clearTimeout(showTimer);
      // Ensure scrolling is re-enabled if component unmounts
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`loading-screen ${isFading ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <img 
          src={`${process.env.PUBLIC_URL}/images/logo.gif`} 
          alt="Loading..." 
          className="loading-logo"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;