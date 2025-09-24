import { create } from 'zustand';

// Cache keys following established patterns
const CACHE_KEY = 'image_cache_metadata';
const CACHE_TIMESTAMP_KEY = 'image_cache_metadata_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const useImageCacheStore = create((set, get) => ({
  // State
  isLoaded: false,
  isLoading: false,
  error: null,
  lastRefreshed: null,
  
  // Cache metadata
  cacheStats: {
    totalImages: 0,
    totalSize: 0,
    memoryCacheSize: 0,
    maxSize: 0,
    maxItems: 0
  },
  
  // Preloaded images tracking
  preloadedImages: new Set(),
  
  // Start listening for cache updates
  startListening: () => {
    // Cleanup expired cache every hour
    const cleanupInterval = setInterval(() => {
      get().cleanupExpiredCache();
    }, 60 * 60 * 1000); // 1 hour
    
    // Update cache stats every 5 minutes
    const statsInterval = setInterval(() => {
      get().updateCacheStats();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => {
      clearInterval(cleanupInterval);
      clearInterval(statsInterval);
    };
  },
  
  // Stop listening
  stopListening: () => {
    // Cleanup handled by startListening return function
  },
  
  // Get cached image
  getCachedImage: async (url) => {
    try {
      set({ isLoading: true, error: null });
      
      // Import the service function dynamically to avoid circular dependency
      const { getCachedImage } = await import('../services/imageCacheService');
      const result = await getCachedImage(url);
      return result;
    } catch (error) {
      console.error('Error getting cached image:', error);
      set({ error: error.message || 'Failed to get cached image' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Preload images from prompts
  preloadImages: async (prompts) => {
    try {
      set({ isLoading: true, error: null });
      
      // Import the service function dynamically to avoid circular dependency
      const { preloadImages } = await import('../services/imageCacheService');
      await preloadImages(prompts);
      
      // Track preloaded images
      const imageUrls = prompts
        .map(prompt => prompt.image)
        .filter(url => url && typeof url === 'string' && !url.startsWith('data:'));
      
      set(state => ({
        preloadedImages: new Set([...state.preloadedImages, ...imageUrls])
      }));
      
      // Preloaded images
    } catch (error) {
      console.error('Error preloading images:', error);
      set({ error: error.message || 'Failed to preload images' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Update cache statistics
  updateCacheStats: async () => {
    try {
      const { getCacheStats } = await import('../services/imageCacheService');
      const stats = getCacheStats();
      set({ 
        cacheStats: stats,
        lastRefreshed: Date.now()
      });
    } catch (error) {
      console.error('Error updating cache stats:', error);
    }
  },
  
  // Cleanup expired cache
  cleanupExpiredCache: async () => {
    try {
      const { cleanupExpiredCache } = await import('../services/imageCacheService');
      await cleanupExpiredCache();
      get().updateCacheStats();
    } catch (error) {
      console.error('Error cleaning up cache:', error);
    }
  },
  
  // Clear all image cache
  clearImageCache: async () => {
    try {
      const { clearImageCache } = await import('../services/imageCacheService');
      await clearImageCache();
      set({
        preloadedImages: new Set(),
        cacheStats: {
          totalImages: 0,
          totalSize: 0,
          memoryCacheSize: 0,
          maxSize: 0,
          maxItems: 0
        },
        lastRefreshed: Date.now()
      });
      // Image cache cleared
    } catch (error) {
      console.error('Error clearing image cache:', error);
    }
  },
  
  // Load from cache
  loadFromCache: () => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (cachedData && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp, 10);
        const now = Date.now();
        
        if (now - timestamp < CACHE_DURATION) {
          const parsed = JSON.parse(cachedData);
          set({
            cacheStats: parsed.cacheStats || get().cacheStats,
            preloadedImages: new Set(parsed.preloadedImages || []),
            isLoaded: true,
            lastRefreshed: timestamp
          });
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading from cache:', error);
    }
    return null;
  },
  
  // Save to cache
  saveToCache: () => {
    try {
      const { cacheStats, preloadedImages } = get();
      const timestamp = Date.now();
      
      const cacheData = {
        cacheStats,
        preloadedImages: Array.from(preloadedImages),
        timestamp
      };
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp.toString());
      
      // Image cache metadata saved
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  },
  
  // Force refresh
  forceRefresh: async () => {
    // Force refreshing image cache
    await get().clearImageCache();
    await get().updateCacheStats();
  }
}));

export default useImageCacheStore;
