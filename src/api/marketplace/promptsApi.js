import { api } from '../core/apiConfig';
import { createSvgDataUri } from '../../utils/imageUtils';
import { auth } from '../../utils/firebase';

/**
 * Fetch all prompts with search, filtering, and pagination
 * @param {Object} options - Optional parameters
 * @param {string} options.searchQuery - Search query
 * @param {string} options.category - Filter by category
 * @param {string} options.tags - Filter by tags
 * @param {boolean} options.featured - Filter by featured prompts
 * @param {string} options.createdBy - Filter by creator
 * @param {number} options.limit - Limit the number of results
 * @param {number} options.offset - Offset for pagination
 * @returns {Promise<Object>} - Prompts data with pagination
 */
export const fetchPrompts = async (options = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (options.searchQuery) {
      queryParams.append('searchQuery', options.searchQuery);
    }
    if (options.category && options.category !== 'All') {
      queryParams.append('category', options.category);
    }
    if (options.tags) {
      queryParams.append('tags', options.tags);
    }
    if (options.featured) {
      queryParams.append('featured', 'true');
    }
    if (options.createdBy) {
      queryParams.append('createdBy', options.createdBy);
    }
    if (options.limit) {
      queryParams.append('limit', options.limit.toString());
    }
    if (options.offset) {
      queryParams.append('offset', options.offset.toString());
    }
    
    const queryString = queryParams.toString();
    const url = `/api/prompts${queryString ? `?${queryString}` : ''}`;
    
    console.log(`[Prompts API] Fetching prompts with options:`, options);
    const response = await api.get(url);
    
    // Process the response to ensure we have valid image URLs
    const prompts = response.data?.prompts || [];
    
    // Replace external image URLs with SVG data URIs to prevent 404/403 errors
    const processedPrompts = prompts.map(prompt => {
      const processedPrompt = { ...prompt };
      
      // Determine if we should use fallback image
      const isExternalUrl = processedPrompt.image && (
        processedPrompt.image.startsWith('http') && 
        !processedPrompt.image.includes('aiwaverider.com')
      );
      
      if (!processedPrompt.image || isExternalUrl) {
        // Generate SVG data URI for the prompt
        const bgColor = getPromptColor(processedPrompt.title);
        const displayText = processedPrompt.title || 'Prompt';
        
        processedPrompt.image = createSvgDataUri({
          text: displayText,
          width: 300,
          height: 200,
          bgColor,
          textColor: 'ffffff',
          fontSize: 24
        });
      }
      
      return processedPrompt;
    });
    
    return {
      prompts: processedPrompts,
      totalCount: response.data?.totalCount || 0,
      currentPage: response.data?.currentPage || 1,
      totalPages: response.data?.totalPages || 1,
      hasMore: response.data?.hasMore || false,
      limit: response.data?.limit || 20,
      offset: response.data?.offset || 0,
      searchQuery: response.data?.searchQuery || null,
      filters: response.data?.filters || {},
      fromCache: response.data?.fromCache || false,
      responseTime: response.data?.responseTime || 0
    };
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return {
      prompts: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 1,
      hasMore: false,
      limit: 20,
      offset: 0,
      error: error.message
    };
  }
};

/**
 * Helper function to get a color based on the prompt category/title
 * @param {string} promptTitle - The title of the prompt
 * @returns {string} - Hex color code without the # prefix
 */
export const getPromptColor = (promptTitle = '') => {
  if (!promptTitle) return '4a69bd'; // Default blue
  
  const title = promptTitle.toLowerCase();
  
  // Prompt-specific colors (without #)
  if (title.includes('writing') || title.includes('creative')) {
    return '8b5cf6'; // Purple
  } else if (title.includes('marketing') || title.includes('business')) {
    return '10b981'; // Green
  } else if (title.includes('coding') || title.includes('programming')) {
    return 'f59e0b'; // Amber
  } else if (title.includes('education') || title.includes('learning')) {
    return '3b82f6'; // Blue
  } else if (title.includes('content') || title.includes('copywriting')) {
    return 'ec4899'; // Pink
  } else if (title.includes('productivity') || title.includes('planning')) {
    return '06b6d4'; // Cyan
  } else if (title.includes('social') || title.includes('media')) {
    return 'ef4444'; // Red
  }
  
  return '6366f1'; // Indigo default
};

/**
 * Fetch a single prompt by ID
 * @param {string} id - ID of the prompt to fetch
 * @param {Object} options - Optional parameters
 * @param {boolean} options.skipCache - Skip cache and force fresh data
 * @returns {Promise<Object>} - Prompt data
 */
