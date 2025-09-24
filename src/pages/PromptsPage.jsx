import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { FaExternalLinkAlt, FaSearch, FaTimes, FaSync, FaLightbulb } from 'react-icons/fa';
import PageHeader from '../components/layout/PageHeader';
import { Link, useNavigate } from 'react-router-dom';
import './AIToolsPage.css'; // Reuse the same CSS
import { useTheme } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import { HashLoader } from 'react-spinners';
import { createSvgDataUri } from '../utils/imageUtils';
import { getPromptColor } from '../api/marketplace/promptsApi';
import '../styles/animations.css'; // Import animations
import usePromptsStore from '../store/usePromptsStore';
import useImageCacheStore from '../store/useImageCacheStore';

// Import icons
import promptIcon from '../assets/ai-tools/prompt-icon.svg';
import textEffectsIcon from '../assets/ai-tools/text-effects-icon.svg';
import relightIcon from '../assets/ai-tools/relight-icon.svg';
import hedraIcon from '../assets/ai-tools/hedra-icon.svg';
import adsIcon from '../assets/ai-tools/ads-icon.svg';
import eraserIcon from '../assets/ai-tools/eraser-icon.svg';
import mindmapIcon from '../assets/ai-tools/mindmap-icon.svg';
import viralIcon from '../assets/ai-tools/viral-icon.svg';
import defaultAiIcon from '../assets/ai-tools/default-ai-icon.svg';

// Import theme classes
const themeClasses = "bg-gradient-to-br from-[#4158D0] via-[#C850C0] to-[#FFCC70] stars-pattern";

// Setup icon map for fallbacks
const iconMap = {
  "Prompt": promptIcon,
  "Text Effects": textEffectsIcon,
  "Relight": relightIcon,
  "Hedra": hedraIcon,
  "Ads": adsIcon,
  "Eraser": eraserIcon,
  "Mind Map": mindmapIcon,
  "Viral": viralIcon,
  "default": defaultAiIcon
};

// Create a cache for images
// Note: Image caching is now handled by the centralized imageCacheService

