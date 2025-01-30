import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import '../../Assets/Css/FullWidthImageSection.scss';

gsap.registerPlugin(ScrollTrigger);

const FullWidthImageSection = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollTrigger = useRef(null);
  
  const videoUrls = {
    desktop: 'https://www.apple.com/media/us/mac-pro/2013/16C1b6b5-1d91-4fef-891e-ff2fc1c1bb58/videos/macpro_main_desktop.mp4',
    mobile: 'https://videos.pexels.com/video-files/7565637/7565637-hd_1080_1920_25fps.mp4'
  };

  // Device detection and resize handler
  useEffect(() => {
    const checkMobile = () => {
      const isPortrait = window.matchMedia('(orientation: portrait)').matches;
      const isMobileSize = window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(isMobileSize && isPortrait);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Video loading handler
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setVideoLoaded(false);
    const handleLoadedData = () => {
      setVideoLoaded(true);
      initScrollAnimation();
    };

    video.src = isMobile ? videoUrls.mobile : videoUrls.desktop;
    video.load();
    video.muted = true;
    video.playsInline = true;

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [isMobile]);

  // Scroll animation setup
  const initScrollAnimation = () => {
    if (scrollTrigger.current) scrollTrigger.current.kill();

    const video = videoRef.current;
    if (!video || !containerRef.current) return;

    // Mobile-specific adjustments
    const scrollDistance = isMobile ? 
      containerRef.current.offsetHeight * 1.5 : 
      containerRef.current.offsetHeight * 2;

    scrollTrigger.current = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: `+=${scrollDistance}`,
      scrub: 0.8,
      pin: true,
      anticipatePin: 1,
      touch: {
        touchMultiplier: 1.5, // Better touch sensitivity
        capture: true
      },
      onUpdate: (self) => {
        const progress = Math.min(self.progress * 1.2, 1); // Adjust for mobile
        video.currentTime = progress * video.duration;
      },
      onLeave: () => {
        // Smooth transition for mobile
        gsap.to(video, { currentTime: video.duration, duration: 0.8 });
      }
    });

    // Mobile-specific touch handling
    if (isMobile) {
      ScrollTrigger.config({
        limitCallbacks: true,
        ignoreMobileResize: false,
        autoRefreshEvents: 'touchstart,touchend,touchcancel'
      });
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrollTrigger.current) scrollTrigger.current.kill();
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