export const fetchPromptById = async (id, options = {}) => {
  try {
    console.log(`[Prompts API] Fetching prompt with ID: ${id}`);
    
    const queryParams = new URLSearchParams();
    if (options.skipCache) {
      queryParams.append('skipCache', 'true');
    }
    
    const queryString = queryParams.toString();
    const url = `/api/prompts/${id}${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    
    const prompt = response.data?.data || response.data;
    
    if (prompt) {
      // Process image URL if needed
      if (!prompt.image || prompt.image.includes('placeholder')) {
        const bgColor = getPromptColor(prompt.title);
        const displayText = prompt.title || 'Prompt';
        
        prompt.image = createSvgDataUri({
          text: displayText,
          width: 300,
          height: 200,
          bgColor,
          textColor: 'ffffff',
          fontSize: 24
        });
      }
      
      return prompt;
    }
    
    throw new Error('Prompt data not found in response');
  } catch (error) {
    console.error(`Error fetching prompt ${id}:`, error);
    throw error;
  }
};

/**
 * Get prompt count
 * @returns {Promise<number>} - Total count of prompts
 */
export const getPromptCount = async () => {
  try {
    console.log('[Prompts API] Fetching prompt count');
    const response = await api.get('/api/prompts/count');
    return response.data?.totalCount || 0;
  } catch (error) {
    console.error('Error fetching prompt count:', error);
    return 0;
  }
};

/**
 * Get prompt categories with counts
 * @returns {Promise<Array>} - Array of categories with counts
 */
export const getPromptCategories = async () => {
  try {
    console.log('[Prompts API] Fetching prompt categories');
    const response = await api.get('/api/prompts/categories');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching prompt categories:', error);
    return [];
  }
};

/**
 * Get featured prompts
 * @param {number} limit - Maximum number of prompts to return
 * @returns {Promise<Array>} - Array of featured prompts
 */
export const getFeaturedPrompts = async (limit = 10) => {
  try {
    console.log(`[Prompts API] Fetching featured prompts (limit: ${limit})`);
    const response = await api.get(`/api/prompts/featured?limit=${limit}`);
    
    const prompts = response.data?.prompts || [];
    
    // Process images for featured prompts
    return prompts.map(prompt => {
      if (!prompt.image) {
        const bgColor = getPromptColor(prompt.title);
        const displayText = prompt.title || 'Prompt';
        
        prompt.image = createSvgDataUri({
          text: displayText,
          width: 300,
          height: 200,
          bgColor,
          textColor: 'ffffff',
          fontSize: 24
        });
      }
      return prompt;
    });
  } catch (error) {
    console.error('Error fetching featured prompts:', error);
    return [];
  }
};

/**
 * Create a new prompt
 * @param {Object} promptData - Data for the new prompt
 * @param {File|string} imageFile - Optional image file to upload or base64 data URL
 * @returns {Promise<Object>} - Created prompt data
 */
export const createPrompt = async (promptData, imageFile = null) => {
  try {
    console.log('[Prompts API] Creating new prompt:', promptData);
    
    // Check if user is logged in
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Authentication required. Please log in.');
    }
    
    // Get current auth token
    const token = await user.getIdToken(true);
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    // Process prompt data
    const processedPromptData = { ...promptData };
    if (Array.isArray(processedPromptData.tags)) {
      processedPromptData.tags = processedPromptData.tags.map(tag => String(tag));
    } else {
      processedPromptData.tags = [];
    }
    
    if (Array.isArray(processedPromptData.keywords)) {
      processedPromptData.keywords = processedPromptData.keywords.map(kw => String(kw));
    } else {
      processedPromptData.keywords = [];
    }
    
    // Use FormData if we have an image file (File object)
    if (imageFile && imageFile instanceof File) {
      const formData = new FormData();
      
      // Add all prompt data to the form
      Object.keys(processedPromptData).forEach(key => {
        if (key === 'tags' && Array.isArray(processedPromptData[key])) {
          processedPromptData[key].forEach(tag => {
            formData.append('tags', tag);
          });
        } else if (key === 'keywords' && Array.isArray(processedPromptData[key])) {
          processedPromptData[key].forEach(keyword => {
            formData.append('keyword', keyword);
          });
        } else {
          formData.append(key, processedPromptData[key]);
        }
      });
      
      // Add the image file
      formData.append('image', imageFile);
      
      const response = await api.post('/api/prompts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data?.data || response.data;
    } 
    // Use JSON if we have base64 data URL or other binary data
    else if (imageFile && typeof imageFile === 'string' && imageFile.startsWith('data:')) {
      console.log('[Prompts API] Sending base64 image data');
      
      const response = await api.post('/api/prompts', {
        ...processedPromptData,
        image: imageFile
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data?.data || response.data;
    } 
    // No image file, send JSON
    else {
      const response = await api.post('/api/prompts', processedPromptData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data?.data || response.data;
    }
  } catch (error) {
    console.error('Error creating prompt:', error);
    throw error;
  }
};

/**
 * Create a new prompt with base64 image data (for workflows like n8n)
 * @param {Object} promptData - Data for the new prompt
 * @param {string} base64Image - Base64 data URL of the image
 * @returns {Promise<Object>} - Created prompt data
 */
export const createPromptWithBase64Image = async (promptData, base64Image) => {
  return createPrompt(promptData, base64Image);
};

/**
 * Update an existing prompt
 * @param {string} id - ID of the prompt to update
 * @param {Object} promptData - Updated data for the prompt
 * @param {File} imageFile - Optional image file to upload
 * @returns {Promise<Object>} - Updated prompt data
 */
export const updatePrompt = async (id, promptData, imageFile = null) => {
  try {
    console.log(`[Prompts API] Updating prompt ${id}:`, promptData);
    
    // Get current auth token
    const token = await auth.currentUser?.getIdToken(true);
    if (!token) {
      throw new Error('Authentication required. Please log in as an admin.');
    }
    
    // Process prompt data
    const processedPromptData = { ...promptData };
    if (Array.isArray(processedPromptData.tags)) {
      processedPromptData.tags = processedPromptData.tags.map(tag => String(tag));
    }
    if (Array.isArray(processedPromptData.keywords)) {
      processedPromptData.keywords = processedPromptData.keywords.map(kw => String(kw));
    }
    
    // Use FormData if we have an image file
    if (imageFile) {
      const formData = new FormData();
      
      // Add all prompt data to the form
      Object.keys(processedPromptData).forEach(key => {
        if (key === 'tags' && Array.isArray(processedPromptData[key])) {
          processedPromptData[key].forEach(tag => {
            formData.append('tags', tag);
          });
        } else if (key === 'keywords' && Array.isArray(processedPromptData[key])) {
          processedPromptData[key].forEach(keyword => {
            formData.append('keyword', keyword);
          });
        } else {
          formData.append(key, processedPromptData[key]);
        }
      });
      
      // Add the image file
      formData.append('image', imageFile);
      
      const response = await api.put(`/api/prompts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data?.data || response.data;
    } else {
      // No image file, send JSON
      const response = await api.put(`/api/prompts/${id}`, processedPromptData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data?.data || response.data;
    }
  } catch (error) {
    console.error(`Error updating prompt ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a prompt
 * @param {string} id - ID of the prompt to delete
 * @returns {Promise<Object>} - Response with success status
 */
export const deletePrompt = async (id) => {
  try {
    console.log(`[Prompts API] Deleting prompt ${id}`);
    
    // Get current auth token
    const token = await auth.currentUser?.getIdToken(true);
    if (!token) {
      throw new Error('Authentication required. Please log in as an admin.');
    }
    
    const response = await api.delete(`/api/prompts/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return {
      success: true,
      message: 'Prompt deleted successfully',
      ...response.data
    };
  } catch (error) {
    console.error(`Error deleting prompt ${id}:`, error);
    return {
      success: false,
      error: error.message || 'Failed to delete prompt'
    };
  }
};

/**
 * Like/unlike a prompt
 * @param {string} id - ID of the prompt to like/unlike
 * @returns {Promise<Object>} - Response with like status
 */
export const togglePromptLike = async (id) => {
  try {
    console.log(`[Prompts API] Toggling like for prompt ${id}`);
    
    // Get current auth token
    const token = await auth.currentUser?.getIdToken(true);
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    const response = await api.post(`/api/prompts/${id}/like`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error toggling like for prompt ${id}:`, error);
    throw error;
  }
};

/**
 * Get prompts liked by a user
 * @param {string} userId - ID of the user
 * @returns {Promise<Array>} - Array of liked prompts
 */
export const getUserLikedPrompts = async (userId) => {
  try {
    console.log(`[Prompts API] Fetching liked prompts for user ${userId}`);
    
    // Get current auth token
    const token = await auth.currentUser?.getIdToken(true);
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    const response = await api.get(`/api/prompts/user/${userId}/liked`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data?.data || [];
  } catch (error) {
    console.error(`Error fetching liked prompts for user ${userId}:`, error);
    return [];
  }
};

/**
 * Refresh prompts cache (Admin only)
 * @returns {Promise<Object>} - Response with refresh status
 */
export const refreshPromptsCache = async () => {
  try {
    console.log('[Prompts API] Refreshing prompts cache');
    
    // Get current auth token
    const token = await auth.currentUser?.getIdToken(true);
    if (!token) {
      throw new Error('Authentication required. Please log in as an admin.');
    }
    
    const response = await api.post('/api/prompts/cache/refresh', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error refreshing prompts cache:', error);
    throw error;
  }
};