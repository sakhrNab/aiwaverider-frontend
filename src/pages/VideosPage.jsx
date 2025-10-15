import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { AuthContext } from '../contexts/AuthContext';
import PlatformSection from '../components/videos/PlatformSection';
import VideosService from '../services/videosService';
import { toast } from 'react-toastify';
import { db } from '../utils/firebase';
import '../styles/animations.css'; // Import animations

// Platform SVG Icons - Enhanced with gradients and better styling
const PlatformIcons = {
  all: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <defs>
        <linearGradient id="allGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path d="M8 5v14l11-7z" fill="url(#allGradient)" />
      <circle cx="12" cy="12" r="10" stroke="url(#allGradient)" strokeWidth="1.5" fill="none" opacity="0.3" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <defs>
        <linearGradient id="youtubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0000" />
          <stop offset="100%" stopColor="#cc0000" />
        </linearGradient>
      </defs>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="url(#youtubeGradient)" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <defs>
        <linearGradient id="tiktokGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0050" />
          <stop offset="50%" stopColor="#00f2ea" />
          <stop offset="100%" stopColor="#ff0050" />
        </linearGradient>
      </defs>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="url(#tiktokGradient)" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <defs>
        <radialGradient id="instagramGradient" cx="30%" cy="107%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="url(#instagramGradient)" />
    </svg>
  )
};

/**
 * Videos Page - Main page displaying videos from all platforms
 */
const VideosPage = () => {
  const { darkMode } = useTheme();
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'youtube', 'tiktok', 'instagram'
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Add search query state
  const searchInputRef = useRef(null); // Ref for search input
  const resultsRef = useRef(null); // Ref for results section
  const [isSearchFloating, setIsSearchFloating] = useState(false); // Track if search is floating
  
  // Filter states
  const [filters, setFilters] = useState({
    author: '', // Filter by author/user name
    minViews: '',
    maxViews: '',
    minLikes: '',
    maxLikes: '',
    category: 'all' // 'all', 'tech', 'entertainment', 'education', 'music', 'sports', 'news'
  });
  
  // Track filtered results per platform for smart ordering
  const [platformResults, setPlatformResults] = useState({
    youtube: 0,
    tiktok: 0,
    instagram: 0
  });

  const [editFormData, setEditFormData] = useState({
    platform: 'youtube',
    title: '',
    authorName: '',
    username: '',
    originalUrl: '',
    thumbnailUrl: '',
    views: 0,
    likes: 0,
    addedBy: user?.displayName || user?.email || 'Admin'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useDocumentTitle('Videos Gallery');

  // Check if user is admin
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  // Auto-detect platform from URL
  const detectPlatformFromUrl = (url) => {
    if (!url) return null;
    const u = url.toLowerCase();
    if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
    if (u.includes('tiktok.com')) return 'tiktok';
    if (u.includes('instagram.com')) return 'instagram';
    return null;
  };

  // Keyboard shortcut for search focus (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }
      
      // Escape to clear search when focused
      if (event.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchQuery('');
        searchInputRef.current.blur();
        setIsSearchFloating(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle search query changes and auto-scroll to results
  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      setIsSearchFloating(true);
      
      // Auto-scroll to results with smooth animation
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 300); // Delay to allow search effects to render
    } else {
      setIsSearchFloating(false);
    }
  }, [searchQuery]);

  // Handle scroll to hide floating search when back at top
  useEffect(() => {
    const handleScroll = () => {
      // Only manage floating search if there's an active search query
      if (searchQuery && searchQuery.trim()) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const searchInputPosition = searchInputRef.current?.offsetTop || 0;
        
        // Hide floating search if user scrolls back to the main search area (with some buffer)
        if (scrollTop < searchInputPosition + 200) {
          setIsSearchFloating(false);
        } else {
          setIsSearchFloating(true);
        }
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [searchQuery]); // Re-run when searchQuery changes

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setUserIsAdmin(false);
        return;
      }
      
      try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        setUserIsAdmin(userData?.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setUserIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  // Handle video play action
  const handleVideoPlay = useCallback((video) => {
    // You can implement custom video player here or just open the original URL
    console.log('Playing video:', video);
    window.open(video.originalUrl, '_blank', 'noopener,noreferrer');
  }, []);

  // Available categories - Tech is common across all platforms, others are alternatives
  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'tech', label: 'Tech' }, // Common across all platforms
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'education', label: 'Education' },
    { id: 'music', label: 'Music' },
    { id: 'sports', label: 'Sports' },
    { id: 'news', label: 'News' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'comedy', label: 'Comedy' }
  ];

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      author: '',
      minViews: '',
      maxViews: '',
      minLikes: '',
      maxLikes: '',
      category: 'all'
    });
  };

  // Check if any filters or search are active
  const hasActiveFilters = () => {
    return filters.author || filters.minViews || filters.maxViews || 
           filters.minLikes || filters.maxLikes || filters.category !== 'all' ||
           (searchQuery && searchQuery.trim());
  };

  // Helper function to determine platform rendering order based on filter/search results
  const getPlatformOrder = (platformResults) => {
    if (!hasActiveFilters()) {
      // Default order when no filters or search are active
      return ['youtube', 'tiktok', 'instagram'];
    }

    // Sort platforms by number of results (descending), then by name
    const platformsWithResults = Object.entries(platformResults)
      .sort(([, aResults], [, bResults]) => {
        // First sort by whether they have results
        if (aResults > 0 && bResults === 0) return -1;
        if (aResults === 0 && bResults > 0) return 1;
        // Then by number of results (descending)
        if (aResults !== bResults) return bResults - aResults;
        // Finally by platform name for consistency
        return 0;
      })
      .map(([platform]) => platform);

    return platformsWithResults;
  };

  // Handle admin edit button click
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // Handle form input changes (with auto-detect for URL)
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'originalUrl') {
        const detected = detectPlatformFromUrl(value);
        if (detected) {
          next.platform = detected;
        }
      }
      return next;
    });
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('=== handleFormSubmit ===');
      console.log('Form data:', JSON.stringify(editFormData, null, 2));
      
      // Basic validation - only URL is required
      if (!editFormData.originalUrl) {
        toast.error('Video URL is required');
        return;
      }

      // Validate URL format
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(editFormData.originalUrl)) {
        toast.error('Please enter a valid URL starting with http:// or https://');
        return;
      }

      // Validate platform-specific URL patterns
      const platformValidation = {
        youtube: /youtube\.com\/watch\?v=|youtu\.be\//,
        tiktok: /tiktok\.com\//,
        instagram: /instagram\.com\/(p|reel)\//
      };

      const platformKey = editFormData.platform.toLowerCase();
      if (platformValidation[platformKey] && !platformValidation[platformKey].test(editFormData.originalUrl)) {
        toast.error(`The URL doesn't appear to be a valid ${editFormData.platform} URL`);
        return;
      }

      // Prepare video data
      const videoData = {
        platform: editFormData.platform.toLowerCase().trim(),
        originalUrl: editFormData.originalUrl.trim(),
        addedBy: editFormData.addedBy || user?.displayName || user?.email || 'Admin'
      };

      // Add optional fields only if they have values
      if (editFormData.title && editFormData.title.trim()) {
        videoData.title = editFormData.title.trim();
      }
      if (editFormData.authorName && editFormData.authorName.trim()) {
        videoData.authorName = editFormData.authorName.trim();
      }
      if (editFormData.username && editFormData.username.trim()) {
        videoData.username = editFormData.username.trim();
      }
      if (editFormData.thumbnailUrl && editFormData.thumbnailUrl.trim()) {
        // Validate thumbnail URL
        if (!urlPattern.test(editFormData.thumbnailUrl.trim())) {
          toast.error('Please enter a valid thumbnail URL');
          return;
        }
        videoData.thumbnailUrl = editFormData.thumbnailUrl.trim();
      }
      if (editFormData.views && parseInt(editFormData.views) > 0) {
        videoData.views = parseInt(editFormData.views);
      }
      if (editFormData.likes && parseInt(editFormData.likes) > 0) {
        videoData.likes = parseInt(editFormData.likes);
      }

      console.log('Final video data to send:', JSON.stringify(videoData, null, 2));
      
      // Validate required fields one more time
      if (!videoData.platform || !videoData.originalUrl || !videoData.addedBy) {
        console.error('Missing required fields:', {
          platform: videoData.platform,
          originalUrl: videoData.originalUrl,
          addedBy: videoData.addedBy
        });
        toast.error('Missing required fields. Please check the form.');
        return;
      }

      console.log('Sending video to VideosService.addVideo...');
      const result = await VideosService.addVideo(videoData);
      console.log('VideosService.addVideo result:', result);
      
      toast.success('Video added successfully!');
      setShowEditModal(false);
      setEditFormData({
        platform: 'youtube',
        title: '',
        authorName: '',
        username: '',
        originalUrl: '',
        thumbnailUrl: '',
        views: 0,
        likes: 0,
        addedBy: user?.displayName || user?.email || 'Admin'
      });
    } catch (error) {
      console.error('=== Error in handleFormSubmit ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to add video. Please try again.';
      
      if (error.message) {
        if (error.message.includes('Authentication required')) {
          errorMessage = 'Please log in as an admin to add videos.';
        } else if (error.message.includes('400')) {
          errorMessage = 'Invalid video data. Please check all fields and try again.';
        } else if (error.message.includes('401')) {
          errorMessage = 'You are not authorized to add videos. Admin access required.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Access denied. Admin privileges required.';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tab configuration with SVG icons
  const tabs = [
    { id: 'all', label: 'All Platforms', icon: PlatformIcons.all },
    { id: 'youtube', label: 'YouTube', icon: PlatformIcons.youtube },
    { id: 'tiktok', label: 'TikTok', icon: PlatformIcons.tiktok },
    { id: 'instagram', label: 'Instagram', icon: PlatformIcons.instagram }
  ];

  const getTabStyle = (tabId) => {
    const isActive = activeTab === tabId;
    return `
      px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200
      backdrop-blur-sm border
      ${isActive
        ? darkMode
          ? 'bg-blue-600/80 text-white border-blue-500/50 shadow-lg shadow-blue-500/25'
          : 'bg-blue-500/80 text-white border-blue-400/50 shadow-lg shadow-blue-500/25'
        : darkMode
          ? 'bg-gray-800/60 text-gray-300 border-gray-700/50 hover:bg-gray-700/80 hover:text-white'
          : 'bg-white/60 text-gray-700 border-gray-300/50 hover:bg-white/80 hover:text-gray-900'
      }
      hover:shadow-md cursor-pointer
    `;
  };

  // Temporary admin role setter (remove in production)
  const setAdminRole = async () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }
    
    try {
      await db.collection('users').doc(user.uid).set({
        email: user.email,
        displayName: user.displayName,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }, { merge: true });
      
      console.log('Admin role set successfully');
      toast.success('Admin role set! Please refresh the page.');
    } catch (error) {
      console.error('Error setting admin role:', error);
      toast.error('Failed to set admin role');
    }
  };

  // Update platform results when filters change
  const updatePlatformResults = useCallback((platform, resultCount) => {
    setPlatformResults(prev => ({
      ...prev,
      [platform]: resultCount
    }));
  }, []);

  return (
    <div className={`min-h-screen pb-16 ${darkMode ? "dark bg-[#2D1846]" : "bg-gray-50"} bg-gradient-to-br from-[#4158D0] via-[#C850C0] to-[#FFCC70] stars-pattern`}>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className={`
          absolute inset-0
          ${darkMode
            ? 'bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1),transparent)] bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1),transparent)]'
            : 'bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.05),transparent)] bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.05),transparent)]'
          }
        `} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="max-w-7xl mx-auto">
            {/* Temporary Admin Role Setter (REMOVE IN PRODUCTION) */}
            {user && !userIsAdmin && (
              <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                  Debug: User is not admin. Click to set admin role:
                </p>
                <button
                  onClick={setAdminRole}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium"
                >
                  Set Admin Role (Debug)
                </button>
              </div>
            )}

            {/* Admin Edit Button */}
            {userIsAdmin && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleEditClick}
                  className={`
                    px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200
                    backdrop-blur-sm border flex items-center space-x-2
                    ${darkMode
                      ? 'bg-purple-600/80 text-white border-purple-500/50 hover:bg-purple-700/80'
                      : 'bg-purple-500/80 text-white border-purple-400/50 hover:bg-purple-600/80'
                    }
                    shadow-lg hover:shadow-xl
                  `}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Edit</span>
                </button>
              </div>
            )}

            {/* Main Title */}
            <div className="text-center mb-8">
              <h1 className={`
                text-4xl sm:text-5xl lg:text-6xl font-bold mb-4
                ${darkMode ? 'text-white' : 'text-gray-900'}
                bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
              `}>
                Videos Gallery
              </h1>
              <p className={`
                text-lg sm:text-xl max-w-3xl mx-auto mb-8
                ${darkMode ? 'text-gray-300' : 'text-gray-300'}
              `}>
                Discover trending videos from YouTube, TikTok, and Instagram all in one place
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      // If user clicks on search while already searching, keep floating
                      if (searchQuery && searchQuery.trim()) {
                        setIsSearchFloating(true);
                      }
                    }}
                    placeholder="Search videos by title, description, author, or platform... (Ctrl+K)"
                    className={`
                      w-full px-6 py-4 pl-12 pr-16 rounded-2xl border
                      ${darkMode 
                        ? 'bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-400' 
                        : 'bg-white/40 border-gray-300/50 text-gray-200 placeholder-gray-800'
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      backdrop-blur-sm transition-all duration-300 ease-out
                      ${searchQuery && searchQuery.trim() 
                        ? `shadow-2xl transform hover:scale-105 hover:-translate-y-1 
                           ${darkMode 
                             ? 'shadow-blue-500/25 border-blue-500/50 bg-gray-800/80' 
                             : 'shadow-blue-500/20 border-blue-400/60 bg-white/90'
                           }
                           ring-2 ring-blue-500/30` 
                        : 'shadow-lg hover:shadow-xl hover:scale-102 hover:-translate-y-0.5'
                      }
                      group-hover:shadow-2xl
                      ${isSearchFloating && searchQuery ? 'opacity-70' : ''}
                    `}
                    ref={searchInputRef}
                  />
                  
                  {/* Search Icon with enhanced effects */}
                  <div className={`
                    absolute left-4 top-1/2 transform -translate-y-1/2 
                    transition-all duration-300 ease-out
                    ${searchQuery && searchQuery.trim() 
                      ? `scale-110 ${darkMode ? 'text-blue-400' : 'text-blue-700'}` 
                      : `${darkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-700'}`
                    }
                  `}>
                    <svg 
                      className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  {/* Close Button - Positioned inside the input field */}
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchFloating(false);
                        // Smooth scroll back to top
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`
                        absolute right-3 top-1/2 transform -translate-y-1/2 
                        p-1.5 rounded-full transition-all duration-300 ease-out
                        hover:scale-125 hover:rotate-180 active:scale-95
                        ${darkMode 
                          ? 'text-gray-400 hover:text-white hover:bg-red-600/30 hover:shadow-xl hover:shadow-red-500/40' 
                          : 'text-gray-500 hover:text-red-600 hover:bg-red-50 hover:shadow-xl hover:shadow-red-500/30'
                        }
                        group
                        border border-transparent hover:border-red-500/50
                      `}
                      title="Close search and return to top"
                    >
                      <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Keyboard Shortcut Hint */}
                  {!searchQuery && (
                    <div className={`
                      absolute right-4 top-1/2 transform -translate-y-1/2 
                      hidden sm:flex items-center space-x-1 text-xs
                      ${darkMode ? 'text-gray-500' : 'text-gray-400'}
                      transition-all duration-300 group-hover:opacity-100
                    `}>
                      <kbd className={`
                        px-1.5 py-0.5 rounded text-xs font-mono
                        ${darkMode ? 'bg-gray-700/50 border border-gray-600/50 text-gray-300' : 'bg-gray-200/80 border border-gray-400/50 text-gray-700'}
                      `}>
                        {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
                      </kbd>
                      <kbd className={`
                        px-1.5 py-0.5 rounded text-xs font-mono
                        ${darkMode ? 'bg-gray-700/50 border border-gray-600/50 text-gray-300' : 'bg-gray-200/80 border border-gray-400/50 text-gray-700'}
                      `}>
                        K
                      </kbd>
                    </div>
                  )}
                  
                  {/* Search Now Button - appears on hover when no search is active */}
                  {!searchQuery && !isSearchFloating && (
                    <button
                      onClick={() => {
                        if (searchInputRef.current) {
                          searchInputRef.current.focus();
                        }
                      }}
                      className={`
                        absolute right-4 top-1/2 transform -translate-y-1/2 
                        px-3 py-1.5 rounded-lg text-xs font-medium
                        transition-all duration-300 ease-out opacity-0 group-hover:opacity-100
                        hover:scale-110 active:scale-95
                        ${darkMode 
                          ? 'bg-blue-600/80 text-white hover:bg-blue-500 border border-blue-500/50' 
                          : 'bg-blue-500/80 text-white hover:bg-blue-600 border border-blue-400/50'
                        }
                        backdrop-blur-sm shadow-lg hover:shadow-xl
                        sm:hidden
                      `}
                      title="Start searching"
                    >
                      Search
                    </button>
                  )}
                  
                  {/* Search glow effect when active */}
                  {searchQuery && searchQuery.trim() && (
                    <div className={`
                      absolute inset-0 rounded-2xl transition-all duration-300
                      ${darkMode 
                        ? 'bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10' 
                        : 'bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5'
                      }
                      -z-10 blur-xl scale-105 animate-pulse-slow
                    `} />
                  )}
                </div>
                
                {/* Enhanced Search Results Indicator */}
                {searchQuery && searchQuery.trim() && (
                  <div className={`
                    mt-4 text-center transition-all duration-300 animate-fadeIn
                  `}>
                    <div className={`
                      inline-flex items-center space-x-2 px-4 py-2 rounded-full
                      ${darkMode 
                        ? 'bg-blue-900/30 text-blue-300 border border-blue-700/50' 
                        : 'bg-blue-50/80 text-blue-700 border border-blue-200/60'
                      }
                      backdrop-blur-sm shadow-lg
                    `}>
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-sm font-medium">
                        Searching for: <span className="font-bold">"{searchQuery}"</span>
                      </span>
                      <div className={`
                        w-2 h-2 rounded-full animate-pulse
                        ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}
                      `} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className={`
              flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl
              ${darkMode 
                ? 'bg-gray-800/40 backdrop-blur-xl border border-gray-700/30' 
                : 'bg-white/40 backdrop-blur-xl border border-white/30'
              }
              shadow-lg
            `}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={getTabStyle(tab.id)}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Filter Section */}
            <div className={`
              mt-6 rounded-2xl overflow-hidden transition-all duration-300
              ${darkMode 
                ? 'bg-gray-800/40 backdrop-blur-xl border border-gray-700/30' 
                : 'bg-white/40 backdrop-blur-xl border border-white/30'
              }
              shadow-lg
            `}>
              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  w-full px-6 py-4 flex items-center justify-between
                  ${darkMode ? 'text-white hover:bg-gray-700/50' : 'text-gray-900 hover:bg-gray-100/50'}
                  transition-colors duration-200
                `}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="font-medium">Filters</span>
                  {hasActiveFilters() && (
                    <span className={`
                      px-2 py-1 text-xs rounded-full
                      ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}
                    `}>
                      Active
                    </span>
                  )}
                </div>
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Filter Content */}
              {showFilters && (
                <div className="px-6 pb-6 space-y-6 border-t border-gray-200/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                    {/* Author Filter */}
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Author/Creator
                      </label>
                      <input
                        type="text"
                        value={filters.author}
                        onChange={(e) => handleFilterChange('author', e.target.value)}
                        placeholder="Search by author name..."
                        className={`
                          w-full px-4 py-2 rounded-lg border
                          ${darkMode 
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500'
                          }
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all duration-200
                        `}
                      />
                    </div>

                    {/* Category Filter */}
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Category
                      </label>
                      <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className={`
                          w-full px-4 py-2 rounded-lg border
                          ${darkMode 
                            ? 'bg-gray-700/50 border-gray-600 text-white' 
                            : 'bg-white/70 border-gray-300 text-gray-900'
                          }
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all duration-200
                        `}
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Views Range */}
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Views Range
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={filters.minViews}
                          onChange={(e) => handleFilterChange('minViews', e.target.value)}
                          placeholder="Min views"
                          className={`
                            flex-1 px-3 py-2 rounded-lg border text-sm
                            ${darkMode 
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500'
                            }
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            transition-all duration-200
                          `}
                        />
                        <input
                          type="number"
                          value={filters.maxViews}
                          onChange={(e) => handleFilterChange('maxViews', e.target.value)}
                          placeholder="Max views"
                          className={`
                            flex-1 px-3 py-2 rounded-lg border text-sm
                            ${darkMode 
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500'
                            }
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            transition-all duration-200
                          `}
                        />
                      </div>
                    </div>

                    {/* Likes Range */}
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Likes Range
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={filters.minLikes}
                          onChange={(e) => handleFilterChange('minLikes', e.target.value)}
                          placeholder="Min likes"
                          className={`
                            flex-1 px-3 py-2 rounded-lg border text-sm
                            ${darkMode 
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500'
                            }
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            transition-all duration-200
                          `}
                        />
                        <input
                          type="number"
                          value={filters.maxLikes}
                          onChange={(e) => handleFilterChange('maxLikes', e.target.value)}
                          placeholder="Max likes"
                          className={`
                            flex-1 px-3 py-2 rounded-lg border text-sm
                            ${darkMode 
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500'
                            }
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            transition-all duration-200
                          `}
                        />
                      </div>
                    </div>

                    {/* Clear Filters Button */}
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        disabled={!hasActiveFilters()}
                        className={`
                          w-full px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                          ${hasActiveFilters()
                            ? darkMode
                              ? 'bg-red-600/80 text-white hover:bg-red-700/80 border border-red-500/50'
                              : 'bg-red-500/80 text-white hover:bg-red-600/80 border border-red-400/50'
                            : darkMode
                              ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed border border-gray-600/50'
                              : 'bg-gray-200/50 text-gray-400 cursor-not-allowed border border-gray-300/50'
                          }
                        `}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  {hasActiveFilters() && (
                    <div className="pt-4 border-t border-gray-200/20">
                      <div className="flex flex-wrap gap-2">
                        {filters.author && (
                          <span className={`
                            px-3 py-1 text-xs rounded-full flex items-center space-x-1
                            ${darkMode ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-100 text-blue-800'}
                          `}>
                            <span>Author: {filters.author}</span>
                            <button
                              onClick={() => handleFilterChange('author', '')}
                              className="ml-1 hover:text-red-400"
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {filters.category !== 'all' && (
                          <span className={`
                            px-3 py-1 text-xs rounded-full flex items-center space-x-1
                            ${darkMode ? 'bg-purple-600/20 text-purple-300' : 'bg-purple-100 text-purple-800'}
                          `}>
                            <span>Category: {categories.find(c => c.id === filters.category)?.label}</span>
                            <button
                              onClick={() => handleFilterChange('category', 'all')}
                              className="ml-1 hover:text-red-400"
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {(filters.minViews || filters.maxViews) && (
                          <span className={`
                            px-3 py-1 text-xs rounded-full flex items-center space-x-1
                            ${darkMode ? 'bg-yellow-600/20 text-yellow-300' : 'bg-yellow-100 text-yellow-800'}
                          `}>
                            <span>
                              Views: {filters.minViews || '0'} - {filters.maxViews || '∞'}
                            </span>
                            <button
                              onClick={() => {
                                handleFilterChange('minViews', '');
                                handleFilterChange('maxViews', '');
                              }}
                              className="ml-1 hover:text-red-400"
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {(filters.minLikes || filters.maxLikes) && (
                          <span className={`
                            px-3 py-1 text-xs rounded-full flex items-center space-x-1
                            ${darkMode ? 'bg-pink-600/20 text-pink-300' : 'bg-pink-100 text-pink-800'}
                          `}>
                            <span>
                              Likes: {filters.minLikes || '0'} - {filters.maxLikes || '∞'}
                            </span>
                            <button
                              onClick={() => {
                                handleFilterChange('minLikes', '');
                                handleFilterChange('maxLikes', '');
                              }}
                              className="ml-1 hover:text-red-400"
                            >
                              ×
                            </button>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:px-8 pb-16" ref={resultsRef}>
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Filter/Search Results Indicator */}
            {hasActiveFilters() && (
              <div className={`
                p-4 rounded-lg text-center text-sm transition-all duration-300 animate-fadeIn
                ${darkMode 
                  ? 'bg-blue-900/20 border border-blue-700/30 text-blue-300' 
                  : 'bg-blue-50 border border-blue-200 text-blue-800'
                }
              `}>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {searchQuery && searchQuery.trim() ? (
                    <>
                      <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="font-medium">
                        Search results for "{searchQuery}" - Platforms with matches shown first
                      </span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      <span className="font-medium">Platforms with filter results shown first</span>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-center space-x-1 text-xs opacity-75">
                  <span>
                    {Object.values(platformResults).reduce((a, b) => a + b, 0)} total results
                  </span>
                  {searchQuery && searchQuery.trim() && (
                    <>
                      <span>•</span>
                      <span className="animate-pulse">Live search active</span>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* All Platforms View */}
            {activeTab === 'all' && (
              <div className="space-y-16">
                {getPlatformOrder(platformResults).map((platform) => (
                  <PlatformSection
                    key={platform}
                    platform={platform}
                    onVideoPlay={handleVideoPlay}
                    filters={filters}
                    searchQuery={searchQuery}
                    onResultsChange={updatePlatformResults}
                  />
                ))}
              </div>
            )}

            {/* Individual Platform Views */}
            {activeTab !== 'all' && (
              <PlatformSection
                platform={activeTab}
                onVideoPlay={handleVideoPlay}
                filters={filters}
                searchQuery={searchQuery}
                onResultsChange={updatePlatformResults}
              />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className={`
          text-center py-8 px-4
          ${darkMode ? 'text-gray-400' : 'text-gray-600'}
        `}>
          <div className={`
            max-w-md mx-auto p-4 rounded-xl
            ${darkMode 
              ? 'bg-gray-800/40 backdrop-blur-xl border border-gray-700/30' 
              : 'bg-white/40 backdrop-blur-xl border border-white/30'
            }
          `}>
            <p className="text-sm">
              Powered by AI Waverider • Discover the best content across platforms
            </p>
          </div>
        </footer>
      </div>

      {/* Floating Search Overlay */}
      {isSearchFloating && (
        <div className={`
          fixed top-4 left-1/2 transform -translate-x-1/2 z-40
          transition-all duration-500 ease-out animate-slideUp
        `}>
          <div className={`
            relative max-w-2xl mx-auto p-4 rounded-2xl
            ${darkMode 
              ? 'bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-blue-500/25' 
              : 'bg-white/95 backdrop-blur-xl border border-white/50 shadow-2xl shadow-blue-500/20'
            }
            transform hover:scale-105 transition-all duration-300 ease-out
            animate-floatSearch
          `}>
            {/* Floating Search Input */}
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className={`
                  w-full px-6 py-3 pl-12 pr-14 rounded-xl border
                  ${darkMode 
                    ? 'bg-gray-800/80 border-gray-600/50 text-white placeholder-gray-300' 
                    : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-600'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  backdrop-blur-sm transition-all duration-300 ease-out
                  shadow-lg hover:shadow-xl
                `}
                autoFocus
              />
              
              {/* Search Icon */}
              <div className={`
                absolute left-4 top-1/2 transform -translate-y-1/2 
                ${darkMode ? 'text-blue-400' : 'text-blue-700'}
                transition-all duration-300
              `}>
                <svg 
                  className="w-5 h-5 animate-pulse"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Close Button - Positioned inside the input field */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchFloating(false);
                  // Smooth scroll back to top
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`
                  absolute right-3 top-1/2 transform -translate-y-1/2 
                  p-1.5 rounded-full transition-all duration-300 ease-out
                  hover:scale-125 hover:rotate-180 active:scale-95
                  ${darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-red-600/30 hover:shadow-xl hover:shadow-red-500/40' 
                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50 hover:shadow-xl hover:shadow-red-500/30'
                  }
                  group
                  border border-transparent hover:border-red-500/50
                `}
                title="Close search and return to top"
              >
                <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Search Status */}
            <div className={`
              mt-3 flex items-center justify-center space-x-2 text-sm
              ${darkMode ? 'text-blue-300' : 'text-blue-700'}
            `}>
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="font-medium">
                Searching for: <span className="font-bold">"{searchQuery}"</span>
              </span>
              <div className={`
                w-2 h-2 rounded-full animate-pulse
                ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}
              `} />
            </div>
            
            {/* Floating search glow effect */}
            <div className={`
              absolute inset-0 rounded-2xl transition-all duration-500
              ${darkMode 
                ? 'bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20' 
                : 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10'
              }
              -z-10 blur-2xl scale-110 animate-pulse-slow
            `} />
          </div>
        </div>
      )}

      {/* Admin Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`
            w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl
            ${darkMode 
              ? 'bg-gray-800/95 backdrop-blur-xl border border-gray-700/50' 
              : 'bg-white/95 backdrop-blur-xl border border-white/50'
            }
            shadow-2xl
          `}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Add New Video
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                  `}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Platform Selection */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Platform
                  </label>
                  <select
                    name="platform"
                    value={editFormData.platform}
                    onChange={handleFormChange}
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `}
                  >
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleFormChange}
                    placeholder="Enter video title (will be auto-generated if empty)"
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    `}
                  />
                </div>

                {/* Author Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Author Name
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    value={editFormData.authorName}
                    onChange={handleFormChange}
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `}
                    placeholder="Enter author name"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={editFormData.username}
                    onChange={handleFormChange}
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `}
                    placeholder="Enter username"
                  />
                </div>

                {/* Original URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Video URL *
                  </label>
                  <input
                    type="url"
                    name="originalUrl"
                    value={editFormData.originalUrl}
                    onChange={handleFormChange}
                    required
                    placeholder="https://www.youtube.com/watch?v=... or https://www.tiktok.com/... or https://www.instagram.com/..."
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    `}
                  />
                </div>

                {/* Thumbnail URL */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    name="thumbnailUrl"
                    value={editFormData.thumbnailUrl}
                    onChange={handleFormChange}
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `}
                    placeholder="Enter thumbnail URL"
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Views
                    </label>
                    <input
                      type="number"
                      name="views"
                      value={editFormData.views}
                      onChange={handleFormChange}
                      min="0"
                      className={`
                        w-full px-3 py-2 rounded-lg border
                        ${darkMode 
                          ? 'bg-gray-700/50 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                        }
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                      `}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Likes
                    </label>
                    <input
                      type="number"
                      name="likes"
                      value={editFormData.likes}
                      onChange={handleFormChange}
                      min="0"
                      className={`
                        w-full px-3 py-2 rounded-lg border
                        ${darkMode 
                          ? 'bg-gray-700/50 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                        }
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                      `}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className={`
                      px-6 py-2 rounded-lg font-medium transition-colors
                      ${darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }
                    `}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      px-6 py-2 rounded-lg font-medium transition-colors
                      ${darkMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Video'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideosPage; 