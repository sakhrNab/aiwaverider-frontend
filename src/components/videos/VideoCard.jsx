import React, { useState, useContext } from 'react';
import { FaEye, FaHeart, FaYoutube, FaTiktok, FaInstagram, FaPlay, FaExternalLinkAlt, FaEdit, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import './VideoCard.css';
import { motion } from 'framer-motion';

const platformIcons = {
  youtube: <FaYoutube className="text-red-600" />,
  tiktok: <FaTiktok className="text-black dark:text-white" />,
  instagram: <FaInstagram className="text-purple-600" />
};

const VideoCard = ({ video, darkMode, onEdit }) => {
  const { isAdmin } = useContext(AuthContext);
  // Auto-play TikTok and Instagram videos by default
  const [isPlaying, setIsPlaying] = useState(
    video?.platform?.toLowerCase() === 'tiktok' || 
    video?.platform?.toLowerCase() === 'instagram'
  );

  const getVideoUrl = () => {
    if (!video?.platform || !video?.videoId) return '#';
    
    switch (video.platform.toLowerCase()) {
      case 'youtube':
        return `https://www.youtube.com/watch?v=${video.videoId}`;
      case 'tiktok':
        return `https://www.tiktok.com/@user/video/${video.videoId}`;
      case 'instagram':
        return `https://www.instagram.com/p/${video.videoId}/`;
      default:
        return '#';
    }
  };

  const getEmbedUrl = () => {
    if (!video?.platform || !video?.videoId) return '';
    
    switch (video.platform.toLowerCase()) {
      case 'youtube':
        return `https://www.youtube.com/embed/${video.videoId}`;
      case 'tiktok':
        // Instead of embed URL that requires external scripts, use a direct video player URL
        // This avoids CORS issues and script loading problems
        return `https://www.tiktok.com/embed/${video.videoId}`;
      case 'instagram':
        // Use a simple minimal embed approach to avoid script loading issues
        return `https://www.instagram.com/p/${video.videoId}/embed/captioned`;
      default:
        return '';
    }
  };

  const getThumbnailUrl = () => {
    // Debug what's coming from the backend for TikTok and Instagram
    if (video?.platform?.toLowerCase() === 'tiktok' || video?.platform?.toLowerCase() === 'instagram') {
      console.log(`[VideoCard] ${video.platform} video data:`, { 
        id: video?.videoId, 
        thumbnailUrl: video?.thumbnailUrl,
        thumbnail: video?.thumbnail,
        thumbnailType: typeof video?.thumbnailUrl
      });
    }
    
    // Check both thumbnailUrl and thumbnail fields (backend stores in both for compatibility)
    let thumbnailUrl = video?.thumbnailUrl || video?.thumbnail || null;
    
    // Strict checking - must be a valid URL string that's not 'null' or 'undefined'
    if (thumbnailUrl && 
        thumbnailUrl !== 'null' && 
        thumbnailUrl !== 'undefined' && 
        !thumbnailUrl.includes('undefined')) {
        
      // Convert protocol-relative URLs (starting with //) to https://
      if (thumbnailUrl.startsWith('//')) {
        thumbnailUrl = 'https:' + thumbnailUrl;
      } else if (!thumbnailUrl.startsWith('http')) {
        // Add https if no protocol is specified
        thumbnailUrl = 'https://' + thumbnailUrl;
      }
      
      console.log('[VideoCard] Using thumbnail:', thumbnailUrl);
      return thumbnailUrl;
    }
    
    // If no thumbnailUrl, use platform-specific fallbacks
    switch (video?.platform?.toLowerCase()) {
      case 'youtube':
        // YouTube thumbnails can be directly constructed from videoId
        return `https://img.youtube.com/vi/${video?.videoId}/hqdefault.jpg`;
      case 'tiktok':
        // Placeholder for TikTok videos
        return `https://placehold.co/1080x1920/1d1f30/ffffff?text=TikTok+${video?.videoId?.substring(0, 8)}...&font=montserrat`;
      case 'instagram':
        // Better fallback for Instagram with the post ID
        return `https://placehold.co/1080x1080/4f5bd5/ffffff?text=Instagram+${video?.videoId?.substring(0, 6)}...&font=montserrat`;
      default:
        return 'https://placehold.co/1080x608/0d1117/ffffff?text=Video+Thumbnail&font=montserrat';
    }
  };
  
  // Helper to check if we should show platform icon overlay (for videos with no thumbnail)
  const shouldShowPlatformOverlay = () => {
    // If the URL is a placeholder, show the overlay
    const thumbnailUrl = getThumbnailUrl();
    return thumbnailUrl.includes('placehold.co');
  };
  
  // Format username for display
  const formatUsername = (username) => {
    if (!username) return 'Unknown';
    return username.length > 15 ? username.substring(0, 12) + '...' : username;
  };
  
  // Format title with proper capitalization and ellipsis if too long
  const formatTitle = (title) => {
    if (!title) return 'Untitled Video';
    // Title should be title-cased
    return title.charAt(0).toUpperCase() + title.slice(1);
  };
  
  // Get appropriate aspect ratio class based on platform
  const getAspectRatioClass = () => {
    if (!video?.platform) return 'aspect-video'; // Default to 16:9
    
    switch(video.platform.toLowerCase()) {
      case 'tiktok':
        return 'aspect-[9/16]'; // Vertical aspect ratio for TikTok
      case 'instagram':
        return 'aspect-[9/16]'; // Taller ratio for Instagram content to fit better
      default:
        return 'aspect-video'; // 16:9 for YouTube
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`video-card overflow-hidden rounded-xl ${darkMode ? 'bg-gray-900/80 backdrop-blur-md border border-indigo-900/30' : 'bg-white/90 backdrop-blur-md border border-blue-100/40'} shadow-lg`}
    >
      {/* Video Thumbnail or Embedded Video */}
      <div className="block relative overflow-hidden rounded-t-xl">
        <div className={`relative ${getAspectRatioClass()} bg-gray-800 overflow-hidden group`}>
          {isPlaying ? (
            <div className="relative w-full h-[90%] mx-auto my-0">
              {/* Embedded Video Player */}
              <iframe
                src={getEmbedUrl()}
                className="w-full h-full rounded-lg absolute inset-0 object-cover"
                frameBorder="0"
                allowFullScreen
                title={formatTitle(video?.title) || 'Video'}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-popups allow-presentation allow-forms allow-popups-to-escape-sandbox"
                importance="low"
                scrolling="no"
                onLoad={(e) => {
                  console.log('Iframe loaded successfully');
                  // Try to force play for autoplay
                  try {
                    if (e.target.contentWindow) {
                      e.target.contentWindow.postMessage(JSON.stringify({
                        event: 'command',
                        func: 'playVideo',
                        args: ''
                      }), '*');
                    }
                  } catch (err) {
                    console.log('Could not autoplay video:', err);
                  }
                }}
                onError={(e) => {
                  console.error('Embed iframe error:', e);
                  // Try to fallback to a simpler embed URL
                  if (video.platform.toLowerCase() === 'instagram') {
                    e.target.src = `https://www.instagram.com/p/${video.videoId}/embed`;
                  } else if (video.platform.toLowerCase() === 'tiktok') {
                    e.target.src = `https://www.tiktok.com/embed/v2/${video.videoId}`;
                  } else {
                    setIsPlaying(false); // Fallback to thumbnail on error
                  }
                }}
              />
              
              {/* Direct link fallback */}
              <a 
                href={getVideoUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute bottom-3 left-3 z-10 bg-black/70 hover:bg-black/90 text-white text-sm rounded-full px-3 py-1.5 flex items-center"
              >
                <FaExternalLinkAlt className="mr-1.5" /> Open Original
              </a>
              
              {/* Close Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(false);
                }}
                className="absolute top-2 right-2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5"
                aria-label="Close video"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <>
              {/* Thumbnail Image */}
              <img 
                src={getThumbnailUrl()} 
                alt={formatTitle(video?.title) || 'Video thumbnail'} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  // More visual fallback with platform-specific colors and post ID
                  const platform = video?.platform?.toLowerCase() || 'video';
                  const videoIdSnippet = video?.videoId ? video.videoId.substring(0, 6) : '';
                  
                  // Platform-specific placeholders with video ID for better identification
                  if (platform === 'tiktok') {
                    e.target.src = `https://placehold.co/1080x1920/010101/ffffff?text=TikTok+${videoIdSnippet}...&font=montserrat`;
                  } else if (platform === 'instagram') {
                    e.target.src = `https://placehold.co/1080x1080/833AB4/ffffff?text=Instagram+${videoIdSnippet}...&font=montserrat`;
                  } else {
                    e.target.src = `https://placehold.co/1080x608/0d1117/ffffff?text=${platform}+Video&font=montserrat`;
                  }
                }}
                onClick={() => video?.platform?.toLowerCase() === 'youtube' ? setIsPlaying(true) : null}
                style={{cursor: video?.platform?.toLowerCase() === 'youtube' ? 'pointer' : 'default'}}
              />
              
              {/* Platform overlay icon for missing thumbnails */}
              {shouldShowPlatformOverlay() && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center">
                  {video?.platform?.toLowerCase() === 'tiktok' && (
                    <FaTiktok className="text-white opacity-50" size={80} />
                  )}
                  {video?.platform?.toLowerCase() === 'instagram' && (
                    <FaInstagram className="text-white opacity-50" size={80} />
                  )}
                  {video?.platform?.toLowerCase() === 'youtube' && (
                    <FaYoutube className="text-white opacity-50" size={80} />
                  )}
                </div>
              )}
              
              {/* Platform badge */}
              <div className={`absolute top-3 left-3 ${darkMode ? 'bg-gray-900/70' : 'bg-white/90'} backdrop-blur-md rounded-full px-3 py-1.5 text-xs font-medium flex items-center shadow-md border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
                {platformIcons[video?.platform?.toLowerCase() || 'youtube']} 
                <span className={`ml-1.5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {(video?.platform || 'video').charAt(0).toUpperCase() + (video?.platform || 'video').slice(1)}
                </span>
              </div>
              
              {/* Play button overlay - only show for YouTube */}
              {video?.platform?.toLowerCase() === 'youtube' && (
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={() => setIsPlaying(true)}
                >
                  <div className={`rounded-full p-4 ${darkMode ? 'bg-gray-900/60' : 'bg-gray-100/60'} backdrop-blur-sm transition-transform duration-300 transform group-hover:scale-110`}>
                    <FaPlay className={`${darkMode ? 'text-white' : 'text-gray-800'} text-xl`} />
                  </div>
                </div>
              )}
              
              {/* Duration or Posted Date (if available) */}
              {video?.duration && (
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                  {video.duration}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Video Info */}
      <div className="p-5">
        <a 
          href={getVideoUrl()} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`block hover:opacity-80 transition-opacity`}
        >
          <h3 className={`text-lg font-semibold mb-2 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {formatTitle(video?.title)}
          </h3>
        </a>
        
        <div className="flex justify-between items-center text-sm mt-3">
          <div className="flex items-center space-x-4">
            <span className={`flex items-center ${darkMode ? 'text-blue-300/70' : 'text-blue-600/70'}`}>
              <FaEye className="mr-1.5" /> {(video?.views || 0).toLocaleString()}
            </span>
            <span className={`flex items-center ${darkMode ? 'text-red-300/80' : 'text-red-500/80'}`}>
              <FaHeart className="mr-1.5" /> {(video?.likes || 0).toLocaleString()}
            </span>
          </div>
          
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            {formatUsername(video?.user || 'Unknown')}
          </span>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          {video?.category && (
            <span className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {video.category}
            </span>
          )}
        </div>
      </div>
      
      {/* Edit button for admins - Positioned for better visibility */}
      {isAdmin && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit && onEdit(video);
          }}
          className={`absolute top-3 right-3 z-50 p-2.5 rounded-full ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'} shadow-lg text-white`}
          aria-label="Edit video"
        >
          <FaEdit className="text-lg" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default VideoCard;
