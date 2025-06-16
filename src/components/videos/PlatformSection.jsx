import React, { memo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useVideos } from '../../hooks/useVideos';
import VideoGrid from './VideoGrid';

// Platform SVG Icons
const PlatformIcons = {
  youtube: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
};

/**
 * Platform Section Component - Displays videos for a specific platform
 */
const PlatformSection = memo(({ platform, onVideoPlay, className = '' }) => {
  const { darkMode } = useTheme();
  const {
    videos,
    loading,
    error,
    currentPage,
    totalPages,
    totalVideos,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    refresh,
    isEmpty
  } = useVideos(platform);

  // Platform-specific styling and metadata
  const getPlatformConfig = (platform) => {
    switch (platform) {
      case 'youtube':
        return {
          name: 'YouTube',
          icon: PlatformIcons.youtube,
          description: 'Trending videos from YouTube creators',
          gradient: 'from-red-500/20 via-red-600/10 to-transparent',
          accentColor: 'text-red-500',
          borderColor: darkMode ? 'border-red-500/20' : 'border-red-300/30'
        };
      case 'tiktok':
        return {
          name: 'TikTok',
          icon: PlatformIcons.tiktok,
          description: 'Viral videos from TikTok',
          gradient: 'from-pink-500/20 via-purple-600/10 to-transparent',
          accentColor: 'text-pink-500',
          borderColor: darkMode ? 'border-pink-500/20' : 'border-pink-300/30'
        };
      case 'instagram':
        return {
          name: 'Instagram',
          icon: PlatformIcons.instagram,
          description: 'Popular reels and videos from Instagram',
          gradient: 'from-purple-500/20 via-pink-600/10 to-transparent',
          accentColor: 'text-purple-500',
          borderColor: darkMode ? 'border-purple-500/20' : 'border-purple-300/30'
        };
      default:
        return {
          name: platform,
          icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          ),
          description: 'Videos from this platform',
          gradient: 'from-blue-500/20 via-cyan-600/10 to-transparent',
          accentColor: 'text-blue-500',
          borderColor: darkMode ? 'border-blue-500/20' : 'border-blue-300/30'
        };
    }
  };

  const config = getPlatformConfig(platform);

  return (
    <section className={`space-y-6 ${className}`}>
      {/* Platform Header */}
      <div className={`
        relative overflow-hidden rounded-2xl p-6
        ${darkMode 
          ? 'bg-gray-800/40 backdrop-blur-xl border border-gray-700/30' 
          : 'bg-white/40 backdrop-blur-xl border border-white/30'
        }
        ${config.borderColor}
      `}>
        {/* Background gradient */}
        <div className={`
          absolute inset-0 bg-gradient-to-r ${config.gradient}
          opacity-50
        `} />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center ${config.accentColor}
                ${darkMode 
                  ? 'bg-gray-900/50 backdrop-blur-sm' 
                  : 'bg-white/50 backdrop-blur-sm'
                }
                border ${darkMode ? 'border-gray-700/50' : 'border-white/50'}
              `}>
                {config.icon}
              </div>
              <div>
                <h2 className={`
                  text-2xl font-bold
                  ${darkMode ? 'text-white' : 'text-gray-900'}
                `}>
                  {config.name}
                </h2>
                <p className={`
                  text-sm
                  ${darkMode ? 'text-gray-400' : 'text-gray-600'}
                `}>
                  {config.description}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className={`
              flex items-center space-x-4 text-sm
              ${darkMode ? 'text-gray-400' : 'text-gray-600'}
            `}>
              {!loading && totalVideos > 0 && (
                <div className="text-right">
                  <div className={`font-bold text-lg ${config.accentColor}`}>
                    {totalVideos.toLocaleString()}
                  </div>
                  <div className="text-xs">
                    {totalVideos === 1 ? 'video' : 'videos'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={refresh}
              disabled={loading}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                ${darkMode 
                  ? 'bg-gray-700/50 hover:bg-gray-600/60 text-gray-300 hover:text-white border border-gray-600/50' 
                  : 'bg-white/50 hover:bg-white/70 text-gray-700 hover:text-gray-900 border border-gray-300/50'
                }
                backdrop-blur-sm
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
              `}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </div>
              )}
            </button>

            {totalPages > 1 && (
              <div className={`
                text-xs px-3 py-2 rounded-lg
                ${darkMode 
                  ? 'bg-gray-700/30 text-gray-400' 
                  : 'bg-white/30 text-gray-600'
                }
                backdrop-blur-sm
              `}>
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <VideoGrid
        videos={videos}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalVideos={totalVideos}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onNext={nextPage}
        onPrevious={previousPage}
        onGoToPage={goToPage}
        onRefresh={refresh}
        onVideoPlay={onVideoPlay}
        platform={platform}
      />
    </section>
  );
});

PlatformSection.displayName = 'PlatformSection';

export default PlatformSection; 