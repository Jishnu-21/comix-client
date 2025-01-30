import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Mobile-friendly scroll reset
    const scrollToTop = () => {
      try {
        // First try instant scroll
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant' // Use 'auto' if 'instant' isn't working
        });
        
        // Fallback for browsers that don't support 'instant'
        if (typeof window.__scrollBehavior === 'undefined') {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
        }
      } catch (e) {
        // Mobile fallback
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };

    // Add slight delay for mobile browsers
    const timer = setTimeout(scrollToTop, 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Add mobile viewport meta tag control
  useEffect(() => {
    const setViewport = () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1';
      }
    };
    setViewport();
  }, []);

  return null;
}

export default ScrollToTop;