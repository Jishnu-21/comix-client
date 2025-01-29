import React, { useState, useRef, useEffect } from 'react';
import '../../Assets/Css/ProductDetail/ImageComparisonSlider.scss';

const ImageComparisonSlider = ({ beforeImage, afterImage, height = '600px' }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  const beforeImageRef = useRef(null);

  const handleMouseDown = (e) => {
    e.stopPropagation(); // Stop event from bubbling up to the main slider
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop event from bubbling up to the main slider
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;
      const newPosition = (mouseX / containerWidth) * 100;
      setSliderPosition(Math.min(Math.max(newPosition, 0), 100));
    }
  };

  const handleMouseUp = (e) => {
    e.stopPropagation(); // Stop event from bubbling up to the main slider
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    e.stopPropagation();
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const touchX = e.touches[0].clientX - containerRect.left;
      const newPosition = (touchX / containerWidth) * 100;
      setSliderPosition(Math.min(Math.max(newPosition, 0), 100));
    }
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const updateContainerWidth = () => {
      if (beforeImageRef.current) {
        setContainerWidth(beforeImageRef.current.naturalWidth);
      }
    };

    const img = new Image();
    img.onload = updateContainerWidth;
    img.src = beforeImage;

    return () => {
      img.onload = null;
    };
  }, [beforeImage]);

  return (
    <div 
      ref={containerRef} 
      className="image-comparison-slider" 
      style={{ height, width: containerWidth ? `${containerWidth}px` : '100%' }}
      onMouseDown={(e) => e.stopPropagation()} // Stop mousedown from reaching the main slider
    >
      <div className="image-container">
        <img 
          ref={beforeImageRef}
          src={beforeImage} 
          alt="Before" 
          className="before-image" 
          style={{ width: `${sliderPosition}%` }}
        />
        <img 
          src={afterImage} 
          alt="After" 
          className="after-image" 
          style={{ width: `${100 - sliderPosition}%` }}
        />
      </div>
      <div 
        className="slider"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="slider-button">
          <span>&lt;|&gt;</span>
        </div>
      </div>
    </div>
  );
};

export default ImageComparisonSlider;