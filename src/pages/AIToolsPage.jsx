import React, { useState, useEffect, useCallback, useContext } from 'react';
import { FaExternalLinkAlt, FaSearch, FaTimes, FaSync } from 'react-icons/fa';
import PageHeader from '../components/layout/PageHeader';
import { Link, useNavigate } from 'react-router-dom';
import './AIToolsPage.css';
import { useTheme } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import { HashLoader } from 'react-spinners';
import { createSvgDataUri } from '../utils/imageUtils';
import { getToolColor } from '../api/marketplace/aiToolsApi';
import '../styles/animations.css'; // Import animations
import useAIToolsStore from '../store/useAIToolsStore';

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

// Available default tags if none are found in the database
const defaultAvailableTags = [
  'All',
  'Free tools',
  'Video Generator',
  'Animation',
  'Make money with AI',
  '3D tools',
  'Content',
  'AI Coding',
  'Digital Influencer',
  'Video Editing',
  'Viral Video Hacks',
  'Organization'
];

// Create a cache for images
const imageCache = new Map();

const AITools = () => {
  const { darkMode } = useTheme();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [tags, setTags] = useState(['All']);
  const [imageCacheTimestamp, setImageCacheTimestamp] = useState(Date.now());
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  // Use the Zustand store for tools data and loading state
  const {
    tools,
    isLoading: loading,
    error,
    isLoaded,
    startListening,
    stopListening,
    forceRefresh,
    lastRefreshed
  } = useAIToolsStore(state => ({
    tools: state.tools,
    isLoading: state.isLoading,
    error: state.error,
    isLoaded: state.isLoaded,
    startListening: state.startListening,
    stopListening: state.stopListening,
    forceRefresh: state.forceRefresh,
    lastRefreshed: state.lastRefreshed
  }));

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
    
    // Add to cache
    if (img.src && !img.src.startsWith('data:')) {
      imageCache.set(img.src, {
        timestamp: Date.now(),
        loaded: true
      });
    }
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    forceRefresh();
  };

  // Handle image error with better fallback strategy
  const handleImageError = useCallback((e, tool) => {
    const img = e.target;
    
    // Prevent infinite loops by removing the error handler
    img.onerror = null;
    
    // First try the fallback specific to this tool's name
    const toolName = tool.title?.split(' ')[0];
    const fallbackIcon = iconMap[toolName] || iconMap[tool.keyword];
    
    if (fallbackIcon) {
      console.log(`Image load error for ${tool.title}, using icon fallback`);
      img.src = fallbackIcon;
    } else {
      // Generate SVG fallback if no icon is available
      console.log(`Image load error for ${tool.title}, generating SVG fallback`);
      
      // Get the appropriate color based on the tool name
      const bgColor = getToolColor(tool.title);
      const textColor = 'ffffff'; // Default white
      
      // Get text to display (use the full name if it fits, otherwise first word or initial)
      const displayText = tool.title ? 
        (tool.title.length > 15 ? tool.title.split(' ')[0] : tool.title) : 
        'AI';
      
      // Use the utility function to create the SVG data URI
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
    
    // Mark as failed in cache to avoid repeated attempts
    if (tool.image) {
      imageCache.set(tool.image, {
        timestamp: Date.now(),
        loaded: false,
        fallback: img.src
      });
    }
  }, []);

  // Helper function to get image URL with proper caching
  const getImageUrl = useCallback((tool) => {
    // More comprehensive check for invalid image values
    if (!tool.image || 
        tool.image === '/uploads/undefined' || 
        tool.image.includes('/undefined') || 
        tool.image === '') {
      return null;
    }
    
    // Check if image is a full URL or a relative path
    let imageUrl = tool.image;
    if (imageUrl.startsWith('/')) {
      // For local development, prepend the API base URL
      const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      imageUrl = `${apiBase}${imageUrl}`;
    }
    
    // Check cache
    if (imageCache.has(imageUrl)) {
      const cacheEntry = imageCache.get(imageUrl);
      // If cache entry is marked as failed, return the fallback
      if (!cacheEntry.loaded && cacheEntry.fallback) {
        return cacheEntry.fallback;
      }
    }
    
    return imageUrl;
  }, []);

  // Extract unique tags from AI tools only (exclude prompts)
  const extractTags = useCallback((toolsData) => {
    if (!toolsData || toolsData.length === 0) {
      return defaultAvailableTags;
    }
    
    const allTags = ['All'];
    const tagSet = new Set();
    
    // Filter out prompts first
    const aiToolsOnly = toolsData.filter(tool => {
      return !tool.keyword?.toLowerCase().includes('prompt') &&
             !tool.title?.toLowerCase().includes('prompt') &&
             !tool.category?.toLowerCase().includes('prompt');
    });
    
    aiToolsOnly.forEach(tool => {
      // Add category as tag if exists
      if (tool.category) {
        tagSet.add(tool.category);
      }
      
      // Add all tags from tool.tags array if it exists
      if (Array.isArray(tool.tags)) {
        tool.tags.forEach(tag => tag && tagSet.add(tag));
      }
    });
    
    // Convert Set to Array and prepend 'All'
    const uniqueTags = [...tagSet];
    return [...allTags, ...uniqueTags];
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Manually clear localStorage cache to force fresh data fetch
      localStorage.removeItem('ai_tools_cache');
      localStorage.removeItem('ai_tools_cache_timestamp');
      
      // Force refresh by passing true parameter
      const fetchedTools = await aiToolsService.getAllAITools(true);
      
      if (fetchedTools && fetchedTools.length > 0) {
        setTools(fetchedTools);
        
        // Extract unique tags from the tools
        const toolTags = extractTags(fetchedTools);
        setTags(toolTags);
      } else {
        setTools([]);
        // Set default tags if no tools are available
        setTags(defaultAvailableTags);
      }
    } catch (err) {
      console.error('Error fetching AI tools:', err);
      setError('Failed to load AI tools. Please try again later.');
      // Set default tags when there's an error
      setTags(defaultAvailableTags);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Start the Firestore listener when component mounts
    startListening();
    
    // Clear image cache every hour
    const cacheInterval = setInterval(() => {
      // Remove cache entries older than 1 hour
      const now = Date.now();
      imageCache.forEach((value, key) => {
        if (now - value.timestamp > 3600000) { // 1 hour in milliseconds
          imageCache.delete(key);
        }
      });
      setImageCacheTimestamp(now);
    }, 3600000); // Check every hour
    
    // Clean up listener and interval when component unmounts
    return () => {
      clearInterval(cacheInterval);
      stopListening();
    };
  }, []);

  const handleRetry = () => {
    // Use the forceRefresh function from the Zustand store
    forceRefresh();
  };

  // Update tags whenever tools change
  useEffect(() => {
    if (tools && tools.length > 0) {
      const extractedTags = extractTags(tools);
      setTags(extractedTags);
    } else {
      setTags(defaultAvailableTags);
    }
  }, [tools, extractTags]);

  // Filter tools to only show AI tools (exclude prompts)
  const aiToolsOnly = tools.filter(tool => {
    // Exclude anything that contains "prompt" in keyword, title, or category
    return !tool.keyword?.toLowerCase().includes('prompt') &&
           !tool.title?.toLowerCase().includes('prompt') &&
           !tool.category?.toLowerCase().includes('prompt');
  });

  // Apply filters first (search and tags) - only on AI tools
  const filteredTools = aiToolsOnly.filter((tool) => {
    const titleMatch = tool.title.toLowerCase().includes(searchTerm.toLowerCase());
    const descriptionMatch = tool.description?.toLowerCase().includes(searchTerm.toLowerCase());
    // Add keyword search functionality
    const keywordMatch = tool.keyword?.toLowerCase().includes(searchTerm.toLowerCase());
    const tagMatch = selectedTag === '' || selectedTag === 'All' || 
                    tool.category === selectedTag || 
                    (tool.tags && tool.tags.includes(selectedTag));
    
    return (titleMatch || descriptionMatch || keywordMatch) && tagMatch;
  });

  // Create pagination for filtered AI tools
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setCurrentPageSize] = useState(12);
  
  // Calculate pagination based on filtered data
  const totalItems = filteredTools.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTools = filteredTools.slice(startIndex, endIndex);

  const pagination = {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    hasMore: currentPage < totalPages
  };

  const setPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const setPageSize = (size) => {
    const newPageSize = Math.max(4, Math.min(size, 100));
    setCurrentPageSize(newPageSize);
    const newTotalPages = Math.ceil(totalItems / newPageSize);
    setCurrentPage(Math.min(currentPage, newTotalPages));
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTag]);

  // Recalculate current page when page size changes to ensure we don't exceed total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [pageSize, totalPages, currentPage]);

  // Helper function to get the appropriate image for a tool
  const getToolImage = useCallback((tool) => {
    // First check if the tool has an image URL from the database
    const imageUrl = getImageUrl(tool);
    if (imageUrl) {
      return imageUrl;
    }
    
    // Try to get an icon based on the tool's name or keyword
    const toolName = tool.title?.split(' ')[0];
    if (iconMap[toolName]) {
      return iconMap[toolName];
    }
    if (iconMap[tool.keyword]) {
      return iconMap[tool.keyword];
    }
    
    // Always use SVG data URIs to avoid external image loading issues
    // Get the appropriate color based on the tool name
    const bgColor = getToolColor(tool.title);
    const textColor = 'ffffff'; // Default white
    
    // Get text to display (use the full name if it fits, otherwise first word)
    const displayText = tool.title ? 
      (tool.title.length > 15 ? tool.title.split(' ')[0] : tool.title) : 
      'AI Tool';
    
    // Use the utility function to create the SVG data URI
    return createSvgDataUri({
      text: displayText,
      width: 300,
      height: 200,
      bgColor,
      textColor,
      fontSize: 24
    });
  }, []); // getToolColor, createSvgDataUri are stable imports; iconMap is a stable module constant

  // Use the new loader component
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-blue-900">
        <div className="mb-8">
          <HashLoader color="#4FD1C5" size={70} speedMultiplier={0.8} />
        </div>
        <div className="text-white text-xl font-semibold mt-4">
          Loading AI Tools
        </div>
        <div className="text-blue-300 text-sm mt-2">
          Discovering the best tools for you...
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
                  AI Tools Directory
                </span>
              </h1>
              <p className="text-white/80 text-center text-lg mb-2">
                Discover the best AI tools to enhance your workflow
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
            </div>
          </div>

          {/* Error state - Loading handled above */}
          {error ? (
            <div className="text-center py-12 glass-effect rounded-2xl p-6">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <button 
                onClick={handleRetry}
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
                  <div className="relative flex-1 md:flex-auto" id="ai-tools-search">
                    <input
                      type="text"
                      placeholder="Search AI tools..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input w-full md:w-72 px-4 py-3 pr-10 rounded-xl bg-white/10 backdrop-blur-md text-white shadow-lg"
                    />
                    <FaSearch className="search-icon absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                    {searchTerm && (
                      <button 
                        type="button" 
                        className="search-clear-button" 
                        onClick={() => setSearchTerm('')}
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
              {aiToolsOnly.length > 0 && (
                <div className="filter-tags-container">
                  <button
                    onClick={() => setSelectedTag('')}
                    className={`filter-button ${selectedTag === '' ? 'active' : ''}`}
                  >
                    All
                  </button>
                  {tags
                    .filter(tag => tag !== 'All')
                    .sort((a, b) => a.localeCompare(b)) // Sort tags alphabetically
                    .map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`filter-button ${selectedTag === tag ? 'active' : ''}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Tools Container - Enhanced with glass effect */}
              {aiToolsOnly.length > 0 ? (
                <div className="glass-effect rounded-3xl p-6 shadow-xl transform transition-transform duration-700 hover:scale-[1.01]">
                  <div className="content-grid">
                    {filteredTools.length === 0 ? (
                      <div className="col-span-2 text-center py-12">
                        <p className="text-white/70">No tools match your search criteria. Try adjusting your filters.</p>
                      </div>
                    ) : (
                      // FIXED: Removed shimmer-effect and animation delay to prevent blinking
                      paginatedTools.map((tool, index) => {
                        // Get valid image URL or fallback
                        // Inlined logic to determine toolImageSrc, preferring iconMap then SVG fallback
                        let toolImageSrc;
                        const toolName = tool.title?.split(' ')[0];
                        if (iconMap[toolName]) {
                          toolImageSrc = iconMap[toolName];
                        } else if (tool.keyword && iconMap[tool.keyword]) {
                          toolImageSrc = iconMap[tool.keyword];
                        } else {
                          const bgColor = getToolColor(tool.title);
                          const textColor = 'ffffff';
                          const displayText = tool.title ? 
                            (tool.title.length > 15 ? tool.title.split(' ')[0] : tool.title) :
                            'AI Tool';
                          toolImageSrc = createSvgDataUri({
                            text: displayText,
                            width: 300,
                            height: 200,
                            bgColor,
                            textColor,
                            fontSize: 24
                          });
                        }
                        
                        // Create a card wrapper for AI tools (no prompts)
                        const CardWrapper = ({ children }) => {
                          return (
                            <a
                              key={tool.id || `tool-${index}`}
                              href={formatLink(tool.url || tool.link)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ai-tool-card glass-effect stable-card"
                            >
                              {children}
                            </a>
                          );
                        };
                        
                        return (
                          <CardWrapper key={tool.id || `tool-${index}`}>
                            <div className="tool-icon-container">
                              <img 
                                src={toolImageSrc}
                                alt={tool.title} 
                                className="img-loading w-full h-full object-cover" 
                                onLoad={handleImageLoad}
                                onError={(e) => handleImageError(e, tool)}
                                loading="lazy"
                              />
                            </div>
                            <div className="ai-tool-content">
                              <div className="flex justify-between items-center">
                                <h3 className="ai-tool-title">{tool.title}</h3>
                                <FaExternalLinkAlt className="external-link-icon" />
                              </div>
                              <p className="ai-tool-description">{tool.description}</p>
                              <div className="ai-tool-tags">
                                <span className="ai-tool-primary-tag">
                                  {tool.category || tool.keyword || 'AI Tool'}
                                </span>
                                {tool.tags?.slice(0, 2).map((tag, tagIndex) => (
                                  <span 
                                    key={tagIndex} 
                                    className="ai-tool-secondary-tag"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </CardWrapper>
                        );
                      })
                    )}
                  </div>
                  
                  {/* Pagination Controls - Always show for navigation and page size options */}
                  {filteredTools.length > 0 && (
                    <div className="flex justify-center items-center mt-8 pagination-controls">
                      {/* Navigation buttons - only show when multiple pages */}
                      {totalPages > 1 && (
                        <>
                          <button
                            onClick={() => setPage(1)}
                            disabled={pagination.currentPage === 1}
                            className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 text-white shadow-lg transition-all duration-300 mx-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            First
                          </button>
                          
                          <button
                            onClick={() => setPage(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 text-white shadow-lg transition-all duration-300 mx-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            &laquo; Prev
                          </button>
                          
                          <div className="flex items-center mx-4">
                            <span className="text-white/80">Page</span>
                            <span className="mx-2 px-3 py-1 bg-white/20 rounded-md text-white font-medium">{pagination.currentPage}</span>
                            <span className="text-white/80">of {pagination.totalPages}</span>
                          </div>
                          
                          <button
                            onClick={() => setPage(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 text-white shadow-lg transition-all duration-300 mx-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next &raquo;
                          </button>
                          
                          <button
                            onClick={() => setPage(pagination.totalPages)}
                            disabled={pagination.currentPage === pagination.totalPages}
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
                          value={pagination.pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                          className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-md text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-gray-800 [&>option]:text-white"
                        >
                          <option value="12">12</option>
                          <option value="24">24</option>
                          <option value="48">48</option>
                        </select>
                        {totalPages === 1 && (
                          <span className="ml-3 text-white/60 text-sm">
                            (Showing all {filteredTools.length} items)
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
                  <p className="text-white/70 mb-4">No AI tools found in the database.</p>
                  <p className="text-white/50 mb-6">AI tools need to be added by an administrator.</p>
                  
                  {/* Admin-only button */}
                  <a 
                    href="/admin/ai-tools"
                    className="px-6 py-3 bg-gradient-to-r from-purple-500/60 to-pink-500/60 rounded-lg text-white font-medium hover:from-purple-500/80 hover:to-pink-500/80 transition-all duration-300"
                  >
                    Go to Admin Panel
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AITools;