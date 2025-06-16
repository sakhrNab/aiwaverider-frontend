import apiClient from './apiClient';
import { auth } from '../utils/firebase';

// Mock data for development/fallback when backend is not available
const MOCK_VIDEOS = {
  youtube: [],
  tiktok: [],
  instagram: []
};

/**
 * Get Firebase auth token for admin operations
 * @returns {Promise<string|null>} Firebase ID token
 */
const getAdminToken = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('No authenticated user found');
      return null;
    }
    
    console.log('Current user:', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    });
    
    // Get fresh Firebase ID token
    const token = await user.getIdToken(true);
    console.log('Firebase token obtained, length:', token?.length);
    return token;
  } catch (error) {
    console.error('Error getting admin token:', error);
    return null;
  }
};

/**
 * Videos Service - Handles API calls for video data
 */
class VideosService {
  /**
   * Fetch videos by platform with pagination
   * @param {string} platform - 'youtube', 'tiktok', or 'instagram'
   * @param {number} page - Page number (defaults to 1)
   * @returns {Promise<Object>} API response with videos and pagination data
   */
  static async getVideosByPlatform(platform, page = 1) {
    // Validate platform parameter
    if (!platform || typeof platform !== 'string' || platform.trim() === '') {
      console.warn('Platform parameter is required and must be a non-empty string');
      return {
        videos: MOCK_VIDEOS[platform] || [],
        totalPages: 1,
        totalVideos: 0,
        currentPage: page,
        hasNextPage: false,
        hasPreviousPage: false
      };
    }

    // Validate platform is one of the supported ones
    const validPlatforms = ['youtube', 'tiktok', 'instagram'];
    if (!validPlatforms.includes(platform.toLowerCase())) {
      console.warn(`Invalid platform: ${platform}. Must be one of: ${validPlatforms.join(', ')}`);
      return {
        videos: [],
        totalPages: 1,
        totalVideos: 0,
        currentPage: page,
        hasNextPage: false,
        hasPreviousPage: false
      };
    }

    try {
      // Construct URL with query parameters manually
      const searchParams = new URLSearchParams({
        platform: platform.toLowerCase(),
        page: Math.max(1, page)
      });
      const url = `/api/videos?${searchParams.toString()}`;
      
      const response = await apiClient.get(url);
      
      return response;
    } catch (error) {
      console.error(`Error fetching ${platform} videos:`, error);
      
      // Check if it's a backend unavailable error (network or 400/500 errors)
      const isBackendUnavailable = 
        error.message.includes('fetch') || 
        error.message.includes('Network') ||
        error.message.includes('400') ||
        error.message.includes('500') ||
        error.message.includes('platform query parameter is required');
      
      if (isBackendUnavailable) {
        console.log(`Backend not available for ${platform} videos, returning empty data`);
        return {
          videos: MOCK_VIDEOS[platform] || [],
          totalPages: 1,
          totalVideos: 0,
          currentPage: page,
          hasNextPage: false,
          hasPreviousPage: false
        };
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Add a new video (Admin only)
   * @param {Object} videoData - Video data to add
   * @returns {Promise<Object>} API response with added video data
   */
  static async addVideo(videoData) {
    try {
      console.log('=== VideosService.addVideo ===');
      console.log('Input videoData:', JSON.stringify(videoData, null, 2));
      
      // Get Firebase auth token
      const adminToken = await getAdminToken();
      if (!adminToken) {
        throw new Error('Authentication required. Please log in as an admin.');
      }

      console.log('Firebase token obtained, length:', adminToken.length);
      
      // Prepare the request payload
      const payload = {
        ...videoData,
        // Ensure platform is lowercase
        platform: videoData.platform?.toLowerCase(),
        // Ensure required fields are present
        originalUrl: videoData.originalUrl?.trim(),
        addedBy: videoData.addedBy || 'Admin'
      };
      
      // Remove empty/undefined fields
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === null || payload[key] === '') {
          delete payload[key];
        }
      });
      
      console.log('Final payload being sent:', JSON.stringify(payload, null, 2));
      
      const response = await apiClient.post('/api/videos', payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': adminToken
        }
      });
      
      console.log('Video added successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('=== Error adding video ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error status:', error.status);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error response headers:', error.response?.headers);
      
      // Try to extract more meaningful error message
      let errorMessage = 'Request failed with status code 400';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      }
      
      throw new Error(`Failed to add video: ${errorMessage}`);
    }
  }

  /**
   * Refresh video stats (Admin only)
   * @param {string} videoId - Video document ID
   * @returns {Promise<Object>} API response with updated stats
   */
  static async refreshVideoStats(videoId) {
    try {
      // Get Firebase auth token
      const adminToken = await getAdminToken();
      if (!adminToken) {
        throw new Error('Authentication required. Please log in as an admin.');
      }

      const response = await apiClient.put(`/api/videos/${videoId}/refresh`, null, {
        headers: {
          'X-Admin-Token': adminToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error refreshing video stats:', error);
      throw new Error(`Failed to refresh video stats: ${error.message}`);
    }
  }

  /**
   * Get all platforms with their video counts
   * @returns {Promise<Object>} Summary of videos by platform
   */
  static async getVideosSummary() {
    try {
      const platforms = ['youtube', 'tiktok', 'instagram'];
      const summaryPromises = platforms.map(async (platform) => {
        try {
          const response = await this.getVideosByPlatform(platform, 1);
          return {
            platform,
            totalVideos: response.totalVideos || 0,
            totalPages: response.totalPages || 0
          };
        } catch (error) {
          console.warn(`Failed to get summary for ${platform}:`, error);
          return {
            platform,
            totalVideos: 0,
            totalPages: 0
          };
        }
      });

      const summaries = await Promise.all(summaryPromises);
      return summaries.reduce((acc, summary) => {
        acc[summary.platform] = summary;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error fetching videos summary:', error);
      throw new Error(`Failed to fetch videos summary: ${error.message}`);
    }
  }
}

export default VideosService; 