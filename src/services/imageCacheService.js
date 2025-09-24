/**
 * Centralized Image Caching Service
 * Follows the established caching infrastructure patterns from the codebase
 */

// Cache configuration following established patterns
const CACHE_KEY = 'image_cache';
const CACHE_TIMESTAMP_KEY = 'image_cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for images (longer than data)
const MAX_CACHE_SIZE = 10 * 1024 * 1024; // 10MB limit for images
const MAX_CACHE_ITEMS = 200; // Maximum number of cached images
const MAX_IMAGE_SIZE = 500 * 1024; // 500KB max per image

// In-memory cache for quick access
const memoryCache = new Map();

/**
 * Get cache size in bytes
 */
const getCacheSize = () => {
  let totalSize = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('img_')) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }
    }
  } catch (error) {
    console.warn('Error calculating cache size:', error);
  }
  return totalSize;
};

/**
 * Clean old cache entries following PostsContext pattern
 */
const cleanCache = () => {
  const now = Date.now();
  const cacheKeys = Object.keys(localStorage).filter(key => key.startsWith('img_'));
  
  // Sort by timestamp (newest first)
  const sortedKeys = cacheKeys.map(key => {
    try {
      const item = JSON.parse(localStorage.getItem(key));
      return { key, timestamp: item.timestamp || 0, size: item.size || 0 };
    } catch (e) {
      return { key, timestamp: 0, size: 0 };
    }
  }).sort((a, b) => b.timestamp - a.timestamp);

  // Remove old entries (keep only MAX_CACHE_ITEMS)
  sortedKeys.slice(MAX_CACHE_ITEMS).forEach(({ key }) => {
    localStorage.removeItem(key);
  });

  // Remove expired entries
  sortedKeys.forEach(({ key, timestamp }) => {
    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
    }
  });

  // If still over size limit, remove largest items
  if (getCacheSize() > MAX_CACHE_SIZE) {
    const remainingKeys = Object.keys(localStorage).filter(key => key.startsWith('img_'));
    const sortedBySize = remainingKeys.map(key => {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        return { key, size: item.size || 0 };
      } catch (e) {
        return { key, size: 0 };
      }
    }).sort((a, b) => b.size - a.size);

    // Remove largest items until under limit
    for (const { key } of sortedBySize) {
      localStorage.removeItem(key);
      if (getCacheSize() <= MAX_CACHE_SIZE) break;
    }
  }
};

/**
 * Safely set cache following PostsContext pattern
 */
const safeSetCache = (key, value, size = 0) => {
  try {
    // Clean cache if size exceeds limit
    if (getCacheSize() > MAX_CACHE_SIZE) {
      cleanCache();
    }
    
    const data = {
      value,
      size,
      timestamp: Date.now()
    };
    
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn('Image cache storage failed:', error);
    // If still failing after cleanup, remove all image cache
    if (error.name === 'QuotaExceededError') {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('img_')) {
          localStorage.removeItem(key);
        }
      });
    }
    return false;
  }
};

/**
 * Safely get cache following PostsContext pattern
 */
const safeGetCache = (key) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    if (Date.now() - parsed.timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    
    return parsed.value;
  } catch (error) {
    console.warn('Image cache retrieval failed:', error);
    return null;
  }
};

/**
 * Convert image URL to cache key
 */
const getImageCacheKey = (url) => {
  // Create a hash-like key from URL
  const hash = url.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return `img_${Math.abs(hash)}`;
};

/**
 * Convert image to base64 with size validation
 */
const imageToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image
        ctx.drawImage(img, 0, 0);
        
        // Convert to base64
        const base64 = canvas.toDataURL('image/jpeg', 0.8); // 80% quality
        
        // Check size
        const size = base64.length * 0.75; // Approximate byte size
        if (size > MAX_IMAGE_SIZE) {
          console.warn(`Image too large (${Math.round(size/1024)}KB), skipping cache`);
          resolve(null);
          return;
        }
        
        resolve({ base64, size });
      } catch (error) {
        console.warn('Error converting image to base64:', error);
        resolve(null);
      }
    };
    
    img.onerror = () => {
      console.warn('Error loading image for cache:', url);
      resolve(null);
    };
    
    img.src = url;
  });
};

