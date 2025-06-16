import { useState, useEffect, useCallback, useRef } from 'react';
import VideosService from '../services/videosService';

/**
 * Custom hook for managing video data with pagination and caching
 * @param {string} platform - The platform to fetch videos for
 * @param {number} initialPage - Initial page number
 * @returns {Object} Hook state and methods
 */
export const useVideos = (platform, initialPage = 1) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Cache for storing fetched pages to avoid unnecessary API calls
  const cacheRef = useRef(new Map());
  const isInitialLoad = useRef(true);

  /**
   * Fetch videos for a specific page
   */
  const fetchVideos = useCallback(async (page) => {
    // Don't make API calls if platform is not provided
    if (!platform || typeof platform !== 'string' || platform.trim() === '') {
      setVideos([]);
      setLoading(false);
      setError(null);
      return;
    }

    const cacheKey = `${platform}-${page}`;
    
    // Check cache first
    if (cacheRef.current.has(cacheKey)) {
      const cachedData = cacheRef.current.get(cacheKey);
      setVideos(cachedData.videos);
      setTotalPages(cachedData.totalPages);
      setTotalVideos(cachedData.totalVideos);
      setHasNextPage(cachedData.hasNextPage);
      setHasPreviousPage(cachedData.hasPreviousPage);
      setCurrentPage(page);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await VideosService.getVideosByPlatform(platform, page);
      
      const videoData = {
        videos: response.videos || [],
        totalPages: response.totalPages || 0,
        totalVideos: response.totalVideos || 0,
        hasNextPage: response.hasNextPage || false,
        hasPreviousPage: response.hasPreviousPage || false
      };

      // Cache the response
      cacheRef.current.set(cacheKey, videoData);

      // Update state
      setVideos(videoData.videos);
      setTotalPages(videoData.totalPages);
      setTotalVideos(videoData.totalVideos);
      setHasNextPage(videoData.hasNextPage);
      setHasPreviousPage(videoData.hasPreviousPage);
      setCurrentPage(page);

    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${platform} videos:`, err);
      // Set empty state on error
      setVideos([]);
      setTotalPages(0);
      setTotalVideos(0);
      setHasNextPage(false);
      setHasPreviousPage(false);
    } finally {
      setLoading(false);
    }
  }, [platform]);

  /**
   * Navigate to next page
   */
  const nextPage = useCallback(() => {
    if (hasNextPage) {
      const newPage = currentPage + 1;
      fetchVideos(newPage);
    }
  }, [currentPage, hasNextPage, fetchVideos]);

  /**
   * Navigate to previous page
   */
  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      const newPage = currentPage - 1;
      fetchVideos(newPage);
    }
  }, [currentPage, hasPreviousPage, fetchVideos]);

  /**
   * Go to specific page
   */
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      fetchVideos(page);
    }
  }, [totalPages, fetchVideos]);

  /**
   * Refresh current page (clear cache)
   */
  const refresh = useCallback(() => {
    if (!platform) return;
    
    const cacheKey = `${platform}-${currentPage}`;
    cacheRef.current.delete(cacheKey);
    fetchVideos(currentPage);
  }, [platform, currentPage, fetchVideos]);

  /**
   * Clear all cached data
   */
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  // Initial fetch - only when platform is valid
  useEffect(() => {
    if (platform && typeof platform === 'string' && platform.trim() !== '' && isInitialLoad.current) {
      isInitialLoad.current = false;
      fetchVideos(initialPage);
    }
  }, [platform, initialPage, fetchVideos]);

  // Reset when platform changes
  useEffect(() => {
    if (platform && typeof platform === 'string' && platform.trim() !== '') {
      setCurrentPage(1);
      isInitialLoad.current = true;
      setError(null);
    } else {
      // Reset state for invalid platform
      setVideos([]);
      setLoading(false);
      setError(null);
      setTotalPages(0);
      setTotalVideos(0);
      setHasNextPage(false);
      setHasPreviousPage(false);
      setCurrentPage(1);
    }
  }, [platform]);

  return {
    // Data
    videos,
    loading,
    error,
    
    // Pagination
    currentPage,
    totalPages,
    totalVideos,
    hasNextPage,
    hasPreviousPage,
    
    // Actions
    nextPage,
    previousPage,
    goToPage,
    refresh,
    clearCache,
    
    // Derived state
    isEmpty: videos.length === 0 && !loading,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages
  };
};

export default useVideos; 