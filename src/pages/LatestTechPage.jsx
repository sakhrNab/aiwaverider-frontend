import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaEye, FaHeart, FaComment, FaArrowRight } from 'react-icons/fa';
import { PostsContext } from '../contexts/PostsContext';
import { useTheme } from '../contexts/ThemeContext';
import { HashLoader } from 'react-spinners';
import { incrementPostView } from '../api/content/postApi';
import '../styles/animations.css'; // Import animations for heartbeat-pulse

const LatestTech = () => {
  const { darkMode } = useTheme();
  const { fetchAllPosts, posts, loadingPosts, errorPosts } = useContext(PostsContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('latest');
  const [lastPostId, setLastPostId] = useState(null);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Predefined categories
  const categories = ['All', 'Trends', 'Tools', 'AI', 'Blockchain', 'Web3', 'Startups'];
  
  // Fetch posts on component mount and when category changes
  useEffect(() => {
    fetchInitialPosts();
  }, [selectedCategory, activeTab]);
  
  // Update displayed posts when posts change
  useEffect(() => {
    if (posts && posts.length > 0) {
      // Filter and sort posts
      const filtered = posts.filter(post => selectedCategory === 'All' || post.category === selectedCategory);
      const sorted = [...filtered].sort((a, b) => {
        if (activeTab === 'latest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          // Sort by views or likes for 'popular'
          return (b.views || 0) - (a.views || 0);
        }
      });
      
      setDisplayedPosts(sorted);
      
      // Set last post ID for pagination
      if (sorted.length > 0) {
        setLastPostId(sorted[sorted.length - 1].id);
      }
      
      // Determine if there might be more posts
      setHasMore(posts.length >= 12);
    } else {
      setDisplayedPosts([]);
      setHasMore(false);
    }
  }, [posts, selectedCategory, activeTab]);
  
  // Fetch initial posts
  const fetchInitialPosts = async () => {
    setLastPostId(null);
    await fetchAllPosts(selectedCategory, 12, null, true);
  };
  
  // Handle loading more posts
  const handleLoadMore = async () => {
    if (!hasMore || loadingMore || !lastPostId) return;
    
    setLoadingMore(true);
    try {
      const currentPostCount = displayedPosts.length;
      await fetchAllPosts(selectedCategory, 12, lastPostId);
      
      // If no new posts were added, there are no more to load
      if (displayedPosts.length <= currentPostCount) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };
  
  // Format date
  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const themeClasses = "bg-gradient-to-br from-[#4158D0] via-[#C850C0] to-[#FFCC70] stars-pattern";
  
  // New loading state with HashLoader
  if (loadingPosts && !loadingMore) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-blue-900">
        <div className="mb-8">
          <HashLoader color="#4FD1C5" size={70} speedMultiplier={0.8} />
        </div>
        <div className="text-white text-xl font-semibold mt-4">
          Loading Latest News & Tutorials
        </div>
        <div className="text-blue-300 text-sm mt-2">
          Fetching the latest articles for you...
        </div>
      </div>
    );
  }
  
  // Add a handler for post clicks to increment views
  const handlePostClick = (e, postId) => {
    // Don't prevent default navigation, but increment the view count
    console.log(`[LatestTech] Incrementing view for post ${postId} on click`);
    
    // Fire and forget - don't wait for the response or handle errors
    // This ensures navigation continues smoothly regardless of view count success
    incrementPostView(postId)
      .then(response => {
        if (response.success === false) {
          console.warn(`[LatestTech] View increment failed but continuing navigation:`, response.error);
        } else {
          console.log(`[LatestTech] View increment response:`, response);
        }
      })
      .catch(error => {
        // This shouldn't happen now that incrementPostView handles errors internally
        console.error(`[LatestTech] Error incrementing view:`, error);
      });
    
    // Navigation will happen naturally through the Link component
  };
  
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
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced 3D Header with animation */}
          <div className="bg-gradient-to-br from-purple-900/70 via-[#2D1846]/80 to-indigo-900/70 backdrop-blur-lg rounded-3xl p-8 mb-8 shadow-2xl border border-white/20 transition-all duration-700 hover:border-white/30 transform hover:translate-y-[-5px] relative overflow-hidden">
            <div className="absolute inset-0 bg-pattern opacity-30"></div>
            <div className="relative z-10">
              <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-200 text-transparent bg-clip-text">
                  Latest Tech News
                </span>
              </h1>
              <p className="text-white/80 text-center text-lg mb-2">
                Stay updated with the latest trends in AI and technology
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
            </div>
          </div>
          
          {/* Categories tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category 
                      ? 'bg-gradient-to-r from-purple-500/60 to-indigo-500/60 text-white shadow-md border border-white/30' 
                      : 'bg-white/10 backdrop-blur-sm border border-white/10 text-white/70 hover:bg-white/15'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Sorting tabs */}
          <div className="mb-8">
            <div className="flex justify-center bg-white/10 backdrop-blur-md rounded-full p-1 max-w-xs mx-auto">
              <button
                onClick={() => setActiveTab('latest')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 'latest' 
                    ? 'bg-gradient-to-r from-purple-500/60 to-indigo-500/60 text-white shadow-md' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => setActiveTab('popular')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 'popular' 
                    ? 'bg-gradient-to-r from-purple-500/60 to-indigo-500/60 text-white shadow-md' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Most Popular
              </button>
            </div>
          </div>
          
          {/* Loading State - Already handled by the new HashLoader at the top */}
          {errorPosts ? (
            <div className="text-center py-12 bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <p className="text-red-400 text-lg mb-4">{errorPosts}</p>
              <button 
                onClick={fetchInitialPosts}
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 text-white transition-all"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Posts Grid */}
              {displayedPosts && displayedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedPosts.map((post, index) => (
                    <Link 
                      to={`/posts/${post.id}`} 
                      key={post.id}
                      className="glass-effect rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={(e) => handlePostClick(e, post.id)}
                    >
                      {/* Post Image */}
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={post.imageUrl || 'https://placehold.co/600x400/indigo/white?text=AI+Tech'} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => { 
                            e.target.src = 'https://placehold.co/600x400/indigo/white?text=AI+Tech'; 
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                          {post.category}
                        </div>
                      </div>
                      
                      {/* Post Content */}
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-white/70 text-sm mb-4 line-clamp-3">
                          {post.description}
                        </p>
                        
                        {/* Post Meta */}
                        <div className="mt-auto flex items-center justify-between text-xs text-white/60">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                          <div className="flex space-x-3">
                            <div className="flex items-center">
                              <FaEye className="mr-1" />
                              <span>{post.views || 0}</span>
                            </div>
                            <div className="flex items-center">
                              <FaHeart className="mr-1" />
                              <span>{post.likes?.length || 0}</span>
                            </div>
                            <div className="flex items-center">
                              <FaComment className="mr-1" />
                              <span>{post.comments?.length || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/10 backdrop-blur-md rounded-2xl p-6">
                  <p className="text-white/70 mb-4">No posts found in this category.</p>
                </div>
              )}
              
              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-10">
                  <button 
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className={`px-6 py-3 bg-gradient-to-r from-purple-500/60 to-indigo-500/60 rounded-lg text-white font-medium hover:from-purple-500/80 hover:to-indigo-500/80 transition-all duration-300 ${loadingMore ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loadingMore ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </span>
                    ) : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default LatestTech; 