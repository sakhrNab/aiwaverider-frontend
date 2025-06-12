import { api } from '../core/apiConfig';

const VIDEO_API_ENDPOINT = '/api/videos';

/**
 * Fetches videos with pagination and filtering options
 * @param {Object} options - Query parameters
 * @param {number} options.page - Page number for pagination
 * @param {number} options.limit - Number of videos per page
 * @param {string} options.category - Filter by category
 * @param {string} options.platform - Filter by platform
 * @param {string} options.user - Filter by user
 * @returns {Promise} - Promise with paginated video data
 */
export const getVideos = async (options = {}) => {
  try {
    const response = await api.get(VIDEO_API_ENDPOINT, { params: options });
    
    // Ensure we have a standardized response format even if API structure changes
    return {
      data: response.data?.videos || [],
      totalPages: response.data?.pagination?.totalPages || 1,
      totalCount: response.data?.pagination?.totalVideos || 0,
      page: response.data?.pagination?.page || 1,
      limit: response.data?.pagination?.limit || 10
    };
  } catch (error) {
    console.error('Error fetching videos:', error);
    // Return a safe default structure on error
    return { data: [], totalPages: 0, totalCount: 0, page: 1, limit: 10 };
  }
};

/**
 * Fetches a single video by ID
 * @param {string} videoId - The ID of the video to fetch
 * @returns {Promise} - Promise with video data
 */
export const getVideoById = async (videoId) => {
  try {
    const response = await api.get(`${VIDEO_API_ENDPOINT}/${videoId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching video with ID ${videoId}:`, error);
    throw error;
  }
};

/**
 * Adds a new video (Admin only)
 * @param {Object} videoData - Video data including URL and metadata
 * @returns {Promise} - Promise with created video data
 */
export const addVideo = async (videoData) => {
  try {
    const response = await api.post(VIDEO_API_ENDPOINT, videoData);
    return response.data;
  } catch (error) {
    console.error('Error adding video:', error);
    throw error;
  }
};

/**
 * Updates an existing video (Admin only)
 * @param {string} videoId - The ID of the video to update
 * @param {Object} videoData - New video data
 * @returns {Promise} - Promise with updated video data
 */
export const updateVideo = async (videoId, videoData) => {
  try {
    const response = await api.put(`${VIDEO_API_ENDPOINT}/${videoId}`, videoData);
    return response.data;
  } catch (error) {
    console.error(`Error updating video with ID ${videoId}:`, error);
    throw error;
  }
};

/**
 * Deletes a video (Admin only)
 * @param {string} videoId - The ID of the video to delete
 * @returns {Promise} - Promise with deletion confirmation
 */
export const deleteVideo = async (videoId) => {
  try {
    const response = await api.delete(`${VIDEO_API_ENDPOINT}/${videoId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting video with ID ${videoId}:`, error);
    throw error;
  }
};


