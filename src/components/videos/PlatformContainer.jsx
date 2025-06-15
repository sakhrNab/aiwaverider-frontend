import React, { memo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaYoutube, FaTiktok, FaInstagram, FaSpinner, FaSync  , FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import GlassyVideoCard from './GlassyVideoCard';
import { useTheme } from '../../contexts/ThemeContext';
import { useVideos } from '../../hooks/useVideos';

const platformConfig = {
  youtube: {
    icon: FaYoutube,
    color: 'text-red-600',
    bgGradient: 'from-red-500/20 via-red-600/10 to-red-700/20',
    borderColor: 'border-red-500/30',
    name: 'YouTube'
  },
  tiktok: {
    icon: FaTiktok,
    color: 'text-black dark:text-white',
    bgGradient: 'from-gray-800/20 via-gray-900/10 to-black/20',
    borderColor: 'border-gray-500/30',
    name: 'TikTok'
  },
  instagram: {
    icon: FaInstagram,
    color: 'text-purple-600',
    bgGradient: 'from-purple-500/20 via-pink-500/10 to-purple-700/20',
    borderColor: 'border-purple-500/30',
    name: 'Instagram'
  }
};

const PlatformContainer = memo(({ 
  platform, 
  onRefreshVideo, 
  className = '',
  showPagination = true,
  itemsPerPage = 50 
}) => {
  const { darkMode } = useTheme();
  const loadMoreRef = useRef(null);
  
  const {
    videos,
    currentPage,
    totalPages,
    totalVideos,
    loading,
    error,
    isEmpty,
    canLoadMore,
    goToPage,
    loadMore,
    refresh
  } = useVideos(platform);

  const config = platformConfig[platform] || platformConfig.youtube;
  const PlatformIcon = config.icon;

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!canLoadMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [canLoadMore, loading, loadMore]);

  // Handle video refresh
  const handleVideoRefresh = useCallback((videoId) => {
    if (onRefreshVideo) {
      onRefreshVideo(videoId, platform);
    }
  }, [onRefreshVideo, platform]);

  // Handle page navigation
  const handlePageChange = useCallback((page) => {
    goToPage(page);
  }, [goToPage]);

  // Generate page numbers for pagination
  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${className} rounded-2xl p-8 text-center ${
          darkMode 
            ? 'bg-red-900/20 border border-red-800/30' 
            : 'bg-red-50 border border-red-200'
        }`}
      >
        <div className={`text-4xl mb-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
          <PlatformIcon className="mx-auto" />
        </div>
        <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {config.name} Videos
        </h3>
        <p className={`mb-4 ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
          {error}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={refresh}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            darkMode
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          <FaSync  className="inline mr-2" />
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${className} rounded-2xl backdrop-blur-md border ${
        darkMode 
          ? `bg-gradient-to-br ${config.bgGradient} ${config.borderColor} border-white/10` 
          : `bg-gradient-to-br ${config.bgGradient} ${config.borderColor} border-white/20`
      } overflow-hidden`}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full ${config.color} ${
              darkMode ? 'bg-white/10' : 'bg-black/5'
            }`}>
              <PlatformIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {config.name} Videos
              </h2>
              <p className={`text-sm opacity-70 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {totalVideos > 0 ? `${totalVideos} videos available` : 'Loading...'}
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refresh}
            disabled={loading}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-black/5 hover:bg-black/10 text-gray-700'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaSync  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isEmpty ? (
          <div className="text-center py-12">
            <PlatformIcon className={`w-16 h-16 mx-auto mb-4 opacity-30 ${config.color}`} />
            <p className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No {config.name} videos available
            </p>
            <p className={`opacity-60 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Check back later for new content
            </p>
          </div>
        ) : (
          <>
            {/* Video Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id || `${platform}-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ 
                      delay: index * 0.05,
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                  >
                    <GlassyVideoCard 
                      video={video} 
                      onRefresh={handleVideoRefresh} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Loading indicator for lazy loading */}
            {canLoadMore && (
              <div 
                ref={loadMoreRef}
                className="flex justify-center py-8"
              >
                {loading && (
                  <div className="flex items-center space-x-2">
                    <FaSpinner className="animate-spin" />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Loading more videos...
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {showPagination && totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center space-y-4">
                <div className={`text-sm opacity-70 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Page {currentPage} of {totalPages}
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      currentPage === 1 || loading
                        ? 'opacity-50 cursor-not-allowed'
                        : darkMode
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-black/5 hover:bg-black/10 text-gray-700'
                    }`}
                  >
                    <FaChevronLeft className="mr-1" /> Prev
                  </motion.button>
                  
                  {getPageNumbers().map((page) => (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? config.color.includes('red')
                            ? 'bg-red-600 text-white'
                            : config.color.includes('purple')
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-white'
                          : darkMode
                          ? 'bg-white/10 hover:bg-white/20 text-white'
                          : 'bg-black/5 hover:bg-black/10 text-gray-700'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {page}
                    </motion.button>
                  ))}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      currentPage === totalPages || loading
                        ? 'opacity-50 cursor-not-allowed'
                        : darkMode
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-black/5 hover:bg-black/10 text-gray-700'
                    }`}
                  >
                    Next <FaChevronRight className="ml-1" />
                  </motion.button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
});

PlatformContainer.displayName = 'PlatformContainer';

export default PlatformContainer; 