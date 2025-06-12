import React, { useState, useEffect, useContext } from 'react';
import { getVideos } from '../api/content/videoService.js';
import VideoCard from '../components/videos/VideoCard';
import VideoFilters from '../components/videos/VideoFilters';
import VideoPagination from '../components/videos/VideoPagination';
import AddVideoForm from '../components/videos/AddVideoForm';
import { FaPlus, FaTimes, FaSpinner, FaVideo, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

// Don't attempt to load Instagram embed script directly due to CORS restrictions
// Instead, we'll use direct iframe embeds without external script loading
const handleEmbeds = () => {
  console.log('Using direct iframe embeds without external script loading');
  return () => {};
};

// We don't need to load TikTok embed script directly - using iframe embeds instead
// This avoids CORS issues as the iframe handles its own script loading
const handleTikTokEmbeds = () => {
  // No direct script loading needed
  console.log('Using TikTok iframe embeds without script loading');
  return () => {};
};

const VideoGalleryPage = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const { darkMode } = useTheme();
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState(['Tech', 'Gaming', 'Educational', 'Entertainment', 'Music', 'Travel', 'Cooking', 'Fitness', 'Fashion', 'Lifestyle', 'Science', 'News', 'Sports']);
  const [platforms, setPlatforms] = useState(['youtube', 'tiktok', 'instagram']);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);
  const [limit] = useState(9); // 3x3 grid
  
  // Filter state
  const [filters, setFilters] = useState({
    category: '',
    platform: '',
    user: ''
  });
  
  // Helper function to clear filters
  const clearFilters = () => {
    setFilters({
      category: '',
      platform: '',
      user: ''
    });
  };

  // Handle embeds using direct iframes without external scripts
  useEffect(() => {
    // We're now using direct iframe embeds without external script loading
    // This avoids CORS issues completely
    return handleEmbeds();
  }, [videos, filters]); // Only rerun when videos or filters change
  
  // Use static categories instead of API fetching
  useEffect(() => {
    // Define static categories - these rarely change
    const staticCategories = [
      'Tech',
      'Gaming',
      'Educational',
      'Entertainment',
      'Music',
      'Travel',
      'Cooking',
      'Fitness',
      'Fashion',
      'Lifestyle',
      'Science',
      'News',
      'Sports'
    ];
    
    setCategories(staticCategories);
  }, []);
  
  // Load videos with pagination and filters
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await getVideos({
          page: currentPage,
          limit,
          ...filters
        });
        
        // Handle potential undefined data
        const videoData = response?.data || [];
        console.log('Video Data Sakhr: ', videoData)
        setVideos(videoData);
        setTotalPages(response?.totalPages || 1);
        setTotalVideos(response?.totalCount || 0);
        
        // Extract unique users for filtering, with safety check
        if (Array.isArray(videoData) && videoData.length > 0) {
          const uniqueUsers = [...new Set(videoData
            .filter(video => video && video.user) // Filter out any null/undefined entries
            .map(video => video.user))];
          setUsers(uniqueUsers);
        } else {
          setUsers([]);
        }
        
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos');
        toast.error('Failed to load videos');
        // Set defaults on error
        setVideos([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [currentPage, filters]);
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleVideoAdded = (newVideo) => {
    // Update videos list
    setShowAddForm(false);
    setEditingVideo(null);
    
    // Refresh the videos list to include the new one
    // We'll reset to page 1 with no filters to make sure the user sees their new video
    setFilters({
      category: '',
      platform: '',
      user: ''
    });
    setCurrentPage(1);
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setShowAddForm(true);
  };

  // No need to process Instagram embeds anymore since we're using direct iframes
  // This avoids CORS issues and script loading problems

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header with Animated Background */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden rounded-xl mb-8 ${darkMode ? 'bg-gradient-to-r from-gray-900/80 via-indigo-950/70 to-gray-900/80' : 'bg-gradient-to-r from-blue-500/80 via-indigo-400/70 to-purple-500/80'}`}
      >
        {/* Animated background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut" 
            }}
            className={`absolute -bottom-24 -right-24 w-48 h-48 rounded-full ${darkMode ? 'bg-indigo-600/20' : 'bg-blue-400/30'} blur-3xl`}
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 10,
              ease: "easeInOut",
              delay: 0.5
            }}
            className={`absolute -top-24 -left-24 w-48 h-48 rounded-full ${darkMode ? 'bg-purple-600/20' : 'bg-indigo-400/30'} blur-3xl`}
          />
        </div>
        
        {/* Header Content */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center py-6 px-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="p-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mr-4">
              <FaVideo className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Video Gallery
              </h1>
              <p className="text-blue-100 mt-1 opacity-80">
                Discover and share the latest videos from across the web
              </p>
            </div>
          </div>
          
          {isAdmin && !showAddForm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-5 rounded-lg shadow-md"
            >
              <FaPlus className="mr-2" /> Add Video
            </motion.button>
          )}
        </div>
      </motion.div>
      
      {/* Add Video Form */}
      {isAdmin && showAddForm && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-6 relative p-6 rounded-xl shadow-lg backdrop-blur-xl ${darkMode ? 'bg-gray-900/70 border border-indigo-900/50' : 'bg-white/90 border border-blue-100/50'}`}
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            transition={{ type: "spring", stiffness: 500 }}
            onClick={() => setShowAddForm(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 p-2 rounded-full"
            aria-label="Close form"
          >
            <FaTimes />
          </motion.button>
          
          <AddVideoForm 
            onVideoAdded={handleVideoAdded} 
            onCancel={() => setShowAddForm(false)}
            editingVideo={editingVideo}
          />
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <VideoFilters
          categories={categories}
          platforms={platforms}
          users={users}
          filters={filters}
          onFilterChange={handleFilterChange}
          darkMode={darkMode}
        />
      </motion.div>
      
      {/* Error display */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-4 rounded-lg mb-6 flex items-center ${darkMode ? 'bg-red-900/30 text-red-300 border border-red-800/50' : 'bg-red-100 text-red-700 border border-red-200'}`}
        >
          <div className="mr-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
              <FaTimes className="text-red-500 dark:text-red-300" />
            </div>
          </div>
          <div>{error}</div>
        </motion.div>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className={`flex flex-col items-center justify-center py-16 px-6 rounded-xl backdrop-blur-md ${darkMode ? 'bg-gray-900/40 border border-gray-800/50' : 'bg-white/60 border border-gray-100'}`}>
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-md bg-blue-400/20 dark:bg-indigo-600/20 animate-pulse"></div>
            <FaSpinner className="animate-spin relative z-10 text-blue-600 dark:text-indigo-400 text-4xl mb-4" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading videos...</p>
        </div>
      ) : (
        <>
          {/* Videos grid grouped by platform */}
          {Array.isArray(videos) && videos.length > 0 ? (
            <div className="space-y-10 mb-8">
              {/* Group by platform and only show sections with videos */}
              {/* YouTube Videos Section */}
              {videos.filter(video => video?.platform?.toLowerCase() === 'youtube').length > 0 && (
                <div className="space-y-4">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                    <FaYoutube className="text-red-600 mr-2" /> YouTube Videos
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos
                      .filter(video => video?.platform?.toLowerCase() === 'youtube')
                      .map((video, index) => (
                        <motion.div
                          key={video?._id || `youtube-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                          <VideoCard 
                            video={video} 
                            darkMode={darkMode} 
                            onEdit={handleEditVideo}
                          />
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}
              
              {/* TikTok Videos Section */}
              {videos.filter(video => video?.platform?.toLowerCase() === 'tiktok').length > 0 && (
                <div className="space-y-4">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                    <FaTiktok className="mr-2" /> TikTok Videos
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos
                      .filter(video => video?.platform?.toLowerCase() === 'tiktok')
                      .map((video, index) => (
                        <motion.div
                          key={video?._id || `tiktok-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                          <VideoCard 
                            video={video} 
                            darkMode={darkMode} 
                            onEdit={handleEditVideo}
                          />
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}
              
              {/* Instagram Videos Section */}
              {videos.filter(video => video?.platform?.toLowerCase() === 'instagram').length > 0 && (
                <div className="space-y-4">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                    <FaInstagram className="text-purple-600 mr-2" /> Instagram Videos
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-6">
                    {videos
                      .filter(video => video?.platform?.toLowerCase() === 'instagram')
                      .map((video, index) => (
                        <motion.div
                          key={video?._id || `instagram-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                          className="min-h-[650px]"
                        >
                          <VideoCard 
                            video={video} 
                            darkMode={darkMode} 
                            onEdit={handleEditVideo}
                          />
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}
              
              {/* Other Videos (if any) */}
              {videos.filter(video => !video?.platform || !['youtube', 'tiktok', 'instagram'].includes(video?.platform?.toLowerCase())).length > 0 && (
                <div className="space-y-4">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                    <FaVideo className="text-blue-500 mr-2" /> Other Videos
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos
                      .filter(video => !video?.platform || !['youtube', 'tiktok', 'instagram'].includes(video?.platform?.toLowerCase()))
                      .map((video, index) => (
                        <motion.div
                          key={video?._id || `other-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                          <VideoCard 
                            video={video} 
                            darkMode={darkMode} 
                            onEdit={handleEditVideo}
                          />
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <motion.div
              animate={{ opacity: 1 }}
              className={`text-center py-12 rounded-xl backdrop-blur-md ${darkMode ? 'bg-gray-900/40 border border-gray-800/50' : 'bg-white/60 border border-gray-100'}`}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center">
                <FaVideo className="text-gray-400 dark:text-gray-500 text-2xl" />
              </div>
              <p className="text-gray-600 dark:text-gray-300">No videos found with the selected filters.</p>
              <button 
                onClick={clearFilters}
                className="mt-4 text-blue-500 dark:text-blue-400 hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          )}
          
          {/* Pagination */}
          {videos.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <VideoPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalVideos={totalVideos}
                limit={limit}
                darkMode={darkMode}
              />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoGalleryPage;
