//src/pages
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/agents/SearchBar';
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
    applyFilters
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

  // Apply filters directly with flag to prevent duplicate execution
  const applyFiltersDirectly = useCallback(() => {
    console.log('Applying filters directly');
    // Set the flag to prevent the useEffect from running again
    isApplyingFiltersRef.current = true;
    applyFilters();
  }, [applyFilters]);
  
  // Use a simple timeout for search filtering instead of debounce
  // This is more reliable for responsive typing
  const searchTimeoutRef = useRef(null);

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

  // Track if filters are being applied to prevent duplicate calls
  const isApplyingFiltersRef = useRef(false);
  
  // Add a useEffect to apply filters whenever any filter criteria changes
  // But only if they weren't already applied by a direct handler call
  useEffect(() => {
    // Skip if we're already applying filters from a direct handler call
    if (isApplyingFiltersRef.current) {
      isApplyingFiltersRef.current = false;
      return;
    }
    
    // Don't apply filters during initial load
    if (mountedRef.current && dataLoadedRef.current) {
      console.log('Applying filters from dependency change');
      applyFilters();
    }
  }, [
    selectedCategory,
    selectedFilter,
    selectedPrice,
    selectedRating,
    selectedTags,
    selectedFeatures,
    searchQuery,
    applyFilters
  ]);

  const handleCategoryChange = (category) => {
    // No page refresh needed, just update state
    setCategory(category);
    // Apply filters through the debounced function
    debouncedApplyFilters();
    // Scroll to the curated section for better UX
    document.querySelector('.curated-marketplace').scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = (query, isClearing = false, isExplicitSubmit = false) => {
    console.log('Search handler called with query:', query);
    
    // Set the search query in the store
    setSearchQuery(query);
    
    // Clear any previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Apply filters directly for immediate feedback
    applyFiltersDirectly();
    
    // Only jump to marketplace on explicit search submissions (Enter key or search button)
    if (isExplicitSubmit && query) {
      // Jump to the marketplace section after a short delay
      // to allow the filters to be applied and results to be displayed
      setTimeout(() => {
        const marketplaceElement = document.getElementById('marketplace-section');
        if (marketplaceElement) {
          marketplaceElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  };

  const handleFilterChange = (filter) => {
    console.log('Filter changed to:', filter);
    setFilter(filter);
    // Apply filters directly for immediate feedback
    applyFiltersDirectly();
  };

  const handlePriceChange = (newPriceRange) => {
    console.log('Price changed to:', newPriceRange);
    setPrice(newPriceRange);
    // Apply filters directly for immediate feedback
    applyFiltersDirectly();
  };

  const handleRatingChange = (rating) => {
    console.log('Rating changed to:', rating);
    setRating(rating);
    // Apply filters directly for immediate feedback
    applyFiltersDirectly();
  };
  
  const handleTagChange = (tag) => {
    console.log('Tags changed to:', tag);
    toggleTag(tag);
    // Apply filters directly for immediate feedback
    applyFiltersDirectly();
  };
  
  const handleFeatureChange = (feature) => {
    console.log('Features changed to:', feature);
    toggleFeature(feature);
    // Apply filters directly for immediate feedback
    applyFiltersDirectly();
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
      <div className="bg-indigo-900 py-4 sm:py-6 px-4 sm:px-6">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Wave Rider</h2>
            <p className="text-yellow-500 font-medium">Your Gateway to AI Mastery</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <a 
              href="https://calendly.com/aiwaverider8/30min" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-full font-semibold flex items-center heartbeat-pulse text-sm sm:text-base"
            >
              <FaCalendarAlt className="mr-2" />
              Book a Training Session
              <FaArrowRight className="ml-2" />
            </a>
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

                <div className="search-wrapper mt-3 sm:mt-0 flex">
                  <SearchBar
                    initialQuery={searchQuery}
                    onSearch={handleSearch}
                    placeholder="Search agents..."
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Featured agents carousel */}
              {featuredAgents.length > 0 && (
                <section className="mb-12 glass-effect section-container">
                  <h2 className="section-title">Featured Agents</h2>
                  <FeaturedAgents agents={featuredAgents} />
                </section>
              )}

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
                <div id="marketplace-section" className="agents-container glass-effect" ref={agentsContainerRef}>
                  {renderAgentGrid()}
                </div>
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