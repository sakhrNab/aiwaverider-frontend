import React, { useState, useEffect } from 'react';
import { FaPlus, FaSpinner, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa';
import { addVideo, updateVideo } from '../../api/content/videoService.js';
import { toast } from 'react-toastify';

const platformOptions = [
  { id: 'youtube', name: 'YouTube', icon: <FaYoutube className="text-red-600" /> },
  { id: 'tiktok', name: 'TikTok', icon: <FaTiktok /> },
  { id: 'instagram', name: 'Instagram', icon: <FaInstagram className="text-purple-600" /> }
];

const AddVideoForm = ({ onVideoAdded, onCancel, editingVideo }) => {
  const [videoUrl, setVideoUrl] = useState(editingVideo?.url || '');
  const [platform, setPlatform] = useState(editingVideo?.platform || 'youtube');
  const [category, setCategory] = useState(editingVideo?.category || '');
  const [username, setUsername] = useState(editingVideo?.user || '');
  const [title, setTitle] = useState(editingVideo?.title || '');
  const [videoId, setVideoId] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [categories] = useState([
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
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set initial category
  if (category === '' && categories.length > 0) {
    setCategory(categories[0]);
  }

  const validateVideoUrl = (url, platform) => {
    // For validation, we'll just check if the URL contains the platform domain
    // and has a reasonable structure - full validation happens in extractVideoId
    switch (platform) {
      case 'youtube':
        return url.includes('youtube.com') || url.includes('youtu.be');
      case 'tiktok':
        return url.includes('tiktok.com') && url.includes('/video/');
      case 'instagram':
        return url.includes('instagram.com') && (url.includes('/p/') || url.includes('/reel/'));
      default:
        return false;
    }
  };

  const extractVideoId = (url, platform) => {
    switch (platform) {
      case 'youtube': {
        // Extract YouTube video ID
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
      }
      case 'tiktok': {
        // Extract TikTok video ID - more permissive pattern
        try {
          // Try to parse as URL and get the pathname
          const videoPath = new URL(url).pathname;
          // Find video ID - looking for digits after /video/
          const match = videoPath.match(/\/video\/(\d+)/i);
          return match ? match[1] : null;
        } catch {
          // Fallback to regex if URL parsing fails
          const regExp = /tiktok\.com.*\/video\/(\d+)/i;
          const match = url.match(regExp);
          return match ? match[1] : null;
        }
      }
      case 'instagram': {
        // Extract Instagram post ID - more permissive
        try {
          // Try to parse as URL and get the pathname
          const postPath = new URL(url).pathname;
          // Match the ID from either /p/ID or /reel/ID format
          const match = postPath.match(/\/(p|reel)\/([a-zA-Z0-9_-]+)/i);
          return match ? match[2] : null;
        } catch {
          // Fallback to regex if URL parsing fails
          const regExp = /instagram\.com.*\/(p|reel)\/([a-zA-Z0-9_-]+)/i;
          const match = url.match(regExp);
          return match ? match[2] : null;
        }
      }
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate URL
    if (!validateVideoUrl(videoUrl, platform)) {
      setError(`Invalid ${platformOptions.find(p => p.id === platform).name} URL format`);
      return;
    }
    
    // Extract video ID
    const videoId = extractVideoId(videoUrl, platform);
    if (!videoId) {
      setError('Could not extract video ID from URL');
      return;
    }
    
    setLoading(true);
    
    try {
      // Format URL for backend compatibility
      let formattedUrl = videoUrl;
      
      // Special handling for Instagram to ensure it works with updated backend
      if (platform === 'instagram') {
        // The backend now handles Instagram posts from any account
        // For p/ posts keep the format simple to ensure backend can parse it
        // The backend will now try business account first, then fall back to shortcode
        formattedUrl = `https://www.instagram.com/p/${videoId}/`;
      } else if (platform === 'tiktok') {
        // Simplify TikTok URL to ensure backend can parse it
        const tiktokUsername = videoUrl.match(/@([\w.-]+)/)?.[1] || 'user';
        formattedUrl = `https://www.tiktok.com/@${tiktokUsername}/video/${videoId}`;
      }
      
      // Submit new or updated video
      // The backend will fetch the thumbnail from TikTok API
      const videoData = {
        url: formattedUrl, // Use formatted URL
        platform,
        videoId,
        category,
        user: username,
        title
      };
      
      // Log for debugging
      console.log('[AddVideoForm] Submitting video data:', videoData);

      if (editingVideo) {
        // Update existing video
        await updateVideo(editingVideo._id, videoData);
        toast.success('Video updated successfully!');
      } else {
        // Submit new video
        await addVideo(videoData);
        toast.success('Video added successfully!');
      }

      onVideoAdded();
      
      // Reset form
      setVideoUrl('');
      setPlatform('youtube');
      setCategory('');
      setUsername('');
      setTitle('');
      setVideoId('');
      setShowPreview(false);
      
    } catch (error) {
      console.error('Error saving video:', error);
      setError(error.response?.data?.message || 'Error saving video. Please try again.');
      toast.error('Failed to save video');
    } finally {
      setLoading(false);
    }
  };

  // Set initial values when editing video changes
  useEffect(() => {
    if (editingVideo) {
      setVideoUrl(editingVideo.url || '');
      setPlatform(editingVideo.platform || 'youtube');
      setCategory(editingVideo.category || '');
      setUsername(editingVideo.user || '');
      setTitle(editingVideo.title || '');
      
      // Extract videoId from the existing video
      if (editingVideo.videoId) {
        setVideoId(editingVideo.videoId);
        setShowPreview(true);
      }
    }
  }, [editingVideo]);
  
  // Parse and preview video when URL changes
  useEffect(() => {
    if (videoUrl) {
      const extractedId = extractVideoId(videoUrl, platform);
      if (extractedId) {
        setVideoId(extractedId);
        setShowPreview(true);
      } else {
        setShowPreview(false);
      }
    } else {
      setShowPreview(false);
    }
  }, [videoUrl, platform]);
  
  // Generate embed URL for preview
  const getEmbedUrl = () => {
    if (!videoId) return '';
    
    switch (platform) {
      case 'youtube':
        return `https://www.youtube.com/embed/${videoId}`;
      case 'tiktok':
        return `https://www.tiktok.com/embed/v2/${videoId}`;
      case 'instagram':
        return `https://www.instagram.com/p/${videoId}/embed`;
      default:
        return '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center dark:text-white">
        <FaPlus className="mr-2 text-green-500" /> {editingVideo ? 'Edit Video' : 'Add New Video'}
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Platform
          </label>
          <div className="grid grid-cols-3 gap-2">
            {platformOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setPlatform(option.id)}
                className={`flex items-center justify-center py-2 px-4 rounded-md border ${
                  platform === option.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {option.icon}
                <span className="ml-2">{option.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Video URL
          </label>
          <input
            type="text"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder={`Enter ${platform} video URL`}
            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {platform === 'youtube' && 'Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
            {platform === 'tiktok' && 'Example: https://www.tiktok.com/@username/video/1234567890123456789'}
            {platform === 'instagram' && 'Example: https://www.instagram.com/p/ABC123XYZ/'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Content creator username"
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Video Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        
        {/* Video Preview */}
        {showPreview && videoId && (
          <div className="mb-6 mt-4 border rounded-lg overflow-hidden dark:border-gray-600">
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 font-medium text-sm dark:text-gray-200">
              Video Preview
            </div>
            <div className="relative pb-[56.25%] h-0 overflow-hidden bg-gray-200 dark:bg-gray-800">
              <iframe 
                src={getEmbedUrl()}
                className="absolute top-0 left-0 w-full h-full" 
                frameBorder="0" 
                allowFullScreen
                title="Video preview"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          </div>
        )}
        
        <div className="flex justify-end mt-6 space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FaSpinner className="inline mr-2 animate-spin" /> Adding...
              </>
            ) : (
              editingVideo ? 'Update Video' : 'Add Video'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVideoForm;
