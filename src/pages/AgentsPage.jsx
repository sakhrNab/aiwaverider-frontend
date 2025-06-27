//src/pages
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
// import SearchBar from '../components/agents/SearchBar'; // Replaced with VideosPage search implementation
import CategoryNav from '../components/agents/CategoryNav';
import FeaturedAgents from '../components/agents/FeaturedAgents';
// import WishlistSection from '../components/agents/WishlistSection';
import FilterSidebar from '../components/agents/FilterSidebar';
import AgentCard from '../components/agents/AgentCard';
import AgentCarousel from '../components/agents/AgentCarousel';
import { useTheme } from '../contexts/ThemeContext';
import { FaExclamationTriangle, FaCalendarAlt, FaArrowRight, FaBars, FaTimes, FaFilter, FaSync } from 'react-icons/fa';
import { HashLoader } from 'react-spinners';
import { FixedSizeGrid } from 'react-window';
import useAgentStore from '../store/agentStore';
import './AgentsPage.css';
import '../styles/animations.css'; // Import animations for heartbeat-pulse
// No longer using debounce

// Import theme classes - similar to AITools.jsx
const themeClasses = "bg-gradient-to-br from-[#4158D0] via-[#C850C0] to-[#FFCC70] stars-pattern";
const headerClass = "text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100";
const subHeaderClass = "text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200";
const sectionClass = "mb-12";
const cardGridClass = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

// Add debounce function to reduce unnecessary filter calls
// function debounce(func, wait) {
//   let timeout;
//   return function executedFunction(...args) {
//     const later = () => {
//       clearTimeout(timeout);
//       func(...args);
//     };
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//   };
// }

