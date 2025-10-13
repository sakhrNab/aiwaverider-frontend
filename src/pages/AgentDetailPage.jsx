import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaDownload, FaHeart, FaRegHeart, FaLink, FaComment, FaShare, FaCheckCircle, FaShoppingCart, FaTrash, FaFileAlt, FaFileCode, FaTag, FaFilePdf, FaFileWord, FaFileExcel, FaFileArchive, FaFileImage, FaRocket, FaBolt, FaGem, FaLightbulb, FaShieldAlt, FaTrophy } from 'react-icons/fa';
import { 
  toggleWishlist, 
  toggleAgentLike,
  downloadFreeAgent,
  fetchAgentById,
  getUserLikeStatus,
  addAgentReview,
  deleteAgentReview
} from '../api/marketplace/agentApi.js';
import { useCart } from '../contexts/CartContext.jsx';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { formatPrice } from '../utils/priceUtils.js';
import useAgentStore from '../store/agentStore.js';
import DOMPurify from 'dompurify';
import { toast } from 'react-toastify';
import './AgentDetailPage.css';
import n8nWorkflowImg from '../assets/n8nworkflow.png';
import { createSubscriberAccessToken } from '../api/core/apiConfig';

// Enhanced mobile detection utility
const isMobileDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 
    'windows phone', 'opera mini', 'mobile', 'tablet'
  ];
  
  // Check user agent for mobile keywords
  const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
  
  // Check for touch support
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check screen size (mobile/tablet typically have smaller screens)
  const isSmallScreen = window.innerWidth <= 768;
  
  // Return true if any mobile indicators are present
  return isMobileUA || (isTouchDevice && isSmallScreen);
};



// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to get file icon
const getFileIcon = (fileName, contentType) => {
  if (fileName.endsWith('.json') || contentType === 'application/json') {
    return <FaFileCode className="file-icon json" title="JSON File" />;
  }
  if (fileName.endsWith('.txt') || contentType === 'text/plain') {
    return <FaFileAlt className="file-icon txt" title="Text File" />;
  }
  if (fileName.endsWith('.pdf') || contentType === 'application/pdf') {
    return <FaFilePdf className="file-icon pdf" title="PDF File" />;
  }
  if (fileName.endsWith('.doc') || fileName.endsWith('.docx') || contentType?.includes('word')) {
    return <FaFileWord className="file-icon doc" title="Word Document" />;
  }
  if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx') || contentType?.includes('excel')) {
    return <FaFileExcel className="file-icon xls" title="Excel File" />;
  }
  if (fileName.endsWith('.zip') || fileName.endsWith('.rar') || contentType?.includes('zip')) {
    return <FaFileArchive className="file-icon zip" title="Archive File" />;
  }
  if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || contentType?.includes('image')) {
    return <FaFileImage className="file-icon image" title="Image File" />;
  }
  return <FaFileAlt className="file-icon default" title="File" />;
};

// Helper function to get category colors
const getCategoryColor = (category) => {
  const colors = {
    'Productivity': '#10B981',
    'Business': '#3B82F6', 
    'Marketing': '#F59E0B',
    'Analytics': '#8B5CF6',
    'Communication': '#06B6D4',
    'Content': '#EF4444',
    'E-commerce': '#F97316',
    'Social': '#EC4899',
    'Development': '#6366F1',
    'Design': '#84CC16',
    'Automation': '#059669',
    'AI/ML': '#7C3AED',
    'Finance': '#DC2626',
    'Healthcare': '#0891B2',
    'Education': '#CA8A04'
  };
  return colors[category] || '#6B7280';
};

