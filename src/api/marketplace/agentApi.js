// src/api/marketplace/agentApi.js
import { api, API_URL } from '../core/apiConfig';
import { auth } from '../../utils/firebase';

// Add token caching
let cachedToken = null;
let tokenExpirationTime = null;
// Add a request cache
const requestCache = new Map();
const pendingRequests = new Map();
// Cache expiration time - 5 minutes (in milliseconds)
const CACHE_EXPIRY = 5 * 60 * 1000;
// Function to get token with caching
const getTokenWithCache = async (currentUser) => {
  console.log('getTokenWithCache called');
  const now = Date.now();
  
  // If we have a cached token that's not expired and not close to expiring, use it
  if (cachedToken && tokenExpirationTime && now < tokenExpirationTime - (5 * 60 * 1000)) {
    console.log('Using cached token, expires in:', Math.round((tokenExpirationTime - now) / 1000), 'seconds');
    return cachedToken;
  }

  try {
    console.log('Getting fresh token, old token expires in:', tokenExpirationTime ? Math.round((tokenExpirationTime - now) / 1000) : 'N/A', 'seconds');
    // Force refresh the token
    const token = await currentUser.getIdToken(true);
    
    // Cache the token and set expiration (5 minutes before actual expiration)
    cachedToken = token;
    // Firebase tokens expire in 1 hour, we'll refresh 5 minutes before
    tokenExpirationTime = now + (55 * 60 * 1000);
    
    console.log('New token obtained and cached, expires in:', Math.round((tokenExpirationTime - now) / 1000), 'seconds');
    return token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    console.error('Error stack:', error.stack);
    // Clear the cache on error
    cachedToken = null;
    tokenExpirationTime = null;
    throw error;
  }
};

// Helper function to get auth headers (if needed explicitly)
export const getAuthHeaders = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return {};
  }
  const token = await getTokenWithCache(currentUser);
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};


// Get agent by ID
export const getAgentById = async (agentId, options = {}) => {
  try {
    // Extract options with defaults
    const { skipCache = true, includeReviews = false, timestamp = Date.now() } = options;
    
    // Build URL with query parameters to bust all caching layers
    let url = `/api/agents/${agentId}`;
    const queryParams = [];
    
    // Always add these parameters to ensure we get fresh data
    if (skipCache) queryParams.push(`skipCache=true`);
    if (includeReviews) queryParams.push(`includeReviews=true`);
    
    // Always add timestamp to bypass browser cache
    queryParams.push(`_t=${timestamp}`);
    
    // Add refresh=true to bypass Redis and HTTP caching
    queryParams.push(`refresh=true`);
    
    // Combine into URL
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    console.log(`[API] Fetching agent ${agentId} with fresh data`, options);
    
    // Set headers to bypass caching layers
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    
    const response = await api.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching agent ${agentId}:`, error);
    throw error;
  }
};

// Create a new agent
export const createAgent = async (agentData) => {
  try {
    console.log('[API] Creating new agent:', agentData);
    const response = await api.post('/api/agents', agentData);
    return response.data;
  } catch (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
};

// Update an agent
export const updateAgent = async (agentId, agentData) => {
  try {
    console.log(`[API] Updating agent ${agentId}:`, agentData);
    const response = await api.put(`/api/agents/${agentId}`, agentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating agent ${agentId}:`, error);
    throw error;
  }
};

// Delete an agent
export const deleteAgent = async (agentId) => {
  try {
    console.log(`[API] Deleting agent ${agentId}`);
    const response = await api.delete(`/api/agents/${agentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting agent ${agentId}:`, error);
    throw error;
  }
};

// DEPRECATED: Reviews are now included in the agent data from fetchAgentById
// This function and related review mutation functions have been removed.
// Access reviews via agent.reviews from agent payloads.

// Reviews are immutable via API. Read-only via embedded agent.reviews.
// addAgentReview and deleteAgentReview have been removed.


// Get agent categories
export const getAgentCategories = async () => {
  try {
    const response = await api.get('/api/agents/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching agent categories:', error);
    throw error;
  }
};

// Subscribe to an agent
export const subscribeToAgent = async (agentId, planId) => {
  try {
    console.log(`[API] Subscribing to agent ${agentId} with plan ${planId}`);
    const response = await api.post(`/api/agents/${agentId}/subscribe`, { planId });
    return response.data;
  } catch (error) {
    console.error(`Error subscribing to agent ${agentId}:`, error);
    throw error;
  }
};

