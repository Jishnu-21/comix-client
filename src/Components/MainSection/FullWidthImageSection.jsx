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

  // Detect mobile devices with a more reliable check
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      if (mobile !== isMobile) {
        setIsMobile(mobile);
        // Reinitialize scroll trigger when device type changes
        if (scrollTrigger.current) {
          scrollTrigger.current.kill();
          initScrollAnimation();
        }
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

  // Load video dynamically with cache-busting
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setVideoLoaded(true);
      initScrollAnimation();
    };

    const videoSrc = `${isMobile ? videoUrls.mobile : videoUrls.desktop}?nocache=${new Date().getTime()}`;
    video.src = videoSrc;
    video.load();
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    video.addEventListener('loadeddata', handleLoadedData);
    return () => video.removeEventListener('loadeddata', handleLoadedData);
  }, [isMobile]);

  // Improved scroll animation with mobile optimization
  const initScrollAnimation = () => {
    if (scrollTrigger.current) scrollTrigger.current.kill();

    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Adjust scroll distance based on device type
    const scrollDistance = isMobile 
      ? window.innerHeight // Use viewport height for mobile
      : container.offsetHeight * 2;

    // Create scroll trigger with mobile-specific settings
    scrollTrigger.current = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: `+=${scrollDistance}`,
      scrub: isMobile ? 0.5 : true, // Faster scrub on mobile
      pin: true,
      anticipatePin: 1,
      pinSpacing: true,
      invalidateOnRefresh: true, // Recalculate on resize
      onUpdate: (self) => {
        if (video.duration) {
          const targetTime = self.progress * video.duration;
          // Smooth the video playback
          if (Math.abs(video.currentTime - targetTime) > 0.1) {
            video.currentTime = targetTime;
          }
        }
      },
      onRefresh: () => {
        // Ensure proper positioning after refresh
        ScrollTrigger.refresh(true);
      }
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
      className={`full-width-video-section ${videoLoaded ? 'loaded' : 'loading'} ${isMobile ? 'mobile' : ''}`}
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