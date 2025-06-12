// src/api/content/tiktokService.js
import axios from 'axios';

/**
 * Direct TikTok metadata fetching service using RapidAPI
 * This is used as a fallback when backend metadata is not available
 */

// RapidAPI TikTok endpoint 
const RAPIDAPI_ENDPOINT = 'https://tiktok-video-no-watermark2.p.rapidapi.com/';
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

// Flag to avoid repeated console warnings
let hasWarnedMissingKey = false;

/**
 * Generate a valid TikTok placeholder image URL
 * @param {string} videoId - TikTok video ID 
 * @param {string} status - Status text to show (loading, error, etc)
 * @returns {string} - Placeholder image URL
 */
export const getTikTokPlaceholderUrl = (videoId, status = 'TikTok Video') => {
  // If we have a videoId, make it part of the text to help identify videos
  const displayText = videoId ? 
    `${status} ${videoId.substring(0, 8)}...` :
    status;
    
  return `https://placehold.co/1080x1920/1d1f30/ffffff?text=${encodeURIComponent(displayText)}&font=montserrat`;
};

/**
 * Fetch TikTok video metadata directly
 * @param {string} videoId - TikTok video ID
 * @param {string} username - TikTok username if available
 * @returns {Promise} - Promise with TikTok video metadata
 */
export const fetchTikTokMetadata = async (videoId, username = '') => {
  if (!videoId) {
    console.warn('[TikTokService] Cannot fetch metadata: Missing videoId');
    return null;
  }
  
  // Check if we have the API key
  if (!RAPIDAPI_KEY) {
    if (!hasWarnedMissingKey) {
      console.warn('[TikTokService] Missing VITE_RAPIDAPI_KEY environment variable');
      hasWarnedMissingKey = true;
    }
    return null;
  }
  
  try {
    // Construct a proper TikTok URL
    const url = username 
      ? `https://www.tiktok.com/@${username}/video/${videoId}`
      : `https://www.tiktok.com/video/${videoId}`;
    
    console.log(`[TikTokService] Fetching metadata for: ${url}`);
    
    const options = {
      method: 'GET',
      url: RAPIDAPI_ENDPOINT,
      params: {
        url: url,
        hd: '1'
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
      }
    };
    
    const response = await axios.request(options);
    
    // Check if we have valid data
    if (response.data?.data) {
      console.log('[TikTokService] Successfully fetched metadata');
      
      // Log available thumbnail URLs for debugging
      const thumbnails = {
        origin_cover: response.data.data.origin_cover,
        cover: response.data.data.cover,
        dynamic_cover: response.data.data.dynamic_cover,
        author_avatar: response.data.data.author?.avatar
      };
      console.log('[TikTokService] Available thumbnails:', thumbnails);
      
      return response.data.data;
    }
    
    console.warn('[TikTokService] Response missing data:', response.data);
    return null;
  } catch (error) {
    // More specific error logging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`[TikTokService] API Error (${error.response.status}):`, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('[TikTokService] Network Error: No response received');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('[TikTokService] Error:', error.message);
    }
    return null;
  }
};

/**
 * Extract the best thumbnail URL from TikTok metadata
 * @param {Object} metadata - TikTok metadata from the API
 * @returns {string} - Best thumbnail URL
 */
export const getBestThumbnailUrl = (metadata) => {
  if (!metadata) return null;
  
  // Try to get the origin cover first (usually best quality)
  if (metadata.origin_cover) {
    return metadata.origin_cover;
  }
  
  // Try to get cover data
  if (metadata.cover) {
    return metadata.cover;
  }
  
  // Try dynamic cover
  if (metadata.dynamic_cover) {
    return metadata.dynamic_cover;
  }
  
  // Try author avatar as last resort
  if (metadata.author && metadata.author.avatar) {
    return metadata.author.avatar;
  }
  
  return null;
};