// Update agent price
export const updateAgentPrice = async (agentId, priceData) => {
  try {
    console.log(`[API] Updating price for agent ${agentId}:`, priceData);
    const response = await api.put(`/api/agents/${agentId}/price`, priceData);
    return response.data;
  } catch (error) {
    console.error(`Error updating price for agent ${agentId}:`, error);
    throw error;
  }
};

// Get featured agents
export const getFeaturedAgents = async (limit = 6) => {
  try {
    const response = await api.get(`/api/agents/featured?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured agents:', error);
    return []; // Return empty array as fallback
  }
};

// Get top-rated agents
export const getTopRatedAgents = async (limit = 6) => {
  try {
    const response = await api.get(`/api/agents/top-rated?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top-rated agents:', error);
    return []; // Return empty array as fallback
  }
};

// Get newest agents
export const getNewestAgents = async (limit = 6) => {
  try {
    const response = await api.get(`/api/agents/newest?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching newest agents:', error);
    return []; // Return empty array as fallback
  }
};


/**
 * Fetch agents from the API with NEW backend architecture
 * UPDATED to work with the new in-memory caching backend system
 * 
 * @param {Object} params - All parameters in a single object
 * @param {string} params.searchQuery - Search query string
 * @param {string} params.category - Category filter
 * @param {string} params.filter - Sort/filter option
 * @param {number} params.limit - Number of results per page
 * @param {number} params.offset - Pagination offset
 * @param {number} params.priceMin - Minimum price filter
 * @param {number} params.priceMax - Maximum price filter
 * @param {number} params.rating - Minimum rating filter
 * @param {string} params.tags - Comma-separated list of tags
 * @param {string} params.features - Comma-separated list of features
 * @param {string} params.verified - Verification status filter
 * @param {string} params.featured - Featured status filter
 * @param {string} params.complexity - Complexity filter
 * @param {string} params.lastVisibleId - For cursor-based pagination
 * @param {boolean} params.bypassCache - Whether to bypass cache
 * @returns {Promise<Object>} Response with agents array and metadata
 */
export const fetchAgents = async (params = {}) => {
  try {
    const {
      searchQuery,
      category = 'All',
      filter = 'Hot & New',
      limit = 50,
      offset = 0,
      priceMin,
      priceMax,
      rating,
      tags,
      features,
      verified,
      featured,
      complexity,
      lastVisibleId,
      bypassCache = false
    } = params;
    
    console.log('🚀 fetchAgents called with NEW backend architecture:', params);
    
    // Create query params for the NEW backend API
    const queryParams = new URLSearchParams();
    
    // Core parameters
    if (searchQuery && searchQuery.trim()) {
      queryParams.append('searchQuery', searchQuery.trim());
    }
    
    queryParams.append('category', category);
    queryParams.append('filter', filter);
    queryParams.append('limit', limit.toString());
    queryParams.append('offset', offset.toString());
    
    // Filter parameters - send as individual parameters
    if (priceMin !== undefined && priceMin !== null && priceMin > 0) {
      queryParams.append('priceMin', priceMin.toString());
    }
    if (priceMax !== undefined && priceMax !== null && priceMax < 1000) {
      queryParams.append('priceMax', priceMax.toString());
    }
    if (rating !== undefined && rating !== null && rating > 0) {
      queryParams.append('rating', rating.toString());
    }
    if (tags && tags.length > 0) {
      queryParams.append('tags', typeof tags === 'string' ? tags : tags.join(','));
    }
    if (features && features.length > 0) {
      queryParams.append('features', typeof features === 'string' ? features : features.join(','));
    }
    if (verified !== undefined) {
      queryParams.append('verified', verified.toString());
    }
    if (featured !== undefined) {
      queryParams.append('featured', featured.toString());
    }
    if (complexity) {
      queryParams.append('complexity', complexity);
    }
    
    // Pagination parameters
    if (lastVisibleId) {
      queryParams.append('lastVisibleId', lastVisibleId);
    }
    
    // Cache control
    if (bypassCache) {
      queryParams.append('_t', Date.now().toString());
    }
    
    const url = `/api/agents?${queryParams.toString()}`;
    console.log(`[API] NEW Backend URL: ${url}`);
    
    const response = await api.get(url);
    const responseData = response.data;
    
    console.log(`✅ NEW Backend Response:`, {
      agentsCount: responseData?.agents?.length || 0,
      fromCache: responseData?.fromCache,
      totalCount: responseData?.totalCount,
      hasMore: responseData?.hasMore,
      mode: responseData?.mode
    });
    
    // Return the response in the expected format
    return {
      agents: responseData.agents || [],
      totalCount: responseData.totalCount || responseData.agents?.length || 0,
      hasMore: responseData.hasMore || false,
      lastVisibleId: responseData.lastVisibleId || null,
      fromCache: responseData.fromCache || false,
      mode: responseData.mode || 'search',
      // Backward compatibility fields
      total: responseData.totalCount || responseData.agents?.length || 0,
      pagination: {
        hasMore: responseData.hasMore || false,
        lastVisibleId: responseData.lastVisibleId || null
      }
    };
    
  } catch (error) {
    console.error('Error in fetchAgents with NEW backend:', error);
    
    // Return empty response instead of throwing
    return {
      agents: [],
      totalCount: 0,
      hasMore: false,
      lastVisibleId: null,
      fromCache: false,
      mode: 'error',
      total: 0,
      pagination: {
        hasMore: false,
        lastVisibleId: null
      }
    };
  }
};

/**
 * Fetch featured agents with options
 * @param {number} limit - Maximum number of agents to return
 * @param {Object} options - Additional options like forceRefresh
 * @returns {Promise<Array>} - Array of featured agents
 */
export const fetchFeaturedAgents = async (limit = 6, options = {}) => {
  try {
    const { forceRefresh = false } = options;
    
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    
    if (forceRefresh) {
      queryParams.append('refresh', 'true');
    }
    
    const url = `/api/agents/featured?${queryParams.toString()}`;
    console.log(`[API] Fetching featured agents with limit ${limit}`);
    
    const response = await api.get(url);
    return response.data?.agents || [];
  } catch (error) {
    console.error('Error fetching featured agents:', error);
    return [];
  }
};

/**
 * Fetch user wishlists
 * @returns {Promise<Array>} - Array of user wishlists
 */
export const fetchWishlists = async () => {
  try {
    console.log(`[API] Fetching user wishlists`);
    const response = await api.get('/api/user/wishlists');
    return response.data?.wishlists || [];
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    return [];
  }
};

/**
 * Toggle like for an agent
 * @param {string} agentId - The ID of the agent to toggle like for
 * @returns {Promise<Object>} Response object
 */
export const toggleAgentLike = async (agentId) => {
  try {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { success: false, error: 'Authentication required' };
    }

    // Optimistic UI update - store action in pending queue if offline
    const pendingKey = `pending_likes`;
    let pendingLikes = [];
    try {
      const pendingData = localStorage.getItem(pendingKey);
      if (pendingData) {
        pendingLikes = JSON.parse(pendingData);
      }
    } catch (e) {
      console.warn('Error reading pending likes', e);
    }

    // Attempt API call with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`${API_URL}/api/agents/${agentId}/toggle-like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (fetchError) {
      clearTimeout(timeoutId);

      console.warn('Error toggling like, storing action for later sync:', fetchError);
      
      // Store action for later sync
      const isAlreadyPending = pendingLikes.some(item => item.agentId === agentId);
      
      if (!isAlreadyPending) {
        pendingLikes.push({
          agentId,
          action: 'toggle-like',
          timestamp: Date.now()
        });
        
        try {
          localStorage.setItem(pendingKey, JSON.stringify(pendingLikes));
        } catch (storageError) {
          console.warn('Failed to store pending like action:', storageError);
        }
      }
      
      // Provide offline feedback - optimistically toggle
      return { 
        success: true, 
        offline: true,
        liked: true, // optimistic assumption
        likesCount: -1 // indicates we don't know the actual count
      };
    }
  } catch (error) {
    console.error('Error in toggleAgentLike:', error);
    return { success: false, error: error.message };
  }
};

// Add agent to wishlist
export const addToWishlist = async (agentId) => {
  try {
    // We're now using the toggle endpoint for both adding and removing
    const response = await api.post('/api/wishlists/toggle', { agentId });
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

// Remove agent from wishlist
export const removeFromWishlist = async (agentId) => {
  try {
    // We're now using the toggle endpoint for both adding and removing
    const response = await api.post('/api/wishlists/toggle', { agentId });
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

// Toggle wishlist status for an agent (add or remove)
export const toggleWishlist = async (agentId) => {
  try {
    const response = await api.post('/api/wishlists/toggle', { agentId });
    return response.data;
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    throw error;
  }
};

/**
 * Get the total count of agents optionally filtered by category
 * @param {string} category - Optional category to filter by
 * @returns {Promise<number>} - Total count of agents
 */
export const getAgentsCount = async (category = null) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (category && category !== 'All') {
      queryParams.append('category', category);
    }
    
    const queryString = queryParams.toString();
    const url = `/api/agents/count${queryString ? `?${queryString}` : ''}`;
    
    console.log(`[API] Getting agents count${category ? ` for category "${category}"` : ''}`);
    const response = await api.get(url);
    
    return response.data?.count || response.data?.totalCount || 0;
  } catch (error) {
    console.error('Error fetching agents count:', error);
    return 0;
  }
};

/**
 * Check if the backend API is accessible
 * @returns {Promise<{isOnline: boolean, status: number, message: string}>} Status of the API
 */
export const checkApiStatus = async () => {
  try {
    console.log(`Checking API status at ${API_URL}/api/health`);
    
    // Make a simple GET request to the status endpoint
    const response = await fetch(`${API_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`API status response: ${response.status}`);
    
    if (response.ok) {
      return {
        isOnline: true,
        status: response.status,
        message: 'API is online and working correctly'
      };
    }
    
    // If not OK, try to get more details
    let message = `API returned status ${response.status}`;
    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch (e) {
      // Not JSON or couldn't parse
    }
    
    return {
      isOnline: false,
      status: response.status,
      message
    };
  } catch (error) {
    console.error('Error checking API status:', error);
    return {
      isOnline: false,
      status: 0,
      message: `API is unreachable: ${error.message}`
    };
  }
};

/**
 * Delete a post by ID
 * @param {string} postId - ID of the post to delete
 * @param {string} token - Authentication token (optional)
 * @returns {Promise<Object>} - Response with success status
 */
export const deletePost = async (postId, token) => {
  try {
    console.log(`[API] Deleting post ${postId}`);
    
    // Set up headers with authentication if token is provided
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await api.delete(`/api/posts/${postId}`, { headers });
    return {
      success: true,
      message: 'Post deleted successfully',
      ...response.data
    };
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred while deleting the post.' 
    };
  }
};

// Cache and deduplication for fetchAgentById
let pendingAgentRequests = {};
const AGENT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

/**
 * Fetch a single agent by ID from the backend API with caching and request deduplication
 * @param {string} agentId - The ID of the agent to fetch
 * @param {object} options - Additional options
 * @param {boolean} options.skipCache - Skip cache and force fetch from API
 * @param {boolean} options.includeReviews - Whether to include reviews in the response
 * @param {AbortSignal} options.signal - AbortController signal for cancellation
 * @param {number} options.timestamp - Timestamp for cache busting
 * @returns {Promise<Object>} - Agent data
 */
export const fetchAgentById = async (agentId, options = {}) => {
  try {
    const { 
      skipCache = false, 
      includeReviews = false,
      signal = null,
      timestamp = Date.now() 
    } = options;
    
    console.log(`Attempting to fetch agent with ID: ${agentId}`, { skipCache });
    
    // Validate agent ID format
    if (!agentId || typeof agentId !== 'string') {
      console.error('Invalid agent ID format:', agentId);
      throw new Error('Invalid agent ID format');
    }
    
    // Create a cache key that includes any relevant options
    const cacheKey = `agent_${agentId}_${includeReviews ? 'with_reviews' : 'no_reviews'}`;
    
    // Check for a pending request for this exact agent
    // This prevents duplicate requests when components mount simultaneously
    if (pendingAgentRequests[cacheKey]) {
      console.log(`Using pending request for agent ${agentId}`);
      try {
        return await pendingAgentRequests[cacheKey];
      } catch (error) {
        console.error(`Error from pending request for agent ${agentId}:`, error);
        // If the pending request fails, we'll try again below
        // So we continue execution rather than throwing
      }
    }
    
    // Check cache first unless skipCache is true
    if (!skipCache) {
      try {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          const cacheTime = parsedData._cacheTime || 0;
          const now = Date.now();
          
          // Use cache if it's less than the cache duration old
          if (now - cacheTime < AGENT_CACHE_DURATION) {
            console.log(`Using cached data for agent ${agentId}`);
            return parsedData;
          } else {
            console.log(`Cache expired for agent ${agentId}, fetching fresh data`);
          }
        }
      } catch (cacheError) {
        console.warn('Error reading from cache:', cacheError);
      }
    } else {
      console.log(`Skipping cache for agent ${agentId} as requested`);
    }
    
    // Special handling for different ID formats
    // 1. Detect Firebase-style document IDs (typically 20+ chars, alphanumeric)
    const isFirebaseId = /^[a-zA-Z0-9]{20,}$/.test(agentId);
    
    // 2. Detect standard agent-XX format
    const isStandardAgentId = /^agent-\d+$/.test(agentId);
    
    // Default endpoint uses the ID directly
    let endpoint = `/api/agents/${agentId}`;
    
    if (isFirebaseId) {
      console.log('Detected Firebase-style document ID, using doc endpoint');
      endpoint = `/api/agents/doc/${agentId}`;
    } else if (isStandardAgentId) {
      console.log('Detected standard agent-XX format ID, using specific route');
      // For agent-XX format, just use it directly
    }
    
    // Prepare query params
    const queryParams = new URLSearchParams();
    
    // Add reviews param if specified
    if (includeReviews) {
      queryParams.append('includeReviews', 'true');
    }
    
    // Add timestamp for cache busting
    queryParams.append('_t', timestamp);
    
    // Complete endpoint with query params
    endpoint = `${endpoint}?${queryParams.toString()}`;
    
    // Create a promise for this request and store it in pendingAgentRequests
    const requestPromise = (async () => {
      try {
        // Make the API request
        console.log(`Making request to: ${endpoint}`);
        const response = await api.get(endpoint, { signal });
        console.log('Successfully fetched agent from API');
        
        let responseData;
        
        if (response.data && response.data.data) {
          // Format the agent data
          responseData = {
            ...response.data.data,
            // Ensure the rating is formatted correctly
            rating: {
              average: response.data.data.averageRating || 0,
              count: response.data.data.reviewCount || 0
            },
            // Add cache timestamp
            _cacheTime: Date.now()
          };
          
                     // Reviews are expected to be embedded in agent data when requested.
           // Never fetch reviews separately here to avoid unauthorized calls.
        } else if (response.data) {
          // Some APIs might return the data directly
          responseData = {
            ...response.data,
            _cacheTime: Date.now()
          };
        } else {
          throw new Error('Invalid response structure from API');
        }
        
        // Cache the successful response
        try {
          localStorage.setItem(cacheKey, JSON.stringify(responseData));
        } catch (cacheError) {
          console.warn('Error writing to cache:', cacheError);
        }
        
        return responseData;
      } catch (apiError) {
        console.error('API error fetching agent:', apiError);
        
        // Check if we can return a cached version from localStorage as fallback
        try {
          const cachedData = localStorage.getItem(cacheKey);
          if (cachedData) {
            console.log(`API call failed, using cached data for agent ${agentId}`);
            return JSON.parse(cachedData);
          }
        } catch (cacheError) {
          console.error('Error reading from fallback cache:', cacheError);
        }
        
        // Generate mock data for development
        if (process.env.NODE_ENV === 'development') {
          console.warn('Generating mock data for development');
          // Extract ID number if possible
          const idNumber = isStandardAgentId ? 
            parseInt(agentId.replace('agent-', '')) : 
            Math.floor(Math.random() * 1000);
          
          // Generate a mock agent for testing purposes
          return {
            id: agentId,
            name: `Agent ${idNumber}`,
            title: `Test Agent ${idNumber}`,
            description: 'This is a mock agent for testing purposes. In production, this would be replaced with real data from the API.',
            category: 'Test',
            imageUrl: `https://picsum.photos/seed/${idNumber}/600/400`,
            price: Math.random() > 0.3 ? (Math.floor(Math.random() * 50) + 10).toFixed(2) : 'Free',
            rating: {
              average: (3 + Math.random() * 2).toFixed(1),
              count: Math.floor(Math.random() * 100) + 10
            },
            creator: {
              name: `Creator ${idNumber % 10}`,
              avatarUrl: `https://i.pravatar.cc/150?img=${idNumber % 10}`
            },
            isFeatured: Math.random() > 0.7,
            isNew: Math.random() > 0.7,
            tags: ['Test', 'Mock', 'Development'],
            dateCreated: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            _cacheTime: Date.now()
          };
        }
        
        throw apiError;
      } finally {
        // Clean up the pending request reference when done
        delete pendingAgentRequests[cacheKey];
      }
    })();
    
    // Store the promise so other components can use it
    pendingAgentRequests[cacheKey] = requestPromise;
    
    // Return the result of the request promise
    return await requestPromise;
  } catch (error) {
    console.error(`Error fetching agent ${agentId}:`, error);
    throw error;
  }
};

