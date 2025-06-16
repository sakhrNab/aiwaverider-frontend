import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import VideosService from '../../services/videosService';
import { toast } from 'react-toastify';
import './AdminVideosPage.css';

/**
 * Admin Videos Management Page
 */
const AdminVideosPage = () => {
  const { darkMode } = useTheme();
  const { user } = useContext(AuthContext);
  const [videos, setVideos] = useState({
    youtube: [],
    tiktok: [],
    instagram: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('youtube');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    platform: 'youtube',
    originalUrl: '',
    addedBy: user?.displayName || user?.email || 'Admin'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all videos
  const fetchAllVideos = async () => {
    setLoading(true);
    try {
      const platforms = ['youtube', 'tiktok', 'instagram'];
      const results = await Promise.allSettled(
        platforms.map(platform => VideosService.getVideosByPlatform(platform, 1))
      );

      const videosData = {};
      results.forEach((result, index) => {
        const platform = platforms[index];
        if (result.status === 'fulfilled') {
          videosData[platform] = result.value.videos || [];
        } else {
          videosData[platform] = [];
          console.error(`Failed to fetch ${platform} videos:`, result.reason);
        }
      });

      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await VideosService.addVideo(formData);
      toast.success('Video added successfully');
      setShowAddModal(false);
      setFormData({
        platform: 'youtube',
        originalUrl: '',
        addedBy: user?.displayName || user?.email || 'Admin'
      });
      fetchAllVideos(); // Refresh the videos list
    } catch (error) {
      console.error('Error adding video:', error);
      toast.error(error.message || 'Failed to add video');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle refresh video stats
  const handleRefreshStats = async (videoId) => {
    try {
      await VideosService.refreshVideoStats(videoId);
      toast.success('Video stats refreshed');
      fetchAllVideos(); // Refresh the videos list
    } catch (error) {
      console.error('Error refreshing video stats:', error);
      toast.error('Failed to refresh video stats');
    }
  };

  useEffect(() => {
    fetchAllVideos();
  }, []);

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'youtube': return 'red';
      case 'tiktok': return 'pink';
      case 'instagram': return 'purple';
      default: return 'blue';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={`admin-videos-page ${darkMode ? 'dark' : ''}`}>
      <div className="page-header">
        <h1>Videos Management</h1>
        <button
          className="add-video-btn"
          onClick={() => setShowAddModal(true)}
        >
          Add Video
        </button>
      </div>

      {/* Platform Tabs */}
      <div className="platform-tabs">
        {['youtube', 'tiktok', 'instagram'].map(platform => (
          <button
            key={platform}
            className={`tab-btn ${activeTab === platform ? 'active' : ''} ${getPlatformColor(platform)}`}
            onClick={() => setActiveTab(platform)}
          >
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
            <span className="video-count">({videos[platform]?.length || 0})</span>
          </button>
        ))}
      </div>

      {/* Videos Table */}
      <div className="videos-table-container">
        {loading ? (
          <div className="loading-spinner">Loading videos...</div>
        ) : (
          <table className="videos-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Author</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos[activeTab]?.length > 0 ? (
                videos[activeTab].map(video => (
                  <tr key={video.id}>
                    <td>
                      <img
                        src={video.thumbnailUrl || '/placeholder-video.jpg'}
                        alt={video.title}
                        className="video-thumbnail"
                      />
                    </td>
                    <td>
                      <div className="video-title">{video.title || 'Untitled'}</div>
                      <div className="video-url">
                        <a href={video.originalUrl} target="_blank" rel="noopener noreferrer">
                          View Original
                        </a>
                      </div>
                    </td>
                    <td>
                      <div className="author-info">
                        <div className="author-name">{video.authorName || 'Unknown'}</div>
                        <div className="author-user">@{video.authorUser || 'unknown'}</div>
                      </div>
                    </td>
                    <td>{formatNumber(video.views)}</td>
                    <td>{formatNumber(video.likes)}</td>
                    <td>{formatDate(video.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="refresh-btn"
                          onClick={() => handleRefreshStats(video.id)}
                          title="Refresh Stats"
                        >
                          Refresh
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-videos">
                    No videos found for {activeTab}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Video Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Video</h2>
              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="video-form">
              <div className="form-group">
                <label htmlFor="platform">Platform</label>
                <select
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleFormChange}
                  required
                >
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="originalUrl">Video URL</label>
                <input
                  type="url"
                  id="originalUrl"
                  name="originalUrl"
                  value={formData.originalUrl}
                  onChange={handleFormChange}
                  placeholder="https://..."
                  required
                />
                <small>Enter the full URL of the video</small>
              </div>
              <div className="form-group">
                <label htmlFor="addedBy">Added By</label>
                <input
                  type="text"
                  id="addedBy"
                  name="addedBy"
                  value={formData.addedBy}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVideosPage; 