const Agents = () => {
  const location = useLocation();
  const { darkMode } = useTheme();
  
  // Get state from Zustand store
  const { 
    agents, 
    featuredAgents, 
    recommendedAgents, 
    wishlists,
    selectedCategory,
    selectedFilter,
    selectedPrice,
    selectedRating,
    searchQuery,
    selectedTags,
    selectedFeatures,
    tagCounts,
    featureCounts,
    isLoading,
    isRecommendationsLoading,
    pagination,
    
    // Actions
    setCategory,
    setFilter,
    setPrice,
    setRating,
    setSearchQuery,
    toggleTag,
    toggleFeature,
    resetFilters,
    loadInitialData,
    applyFilters,
    loadMore,
    setPage,
    setPageSize
  } = useAgentStore();

  // Local UI states  
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [mobileOptionsOpen, setMobileOptionsOpen] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Add a ref for the agents container
  const agentsContainerRef = useRef(null);
  const mountedRef = useRef(false);
  const dataLoadedRef = useRef(false);
  const applyFiltersTimeoutRef = useRef(null);

  // Search-related refs and state - improved implementation
  const searchInputRef = useRef(null);
  const mainSearchBarRef = useRef(null);
  const resultsRef = useRef(null);
  const [isSearchFloating, setIsSearchFloating] = React.useState(false);
  const [localSearchQuery, setLocalSearchQuery] = React.useState(searchQuery || '');



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
        handleClearSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle scroll to show/hide floating search
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Get the position of the search wrapper (not just the input)
      const searchWrapper = document.querySelector('.search-wrapper');
      const categoryNav = document.querySelector('.curated-marketplace');
      const filterSearchContainer = document.querySelector('.filter-search-container');
      
      if (!searchWrapper || !categoryNav || !filterSearchContainer) {
        return; // Elements not ready yet
      }
      
      // Get the bottom position of the entire search area
      const searchWrapperRect = searchWrapper.getBoundingClientRect();
      const categoryNavRect = categoryNav.getBoundingClientRect();
      const filterContainerRect = filterSearchContainer.getBoundingClientRect();
      
      // Calculate the bottom position of the entire search section
      const searchSectionBottom = window.pageYOffset + filterContainerRect.bottom;
      
      // Show floating search only when the entire search section is not visible
      // Hide it as soon as any part of the search area becomes visible
      const isSearchSectionVisible = 
        categoryNavRect.bottom > 0 || // CategoryNav is visible
        filterContainerRect.bottom > 0 || // Filter container is visible
        searchWrapperRect.bottom > 0; // Search wrapper is visible
      
      // Only show floating search when the search section is completely scrolled past
      if (!isSearchSectionVisible && scrollTop > searchSectionBottom + 50) {
        setIsSearchFloating(true);
      } else {
        setIsSearchFloating(false);
      }
    };
    // Add scroll event listener with throttling for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []); // No dependencies needed since it should work regardless of search state

  // Sync local search query with store
  useEffect(() => {
    setLocalSearchQuery(searchQuery || '');
  }, [searchQuery]);

  // Initial data load - only run once with proper mount check
  useEffect(() => {
    // Set visibility check for page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && dataLoadedRef.current) {
        // Check if data needs refreshing (only if more than 30 minutes old)
        // Don't actually refresh automatically, leave that to user action
        console.log('Page is visible - not auto-refreshing data to save quota');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Only load data if this is the first mount and data isn't already loaded
    if (!mountedRef.current) {
      mountedRef.current = true;
      
      // Check if we already have agents in the store before loading
      const currentAgents = useAgentStore.getState().allAgents;
      const lastLoadTime = useAgentStore.getState().lastLoadTime;
      const now = Date.now();
      const cacheExpiry = useAgentStore.getState().cacheExpiry;
      
      // Only fetch from API if we have no agents or the cache is expired
      const shouldFetchFromApi = 
        currentAgents.length === 0 || 
        !lastLoadTime || 
        (now - lastLoadTime > cacheExpiry);
      
      if (shouldFetchFromApi) {
        console.log('Initial data load - fetching from API');
        loadInitialData().then(() => {
          dataLoadedRef.current = true;
          console.log('Initial data loaded successfully from API');
        });
      } else {
        console.log('Using cached agent data from store');
        // Apply filters to the existing data
        applyFilters();
        dataLoadedRef.current = true;
      }
    }
    
    // Cleanup function to reset mount status when component unmounts
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (applyFiltersTimeoutRef.current) {
        clearTimeout(applyFiltersTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array as we're using mountedRef

  // Get search query from URL - only on initial load
  useEffect(() => {
    // Only run this effect on initial mount
    if (!mountedRef.current) {
      const queryParams = new URLSearchParams(location.search);
      const queryFromUrl = queryParams.get('q');
      if (queryFromUrl) {
        setSearchQuery(queryFromUrl);
        console.log('Search query from URL:', queryFromUrl);
      }
      // Don't clear the search query automatically
    }
  }, [location.search, setSearchQuery]);

  // Auto-apply filters when dependencies change (disabled to prevent duplicate calls)
  // Filters are now applied directly in handlers for better control

  const handleCategoryChange = (category) => {
    // No page refresh needed, just update state
    setCategory(category);
    // Apply filters with reset pagination for fresh results
    applyFilters(true);
    // Scroll to the curated section for better UX
    document.querySelector('.curated-marketplace').scrollIntoView({ behavior: 'smooth' });
  };

  // Improved search handlers
  const handleSearchSubmit = (query = localSearchQuery) => {
    console.log('🔍 SEARCH SUBMIT:', query);
    setSearchQuery(query);
    applyFilters(true);
    
    // Auto-scroll to results after search
    setTimeout(() => {
      const marketplaceElement = document.getElementById('marketplace-section');
      if (marketplaceElement) {
        marketplaceElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleClearSearch = () => {
    setLocalSearchQuery('');
    setSearchQuery('');
    setIsSearchFloating(false);
    applyFilters(true);
    
    // Smooth scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchInputChange = (value) => {
    setLocalSearchQuery(value);
    // No immediate search - only update local state
  };

  const handleFilterChange = (filter) => {
    console.log('Filter changed to:', filter);
    setFilter(filter);
    // Apply filters with reset pagination for fresh results
    applyFilters(true);
  };

  const handlePriceChange = (newPriceRange) => {
    console.log('Price changed to:', newPriceRange);
    setPrice(newPriceRange);
    // Apply filters with reset pagination for fresh results
    applyFilters(true);
  };

  const handleRatingChange = (rating) => {
    console.log('Rating changed to:', rating);
    setRating(rating);
    // Apply filters with reset pagination for fresh results
    applyFilters(true);
  };
  
  const handleTagChange = (tag) => {
    console.log('Tags changed to:', tag);
    toggleTag(tag);
    // Apply filters with reset pagination for fresh results
    applyFilters(true);
  };
  
  const handleFeatureChange = (feature) => {
    console.log('Features changed to:', feature);
    toggleFeature(feature);
    // Apply filters with reset pagination for fresh results
    applyFilters(true);
  };

  // Toggle mobile filters sidebar
  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };
  
  // Toggle mobile filter options
  const toggleMobileOptions = () => {
    setMobileOptionsOpen(!mobileOptionsOpen);
  };

  // Function to manually force refresh the data
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      
      // Clear any existing data in the cache by forcing a refresh
      await loadInitialData(true); // Pass true to force refresh
      
      // Apply filters after data is loaded
      applyFilters();
      setIsRefreshing(false);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setIsRefreshing(false);
    }
  };

  // Render the agent grid with appropriate filtering
  const renderAgentGrid = () => {
    const isMockData = agents.some(agent => 
      // Only consider it mock data if the ID specifically starts with 'mock-'
      // or if the creator name is exactly one of the mock creator names
      (agent.id && agent.id.startsWith('mock-')) || 
      (agent.creator && agent.creator.name && ['AI Labs', 'Neural Studio', 'Quantum Works', 
        'Vector AI', 'Synapse Systems', 'DeepMind Shop', 'Cortex Creators', 
        'Brainwave Tech', 'Intelligent Solutions', 'AI Innovations'].includes(agent.creator.name))
    );

    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      );
    }

    if (agents.length === 0) {
      return (
        <div className="no-results">
          <h3>No agents found</h3>
          <p>Try adjusting your filters or search query</p>
        </div>
      );
    }

    // Calculate grid dimensions based on container width
    const containerWidth = agentsContainerRef.current?.clientWidth || 960;
    // Fixed card width to ensure 3 cards per row
    const cardWidth = Math.floor(containerWidth / 3) - 20; // 3 cards per row with spacing
    const cardHeight = 400; // Standard card height
    const columnCount = 3; // Fixed at 3 columns
    const rowCount = Math.ceil(agents.length / columnCount);
    const containerHeight = Math.min(window.innerHeight * 0.7, rowCount * cardHeight);

    return (
      <>
        {isMockData && (
          <div className="mock-data-warning glass-effect text-white mb-4 p-2 rounded-lg text-sm flex items-center">
            <FaExclamationTriangle className="warning-icon mr-2 text-yellow-300" />
            <span>Showing mock data - not fetched from database</span>
          </div>
        )}
        
        {/* For all screen sizes, use regular grid layout for better consistency */}
        <div className="marketplace-agents-grid">
          {agents.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </>
    );
  };

  // Use the new loader
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-blue-900">
        <div className="mb-8">
          <HashLoader color="#4FD1C5" size={70} speedMultiplier={0.8} />
        </div>
        <div className="text-white text-xl font-semibold mt-4">
          Loading AI Agents
        </div>
        <div className="text-blue-300 text-sm mt-2">
          Fetching the latest agents for you...
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-16 ${darkMode ? "dark bg-[#2D1846]" : "bg-gray-50"} ${themeClasses}`}>
      {/* Custom booking header that matches the homepage */}
      {/* Ultra-modern AI header with 3D effects and dynamic animations */}
      <div className="relative overflow-hidden">
        {/* Animated background gradient with enhanced colors - different for dark/light modes */}
        <div className={`absolute inset-0 animate-gradient-x ${darkMode 
          ? 'bg-gradient-to-r from-indigo-900 via-purple-800 to-blue-900' 
          : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'}`}></div>
        
        {/* Advanced grid pattern that gives a tech/AI feel */}
        <div className="absolute inset-0 bg-grid-white/[0.15] bg-[length:15px_15px] opacity-70">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:50px_50px] rotate-45"></div>
        </div>
        
        {/* Parallax floating elements - small geometric shapes */}
        <div className="absolute top-20 right-1/4 w-16 h-16 border-2 border-blue-400/30 rotate-45 animate-float-slow"></div>
        <div className="absolute bottom-10 left-1/3 w-12 h-12 border-2 border-purple-400/20 rounded-full animate-float"></div>
        <div className="absolute top-1/3 left-1/5 w-8 h-8 border-2 border-teal-400/20 rotate-12 animate-spin-slow"></div>
        
        {/* Advanced glowing orbs with dynamic animations */}
        <div className="absolute -top-20 right-1/4 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute top-1/2 left-2/3 w-40 h-40 bg-teal-500 rounded-full filter blur-3xl opacity-5 animate-pulse"></div>
        
        {/* Header content with enhanced glass effect */}
        <div className={`relative backdrop-blur-sm py-8 px-6 border-b ${darkMode ? 'border-white/10' : 'border-indigo-500/30'} glass-effect ${darkMode ? 'bg-black/5' : 'bg-white/15'}`}>
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="relative z-10">
              <h2 className={`text-5xl font-bold text-transparent bg-clip-text ${darkMode ? 'bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300' : 'bg-gradient-to-r from-white via-yellow-100 to-white'} mb-2 drop-shadow-lg`}>AI Waverider</h2>
              <div className="flex items-center">
                <div className={`w-10 h-[2px] bg-gradient-to-r ${darkMode ? 'from-blue-400' : 'from-gray-200'} to-transparent mr-3`}></div>
                <p className="text-white font-medium text-lg drop-shadow-md">Your Gateway to AI Mastery</p>
                <div className={`w-10 h-[2px] bg-gradient-to-l ${darkMode ? 'from-blue-400' : 'from-gray-200'} to-transparent ml-3`}></div>
              </div>
            </div>
            <div className="mt-6 md:mt-0 relative z-10">
              <a 
                href="https://calendly.com/aiwaverider8/30min"
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-full font-semibold flex items-center heartbeat-pulse hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaCalendarAlt className="mr-3 text-lg" />
                <span className="text-lg">Book a FREE Consultation Session</span>
                <FaArrowRight className="ml-3 text-lg" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced 3D Header */}
          <div className="page-header-3d mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-pattern opacity-30"></div>
            <div className="relative z-10 p-4 sm:p-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-200 text-transparent bg-clip-text">
                  Master AI Agents
                </span>
              </h1>
              <p className="text-white/80 text-base sm:text-lg mb-2">
                Discover and automate your repetitive tasks
              </p>
              <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mt-3 sm:mt-4 rounded-full"></div>
            </div>
          </div>

          {/* Mobile Filter Controls */}
          <div className="flex lg:hidden gap-2 mb-4">
            <button 
              onClick={toggleMobileFilters}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-purple-600 text-white rounded-md"
            >
              {mobileFiltersOpen ? <FaTimes /> : <FaFilter />}
              {mobileFiltersOpen ? 'Close Filters' : 'Show Filters'}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Sidebar with filters - conditionally shown on mobile */}
            <aside className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block w-full lg:w-1/4 mb-4 lg:mb-0`}>
              <div className="filter-sidebar glass-effect">
                <div className="flex justify-between items-center lg:hidden mb-4">
                  <h3 className="text-lg font-semibold text-white">Filters</h3>
                  <button 
                    onClick={toggleMobileFilters}
                    className="text-white p-1 rounded-full bg-purple-700 hover:bg-purple-800"
                  >
                    <FaTimes />
                  </button>
                </div>
                <FilterSidebar
                  selectedPrice={selectedPrice}
                  onPriceChange={handlePriceChange}
                  selectedRating={selectedRating}
                  onRatingChange={handleRatingChange}
                  selectedTags={selectedTags}
                  onTagChange={handleTagChange}
                  tagCounts={tagCounts}
                  selectedFeatures={selectedFeatures}
                  onFeatureChange={handleFeatureChange}
                  featureCounts={featureCounts}
                />
              </div>
            </aside>

            {/* Main content area */}
            <main className="w-full lg:w-3/4">
              
              {/* Category navigation */}
              <div className="mb-4 sm:mb-6 curated-marketplace glass-effect">
                <div className="flex items-center px-3 py-2 sm:hidden">
                  <span className="text-white mr-2">Categories:</span>
                  <div className="flex-1 overflow-x-auto">
                    <div className="flex">
                      <div className="h-1 w-4 bg-purple-300 rounded-full absolute left-4 bottom-2 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <CategoryNav 
                  selectedCategory={selectedCategory} 
                  onCategoryChange={handleCategoryChange} 
                />
              </div>

              {/* Filter and search area */}
              <div className="filter-search-container glass-effect mb-4 sm:mb-6">
                <div className="flex sm:hidden justify-between items-center mb-3">
                  {/* <button 
                    onClick={toggleMobileOptions}
                    className="flex items-center gap-2 py-2 px-4 bg-purple-700 rounded-md text-white text-sm"
                  >
                    <FaFilter size={14} />
                    Sort Options
                    {mobileOptionsOpen ? <FaTimes size={14} /> : <FaBars size={14} />}
                  </button> */}
                  
                  <div className="text-white text-sm">
                    {agents.length} results
                  </div>
                </div>
                
                <div className="sort-selector-container">
                  <select 
                    className="sort-selector"
                    value={selectedFilter}
                    onChange={(e) => {
                      handleFilterChange(e.target.value);
                      setMobileOptionsOpen(false);
                    }}
                  >
                    <option value="Hot & New">Sort: Hot & New</option>
                    <option value="Top Rated">Sort: Top Rated</option>
                    <option value="Most Popular">Sort: Most Popular</option>
                    <option value="Price: Low to High">Sort: Price Low to High</option>
                    <option value="Price: High to Low">Sort: Price High to Low</option>
                  </select>
                </div>

                {/* Enhanced Search Bar from VideosPage */}
                <div className="search-wrapper mt-3 sm:mt-0 flex" ref={mainSearchBarRef}>
                  <div className="max-w-2xl mx-auto mb-8 w-full">
                    <div className="relative group">
                      <input
                        type="text"
                        value={localSearchQuery}
                        onChange={(e) => {
                          handleSearchInputChange(e.target.value);
                        }}
                        onKeyDown={handleSearchKeyPress}
                        placeholder="Search agents by title, description, creator, or category..."
                        className={`
                          w-full px-6 py-4 pl-12 pr-24 rounded-2xl border
                          ${darkMode 
                            ? 'bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-400' 
                            : 'bg-white/70 border-gray-300/50 text-gray-900 placeholder-gray-500'
                          }
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          backdrop-blur-sm transition-all duration-300 ease-out
                          ${localSearchQuery && localSearchQuery.trim() 
                            ? `shadow-2xl transform hover:scale-105 hover:-translate-y-1 
                               ${darkMode 
                                 ? 'shadow-blue-500/25 border-blue-500/50 bg-gray-800/80' 
                                 : 'shadow-blue-500/20 border-blue-400/60 bg-white/90'
                               }
                               ring-2 ring-blue-500/30` 
                            : 'shadow-lg hover:shadow-xl hover:scale-102 hover:-translate-y-0.5'
                          }
                          group-hover:shadow-2xl
                          ${isSearchFloating && localSearchQuery ? 'opacity-70' : ''}
                        `}
                        ref={searchInputRef}
                      />
                      
                      {/* Search Icon with enhanced effects */}
                      <div className={`
                        absolute left-4 top-1/2 transform -translate-y-1/2 
                        transition-all duration-300 ease-out
                        ${localSearchQuery && localSearchQuery.trim() 
                          ? `scale-110 ${darkMode ? 'text-blue-400' : 'text-blue-600'}` 
                          : `${darkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-600'}`
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
                      
                      {/* Search Button */}
                      <button
                        onClick={() => handleSearchSubmit()}
                        disabled={!localSearchQuery || !localSearchQuery.trim()}
                        className={`
                          absolute right-12 top-1/2 transform -translate-y-1/2 
                          p-2 rounded-xl transition-all duration-300 ease-out
                          hover:scale-110 active:scale-95
                          ${localSearchQuery && localSearchQuery.trim()
                            ? `${darkMode 
                                ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/50' 
                                : 'text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/40'
                              }
                              border border-blue-500/50` 
                            : `${darkMode 
                                ? 'text-gray-500 bg-gray-700/50 border-gray-600/50' 
                                : 'text-gray-400 bg-gray-200/50 border-gray-300/50'
                              }
                              border cursor-not-allowed`
                          }
                        `}
                        title={localSearchQuery && localSearchQuery.trim() ? "Search agents" : "Enter search term"}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>

                      {/* Close Button - Positioned inside the input field */}
                      {localSearchQuery && (
                        <button
                          onClick={handleClearSearch}
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
                      {!localSearchQuery && (
                        <div className={`
                          absolute right-24 top-1/2 transform -translate-y-1/2 
                          hidden sm:flex items-center space-x-1 text-xs
                          ${darkMode ? 'text-gray-500' : 'text-gray-400'}
                          transition-all duration-300 group-hover:opacity-100
                        `}>
                          <kbd className={`
                            px-1.5 py-0.5 rounded text-xs font-mono
                            ${darkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-100/50 border border-gray-300/50'}
                          `}>
                            {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
                          </kbd>
                          <kbd className={`
                            px-1.5 py-0.5 rounded text-xs font-mono
                            ${darkMode ? 'bg-gray-700/50 border border-gray-600/50' : 'bg-gray-100/50 border border-gray-300/50'}
                          `}>
                            K
                          </kbd>
                        </div>
                      )}
                      
                      {/* Search glow effect when active */}
                      {localSearchQuery && localSearchQuery.trim() && (
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
                    {localSearchQuery && localSearchQuery.trim() && (
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
                            Searching for: <span className="font-bold">"{localSearchQuery}"</span>
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
              </div>

              {/* Featured agents carousel */}
              {featuredAgents.length > 0 && (
                <section className="mb-12 glass-effect section-container">
                  <h2 className="section-title">Featured Agents</h2>
                  <FeaturedAgents agents={featuredAgents} />
                </section>
              )}

              {/* Results summary */}
              <div className="results-summary glass-effect mb-4 p-4 text-white" ref={resultsRef}>
                <div className="flex justify-between items-center">
                  <span>
                    Showing {agents.length > 0 ? ((pagination.currentPage - 1) * pagination.pageSize + 1) : 0} to {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} agents
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Show:</label>
                    <select 
                      value={pagination.pageSize} 
                      onChange={(e) => setPageSize(parseInt(e.target.value))}
                      className="bg-white/20 text-white px-2 py-1 rounded border border-white/30 text-sm"
                    >
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm">per page</span>
                  </div>
                </div>
              </div>

              {/* Agent grid - Conditional rendering based on loading state */}
              {isLoading ? (
                <div className="loading-wrapper glass-effect">
                  <div className="loader"></div>
                </div>
              ) : agents.length === 0 ? (
                <div className="empty-results glass-effect">
                  <FaExclamationTriangle className="empty-icon" />
                  <h3 className="empty-title">No agents found</h3>
                  <p className="empty-message">
                    We couldn't find any agents matching your current filters. Try adjusting your search criteria.
                  </p>
                  <button 
                    onClick={() => resetFilters()}
                    className="reset-button"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  <div id="marketplace-section" className="agents-container glass-effect" ref={agentsContainerRef}>
                    {renderAgentGrid()}
                  </div>

                  {/* Load More Pagination */}
                  {pagination.hasMore && (
                    <div className="load-more-container glass-effect mt-6 p-4 text-center">
                      <button
                        onClick={loadMore}
                        disabled={pagination.isLoadingMore}
                        className="load-more-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                      >
                        {pagination.isLoadingMore ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Loading More...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <span>Load More Agents</span>
                            <FaArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                      
                      {/* Info text */}
                      <div className="text-white/80 text-sm mt-3">
                        Showing {agents.length} agents {pagination.totalItems > 0 && `of ${pagination.totalItems} total`}
                      </div>
                    </div>
                  )}

                  {/* Fallback pagination for backward compatibility */}
                  {!pagination.hasMore && pagination.totalPages > 1 && (
                    <div className="pagination-container glass-effect mt-6 p-4">
                      <div className="flex justify-center items-center gap-2">
                        {/* Previous page button */}
                        <button
                          onClick={() => setPage(Math.max(1, pagination.currentPage - 1))}
                          disabled={pagination.currentPage === 1}
                          className="pagination-button"
                          aria-label="Go to previous page"
                        >
                          ‹ Previous
                        </button>

                        {/* Next page button */}
                        <button
                          onClick={() => setPage(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                          disabled={pagination.currentPage === pagination.totalPages}
                          className="pagination-button"
                          aria-label="Go to next page"
                        >
                          Next ›
                        </button>
                      </div>

                      {/* Page info */}
                      <div className="text-center mt-2 text-white/80 text-sm">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Recommended agents */}
              {/* {recommendedAgents.length > 0 && (
                <section className="mt-16 glass-effect section-container">
                  <h2 className="section-title">Recommended For You</h2>
                  <div className="carousel-container">
                    {isRecommendationsLoading ? (
                      <div className="loading-recommendations">
                        <div className="loader"></div>
                      </div>
                    ) : (
                      <AgentCarousel agents={recommendedAgents} />
                    )}
                  </div>
                </section>
              )} */}

              {/* Wishlists */}
              {/* {wishlists.length > 0 && (
                <section className="mt-16 glass-effect section-container">
                  <h2 className="section-title">Your Saved Collections</h2>
                  <WishlistSection wishlists={wishlists} />
                </section>
              )} */}
            </main>
          </div>
        </div>
      </div>



      {/* Static Floating Search Overlay - Absolutely no movement */}
      {isSearchFloating && (
        <div 
          className="fixed z-50 top-4"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100vw - 2rem)',
            maxWidth: '32rem'
          }}>
          <div className={`
            relative w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl
            ${darkMode 
              ? 'bg-gray-900/98 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-blue-500/25' 
              : 'bg-white/98 backdrop-blur-xl border border-white/50 shadow-2xl shadow-blue-500/20'
            }
          `}>
            {/* Responsive Floating Search Input */}
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search agents..."
                className={`
                  w-full px-4 py-2.5 pl-10 pr-8 sm:px-6 sm:py-3 sm:pl-12 sm:pr-10 
                  rounded-lg sm:rounded-xl border text-sm sm:text-base
                  ${darkMode 
                    ? 'bg-gray-800/80 border-gray-600/50 text-white placeholder-gray-300' 
                    : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-400'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  backdrop-blur-sm transition-all duration-300 ease-out
                  shadow-lg hover:shadow-xl
                `}
                autoFocus
              />
              
              {/* Responsive Search Icon */}
              <div className={`
                absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 
                ${darkMode ? 'text-blue-400' : 'text-blue-600'}
                transition-all duration-300
              `}>
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Responsive Close Button */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchFloating(false);
                  // Stay in current position - no scroll to top
                }}
                className={`
                  absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 
                  p-1 sm:p-1.5 rounded-full transition-all duration-300 ease-out
                  hover:scale-125 hover:rotate-180 active:scale-95
                  ${darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-red-600/30 hover:shadow-xl hover:shadow-red-500/40' 
                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50 hover:shadow-xl hover:shadow-red-500/30'
                  }
                  group
                  border border-transparent hover:border-red-500/50
                `}
                title="Close search"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Responsive Search Status */}
            <div className={`
              mt-2 sm:mt-3 flex items-center justify-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm
              ${darkMode ? 'text-blue-300' : 'text-blue-700'}
            `}>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
                              <span className="font-medium">
                  Searching: <span className="font-bold">"{searchQuery.length > 20 ? searchQuery.substring(0, 20) + '...' : searchQuery}"</span>
                </span>
              <div className={`
                w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse
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

      {/* Floating filter button for mobile */}
      <button 
        onClick={toggleMobileFilters}
        className="fixed bottom-6 right-6 lg:hidden z-50 w-14 h-14 text-white flex items-center justify-center shadow-lg"
      >
        <FaFilter size={20} />
      </button>
    </div>
  );
};

export default Agents; 