/**
 * Check if the current user has liked a specific agent
 * @param {string} agentId - The ID of the agent to check
 * @returns {Promise<Object>} Object with liked status and likes count
 */
export const getUserLikeStatus = async (agentId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { liked: false, likesCount: 0 };
      }
  
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/api/agents/${agentId}/user-like-status`, {
        method: 'GET',
        headers
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching like status: ${response.statusText}`);
      }
  
      const data = await response.json();
      return {
        liked: data.liked || false,
        likesCount: data.likesCount || 0
      };
    } catch (error) {
      console.error("Error checking agent like status:", error);
      // Return default values on error
      return { liked: false, likesCount: 0 };
    }
  };
  
/**
 * Download a free agent
 * @param {string} agentId - ID of the agent to download
 * @returns {Promise<Object>} - Response with download URL and information
 */
export const downloadFreeAgent = async (agentId) => {
  try {
    console.log(`[API] Downloading free agent ${agentId}`);
    const response = await api.post(`/api/agents/${agentId}/download`);
    
    // Note: We don't need to call incrementAgentDownloadCount or recordAgentDownload
    // because the /download endpoint already handles these operations server-side
    
    return {
      success: true,
      downloadUrl: response.data?.downloadUrl,
      ...response.data
    };
  } catch (error) {
    console.error(`Error downloading agent ${agentId}:`, error);
    return {
      success: false,
      error: error.message || 'Failed to download agent'
    };
  }
};