// Enhanced Star Rating Component
const StarRating = ({ rating, onRatingChange, size = "large", interactive = false }) => {
  const ratingValue = Number(rating) || 0;
  const sizeClass = size === "small" ? "star-small" : "star-large";
  
  const handleStarClick = (selectedRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };
  
  return (
    <div className={`star-rating ${interactive ? 'interactive' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span 
          key={star} 
          onClick={() => handleStarClick(star)}
          className={interactive ? 'star-clickable' : ''}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          {star <= ratingValue ? (
            <FaStar className={`star-filled ${sizeClass}-filled`} />
          ) : (
            <FaRegStar className={`star-empty ${sizeClass}-empty`} />
          )}
        </span>
      ))}
    </div>
  );
};

// Enhanced Like Button Component
const LikeButton = ({ agentId, initialLikes = 0, onLikeUpdate }) => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useTheme();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [initialStateLoaded, setInitialStateLoaded] = useState(false);
  const checkIntervalRef = useRef(null);

  // Enhanced initialization with better error handling
  useEffect(() => {
    // Initialize like count properly - handle array or number
    if (Array.isArray(initialLikes)) {
      setLikeCount(initialLikes.length);
    } else if (typeof initialLikes === 'number') {
      setLikeCount(initialLikes);
    }
    
    // Check if the current user has liked this agent
    if (user && agentId) {
      console.log(`Checking if user has liked agent. User ID: ${user.uid}, Agent ID: ${agentId}`);
      
      const checkUserLiked = async () => {
        try {
          const token = localStorage.getItem('authToken');
          if (!user || !token) {
            setInitialStateLoaded(true);
            return;
          }
          
          // Check if we already have the like status in the initialLikes data
          if (Array.isArray(initialLikes)) {
            const userLiked = initialLikes.includes(user.uid) || 
                            initialLikes.some(like => 
                              (typeof like === 'object' && like.userId === user.uid) || 
                              like === user.uid
                            );
            console.log(`Determined like status from props: ${userLiked}`);
            setLiked(userLiked);
            setInitialStateLoaded(true);
            return;
          }
          
          // Check cached like status
          try {
            const cachedStatus = localStorage.getItem(`like_status_${agentId}`);
            if (cachedStatus) {
              const parsedStatus = JSON.parse(cachedStatus);
              const cacheTime = parsedStatus._cacheTime || 0;
              const now = Date.now();
              
              if (now - cacheTime < 5 * 60 * 1000) {
                console.log(`Using cached like status for agent ${agentId}`);
                setLiked(parsedStatus.liked || false);
                if (parsedStatus.likesCount !== undefined) {
                  setLikeCount(parsedStatus.likesCount);
                }
                setInitialStateLoaded(true);
                return;
              }
            }
          } catch (cacheError) {
            console.warn('Error reading from like status cache:', cacheError);
          }

          // Fetch from API if no valid cache
          console.log('No valid cached like data, fetching from API');
          const likeStatus = await getUserLikeStatus(agentId);
          const isLiked = likeStatus.liked || false;
          console.log(`API check: User has liked agent: ${isLiked}`);
          setLiked(isLiked);
          
          if (likeStatus.likesCount !== undefined) {
            setLikeCount(likeStatus.likesCount);
          }
          
          // Cache the result
          try {
            localStorage.setItem(`like_status_${agentId}`, JSON.stringify({
              ...likeStatus,
              _cacheTime: Date.now()
            }));
          } catch (e) {
            // Ignore storage errors
          }
        } catch (error) {
          console.error("Error checking like status:", error);
          setLiked(false);
        }
        
        setInitialStateLoaded(true);
      };
      
      checkUserLiked();
    } else {
      console.log("No user or agent ID, setting initialStateLoaded = true");
      setInitialStateLoaded(true);
    }
  }, [user, agentId]);

  // Enhanced toast notifications
  const showToast = (type, message, options = {}) => {
    const defaultOptions = {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: darkMode ? "dark" : "light",
      style: {
        background: darkMode ? 'var(--background-card)' : '#ffffff',
        color: darkMode ? 'var(--text-primary)' : '#333333',
        borderRadius: '12px',
        border: `1px solid ${darkMode ? 'var(--border-color)' : '#e2e8f0'}`,
        boxShadow: darkMode ? 'var(--shadow-lg)' : '0 10px 25px rgba(0, 0, 0, 0.15)',
        fontSize: '14px',
        fontWeight: '600',
        fontFamily: 'var(--font-family)'
      }
    };

    const toastOptions = { ...defaultOptions, ...options };

    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'warning':
        toast.warning(message, toastOptions);
        break;
      case 'info':
        toast.info(message, toastOptions);
        break;
      default:
        toast(message, toastOptions);
    }
  };
  
  // Enhanced confirm toast with better UX
  const showConfirmToast = () => {
    toast.dismiss();
    console.log("Showing unlike confirmation dialog");
    
    toast(
      ({ closeToast }) => (
        <div className="confirm-toast-container">
          <div className="confirm-toast-message">
            <span role="img" aria-label="question">💖</span> Remove your like from this amazing agent?
          </div>
          <div className="confirm-toast-actions">
            <button 
              onClick={() => {
                closeToast();
                console.log("Unlike confirmed, calling processLikeToggle()");
                processLikeToggle();
              }}
              className="confirm-toast-button confirm"
            >
              Yes, remove like
            </button>
            <button 
              onClick={() => {
                closeToast();
                console.log("Unlike cancelled");
              }}
              className="confirm-toast-button cancel"
            >
              Keep it ❤️
            </button>
          </div>
        </div>
      ),
      {
        position: "bottom-right",
        autoClose: false,
        closeOnClick: false,
        draggable: true,
        closeButton: true,
        className: 'confirm-unlike-toast',
        toastId: 'unlike-confirmation'
      }
    );
  };
  
  // Enhanced like toggle processing
  const processLikeToggle = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      console.log('Sending toggle like request to server');
      const response = await toggleAgentLike(agentId);
      console.log('Server response:', response);
      
      if (response.success) {
        const didLike = response.liked;
        
        setLiked(didLike);
        
        if (response.likesCount !== undefined) {
          setLikeCount(response.likesCount);
          if (onLikeUpdate) {
            onLikeUpdate(response.likesCount);
          }
        }
        
        // Enhanced success notifications
        if (didLike) {
          toast.success('💖 Awesome! You liked this agent!', {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            icon: "💖",
            toastId: 'like-added'
          });
        } else {
          toast.success('💔 Removed your like', {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            icon: "💙",
            toastId: 'like-removed'
          });
        }
      } else {
        toast.error(response.error || 'Failed to update like', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          icon: "❌",
          toastId: 'like-error'
        });
      }
    } catch (err) {
      console.error(`Error toggling like for agent:`, err);
      toast.error(`Failed to update like`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: "❌",
        toastId: 'like-error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLikeToggle = async () => {
    if (!user) {
      showToast('info', '👋 Please sign in to like this agent', {
        icon: "👋"
      });
      return;
    }
    
    if (isLoading || !initialStateLoaded) return;
    
    if (liked) {
      console.log("Agent is liked, showing confirmation dialog");
      showConfirmToast();
      return;
    } else {
      console.log("Agent is not liked, directly toggling like");
    }
    
    processLikeToggle();
  };
  
  return (
    <button 
      className={`like-button ${liked ? 'liked' : ''} ${isLoading ? 'loading' : ''} ${darkMode ? 'dark-mode' : ''}`}
      onClick={handleLikeToggle}
      disabled={isLoading || !initialStateLoaded}
      title={liked ? "Remove like" : "Like this agent"}
    >
      {liked ? <FaHeart className="heart-icon" /> : <FaRegHeart className="heart-icon" />}
      <span className="like-count">{likeCount}</span>
    </button>
  );
};

// Enhanced Category Badge Component
const CategoryBadge = ({ category, onClick }) => {
  return (
    <button 
      className="category-badge"
      style={{ backgroundColor: getCategoryColor(category) }}
      onClick={() => onClick && onClick(category)}
      title={`Explore all ${category} agents`}
    >
      <FaTag className="category-icon" />
      {category}
    </button>
  );
};

// Enhanced Business Value Section Component
const BusinessValueSection = ({ businessValue, darkMode }) => {
  if (!businessValue) {
    // Default business value for professional presentation
    return (
      <div className={`business-value-section ${darkMode ? 'dark-mode' : ''} fade-in`}>
        <div className="business-value-header">
          <FaRocket className="value-icon" />
          <h3>Why Choose This Professional Solution?</h3>
        </div>
        <div className="business-value-content">
          <p>This carefully crafted agent represents hours of expert development and testing. You're investing in a proven solution that delivers immediate value, saves precious time, and provides the competitive edge your business needs to succeed in today's fast-paced digital landscape.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`business-value-section ${darkMode ? 'dark-mode' : ''} fade-in`}>
      <div className="business-value-header">
        <FaBolt className="value-icon" />
        <h3>Why This Agent is Perfect for You</h3>
      </div>
      <div className="business-value-content">
        <p>{businessValue.replace(/"/g, '')}</p>
      </div>
    </div>
  );
};

// Enhanced Deliverables Section Component
const DeliverablesSection = ({ deliverables, darkMode, isFreeAgent }) => {
  if (!deliverables || !Array.isArray(deliverables) || deliverables.length === 0) {
    // Default deliverables for professional presentation
    return (
      <div className={`deliverables-section ${darkMode ? 'dark-mode' : ''} slide-in-right`}>
        <div className="deliverables-header">
          <FaGem className="deliverables-icon" />
          <h3>What You'll Receive</h3>
        </div>
        <div className="deliverables-list">
          <div className="deliverable-item">
            <div className="deliverable-info">
              <div className="deliverable-icon-name">
                <FaFileCode className="file-icon json" />
                <div className="deliverable-details">
                  <h4 className="deliverable-filename">Complete Agent Configuration</h4>
                  <p className="deliverable-description">Fully configured and ready-to-use agent with optimized settings</p>
                  <span className="deliverable-size">Professional Setup</span>
                </div>
              </div>
            </div>
          </div>
          <div className="deliverable-item">
            <div className="deliverable-info">
              <div className="deliverable-icon-name">
                <FaFileAlt className="file-icon txt" />
                <div className="deliverable-details">
                  <h4 className="deliverable-filename">Implementation Guide</h4>
                  <p className="deliverable-description">Step-by-step instructions for seamless integration</p>
                  <span className="deliverable-size">Quick Start</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {!isFreeAgent && (
          <div className="delivery-info">
            <p className="delivery-note">
              📧 All files will be delivered instantly to your email after purchase
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`deliverables-section ${darkMode ? 'dark-mode' : ''} slide-in-right`}>
      <div className="deliverables-header">
        <FaDownload className="deliverables-icon" />
        <h3>What You Get</h3>
      </div>
      <div className="deliverables-list">
        {deliverables.map((deliverable, index) => (
          <div key={index} className="deliverable-item">
            <div className="deliverable-info">
              <div className="deliverable-icon-name">
                {getFileIcon(deliverable.fileName, deliverable.contentType)}
                <div className="deliverable-details">
                  <h4 className="deliverable-filename">{deliverable.fileName}</h4>
                  <p className="deliverable-description">{deliverable.description}</p>
                  <span className="deliverable-size">
                    {formatFileSize(deliverable.size)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!isFreeAgent && (
        <div className="delivery-info">
          <p className="delivery-note">
            📧 Files will be sent to your email after successful payment
          </p>
        </div>
      )}
    </div>
  );
};

// Enhanced Description Introduction Component
const DescriptionIntroduction = ({ darkMode }) => {
  return (
    <div className="description-intro">
      <h3>
        <FaLightbulb />
        Premium AI Solution
      </h3>
      <p>
        This agent has been carefully crafted and optimized for real-world applications. 
        Built with industry best practices and designed to deliver consistent, reliable results 
        for professionals who demand excellence.
      </p>
    </div>
  );
};

// Enhanced Empty Reviews Component
const EmptyReviewsState = ({ user, darkMode }) => {
  return (
    <div className="no-reviews-encouragement">
      <h3 className="encouragement-title">Be the First to Share Your Experience!</h3>
      <p className="encouragement-text">
        This amazing agent is waiting for its first review. Your feedback helps other users discover 
        great solutions and helps us improve our offerings.
      </p>
      {user ? (
        <button className="encouragement-cta">
          <FaTrophy style={{ marginRight: '8px' }} />
          Write the First Review
        </button>
      ) : (
        <div className="auth-prompt-buttons" style={{ gap: '12px', marginTop: '16px' }}>
          <Link 
            to="/sign-in"
            className="signin-button"
          >
            Sign In to Review
          </Link>
          <button 
            className="signup-button"
            onClick={() => {
              if (typeof window.openSignUpModal === 'function') {
                window.openSignUpModal();
              } else {
                document.dispatchEvent(new CustomEvent('open-signup-modal'));
              }
            }}
          >
            Sign Up & Review
          </button>
        </div>
      )}
    </div>
  );
};

// Enhanced Comment Section Component
const CommentSection = ({ agentId, existingReviews = [], onReviewsLoaded, skipExternalFetch = false, onReviewAdded = () => {}, onReviewDeleted = () => {} }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewEligibilityChecked, setReviewEligibilityChecked] = useState(false);
  const [reviewEligibilityReason, setReviewEligibilityReason] = useState('');
  const { user } = useContext(AuthContext);
  const { darkMode } = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);
  const [prevAuthState, setPrevAuthState] = useState(false);
  
  // Check if user is an admin
  const isAdmin = useMemo(() => {
    if (!user) return false;
    return user.roles?.includes('admin') || user.isAdmin || user.role === 'admin' || 
           user.email?.endsWith('@aiwaverider.com') || user.uid === '0pYyiwNXvSZdoRa1Smgj3sWWYsg1';
  }, [user]);
  
  // Enhanced reviews processing
  useEffect(() => {
    const processReviews = async () => {
      try {
        setIsLoadingComments(true);
        
        if (existingReviews && Array.isArray(existingReviews)) {
          const sortedReviews = [...existingReviews].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          setComments(sortedReviews);
          if (onReviewsLoaded) onReviewsLoaded(sortedReviews.length);
          if (user) setHasUserReviewed(!!sortedReviews.find(r => r.userId === user.uid));
        } else {
          setComments([]);
          if (onReviewsLoaded) onReviewsLoaded(0);
        }
      } catch (err) {
        console.error('Error processing comments:', err);
        setError('Failed to load comments');
      } finally {
        setIsLoadingComments(false);
      }
    };
    processReviews();
    return () => {};
  }, [agentId, user, existingReviews, onReviewsLoaded]);
  
  // Enhanced auth state management
  useEffect(() => {
    setPrevAuthState(!!user);
  }, [user, prevAuthState]);

  // Check eligibility to review: unauthenticated users cannot review; otherwise use local heuristics
  useEffect(() => {
    if (!user) {
      setCanReview(false);
      setReviewEligibilityChecked(true);
      setReviewEligibilityReason('Please sign in to share your experience');
      return;
    }

    // Admins can always review
    const isAdminUser = user.roles?.includes('admin') || user.isAdmin || user.role === 'admin' || 
                        user.email?.endsWith('@aiwaverider.com') || user.uid === '0pYyiwNXvSZdoRa1Smgj3sWWYsg1';
    if (isAdminUser) {
      setCanReview(true);
      setReviewEligibilityChecked(true);
      setReviewEligibilityReason('Admin user');
      return;
    }

    // Already reviewed?
    if (existingReviews && Array.isArray(existingReviews)) {
      const already = existingReviews.some(r => r.userId === user.uid);
      if (already) {
        setCanReview(false);
        setReviewEligibilityChecked(true);
        setReviewEligibilityReason('You have already reviewed this agent');
        return;
      }
    }

    // Local download/purchase heuristic
    try {
      const downloadKey = `agent_download_${agentId}_${user.uid}`;
      const downloadRecord = localStorage.getItem(downloadKey);
      if (downloadRecord) {
        setCanReview(true);
        setReviewEligibilityChecked(true);
        setReviewEligibilityReason('You have downloaded this agent');
        return;
      }
    } catch (e) {
      // ignore storage errors
    }

    // Default: not eligible unless server-side persists a purchase record we mirror later
    setCanReview(false);
    setReviewEligibilityChecked(true);
    setReviewEligibilityReason('Only users who downloaded or purchased can review');
  }, [user, agentId, existingReviews]);
  
  // Submit review now only updates local state/store (no API call)
  const handleCommentSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (!user) {
      setError('Please sign in to leave a review');
      return;
    }
    if (!newComment.trim()) {
      setError('Please share your thoughts about this agent');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      // Call secure backend endpoint
      const resp = await addAgentReview(agentId, { content: newComment.trim(), rating });
      if (!resp?.success) {
        const msg = resp?.error || 'Failed to add review';
        setError(msg);
        toast.error(msg, { position: 'bottom-right' });
        return;
      }
      const newReview = resp.review || {
        id: resp.reviewId || `temp-${Date.now()}`,
        content: newComment.trim(),
        rating,
        createdAt: new Date().toISOString(),
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'User'
      };
      setComments(prev => {
        const updated = [...prev, newReview].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        return updated;
      });
      const addReviewToStore = useAgentStore.getState().addReviewToAgent;
      addReviewToStore(agentId, newReview);
      onReviewAdded(newReview, resp.reviewCount, resp.averageRating);
      if (onReviewsLoaded) onReviewsLoaded((resp.reviewCount) || (comments.length + 1));
      setNewComment('');
      setRating(5);
      setHasUserReviewed(true);
      toast.success('Thank you for your review!', { position: 'bottom-right' });
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('An error occurred while adding your review');
      toast.error('An error occurred while adding your review', { position: 'bottom-right' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  };
  
  // Deleting a review: update local state/store only
  const handleDeleteReview = async (reviewId) => {
    const removeReviewFromStore = useAgentStore.getState().removeReviewFromAgent;
    if (!isAdmin) {
      toast.error('Only admins can delete reviews', { position: 'bottom-right', autoClose: 3000, icon: '⛔' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this review?')) {
      setIsDeleting(true);
      try {
        const resp = await deleteAgentReview(agentId, reviewId);
        if (!resp?.success) {
          const status = resp?.status ?? 0;
          if (status === 404) {
            toast.info('Review not found. It might have been deleted already.', { position: 'bottom-right' });
            // Optimistically remove from UI anyway
            setComments(prev => prev.filter(c => c.id !== reviewId && c._id !== reviewId));
            removeReviewFromStore(agentId, reviewId);
          } else if (status === 400) {
            toast.error('Bad request while deleting review.', { position: 'bottom-right' });
          } else if (status === 401) {
            toast.error('You must be signed in to delete reviews.', { position: 'bottom-right' });
          } else if (status === 403) {
            toast.error('You are not allowed to delete this review.', { position: 'bottom-right' });
          } else {
            toast.error(resp?.error || 'Failed to delete review', { position: 'bottom-right' });
          }
          setIsDeleting(false);
          return;
        }
        setComments(prev => prev.filter(c => c.id !== reviewId && c._id !== reviewId));
        removeReviewFromStore(agentId, reviewId);
        onReviewDeleted(reviewId, resp.reviewCount, resp.averageRating);
        if (onReviewsLoaded) onReviewsLoaded(resp.reviewCount ?? Math.max(0, comments.length - 1));
        toast.success('Review deleted', { position: 'bottom-right' });
      } catch (err) {
        console.error('Error deleting comment:', err);
        toast.error('An unexpected error occurred while deleting the review', { position: 'bottom-right' });
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  // Enhanced Eligibility Prompt
  const EligibilityPrompt = () => (
    <div className={`eligibility-prompt ${darkMode ? 'dark-mode' : ''}`}>
      <div className={`eligibility-prompt-content ${darkMode ? 'dark-bg' : ''}`}>
        <div className="eligibility-prompt-icon">
          <FaShieldAlt className={`comment-icon ${darkMode ? 'text-gray-300' : ''}`} />
        </div>
        <h3>Want to Share Your Experience?</h3>
        <p>{reviewEligibilityReason}</p>
        <p>We value authentic feedback from users who have actually used our agents. This ensures high-quality reviews for everyone!</p>
      </div>
    </div>
  );
  
  // Simple Auth Prompt component (ask user to sign in)
const AuthPrompt = () => (
  <div className={`auth-prompt ${darkMode ? 'dark-mode' : ''}`}>
    <div className={`auth-prompt-content ${darkMode ? 'dark-bg' : ''}`}>
      <div className="auth-prompt-icon">
        <FaComment className={`comment-icon ${darkMode ? 'text-gray-300' : ''}`} />
      </div>
      <h3>Join the Community!</h3>
        <p>Sign in to share your experience and help others discover amazing AI agents.</p>
      <div className="auth-prompt-buttons" style={{ justifyContent: 'center' }}>
        <button 
          className={`auth-button signup-button ${darkMode ? 'dark-button' : ''}`} 
          onClick={() => {
            if (typeof window.openSignUpModal === 'function') {
              window.openSignUpModal();
            } else {
              document.dispatchEvent(new CustomEvent('open-signup-modal'));
            }
          }}
          style={{ whiteSpace: 'nowrap', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
            Sign In / Sign Up
        </button>
      </div>
    </div>
  </div>
);
  
  return (
    <div className={`comments-section ${darkMode ? 'dark-mode' : ''}`}>
      <h3 className={`section-heading ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        Reviews & Ratings
      </h3>
      
      {user && !hasUserReviewed && canReview ? (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <div className="rating-input">
            <label className={darkMode ? 'text-white font-medium' : 'text-gray-700'}>Your Rating:</label>
            <StarRating rating={rating} onRatingChange={setRating} interactive={true} />
          </div>
          
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience with this agent... What did you love about it? How did it help you?"
            className={`comment-textarea ${darkMode ? 'dark-input' : ''}`}
            rows={4}
          />
          
          {error && <div className="comment-error">{error}</div>}
          
          <button 
            type="submit" 
            className="submit-comment-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting Your Review...' : 'Share Your Review 🌟'}
          </button>
        </form>
      ) : user && hasUserReviewed ? (
        <div className={`already-reviewed-message ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <p className={`section-heading-paragraph ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            ✨ Thank you for your valuable feedback! You've already shared your experience with this agent.
          </p>
        </div>
      ) : user && reviewEligibilityChecked && !canReview ? (
        <EligibilityPrompt />
      ) : (
        <AuthPrompt />
      )}
      
      <div className="comments-list">
        {isLoadingComments ? (
          <div className={`loading-comments ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Loading reviews... ✨
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className={`comment-item ${darkMode ? 'dark-mode' : ''}`}>
              <div className="comment-header">
                <div className="comment-user">
                  <span className={`user-name ${darkMode ? 'text-gray-200' : ''}`}>
                    {comment.userName || 'Anonymous'} 
                    {comment.verificationStatus === 'verified_purchase' && ' ✅'}
                    {comment.verificationStatus === 'verified_download' && ' 📥'}
                  </span>
                  <span className={`comment-date ${darkMode ? 'text-gray-400' : ''}`}>
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <div className="rating-actions">
                  <StarRating rating={comment.rating} size="small" />
                  {isAdmin && (
                    <button 
                      className="delete-review-btn"
                      onClick={() => handleDeleteReview(comment.id)}
                      disabled={isDeleting}
                      title="Delete review"
                      style={{
                        marginLeft: '12px',
                        padding: '4px 8px',
                        background: 'var(--error-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <FaTrash className="delete-icon" />
                    </button>
                  )}
                </div>
              </div>
              <div className={`comment-content ${darkMode ? 'text-gray-300' : ''}`}>
                {comment.content}
              </div>
            </div>
          ))
        ) : (
          <EmptyReviewsState 
            user={user} 
            darkMode={darkMode}
          />
        )}
      </div>
      

    </div>
  );
};

// Main AgentDetail Component
// NOTE: The global hashtag loader should be managed at the App level
// and persist during page transitions. This component focuses on
// the agent-specific loading states and content.
const AgentDetail = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { darkMode } = useTheme();
  const { addToCart } = useCart();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [customPrice, setCustomPrice] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copySuccess, setCopySuccess] = useState('');
  const [downloadCount, setDownloadCount] = useState(0);
  const [viewTracked, setViewTracked] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const intervalRef = useRef(null);
  const reviewsFetchedRef = useRef(false);
  const loadAttempt = useRef(0);
  
  // Access the agent store
  const { 
    allAgents, 
    isStoreLoading,
    loadInitialData,
    setAllAgents
  } = useAgentStore();
  
  // Image slider refs
  const sliderRef = useRef(null);
  const imageRef = useRef(null);
  
  // Enhanced agent type checking
  const isFreeAgent = (agent) => {
    if (!agent) return true;
    
    if (agent.priceDetails) {
      if (agent.priceDetails.isFree === true) return true;
      if (agent.priceDetails.basePrice === 0) return true;
    }
    
    if (agent.isFree === true) return true;
    
    if (agent.price === 0 || 
        agent.price === '0' || 
        agent.price === 'Free' || 
        agent.price === 'free' || 
        agent.price === '$0' ||
        agent.price === undefined || 
        agent.price === null ||
        agent.price === '') {
      return true;
    }
    
    if (typeof agent.price === 'string' && 
        (agent.price.toLowerCase().includes('free') || 
         agent.price === '$0' || 
         agent.price === '0' || 
         agent.price.trim() === '')) {
      return true;
    }
    
    if (agent.priceDetails) {
      if (agent.priceDetails.basePrice === 0 || 
          agent.priceDetails.basePrice === '0' ||
          agent.priceDetails.basePrice === undefined ||
          agent.priceDetails.discountedPrice === 0 ||
          agent.priceDetails.discountedPrice === '0') {
        return true;
      }
    }
    
    if (typeof agent.price === 'object') {
      const priceObj = agent.price;
      if (priceObj.basePrice === 0 || 
          priceObj.basePrice === '0' ||
          priceObj.basePrice === undefined ||
          priceObj.amount === 0 ||
          priceObj.amount === '0' ||
          priceObj.value === 0 ||
          priceObj.value === '0') {
        return true;
      }
    }
    
    return false;
  };
  
  // Enhanced category click handler
  const handleCategoryClick = (category) => {
    navigate(`/agents?category=${encodeURIComponent(category)}`);
  };
  
  
  // Enhanced memoized values
  const agentTitle = useMemo(() => {
    if (!agent) return '';
    return agent.title || agent.name || 'Professional AI Agent';
  }, [agent]);
  
  const agentDescription = useMemo(() => {
    if (!agent) return '';
    return agent.description || 'A powerful AI agent designed to streamline your workflow and boost productivity.';
  }, [agent]);
  
  const agentPrice = useMemo(() => {
    if (!agent) return 'Price unavailable';
    
    if (isFreeAgent(agent)) {
      return 'Free';
    }
    
    if (agent.priceDetails) {
      const { basePrice, discountedPrice, currency } = agent.priceDetails;
      const currencySymbol = currency === 'EUR' ? '€' : 
                            currency === 'GBP' ? '£' : '$';
      
      if (discountedPrice !== undefined && discountedPrice < basePrice) {
        return `${currencySymbol}${discountedPrice.toFixed(2)} (was ${currencySymbol}${basePrice.toFixed(2)})`;
      }
      
      if (basePrice !== undefined) {
        return `${currencySymbol}${basePrice.toFixed(2)}`;
      }
    }
    
    return formatPrice(agent.price);
  }, [agent]);
  
  
  const agentRatingValue = useMemo(() => {
    if (!agent) return 0;
    
    if (agent.rating && agent.rating.average) {
      return typeof agent.rating.average === 'number' ? 
        agent.rating.average : 
        parseFloat(agent.rating.average) || 0;
    }
    
    if (agent.reviews && Array.isArray(agent.reviews) && agent.reviews.length > 0) {
      const totalRating = agent.reviews.reduce((sum, review) => {
        const reviewRating = parseFloat(review.rating) || 0;
        return sum + reviewRating;
      }, 0);
      return totalRating / agent.reviews.length;
    }
    
    return 0;
  }, [agent]);
  
  const formattedRating = useMemo(() => {
    return agentRatingValue.toFixed(1);
  }, [agentRatingValue]);
  
  // Enhanced agent categories
  const agentCategories = useMemo(() => {
    if (!agent) return [];
    
    if (agent.categories && Array.isArray(agent.categories)) {
      return agent.categories;
    }
    
    if (agent.category && typeof agent.category === 'string') {
      return [agent.category];
    }
    
    return ['AI/ML']; // Default category
  }, [agent]);
  
  // Enhanced business value
  const businessValue = useMemo(() => {
    if (!agent) return null;
    return agent.businessValue || 'This professionally crafted AI agent delivers exceptional value through cutting-edge automation and intelligent optimization, designed to transform your workflow efficiency and drive measurable results.';
  }, [agent]);
  
  // Enhanced deliverables
  const deliverables = useMemo(() => {
    if (!agent) return [];
    return agent.deliverables || [];
  }, [agent]);
  
  const MAX_LOAD_ATTEMPTS = 2;
  
  // Enhanced toast configuration
  const showToast = (type, message, options = {}) => {
    const defaultOptions = {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: darkMode ? "dark" : "light",
      style: {
        background: darkMode ? 'var(--background-card)' : '#ffffff',
        color: darkMode ? 'var(--text-primary)' : '#333333',
        borderRadius: '12px',
        border: `1px solid ${darkMode ? 'var(--border-color)' : '#e2e8f0'}`,
        boxShadow: darkMode ? 'var(--shadow-lg)' : '0 10px 25px rgba(0, 0, 0, 0.15)',
        fontSize: '14px',
        fontWeight: '600',
        fontFamily: 'var(--font-family)'
      }
    };

    const toastOptions = { ...defaultOptions, ...options };

    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'warning':
        toast.warning(message, toastOptions);
        break;
      case 'info':
        toast.info(message, toastOptions);
        break;
      default:
        toast(message, toastOptions);
    }
  };
  
  // Enhanced setup realtime updates
  const setupRealtimeUpdates = (agentId, setAgentFn, setLikesFn, setDownloadFn) => {
    console.log('Setting up periodic updates for agent:', agentId);
  };
  
  const isLoadingRef = useRef(false);
  const apiCallInProgressRef = useRef(false);
  
  // Enhanced main loading effect
  useEffect(() => {
    if (dataLoaded || !agentId || loadAttempt.current >= MAX_LOAD_ATTEMPTS || isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    console.log(`Starting to load agent ${agentId}, attempt ${loadAttempt.current + 1}`);
    
    if ((!allAgents || allAgents.length === 0) && !(isStoreLoading || false)) {
      const shouldLoadAllAgents = loadAttempt.current > 0 || !agentId;
      
      if (shouldLoadAllAgents) {
        console.log('Store is empty, loading initial data first');
        loadInitialData(false).catch(err => {
          console.error('Failed to load initial store data:', err);
        });
      } else {
        console.log('Skipping full agent store load since we only need a single agent');
      }
    }
    
    let timeoutId;
    
    const loadAgent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (!agentId) {
          setError("Invalid agent ID provided.");
          setLoading(false);
          return;
        }
        
        console.log(`Loading agent detail for ID: ${agentId}, from route: ${window.location.pathname}`);
        
        console.log('Checking agent store for agent data...', allAgents);
        if (allAgents && Array.isArray(allAgents) && allAgents.length > 0) {
          const storeAgent = allAgents.find(a => a.id === agentId || a._id === agentId);
          if (storeAgent && !loadAttempt.current) {
            console.log('Using agent data from store:', storeAgent);
            
            const hasReviews = storeAgent.reviews && Array.isArray(storeAgent.reviews) && storeAgent.reviews.length > 0;
            console.log('Agent from store has reviews:', hasReviews ? storeAgent.reviews.length : 0);
            
            setAgent(storeAgent);
            
            if (storeAgent.likes) {
              if (Array.isArray(storeAgent.likes)) {
                setLikesCount(storeAgent.likes.length);
              } else if (typeof storeAgent.likes === 'number') {
                setLikesCount(storeAgent.likes);
              }
            }
            
            if (hasReviews) {
              setReviewCount(storeAgent.reviews.length);
              reviewsFetchedRef.current = true;
            }
            
            setDownloadCount(storeAgent.downloadCount || 0);
            setIsWishlisted(storeAgent.isWishlisted || false);
            
            if (storeAgent.priceDetails && storeAgent.priceDetails.basePrice !== undefined) {
              setCustomPrice(storeAgent.priceDetails.basePrice.toString());
            } else if (typeof storeAgent.price === 'number') {
              setCustomPrice(storeAgent.price.toString());
            } else if (typeof storeAgent.price === 'string' && !isNaN(parseFloat(storeAgent.price))) {
              setCustomPrice(parseFloat(storeAgent.price).toString());
            } else {
              setCustomPrice('0');
            }
            
            setupRealtimeUpdates(agentId, setAgent, setLikesCount, setDownloadCount);
            setLoading(false);
            setDataLoaded(true);
            return;
          }
        }
        
        console.log('Fetching agent data from API...');
        
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log('Aborting initial agent fetch due to timeout');
          abortController.abort('Initial load timeout');
          setError("Request timed out. Please try again later.");
          setLoading(false);
          setDataLoaded(true);
        }, 10000);
        
        loadAttempt.current += 1;
        
        let data;
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          if (apiCallInProgressRef.current) {
            console.log('API call already in progress, waiting...');
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          apiCallInProgressRef.current = true;
          console.log(`Making API call for agent ${agentId}`);
          
          const forceRefresh = window.location.search.includes('refresh=true');
          
          data = await fetchAgentById(agentId, { 
            signal: abortController.signal,
            skipCache: true,
            includeReviews: !!user, // Only fetch reviews when user is authenticated
            timestamp: Date.now()
          });
          
          if (data) {
            const updateStoreReviews = useAgentStore.getState().updateAgentReviews;
            
            if (data.reviews && Array.isArray(data.reviews)) {
              console.log(`Received ${data.reviews.length} fresh reviews with agent data, syncing with store`);
              updateStoreReviews(agentId, data.reviews);
              reviewsFetchedRef.current = true;
              
              localStorage.setItem(`last_reviews_fetch_${agentId}`, Date.now().toString());
            }
          }
          
          apiCallInProgressRef.current = false;
          
          clearTimeout(timeoutId);
        } catch (error) {
          console.error('Error fetching agent data:', error);
          clearTimeout(timeoutId);
          apiCallInProgressRef.current = false;
          
          if (error.name === 'AbortError') {
            setError("Request timed out. Please try again later.");
          } else if (err.response && err.response.status === 400) {
            setError(`Invalid agent ID. Please check the URL and try again.`);
          } else if (error.message && error.message.includes('Network')) {
            setError('Network error. Please check your connection and try again.');
            toast.error('Network error while loading agent. Please try again.', { position: 'bottom-right' });
          } else {
            setError(`There was a problem loading this product. Please try again later.`);
            toast.error('Unexpected error while loading agent.', { position: 'bottom-right' });
          }
          
          setLoading(false);
          setDataLoaded(true);
          return;
        }
        
        console.log('Raw API response for fetchAgentById:', data);
        
        if (!data) {
          throw new Error("No agent data returned from API");
        }
        
        console.log(`Successfully loaded agent data for ${agentId}`);
        
        try {
          localStorage.setItem(`agent_${agentId}`, JSON.stringify(data));
          console.log(`Cached agent data for ${agentId} in localStorage`);
          
          const existingAgent = (allAgents || []).find(a => a.id === agentId || a._id === agentId);
          if (!existingAgent) {
            console.log('Adding agent to store for future reference');
            setAllAgents([...(allAgents || []), data]);
          }
        } catch (cacheError) {
          console.warn('Failed to cache agent data:', cacheError);
        }
        
        // Enhanced data sanitization
        const sanitizedData = {
          ...data,
          title: data.title || data.name || "Professional AI Agent",
          description: data.description || "A powerful AI solution designed to enhance your productivity and streamline complex workflows.",
          price: data.price !== undefined ? data.price : "Contact for pricing",
          creator: data.creator || { name: "AI Waverider Team" },
          downloadCount: data.downloadCount || 0,
          categories: data.categories || (data.category ? [data.category] : ['AI/ML']),
          businessValue: data.businessValue || 'This professionally crafted AI agent delivers exceptional value through cutting-edge automation and intelligent optimization.'
        };
        
        console.log('Sanitized agent data:', sanitizedData);
        
        // Enhanced price details formatting
        if (data.priceDetails) {
          sanitizedData.priceDetails = {
            ...data.priceDetails,
            basePrice: typeof data.priceDetails.basePrice === 'number' ? data.priceDetails.basePrice : 
                      parseFloat(data.priceDetails.basePrice) || 0,
            discountedPrice: typeof data.priceDetails.discountedPrice === 'number' ? data.priceDetails.discountedPrice : 
                            parseFloat(data.priceDetails.discountedPrice) || null,
            currency: data.priceDetails.currency || 'USD'
          };
        } else if (typeof data.price === 'number' || (typeof data.price === 'string' && !isNaN(parseFloat(data.price)))) {
          const numericPrice = typeof data.price === 'number' ? data.price : parseFloat(data.price);
          sanitizedData.priceDetails = {
            basePrice: numericPrice,
            discountedPrice: numericPrice,
            currency: 'USD'
          };
        }
        
        // Enhanced image handling
        if (!sanitizedData.imageUrl && sanitizedData.image && sanitizedData.image.url) {
          console.log('Adding main imageUrl');
          sanitizedData.imageUrl = sanitizedData.image.url;
        } else if (!sanitizedData.imageUrl && sanitizedData.images && sanitizedData.images.length > 0) {
          console.log('Adding image.url');
          sanitizedData.imageUrl = sanitizedData.images[0];
        } else if (!sanitizedData.imageUrl && sanitizedData.iconUrl) {
          console.log('Adding iconUrl');
          sanitizedData.imageUrl = sanitizedData.iconUrl;
        } else if (!sanitizedData.imageUrl) {
          console.log('Creating professional placeholder image');
          sanitizedData.imageUrl = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23667eea;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23764ba2;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23grad)"/%3E%3Ctext x="200" y="150" font-family="Arial" font-size="18" text-anchor="middle" fill="white" font-weight="bold"%3E${encodeURIComponent(sanitizedData.title)}%3C/text%3E%3C/svg%3E`;
        }
        
        // Enhanced images array
        if (!sanitizedData.images || !Array.isArray(sanitizedData.images)) {
          sanitizedData.images = [];
        }
        
        if (sanitizedData.imageUrl && !sanitizedData.images.includes(sanitizedData.imageUrl)) {
          sanitizedData.images.unshift(sanitizedData.imageUrl);
        }
        
        if (sanitizedData.gallery && Array.isArray(sanitizedData.gallery)) {
          sanitizedData.gallery.forEach(item => {
            const galleryUrl = typeof item === 'string' ? item : (item && item.url);
            if (galleryUrl && !sanitizedData.images.includes(galleryUrl)) {
              sanitizedData.images.push(galleryUrl);
            }
          });
        }
        
        if (sanitizedData.iconUrl && !sanitizedData.images.includes(sanitizedData.iconUrl)) {
          sanitizedData.images.push(sanitizedData.iconUrl);
        }
        
        setAgent(sanitizedData);
        console.log('Final agent data set in state:', sanitizedData);
        
        // Enhanced initial data setup
        if (sanitizedData.reviews && Array.isArray(sanitizedData.reviews)) {
          setReviewCount(sanitizedData.reviews.length);
        }
        
        if (sanitizedData.likes) {
          if (Array.isArray(sanitizedData.likes)) {
            setLikesCount(sanitizedData.likes.length);
          } else if (typeof sanitizedData.likes === 'number') {
            setLikesCount(sanitizedData.likes);
          }
        }
        
        setDownloadCount(sanitizedData.downloadCount || 0);
        
        // Enhanced initial price setup
        if (sanitizedData.priceDetails && sanitizedData.priceDetails.basePrice !== undefined) {
          setCustomPrice(sanitizedData.priceDetails.basePrice.toString());
        } else if (typeof sanitizedData.price === 'number') {
          setCustomPrice(sanitizedData.price.toString());
        } else if (typeof sanitizedData.price === 'string' && !isNaN(parseFloat(sanitizedData.price))) {
          setCustomPrice(parseFloat(sanitizedData.price).toString());
        } else {
          setCustomPrice('0');
        }
        
        setIsWishlisted(sanitizedData.isWishlisted || false);
        
        setupRealtimeUpdates(agentId, setAgent, setLikesCount, setDownloadCount);
        setLoading(false);
        setDataLoaded(true);
        isLoadingRef.current = false;
        
      } catch (err) {
        console.error('Error loading agent:', err);
        
        if (typeof timeoutId !== 'undefined') {
          clearTimeout(timeoutId);
        }
        
        isLoadingRef.current = false;
        
        if (err.name === 'AbortError' || (err.message && err.message.includes('aborted'))) {
          console.log('Agent initial load was aborted due to timeout');
          
          try {
            console.log('Attempting to load from cache after abort');
            const cachedData = await fetchAgentById(agentId, { 
              skipCache: false,
              forceCache: true 
            });
            
            if (cachedData) {
              console.log('Successfully loaded agent from cache after abort');
              setAgent(cachedData);
              setLoading(false);
              setDataLoaded(true);
              isLoadingRef.current = false;
              setupRealtimeUpdates(agentId, setAgent, setLikesCount, setDownloadCount);
              return;
            }
          } catch (cacheErr) {
            console.error('Failed to load from cache after abort:', cacheErr);
          }
        }
        
        if (err.response && err.response.status === 404) {
          setError(`Agent with ID "${agentId}" not found. It may have been removed or doesn't exist.`);
        } else if (err.response && err.response.status === 400) {
          setError(`Invalid agent ID. Please check the URL and try again.`);
        } else if (err.message && err.message.includes('Network')) {
          setError('Network error. Please check your connection and try again.');
          toast.error('Network error while loading agent. Please try again.', { position: 'bottom-right' });
        } else {
          setError(`There was a problem loading this product. Please try again later.`);
          toast.error('Unexpected error while loading agent.', { position: 'bottom-right' });
        }
        setLoading(false);
        setDataLoaded(true);
        isLoadingRef.current = false;
        apiCallInProgressRef.current = false;
        
        showToast('error', `Error loading agent: ${err.message || 'Unknown error'}`, {
          icon: "❌"
        });
      }
    };
    
    loadAgent();
    
    if (agentId && !viewTracked) {
      console.log('Tracking product view for recommendations:', agentId);
      setViewTracked(true);
    }
  }, [agentId, viewTracked]);
  
  // Enhanced realtime updates setup
  useEffect(() => {
    let consecutiveErrors = 0;
    const MAX_CONSECUTIVE_ERRORS = 3;
    let intervalId = null;
    let isPollingActive = true;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page hidden, pausing polling');
        isPollingActive = false;
      } else {
        console.log('Page visible, resuming polling');
        isPollingActive = true;
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const fetchData = async () => {
      if (!isPollingActive) {
        console.log('Skipping poll because page is not visible');
        return;
      }
      
      if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
        console.log(`Stopping polling after ${consecutiveErrors} consecutive errors`);
        if (intervalId) {
          clearInterval(intervalId);
        }
        return;
      }
      
      const backendErrorKey = 'backend_error_until';
      const backendErrorUntil = parseInt(localStorage.getItem(backendErrorKey) || '0');
      const now = Date.now();
      
      if (backendErrorUntil > now) {
        console.log(`Skipping poll because backend had errors. Will retry after ${new Date(backendErrorUntil).toLocaleTimeString()}`);
        return;
      }
      
      try {
        console.log('Manual polling for agent updates');
        
        const abortController = new AbortController();
        
        let timeoutId = null;
        try {
          timeoutId = setTimeout(() => {
            console.log('Aborting agent update poll due to timeout');
            abortController.abort('Timeout');
          }, 15000);
          
          const lastPollTime = parseInt(localStorage.getItem(`last_poll_${agentId}`)) || 0;
          const shouldSkipCache = (now - lastPollTime) > 60 * 60 * 1000;
          
          if (shouldSkipCache) {
            localStorage.setItem(`last_poll_${agentId}`, now.toString());
            console.log('Polling with fresh data (skipping cache)');
          } else {
            console.log('Polling with cached data if available');
          }
          
          const agentData = await fetchAgentById(agentId, { 
            skipCache: shouldSkipCache,
            includeReviews: false, // polling never fetches reviews
            signal: abortController.signal
          });
          
          consecutiveErrors = 0;
          
          if (!agentData) {
            console.warn('No agent data returned from API');
            return;
          }
          
          setAgent(prev => {
            if (!prev) return prev;
            
            const updatedAgent = {
              ...prev,
              ...agentData,
              imageUrl: agentData.imageUrl || prev.imageUrl,
              images: (agentData.images && agentData.images.length > 0) ? 
                      agentData.images : prev.images,
              likes: agentData.likes || prev.likes,
              rating: agentData.rating || prev.rating,
              downloadCount: agentData.downloadCount || prev.downloadCount,
              reviews: (agentData.reviews && agentData.reviews.length > 0) ?
                       agentData.reviews : prev.reviews
            };
            
            return updatedAgent;
          });
          
          if (agentData.likes) {
            if (Array.isArray(agentData.likes)) {
              setLikesCount(agentData.likes.length);
            } else if (typeof agentData.likes === 'number') {
              setLikesCount(agentData.likes);
            }
          }
          
          if (agentData.downloadCount) {
            setDownloadCount(agentData.downloadCount);
          }
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
        }
      } catch (error) {
        consecutiveErrors++;
        
        if (error.name === 'AbortError' || error.code === 'ERR_CANCELED' || 
            (error.message && (error.message.includes('aborted') || error.message.includes('canceled')))) {
          console.log('Agent update poll was aborted: ', error.message);
        } else if (error.code === 'ERR_NETWORK') {
          console.log('Network error during agent poll - will retry later');
        } else if (error.response && error.response.status === 404) {
          console.error('Agent not found (404) - stopping periodic updates');
          if (intervalId) {
            clearInterval(intervalId);
          }
        } else if (error.response && error.response.status === 500) {
          console.error('Server error (500) during agent poll - pausing polls temporarily');
          localStorage.setItem(backendErrorKey, (now + 10 * 60 * 1000).toString());
        } else {
          console.error('Error polling agent data:', error);
        }
      }
    };
    
    setTimeout(fetchData, 1000);
    intervalId = setInterval(fetchData, 60 * 60 * 1000);
    
    return () => {
      console.log('Cleaning up polling interval and visibility listener');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [agentId]);
  
  // Enhanced reviews effect
  useEffect(() => {
    if (!agentId || loading) {
      return;
    }
    
    console.log('Checking if reviews need to be fetched or refreshed');
    
    const updateStoreReviews = useAgentStore.getState().updateAgentReviews;
    
    const fetchReviews = async () => {
      try {
        console.log('Checking if reviews need to be fetched or refreshed');
        
        reviewsFetchedRef.current = true;
        
        const tabChanged = sessionStorage.getItem(`last_active_tab_${agentId}`) !== activeTab;
        if (tabChanged && activeTab === 'reviews') {
          console.log('Tab changed to reviews');
          sessionStorage.setItem(`last_active_tab_${agentId}`, activeTab);
        }
        
        if (agent && agent.reviews && Array.isArray(agent.reviews)) {
          console.log(`Using ${agent.reviews.length} reviews already included in agent data`);
          
          setReviewCount(agent.reviews.length);
          
          localStorage.setItem(`last_reviews_fetch_${agentId}`, Date.now().toString());
        } else if (agent) {
          console.log('No reviews found in agent data');
          setReviewCount(0);
          
          if (!agent.reviews) {
            setAgent(prev => {
              if (!prev) return prev;
              
              return {
                ...prev,
                reviews: [],
                rating: { average: 0, count: 0 }
              };
            });
          }
          
          localStorage.setItem(`last_reviews_fetch_${agentId}`, Date.now().toString());
        } else {
          console.log('No agent data available');
        }
      } catch (err) {
        console.error('Error processing reviews:', err);
      }
    };
    
    fetchReviews();
    
  }, [agentId, loading, activeTab, user]);

  // Enhanced wishlist toggle
  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('👋 Please sign in to save your favorite agents to wishlist', {
        icon: "👋"
      });
      return;
    }
    
    try {
      const response = await toggleWishlist(agentId);
      
      if (response.success) {
        setIsWishlisted(response.isInWishlist);
        toast.success(response.isInWishlist ? 
          "💖 Added to your wishlist - find it in your profile!" : 
          "💙 Removed from your wishlist", {
          icon: response.isInWishlist ? "💖" : "💙"
        });
      } else {
        console.error("Error updating wishlist:", response.error);
        toast.error("Error updating wishlist. Please try again later.", {
          icon: "❌"
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Error updating wishlist. Please try again later.", {
        icon: "❌"
      });
    }
  };
  
  // Enhanced copy link function
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopySuccess('Link copied!');
        showToast('success', '🔗 Link copied! Share this amazing agent with others!', {
          icon: "🔗",
          autoClose: 2000
        });
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => {
        console.error('Could not copy link:', err);
        showToast('error', '❌ Could not copy link', {
          icon: "❌"
        });
      });
  };

  // Enhanced price display
  const displayPrice = (agent) => {
    if (isFreeAgent(agent)) {
      return (
        <div className="price-value-container free">
          <FaCheckCircle className="price-check" />
          <span className="price-value free">Free</span>
        </div>
      );
    }
    
    if (agent.priceDetails) {
      const { basePrice, discountedPrice, currency } = agent.priceDetails;
      const currencySymbol = currency === 'EUR' ? '€' : '$';
      
      if (discountedPrice !== undefined && discountedPrice < basePrice) {
        return (
          <>
            <span className="price-value discount-price">
              {currencySymbol}{discountedPrice.toFixed(2)}
            </span>
            <span className="original-price">
              {currencySymbol}{basePrice.toFixed(2)}
            </span>
            <span className="discount-badge">
              {Math.round((1 - discountedPrice / basePrice) * 100)}% OFF
            </span>
          </>
        );
      }
      
      if (basePrice !== undefined) {
        return (
          <span className="price-value">
            {currencySymbol}{basePrice.toFixed(2)}
          </span>
        );
      }
    }
    
    return (
      <span className="price-value">
        {formatPrice(agent.price)}
      </span>
    );
  };
  // Enhanced price validation
  const isPriceValid = () => {
    const minPrice = getMinimumPrice();
    const price = parseFloat(customPrice) || 0;
    return price >= minPrice;
  };

  // Enhanced rating formatting
  const formatRating = (rating) => {
    if (rating === undefined || rating === null) return '0.0';
    if (typeof rating === 'string') return rating;
    if (typeof rating === 'number') return rating.toFixed(1);
    return '0.0';
  };
  
  // Enhanced file details
  const getFileDetails = () => {
    if (!agent) return null;
    
    if (agent.fileType === 'pdf' || (agent.fileDetails && agent.fileDetails.type === 'pdf')) {
      const pageCount = agent.fileDetails?.pageCount || agent.pageCount || 50;
      return `📄 ${pageCount} pages (PDF)`;
    }
    
    if (agent.fileType === 'audio' || (agent.fileDetails && agent.fileDetails.type === 'audio')) {
      const duration = agent.fileDetails?.duration || agent.duration || '30 mins';
      return `🎵 ${duration} (Audio)`;
    }
    
    if (agent.fileType === 'video' || (agent.fileDetails && agent.fileDetails.type === 'video')) {
      const duration = agent.fileDetails?.duration || agent.duration || '15 mins';
      return `🎬 ${duration} (Video)`;
    }
    
    if (agent.fileType === 'template' || (agent.fileDetails && agent.fileDetails.type === 'template')) {
      return '📋 Ready-to-use template';
    }
    
    return '📦 Premium digital solution';
  };
  
  // Enhanced slider navigation
  const showSlide = (index) => {
    if (!agent || !agent.images) return;
    
    let newIndex = index;
    if (newIndex >= agent.images.length) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = agent.images.length - 1;
    }
    
    setCurrentSlide(newIndex);
  };
  
  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };
  
  const prevSlide = () => {
    showSlide(currentSlide - 1);
  };
  
  // Enhanced image URLs
  const getImageUrls = () => {
    if (!agent) return [null];
    
    const validUrls = [];
    
    if (agent.image && typeof agent.image === 'object' && agent.image.url && !validUrls.includes(agent.image.url)) {
      console.log('Adding image.url');
      validUrls.push(agent.image.url);
    }
    
    if (agent.iconUrl && !validUrls.includes(agent.iconUrl)) {
      console.log('Adding iconUrl');
      validUrls.push(agent.iconUrl);
    }
    
    if (validUrls.length === 0) {
      console.log('No valid images found, using professional placeholder');
      const title = agent.title || agent.name || 'Professional AI Agent';
      const placeholderUrl = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23667eea;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23764ba2;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23grad)"/%3E%3Ctext x="200" y="150" font-family="Arial" font-size="18" text-anchor="middle" fill="white" font-weight="bold"%3E${encodeURIComponent(title)}%3C/text%3E%3C/svg%3E`;
      validUrls.push(placeholderUrl);
    }
    
    const uniqueUrls = [...new Set(validUrls)];
    console.log(`Assembled ${uniqueUrls.length} unique image URLs for agent`);
    
    return uniqueUrls;
  };

  // Enhanced add to cart handler
  const handleAddToCart = () => {
    if (!isPriceValid()) {
      showToast('warning', '⚠️ Please enter a valid price amount', {
        icon: "⚠️"
      });
      return;
    }
    
    try {
      const product = {
        id: agent.id,
        title: agent.title,
        price: parseFloat(customPrice),
        imageUrl: agent.imageUrl || getImageUrls()[0],
        quantity: 1
      };
      
      addToCart(product);
      
      console.log('Showing cart toast with 3-second duration');
      toast.success('🛒 Added to cart! Ready to unlock this amazing agent!', {
        autoClose: 3000, // Back to 3 seconds
        position: "bottom-right",
        theme: darkMode ? "dark" : "light",
        style: {
          background: darkMode ? 'var(--background-card)' : '#ffffff',
          color: darkMode ? 'var(--text-primary)' : '#333333',
          borderRadius: '12px',
          border: `1px solid ${darkMode ? 'var(--border-color)' : '#e2e8f0'}`,
          boxShadow: darkMode ? 'var(--shadow-lg)' : '0 10px 25px rgba(0, 0, 0, 0.15)',
          fontSize: '14px',
          fontWeight: '600',
          fontFamily: 'var(--font-family)'
        }
      });
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      showToast('error', '❌ Could not add item to cart. Please try again.', {
        icon: "❌"
      });
    }
  };

  // Enhanced image load handler
  const handleImageLoad = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      const ratio = naturalWidth / naturalHeight;
      setImageAspectRatio(ratio < 1 ? 'portrait' : 'landscape');
    }
  };
  
  // Enhanced like update handler
  const handleLikeUpdate = (newLikesCount) => {
    setLikesCount(newLikesCount);
    
    setAgent(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        likes: typeof prev.likes === 'number' ? newLikesCount : 
               Array.isArray(prev.likes) ? [...Array(newLikesCount)].map(() => ({})) : newLikesCount
      };
    });
  };

  // Enhanced mobile download choice dialog
  const showMobileDownloadChoice = (downloadUrl, filename) => {
    toast.dismiss();
    
    toast(
      ({ closeToast }) => (
        <div className="mobile-download-choice">
          <div className="choice-header">
            <span role="img" aria-label="mobile">📱</span>
            <h4>How would you like to get this file?</h4>
          </div>
          <div className="choice-options">
            <button 
              className="choice-button open-button"
              onClick={() => {
                closeToast();
                window.open(downloadUrl, '_blank', 'noopener,noreferrer');
                showToast('info', '📱 File opened in new tab. Use "Download" or "Save As" from your browser menu.', {
                  autoClose: 6000
                });
              }}
            >
              <span role="img" aria-label="open">👁️</span>
              Open in Browser
            </button>
            <button 
              className="choice-button download-button"
              onClick={() => {
                closeToast();
                handleMobileDownload(downloadUrl, filename);
              }}
            >
              <span role="img" aria-label="download">📥</span>
              Download File
            </button>
          </div>
          <div className="choice-note">
            <small>💡 Tip: "Open in Browser" lets you view the file, "Download File" tries to save it directly</small>
          </div>
        </div>
      ),
      {
        position: "bottom-center",
        autoClose: false,
        closeOnClick: false,
        draggable: true,
        closeButton: true,
        className: 'mobile-download-choice-toast',
        toastId: 'mobile-download-choice'
      }
    );
  };

  // Enhanced mobile download handler
  const handleMobileDownload = async (downloadUrl, filename) => {
    try {
      console.log('[MOBILE] Attempting direct download for mobile');
      console.log('[MOBILE] Download URL:', downloadUrl);
      console.log('[MOBILE] Filename:', filename);
      
      // Try to use the backend proxy for better mobile compatibility
      const proxyUrl = `/api/agents/${agentId}/download?url=${encodeURIComponent(downloadUrl)}`;
      console.log('[MOBILE] Proxy URL:', proxyUrl);
      
      // Test the proxy URL first
      try {
        const testResponse = await fetch(proxyUrl, { method: 'HEAD' });
        console.log('[MOBILE] Proxy test response:', testResponse.status, testResponse.statusText);
        
        if (!testResponse.ok) {
          throw new Error(`Proxy test failed: ${testResponse.status} ${testResponse.statusText}`);
        }
      } catch (testError) {
        console.error('[MOBILE] Proxy test failed:', testError);
        throw new Error(`Proxy unavailable: ${testError.message}`);
      }
      
      // Create a hidden link and trigger download
      const link = document.createElement('a');
      link.href = proxyUrl;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 100);
      
      showToast('success', '📥 Download started! Check your downloads folder.', {
        autoClose: 3000
      });
      
    } catch (error) {
      console.error('[MOBILE] Download failed:', error);
      
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(downloadUrl);
        showToast('warning', '📋 Download URL copied to clipboard. Paste it in a new tab to download.', {
          autoClose: 8000
        });
      } catch (clipboardError) {
        showToast('error', '❌ Download failed. Please try again or contact support.', {
          autoClose: 5000
        });
      }
    }
  };

  // Enhanced direct download handler
  const handleDirectDownload = async () => {
    // Free agents don't require authentication - removed this restriction
    // if (!user) {
    //   showToast('info', '👋 Please sign in to download this amazing free agent!', {
    //     icon: "👋",
    //     autoClose: 4000
    //   });
    //   return;
    // }
    
    try {
      setLoading(true);
      console.log('Starting download process for agent:', agentId);
      
      const downloadResult = await downloadFreeAgent(agentId);
      console.log('Download API result:', downloadResult);
      
      if (downloadResult.success) {
        if (downloadResult.agent) {
          console.log('Using agent data from download response to update UI');
          
          setAgent(prev => ({
            ...prev,
            ...downloadResult.agent,
            images: prev.images || [],
            imageUrl: downloadResult.agent.imageUrl || prev.imageUrl,
            downloadCount: downloadResult.agent.downloadCount || (prev.downloadCount + 1)
          }));
          
          if (downloadResult.agent.downloadCount) {
            setDownloadCount(downloadResult.agent.downloadCount);
          } else {
            setDownloadCount(prev => prev + 1);
          }
          
          if (downloadResult.agent.likes) {
            if (Array.isArray(downloadResult.agent.likes)) {
              setLikesCount(downloadResult.agent.likes.length);
            } else if (typeof downloadResult.agent.likes === 'number') {
              setLikesCount(downloadResult.agent.likes);
            }
          }
        } else {
          console.log('No agent data in download response, incrementing download count locally');
          setDownloadCount(prev => prev + 1);
        }
        
        toast.success('🎉 Download successful! Check your email for the files.', {
          position: "bottom-right",
          autoClose: 3000, // Longer duration for important messages
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: darkMode ? "dark" : "light",
          icon: "🎉",
          style: {
            background: darkMode ? 'var(--background-card)' : '#ffffff',
            color: darkMode ? 'var(--text-primary)' : '#333333',
            borderRadius: '12px',
            border: `1px solid ${darkMode ? 'var(--border-color)' : '#e2e8f0'}`,
            boxShadow: darkMode ? 'var(--shadow-lg)' : '0 10px 25px rgba(0, 0, 0, 0.15)',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'var(--font-family)'
          }
        });
        
        let downloadUrl = downloadResult.downloadUrl || 
                         downloadResult.agent?.downloadUrl || 
                         downloadResult.agent?.fileUrl || 
                         downloadResult.agent?.jsonFile?.url;
        
        console.log('Checking for download URL in response:', {
          topLevel: downloadResult.downloadUrl,
          agentDownloadUrl: downloadResult.agent?.downloadUrl,
          agentFileUrl: downloadResult.agent?.fileUrl,
          jsonFileUrl: downloadResult.agent?.jsonFile?.url,
          finalUrl: downloadUrl
        });
        
        console.log('Full download result:', downloadResult);
        console.log('Agent data from download result:', downloadResult.agent);
        
        if (downloadUrl && typeof downloadUrl === 'string' && downloadUrl.trim() !== '') {
          try {
            console.log('Download URL found:', downloadUrl);
            
            // Validate download URL format
            let validUrl;
            try {
              validUrl = new URL(downloadUrl);
              console.log('Download URL is valid:', validUrl.href);
              
              // Additional validation
              if (!['https:'].includes(validUrl.protocol)) {
                throw new Error('Only HTTPS URLs are allowed for security');
              }
              
              if (!validUrl.hostname.includes('storage.googleapis.com') && 
                  !validUrl.hostname.includes('firebasestorage.app')) {
                console.warn('Non-Google Storage URL detected, may have CORS issues');
              }
              
            } catch (urlError) {
              console.error('Invalid download URL format:', downloadUrl, urlError);
              throw new Error(`Invalid download URL format: ${urlError.message}`);
            }
            
            // Generate filename
            const urlParts = downloadUrl.split('/');
            let filename = urlParts[urlParts.length - 1];
            if (filename.includes('?')) {
              filename = filename.split('?')[0];
            }
            if (!filename || !filename.includes('.')) {
              filename = `${agent.title || 'agent'}.json`;
            }
            if (!filename.endsWith('.json')) {
              filename = filename.replace(/\.[^/.]+$/, '') + '.json';
            }
            
            const isGoogleStorage = downloadUrl.includes('storage.googleapis.com') || downloadUrl.includes('firebasestorage.app');
            const hasGoogleAuth = downloadUrl.includes('GoogleAccessId') || downloadUrl.includes('Signature');
            
            console.log('URL Analysis:', {
              isGoogleStorage,
              hasGoogleAuth,
              url: downloadUrl
            });
            
            if (isGoogleStorage) {
              console.log('Using backend proxy for Google Storage download to avoid CORS');
              
              try {
                // Use the correct proxy endpoint with the file URL as a query parameter
                const proxyUrl = `/api/agents/${agentId}/download?url=${encodeURIComponent(downloadUrl)}`;
                console.log('Proxy URL:', proxyUrl);

                // Universal download approach that works on both mobile and desktop
                console.log('Creating download link for all devices');
                
                const link = document.createElement('a');
                link.href = proxyUrl;
                link.download = filename;
                
                // For mobile compatibility, add additional attributes
                if (isMobileDevice()) {
                  console.log('Mobile device detected, showing download choice dialog');
                  
                  // Show choice dialog for mobile users
                  showMobileDownloadChoice(downloadUrl, filename);
                  return; // Exit early for mobile
                } else {
                  // Test the proxy URL first for desktop too
                  try {
                    console.log('[DESKTOP] Testing proxy URL:', proxyUrl);
                    const testResponse = await fetch(proxyUrl, { 
                      method: 'HEAD',
                      mode: 'cors',
                      credentials: 'omit'
                    });
                    console.log('[DESKTOP] Proxy test response:', testResponse.status, testResponse.statusText);
                    console.log('[DESKTOP] Proxy test headers:', Object.fromEntries(testResponse.headers.entries()));
                    
                    if (!testResponse.ok) {
                      const errorText = await testResponse.text().catch(() => 'No error details');
                      console.error('[DESKTOP] Proxy test error details:', errorText);
                      throw new Error(`Proxy test failed: ${testResponse.status} ${testResponse.statusText} - ${errorText}`);
                    }
                  } catch (testError) {
                    console.error('[DESKTOP] Proxy test failed:', testError);
                    throw new Error(`Proxy unavailable: ${testError.message}`);
                  }
                  
                  link.style.display = 'none';
                  document.body.appendChild(link);
                  link.click();
                  console.log('Desktop download link clicked');
                  
                  showToast('success', '📥 Download started! Check your downloads folder.', {
                    autoClose: 3000
                  });
                  
                  setTimeout(() => {
                    if (document.body.contains(link)) {
                      document.body.removeChild(link);
                    }
                  }, 100);
                }
                
              } catch (proxyError) {
                console.error('Backend proxy download failed:', proxyError);
                
                // For Google Storage URLs with auth, try direct download as fallback
                if (hasGoogleAuth) {
                  console.log('Proxy failed for authenticated Google Storage URL, trying direct download');
                  
                  try {
                    // Try direct download for authenticated Google Storage URLs
                    const response = await fetch(downloadUrl, {
                      method: 'GET',
                      mode: 'cors',
                      credentials: 'omit',
                      headers: {
                        'Accept': 'application/json, application/octet-stream, */*'
                      }
                    });
                    
                    if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
                    }
                    
                    console.log('Direct download successful, creating blob');
                    
                    const responseText = await response.text();
                    const blob = new Blob([responseText], { 
                      type: 'application/octet-stream'
                    });
                    
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    link.style.display = 'none';
                    
                    document.body.appendChild(link);
                    link.click();
                    
                    setTimeout(() => {
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    }, 100);
                    
                    showToast('success', '📥 File downloaded successfully via direct method!', {
                      autoClose: 3000
                    });
                    
                    return; // Exit successfully
                  } catch (directError) {
                    console.error('Direct download also failed:', directError);
                    // Continue to show proxy error
                  }
                }
                
                // Show specific error toast for proxy failure
                showToast('error', '❌ Download failed: Server proxy error. Please try again or contact support.', {
                  autoClose: 5000
                });
                
                // Fall back to direct download
                console.log('Falling back to direct download method');
                throw new Error('Backend proxy download failed');
              }
            } else {
              console.log('Attempting direct download for non-Google Storage URL');
              
              const response = await fetch(downloadUrl, {
                method: 'GET',
                mode: 'cors',
                credentials: 'omit',
                headers: {
                  'Accept': 'application/json, application/octet-stream, */*'
                }
              });
              
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
              }
              
              console.log('Fetch successful, creating blob for download');
              
              const responseText = await response.text();
              
              const blob = new Blob([responseText], { 
                type: 'application/octet-stream'
              });
              
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = filename;
              link.style.display = 'none';
              
              document.body.appendChild(link);
              link.click();
              
              setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              }, 100);
              
              console.log('Download completed successfully via direct fetch');
              showToast('success', '📥 File downloaded successfully!', {
                autoClose: 3000
              });
            }
            
          } catch (fetchError) {
            console.error('Primary download method failed:', fetchError);
            
            // Show specific error toast for fetch failure
            let fetchErrorMessage = '❌ Download failed';
            
            if (fetchError.message.includes('HTTP error')) {
              fetchErrorMessage = '🌐 Network error: Unable to download file. Please try again.';
            } else if (fetchError.message.includes('CORS')) {
              fetchErrorMessage = '🔒 CORS error: Using fallback download method.';
            } else {
              fetchErrorMessage = `❌ Download error: ${fetchError.message}`;
            }
            
            showToast('warning', fetchErrorMessage, {
              autoClose: 5000
            });
            
            try {
              console.log('Using final fallback method - opening download URL');
              
              // Mobile-friendly fallback
              if (isMobileDevice()) {
                console.log('Mobile fallback: showing choice dialog');
                showMobileDownloadChoice(downloadUrl, filename);
              } else {
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = filename;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.style.display = 'none';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showToast('info', '📥 Download link opened in new tab. If the file displays instead of downloading, right-click and select "Save As..." to download manually.', {
                  autoClose: 10000
                });
              }
              
            } catch (finalError) {
              console.error('All download methods failed:', finalError);
              
              showToast('warning', '⚠️ Automatic download failed due to browser security. Here is the direct download link: ' + downloadUrl + ' - Please copy and paste this URL in a new tab to download the file.', {
                autoClose: 15000
              });
            }
          }
        } else {
          console.warn('No valid download URL provided in response');
          console.warn('Download result:', downloadResult);
          
          showToast('error', '❌ No download file found. The agent might not have a file attached. Please contact support.', {
            autoClose: 8000
          });
        }
      } else {
        const errorMessage = downloadResult.error || downloadResult.message || 'Download failed';
        console.error('Download API returned error:', errorMessage);
        
        // Show specific error toast based on the error type
        let toastMessage = '❌ Download failed';
        let toastType = 'error';
        
        if (errorMessage.includes('not free')) {
          toastMessage = '💰 This agent requires purchase. Please buy it first.';
          toastType = 'warning';
        } else if (errorMessage.includes('not found')) {
          toastMessage = '🔍 Agent not found. Please refresh the page and try again.';
          toastType = 'error';
        } else if (errorMessage.includes('Network error')) {
          toastMessage = '🌐 Network error. Please check your connection and try again.';
          toastType = 'error';
        } else if (errorMessage.includes('Server error')) {
          toastMessage = '⚡ Server error. Please try again in a few moments.';
          toastType = 'error';
        } else {
          toastMessage = `❌ ${errorMessage}`;
          toastType = 'error';
        }
        
        showToast(toastType, toastMessage, {
          autoClose: 6000
        });
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error downloading free agent:', error);
      
      let userMessage = '❌ Download failed. ';
      if (error.message.includes('CORS')) {
        userMessage += 'Cross-origin request blocked. Please try again or contact support.';
      } else if (error.message.includes('Network')) {
        userMessage += 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('404')) {
        userMessage += 'File not found. Please contact support.';
      } else if (error.message.includes('403')) {
        userMessage += 'Access denied. Please ensure you are signed in and try again.';
      } else {
        userMessage += error.message || 'Unknown error occurred.';
      }
      
      showToast('error', userMessage, {
        icon: "❌",
        autoClose: 8000
      });
    } finally {
      setLoading(false);
    }
  };

  // Enhanced minimum price getter
  const getMinimumPrice = () => {
    if (!agent) return 0;
    
    if (agent.priceDetails) {
      if (agent.priceDetails.minimumPrice !== undefined) {
        return agent.priceDetails.minimumPrice;
      }
      
      if (agent.priceDetails.basePrice !== undefined) {
        return agent.priceDetails.basePrice;
      }
      
      if (agent.priceDetails.discountedPrice !== undefined) {
        return agent.priceDetails.discountedPrice;
      }
    }
    
    if (typeof agent.price === 'number') {
      return agent.price;
    }
    
    if (typeof agent.price === 'string') {
      if (agent.price === 'Free' || 
          agent.price === 'free' || 
          agent.price === '$0' || 
          agent.price === '0') {
        return 0;
      }
      
      const parsed = parseFloat(agent.price.replace(/[^0-9.]/g, '')) || 0;
      return parsed;
    }
    
    if (agent.price && typeof agent.price === 'object') {
      if (agent.price.basePrice !== undefined) {
        return agent.price.basePrice;
      }
    }
    
    return 0;
  };

  // Enhanced loading state
  if (loading) {
    return (
      <div className={`agent-detail-container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="loading-container fade-in">
          <div className="loading-spinner"></div>
          <h3>Loading Amazing Agent...</h3>
          <p>Preparing something special for you ✨</p>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (error || !agent) {
    return (
      <div className={`agent-detail-container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="error-container fade-in">
          <h2>Oops! Agent Not Found</h2>
          <p>{error || 'We couldn\'t find the agent you\'re looking for. It might have been moved or doesn\'t exist.'}</p>
          <p>Don't worry - we have many other amazing agents waiting for you!</p>
          <Link to="/agents" className="back-button">
            <FaRocket style={{ marginRight: '8px' }} />
            Explore All Agents
          </Link>
        </div>
      </div>
    );
  }
  
  const imageUrls = getImageUrls();
  const minPrice = getMinimumPrice();
  const fileDetails = getFileDetails();

  return (
    <div className={`agent-detail-container ${darkMode ? 'dark-mode' : ''}`}>
    
      <div className="agent-detail-breadcrumb">
        <Link to="/">Home</Link> / <Link to="/agents">Agents</Link> / <span>{agent.title}</span>
      </div>

      <div className="agent-detail-content">
        {/* Left Column: Image and Description */}
        <div className="left-column slide-in-left">
          {/* Enhanced Agent Image Section */}
          <div className="image-slider-section">
            <div className="image-slider" ref={sliderRef}>
              <div className="slider-container">
                <div className="slide">
                  <img 
                    ref={imageRef}
                    src={n8nWorkflowImg} 
                    alt={agent.title} 
                    className="slide-image" 
                    onLoad={handleImageLoad}
                    data-aspect={imageAspectRatio}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Agent Description Section */}
          <div className={`agent-description-section ${darkMode ? 'dark-mode' : ''}`}>
            <DescriptionIntroduction darkMode={darkMode} />
            <div className="agent-description">
              <div className="description-details" style={{ whiteSpace: 'pre-line' }}>
                {agentDescription}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Agent Info and Purchase Section */}
        <div className="agent-info-section slide-in-right">
          <div className="agent-header">
            <h1 className="agent-title">{agentTitle}</h1>
            
            {/* Enhanced Categories Display */}
            {agentCategories.length > 0 && (
              <div className="agent-categories">
                {agentCategories.map((category) => (
                  <CategoryBadge 
                    key={category} 
                    category={category} 
                    onClick={handleCategoryClick}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Enhanced Price and Buy Button */}
          <div className={`price-purchase-container ${darkMode ? 'dark-mode' : ''}`}>
            {isFreeAgent(agent) ? (
              <div className="free-download-container">
                <div className="free-agent-notice">
                  <span className="free-label">🎉 Free</span>
                  <p className="free-description">This premium agent is available at no cost!</p>
                </div>
                <button 
                  className="download-now-btn"
                  onClick={handleDirectDownload}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaDownload style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaDownload style={{ marginRight: '8px' }} />
                      Download Now
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="fixed-price-container">
                <div className="price-display-section">
                  <div className="price-value-container paid">
                    {displayPrice(agent)}
                  </div>
                </div>
                
                {agent?.downloadProtected && agent?.entitled ? (
                  <div style={{
                    marginTop: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--success-color)'
                  }}>
                    Included with your All‑Access subscription · Regular price {formatPrice(minPrice)}
                  </div>
                ) : (
                  <button 
                    className="buy-now-btn"
                    onClick={handleAddToCart}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaShoppingCart style={{ marginRight: '8px' }} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaShoppingCart style={{ marginRight: '8px' }} />
                        Buy for {formatPrice(minPrice)}
                      </>
                    )}
                  </button>
                )}
                
                {/* Subscription CTA for all-access */}
                <div style={{ marginTop: '12px' }}>
                  {agent?.downloadProtected && !agent?.entitled ? (
                    <div className="allaccess-cta">
                      <div className="allaccess-cta-title">Included in All‑Access</div>
                      <div className="allaccess-cta-subtitle">Unlock every premium agent for just €50/month</div>
                      <Link to="/subscribe" className="allaccess-cta-button">Get All‑Access (€50/mo)</Link>
                    </div>
                  ) : agent?.downloadProtected && agent?.entitled ? (
                    <div style={{ marginTop: 8 }}>
                      <button
                        className="download-now-btn"
                        onClick={async () => {
                          try {
                            const res = await createSubscriberAccessToken(agent.id);
                            if (res?.success && res.downloadUrl) {
                              const link = document.createElement('a');
                              link.href = res.downloadUrl;
                              link.target = '_blank';
                              document.body.appendChild(link);
                              link.click();
                              setTimeout(() => document.body.removeChild(link), 100);
                            } else {
                              toast.error(res?.error || 'Could not generate download link');
                            }
                          } catch (e) {
                            toast.error(e?.response?.data?.error || e.message || 'Failed to start download');
                          }
                        }}
                      >
                        Download (Subscriber)
                      </button>
                    </div>
                  ) : null}
                </div>
                
                {agent.priceDetails && agent.priceDetails.basePrice > 0 && 
                 agent.priceDetails.discountedPrice < agent.priceDetails.basePrice && (
                  <p className="discount-note">
                    <span className="discount-badge">
                      🔥 {Math.round((1 - agent.priceDetails.discountedPrice / agent.priceDetails.basePrice) * 100)}% OFF
                    </span>
                    <span className="original-price-text">
                      Was ${agent.priceDetails.basePrice.toFixed(2)}
                    </span>
                  </p>
                )}
              </div>
            )}
            
            <div className="downloads-info">
              <FaDownload className="download-icon" />
              <span className="download-count">{downloadCount.toLocaleString()} downloads</span>
            </div>
          </div>
          
          {/* Enhanced Meta Information */}
          <div className="agent-meta-row">
            <div className="creator-info">
              <span className="by-text">Created by </span>
              <a href="#" className="creator-name">
                {agent.creator?.username || agent.creator?.name || agent.creator?.role || "AI Wave Rider Team"}
              </a>
            </div>
            
            <div className="rating-display">
              <div className="stars">
                <StarRating rating={agentRatingValue} />
              </div>
              <span className="rating-count">
                {reviewCount > 0 ? `(${reviewCount})` : '(Be the first to review!)'}
              </span>
              <LikeButton 
                agentId={agentId} 
                initialLikes={likesCount} 
                onLikeUpdate={handleLikeUpdate} 
              />
            </div>
          </div>
          
          {/* Enhanced What You Get Section */}
          <DeliverablesSection 
            deliverables={deliverables} 
            darkMode={darkMode} 
            isFreeAgent={isFreeAgent(agent)}
          />
          
          {/* Enhanced Business Value Section */}
          <BusinessValueSection businessValue={businessValue} darkMode={darkMode} />
          
          {/* Enhanced File Details */}
          <div className="file-details-section">
            <div className="file-info">
              <span className="file-detail">{fileDetails}</span>
            </div>
          </div>
          
          {/* Enhanced Agent Actions */}
          <div className="agent-actions">
            <button 
              className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isWishlisted ? <FaHeart /> : <FaRegHeart />}
              <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
            </button>
            
            <button className="copy-link-btn" onClick={handleCopyLink} title="Copy link">
              <FaLink />
              <span>{copySuccess || 'Copy Link'}</span>
            </button>
            
            <button 
              className="share-btn" 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: agent.title,
                    text: `Check out this amazing AI agent: ${agent.description}`,
                    url: window.location.href,
                  })
                  .then(() => {
                    showToast('success', '🌟 Successfully shared this amazing agent!', {
                      icon: "🌟",
                      autoClose: 2500
                    });
                  })
                  .catch((error) => {
                    console.error('Error sharing:', error);
                    handleCopyLink();
                  });
                } else {
                  handleCopyLink();
                }
              }}
              title="Share this agent"
            >
              <FaShare />
              <span>Share</span>
            </button>
          </div>
          
          {/* Enhanced Guarantee Info */}
          {/* <div className="guarantee-info">
            <p>
              <FaShieldAlt style={{ marginRight: '8px' }} />
              30-day money back guarantee
            </p>
          </div> */}
        </div>
      </div>

      {/* Enhanced Tabs for different sections */}
      <div className="agent-detail-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaLightbulb style={{ marginRight: '6px' }} />
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <FaStar style={{ marginRight: '6px' }} />
          Reviews ({reviewCount})
        </button>
        <button 
          className={`tab-button ${activeTab === 'related' ? 'active' : ''}`}
          onClick={() => setActiveTab('related')}
        >
          <FaGem style={{ marginRight: '6px' }} />
          Related Items
        </button>
      </div>
      
      {/* Enhanced Tab content */}
      <div className="tab-content fade-in">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-content">
              {agent.longDescription ? (
                <div className="overview-item">
                  <div className="overview-header">
                    <div>
                      <div className="overview-title">
                        <FaTrophy style={{ marginRight: '8px' }} />
                        About This Premium Agent
                      </div>
                      <div className="overview-meta">
                        Premium AI Solution
                      </div>
                    </div>
                    <div className="overview-actions">
                      <FaGem style={{ color: 'var(--primary-color)' }} />
                    </div>
                  </div>
                  <div className="overview-text">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(agent.longDescription) 
                      }} 
                    />
                  </div>
                </div>
              ) : (
                <div className="overview-item">
                  <div className="overview-header">
                    <div>
                      <div className="overview-title">
                        <FaTrophy style={{ marginRight: '8px' }} />
                        About This Premium Agent
                      </div>
                      <div className="overview-meta">
                        Premium AI Solution
                      </div>
                    </div>
                    <div className="overview-actions">
                      <FaGem style={{ color: 'var(--primary-color)' }} />
                    </div>
                  </div>
                  <div className="overview-text">
                    <p>
                      {agent.description || 'This carefully crafted AI agent represents the pinnacle of automation technology. Designed with precision and tested extensively, it delivers exceptional performance and reliability that exceeds industry standards.'}
                    </p>
                    <p>
                      <strong>🎯 Perfect for:</strong> Professionals seeking to automate complex workflows, enhance productivity, and achieve superior results with cutting-edge AI technology.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className="reviews-tab">
            <CommentSection 
              agentId={agentId} 
              existingReviews={agent.reviews || []} 
              onReviewsLoaded={(count) => setReviewCount(count)}
              skipExternalFetch={true}
              onReviewAdded={(newReview, newCount, newAvg) => {
                setAgent(prev => {
                  const prevReviews = Array.isArray(prev?.reviews) ? prev.reviews : [];
                  const merged = [...prevReviews, newReview];
                  return {
                    ...prev,
                    reviews: merged,
                    reviewCount: typeof newCount === 'number' ? newCount : merged.length,
                    rating: {
                      ...(prev?.rating || {}),
                      average: typeof newAvg === 'number' ? newAvg : (merged.reduce((a, r) => a + (Number(r.rating) || 0), 0) / merged.length)
                    }
                  };
                });
              }}
              onReviewDeleted={(deletedId, newCount, newAvg) => {
                setAgent(prev => {
                  const prevReviews = Array.isArray(prev?.reviews) ? prev.reviews : [];
                  const filtered = prevReviews.filter(r => r.id !== deletedId && r._id !== deletedId);
                  const count = typeof newCount === 'number' ? newCount : filtered.length;
                  const avg = typeof newAvg === 'number' ? newAvg : (count > 0 ? (filtered.reduce((a, r) => a + (Number(r.rating) || 0), 0) / count) : 0);
                  return {
                    ...prev,
                    reviews: filtered,
                    reviewCount: count,
                    rating: {
                      ...(prev?.rating || {}),
                      average: avg
                    }
                  };
                });
              }}
            />
          </div>
        )}
        
        {activeTab === 'related' && (
          <div className="related-tab">
            <h3 className={`section-heading ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              <FaGem style={{ marginRight: '12px' }} />
              More Amazing Agents
            </h3>
            {agent.relatedAgents && agent.relatedAgents.length > 0 ? (
              <div className="related-agents-grid">
                {agent.relatedAgents.map(relatedAgent => (
                  <Link 
                    key={relatedAgent.id} 
                    to={`/agents/${relatedAgent.id}`} 
                    className="related-agent-card"
                  >
                    <div className="related-image-container">
                      <img 
                        src={relatedAgent.imageUrl || n8nWorkflowImg} 
                        alt={relatedAgent.title || 'Related Agent'} 
                        onError={(e) => {
                          e.target.src = n8nWorkflowImg;
                        }}
                      />
                    </div>
                    <div className="related-info">
                      <h4>{relatedAgent.title}</h4>
                      <div className="related-meta">
                        <div className="related-price">
                          {formatPrice(relatedAgent.price)}
                        </div>
                        <div className="related-rating">
                          <FaStar className="star-icon" />
                          <span>{formatRating(relatedAgent.rating?.average || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="no-related">
                <FaRocket style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--text-light)' }} />
                <p>
                  🚀 This agent is so unique, we're still finding its perfect companions! 
                  <br />
                  Check back soon for related recommendations.
                </p>
                <Link to="/agents" className="back-button" style={{ marginTop: '16px' }}>
                  Explore All Agents
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDetail;
