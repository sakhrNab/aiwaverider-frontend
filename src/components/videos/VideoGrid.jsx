import React, { memo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import VideoCard from './VideoCard';
import Pagination from './Pagination';

/**
 * Video Grid Component - Displays videos in a responsive grid with pagination
 */
const VideoGrid = memo(({ 
  videos, 
  loading, 
  error, 
  currentPage,
  totalPages,
  totalVideos,
  hasNextPage, 
  hasPreviousPage, 
  onNext, 
  onPrevious, 
  onGoToPage, 
  onRefresh,
  onVideoPlay,
  platform,
  className = '' 
}) => {
  const { darkMode } = useTheme();

  // Platform-specific styling
  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'youtube':
        return 'text-red-500';
      case 'tiktok':
        return 'text-pink-500';
      case 'instagram':
        return 'text-purple-500';
      default:
        return 'text-blue-500';
    }
  };

  const platformColor = getPlatformColor(platform);

  // Get platform-specific grid classes
  const getGridClasses = (platform) => {
    switch (platform) {
      case 'tiktok':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'; // 3 columns for TikTok
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'; // 4 columns for others
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className={getGridClasses(platform)}>
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className={`
            rounded-2xl overflow-hidden
            ${darkMode 
              ? 'bg-gray-800/40 backdrop-blur-xl border border-gray-700/30' 
              : 'bg-white/40 backdrop-blur-xl border border-white/30'
            }
            animate-pulse
          `}
        >
          <div className={`aspect-video ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
          <div className="p-4 space-y-3">
            <div className={`h-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <div className={`h-3 rounded w-3/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <div className={`h-3 rounded w-1/2 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
          </div>
        </div>
      ))}
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
    <div className={`
      text-center py-12 px-6 rounded-2xl
      ${darkMode 
        ? 'bg-red-900/20 border border-red-800/30 text-red-300' 
        : 'bg-red-50/80 border border-red-200/50 text-red-600'
      }
      backdrop-blur-sm
    `}>
      <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-semibold mb-2">Failed to load videos</h3>
      <p className="text-sm opacity-80 mb-4">{error}</p>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm
            ${darkMode 
              ? 'bg-red-700/50 hover:bg-red-600/60 border border-red-600/50' 
              : 'bg-red-100 hover:bg-red-200 border border-red-300'
            }
            transition-colors duration-200 backdrop-blur-sm
          `}
        >
          Try Again
        </button>
      )}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className={`
      text-center py-16 px-6 rounded-2xl
      ${darkMode 
        ? 'bg-gray-800/40 border border-gray-700/30 text-gray-400' 
        : 'bg-white/40 border border-white/30 text-gray-600'
      }
      backdrop-blur-sm
    `}>
      <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <h3 className="text-xl font-semibold mb-2">No videos found</h3>
      <p className="text-sm opacity-80">
        No {platform} videos are available at the moment.
      </p>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {(totalVideos > 0 || loading) && (
        <div className="flex items-center justify-between">
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {loading ? (
              <span>Loading videos...</span>
            ) : (
              <span>
                Showing {((currentPage - 1) * 50) + 1} - {Math.min(currentPage * 50, totalVideos)} of {totalVideos} videos
              </span>
            )}
          </div>
          
          {onRefresh && !loading && (
            <button
              onClick={onRefresh}
              className={`
                p-2 rounded-lg transition-colors duration-200
                ${darkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800/60' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }
                backdrop-blur-sm
              `}
              title="Refresh videos"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorDisplay />
      ) : videos.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Video Grid */}
          <div className={getGridClasses(platform)}>
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={onVideoPlay}
                className="h-full"
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                onNext={onNext}
                onPrevious={onPrevious}
                onGoToPage={onGoToPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
});

VideoGrid.displayName = 'VideoGrid';

export default VideoGrid; 