/**
 * Get cached image or fetch and cache it
 */
export const getCachedImage = async (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // For Firebase Storage URLs, don't try to convert to base64 due to CORS
  if (url.includes('firebasestorage.googleapis.com') || url.includes('storage.googleapis.com')) {
    // Just return the URL - let the browser handle caching
    return url;
  }

  // Check memory cache first
  if (memoryCache.has(url)) {
    const cached = memoryCache.get(url);
    if (cached.timestamp > Date.now() - CACHE_DURATION) {
      return cached.base64;
    } else {
      memoryCache.delete(url);
    }
  }

  // Check localStorage cache
  const cacheKey = getImageCacheKey(url);
  const cached = safeGetCache(cacheKey);
  if (cached) {
    // Update memory cache
    memoryCache.set(url, {
      base64: cached,
      timestamp: Date.now()
    });
    return cached;
  }

  // Fetch and cache the image (only for non-Firebase URLs)
  try {
    const result = await imageToBase64(url);
    if (result) {
      const { base64, size } = result;
      
      // Save to localStorage
      safeSetCache(cacheKey, base64, size);
      
      // Save to memory cache
      memoryCache.set(url, {
        base64,
        timestamp: Date.now()
      });
      
      return base64;
    }
  } catch (error) {
    // Silent fail for caching errors
  }

  return null;
};

/**
 * Preload images from prompt data
 */
export const preloadImages = async (prompts) => {
  if (!prompts || !Array.isArray(prompts)) {
    return;
  }

  const imageUrls = prompts
    .map(prompt => prompt.image)
    .filter(url => url && typeof url === 'string' && !url.startsWith('data:'))
    .filter(url => {
      // Skip Firebase Storage URLs due to CORS issues
      if (url.includes('firebasestorage.googleapis.com') || url.includes('storage.googleapis.com')) {
        return false;
      }
      // Only preload if not already in memory cache
      return !memoryCache.has(url) || 
             (memoryCache.get(url).timestamp <= Date.now() - CACHE_DURATION);
    })
    .slice(0, 10); // Limit to first 10 images to avoid overwhelming

  if (imageUrls.length === 0) {
    return; // No new images to preload
  }

  // Notify backend about image preloading
  try {
    const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:4000';
    const response = await fetch(`${apiBase}/api/cache/images/preload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ imageUrls })
    });
    
    if (response.ok) {
      const result = await response.json();
      // Backend notified successfully
    }
  } catch (error) {
    // Silent fail for backend notification
  }
  
  // Continue with local preloading
  const preloadPromises = imageUrls.map(async (url) => {
    try {
      await getCachedImage(url);
    } catch (error) {
      // Silent fail for individual images
    }
  });

  await Promise.allSettled(preloadPromises);
};

/**
 * Clear image cache
 */
export const clearImageCache = () => {
  try {
    // Clear memory cache
    memoryCache.clear();
    
    // Clear localStorage cache
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('img_')) {
        localStorage.removeItem(key);
      }
    });
    
    // Image cache cleared
  } catch (error) {
    console.error('Error clearing image cache:', error);
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  const cacheKeys = Object.keys(localStorage).filter(key => key.startsWith('img_'));
  const totalSize = getCacheSize();
  const memorySize = memoryCache.size;
  
  return {
    totalImages: cacheKeys.length,
    totalSize: totalSize,
    memoryCacheSize: memorySize,
    maxSize: MAX_CACHE_SIZE,
    maxItems: MAX_CACHE_ITEMS
  };
};

/**
 * Clean up expired cache entries
 */
export const cleanupExpiredCache = () => {
  cleanCache();
  // Cleaned up expired image cache entries
};
