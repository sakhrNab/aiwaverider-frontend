import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { AuthContext } from '../contexts/AuthContext';
import PlatformSection from '../components/videos/PlatformSection';
import VideosService from '../services/videosService';
import { toast } from 'react-toastify';
import { db } from '../utils/firebase';

/**
 * Videos Page - Main page displaying videos from all platforms
 */
const VideosPage = () => {
  const { darkMode } = useTheme();
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'youtube', 'tiktok', 'instagram'
  const [showEditModal, setShowEditModal] = useState(false);
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
  const userIsAdmin = user?.role === 'admin';

  console.log('Current user info:', {
    uid: user?.uid,
    email: user?.email,
    role: user?.role,
    isAdmin: userIsAdmin
  });

  // Handle video play action
  const handleVideoPlay = useCallback((video) => {
    // You can implement custom video player here or just open the original URL
    console.log('Playing video:', video);
    window.open(video.originalUrl, '_blank', 'noopener,noreferrer');
  }, []);

  // Handle admin edit button click
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  // Tab configuration
  const tabs = [
    { id: 'all', label: 'All Platforms', icon: '🎬' },
    { id: 'youtube', label: 'YouTube', icon: '🎥' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵' },
    { id: 'instagram', label: 'Instagram', icon: '📸' }
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

  return (
    <div className={`
      min-h-screen
      ${darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }
    `}>
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
                text-lg sm:text-xl max-w-3xl mx-auto
                ${darkMode ? 'text-gray-300' : 'text-gray-600'}
              `}>
                Discover trending videos from YouTube, TikTok, and Instagram all in one place
              </p>
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
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* All Platforms View */}
            {activeTab === 'all' && (
              <div className="space-y-16">
                <PlatformSection
                  platform="youtube"
                  onVideoPlay={handleVideoPlay}
                />
                <PlatformSection
                  platform="tiktok"
                  onVideoPlay={handleVideoPlay}
                />
                <PlatformSection
                  platform="instagram"
                  onVideoPlay={handleVideoPlay}
                />
              </div>
            )}

            {/* Individual Platform Views */}
            {activeTab !== 'all' && (
              <PlatformSection
                platform={activeTab}
                onVideoPlay={handleVideoPlay}
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