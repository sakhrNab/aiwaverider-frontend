import { useState, useEffect, useRef } from 'react';

export const useCountUp = (end, duration = 2000, shouldStart = false) => {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!shouldStart) {
      setCount(0);
      return;
    }

    startTimeRef.current = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTimeRef.current) / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(easeOutQuart * end));
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [end, duration, shouldStart]);

  return count;
};