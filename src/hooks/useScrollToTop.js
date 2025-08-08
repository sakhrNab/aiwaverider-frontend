import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      // Try multiple methods to ensure scroll works across all browsers and devices
      try {
        // Method 1: Standard scrollTo with smooth behavior
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } catch (error) {
        // Method 2: Fallback for browsers that don't support smooth scrolling
        window.scrollTo(0, 0);
      }
    };

    // Immediate scroll
    scrollToTop();
    
    // Scroll after a brief delay to handle any dynamic content loading
    const timeoutId1 = setTimeout(scrollToTop, 100);
    
    // Additional scroll after animations might have started
    const timeoutId2 = setTimeout(scrollToTop, 300);
    
    // Final scroll to ensure we're at the top (after framer-motion animations)
    const timeoutId3 = setTimeout(scrollToTop, 800);
    
    // One more scroll after all animations are likely complete
    const timeoutId4 = setTimeout(scrollToTop, 1200);
    
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      clearTimeout(timeoutId4);
    };
  }, [location.pathname]);
};

export default useScrollToTop; 