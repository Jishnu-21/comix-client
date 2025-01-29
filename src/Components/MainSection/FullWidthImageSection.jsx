import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import '../../Assets/Css/FullWidthImageSection.scss';

gsap.registerPlugin(ScrollTrigger);

const FullWidthImageSection = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const scrollTrigger = useRef(null);
  const videoUrl = 'https://www.apple.com/media/us/mac-pro/2013/16C1b6b5-1d91-4fef-891e-ff2fc1c1bb58/videos/macpro_main_desktop.mp4';

  // Video loading handler
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setVideoLoaded(true);
      initScrollAnimation();
    };

    video.src = videoUrl;
    video.preload = 'auto';
    video.addEventListener('loadedmetadata', handleLoadedData);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedData);
    };
  }, []);

  // Scroll animation setup
  const initScrollAnimation = () => {
    const video = videoRef.current;
    if (!video || !containerRef.current) return;

    // Calculate animation duration based on video length
    const scrollDistance = containerRef.current.offsetHeight * 2;
    const frameRate = 30;
    const totalFrames = video.duration * frameRate;

    scrollTrigger.current = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: `+=${scrollDistance}`,
      scrub: 0.5,
      pin: true,
      anticipatePin: 1,
      markers: false, // Set to true for debugging
      onUpdate: (self) => {
        const progress = self.progress;
        const currentTime = Math.min(progress * video.duration, video.duration);
        
        // Use RAF for smoother animation
        requestAnimationFrame(() => {
          video.currentTime = currentTime;
        });
      }
    });

    // Mobile touch optimization
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true
    });
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrollTrigger.current) {
        scrollTrigger.current.kill();
      }
      ScrollTrigger.clearMatchMedia();
    };
  }, []);

  return (
    <section 
      className={`full-width-video-section ${videoLoaded ? 'loaded' : 'loading'}`}
      ref={containerRef}
    >
      <div className="video-container">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="scroll-video"
          webkit-playsinline="true"
        />
      </div>
      
      {!videoLoaded && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
        </div>
      )}
    </section>
  );
};

export default FullWidthImageSection;