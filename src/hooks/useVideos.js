import { useState, useEffect, useCallback, useMemo } from 'react';
import { getVideos } from '../api/content/videoService';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for managing video data by platform
 * @param {string} platform - The platform to fetch videos for ('youtube', 'tiktok', 'instagram')
 * @returns {Object} Video data and control functions
 */
export const useVideos = (platform) => {
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Memoize the fetchVideos function to prevent unnecessary re-renders
  const fetchVideos = useCallback(async (page = 1, append = false) => {
    if (!platform) {
      setError('Platform is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getVideos({ platform, page });
      
      if (append) {
        // For lazy loading - append new videos to existing ones
        setVideos(prevVideos => [...prevVideos, ...response.videos]);
      } else {
        // For pagination - replace videos
        setVideos(response.videos);
      }
      
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalVideos(response.totalVideos);
      setHasNextPage(response.hasNextPage);
      setHasPreviousPage(response.hasPreviousPage);
      
    } catch (err) {
      const errorMessage = err.message || `Failed to load ${platform} videos`;
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(`Error fetching ${platform} videos:`, err);
    } finally {
      setLoading(false);
      if (initialLoad) {
        setInitialLoad(false);
      }
    }
  }, [platform, initialLoad]);

  // Initial load
  useEffect(() => {
    if (platform) {
      fetchVideos(1);
    }
  }, [platform, fetchVideos]);

  // Function to load next page (for lazy loading)
  const loadMore = useCallback(() => {
    if (hasNextPage && !loading) {
      fetchVideos(currentPage + 1, true);
    }
  }, [hasNextPage, loading, currentPage, fetchVideos]);

  // Function to go to specific page (for pagination)
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !loading) {
      fetchVideos(page, false);
      
      // Scroll to top smoothly when changing pages
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [totalPages, currentPage, loading, fetchVideos]);

  // Function to refresh current page
  const refresh = useCallback(() => {
    if (!loading) {
      fetchVideos(currentPage, false);
    }
  }, [loading, currentPage, fetchVideos]);

  // Function to reset to first page
  const reset = useCallback(() => {
    setCurrentPage(1);
    setVideos([]);
    fetchVideos(1, false);
  }, [fetchVideos]);

  // Memoize the return object to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    // Data
    videos,
    currentPage,
    totalPages,
    totalVideos,
    hasNextPage,
    hasPreviousPage,
    
    // State
    loading,
    error,
    initialLoad,
    
    // Actions
    loadMore,
    goToPage,
    refresh,
    reset,
    
    // Computed values
    isEmpty: videos.length === 0 && !loading && !initialLoad,
    isLastPage: currentPage === totalPages,
    isFirstPage: currentPage === 1,
    canLoadMore: hasNextPage && !loading,
  }), [
    videos, currentPage, totalPages, totalVideos, hasNextPage, hasPreviousPage,
    loading, error, initialLoad, loadMore, goToPage, refresh, reset
  ]);

  return returnValue;
};

/**
 * Hook for managing multiple platform video data
 * @returns {Object} Video data for all platforms
 */
export const useAllPlatformVideos = () => {
  const youtubeVideos = useVideos('youtube');
  const tiktokVideos = useVideos('tiktok');
  const instagramVideos = useVideos('instagram');

  const isAnyLoading = useMemo(() => 
    youtubeVideos.loading || tiktokVideos.loading || instagramVideos.loading,
    [youtubeVideos.loading, tiktokVideos.loading, instagramVideos.loading]
  );

  const hasAnyError = useMemo(() => 
    youtubeVideos.error || tiktokVideos.error || instagramVideos.error,
    [youtubeVideos.error, tiktokVideos.error, instagramVideos.error]
  );

  const totalVideosCount = useMemo(() => 
    youtubeVideos.totalVideos + tiktokVideos.totalVideos + instagramVideos.totalVideos,
    [youtubeVideos.totalVideos, tiktokVideos.totalVideos, instagramVideos.totalVideos]
  );

  const refreshAll = useCallback(() => {
    youtubeVideos.refresh();
    tiktokVideos.refresh();
    instagramVideos.refresh();
  }, [youtubeVideos.refresh, tiktokVideos.refresh, instagramVideos.refresh]);

  return {
    youtube: youtubeVideos,
    tiktok: tiktokVideos,
    instagram: instagramVideos,
    
    // Aggregate data
    isAnyLoading,
    hasAnyError,
    totalVideosCount,
    refreshAll,
  };
}; 