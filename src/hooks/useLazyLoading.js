import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for lazy loading using Intersection Observer
 * @param {Object} options - Options for intersection observer
 * @returns {Object} Hook state and ref
 */
export const useLazyLoading = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef(null);
  const observerRef = useRef(null);

  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
    enabled = true
  } = options;

  const observe = useCallback(() => {
    if (!enabled || !targetRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isCurrentlyIntersecting = entry.isIntersecting;
        
        setIsIntersecting(isCurrentlyIntersecting);
        
        if (isCurrentlyIntersecting && !hasIntersected) {
          setHasIntersected(true);
          
          // If triggerOnce is true, stop observing after first intersection
          if (triggerOnce && observerRef.current) {
            observerRef.current.unobserve(targetRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(targetRef.current);
  }, [threshold, rootMargin, triggerOnce, enabled, hasIntersected]);

  useEffect(() => {
    observe();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [observe]);

  // Reset when enabled changes
  useEffect(() => {
    if (!enabled && observerRef.current) {
      observerRef.current.disconnect();
      setIsIntersecting(false);
      if (triggerOnce) {
        setHasIntersected(false);
      }
    } else if (enabled && !observerRef.current) {
      observe();
    }
  }, [enabled, observe, triggerOnce]);

  return {
    targetRef,
    isIntersecting,
    hasIntersected,
    shouldLoad: enabled && (triggerOnce ? hasIntersected : isIntersecting)
  };
};

/**
 * Hook for lazy loading images
 * @param {string} src - Image source URL
 * @param {Object} options - Lazy loading options
 * @returns {Object} Image loading state and props
 */
export const useLazyImage = (src, options = {}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { targetRef, shouldLoad } = useLazyLoading(options);

  useEffect(() => {
    if (!shouldLoad || !src || imageSrc) return;

    setImageLoading(true);
    setImageError(false);

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setImageLoading(false);
    };
    
    img.onerror = () => {
      setImageError(true);
      setImageLoading(false);
    };
    
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [shouldLoad, src, imageSrc]);

  return {
    targetRef,
    imageSrc,
    imageLoading,
    imageError,
    shouldLoad
  };
};

/**
 * Hook for lazy loading components
 * @param {Function} loadComponent - Function that returns a promise for the component
 * @param {Object} options - Lazy loading options
 * @returns {Object} Component loading state
 */
export const useLazyComponent = (loadComponent, options = {}) => {
  const [Component, setComponent] = useState(null);
  const [componentLoading, setComponentLoading] = useState(false);
  const [componentError, setComponentError] = useState(null);
  
  const { targetRef, shouldLoad } = useLazyLoading(options);

  useEffect(() => {
    if (!shouldLoad || Component || !loadComponent) return;

    setComponentLoading(true);
    setComponentError(null);

    loadComponent()
      .then((LoadedComponent) => {
        setComponent(() => LoadedComponent);
        setComponentLoading(false);
      })
      .catch((error) => {
        setComponentError(error);
        setComponentLoading(false);
      });
  }, [shouldLoad, Component, loadComponent]);

  return {
    targetRef,
    Component,
    componentLoading,
    componentError,
    shouldLoad
  };
};

export default useLazyLoading; 