const PromptsPage = () => {
  const { darkMode } = useTheme();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [imageCacheTimestamp, setImageCacheTimestamp] = useState(Date.now());
  
  // State for cached images
  const [cachedImages, setCachedImages] = useState(new Map());
  const lastProcessedPromptsRef = useRef(new Set());
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  // Use the Prompts Zustand store
  const {
    prompts,
    isLoading: loading,
    error,
    isLoaded,
    startListening,
    stopListening,
    forceRefresh,
    lastRefreshed,
    categories,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    hasMore,
    searchQuery,
    filters,
    setSearchQuery,
    setFilters,
    setPage,
    setPageSize
  } = usePromptsStore();

  // Get image cache store
  const {
    preloadImages,
    updateCacheStats,
    startListening: startImageCacheListening,
    stopListening: stopImageCacheListening
  } = useImageCacheStore();

  // Helper function to ensure links have proper format
  const formatLink = (link) => {
    if (!link) return '#';
    
    // Check if the link already has http:// or https:// prefix
    if (link.startsWith('http://') || link.startsWith('https://')) {
      return link;
    }
    
    // Otherwise, add https:// prefix
    return `https://${link}`;
  };

  // Image loading handler with improved error handling and caching
  const handleImageLoad = (e) => {
    const img = e.target;
    const { naturalWidth, naturalHeight } = img;
    
    // Determine aspect ratio
    if (naturalHeight > naturalWidth * 1.2) {
      // Portrait image (taller than wide)
      img.setAttribute('data-aspect', 'portrait');
      img.classList.add('portrait-image');
    } else if (naturalWidth > naturalHeight * 1.2) {
      // Landscape image (wider than tall)
      img.setAttribute('data-aspect', 'landscape');
      img.classList.add('landscape-image');
    } else {
      // Roughly square image
      img.setAttribute('data-aspect', 'square');
      img.classList.add('square-image');
    }
    
    // Remove loading state
    img.classList.remove('img-loading');
    img.classList.add('img-loaded');
    
    // Note: Image caching is now handled by the centralized service
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    forceRefresh();
  };

  // Helper function to extract base64 image from additionalHTML
  const getBase64ImageFromHTML = useCallback((additionalHTML) => {
    if (!additionalHTML) return null;
    
    // Look for base64 data URLs in img src attributes
    const imgRegex = /<img[^>]+src="(data:image\/[^"]+)"/g;
    const match = imgRegex.exec(additionalHTML);
    
    if (match && match[1]) {
      // Found base64 image in additionalHTML
      return match[1];
    }
    
    return null;
  }, []);

  // Handle image error with better fallback strategy
  const handleImageError = useCallback((e, prompt) => {
    const img = e.target;
    
    // Prevent infinite loops by removing the error handler
    img.onerror = null;
    
    // Check if the failed image was a base64 data URL
    if (img.src && img.src.startsWith('data:')) {
      // For base64 images, we shouldn't get errors, but if we do, try to extract from additionalHTML
      const base64Image = getBase64ImageFromHTML(prompt.additionalHTML);
      if (base64Image) {
        img.src = base64Image;
        return;
      }
    }
    
    // Try to extract base64 image from additionalHTML as first fallback
    const base64Image = getBase64ImageFromHTML(prompt.additionalHTML);
    if (base64Image) {
      img.src = base64Image;
      img.setAttribute('data-aspect', 'square');
      img.classList.remove('img-loading');
      img.classList.add('img-loaded');
      img.classList.add('square-image');
      return;
    }
    
    // Only use icon fallback as last resort
    const promptCategory = prompt.category?.split(' ')[0];
    const fallbackIcon = iconMap[promptCategory] || iconMap["Prompt"];
    
    if (fallbackIcon) {
      img.src = fallbackIcon;
    } else {
      // Generate SVG fallback if no icon is available
      const bgColor = getPromptColor(prompt.title);
      const textColor = 'ffffff';
      
      const displayText = prompt.title ? 
        (prompt.title.length > 15 ? prompt.title.split(' ')[0] : prompt.title) : 
        'Prompt';
      
      img.src = createSvgDataUri({
        text: displayText,
        width: 300,
        height: 200,
        bgColor,
        textColor,
        fontSize: 24
      });
    }
    
    img.setAttribute('data-aspect', 'square');
    img.classList.remove('img-loading');
    img.classList.add('img-loaded');
    img.classList.add('square-image');
  }, [getBase64ImageFromHTML]);


  useEffect(() => {
    // Start the prompts listener when component mounts
    startListening();
    
    // Start image cache listener
    startImageCacheListening();
    
    // One-time cache cleanup for old fallback data
    const checkForOldCache = () => {
      try {
        const cachedData = localStorage.getItem('prompts_cache');
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          // Check if cached data has old fallback images (SVG data URIs)
          const hasOldFallbacks = parsed.prompts?.some(prompt => 
            prompt.image && prompt.image.startsWith('data:image/svg+xml')
          );
          
          if (hasOldFallbacks) {
            // Clearing old cache with fallback images
            localStorage.removeItem('prompts_cache');
            localStorage.removeItem('prompts_cache_timestamp');
            // Don't force refresh - let the store handle it naturally
          }
        }
      } catch (error) {
        console.error('Error checking cache:', error);
      }
    };
    
    // Check cache after a short delay to let the store initialize
    const timeoutId = setTimeout(checkForOldCache, 1000);
    
    // Clean up listener and interval when component unmounts
    return () => {
      clearTimeout(timeoutId);
      stopListening();
      stopImageCacheListening();
    };
  }, [startListening, stopListening, startImageCacheListening, stopImageCacheListening]);

  // Helper function to get the appropriate image for a prompt
  const getPromptImage = useCallback((prompt) => {
    // First check if we already have this image cached
    const cachedImage = cachedImages.get(prompt.id);
    if (cachedImage) {
      return cachedImage;
    }
    
    // Check if the prompt has an image URL from the database (this is the output/result image)
    if (prompt.image && prompt.image !== '' && prompt.image !== 'undefined' && prompt.image !== null) {
      return prompt.image;
    }
    
    // If no image field, try to extract base64 image from additionalHTML
    const base64Image = getBase64ImageFromHTML(prompt.additionalHTML);
    if (base64Image) {
      return base64Image;
    }
    
    // Try to get an icon based on the prompt's category
    const promptCategory = prompt.category?.split(' ')[0];
    if (iconMap[promptCategory]) {
      return iconMap[promptCategory];
    }
    if (iconMap["Prompt"]) {
      return iconMap["Prompt"];
    }
    
    // Generate SVG fallback as last resort
    const bgColor = getPromptColor(prompt.title || prompt.category);
    const textColor = 'ffffff';
    
    const displayText = prompt.title ? 
      (prompt.title.length > 15 ? prompt.title.split(' ')[0] : prompt.title) :
      'Prompt';
    
    return createSvgDataUri({
      text: displayText,
      width: 300,
      height: 200,
      bgColor,
      textColor,
      fontSize: 24
    });
  }, [cachedImages, getBase64ImageFromHTML]);

  // Effect to preload images when prompts change
  useEffect(() => {
    if (prompts && prompts.length > 0) {
      // Create a set of current prompt IDs for comparison
      const currentPromptIds = new Set(prompts.map(p => p.id));
      
      // Check if we have new prompts that haven't been processed
      const hasNewPrompts = prompts.some(prompt => 
        !lastProcessedPromptsRef.current.has(prompt.id)
      );
      
      // Only process if we have new prompts
      if (hasNewPrompts) {
        // Update the processed prompts ref immediately
        lastProcessedPromptsRef.current = currentPromptIds;
        
        // Preload images in the background (this will cache them)
        preloadImages(prompts);
        
        // Update cached images state for new prompts only
        const newCachedImages = new Map(cachedImages);
        let hasUpdates = false;
        
        for (const prompt of prompts) {
          // Only process if we don't already have this image cached
          if (!newCachedImages.has(prompt.id) && prompt.image) {
            const imageSrc = getPromptImage(prompt);
            if (imageSrc) {
              newCachedImages.set(prompt.id, imageSrc);
              hasUpdates = true;
            }
          }
        }
        
        // Only update state if we have new images
        if (hasUpdates) {
          setCachedImages(newCachedImages);
        }
      }
    }
  }, [prompts, preloadImages, cachedImages, getPromptImage]);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters({ [filterType]: value });
  };

  // Use the new loader component
  if (loading && !isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-blue-900">
        <div className="mb-8">
          <HashLoader color="#4FD1C5" size={70} speedMultiplier={0.8} />
        </div>
        <div className="text-white text-xl font-semibold mt-4">
          Loading Prompts
        </div>
        <div className="text-blue-300 text-sm mt-2">
          Discovering the best prompts for you...
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-16 ${darkMode ? "dark bg-[#2D1846]" : "bg-gray-50"} ${themeClasses}`}>
      {/* Use centralized PageHeader component */}
      <PageHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto mt-8">
          {/* Page header using global class */}
          <div className="page-header-3d">
            <div className="absolute inset-0 bg-pattern opacity-30"></div>
            <div className="relative z-10">
              <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-200 text-transparent bg-clip-text">
                  AI Prompts Directory
                </span>
              </h1>
              <p className="text-white/80 text-center text-lg mb-2">
                Discover the best AI prompts to enhance your creativity
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
            </div>
          </div>

          {/* Error state - Loading handled above */}
          {error ? (
            <div className="text-center py-12 glass-effect rounded-2xl p-6">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <button 
                onClick={handleRefresh}
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 text-white transition-all"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Search input with better positioning - using class-based approach */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex w-full md:w-auto gap-3">
                  <div className="relative flex-1 md:flex-auto" id="prompts-search">
                    <input
                      type="text"
                      placeholder="Search prompts..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="search-input w-full md:w-72 px-4 py-3 pr-10 rounded-xl bg-white/10 backdrop-blur-md text-white shadow-lg"
                    />
                    <FaSearch className="search-icon absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                    {searchQuery && (
                      <button 
                        type="button" 
                        className="search-clear-button" 
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                  {isAdmin && (
                    <button
                      onClick={handleRefresh}
                      className="p-3 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 text-white shadow-lg transition-all duration-300 flex items-center justify-center tooltip-container"
                      aria-label="Refresh data"
                      title={lastRefreshed ? `Last updated: ${new Date(lastRefreshed).toLocaleTimeString()}` : 'Refresh data'}
                    >
                      <FaSync className={loading ? 'animate-spin' : 'animate-spin-on-hover'} />
                      <span className="tooltip">Refresh</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Tags filter - using global filter-tags-container */}
              {categories.length > 0 && (
                <div className="filter-tags-container">
                  <button
                    onClick={() => handleFilterChange('category', 'All')}
                    className={`filter-button ${filters.category === 'All' ? 'active' : ''}`}
                  >
                    All
                  </button>
                  {categories
                    .filter(cat => cat.name !== 'All')
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((category) => (
                    <button
                      key={category.name}
                      onClick={() => handleFilterChange('category', category.name)}
                      className={`filter-button ${filters.category === category.name ? 'active' : ''}`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              )}

              {/* Prompts Container - Enhanced with glass effect */}
              {prompts.length > 0 ? (
                <div className="glass-effect rounded-3xl p-6 shadow-xl transform transition-transform duration-700 hover:scale-[1.01]">
                  <div className="content-grid">
                    {prompts.map((prompt, index) => {
                      // Get cached image or use original image as fallback
                      const cachedImage = cachedImages.get(prompt.id);
                      const promptImageSrc = cachedImage || prompt.image || '';
                      
                      // Ensure we have a string, not a Promise
                      const safeImageSrc = typeof promptImageSrc === 'string' ? promptImageSrc : '';
                      
                      
                      return (
                        <div 
                          key={prompt.id || `prompt-${index}`}
                          onClick={() => navigate(`/prompts/${prompt.id}`)}
                          className="group relative bg-gradient-to-br from-purple-900/80 to-purple-800/60 backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 border border-purple-700/30"
                        >
                          {/* Lightbulb Icon */}
                          <div className="absolute top-4 right-4 z-10">
                            <FaLightbulb className="text-yellow-400 text-lg opacity-80 group-hover:opacity-100 transition-opacity" />
                          </div>
                          
                          <div className="flex gap-4">
                            {/* Image Container */}
                            <div className="flex-shrink-0">
                              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-purple-600/20 to-purple-500/10 border border-purple-500/30">
                                <img 
                                  src={safeImageSrc || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+'}
                              alt={prompt.title} 
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                              onLoad={handleImageLoad}
                              onError={(e) => handleImageError(e, prompt)}
                              loading="lazy"
                            />
                          </div>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-semibold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-purple-200 transition-colors">
                                {prompt.title}
                              </h3>
                              <p className="text-purple-100/80 text-sm leading-relaxed line-clamp-2 mb-4">
                                {prompt.description}
                              </p>
                              
                              {/* Tags */}
                              <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-purple-700/30 text-purple-200 text-xs rounded-full border border-purple-600/40 backdrop-blur-sm">
                                {prompt.category || 'Prompt'}
                              </span>
                              {prompt.tags?.slice(0, 2).map((tag, tagIndex) => (
                                <span 
                                  key={tagIndex} 
                                    className="px-3 py-1 bg-purple-700/30 text-purple-200 text-xs rounded-full border border-purple-600/40 backdrop-blur-sm hover:bg-purple-600/40 transition-colors"
                                >
                                  {tag}
                                </span>
                              ))}
                              {prompt.likeCount > 0 && (
                                  <span className="px-3 py-1 bg-purple-700/30 text-purple-200 text-xs rounded-full border border-purple-600/40 backdrop-blur-sm">
                                  ❤️ {prompt.likeCount}
                                </span>
                              )}
                            </div>
                              
                              {/* Link */}
                            {prompt.link && (
                                <div className="mt-3">
                                <a
                                  href={formatLink(prompt.link)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Visit Source <FaExternalLinkAlt className="ml-1 text-xs" />
                                </a>
                              </div>
                            )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Pagination Controls - Always show for navigation and page size options */}
                  {totalCount > 0 && (
                    <div className="flex justify-center items-center mt-8 pagination-controls">
                      {/* Navigation buttons - only show when multiple pages */}
                      {totalPages > 1 && (
                        <>
                          <button
                            onClick={() => setPage(1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 text-white shadow-lg transition-all duration-300 mx-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            First
                          </button>
                          
                          <button
                            onClick={() => setPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 text-white shadow-lg transition-all duration-300 mx-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            &laquo; Prev
                          </button>
                          
                          <div className="flex items-center mx-4">
                            <span className="text-white/80">Page</span>
                            <span className="mx-2 px-3 py-1 bg-white/20 rounded-md text-white font-medium">{currentPage}</span>
                            <span className="text-white/80">of {totalPages}</span>
                          </div>
                          
                          <button
                            onClick={() => setPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 text-white shadow-lg transition-all duration-300 mx-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next &raquo;
                          </button>
                          
                          <button
                            onClick={() => setPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 text-white shadow-lg transition-all duration-300 mx-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Last
                          </button>
                        </>
                      )}
                      
                      {/* Page size selector - always show */}
                      <div className="flex items-center">
                        <span className="text-white/80 mr-2">Show:</span>
                        <select
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                          className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-md text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-gray-800 [&>option]:text-white"
                        >
                          <option value="12">12</option>
                          <option value="24">24</option>
                          <option value="48">48</option>
                        </select>
                        {totalPages === 1 && (
                          <span className="ml-3 text-white/60 text-sm">
                            (Showing all {totalCount} items)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Offline indicator */}
                  {!navigator.onLine && (
                    <div className="mt-4 p-2 bg-amber-500/20 text-amber-200 rounded-lg text-center">
                      <p className="text-sm font-medium">You are currently offline. Viewing cached data.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-white/70 mb-4">No prompts found in the database.</p>
                  <p className="text-white/50 mb-6">Prompts need to be added by an administrator.</p>
                  
                  {/* Admin-only button */}
                  {isAdmin && (
                    <a 
                      href="/admin/prompts"
                      className="px-6 py-3 bg-gradient-to-r from-purple-500/60 to-pink-500/60 rounded-lg text-white font-medium hover:from-purple-500/80 hover:to-pink-500/80 transition-all duration-300"
                    >
                      Go to Admin Panel
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PromptsPage;