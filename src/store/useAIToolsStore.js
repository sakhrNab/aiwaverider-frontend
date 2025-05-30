import { create } from 'zustand';
import { getAllAITools } from '../services/aiToolsService';

// Cache keys for localStorage
const CACHE_KEY = 'ai_tools_cache';
const CACHE_TIMESTAMP_KEY = 'ai_tools_cache_timestamp';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Polling interval for simulating real-time updates without Firestore listeners
const POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutes - reduced frequency to minimize network calls

const useAIToolsStore = create((set, get) => ({
  // State
  tools: [],
  isLoaded: false,
  isLoading: false,
  error: null,
  unsubscribe: null,
  lastRefreshed: null,

  // Start polling for updates (simulating real-time behavior)
  startListening: () => {
    // Don't start a new polling if one is already active
    if (get().unsubscribe) {
      console.log('AI Tools polling already active');
      return;
    }

    try {
      // Check for cached data first
      const cachedData = get().loadFromCache();
      const now = Date.now();
      
      if (cachedData && cachedData.tools && cachedData.tools.length > 0) {
        // If cache is valid and not expired, use it without fetching
        const isCacheValid = !get().isCacheExpired(cachedData.timestamp);
        
        set({
          tools: cachedData.tools,
          isLoaded: true,
          isLoading: false,
          lastRefreshed: cachedData.timestamp
        });
        
        console.log(`Loaded ${cachedData.tools.length} AI tools from cache, expired: ${!isCacheValid}`);
        
        // Only fetch if cache is expired, and do it silently without loading state
        if (!isCacheValid) {
          // Fetch without showing loading state
          get().fetchToolsOnce(true, false);
        }
      } else {
        // No cache, need to fetch with loading state
        set({ isLoading: true, error: null });
        get().fetchToolsOnce(false, true);
      }
      
      // Set up polling interval for updates - but much less frequent to reduce network calls
      const intervalId = setInterval(() => {
        // Only fetch if tab is visible AND we haven't refreshed recently
        if (document.visibilityState === 'visible') {
          const { lastRefreshed } = get();
          const refreshAge = lastRefreshed ? (now - lastRefreshed) : Infinity;
          
          // Only update if we haven't refreshed in the polling interval time
          // This prevents unnecessary API calls
          if (refreshAge > POLLING_INTERVAL) {
            // Silent background refresh - no loading state
            get().fetchToolsOnce(true, false);
          }
        }
      }, POLLING_INTERVAL);

      // Store the interval ID so we can clear it later
      set({ unsubscribe: () => clearInterval(intervalId) });
    } catch (error) {
      console.error('Error setting up AI tools polling:', error);
      set({
        error: error.message || 'Failed to set up AI tools polling',
        isLoading: false
      });
      
      // Fall back to manual fetch with loading state
      get().fetchToolsOnce(false, true);
    }
  },

  // Stop polling
  stopListening: () => {
    const unsub = get().unsubscribe;
    if (unsub) {
      unsub(); // This will call clearInterval with our interval ID
      console.log('AI Tools polling stopped');
      set({ unsubscribe: null });
    }
  },

  // Manual fetch (fallback or periodic refresh)
  fetchToolsOnce: async (skipCache = false, showLoading = true) => {
    // If tools are already loaded and we recently refreshed, skip fetching
    const { isLoaded, lastRefreshed, tools } = get();
    if (!skipCache && isLoaded && lastRefreshed && (Date.now() - lastRefreshed < 300000) && tools.length > 0) {
      console.log('Skipping fetch, using recently loaded tools');
      return tools;
    }

    // Only set loading state if showLoading is true
    if (showLoading) {
      set({ isLoading: true, error: null });
    }

    try {
      // Check cache first if we're not skipping cache
      if (!skipCache) {
        const cachedData = get().loadFromCache();
        if (cachedData && !get().isCacheExpired(cachedData.timestamp)) {
          set({
            tools: cachedData.tools,
            isLoaded: true,
            isLoading: false,
            lastRefreshed: cachedData.timestamp
          });
          console.log('Loaded AI tools from cache (manual fetch):', cachedData.tools.length);
          return cachedData.tools;
        }
      }

      // Use aiToolsService to fetch tools
      // The forceRefresh parameter will be true when skipCache is true
      const toolsData = await getAllAITools(skipCache);
      
      // Sort tools by date (newest first) if not already sorted
      toolsData.sort((a, b) => {
        // Convert dates if they exist
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
      });

      set({
        tools: toolsData,
        isLoaded: true,
        isLoading: false,
        lastRefreshed: Date.now(),
        error: null
      });

      // Update the cache
      get().saveToCache(toolsData);
      console.log('Fetched AI tools from API:', toolsData.length);
      
      return toolsData;
    } catch (error) {
      console.error('Error fetching AI tools once:', error);
      set({
        error: error.message || 'Failed to load AI tools',
        isLoading: false
      });
      return [];
    }
  },

  // Save to cache with optimization to prevent excessive storage operations
  saveToCache: (tools) => {
    try {
      // Don't update cache if tools array is empty
      if (!tools || tools.length === 0) {
        console.log('Skipping cache update - no tools to cache');
        return;
      }
      
      const timestamp = Date.now();
      const cacheData = { tools, timestamp };
      
      // Check if we have existing cache with the same tools to prevent unnecessary writes
      const existingCache = get().loadFromCache();
      if (existingCache && existingCache.tools && existingCache.tools.length === tools.length) {
        // If tool count is the same, only update if it's been at least 15 minutes
        // This prevents excessive localStorage writes
        const cacheAge = timestamp - existingCache.timestamp;
        if (cacheAge < 15 * 60 * 1000) { // 15 minutes
          console.log('Skipping cache update - recent cache exists with same item count');
          return;
        }
      }
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp.toString());
      console.log(`Updated cache with ${tools.length} tools`);
    } catch (error) {
      console.error('Error saving AI tools to cache:', error);
    }
  },

  loadFromCache: () => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (!cachedData) return null;

      const parsedData = JSON.parse(cachedData);
      return parsedData;
    } catch (error) {
      console.error('Error loading AI tools from cache:', error);
      return null;
    }
  },

  isCacheExpired: (timestamp) => {
    if (!timestamp) return true;
    return (Date.now() - timestamp) > CACHE_DURATION;
  },

  // Clear cache
  clearCache: () => {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      console.log('AI tools cache cleared');
    } catch (error) {
      console.error('Error clearing AI tools cache:', error);
    }
  },

  // Force refresh (clear cache and fetch)
  forceRefresh: async () => {
    console.log('Force refreshing AI tools...');
    get().clearCache();
    
    // Always show loading state for manual refresh
    set({ isLoading: true });
    await get().fetchToolsOnce(true, true);
    set({ isLoading: false });
    
    console.log('AI tools refreshed successfully');
  }
}));

export default useAIToolsStore;