/**
 * Increment the download count for an agent
 * @param {string} agentId - ID of the agent to increment download count for
 * @returns {Promise<Object>} - Response with updated download count
 */
export const incrementAgentDownloadCount = async (agentId) => {
  try {
    console.log(`[API] Incrementing download count for agent ${agentId}`);
    const response = await api.post(`/api/agents/${agentId}/increment-downloads`);
    return {
      success: true,
      downloadCount: response.data?.downloadCount,
      ...response.data
    };
  } catch (error) {
    console.error(`Error incrementing download count for agent ${agentId}:`, error);
    return {
      success: false,
      error: error.message || 'Failed to increment download count'
    };
  }
};

/**
 * Record that user has downloaded an agent
 * @param {string} agentId - The ID of the agent
 * @returns {Promise<Object>} - The response indicating success/failure
 */
export const recordAgentDownload = async (agentId) => {
    try {
      // First increment the download count
      await incrementAgentDownloadCount(agentId);
      
      // Then record the download in user's history if authenticated
      const user = auth.currentUser;
      if (user) {
        try {
          const token = await user.getIdToken();
          
          const response = await fetch(`${API_URL}/api/agents/${agentId}/download`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            return await response.json();
          }
        } catch (apiError) {
          // Silently continue if API fails
          console.warn('Could not record download in user history:', apiError.message);
        }
      }
      
      return { success: true, message: 'Download count updated' };
    } catch (error) {
      console.error('Error in recordAgentDownload:', error);
      // Still return success to not interrupt the download flow for the user
      return { success: true, message: 'Download processed' };
    }
  };
  
  // Add this helper function before the fetchAgents export

// Secure: Add a review for an agent (server validates eligibility)
export const addAgentReview = async (agentId, { content, rating }) => {
  try {
    const headers = await getAuthHeaders();
    const response = await api.post(`/api/agents/${agentId}/reviews`, { content, rating }, { headers });
    return response.data;
  } catch (error) {
    const message = error?.response?.data?.error || error.message || 'Failed to add review';
    return { success: false, error: message };
  }
};
