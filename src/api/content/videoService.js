import { api } from '../core/apiConfig';

const VIDEO_API_ENDPOINT = '/api/videos';

/**
 * Fetches videos with pagination and platform filtering
 * @param {Object} options - Query parameters
 * @param {string} options.platform - Required: "youtube", "tiktok", or "instagram"
 * @param {number} options.page - Page number (defaults to 1)
 * @returns {Promise} - Promise with paginated video data
 */
export const getVideos = async (options = {}) => {
  const { platform, page = 1 } = options;
  
  if (!platform) {
    throw new Error('Platform parameter is required');
  }
  
  if (!['youtube', 'tiktok', 'instagram'].includes(platform.toLowerCase())) {
    throw new Error('Platform must be one of: youtube, tiktok, instagram');
  }
  
  try {
    const response = await api.get(VIDEO_API_ENDPOINT, { 
      params: { 
        platform: platform.toLowerCase(), 
        page 
      } 
    });
    
    // Return the response data directly as it matches the backend structure
    return {
      videos: response.data?.videos || [],
      currentPage: response.data?.currentPage || 1,
      totalPages: response.data?.totalPages || 1,
      totalVideos: response.data?.totalVideos || 0,
      hasNextPage: response.data?.hasNextPage || false,
      hasPreviousPage: response.data?.hasPreviousPage || false
    };
  } catch (error) {
    console.error('Error fetching videos:', error);
    
    // Handle specific error cases from backend
    if (error.response?.status === 400) {
      throw new Error('Invalid platform or page parameter');
    }
    if (error.response?.status === 500) {
      throw new Error('Server error occurred while fetching videos');
    }
    
    // Return safe defaults for other errors
    return { 
      videos: [], 
      currentPage: 1, 
      totalPages: 0, 
      totalVideos: 0, 
      hasNextPage: false, 
      hasPreviousPage: false 
    };
  }
};

/**
 * Adds a new video (Admin only)
 * @param {Object} videoData - Video data
 * @param {string} videoData.platform - Required: "youtube", "tiktok", or "instagram"
 * @param {string} videoData.originalUrl - Required: the video's original URL
 * @param {string} videoData.addedBy - Required: the admin user's name
 * @param {string} adminToken - Required: admin authentication token
 * @returns {Promise} - Promise with created video data
 */
export const addVideo = async (videoData, adminToken) => {
  const { platform, originalUrl, addedBy } = videoData;
  
  if (!platform || !originalUrl || !addedBy) {
    throw new Error('Platform, originalUrl, and addedBy are required fields');
  }
  
  if (!['youtube', 'tiktok', 'instagram'].includes(platform.toLowerCase())) {
    throw new Error('Platform must be one of: youtube, tiktok, instagram');
  }
  
  if (!adminToken) {
    throw new Error('Admin token is required');
  }
  
  try {
    const response = await api.post(
      VIDEO_API_ENDPOINT, 
      {
        platform: platform.toLowerCase(),
        originalUrl,
        addedBy
      },
      {
        headers: {
          'X-Admin-Token': adminToken,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error adding video:', error);
    
    // Handle specific error responses
    if (error.response?.status === 400) {
      throw new Error('Missing required fields or invalid platform');
    }
    if (error.response?.status === 401) {
      throw new Error('Admin token is missing');
    }
    if (error.response?.status === 403) {
      throw new Error('Invalid admin token');
    }
    if (error.response?.status === 409) {
      throw new Error('Video with the same platform and URL already exists');
    }
    if (error.response?.status === 500) {
      throw new Error('Server error occurred while adding video');
    }
    
    throw error;
  }
};

/**
 * Refresh video stats (Admin only)
 * @param {string} videoId - The video's document ID in Firestore
 * @param {string} adminToken - Required: admin authentication token
 * @returns {Promise} - Promise with refreshed video stats
 */
export const refreshVideoStats = async (videoId, adminToken) => {
  if (!videoId) {
    throw new Error('Video ID is required');
  }
  
  if (!adminToken) {
    throw new Error('Admin token is required');
  }
  
  try {
    const response = await api.put(
      `${VIDEO_API_ENDPOINT}/${videoId}/refresh`,
      {},
      {
        headers: {
          'X-Admin-Token': adminToken
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error(`Error refreshing video stats for ID ${videoId}:`, error);
    
    // Handle specific error responses
    if (error.response?.status === 400) {
      throw new Error('Video ID is missing or malformed');
    }
    if (error.response?.status === 401) {
      throw new Error('Admin token is missing');
    }
    if (error.response?.status === 403) {
      throw new Error('Invalid admin token');
    }
    if (error.response?.status === 404) {
      throw new Error('Video not found');
    }
    if (error.response?.status === 500) {
      throw new Error('Server error occurred while refreshing video stats');
    }
    
    throw error;
  }
};

// Legacy support - keeping these for backward compatibility but they may not work with new backend
export const getVideoById = async (videoId) => {
  console.warn('getVideoById is deprecated with the new backend API');
  throw new Error('This endpoint is not supported by the new backend API');
};

export const updateVideo = async (videoId, videoData) => {
  console.warn('updateVideo is deprecated with the new backend API');
  throw new Error('This endpoint is not supported by the new backend API');
};

export const deleteVideo = async (videoId) => {
  console.warn('deleteVideo is deprecated with the new backend API');
  throw new Error('This endpoint is not supported by the new backend API');
};


