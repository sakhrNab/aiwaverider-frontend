import React, { useState, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLazyImage } from '../../hooks/useLazyLoading';
import { ArrowTopRightOnSquareIcon, PlayIcon, EyeIcon, HeartIcon } from '@heroicons/react/24/outline';

// Platform SVG Icons
const PlatformIcons = {
  youtube: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
};

// Utility functions to extract video IDs and create embed URLs
const getYouTubeVideoId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const getTikTokVideoId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const regex = /tiktok\.com\/.*\/video\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const getInstagramVideoId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const regex = /instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

/**
 * Video Card Component with glassy design and lazy loading
 */
const VideoCard = ({ video, onPlay, className = '' }) => {
  const { darkMode } = useTheme();
  
  const {
    targetRef,
    imageSrc,
    imageLoading,
    imageError
  } = useLazyImage(video.thumbnailUrl, {
    threshold: 0.1,
    rootMargin: '100px'
  });

  // For Instagram, always show embed directly
  const [showEmbed, setShowEmbed] = useState(video.platform.toLowerCase() === 'instagram');
  const [embedError, setEmbedError] = useState(false);

  const handlePlayClick = useCallback(() => {
    setShowEmbed(true);
    setEmbedError(false);
  }, []);

  const handleEmbedError = useCallback(() => {
    setEmbedError(true);
  }, []);

  const renderEmbeddedPlayer = () => {
    if (!showEmbed || embedError) return null;

    const { platform, originalUrl } = video;
    
    // Safety check for originalUrl
    if (!originalUrl || typeof originalUrl !== 'string') {
      setEmbedError(true);
      return null;
    }

    switch (platform.toLowerCase()) {
      case 'youtube': {
        const videoId = getYouTubeVideoId(originalUrl);
        if (!videoId) {
          setEmbedError(true);
          return null;
        }
        return (
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
              onError={handleEmbedError}
            />
          </div>
        );
      }
      
      case 'tiktok': {
        const videoId = getTikTokVideoId(originalUrl);
        if (!videoId) {
          setEmbedError(true);
          return null;
        }
        return (
          <div className="aspect-[9/16] w-full max-w-lg mx-auto">
            <iframe
              src={`https://www.tiktok.com/embed/v2/${videoId}?autoplay=1`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
              onError={handleEmbedError}
              style={{ minHeight: '700px' }}
            />
          </div>
        );
      }
      
      case 'instagram': {
        const videoId = getInstagramVideoId(originalUrl);
        if (!videoId) {
          setEmbedError(true);
          return null;
        }
        
        // Determine if it's a reel (vertical) or post (square) based on URL
        const isReel = originalUrl.includes('/reel/');
        const aspectClass = isReel ? 'aspect-[9/16]' : 'aspect-square';
        const maxWidth = isReel ? 'max-w-md' : 'max-w-lg';
        
        return (
          <div className={`${aspectClass} ${maxWidth} mx-auto w-full relative`}>
            <iframe
              src={`https://www.instagram.com/p/${videoId}/embed/`}
              title={video.title}
              frameBorder="0"
              scrolling="no"
              allowtransparency="true"
              allow="encrypted-media"
              className="w-full h-full rounded-lg border-0"
              onError={handleEmbedError}
              style={{ 
                minHeight: isReel ? '700px' : '600px'
              }}
            />
            {/* Message overlay for Instagram - for external access */}
            <div className={`
              absolute bottom-4 left-4 right-4 z-20 p-3 rounded-lg text-sm
              ${darkMode ? 'bg-gray-900/90 text-white' : 'bg-white/90 text-gray-900'}
              backdrop-blur-sm border
              ${darkMode ? 'border-gray-700/50' : 'border-white/50'}
              flex items-center justify-between
            `}>
              <span>To like, comment, or share</span>
              <button
                onClick={handleExternalLinkClick}
                className={`
                  px-3 py-1 rounded-md text-xs font-medium
                  ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'}
                  text-white transition-colors
                `}
              >
                Open Instagram
              </button>
            </div>
          </div>
        );
      }
      
      default:
        setEmbedError(true);
        return null;
    }
  };

  // Platform-specific styling
  const getPlatformStyles = (platform) => {
    switch (platform) {
      case 'youtube':
        return {
          accent: 'from-red-500/20 to-red-600/20',
          icon: PlatformIcons.youtube,
          color: 'text-red-500'
        };
      case 'tiktok':
        return {
          accent: 'from-pink-500/20 to-purple-600/20',
          icon: PlatformIcons.tiktok,
          color: 'text-pink-500'
        };
      case 'instagram':
        return {
          accent: 'from-purple-500/20 to-pink-600/20',
          icon: PlatformIcons.instagram,
          color: 'text-purple-500'
        };
      default:
        return {
          accent: 'from-blue-500/20 to-cyan-600/20',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          ),
          color: 'text-blue-500'
        };
    }
  };

  const platformStyles = getPlatformStyles(video.platform);

  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString() || '0';
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
  };

  const handleCardClick = (e) => {
    // For Instagram, allow the embedded video to work normally
    // The iframe will handle its own interactions
    if (video.platform.toLowerCase() === 'instagram') {
      // Don't prevent default - let Instagram iframe handle clicks
      return;
    }
    
    // For other platforms, first try to show embedded player
    if (!showEmbed && !embedError) {
      setShowEmbed(true);
      setEmbedError(false);
      return;
    }
    
    // If embed failed or already showing, use onPlay callback or open external link
    if (onPlay) {
      onPlay(video);
    } else {
      // Default: open original URL
      window.open(video.originalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleExternalLinkClick = (e) => {
    e.stopPropagation();
    window.open(video.originalUrl, '_blank', 'noopener,noreferrer');
  };

  // For Instagram, adjust the card styling and layout
  const isInstagram = video.platform.toLowerCase() === 'instagram';

  return (
    <div
      ref={targetRef}
      className={`
        group relative overflow-hidden rounded-2xl
        ${isInstagram ? '' : 'cursor-pointer'}
        transform transition-all duration-300 ease-out
        ${isInstagram ? '' : 'hover:scale-105 hover:-translate-y-2'}
        ${darkMode 
          ? 'bg-gray-800/40 backdrop-blur-xl border border-gray-700/30' 
          : 'bg-white/40 backdrop-blur-xl border border-white/30'
        }
        shadow-lg hover:shadow-2xl
        ${className}
      `}
      onClick={!isInstagram ? handleCardClick : undefined}
    >
      {/* Platform Badge - Hide when video is playing */}
      {!showEmbed && (
        <div className={`
          absolute top-2 left-2 z-20 px-1.5 py-0.5 rounded-md text-xs font-medium
          ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'}
          backdrop-blur-sm border
          ${darkMode ? 'border-gray-700/50' : 'border-white/50'}
          ${platformStyles.color}
          flex items-center space-x-1
        `}>
          <span className="w-3 h-3">{platformStyles.icon}</span>
          <span className="text-xs font-medium">{video.platform.toUpperCase()}</span>
        </div>
      )}

      {/* External Link Button - Hide when video is playing */}
      {!showEmbed && (
        <button
          onClick={handleExternalLinkClick}
          className={`
            absolute top-2 right-2 z-20 p-1.5 rounded-md
            ${darkMode ? 'bg-gray-900/90 hover:bg-gray-800' : 'bg-white/90 hover:bg-white'}
            backdrop-blur-sm border
            ${darkMode ? 'border-gray-700/50 text-gray-300' : 'border-white/50 text-gray-600'}
            transition-all duration-200 
            ${isInstagram ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          `}
          title={`Open on ${video.platform} to comment, like, or share`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      )}

      {/* Video Player or Thumbnail */}
      {showEmbed && !embedError ? (
        <div className={isInstagram ? '' : 'p-4'}>
          {renderEmbeddedPlayer()}
        </div>
      ) : (
        <>
          {/* Thumbnail Container - Only for non-Instagram platforms */}
          <div className="relative aspect-video overflow-hidden">
            {imageLoading && (
              <div className={`
                w-full h-full flex items-center justify-center
                ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}
                animate-pulse
              `}>
                <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />
              </div>
            )}

            {imageError && (
              <div className={`
                w-full h-full flex flex-col items-center justify-center
                ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-500'}
              `}>
                <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-6h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Failed to load thumbnail</span>
              </div>
            )}

            {imageSrc && (
              <>
                <img
                  src={imageSrc}
                  alt={video.title || 'Video thumbnail'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Gradient Overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-t
                  ${platformStyles.accent}
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300
                `} />

                {/* Play Button Overlay */}
                <div className="
                  absolute inset-0 flex items-center justify-center
                  opacity-0 group-hover:opacity-100 transition-all duration-300
                  transform scale-50 group-hover:scale-100
                ">
                  <div className={`
                    p-4 rounded-full backdrop-blur-sm
                    ${darkMode ? 'bg-gray-900/80' : 'bg-white/80'}
                    border ${darkMode ? 'border-gray-700/50' : 'border-white/50'}
                    shadow-lg
                  `}>
                    <svg className={`w-8 h-8 ${platformStyles.color}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Embed Error Fallback */}
      {embedError && (
        <div className="p-4 text-center">
          <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Unable to embed video. Click below to watch on {video.platform}.
          </p>
          <a
            href={video.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600
              text-white font-medium transition-transform duration-200 hover:scale-105
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            Watch on {video.platform}
          </a>
        </div>
      )}

      {/* Content - Only show when not embedded or for non-Instagram platforms */}
      {(!showEmbed || embedError || !isInstagram) && (
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className={`
            font-semibold text-sm leading-tight line-clamp-2
            ${darkMode ? 'text-white' : 'text-gray-900'}
          `}>
            {video.title || 'Untitled Video'}
          </h3>

          {/* Author */}
          {(video.authorName || video.authorUser) && (
            <div className={`
              flex items-center space-x-2 text-xs
              ${darkMode ? 'text-gray-400' : 'text-gray-600'}
            `}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="truncate">{video.authorName}</span>
              {video.authorUser && (
                <span className="truncate opacity-70">@{video.authorUser}</span>
              )}
            </div>
          )}

          {/* Description (clamped) */}
          {video.description && (
            <p className={`text-xs line-clamp-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {video.description}
            </p>
          )}

          {/* Stats */}
          <div className={`
            flex items-center justify-between text-xs
            ${darkMode ? 'text-gray-400' : 'text-gray-600'}
          `}>
            <div className="flex items-center space-x-4">
              {video.views > 0 && (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{formatNumber(video.views)}</span>
                </div>
              )}
              
              {video.likes > 0 && (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{formatNumber(video.likes)}</span>
                </div>
              )}
            </div>

            {video.createdAt && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(video.createdAt)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hover Glow Effect - Only for non-Instagram */}
      {!isInstagram && (
        <div className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
          transition-opacity duration-300 pointer-events-none
          bg-gradient-to-r ${platformStyles.accent}
          blur-xl transform scale-110
        `} />
      )}
    </div>
  );
};

VideoCard.displayName = 'VideoCard';

export default VideoCard; 