import React, { useState, useContext, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaVideo, FaPlus, FaTimes, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import { refreshVideoStats } from '../api/content/videoService';
import PlatformContainer from '../components/videos/PlatformContainer';
import AddVideoForm from '../components/videos/AddVideoForm';
import { toast } from 'react-hot-toast';

const VideoGalleryPage = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const { darkMode } = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'youtube', 'tiktok', 'instagram'

  // Handle video stats refresh (admin only)
  const handleVideoRefresh = useCallback(async (videoId, platform) => {
    if (!isAdmin) {
      toast.error('Admin access required');
      return;
    }

    try {
      // Get admin token from local storage or context
      const adminToken = localStorage.getItem('adminToken'); // Adjust based on your auth implementation
      
      if (!adminToken) {
        toast.error('Admin token not found');
        return;
      }

      await refreshVideoStats(videoId, adminToken);
      toast.success(`${platform} video stats refreshed successfully`);
    } catch (error) {
      console.error('Error refreshing video stats:', error);
      toast.error(error.message || 'Failed to refresh video stats');
    }
  }, [isAdmin]);

  // Handle video added
  const handleVideoAdded = useCallback(() => {
    setShowAddForm(false);
    toast.success('Video added successfully!');
    // The individual platform containers will automatically refresh
  }, []);

  const tabVariants = {
    active: { scale: 1.05, y: -2 },
    inactive: { scale: 1, y: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`relative overflow-hidden rounded-3xl mb-8 ${
            darkMode 
              ? 'bg-gradient-to-r from-gray-900/80 via-indigo-950/70 to-gray-900/80' 
              : 'bg-gradient-to-r from-blue-500/80 via-indigo-400/70 to-purple-500/80'
          } backdrop-blur-md border border-white/20`}
        >
          {/* Animated background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 8,
                ease: "easeInOut" 
              }}
              className={`absolute -bottom-24 -right-24 w-48 h-48 rounded-full ${
                darkMode ? 'bg-indigo-600/30' : 'bg-blue-400/40'
              } blur-3xl`}
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 10,
                ease: "easeInOut",
                delay: 0.5
              }}
              className={`absolute -top-24 -left-24 w-48 h-48 rounded-full ${
                darkMode ? 'bg-purple-600/30' : 'bg-indigo-400/40'
              } blur-3xl`}
            />
          </div>

          <div className="relative z-10 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="mb-4"
            >
              <FaVideo className={`w-16 h-16 mx-auto ${darkMode ? 'text-white' : 'text-white'}`} />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}
            >
              Video Gallery
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`text-lg md:text-xl opacity-90 mb-6 ${darkMode ? 'text-gray-200' : 'text-white'}`}
            >
              Discover amazing content from YouTube, TikTok, and Instagram
            </motion.p>

            {/* Add Video Button (Admin only) */}
            {isAdmin && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddForm(true)}
                className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                  darkMode 
                    ? 'bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30' 
                    : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30'
                } shadow-lg hover:shadow-xl`}
              >
                <FaPlus className="inline mr-2" />
                Add Video
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Platform Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className={`flex space-x-2 p-2 rounded-2xl backdrop-blur-md border ${
            darkMode 
              ? 'bg-gray-900/50 border-white/10' 
              : 'bg-white/50 border-white/20'
          }`}>
            {[
              { id: 'all', label: 'All Platforms', icon: FaVideo },
              { id: 'youtube', label: 'YouTube', icon: FaYoutube },
              { id: 'tiktok', label: 'TikTok', icon: FaTiktok },
              { id: 'instagram', label: 'Instagram', icon: FaInstagram }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  variants={tabVariants}
                  animate={activeTab === tab.id ? 'active' : 'inactive'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? darkMode
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'bg-white text-gray-900 shadow-lg'
                      : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className="mr-2" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Platform Containers */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {(activeTab === 'all' || activeTab === 'youtube') && (
            <motion.div variants={itemVariants}>
              <PlatformContainer
                platform="youtube"
                onRefreshVideo={handleVideoRefresh}
                className="w-full"
              />
            </motion.div>
          )}

          {(activeTab === 'all' || activeTab === 'tiktok') && (
            <motion.div variants={itemVariants}>
              <PlatformContainer
                platform="tiktok"
                onRefreshVideo={handleVideoRefresh}
                className="w-full"
              />
            </motion.div>
          )}

          {(activeTab === 'all' || activeTab === 'instagram') && (
            <motion.div variants={itemVariants}>
              <PlatformContainer
                platform="instagram"
                onRefreshVideo={handleVideoRefresh}
                className="w-full"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Add Video Modal */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className={`relative w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl shadow-2xl ${
                darkMode 
                  ? 'bg-gray-900/95 border border-white/10' 
                  : 'bg-white/95 border border-white/20'
              } backdrop-blur-md`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Add New Video
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddForm(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FaTimes className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="p-6">
                <AddVideoForm onVideoAdded={handleVideoAdded} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VideoGalleryPage;
