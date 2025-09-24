import { create } from 'zustand';
import { fetchPrompts, getPromptCount, getPromptCategories, getFeaturedPrompts } from '../api/marketplace/promptsApi';

// Cache keys for localStorage
const CACHE_KEY = 'prompts_cache';
const CACHE_TIMESTAMP_KEY = 'prompts_cache_timestamp';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// Polling interval for updates
const POLLING_INTERVAL = 10 * 60 * 1000; // 10 minutes

const usePromptsStore = create((set, get) => ({
  // State
  prompts: [],
  isLoaded: false,
  isLoading: false,
  error: null,
  unsubscribe: null,
  lastRefreshed: null,
  
  // Pagination and search state
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  pageSize: 20,
  hasMore: false,
  searchQuery: '',
  filters: {
    category: 'All',
    tags: null,
    featured: null,
    createdBy: null
  },
  
  // Categories
  categories: [],
  
  // Start listening for updates
  startListening: () => {
    // Don't start a new polling if one is already active
    if (get().unsubscribe) {
      // Prompts polling already active
      return;
    }

    try {
      // Check for cached data first
      const cachedData = get().loadFromCache();
      
      if (cachedData && cachedData.prompts && cachedData.prompts.length > 0) {
        const isCacheValid = !get().isCacheExpired(cachedData.timestamp);
        
        set({
          prompts: cachedData.prompts,
          totalCount: cachedData.totalCount || cachedData.prompts.length,
          isLoaded: true,
          isLoading: false,
          lastRefreshed: cachedData.timestamp
        });
        
        // Loaded prompts from cache
        
        // Fetch if cache is expired
        if (!isCacheValid) {
          get().fetchPrompts(true, false);
        }
      } else {
        // No cache, need to fetch with loading state
        get().fetchPrompts(false, true);
      }
      
      // Set up polling interval
      const intervalId = setInterval(() => {
        if (document.visibilityState === 'visible') {
          const { lastRefreshed } = get();
          const refreshAge = lastRefreshed ? (Date.now() - lastRefreshed) : Infinity;
          
          if (refreshAge > POLLING_INTERVAL) {
            get().fetchPrompts(true, false);
          }
        }
      }, POLLING_INTERVAL);

      set({ unsubscribe: () => clearInterval(intervalId) });
      
      // Also load categories
      get().fetchCategories();
    } catch (error) {
      console.error('Error setting up prompts polling:', error);
      set({
        error: error.message || 'Failed to set up prompts polling',
        isLoading: false
      });
      
      get().fetchPrompts(false, true);
    }
  },

  // Stop listening
  stopListening: () => {
    const unsub = get().unsubscribe;
    if (unsub) {
      unsub();
      // Prompts polling stopped
      set({ unsubscribe: null });
    }
  },

  // Fetch prompts with current filters and pagination
  fetchPrompts: async (skipCache = false, showLoading = true) => {
    const { 
      searchQuery, 
      filters, 
      currentPage, 
      pageSize,
      isLoaded, 
      lastRefreshed, 
      prompts 
    } = get();
    
    // Skip if recently fetched
    if (!skipCache && isLoaded && lastRefreshed && 
        (Date.now() - lastRefreshed < 300000) && prompts.length > 0) {
      // Skipping fetch, using recently loaded prompts
      return prompts;
    }

    if (showLoading) {
      set({ isLoading: true, error: null });
    }

    try {
      // Check cache first if not skipping
      if (!skipCache) {
        const cachedData = get().loadFromCache();
        if (cachedData && !get().isCacheExpired(cachedData.timestamp)) {
          set({
            prompts: cachedData.prompts,
            totalCount: cachedData.totalCount || cachedData.prompts.length,
            isLoaded: true,
            isLoading: false,
            lastRefreshed: cachedData.timestamp
          });
          // Loaded prompts from cache
          return cachedData.prompts;
        }
      }

      // Fetch from API
      const options = {
        searchQuery: searchQuery || undefined,
        category: filters.category !== 'All' ? filters.category : undefined,
        tags: filters.tags || undefined,
        featured: filters.featured || undefined,
        createdBy: filters.createdBy || undefined,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize
      };

      const result = await fetchPrompts(options);
      
      set({
        prompts: result.prompts,
        totalCount: result.totalCount,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
        isLoaded: true,
        isLoading: false,
        lastRefreshed: Date.now(),
        error: null
      });

      // Save to cache
      get().saveToCache(result.prompts, result.totalCount);
      // Fetched prompts from API
      
      return result.prompts;
    } catch (error) {
      console.error('Error fetching prompts:', error);
      set({
        error: error.message || 'Failed to load prompts',
        isLoading: false
      });
      return [];
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    try {
      const categories = await getPromptCategories();
      set({ categories });
    } catch (error) {
      console.error('Error fetching prompt categories:', error);
    }
  },


  // Set search query and refresh
  setSearchQuery: async (query) => {
    set({ 
      searchQuery: query,
      currentPage: 1 // Reset to first page
    });
    await get().fetchPrompts(true, true);
  },

  // Set filters and refresh
  setFilters: async (newFilters) => {
    set({ 
      filters: { ...get().filters, ...newFilters },
      currentPage: 1 // Reset to first page
    });
    await get().fetchPrompts(true, true);
  },

  // Set page
  setPage: async (page) => {
    const { totalPages } = get();
    if (page < 1 || page > totalPages) return;
    
    set({ currentPage: page });
    await get().fetchPrompts(true, true);
  },

  // Set page size
  setPageSize: async (size) => {
    if (size < 4 || size > 100) return;
    
    set({ 
      pageSize: size,
      currentPage: 1 // Reset to first page
    });
    await get().fetchPrompts(true, true);
  },

  // Save to cache
  saveToCache: (prompts, totalCount) => {
    try {
      if (!prompts || prompts.length === 0) {
        // Skipping cache update - no prompts to cache
        return;
      }
      
      const timestamp = Date.now();
      const cacheData = { 
        prompts, 
        totalCount: totalCount || prompts.length,
        timestamp 
      };
      
      // Check if we should update cache
      const existingCache = get().loadFromCache();
      if (existingCache && existingCache.prompts && 
          existingCache.prompts.length === prompts.length) {
        const cacheAge = timestamp - existingCache.timestamp;
        if (cacheAge < 5 * 60 * 1000) { // 5 minutes
          // Skipping cache update - recent cache exists
          return;
        }
      }
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp.toString());
      
      // Also save to IndexedDB for offline support
      get().saveToIndexedDB(prompts);
      
      // Updated prompts cache
    } catch (error) {
      console.error('Error saving prompts to cache:', error);
    }
  },

  // Save to IndexedDB
  saveToIndexedDB: (prompts) => {
    try {
      if (!window.indexedDB) {
        // IndexedDB not supported
        return;
      }
      
      const request = window.indexedDB.open('AIWaveriderOfflineDB', 1);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('prompts')) {
          const store = db.createObjectStore('prompts', { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('category', 'category', { unique: false });
        }
      };
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['prompts'], 'readwrite');
        const store = transaction.objectStore('prompts');
        
        store.clear();
        
        prompts.forEach(prompt => {
          store.add(prompt);
        });
        
        transaction.oncomplete = () => {
          // Saved prompts to IndexedDB
        };
        
        transaction.onerror = (error) => {
          console.error('IndexedDB transaction error:', error);
        };
      };
      
      request.onerror = (error) => {
        console.error('Error opening IndexedDB:', error);
      };
    } catch (error) {
      console.error('Error saving to IndexedDB:', error);
    }
  },

  // Load from IndexedDB
  loadFromIndexedDB: () => {
    return new Promise((resolve) => {
      try {
        if (!window.indexedDB) {
          resolve(null);
          return;
        }
        
        const request = window.indexedDB.open('AIWaveriderOfflineDB', 1);
        
        request.onsuccess = (event) => {
          const db = event.target.result;
          
          if (!db.objectStoreNames.contains('prompts')) {
            resolve(null);
            return;
          }
          
          const transaction = db.transaction(['prompts'], 'readonly');
          const store = transaction.objectStore('prompts');
          const getAllRequest = store.getAll();
          
          getAllRequest.onsuccess = () => {
            const prompts = getAllRequest.result;
            if (prompts && prompts.length > 0) {
              // Loaded prompts from IndexedDB
              resolve(prompts);
            } else {
              resolve(null);
            }
          };
          
          getAllRequest.onerror = () => {
            resolve(null);
          };
        };
        
        request.onerror = () => {
          resolve(null);
        };
      } catch (error) {
        console.error('Error in loadFromIndexedDB:', error);
        resolve(null);
      }
    });
  },

  // Load from cache
  loadFromCache: () => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (!cachedData) return null;

      const parsedData = JSON.parse(cachedData);
      return parsedData;
    } catch (error) {
      console.error('Error loading prompts from cache:', error);
      return null;
    }
  },

  // Check if cache is expired
  isCacheExpired: (timestamp) => {
    if (!timestamp) return true;
    return (Date.now() - timestamp) > CACHE_DURATION;
  },

  // Clear cache
  clearCache: () => {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      // Prompts cache cleared
    } catch (error) {
      console.error('Error clearing prompts cache:', error);
    }
  },

  // Force refresh
  forceRefresh: async () => {
    // Force refreshing prompts
    get().clearCache();
    
    set({ 
      isLoading: true,
      currentPage: 1 
    });
    
    await get().fetchPrompts(true, true);
    await get().fetchCategories();
    
    // Prompts refreshed successfully
  },

  // Reset all filters and search
  resetFilters: async () => {
    set({
      searchQuery: '',
      filters: {
        category: 'All',
        tags: null,
        createdBy: null
      },
      currentPage: 1
    });
    await get().fetchPrompts(true, true);
  }
}));

export default usePromptsStore;