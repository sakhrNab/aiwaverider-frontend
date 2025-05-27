// src/posts/components/CommentsSection.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { PostsContext } from '../../contexts/PostsContext';
import { useTheme } from '../../contexts/ThemeContext';
import { addComment } from '../../api/content/postApi';
import CommentsList from './CommentsList';
import { toast } from 'react-toastify';

const CommentsSection = ({ postId }) => {
  const { user } = useContext(AuthContext);
  const { fetchBatchComments, addCommentToCache, commentsCache } = useContext(PostsContext);
  const { darkMode } = useTheme();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const initRef = useRef(false);
  const mounted = useRef(true);

  // Handle auth required actions
  const handleAuthRequired = (action) => {
    if (!user) {
      toast.info(
        <div>
          Please <a href="/signin" className="text-blue-500 hover:text-blue-700">sign in</a> or{' '}
          <a href="/signup" className="text-blue-500 hover:text-blue-700">sign up</a> to {action}.
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return false;
    }
    return true;
  };

  // Load comments with cache optimization
  useEffect(() => {
    // Set up mounted flag for cleanup
    mounted.current = true;
    let timeoutId = null;

    const loadComments = async () => {
      if (!postId) {
        console.log('[CommentsSection] No postId provided, skipping comment load');
        setIsLoading(false);
        return;
      }
      
      // Skip if already initialized - this prevent double loading
      if (initRef.current) {
        console.log(`[CommentsSection] Comments already initialized for post ${postId}, skipping reload`);
        return;
      }
      
      try {
        console.log(`[CommentsSection] Loading comments for post ${postId}`);
        setIsLoading(true);
        
        // Check cache first and use it immediately to show content
        if (commentsCache[postId] && Array.isArray(commentsCache[postId])) {
          console.log(`[CommentsSection] Found ${commentsCache[postId].length} cached comments for post ${postId}`);
          setComments(commentsCache[postId]);
          
          // If cache is fresh (less than 30 seconds old), don't fetch fresh data right away
          const lastFetchTime = localStorage.getItem(`commentsLastFetch_${postId}`);
          if (lastFetchTime && (Date.now() - parseInt(lastFetchTime)) < 30000) {
            console.log('[CommentsSection] Using fresh cache for comments, fetching in background');
          setIsLoading(false);
          }
        } else {
          console.log(`[CommentsSection] No cached comments found for post ${postId}`);
        }
        
        // Set a timeout to stop loading state after 10 seconds to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (mounted.current && isLoading) {
            console.log('[CommentsSection] Timeout reached, stopping loading state');
            setIsLoading(false);
            setError('Comments are taking longer than expected to load. Please try refreshing.');
          }
        }, 10000);

        try {
          // Always fetch fresh comments, even if we have cache
          console.log(`[CommentsSection] Fetching fresh comments for post ${postId}`);
          const commentsMap = await fetchBatchComments([postId], false);
          
          if (!mounted.current) {
            console.log('[CommentsSection] Component unmounted before fetch completed');
            return;
          }
            
          if (commentsMap && commentsMap[postId]) {
            console.log(`[CommentsSection] Received ${commentsMap[postId].length} fresh comments for post ${postId}`);
            
            // Update state with fresh comments
            setComments(commentsMap[postId]);
            
            // Save the fetch time
            localStorage.setItem(`commentsLastFetch_${postId}`, Date.now().toString());
            setError(''); // Clear any previous errors
          } else {
            console.log(`[CommentsSection] No comments returned for post ${postId}`);
            // If we don't get comments, keep current cached comments if available
            if (!commentsCache[postId] || !Array.isArray(commentsCache[postId])) {
              setComments([]);
            }
          }
        } catch (fetchErr) {
          console.error(`[CommentsSection] Error fetching fresh comments for post ${postId}:`, fetchErr);
          // Keep using cached comments if available, just show a warning
          if (commentsCache[postId] && Array.isArray(commentsCache[postId])) {
            toast.warn('Using cached comments - unable to refresh from the server.');
          } else {
            // Only show error if we don't have cached comments
            setError('Unable to load comments. Please try again later.');
          }
        }
      } catch (err) {
        if (mounted.current) {
          setError('Failed to load comments. Please try again later.');
          console.error(`[CommentsSection] Error loading comments for post ${postId}:`, err);
        }
      } finally {
        if (mounted.current) {
          setIsLoading(false);
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          // Mark as initialized
          initRef.current = true;
        }
      }
    };

    // Load comments immediately
    loadComments();

    // Clean up function
    return () => { 
      mounted.current = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      console.log(`[CommentsSection] Unmounting comments section for post ${postId}`);
    };
  }, [postId, fetchBatchComments, commentsCache]);

  // Update local comments when cache changes
  useEffect(() => {
    if (commentsCache[postId] && Array.isArray(commentsCache[postId])) {
      console.log(`[CommentsSection] Updating comments from cache change for post ${postId}, count: ${commentsCache[postId].length}`);
      setComments(commentsCache[postId]);
    }
  }, [commentsCache, postId]);

const handleAddComment = async () => {
  if (!newComment.trim()) return;
  
  if (!handleAuthRequired('add a comment')) return;

  try {
    const response = await addComment(postId, { commentText: newComment.trim() });
    console.log('Add comment response:', response); // Debug log
    
    // Check the structure of the response
    const commentData = response?.comment || response;
    
    if (commentData) {
      // Update local state first for immediate feedback
      console.log('Adding comment to local state:', commentData);
      setComments(prev => [commentData, ...prev]);
      
      // Then update cache
      console.log('Adding comment to cache:', commentData);
      addCommentToCache(postId, commentData);
      setNewComment('');
      setError('');
    } else {
      console.error('Invalid comment data in response:', response);
      toast.error('Failed to add comment. Invalid response from server.');
    }
  } catch (err) {
    console.error('Error adding comment:', err);
    setError('Failed to add comment. Please try again.');
    toast.error('Failed to add comment. Please try again.');
  }
};

  return (
    <div className={`mt-6 ${darkMode ? 'comments-section-dark' : 'comments-section-light'}`}>
      <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Comments ({comments?.length || 0})</h2>
      
      {/* Add comment section - always visible but conditionally enabled */}
      <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          className={`w-full p-2 border rounded resize-none transition-colors ${
            user ? (darkMode ? 'bg-gray-700 text-white border-gray-600 hover:border-blue-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400' : 'bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500') : (darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100')
          }`}
          placeholder={user ? "Write a comment..." : "Sign in to comment"}
          disabled={!user}
          rows="3"
        />
<div className="mt-2 flex justify-between items-center">
          <button
            onClick={handleAddComment}
            className={`px-4 py-2 rounded transition-colors ${
              user && newComment.trim()
                ? (darkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-blue-600 text-white hover:bg-blue-700')
                : (darkMode ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-600 cursor-not-allowed')
            }`}
            disabled={!user || !newComment.trim()}
          >
            {user ? 'Add Comment' : 'Sign in to Comment'}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>

      {/* Comments list */}
      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : comments.length === 0 ? (
        <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          No comments yet. {user ? 'Be the first to comment!' : 'Sign in to be the first to comment!'}
        </p>
      ) : (
        <CommentsList 
          postId={postId} 
          comments={comments} 
          onAuthRequired={handleAuthRequired}
        />
      )}
    </div>
  );
};

export default CommentsSection;
