import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaArrowLeft, FaSpinner, FaExclamationTriangle, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { fetchPromptById, togglePromptLike } from '../api/marketplace/promptsApi';
import './PromptPage.css';
import PageTitle from '../components/common/PageTitle';
import DOMPurify from 'dompurify';
import { toast } from 'react-toastify';

const PromptPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { user, isAdmin } = useAuth();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likingInProgress, setLikingInProgress] = useState(false);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Fetching prompt with ID: ${id}`);
        
        // Fetch prompt using the new prompts API
        const promptData = await fetchPromptById(id);
        
        if (promptData) {
          setPrompt(promptData);
          setLikeCount(promptData.likeCount || 0);
          
          // Check if current user has liked this prompt
          if (user && promptData.likes && Array.isArray(promptData.likes)) {
            setIsLiked(promptData.likes.includes(user.uid));
          }
        } else {
          setError('Prompt not found. Please check the ID and try again.');
        }
      } catch (err) {
        console.error('Error fetching prompt:', err);
        
        if (err.response?.status === 404) {
          setError('Prompt not found. Please check the ID and try again.');
        } else if (err.response?.status === 500) {
          setError('Server error occurred. Please try again later.');
        } else {
          setError('Error loading prompt data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPrompt();
    }
  }, [id, user]);

  const handleEditClick = () => {
    navigate(`/admin/prompts/${id}`);
  };

  const handleLikeToggle = async () => {
    if (!user) {
      toast.error('Please log in to like prompts');
      return;
    }

    if (likingInProgress) return;

    try {
      setLikingInProgress(true);
      
      const result = await togglePromptLike(id);
      
      if (result.success) {
        setIsLiked(result.data.isLiked);
        setLikeCount(result.data.likeCount);
        
        if (result.data.isLiked) {
          toast.success('Prompt liked!');
        } else {
          toast.success('Prompt unliked');
        }
      } else {
        toast.error('Failed to update like status');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like status');
    } finally {
      setLikingInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className={`prompt-page ${darkMode ? 'dark-mode' : 'light-mode'} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl mx-auto mb-4" />
          <p>Loading prompt...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`prompt-page ${darkMode ? 'dark-mode' : 'light-mode'} min-h-screen flex items-center justify-center`}>
        <div className="text-center max-w-lg p-6 rounded-lg shadow-lg bg-opacity-80 backdrop-blur-md error-container">
          <div className="flex items-center justify-center mb-4">
            <FaExclamationTriangle className="text-yellow-500 text-3xl mr-2" />
            <h2 className="text-2xl font-bold text-red-500">Error</h2>
          </div>
          <p className="mb-4">{error}</p>
          
          <div className="mt-6 mb-6">
            <h3 className="font-semibold mb-2">Troubleshooting Options:</h3>
            <ul className="list-disc text-left pl-5 mb-4">
              <li>Check if the backend server is running</li>
              <li>Verify that the prompt ID exists in your database</li>
              <li>Try again or use a different prompt</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button 
              onClick={() => navigate('/prompts')} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Prompts
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className={`prompt-page ${darkMode ? 'dark-mode' : 'light-mode'} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <p>No prompt found with this ID.</p>
          <button 
            onClick={() => navigate('/prompts')} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Prompts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`prompt-page ${darkMode ? 'dark-mode' : 'light-mode'} min-h-screen`}>
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <button 
          onClick={() => navigate('/prompts')} 
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Prompts
        </button>
        
        {/* Admin edit button */}
        {isAdmin && (
          <button 
            onClick={handleEditClick} 
            className="absolute top-24 right-6 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaEdit className="mr-2" />
            Edit Prompt
          </button>
        )}

        <div className="prompt-container bg-opacity-80 backdrop-blur-md rounded-xl shadow-2xl p-6 md:p-8 mb-8">
          {/* Header with title and category */}
          <div className="mb-6">
            <PageTitle title={prompt.title} />  
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                {prompt.category && (
                  <div className="category-badge inline-block px-3 py-1 rounded-full text-sm font-medium">
                    {prompt.category}
                  </div>
                )}
                {prompt.tags && prompt.tags.length > 0 && (
                  <div className="flex gap-2">
                    {prompt.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Like button */}
              {user && (
                <button
                  onClick={handleLikeToggle}
                  disabled={likingInProgress}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isLiked 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${likingInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLiked ? <FaHeart /> : <FaRegHeart />}
                  <span>{likeCount}</span>
                </button>
              )}
              
              {/* Show like count even if user is not logged in */}
              {!user && likeCount > 0 && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FaHeart className="text-red-500" />
                  <span>{likeCount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Image if available */}
          {prompt.image && (
            <div className="prompt-image-container mb-8">
              <img 
                src={prompt.image} 
                alt={prompt.title} 
                className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md" 
              />
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3">Description</h3>
            <p className="text-lg">{prompt.description}</p>
          </div>

          {/* Keywords if available */}
          {prompt.keywords && prompt.keywords.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {prompt.keywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Main content from additionalHTML */}
          {prompt.additionalHTML && (
            <div className="prompt-content">
              <h3 className="text-xl font-bold mb-3">Prompt Content</h3>
              <div 
                className="rich-text-content" 
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(prompt.additionalHTML) }}
              />
            </div>
          )}

          {/* Link to external resource if available */}
          {prompt.link && (
            <div className="mt-8 text-center">
              <a 
                href={prompt.link.startsWith('http') ? prompt.link : `https://${prompt.link}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
              >
                Visit Prompt Source
              </a>
            </div>
          )}

          {/* Prompt metadata */}
          {(prompt.createdAt || prompt.viewCount || prompt.downloadCount) && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                {prompt.createdAt && (
                  <div>
                    <strong>Created:</strong> {new Date(prompt.createdAt.seconds ? prompt.createdAt.seconds * 1000 : prompt.createdAt).toLocaleDateString()}
                  </div>
                )}
                {prompt.viewCount !== undefined && (
                  <div>
                    <strong>Views:</strong> {prompt.viewCount}
                  </div>
                )}
                {prompt.downloadCount !== undefined && (
                  <div>
                    <strong>Downloads:</strong> {prompt.downloadCount}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptPage;