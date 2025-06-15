import React, { useState, useContext, memo, useCallback } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FaEye, FaHeart, FaYoutube, FaTiktok, FaInstagram, FaPlay, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';
import 'react-lazy-load-image-component/src/effects/blur.css';

const platformIcons = {
  youtube: { icon: FaYoutube, color: 'text-red-600', bgColor: 'bg-red-600' },
  tiktok: { icon: FaTiktok, color: 'text-black dark:text-white', bgColor: 'bg-black dark:bg-white' },
  instagram: { icon: FaInstagram, color: 'text-purple-600', bgColor: 'bg-gradient-to-r from-purple-600 to-pink-600' }
};

const GlassyVideoCard = memo(({ video, onRefresh }) => {
  const { darkMode } = useTheme();
  const { isAdmin } = useContext(AuthContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Safe access to video properties with defaults
  const platform = video?.platform?.toLowerCase() || 'unknown';
  const title = video?.title || 'Untitled Video';
  const authorName = video?.authorName || video?.authorUser || 'Unknown Creator';
  const views = video?.views || 0;
  const likes = video?.likes || 0;
  const videoId = video?.id;
  const originalUrl = video?.originalUrl;
  const embedUrl = video?.embedUrl;
  const thumbnailUrl = video?.thumbnailUrl;

  const platformData = platformIcons[platform] || platformIcons.youtube;
  const PlatformIcon = platformData.icon;

  // Format numbers for display
  const formatNumber = useCallback((num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }, []);

  // Get appropriate aspect ratio based on platform
  const getAspectRatio = useCallback(() => {
    switch (platform) {
      case 'tiktok':
      case 'instagram':
        return 'aspect-[9/16]'; // Vertical for mobile platforms
      default:
        return 'aspect-video'; // 16:9 for YouTube
    }
  }, [platform]);

  // Handle thumbnail error
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Get fallback thumbnail
  const getFallbackThumbnail = useCallback(() => {
    const colors = {
      youtube: 'ef4444/ffffff',
      tiktok: '000000/ffffff',
      instagram: 'a855f7/ffffff'
    };
    const color = colors[platform] || colors.youtube;
    return `https://placehold.co/1080x608/${color}?text=${platform.toUpperCase()}+Video&font=roboto`;
  }, [platform]);

  // Handle play button click
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  // Handle external link
  const handleExternalLink = useCallback((e) => {
    e.stopPropagation();
    if (originalUrl) {
      window.open(originalUrl, '_blank', 'noopener,noreferrer');
    }
  }, [originalUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group relative overflow-hidden rounded-2xl shadow-2xl backdrop-blur-md border ${
        darkMode 
          ? 'bg-gray-900/40 border-white/10 hover:bg-gray-900/60' 
          : 'bg-white/30 border-white/20 hover:bg-white/50'
      } hover:shadow-3xl transition-all duration-300`}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      {/* Video thumbnail section */}
      <div className={`relative ${getAspectRatio()} overflow-hidden bg-gray-800`}>
        {!isPlaying ? (
          <>
            <LazyLoadImage
              src={imageError ? getFallbackThumbnail() : thumbnailUrl}
              alt={title}
              effect="blur"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={handleImageError}
              placeholderSrc={getFallbackThumbnail()}
            />
            
            {/* Platform badge */}
            <div className={`absolute top-3 left-3 ${platformData.bgColor} rounded-full p-2 shadow-lg`}>
              <PlatformIcon className={`w-4 h-4 ${platform === 'tiktok' ? 'text-white dark:text-black' : 'text-white'}`} />
            </div>
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlay}
                className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-4 shadow-lg backdrop-blur-sm"
              >
                <FaPlay className="w-6 h-6 ml-1" />
              </motion.button>
            </div>
            
            {/* Stats overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white text-sm">
              <div className="flex items-center space-x-3 bg-black/60 rounded-full px-3 py-1 backdrop-blur-sm">
                <span className="flex items-center">
                  <FaEye className="w-3 h-3 mr-1" />
                  {formatNumber(views)}
                </span>
                <span className="flex items-center">
                  <FaHeart className="w-3 h-3 mr-1" />
                  {formatNumber(likes)}
                </span>
              </div>
              
              {originalUrl && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExternalLink}
                  className="bg-black/60 hover:bg-black/80 rounded-full p-2 backdrop-blur-sm transition-colors"
                >
                  <FaExternalLinkAlt className="w-3 h-3" />
                </motion.button>
              )}
            </div>
          </>
        ) : (
          <div className="relative w-full h-full">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              sandbox="allow-scripts allow-same-origin allow-popups allow-presentation allow-forms"
            />
            
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(false)}
              className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 backdrop-blur-sm"
            >
              <FaExternalLinkAlt className="w-3 h-3" />
            </motion.button>
          </div>
        )}
      </div>
      
      {/* Video info section */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className={`font-semibold text-lg leading-tight line-clamp-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h3>
          <p className={`text-sm mt-1 opacity-75 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {authorName}
          </p>
        </div>
        
        {/* Additional stats row */}
        <div className={`flex items-center justify-between text-xs opacity-60 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <span>{formatNumber(views)} views</span>
          <span>{formatNumber(likes)} likes</span>
          {video?.createdAt && (
            <span>
              {new Date(video.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
        
        {/* Admin actions */}
        {isAdmin && onRefresh && (
          <div className="pt-2 border-t border-gray-200/20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRefresh(videoId)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                darkMode 
                  ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' 
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              Refresh Stats
            </motion.button>
          </div>
        )}
      </div>
      
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
        darkMode 
          ? 'shadow-2xl shadow-blue-500/20' 
          : 'shadow-2xl shadow-blue-300/30'
      }`} />
    </motion.div>
  );
});

GlassyVideoCard.displayName = 'GlassyVideoCard';

export default GlassyVideoCard; 