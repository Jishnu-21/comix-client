import React, { useState, useEffect } from 'react';
import '../Assets/Css/LoadingScreen.scss';

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start fade out after a small delay
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 500); // Adjust this delay as needed

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`loading-screen ${!isVisible ? 'fade-out' : ''}`}>
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
