import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaSpinner, FaYoutube, FaTiktok, FaInstagram, FaExternalLinkAlt } from 'react-icons/fa';
import { addVideo } from '../../api/content/videoService';
import { AuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-hot-toast';

const platformOptions = [
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: FaYoutube, 
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: FaTiktok, 
    color: 'text-black dark:text-white',
    bgColor: 'bg-gray-50 dark:bg-gray-800/20',
    borderColor: 'border-gray-200 dark:border-gray-700',
    example: 'https://www.tiktok.com/@username/video/1234567890'
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: FaInstagram, 
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    example: 'https://www.instagram.com/p/ABC123def4g/'
  }
];

const AddVideoForm = ({ onVideoAdded }) => {
  const { user, isAdmin } = useContext(AuthContext);
  const { darkMode } = useTheme();
  const [originalUrl, setOriginalUrl] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [addedBy, setAddedBy] = useState(user?.displayName || user?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedPlatform = platformOptions.find(p => p.id === platform);
  const PlatformIcon = selectedPlatform?.icon || FaYoutube;

  // Validate URL format for the selected platform
  const validateVideoUrl = (url, platform) => {
    if (!url || !url.trim()) return false;
    
    try {
      const urlObj = new URL(url);
      
      switch (platform) {
        case 'youtube':
          return (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) &&
                 (url.includes('watch?v=') || url.includes('youtu.be/') || url.includes('embed/'));
        case 'tiktok':
          return urlObj.hostname.includes('tiktok.com') && url.includes('/video/');
        case 'instagram':
          return urlObj.hostname.includes('instagram.com') && (url.includes('/p/') || url.includes('/reel/'));
        default:
          return false;
      }
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAdmin) {
      setError('Admin access required to add videos');
      return;
    }

    setError('');
    
    // Validation
    if (!originalUrl.trim()) {
      setError('Video URL is required');
      return;
    }

    if (!validateVideoUrl(originalUrl, platform)) {
      setError(`Invalid ${selectedPlatform.name} URL format. Please check the URL and try again.`);
      return;
    }

    if (!addedBy.trim()) {
      setError('Your name is required');
      return;
    }

    setLoading(true);
    
    try {
      // Get admin token from localStorage or context
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        throw new Error('Admin token not found. Please login as admin.');
      }

      const videoData = {
        platform: platform.toLowerCase(),
        originalUrl: originalUrl.trim(),
        addedBy: addedBy.trim()
      };

      console.log('[AddVideoForm] Submitting video data:', videoData);

      await addVideo(videoData, adminToken);

      // Reset form
      setOriginalUrl('');
      setPlatform('youtube');
      setAddedBy(user?.displayName || user?.email || '');
      setError('');

      // Notify parent component
      if (onVideoAdded) {
        onVideoAdded();
      }

    } catch (error) {
      console.error('Error adding video:', error);
      setError(error.message || 'Failed to add video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      {/* Platform Selection */}
      <div>
        <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Select Platform
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {platformOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = platform === option.id;
            return (
              <motion.button
                key={option.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPlatform(option.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? `${option.borderColor} ${option.bgColor}`
                    : darkMode
                    ? 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-6 h-6 ${option.color}`} />
                  <span className={`font-medium ${
                    isSelected 
                      ? darkMode ? 'text-white' : 'text-gray-900'
                      : darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {option.name}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Video URL Input */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Video URL
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <PlatformIcon className={`w-5 h-5 ${selectedPlatform.color}`} />
          </div>
          <input
            type="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder={selectedPlatform.example}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors ${
              darkMode
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            required
          />
        </div>
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Paste the full {selectedPlatform.name} video URL here
        </p>
      </div>

      {/* Added By Input */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Added By
        </label>
        <input
          type="text"
          value={addedBy}
          onChange={(e) => setAddedBy(e.target.value)}
          placeholder="Your name or username"
          className={`w-full px-4 py-3 rounded-xl border transition-colors ${
            darkMode
              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
          required
        />
        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          This will be displayed as the person who added the video
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            darkMode
              ? 'bg-red-900/20 border-red-800 text-red-300'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <p className="text-sm font-medium">{error}</p>
        </motion.div>
      )}

      {/* URL Preview */}
      {originalUrl && validateVideoUrl(originalUrl, platform) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            darkMode
              ? 'bg-green-900/20 border-green-800'
              : 'bg-green-50 border-green-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${selectedPlatform.bgColor}`}>
              <PlatformIcon className={`w-4 h-4 ${selectedPlatform.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                Valid {selectedPlatform.name} URL detected
              </p>
              <p className={`text-xs truncate ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                {originalUrl}
              </p>
            </div>
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'hover:bg-green-800/50 text-green-300'
                  : 'hover:bg-green-100 text-green-600'
              }`}
            >
              <FaExternalLinkAlt className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading || !validateVideoUrl(originalUrl, platform) || !addedBy.trim()}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
          loading || !validateVideoUrl(originalUrl, platform) || !addedBy.trim()
            ? darkMode
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : darkMode
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <FaSpinner className="animate-spin" />
            <span>Adding Video...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <FaPlus />
            <span>Add Video</span>
          </div>
        )}
      </motion.button>

      {/* Help Text */}
      <div className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <p>The video information will be automatically fetched from the platform.</p>
        <p className="mt-1">Make sure the video is publicly accessible.</p>
      </div>
    </motion.form>
  );
};

export default AddVideoForm;
