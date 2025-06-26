import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaDownload, FaHeart, FaRegHeart, FaLink, FaArrowLeft, FaArrowRight, FaThumbsUp, FaComment, FaShare, FaCheckCircle, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { 
  toggleWishlist, 
  toggleAgentLike,
  getAgentReviews,
  addAgentReview,
  deleteAgentReview,
  checkCanReviewAgent,
  downloadFreeAgent,
  incrementAgentDownloadCount,
  recordAgentDownload,
  fetchAgentById,
  getUserLikeStatus

} from '../api/marketplace/agentApi.js';
import { useCart } from '../contexts/CartContext.jsx';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { trackProductView } from '../services/recommendationService.js';
import { formatPrice } from '../utils/priceUtils.js';
import useAgentStore from '../store/agentStore.js';
import DOMPurify from 'dompurify';
import { toast } from 'react-toastify';
import './AgentDetailPage.css';
// Add debug logger
const debug = (message, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AgentDetail] ${message}`, data);
  }
};

// Star Rating Component
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
        >
          {star <= ratingValue ? (
            <FaStar className={`star-filled ${sizeClass}`} />
          ) : (
            <FaRegStar className={`star-empty ${sizeClass}`} />
          )}
        </span>
      ))}
    </div>
  );
};

// Like Button Component
const LikeButton = ({ agentId, initialLikes = 0, onLikeUpdate }) => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useTheme();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [initialStateLoaded, setInitialStateLoaded] = useState(false);
  const checkIntervalRef = useRef(null);

  // Replace the Firebase onSnapshot listeners with direct document fetches
  useEffect(() => {
    // Initialize like count properly - handle array or number
    if (Array.isArray(initialLikes)) {
      setLikeCount(initialLikes.length);
    } else if (typeof initialLikes === 'number') {
      setLikeCount(initialLikes);
    }
    
    // Check if the current user has liked this agent - only once, not with a listener
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
          // If initialLikes is an array, we can check if the user's ID is in it
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
          
          // Check if we have a cached like status
          try {
            const cachedStatus = localStorage.getItem(`like_status_${agentId}`);
            if (cachedStatus) {
              const parsedStatus = JSON.parse(cachedStatus);
              const cacheTime = parsedStatus._cacheTime || 0;
              const now = Date.now();
              
              // Use cache if it's less than 5 minutes old
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

          // If we don't have cached data, fetch from API
          console.log('No valid cached like data, fetching from API');
          const likeStatus = await getUserLikeStatus(agentId);
          const isLiked = likeStatus.liked || false;
          console.log(`API check: User has liked agent: ${isLiked}`);
          setLiked(isLiked);
          
          // Update like count if available
          if (likeStatus.likesCount !== undefined) {
            setLikeCount(likeStatus.likesCount);
          }
          
          // Cache the like status with timestamp
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
          // Fallback to not liked state on error
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

  // Toast configuration for consistent, appealing notifications
  const showToast = (type, message, options = {}) => {
    const defaultOptions = {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      icon: true
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    switch (type) {
      case 'success':
        toast.success(message, mergedOptions);
        break;
      case 'error':
        toast.error(message, mergedOptions);
        break;
      case 'info':
        toast.info(message, mergedOptions);
        break;
      case 'warning':
        toast.warning(message, mergedOptions);
        break;
      default:
        toast(message, mergedOptions);
    }
  };
  
  // Custom confirm toast with action buttons
  const showConfirmToast = () => {
    // Clear any existing toasts to prevent stacking
    toast.dismiss();
    console.log("Showing unlike confirmation dialog");
    
    // Create a custom toast with action buttons
    toast(
      ({ closeToast }) => (
        <div className="confirm-toast-container">
          <div className="confirm-toast-message">
            <span role="img" aria-label="question">❓</span> Remove your like from this agent?
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
              Cancel
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
        toastId: 'unlike-confirmation' // Ensure unique ID
      }
    );
  };
  
  // Process like/unlike by letting the server determine the action
  const processLikeToggle = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      console.log('Sending toggle like request to server');
      const response = await toggleAgentLike(agentId);
      console.log('Server response:', response);
      
      if (response.success) {
        // Use the server's response to determine the new state
        const didLike = response.liked;
        
        // Set liked state based on the server response
        setLiked(didLike);
        
        // If the API returns the updated like count, use it
        if (response.likesCount !== undefined) {
          setLikeCount(response.likesCount);
          if (onLikeUpdate) {
            onLikeUpdate(response.likesCount);
          }
        }
        
        // Show appropriate notification based on server response
        // Use toast directly to ensure notification is shown
        if (didLike) {
          toast.success('❤️ Added your like!', {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            icon: "❤️",
            toastId: 'like-added' // Ensure uniqueness
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
            icon: "💔",
            toastId: 'like-removed' // Ensure uniqueness
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
          toastId: 'like-error' // Ensure uniqueness
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
        toastId: 'like-error' // Ensure uniqueness
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
    
    // If user has already liked and is trying to like again, show confirm toast
    if (liked) {
      console.log("Agent is liked, showing confirmation dialog");
      showConfirmToast();
      return;
    } else {
      console.log("Agent is not liked, directly toggling like");
    }
    
    // Otherwise proceed with toggling the like
    processLikeToggle();
  };
  
  return (
    <button 
      className={`like-button ${liked ? 'liked' : ''} ${isLoading ? 'loading' : ''}`}
      onClick={handleLikeToggle}
      disabled={isLoading || !initialStateLoaded}
    >
      {liked ? <FaHeart className="heart-icon" /> : <FaRegHeart className="heart-icon" />}
      <span className="like-count">{likeCount}</span>
    </button>
  );
};
const CommentSection = ({ agentId, existingReviews = [], onReviewsLoaded, skipExternalFetch = false }) => {
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
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [showSignUpPopup, setShowSignUpPopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [prevAuthState, setPrevAuthState] = useState(false);
  
  // Check if user is an admin
  const isAdmin = useMemo(() => {
    if (!user) return false;
    return user.roles?.includes('admin') || user.isAdmin || user.role === 'admin' || 
           user.email?.endsWith('@aiwaverider.com') || user.uid === '0pYyiwNXvSZdoRa1Smgj3sWWYsg1';
  }, [user]);
  
  // Process reviews and avoid redundant API calls
  useEffect(() => {
    const processReviews = async () => {
      try {
        setIsLoadingComments(true);
        
        // First check if we already have reviews from the parent component
        if (existingReviews && Array.isArray(existingReviews) && existingReviews.length > 0) {
          console.log('Using existing reviews from agent data:', existingReviews.length);
          
          // Sort by date descending
          const sortedReviews = [...existingReviews].sort((a, b) => {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          });
          
          setComments(sortedReviews);
          
          // Notify parent component about review count
          if (onReviewsLoaded) {
            console.log('Setting initial review count to:', sortedReviews.length);
            onReviewsLoaded(sortedReviews.length);
          }
          
          // Check if current user has already reviewed (only if authenticated)
          if (user) {
            const userReview = sortedReviews.find(review => review.userId === user.uid);
            setHasUserReviewed(!!userReview);
          }
        } else if (!skipExternalFetch) {
          // Only fetch reviews if we don't have them already and we're not skipping external fetch
          console.log(`No existing reviews, loading reviews for agent ${agentId}`);
          try {
            // Always request fresh reviews by setting skipCache to true
            const response = await getAgentReviews(agentId, { 
              skipCache: true, 
              timestamp: Date.now() 
            });
            console.log('Received FRESH reviews from API:', response);
            
            if (response && Array.isArray(response)) {
              // Sort by date descending
              const sortedReviews = response.sort((a, b) => {
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
              });
              
              // Update the local state
              setComments(sortedReviews);
              
              // IMPORTANT: Update the Zustand store to keep everything in sync
              const updateStoreReviews = useAgentStore.getState().updateAgentReviews;
              updateStoreReviews(agentId, sortedReviews);
              
              // Notify parent component about review count
              if (onReviewsLoaded) {
                console.log('Setting initial review count to:', sortedReviews.length);
                onReviewsLoaded(sortedReviews.length);
              }
              
              // Check if current user has already reviewed (only if authenticated)
              if (user) {
                const userReview = sortedReviews.find(review => review.userId === user.uid);
                setHasUserReviewed(!!userReview);
              }
            }
          } catch (apiError) {
            console.error('Error fetching reviews from API:', apiError);
            // Fall back to empty array
            setComments([]);
            if (onReviewsLoaded) {
              onReviewsLoaded(0);
            }
          }
        } else {
          // We're skipping external fetch and we don't have existing reviews
          console.log('Skipping external fetch for reviews as requested');
          setComments([]);
          if (onReviewsLoaded) {
            onReviewsLoaded(0);
          }
        }
      } catch (err) {
        console.error('Error processing comments:', err);
        setError('Failed to load comments');
      } finally {
        setIsLoadingComments(false);
      }
    };
    
    // Process reviews only once when component mounts or when dependencies change
    processReviews();
    
    // Avoid setting up Firebase realtime listener to save quota
    return () => {};
  }, [agentId, user, existingReviews, onReviewsLoaded]);
  
  const handleOpenSignInPopup = () => {
    setShowSignInPopup(true);
  };
  
  const handleOpenSignUpPopup = () => {
    setShowSignUpPopup(true);
  };
  
  const handleClosePopups = () => {
    setShowSignInPopup(false);
    setShowSignUpPopup(false);
  };
  
  // Effect to close auth popups after successful authentication
  useEffect(() => {
    // If user wasn't logged in before but is now, close the auth popups
    if (!prevAuthState && user) {
      handleClosePopups();
    }
    // Update previous auth state
    setPrevAuthState(!!user);
  }, [user, prevAuthState]);

  // Add useEffect to check if user can review with caching
  useEffect(() => {
    if (!user) {
      setCanReview(false);
      setReviewEligibilityChecked(true);
      setReviewEligibilityReason('Please sign in to leave a review');
      return;
    }
    
    const checkEligibility = async () => {
      try {
        // First check if we already have eligibility info in local storage
        const cacheKey = `review_eligibility_${agentId}_${user.uid}`;
        let eligibilityResult = null;
        
        // Check for recent download record in localStorage that would make user eligible to review
        try {
          const downloadKey = `agent_download_${agentId}_${user.uid}`;
          const downloadRecord = localStorage.getItem(downloadKey);
          
          if (downloadRecord) {
            // User has downloaded this agent, which makes them eligible to review
            eligibilityResult = {
              canReview: true,
              reason: 'You have downloaded this agent'
            };
            
            // Skip further eligibility checks
            setCanReview(true);
            setReviewEligibilityReason('You have downloaded this agent');
            setReviewEligibilityChecked(true);
            console.log('User is eligible to review based on download record');
            return;
          }
        } catch (downloadCheckError) {
          console.warn('Error checking download record:', downloadCheckError);
        }
        
        // Check for cached eligibility
        try {
          const cachedEligibility = localStorage.getItem(cacheKey);
          if (cachedEligibility) {
            const parsedEligibility = JSON.parse(cachedEligibility);
            const cacheTime = parsedEligibility._cacheTime || 0;
            const now = Date.now();
            
            // Use cache if it's less than 30 minutes old
            if (now - cacheTime < 30 * 60 * 1000) {
              console.log(`Using cached review eligibility for agent ${agentId}`);
              eligibilityResult = parsedEligibility;
            } else {
              console.log(`Review eligibility cache expired for agent ${agentId}`);
            }
          }
        } catch (cacheError) {
          console.warn('Error reading review eligibility from cache:', cacheError);
        }
        
        // If we don't have valid cached data, make the API call
        if (!eligibilityResult) {
          console.log(`Checking review eligibility via API for agent ${agentId}`);
          eligibilityResult = await checkCanReviewAgent(agentId);
          
          // Cache the result with timestamp
          try {
            localStorage.setItem(cacheKey, JSON.stringify({
              ...eligibilityResult,
              _cacheTime: Date.now()
            }));
          } catch (e) {
            // Ignore storage errors
            console.warn('Failed to cache review eligibility:', e);
          }
        }
        
        // Update state with result (whether from cache or API)
        setCanReview(eligibilityResult.canReview);
        setReviewEligibilityReason(eligibilityResult.reason);
        setReviewEligibilityChecked(true);
        
        console.log('Review eligibility result:', eligibilityResult);
      } catch (err) {
        console.error('Error checking review eligibility:', err);
        setCanReview(false);
        setReviewEligibilityReason('Error checking eligibility');
        setReviewEligibilityChecked(true);
      }
    };
    
    checkEligibility();
  }, [user, agentId]);
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.info('Please sign in to leave a review', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        icon: "👋"
      });
      return;
    }
    
    if (hasUserReviewed) {
      toast.warning('You have already reviewed this agent', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        icon: "⚠️"
      });
      return;
    }
    
    if (!canReview) {
      toast.warning(reviewEligibilityReason, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        icon: "⚠️"
      });
      return;
    }
    
    if (!newComment.trim()) {
      setError('Please enter a comment');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const commentData = {
        content: newComment,
        rating: rating,
        verificationStatus: reviewEligibilityReason === 'Verified purchase' ? 'verified_purchase' : 
                            reviewEligibilityReason === 'Downloaded agent' ? 'verified_download' : 
                            reviewEligibilityReason === 'Admin user' ? 'admin' : 'unverified'
      };
      
      console.log('Submitting review with data:', commentData);
      const response = await addAgentReview(agentId, commentData);
      console.log('Review submission response:', response);
      
      if (response.success) {
        // Get the Zustand store's addReviewToAgent function
        const addReviewToStore = useAgentStore.getState().addReviewToAgent;
        
        // Create the new comment object with the response ID
        const newCommentObj = {
          id: response.reviewId || `temp-${Date.now()}`,
          content: newComment,
          rating: rating,
          createdAt: new Date().toISOString(),
          userId: user.uid,
          userName: user.displayName || user.email.split('@')[0]
        };
        
        // Immediately increment the review count through the callback
        // This ensures the UI updates right away without waiting for Firebase
        if (onReviewsLoaded) {
          const newCount = comments.length + 1;
          console.log('Immediately updating review count to:', newCount);
          onReviewsLoaded(newCount);
        }
        
        // Update the local comments state
        setComments(prevComments => [...prevComments, newCommentObj]);
        
        // IMPORTANT: Update the Zustand store with the new review
        // This ensures the new review appears everywhere in the UI
        addReviewToStore(agentId, newCommentObj);
        
        setNewComment('');
        setRating(5);
        setHasUserReviewed(true);
        
        // Show success toast
        toast.success('Your review has been added. Thank you for your feedback!', {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          icon: "✅"
        });
        
        // Force refresh of reviews by invalidating the cache
        localStorage.removeItem(`last_reviews_fetch_${agentId}`);
        
        // Fetch fresh reviews to update the UI
        setTimeout(async () => {
          try {
            const freshReviews = await getAgentReviews(agentId, { 
              skipCache: true, 
              timestamp: Date.now() 
            });
            
            if (freshReviews && Array.isArray(freshReviews)) {
              console.log(`Fetched ${freshReviews.length} fresh reviews after adding new review`);
              setComments(freshReviews);
              
              // Also update the Zustand store with the complete set of reviews
              const updateAgentReviews = useAgentStore.getState().updateAgentReviews;
              updateAgentReviews(agentId, freshReviews);
            }
          } catch (refreshErr) {
            console.error('Error refreshing reviews after submission:', refreshErr);
          }
        }, 500);
      } else {
        setError(response.error || 'Failed to add comment');
        toast.error(response.error || 'Failed to add your review', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          icon: "❌"
        });
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('An error occurred while adding your review');
      showToast('error', '❌ An error occurred while adding your review', {
        icon: "❌"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  };
  
  // Function to handle deleting a review (admin only)
  const handleDeleteReview = async (reviewId) => {
    // Get the Zustand store's removeReviewFromAgent function
    const removeReviewFromStore = useAgentStore.getState().removeReviewFromAgent;
    
    if (!isAdmin) {
      toast.error('Only admins can delete reviews', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: "⛔"
      });
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this review?')) {
      setIsDeleting(true);
      try {
        // Delete the review on the backend
        const response = await deleteAgentReview(agentId, reviewId);
        
        if (response.success) {
          // 1. CRITICAL: Force a complete refresh of reviews from the backend
          console.log('Review deleted, forcing a complete refresh of all reviews from backend');
          
          // Clear any cached data that might prevent fresh data
          localStorage.removeItem(`reviews_cache_${agentId}`);
          localStorage.removeItem(`last_reviews_fetch_${agentId}`);
          
          // Get completely fresh reviews from the backend with cache busting
          const freshReviews = await getAgentReviews(agentId, { 
            skipCache: true,
            timestamp: Date.now() + Math.random() // Add randomness to avoid any caching
          });
          
          console.log(`Received ${freshReviews.length} fresh reviews after deletion`);
          
          // Sort by date descending
          const sortedReviews = freshReviews.sort((a, b) => {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          });
          
          // 2. Update the UI with the fresh data
          setComments(sortedReviews);
          
          // 3. Update the review count through the callback
          if (onReviewsLoaded) {
            onReviewsLoaded(sortedReviews.length);
          }
          
          // 4. Calculate the new average rating
          let newRatingValue = 0;
          if (sortedReviews.length > 0) {
            const sum = sortedReviews.reduce((acc, comment) => acc + (parseFloat(comment.rating) || 0), 0);
            newRatingValue = sum / sortedReviews.length;
          }
          
          // 5. IMPORTANT: Update the Zustand store with the fresh reviews
          // This ensures all components see the exact same data
          const updateStoreReviews = useAgentStore.getState().updateAgentReviews;
          updateStoreReviews(agentId, sortedReviews);
          
          // 5. Show success toast notification
          toast.success(response.message || 'Review deleted successfully', {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            icon: "✅"
          });
          
          // 6. Force an immediate refresh of reviews from Firebase
          console.log('Forcing immediate refresh of reviews from Firebase after deletion');
          localStorage.removeItem(`last_reviews_fetch_${agentId}`);
          
          // 7. Fetch fresh reviews to update everything
          const fetchFreshReviews = async () => {
            try {
              // Use explicit skipCache: true to bypass any caching
              const freshReviews = await getAgentReviews(agentId, { 
                skipCache: true, 
                timestamp: Date.now() 
              });
              
              if (freshReviews && Array.isArray(freshReviews)) {
                console.log(`Fetched ${freshReviews.length} fresh reviews from Firebase after deletion`);
                
                // Update the comments state with fresh data
                setComments(freshReviews);
                
                // Update the review count through the callback
                if (onReviewsLoaded) {
                  onReviewsLoaded(freshReviews.length);
                }
                
                // If the deleted review belonged to the current user
                // mark that they haven't reviewed to allow them to review again
                if (user && user.uid) {
                  const userHasReview = freshReviews.some(review => review.userId === user.uid);
                  setHasUserReviewed(userHasReview);
                }
              }
            } catch (err) {
              console.error('Error fetching fresh reviews after deletion:', err);
            }
          };
          
          // Execute the fetch
          fetchFreshReviews();
        } else {
          throw new Error(response.message || 'Failed to delete review');
        }
      } catch (err) {
        console.error('Error deleting review:', err);
        toast.error(`Error deleting review: ${err.message || 'Unknown error'}`, {
          position: "bottom-right",
          autoClose: 3000,
          icon: "❌"
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  // Update the AuthPrompt component to show different message based on eligibility
  const AuthPrompt = () => (
    <div className={`auth-prompt ${darkMode ? 'dark-mode' : ''}`}>
      <div className={`auth-prompt-content ${darkMode ? 'dark-bg' : ''}`}>
        <div className="auth-prompt-icon">
          <FaComment className={`comment-icon ${darkMode ? 'text-gray-300' : ''}`} />
        </div>
        <h3 className={darkMode ? 'text-gray-200' : ''}>Join the conversation!</h3>
        <p className={darkMode ? 'text-gray-300' : ''}>Sign in to leave a review and share your experience with this product.</p>
        <div className="auth-prompt-buttons">
          <button 
            className={`auth-button signin-button ${darkMode ? 'dark-button' : ''}`} 
            onClick={handleOpenSignInPopup}
          >
            Sign In
          </button>
          <button 
            className={`auth-button signup-button ${darkMode ? 'dark-button' : ''}`} 
            onClick={handleOpenSignUpPopup}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
  
  // Create a component for users who are signed in but not eligible to review
  const EligibilityPrompt = () => (
    <div className={`eligibility-prompt ${darkMode ? 'dark-mode' : ''}`}>
      <div className={`eligibility-prompt-content ${darkMode ? 'dark-bg' : ''}`}>
        <div className="eligibility-prompt-icon">
          <FaComment className={`comment-icon ${darkMode ? 'text-gray-300' : ''}`} />
        </div>
        <h3 className={darkMode ? 'text-gray-200' : ''}>Want to share your experience?</h3>
        <p className={darkMode ? 'text-gray-300' : ''}>{reviewEligibilityReason}</p>
        <p className={darkMode ? 'text-gray-300' : ''}>You can only review agents that you've purchased or downloaded.</p>
      </div>
    </div>
  );
  
  // Auth Popup Component
  const AuthPopup = ({ isSignIn, onClose }) => (
    <div className="auth-popup-overlay" onClick={onClose}>
      <div className="auth-popup" onClick={e => e.stopPropagation()}>
        <button className="auth-popup-close" onClick={onClose}>×</button>
        <iframe 
          src={isSignIn ? "/sign-in" : "/sign-up"} 
          title={isSignIn ? "Sign In" : "Sign Up"}
          className="auth-popup-iframe"
        />
      </div>
    </div>
  );
  
  return (
    <div className={`comments-section ${darkMode ? 'dark-mode' : ''}`}>
      <h3 className={`section-heading ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Reviews & Ratings</h3>
      
      {user && !hasUserReviewed && canReview ? (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <div className="rating-input">
            <label className={darkMode ? 'text-white font-medium' : 'text-gray-700'}>Your Rating:</label>
            <StarRating rating={rating} onRatingChange={setRating} interactive={true} />
          </div>
          
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this agent..."
            className={`comment-textarea ${darkMode ? 'dark-input' : ''}`}
            rows={4}
          />
          
          {error && <div className="comment-error">{error}</div>}
          
          <button 
            type="submit" 
            className="submit-comment-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      ) : user && hasUserReviewed ? (
        <div className={`already-reviewed-message ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <p className={`section-heading-paragraph ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>You have already submitted a review for this agent. Thank you for your feedback!</p>
        </div>
      ) : user && reviewEligibilityChecked && !canReview ? (
        <EligibilityPrompt />
      ) : (
        <AuthPrompt />
      )}
      
      <div className="comments-list">
        {isLoadingComments ? (
          <div className={`loading-comments ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading reviews...</div>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className={`comment-item ${darkMode ? 'dark-mode' : ''}`}>
              <div className="comment-header">
                <div className="comment-user">
                  <span className={`user-name ${darkMode ? 'text-gray-200' : ''}`}>{comment.userName || 'Anonymous'}</span>
                  <span className={`comment-date ${darkMode ? 'text-gray-400' : ''}`}>{formatDate(comment.createdAt)}</span>

                </div>
                <div className="rating-actions">
                  <StarRating rating={comment.rating} size="small" />
                  {/* Show delete button if user is admin */}
                  {isAdmin && (
                    <button 
                      className="delete-review-btn"
                      onClick={() => handleDeleteReview(comment.id)}
                      disabled={isDeleting}
                      title="Delete review"
                    >
                      <FaTrash className="delete-icon" />
                    </button>
                  )}
                </div>
              </div>
              <div className={`comment-content ${darkMode ? 'text-gray-300' : ''}`}>{comment.content}</div>
            </div>
          ))
        ) : (
          <div className={`no-comments ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            No reviews yet. {user ? 'Be the first to review!' : 'Sign in to be the first to review!'}
          </div>
        )}
      </div>
      
      {/* Authentication Popups */}
      {showSignInPopup && <AuthPopup isSignIn={true} onClose={handleClosePopups} darkMode={darkMode} />}
      {showSignUpPopup && <AuthPopup isSignIn={false} onClose={handleClosePopups} darkMode={darkMode} />}
    </div>
  );
};

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
  const [dataLoaded, setDataLoaded] = useState(false); // Add state to track if data was loaded
  const intervalRef = useRef(null);
  const reviewsFetchedRef = useRef(false);
  const loadAttempt = useRef(0); // Track load attempts
  
  // Access the agent store
  const { 
    allAgents, 
    isStoreLoading,
    loadInitialData, // Add this to ensure store is loaded
    setAllAgents // Add this to update the store with fetched agent
  } = useAgentStore();
  
  // Image slider refs
  const sliderRef = useRef(null);
  const imageRef = useRef(null);
  
  // Function to check if the agent is free
  const isFreeAgent = (agent) => {
    if (!agent) return true; // Default to free if no agent
    
    // First check priceDetails as the source of truth
    if (agent.priceDetails) {
      if (agent.priceDetails.isFree === true) return true;
      if (agent.priceDetails.basePrice === 0) return true;
    }
    
    // Check for explicit isFree flag
    if (agent.isFree === true) return true;
    
    // Check for zero or free in the direct price field
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
    
    // Check for free in formatted price string
    if (typeof agent.price === 'string' && 
        (agent.price.toLowerCase().includes('free') || 
         agent.price === '$0' || 
         agent.price === '0' || 
         agent.price.trim() === '')) {
      return true;
    }
    
    // Check priceDetails object
    if (agent.priceDetails) {
      // If basePrice or discountedPrice is 0 or missing
      if (agent.priceDetails.basePrice === 0 || 
          agent.priceDetails.basePrice === '0' ||
          agent.priceDetails.basePrice === undefined ||
          agent.priceDetails.discountedPrice === 0 ||
          agent.priceDetails.discountedPrice === '0') {
        return true;
      }
    }
    
    // Check for price object structure
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
  
  // Memoized derived values
  const agentTitle = useMemo(() => {
    if (!agent) return '';
    return agent.title || agent.name || 'Unnamed Agent';
  }, [agent]);
  
  // Removed duplicate agentRatingValue declaration - using the one below
  
  const agentDescription = useMemo(() => {
    if (!agent) return '';
    return agent.description || 'No description available for this agent.';
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
  
  const agentCreator = useMemo(() => {
    if (!agent) return 'Unknown Creator';
    
    if (agent.creator) {
      return agent.creator.name || agent.creator.username || 'Unknown Creator';
    }
    
    return 'Unknown Creator';
  }, [agent]);
  
  const agentRatingValue = useMemo(() => {
    if (!agent) return 0;
    
    // First check if we have rating data in the agent object
    if (agent.rating && agent.rating.average) {
      return typeof agent.rating.average === 'number' ? 
        agent.rating.average : 
        parseFloat(agent.rating.average) || 0;
    }
    
    // If rating.average is not available, calculate from reviews
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
  
  // Toast configuration for consistent, appealing notifications
  const showToast = (type, message, options = {}) => {
    const defaultOptions = {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      icon: true
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    switch (type) {
      case 'success':
        toast.success(message, mergedOptions);
        break;
      case 'error':
        toast.error(message, mergedOptions);
        break;
      case 'info':
        toast.info(message, mergedOptions);
        break;
      case 'warning':
        toast.warning(message, mergedOptions);
        break;
      default:
        toast(message, mergedOptions);
    }
  };
  
  // Track loading attempts to prevent infinite loops
  const MAX_LOAD_ATTEMPTS = 2;
  
  // Function to set up periodic updates for agent data
  const setupRealtimeUpdates = (agentId, setAgentFn, setLikesFn, setDownloadFn) => {
    console.log('Setting up periodic updates for agent:', agentId);
    // This function will be called by loadAgent to initialize the polling
    // The actual polling logic is handled in the useEffect below
  };
  
  // Track whether we've already started loading to prevent duplicate requests
  const isLoadingRef = useRef(false);
  
  // Track API calls to prevent duplicate requests in development mode
  const apiCallInProgressRef = useRef(false);
  
  useEffect(() => {
    // Skip if we already loaded data or exceeded max attempts or already loading
    if (dataLoaded || !agentId || loadAttempt.current >= MAX_LOAD_ATTEMPTS || isLoadingRef.current) return;
    
    // Mark as loading to prevent duplicate requests from React's double invocation in dev mode
    isLoadingRef.current = true;
    console.log(`Starting to load agent ${agentId}, attempt ${loadAttempt.current + 1}`);
    
    // First ensure the store is loaded with initial data, but only if we need it
    // This prevents the redundant 'agents?' API call when we only need a single agent
    if (allAgents.length === 0 && !isStoreLoading) {
      // Only load all agents if we're not directly accessing a specific agent
      // or if we've already tried to load this agent directly and failed
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
    
    // Define a single global timeoutId reference for cleanup
    let timeoutId;
    
    const loadAgent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add a small delay to ensure auth is ready
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Validate agent ID format
        if (!agentId) {
          setError("Invalid agent ID provided.");
          setLoading(false);
          return;
        }
        
        console.log(`Loading agent detail for ID: ${agentId}, from route: ${window.location.pathname}`);
        
        // First check if data is already in the agent store
        console.log('Checking agent store for agent data...', allAgents);
        if (allAgents && Array.isArray(allAgents) && allAgents.length > 0) {
          const storeAgent = allAgents.find(a => a.id === agentId || a._id === agentId);
          if (storeAgent && !loadAttempt.current) {
            console.log('Using agent data from store:', storeAgent);
            
            // Check if store agent has reviews to avoid redundant API calls
            const hasReviews = storeAgent.reviews && Array.isArray(storeAgent.reviews) && storeAgent.reviews.length > 0;
            console.log('Agent from store has reviews:', hasReviews ? storeAgent.reviews.length : 0);
            
            // Set the agent data
            setAgent(storeAgent);
            
            // Set initial likes count
            if (storeAgent.likes) {
              if (Array.isArray(storeAgent.likes)) {
                setLikesCount(storeAgent.likes.length);
              } else if (typeof storeAgent.likes === 'number') {
                setLikesCount(storeAgent.likes);
              }
            }
            
            // Set review count if available
            if (hasReviews) {
              setReviewCount(storeAgent.reviews.length);
              // Mark reviews as fetched to prevent redundant API calls
              reviewsFetchedRef.current = true;
            }
            
            // Set download count
            setDownloadCount(storeAgent.downloadCount || 0);
            
            // Set initial wishlist status
            setIsWishlisted(storeAgent.isWishlisted || false);
            
            // Set initial price value
            if (storeAgent.priceDetails && storeAgent.priceDetails.basePrice !== undefined) {
              setCustomPrice(storeAgent.priceDetails.basePrice.toString());
            } else if (typeof storeAgent.price === 'number') {
              setCustomPrice(storeAgent.price.toString());
            } else if (typeof storeAgent.price === 'string' && !isNaN(parseFloat(storeAgent.price))) {
              setCustomPrice(parseFloat(storeAgent.price).toString());
            } else {
              setCustomPrice('0');
            }
            
            // Set up periodic updates instead of real-time updates with Firebase
            setupRealtimeUpdates(agentId, setAgent, setLikesCount, setDownloadCount);
            setLoading(false);
            setDataLoaded(true); // Mark data as loaded
            return;
          }
        }
        
        // If not in store or we're forcing a refresh, fetch from API
        console.log('Fetching agent data from API...');
        
        // Create an abort controller with a shorter timeout for initial load
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log('Aborting initial agent fetch due to timeout');
          abortController.abort('Initial load timeout');
          // Set error state and stop loading when timeout occurs
          setError("Request timed out. Please try again later.");
          setLoading(false);
          setDataLoaded(true); // Mark as loaded even on error to prevent retries
        }, 10000); // 10 second timeout for initial load
        
        // Increment load attempt counter - mark this as our first attempt
        loadAttempt.current += 1;
        
        let data;
        try {
          // Give a small delay to ensure auth is initialized
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Prevent duplicate API calls
          if (apiCallInProgressRef.current) {
            console.log('API call already in progress, waiting...');
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          apiCallInProgressRef.current = true;
          console.log(`Making API call for agent ${agentId}`);
          
          // Check if we should force skip cache
          const forceRefresh = window.location.search.includes('refresh=true');
          
          // Always force a fresh fetch for the agent data to ensure we have the latest reviews
          // This is critical to fix the issue where reviews aren't up-to-date
          data = await fetchAgentById(agentId, { 
            signal: abortController.signal,
            skipCache: true, // Always skip cache to get fresh data from the database
            includeReviews: true, // Always include reviews to avoid duplicate API calls
            timestamp: Date.now() // Add timestamp to prevent browser caching issues
          });
          
          // IMPORTANT: Update the Zustand store with the fresh data
          // This ensures all components that use the store have the latest reviews
          if (data) {
            // Use the Zustand store's updateAgentReviews function
            const updateStoreReviews = useAgentStore.getState().updateAgentReviews;
            
            // Mark reviews as fetched to prevent redundant API calls
            if (data.reviews && Array.isArray(data.reviews)) {
              console.log(`Received ${data.reviews.length} fresh reviews with agent data, syncing with store`);
              updateStoreReviews(agentId, data.reviews);
              reviewsFetchedRef.current = true;
              
              // Set the cache timestamp to prevent immediate refetching
              localStorage.setItem(`last_reviews_fetch_${agentId}`, Date.now().toString());
            }
          }
          
          apiCallInProgressRef.current = false;
          
          // Clear the timeout since request completed
          clearTimeout(timeoutId);
        } catch (error) {
          console.error('Error fetching agent data:', error);
          clearTimeout(timeoutId);
          apiCallInProgressRef.current = false;
          
          // Check if this was an abort error (timeout)
          if (error.name === 'AbortError') {
            setError("Request timed out. Please try again later.");
          } else {
            setError(error.message || "Failed to load agent data. Please try again later.");
          }
          
          setLoading(false);
          setDataLoaded(true); // Mark as loaded even on error to prevent infinite retries
          return; // Exit early on error
        }
        
        console.log('Raw API response for fetchAgentById:', data);
        
        // Add data validation
        if (!data) {
          throw new Error("No agent data returned from API");
        }
        
        // Log success
        console.log(`Successfully loaded agent data for ${agentId}`);
        
        // Cache the agent data in localStorage for future use
        try {
          localStorage.setItem(`agent_${agentId}`, JSON.stringify(data));
          console.log(`Cached agent data for ${agentId} in localStorage`);
          
          // Also update the store with this agent if it's not already there
          const existingAgent = allAgents.find(a => a.id === agentId || a._id === agentId);
          if (!existingAgent) {
            console.log('Adding agent to store for future reference');
            // Add the agent to the store without replacing existing agents
            setAllAgents([...allAgents, data]);
          }
        } catch (cacheError) {
          console.warn('Failed to cache agent data:', cacheError);
        }
        
        // Add fallback values for critical fields
        const sanitizedData = {
          ...data,
          title: data.title || data.name || "Unnamed Agent",
          description: data.description || "No description available",
          price: data.price !== undefined ? data.price : "Price unavailable",
          creator: data.creator || { name: "Unknown Creator" },
          downloadCount: data.downloadCount || 0 // Ensure downloadCount is always available
        };
        
        console.log('Sanitized agent data:', sanitizedData);
        
        // Ensure priceDetails is properly formatted
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
          // Create priceDetails from price if it doesn't exist
          const numericPrice = typeof data.price === 'number' ? data.price : parseFloat(data.price);
          sanitizedData.priceDetails = {
            basePrice: numericPrice,
            discountedPrice: numericPrice,
            currency: 'USD'
          };
        }
        
        // Handle image URLs
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
          console.log('Creating placeholder image');
          sanitizedData.imageUrl = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%234a4de7"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="24" text-anchor="middle" fill="white"%3E${encodeURIComponent(sanitizedData.title)}%3C/text%3E%3C/svg%3E`;
        }
        
        // Make sure we have an images array
        if (!sanitizedData.images || !Array.isArray(sanitizedData.images)) {
          sanitizedData.images = [];
        }
        
        // Add the main image to the images array if it's not already there
        if (sanitizedData.imageUrl && !sanitizedData.images.includes(sanitizedData.imageUrl)) {
          sanitizedData.images.unshift(sanitizedData.imageUrl);
        }
        
        // Add gallery images to the images array if available
        if (sanitizedData.gallery && Array.isArray(sanitizedData.gallery)) {
          sanitizedData.gallery.forEach(item => {
            const galleryUrl = typeof item === 'string' ? item : (item && item.url);
            if (galleryUrl && !sanitizedData.images.includes(galleryUrl)) {
              sanitizedData.images.push(galleryUrl);
            }
          });
        }
        
        // Add icon to the images array if available
        if (sanitizedData.iconUrl && !sanitizedData.images.includes(sanitizedData.iconUrl)) {
          sanitizedData.images.push(sanitizedData.iconUrl);
        }
        
        setAgent(sanitizedData);
        console.log('Final agent data set in state:', sanitizedData);
        
        // Set initial review count
        if (sanitizedData.reviews && Array.isArray(sanitizedData.reviews)) {
          setReviewCount(sanitizedData.reviews.length);
        } else {
          try {
            const reviews = await getAgentReviews(agentId);
            if (reviews && Array.isArray(reviews)) {
              setReviewCount(reviews.length);
            }
          } catch (err) {
            console.warn('Could not fetch initial review count:', err);
          }
        }
        
        // Set likes count
        if (sanitizedData.likes) {
          if (Array.isArray(sanitizedData.likes)) {
            setLikesCount(sanitizedData.likes.length);
          } else if (typeof sanitizedData.likes === 'number') {
            setLikesCount(sanitizedData.likes);
          }
        }
        
        // Get download count directly from the agent data object
        setDownloadCount(sanitizedData.downloadCount || 0);
        
        // Set initial price value
        if (sanitizedData.priceDetails && sanitizedData.priceDetails.basePrice !== undefined) {
          setCustomPrice(sanitizedData.priceDetails.basePrice.toString());
        } else if (typeof sanitizedData.price === 'number') {
          setCustomPrice(sanitizedData.price.toString());
        } else if (typeof sanitizedData.price === 'string' && !isNaN(parseFloat(sanitizedData.price))) {
          setCustomPrice(parseFloat(sanitizedData.price).toString());
        } else {
          // Default to free if no price
          setCustomPrice('0');
        }
        
        setIsWishlisted(sanitizedData.isWishlisted || false);
        
        // Set up periodic updates instead of real-time updates with Firebase
        setupRealtimeUpdates(agentId, setAgent, setLikesCount, setDownloadCount);
        setLoading(false);
        setDataLoaded(true); // Mark data as loaded
        isLoadingRef.current = false; // Reset loading flag
        
      } catch (err) {
        console.error('Error loading agent:', err);
        
        // Clear any timeout that may have been set
        if (typeof timeoutId !== 'undefined') {
          clearTimeout(timeoutId);
        }
        
        // Reset loading flag
        isLoadingRef.current = false;
        
        // Handle aborted request specially
        if (err.name === 'AbortError' || (err.message && err.message.includes('aborted'))) {
          console.log('Agent initial load was aborted due to timeout');
          
          // Try to get from cache as fallback
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
              // Reset loading flag
              isLoadingRef.current = false;
              // Setup updates with the cached data
              setupRealtimeUpdates(agentId, setAgent, setLikesCount, setDownloadCount);
              return;
            }
          } catch (cacheErr) {
            console.error('Failed to load from cache after abort:', cacheErr);
          }
        }
        
        // Standard error handling based on response codes
        if (err.response && err.response.status === 404) {
          setError(`Agent with ID "${agentId}" not found. It may have been removed or doesn't exist.`);
        } else if (err.response && err.response.status === 400) {
          setError(`Invalid agent ID. Please check the URL and try again.`);
        } else {
          setError(`There was a problem loading this product. Please try again later.`);
        }
        setLoading(false);
        setDataLoaded(true); // Important: Mark as loaded even on error to prevent infinite retries
        isLoadingRef.current = false; // Reset loading flag
        apiCallInProgressRef.current = false; // Reset API call flag
        
        // Show error message to user
        showToast(`Error loading agent: ${err.message || 'Unknown error'}`, 'error');
      }
    };
    
    loadAgent();
    
    // Track product view for recommendations - only if not already tracked
    if (agentId && !viewTracked) {
      console.log('Tracking product view for recommendations:', agentId);
      // Mark as tracked immediately to prevent duplicate tracking attempts
      setViewTracked(true);
    }
  }, [agentId, viewTracked]);
  
  // Setup realtime updates
  useEffect(() => {
    // Keep track of consecutive errors
    let consecutiveErrors = 0;
    const MAX_CONSECUTIVE_ERRORS = 3; // After this many errors, stop polling
    let intervalId = null; // Declare intervalId for this scope
    let isPollingActive = true; // Declare and initialize isPollingActive for this scope
    
    // Setup visibility change listener to pause/resume polling when tab is not active
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page hidden, pausing polling');
        isPollingActive = false;
      } else {
        console.log('Page visible, resuming polling');
        isPollingActive = true;
      }
    };
    
    // Add visibility change event listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Setup very infrequent polling (60 minutes)
    const fetchData = async () => {
      // Only fetch if polling is active (page is visible)
      if (!isPollingActive) {
        console.log('Skipping poll because page is not visible');
        return;
      }
      
      // If we've had too many consecutive errors, stop polling
      if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
        console.log(`Stopping polling after ${consecutiveErrors} consecutive errors`);
        if (intervalId) {
          clearInterval(intervalId);
        }
        return;
      }
      
      // Check if backend is having issues
      const backendErrorKey = 'backend_error_until';
      const backendErrorUntil = parseInt(localStorage.getItem(backendErrorKey) || '0');
      const now = Date.now();
      
      if (backendErrorUntil > now) {
        console.log(`Skipping poll because backend had errors. Will retry after ${new Date(backendErrorUntil).toLocaleTimeString()}`);
        return;
      }
      
      try {
        console.log('Manual polling for agent updates');
        
        // Create an abort controller with a longer timeout
        const abortController = new AbortController();
        
        // Set up a timeout to abort the request
        let timeoutId = null;
        try {
          timeoutId = setTimeout(() => {
            console.log('Aborting agent update poll due to timeout');
            abortController.abort('Timeout');
          }, 15000); // 15 second timeout
          
          // Only skip cache once every hour to avoid excessive API calls
          const lastPollTime = parseInt(localStorage.getItem(`last_poll_${agentId}`)) || 0;
          const shouldSkipCache = (now - lastPollTime) > 60 * 60 * 1000; // 1 hour
          
          if (shouldSkipCache) {
            localStorage.setItem(`last_poll_${agentId}`, now.toString());
            console.log('Polling with fresh data (skipping cache)');
          } else {
            console.log('Polling with cached data if available');
          }
          
          const agentData = await fetchAgentById(agentId, { 
            skipCache: shouldSkipCache,
            signal: abortController.signal
          });
          
          // Reset consecutive errors on success
          consecutiveErrors = 0;
          
          // Check if we actually got data
          if (!agentData) {
            console.warn('No agent data returned from API');
            return;
          }
          
          // Update agent with the data
          setAgent(prev => {
            if (!prev) return prev;
            
            // Keep important previous properties if the new data is missing them
            const updatedAgent = {
              ...prev,
              ...agentData,
              // Ensure we keep the imageUrl if the new data doesn't have it
              imageUrl: agentData.imageUrl || prev.imageUrl,
              // Keep previous image array if new one is empty
              images: (agentData.images && agentData.images.length > 0) ? 
                      agentData.images : prev.images,
              // Ensure we merge likes, reviews, etc.
              likes: agentData.likes || prev.likes,
              rating: agentData.rating || prev.rating,
              downloadCount: agentData.downloadCount || prev.downloadCount,
              reviews: (agentData.reviews && agentData.reviews.length > 0) ?
                       agentData.reviews : prev.reviews
            };
            
            return updatedAgent;
          });
          
          // Update likes count
          if (agentData.likes) {
            if (Array.isArray(agentData.likes)) {
              setLikesCount(agentData.likes.length);
            } else if (typeof agentData.likes === 'number') {
              setLikesCount(agentData.likes);
            }
          }
          
          // Update download count
          if (agentData.downloadCount) {
            setDownloadCount(agentData.downloadCount);
          }
        } finally {
          // Always clear the timeout
          if (timeoutId) clearTimeout(timeoutId);
        }
      } catch (error) {
        consecutiveErrors++; // Increment error counter
        
        if (error.name === 'AbortError' || error.code === 'ERR_CANCELED' || 
            (error.message && (error.message.includes('aborted') || error.message.includes('canceled')))) {
          console.log('Agent update poll was aborted: ', error.message);
          // Don't treat this as a fatal error
        } else if (error.code === 'ERR_NETWORK') {
          console.log('Network error during agent poll - will retry later');
        } else if (error.response && error.response.status === 404) {
          console.error('Agent not found (404) - stopping periodic updates');
          if (intervalId) {
            clearInterval(intervalId);
          }
        } else if (error.response && error.response.status === 500) {
          console.error('Server error (500) during agent poll - pausing polls temporarily');
          // Set a backoff period of 10 minutes before trying again
          localStorage.setItem(backendErrorKey, (now + 10 * 60 * 1000).toString());
        } else {
          console.error('Error polling agent data:', error);
        }
      }
    };
    
    // Initial fetch - only do this once with a short delay to prevent race conditions
    setTimeout(fetchData, 1000);
    
    // Set interval for very infrequent polling (60 minutes) to drastically reduce quota usage
    intervalId = setInterval(fetchData, 60 * 60 * 1000);
    
    // Return cleanup function
    return () => {
      console.log('Cleaning up polling interval and visibility listener');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [agentId]); // Added dependency array [agentId]
  
  // Modified useEffect to ensure reviews are always updated from the database
  useEffect(() => {
    // Skip if we don't have an agent ID or if we're still loading
    if (!agentId || loading) {
      return;
    }
    
    console.log('Checking if reviews need to be fetched or refreshed');
    
    // Get access to the Zustand store for syncing
    const updateStoreReviews = useAgentStore.getState().updateAgentReviews;
    
    const fetchReviews = async () => {
      try {
        console.log('Checking if reviews need to be fetched or refreshed');
        
        // Mark as fetched to prevent immediate duplicate calls
        reviewsFetchedRef.current = true;
        
        // Track tab changes
        const tabChanged = sessionStorage.getItem(`last_active_tab_${agentId}`) !== activeTab;
        if (tabChanged && activeTab === 'reviews') {
          console.log('Tab changed to reviews');
          sessionStorage.setItem(`last_active_tab_${agentId}`, activeTab);
        }
        
        // Use the reviews that are already in the agent data
        if (agent && agent.reviews && Array.isArray(agent.reviews)) {
          console.log(`Using ${agent.reviews.length} reviews already included in agent data`);
          
          // Update the review count immediately
          setReviewCount(agent.reviews.length);
          
          // No need to make a separate API call for reviews
          // since they're already included in the agent data
          
          // Set the cache timestamp to prevent immediate refetches
          localStorage.setItem(`last_reviews_fetch_${agentId}`, Date.now().toString());
        } else if (agent) {
          // If the agent has no reviews array or it's empty, set the count to 0
          console.log('No reviews found in agent data');
          setReviewCount(0);
          
          // Update the agent object with an empty reviews array if it doesn't exist
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
          
          // Set the cache timestamp
          localStorage.setItem(`last_reviews_fetch_${agentId}`, Date.now().toString());
        } else {
          console.log('No agent data available');
        }
      } catch (err) {
        console.error('Error processing reviews:', err);
      }
    };
    
    // This function should be removed or replaced with a comment
    // since it's no longer needed - reviews are included in agent data
    // const getAgentReviews = async () => {
    //   // DEPRECATED: Reviews are now included in the agent data
    //   console.log('This function is deprecated');
    //   return [];
    // };
    
    // Initial fetch - execute immediately
    fetchReviews();
    
    // NO polling interval - this reduces unnecessary API calls
    // The user can refresh by switching tabs or taking actions
    
    // Nothing to clean up since we're not setting up an interval
  }, [agentId, loading, activeTab, user]); // Dependencies include user and activeTab for proper refreshing

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }
    
    try {
      // Use toggleWishlist API function rather than direct Firebase access
      const response = await toggleWishlist(agentId);
      
      if (response.success) {
        // Update local state
        setIsWishlisted(response.isInWishlist);
        toast.success(response.isInWishlist ? "Added to your wishlist" : "Removed from your wishlist");
      } else {
        console.error("Error updating wishlist:", response.error);
        toast.error("Error updating wishlist. Please try again later.");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Error updating wishlist. Please try again later.");
    }
  };
  
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopySuccess('Link copied!');
        showToast('success', '🔗 Link copied to clipboard!', {
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

  // Format the price for display
  const displayPrice = (agent) => {
    // First check for explicit free indicators
    if (isFreeAgent(agent)) {
      return (
        <div className="price-value-container free">
          <FaCheckCircle className="price-check" />
          <span className="price-value free">Free</span>
        </div>
      );
    }
    
    // Handle price details object with discounted price
    if (agent.priceDetails) {
      const { basePrice, discountedPrice, currency } = agent.priceDetails;
      const currencySymbol = currency === 'EUR' ? '€' : '$';
      
      // If there's a discount, show both prices
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
      
      // Otherwise just show regular price
      if (basePrice !== undefined) {
        return (
          <span className="price-value">
            {currencySymbol}{basePrice.toFixed(2)}
          </span>
        );
      }
    }
    
    // Fallback to formatted price from utils
    return (
      <span className="price-value">
        {formatPrice(agent.price)}
      </span>
    );
  };
  
  // Handle custom price change
  const handlePriceChange = (e) => {
    const value = e.target.value;
    setCustomPrice(value);
  };
  
  // Validate if price is valid (at or above minimum)
  const isPriceValid = () => {
    const minPrice = getMinimumPrice();
    const price = parseFloat(customPrice) || 0;
    return price >= minPrice;
  };

  // Safely format rating for display
  const formatRating = (rating) => {
    if (rating === undefined || rating === null) return '0.0';
    if (typeof rating === 'string') return rating;
    if (typeof rating === 'number') return rating.toFixed(1);
    return '0.0';
  };
  
  // Get file type data display
  const getFileDetails = () => {
    if (!agent) return null;
    
    if (agent.fileType === 'pdf' || (agent.fileDetails && agent.fileDetails.type === 'pdf')) {
      const pageCount = agent.fileDetails?.pageCount || agent.pageCount || 50;
      return `${pageCount} pages (PDF)`;
    }
    
    if (agent.fileType === 'audio' || (agent.fileDetails && agent.fileDetails.type === 'audio')) {
      const duration = agent.fileDetails?.duration || agent.duration || '30 mins';
      return `${duration} (Audio)`;
    }
    
    if (agent.fileType === 'video' || (agent.fileDetails && agent.fileDetails.type === 'video')) {
      const duration = agent.fileDetails?.duration || agent.duration || '15 mins';
      return `${duration} (Video)`;
    }
    
    if (agent.fileType === 'template' || (agent.fileDetails && agent.fileDetails.type === 'template')) {
      return 'Template - ready to use';
    }
    
    // Default case
    return 'Digital download';
  };
  
  // Navigate through slider
  const showSlide = (index) => {
    if (!agent || !agent.images) return;
    
    // Handle wrap-around
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
  
  // Get image url array for slider
  const getImageUrls = () => {
    if (!agent) return [null];
    
    const validUrls = [];
    
    // If agent has images array, use it
    // if (agent.images && Array.isArray(agent.images) && agent.images.length > 0) {
    //   console.log('Using agent.images array');
      
    //   // Filter out any invalid URLs
    //   agent.images.forEach(url => {
    //     if (url && typeof url === 'string' && url.trim() !== '') {
    //       validUrls.push(url);
    //     }
    //   });
    // }
    
    // If agent has gallery array, add those too
    // if (agent.gallery && Array.isArray(agent.gallery) && agent.gallery.length > 0) {
    //   console.log('Adding gallery images');
      
    //   agent.gallery.forEach(item => {
    //     // Handle both string URLs and object format
    //     if (typeof item === 'string' && item.trim() !== '') {
    //       validUrls.push(item);
    //     } else if (item && typeof item === 'object' && item.url) {
    //       validUrls.push(item.url);
    //     }
    //   });
    // }
    
    // Add the main imageUrl if it exists and isn't already in the array
    // if (agent.imageUrl && !validUrls.includes(agent.imageUrl)) {
    //   console.log('Adding main imageUrl');
    //   validUrls.push(agent.imageUrl);
    // }
    
    // Check for image object format
    if (agent.image && typeof agent.image === 'object' && agent.image.url && !validUrls.includes(agent.image.url)) {
      console.log('Adding image.url');
      validUrls.push(agent.image.url);
    }
    
    // Check for iconUrl if we need more images
    if (agent.iconUrl && !validUrls.includes(agent.iconUrl)) {
      console.log('Adding iconUrl');
      validUrls.push(agent.iconUrl);
    }
    
    // If no valid images were found, add a placeholder
    if (validUrls.length === 0) {
      console.log('No valid images found, using placeholder');
      const title = agent.title || agent.name || 'Agent';
      const placeholderUrl = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%234a4de7"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="24" text-anchor="middle" fill="white"%3E${encodeURIComponent(title)}%3C/text%3E%3C/svg%3E`;
      validUrls.push(placeholderUrl);
    }
    
    // Deduplicate the URLs
    const uniqueUrls = [...new Set(validUrls)];
    console.log(`Assembled ${uniqueUrls.length} unique image URLs for agent`);
    
    return uniqueUrls;
  };

  // Handle add to cart click
  const handleAddToCart = () => {
    if (!isPriceValid()) {
      showToast('warning', '⚠️ Please enter a valid price', {
        icon: "⚠️"
      });
      return;
    }
    
    try {
      // Create a product object from the agent data
      const product = {
        id: agent.id,
        title: agent.title,
        price: parseFloat(customPrice),
        imageUrl: agent.imageUrl || getImageUrls()[0],
        quantity: 1
      };
      
      // Add to cart using the context function
      addToCart(product);
      
      showToast('success', '🛒 Added to cart! Continue shopping or proceed to checkout.', {
        icon: "🛒",
        autoClose: 3000
      });
      
      // Record the download with the new API
      // recordAgentDownload(agentId).then(result => {
      //   if (result.success) {
      //     setDownloadCount(prev => prev + 1);
      //   }
      //   console.log('Download recorded successfully:', result);
      //   setIsDownloading(false);
      //   toast.success('Download complete!');
      // }).catch(err => {
      //   console.error('Error recording download:', err);
      //   // Still increment the display count since the user won't see this error
      //   setDownloadCount(prev => prev + 1);
      // });
    } catch (err) {
      console.error('Error adding to cart:', err);
      showToast('error', '❌ Could not add item to cart. Please try again.', {
        icon: "❌"
      });
    }
  };

  // Handle image load to determine aspect ratio
  const handleImageLoad = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      const ratio = naturalWidth / naturalHeight;
      // Consider images with ratio less than 1 as portrait
      setImageAspectRatio(ratio < 1 ? 'portrait' : 'landscape');
    }
  };
  
  // Handle like update from LikeButton
  const handleLikeUpdate = (newLikesCount) => {
    setLikesCount(newLikesCount);
    
    // Also update the agent object to keep it in sync
    setAgent(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        likes: typeof prev.likes === 'number' ? newLikesCount : 
               Array.isArray(prev.likes) ? [...Array(newLikesCount)].map(() => ({})) : newLikesCount
      };
    });
  };

  // Add a function to handle direct download for free agents
  const handleDirectDownload = async () => {
    if (!user) {
      showToast('info', '👋 Please sign in to download this agent', {
        icon: "👋",
        autoClose: 4000
      });
      return;
    }
    
    try {
      setLoading(true);
      console.log('Starting download process for agent:', agentId);
      
      const downloadResult = await downloadFreeAgent(agentId);
      console.log('Download API result:', downloadResult);
      
      if (downloadResult.success) {
        // If the response includes the updated agent data, use it
        if (downloadResult.agent) {
          console.log('Using agent data from download response to update UI');
          
          // Update the agent state with the fresh data
          setAgent(prev => ({
            ...prev,
            ...downloadResult.agent,
            // Preserve any UI-specific properties not in the API response
            images: prev.images || [],
            imageUrl: downloadResult.agent.imageUrl || prev.imageUrl,
            // If download count is in the response, use it directly
            downloadCount: downloadResult.agent.downloadCount || (prev.downloadCount + 1)
          }));
          
          // Update download count from the response
          if (downloadResult.agent.downloadCount) {
            setDownloadCount(downloadResult.agent.downloadCount);
          } else {
            // Fallback to incrementing locally if not in response
            setDownloadCount(prev => prev + 1);
          }
          
          // Update likes if they're in the response
          if (downloadResult.agent.likes) {
            if (Array.isArray(downloadResult.agent.likes)) {
              setLikesCount(downloadResult.agent.likes.length);
            } else if (typeof downloadResult.agent.likes === 'number') {
              setLikesCount(downloadResult.agent.likes);
            }
          }
        } else {
          // Fallback to just incrementing the download count locally
          console.log('No agent data in download response, incrementing download count locally');
          setDownloadCount(prev => prev + 1);
        }
        
        // Show success message
        toast.success('✅ Download successful!', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          icon: "✅"
        });
        
        // If we have a download URL, download it - check multiple possible locations
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
        
        if (downloadUrl) {
          try {
            console.log('Download URL found:', downloadUrl);
            
            // Check if this is a Google Cloud Storage URL that will have CORS issues
            const isGoogleStorage = downloadUrl.includes('storage.googleapis.com') || downloadUrl.includes('firebasestorage.app');
            
            if (isGoogleStorage) {
              // Method 1: Use backend proxy to avoid CORS issues
              console.log('Using backend proxy for Google Storage download to avoid CORS');
              
              try {
                // Create a proxy download URL through our backend
                const proxyUrl = `/api/agents/${agentId}/download-file`;
                
                // Use the browser's default download mechanism
                const link = document.createElement('a');
                link.href = proxyUrl;
                
                // Extract filename
                const urlParts = downloadUrl.split('/');
                let filename = urlParts[urlParts.length - 1];
                if (filename.includes('?')) {
                  filename = filename.split('?')[0];
                }
                if (!filename || !filename.includes('.')) {
                  filename = `${agent.title || 'agent'}.json`;
                }
                
                // Ensure filename has proper extension
                if (!filename.endsWith('.json')) {
                  filename = filename.replace(/\.[^/.]+$/, '') + '.json';
                }
                
                link.download = filename;
                link.style.display = 'none';
                
                // Important: Add to DOM for compatibility
                document.body.appendChild(link);
                link.click();
                
                // Clean up after a short delay
                setTimeout(() => {
                  document.body.removeChild(link);
                }, 100);
                
                console.log('Download initiated via backend proxy');
                showToast('success', '📥 Download started! Check your downloads folder.', {
                  autoClose: 3000
                });
                
              } catch (proxyError) {
                console.error('Backend proxy download failed:', proxyError);
                throw new Error('Backend proxy download failed');
              }
              
            } else {
              // Method 2: For non-Google Storage URLs, try direct fetch
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
              
              // Get the response as text first to ensure proper handling
              const responseText = await response.text();
              
              // Force download by creating blob with application/octet-stream MIME type
              const blob = new Blob([responseText], { 
                type: 'application/octet-stream' // Force download instead of display
              });
              
              // Force download by creating object URL and programmatic click
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              
              // Extract and clean filename
              const urlParts = downloadUrl.split('/');
              let filename = urlParts[urlParts.length - 1];
              if (filename.includes('?')) {
                filename = filename.split('?')[0];
              }
              if (!filename || !filename.includes('.')) {
                filename = `${agent.title || 'agent'}.json`;
              }
              
              // Ensure filename has proper extension
              if (!filename.endsWith('.json')) {
                filename = filename.replace(/\.[^/.]+$/, '') + '.json';
              }
              
              link.download = filename;
              link.style.display = 'none';
              
              document.body.appendChild(link);
              link.click();
              
              // Clean up after a short delay
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
            
            // Method 3: Final fallback - Open in new window with instructions
            try {
              console.log('Using final fallback method - opening download URL');
              
              // Create a temporary link element
              const link = document.createElement('a');
              link.href = downloadUrl;
              
              // Extract filename
              const urlParts = downloadUrl.split('/');
              let filename = urlParts[urlParts.length - 1];
              if (filename.includes('?')) {
                filename = filename.split('?')[0];
              }
              if (!filename || !filename.includes('.')) {
                filename = `${agent.title || 'agent'}.json`;
              }
              
              link.download = filename;
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
              link.style.display = 'none';
              
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              showToast('info', '📥 Download link opened in new tab. If the file displays instead of downloading, right-click and select "Save As..." to download the file manually.', {
                autoClose: 12000
              });
              
            } catch (finalError) {
              console.error('All download methods failed:', finalError);
              
              // Show the download URL to user as absolute last resort
              showToast('warning', '⚠️ Automatic download failed due to browser security restrictions. Here is the direct download link: ' + downloadUrl + ' - Please copy and paste this URL in a new tab to download the file.', {
                autoClose: 15000
              });
            }
          }
        } else {
          // No download URL provided
          console.warn('No download URL provided in response');
          showToast('warning', '⚠️ Download processed but no file URL provided. Please check your email or contact support.', {
            autoClose: 8000
          });
        }
      } else {
        // API returned unsuccessful response
        const errorMessage = downloadResult.error || downloadResult.message || 'Download failed';
        console.error('Download API returned error:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error downloading free agent:', error);
      
      // Provide more specific error messages
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

  // Get minimum price
  const getMinimumPrice = () => {
    if (!agent) return 0;
    
    // First check price details for minimum price or base price
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
    
    // Handle standard price field
    if (typeof agent.price === 'number') {
      return agent.price;
    }
    
    if (typeof agent.price === 'string') {
      // Check for free indicators
      if (agent.price === 'Free' || 
          agent.price === 'free' || 
          agent.price === '$0' || 
          agent.price === '0') {
        return 0;
      }
      
      // Try to extract numeric value
      const parsed = parseFloat(agent.price.replace(/[^0-9.]/g, '')) || 0;
      return parsed;
    }
    
    // If price is an object, try to extract basePrice
    if (agent.price && typeof agent.price === 'object') {
      if (agent.price.basePrice !== undefined) {
        return agent.price.basePrice;
      }
    }
    
    // Default to 0 (free) if we can't determine price
    return 0;
  };

  if (loading) {
    return (
      <div className="agent-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading agent details...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="agent-detail-container">
        <div className="error-container">
          <h2>Agent Not Found</h2>
          <p>{error || 'Could not find the agent you\'re looking for.'}</p>
          <Link to="/agents" className="back-button">Return to Agents</Link>
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
        {/* Agent Image Section */}
        <div className="image-slider-section">
          <div className="image-slider" ref={sliderRef}>
            <div className="slider-container">
              <div className="slide">
                <img 
                  ref={imageRef}
                  src={imageUrls[0] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%234a4de7"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="24" text-anchor="middle" fill="white"%3EAgent%3C/text%3E%3C/svg%3E'} 
                  alt={agent.title} 
                  className="slide-image" 
                  onLoad={handleImageLoad}
                  data-aspect={imageAspectRatio}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Agent Info and Purchase Section */}
        <div className="agent-info-section">
          <h1 className="agent-title">{agentTitle}</h1>
          
          <div className="agent-meta-row">
            <div className="price-display">
              {displayPrice(agent)}
            </div>
            
            <div className="creator-info">
              <span className="by-text">by</span>
              <a href="#" className="creator-name">
                {agent.creator?.username || agent.creator?.name || agent.creator?.role || "Unknown Creator"}
              </a>
            </div>
            
            <div className="rating-display">
              <div className="stars">
                <StarRating rating={agentRatingValue} />
              </div>
              <span className="rating-count">({reviewCount || agent?.rating?.count || 0})</span>
              <LikeButton 
                agentId={agentId} 
                initialLikes={likesCount} 
                onLikeUpdate={handleLikeUpdate} 
              />
            </div>
          </div>
          
          <div className="agent-description">
            <p>{agentDescription}</p>
          </div>
          
          <div className="price-purchase-container">
            {isFreeAgent(agent) ? (
              // Free agent - show direct download button
              <div className="free-download-container">
                <div className="free-agent-notice">
                  <span className="free-label">Free</span>
                  <p className="free-description">This agent is available for free</p>
                </div>
                <button 
                  className="download-now-btn"
                  onClick={handleDirectDownload}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Download Now'}
                </button>
              </div>
            ) : (
              // Paid agent - show the normal price input and cart button
              <>
                <div className="name-your-price">
                  <label htmlFor="custom-price" className={darkMode ? 'text-gray-200' : 'text-gray-800'}>Name a fair price:</label>
                  <div className="price-input-container">
                    <span className={`currency-symbol ${darkMode ? 'text-black font-bold' : 'text-gray-800'}`}>$</span>
                    <input 
                      type="number" 
                      id="custom-price" 
                      className={`custom-price-input ${darkMode ? 'dark-input' : ''}`} 
                      value={customPrice}
                      onChange={handlePriceChange}
                      min={minPrice}
                      step="0.01"
                    />
                  </div>
                  <p className={`minimum-price-note ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {agent.priceDetails && agent.priceDetails.basePrice > 0 && 
                     agent.priceDetails.discountedPrice < agent.priceDetails.basePrice ? (
                      <>The minimum price is ${minPrice.toFixed(2)} <span className={`pricing-note ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>(Discounted from ${agent.priceDetails.basePrice.toFixed(2)})</span></>
                    ) : (
                      <>The minimum price is {formatPrice(minPrice)}</>
                    )}
                  </p>
                </div>
                
                <button 
                  className={`add-to-cart-btn ${!isPriceValid() ? 'disabled' : ''}`}
                  disabled={!isPriceValid()}
                  onClick={handleAddToCart}
                >
                  Add to cart
                </button>
              </>
            )}
            
            <div className="downloads-info">
              <FaDownload className="download-icon" />
              <span className="download-count">{downloadCount} downloads</span>
            </div>
          </div>
          
          <div className="file-details-section">
            <div className="file-info">
              <span className="file-detail">{fileDetails}</span>
            </div>
          </div>
          
          <div className="agent-actions">
            <button 
              className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
            >
              {isWishlisted ? <FaHeart /> : <FaRegHeart />}
              <span>{isWishlisted ? 'Added to wishlist' : 'Add to wishlist'}</span>
            </button>
            
            <button className="copy-link-btn" onClick={handleCopyLink}>
              <FaLink />
              <span>{copySuccess || 'Copy link'}</span>
            </button>
            
            <button className="share-btn" onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: agent.title,
                  text: agent.description,
                  url: window.location.href,
                })
                .then(() => {
                  showToast('success', '🔗 Successfully shared!', {
                    icon: "🔗",
                    autoClose: 2000
                  });
                })
                .catch((error) => {
                  console.error('Error sharing:', error);
                  handleCopyLink(); // Fallback to copy link if sharing fails
                });
              } else {
                // Fallback for browsers that don't support navigator.share
                handleCopyLink();
              }
            }}>
              <FaShare />
              <span>Share</span>
            </button>
          </div>
          
          <div className="guarantee-info">
            <p>30-day money back guarantee</p>
          </div>
        </div>
      </div>

      {/* Tabs for different sections */}
      <div className="agent-detail-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews ({reviewCount})
        </button>
        <button 
          className={`tab-button ${activeTab === 'related' ? 'active' : ''}`}
          onClick={() => setActiveTab('related')}
        >
          Related Items
        </button>
      </div>
      
      {/* Tab content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-content">
              {agent.longDescription ? (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(agent.longDescription) 
                  }} 
                />
              ) : (
                <div className="default-overview">
                  <h3>About this agent</h3>
                  <p>{agent.description || 'No detailed description available for this agent.'}</p>
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
              skipExternalFetch={true} /* Add this prop to prevent external fetching */
            />
          </div>
        )}
        
        {activeTab === 'related' && (
          <div className="related-tab">
            <h3 className={`section-heading ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Related Products</h3>
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
                        src={relatedAgent.imageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%234a4de7"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="24" text-anchor="middle" fill="white"%3EAgent%3C/text%3E%3C/svg%3E'} 
                        alt={relatedAgent.title || 'Related Agent'} 
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
              <p className="no-related">No related products found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDetail;