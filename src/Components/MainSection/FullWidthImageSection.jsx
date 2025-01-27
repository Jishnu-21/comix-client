import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import '../../Assets/Css/FullWidthImageSection.scss';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_URL = 'https://www.apple.com/media/us/mac-pro/2013/16C1b6b5-1d91-4fef-891e-ff2fc1c1bb58/videos/macpro_main_desktop.mp4';
const CACHE_NAME = 'video-cache-v1';

let cachedVideoBlob = null;

const FullWidthImageSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  const loadVideo = async () => {
    try {
      if (typeof window !== 'undefined' && 'caches' in window) {
        if (!cachedVideoBlob) {
          const cache = await caches.open(CACHE_NAME);
          let videoResponse = await cache.match(VIDEO_URL);

          if (!videoResponse) {
            const response = await fetch(VIDEO_URL);
            const blob = await response.blob();
            await cache.put(VIDEO_URL, new Response(blob.slice()));
            videoResponse = await cache.match(VIDEO_URL);
          }

          const blob = await videoResponse.blob();
          cachedVideoBlob = URL.createObjectURL(blob);
        }

        if (videoRef.current) {
          videoRef.current.src = cachedVideoBlob;
        }
      } else {
        console.warn('Cache API not available. Falling back to direct video URL.');
        if (videoRef.current) {
          videoRef.current.src = VIDEO_URL;
        }
      }
    } catch (error) {
      console.error('Error loading video:', error);
      if (videoRef.current) {
        videoRef.current.src = VIDEO_URL;
      }
    }
  };

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error('Error playing video:', error);
        });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadVideo();
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      const initVideo = () => {
        video.pause();
        video.currentTime = 0;
        ScrollTrigger.refresh(true);
      };

      const setupScrollTrigger = () => {
        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.kill();
        }

        // Normalize scroll behavior for mobile devices
        ScrollTrigger.normalizeScroll(true);

        const endValue = video.duration * 150;

        scrollTriggerRef.current = ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${endValue}`,
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          pinSpacing: true,
          ease: "none",
          immediateRender: true,
          onUpdate: (self) => {
            if (video.duration) {
              const videoTime = Math.min(self.progress * video.duration, video.duration);
              gsap.to(video, {
                duration: 0.1,
                currentTime: videoTime,
                overwrite: true,
                ease: "none"
              });
            }
          },
          onLeave: () => video.currentTime >= video.duration - 0.1
        });
      };

      video.addEventListener('loadeddata', () => {
        setIsLoaded(true);
        initVideo();
        setupScrollTrigger();
      });

      return () => {
        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.kill();
        }
        ScrollTrigger.normalizeScroll(false); // Cleanup
      };
    }
  }, []);

  return (
    <section className={`full-width-image-section ${!isLoaded ? 'loading' : ''}`} ref={containerRef}>
      {!isLoaded && <div className="loading-placeholder">Loading video...</div>}
      <div className="video-wrapper">
        <video
          ref={videoRef}
          muted
          playsInline
          className="full-width-video"
          onError={(e) => console.error('Video playback error:', e)}
          preload="none"
        />
        {!isPlaying && (
          <button onClick={handlePlayVideo} className="play-button">
            Play Video
          </button>
        )}
      </div>
    </section>
  );
};

export default FullWidthImageSection;