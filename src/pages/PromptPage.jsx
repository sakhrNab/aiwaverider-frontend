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
          <p className="text-wrap">Loading prompt...</p>
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
            <h2 className="text-2xl font-bold text-red-500 text-wrap">Error</h2>
          </div>
          <p className="mb-4 text-wrap">{error}</p>
          
          <div className="mt-6 mb-6">
            <h3 className="font-semibold mb-2 text-wrap">Troubleshooting Options:</h3>
            <ul className="list-disc text-left pl-5 mb-4 text-wrap">
              <li>Check if the backend server is running</li>
              <li>Verify that the prompt ID exists in your database</li>
              <li>Try again or use a different prompt</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button 
              onClick={() => navigate('/prompts')} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-wrap"
            >
              Back to Prompts
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-wrap"
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
          <p className="text-wrap">No prompt found with this ID.</p>
          <button 
            onClick={() => navigate('/prompts')} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-wrap"
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
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors text-wrap"
        >
          <FaArrowLeft className="mr-2" />
          Back to Prompts
        </button>
        
        {/* Admin edit button */}
        {isAdmin && (
          <button 
            onClick={handleEditClick} 
            className="absolute top-24 right-6 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-wrap"
          >
            <FaEdit className="mr-2" />
            Edit Prompt
          </button>
        )}

        <div className="prompt-container bg-opacity-80 backdrop-blur-md rounded-xl shadow-2xl p-6 md:p-8 mb-8">
          {/* Header with title and category */}
          <div className="mb-6">
            <div 
              className="page-title-container" 
              style={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                maxWidth: '100%',
                width: '100%'
              }}
            >
              {/* Direct title rendering to bypass PageTitle component issues */}
              <h1 
                className="text-wrap"
                style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  maxWidth: '100%',
                  width: '100%',
                  fontSize: 'clamp(1.5rem, 6vw, 3rem)',
                  lineHeight: '1.2',
                  fontWeight: 'bold',
                  margin: '0',
                  wordBreak: 'break-word'
                }}
              >
                {prompt.title}
              </h1>
              {/* Fallback: Still include PageTitle but hidden, in case it has other functionality */}
              <div style={{ display: 'none' }}>
                <PageTitle title={prompt.title} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {prompt.category && (
                  <div className="category-badge inline-block px-3 py-1 rounded-full text-sm font-medium text-wrap">
                    {prompt.category}
                  </div>
                )}
                {prompt.tags && prompt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {prompt.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full text-wrap flex-shrink-0"
                      >
                        {tag}
                      </span>
                    ))}
                    {prompt.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full text-wrap">
                        +{prompt.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Like button */}
              {user && (
                <button
                  onClick={handleLikeToggle}
                  disabled={likingInProgress}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all flex-shrink-0 ${
                    isLiked 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${likingInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLiked ? <FaHeart /> : <FaRegHeart />}
                  <span className="text-wrap">{likeCount}</span>
                </button>
              )}
              
              {/* Show like count even if user is not logged in */}
              {!user && likeCount > 0 && (
                <div className="flex items-center gap-2 text-gray-600 flex-shrink-0">
                  <FaHeart className="text-red-500" />
                  <span className="text-wrap">{likeCount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Image if available */}


          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 text-wrap">Description</h3>
            <p className="text-lg text-wrap leading-relaxed">{prompt.description}</p>
          </div>

          {/* Keywords if available */}
          {prompt.keywords && prompt.keywords.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-wrap">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {prompt.keywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full text-wrap flex-shrink-0"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author information if available */}
          {(prompt.author || prompt.authorEmail || prompt.authorWebsite) && (
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-wrap">Author Information</h3>
              <div className="space-y-2">
                {prompt.author && (
                  <p className="text-wrap">
                    <strong>Author:</strong> {prompt.author}
                  </p>
                )}
                {prompt.authorEmail && (
                  <p className="text-wrap">
                    <strong>Email:</strong> 
                    <a 
                      href={`mailto:${prompt.authorEmail}`} 
                      className="ml-2 text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {prompt.authorEmail}
                    </a>
                  </p>
                )}
                {prompt.authorWebsite && (
                  <p className="text-wrap">
                    <strong>Website:</strong> 
                    <a 
                      href={prompt.authorWebsite.startsWith('http') ? prompt.authorWebsite : `https://${prompt.authorWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {prompt.authorWebsite}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Usage Instructions if available */}
          {prompt.usageInstructions && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-wrap">Usage Instructions</h3>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-wrap leading-relaxed">{prompt.usageInstructions}</p>
              </div>
            </div>
          )}

          {/* Example Output if available */}
          {prompt.exampleOutput && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-wrap">Example Output</h3>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                <pre className="whitespace-pre-wrap text-wrap font-mono text-sm">{prompt.exampleOutput}</pre>
              </div>
            </div>
          )}

          {/* Prerequisites if available */}
          {prompt.prerequisites && prompt.prerequisites.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-wrap">Prerequisites</h3>
              <ul className="list-disc pl-6 space-y-1">
                {prompt.prerequisites.map((prerequisite, index) => (
                  <li key={index} className="text-wrap">{prerequisite}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Difficulty Level if available */}
          {prompt.difficultyLevel && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-wrap">Difficulty Level</h3>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium text-wrap ${
                prompt.difficultyLevel.toLowerCase() === 'beginner' ? 'bg-green-100 text-green-800' :
                prompt.difficultyLevel.toLowerCase() === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                prompt.difficultyLevel.toLowerCase() === 'advanced' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {prompt.difficultyLevel}
              </div>
            </div>
          )}

          {/* Estimated Time if available */}
          {prompt.estimatedTime && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-wrap">Estimated Time</h3>
              <p className="text-lg text-wrap">
                <i className="far fa-clock mr-2"></i>
                {prompt.estimatedTime}
              </p>
            </div>
          )}

          {/* Main content from additionalHTML */}
          {prompt.additionalHTML && (
            <div className="prompt-content mb-8">
              <h3 className="text-xl font-bold mb-3 text-wrap">Prompt Content</h3>
              <div 
                className="rich-text-content text-wrap" 
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(prompt.additionalHTML) }}
              />
            </div>
          )}

          {/* Related Prompts if available */}
          {prompt.relatedPrompts && prompt.relatedPrompts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-wrap">Related Prompts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prompt.relatedPrompts.map((relatedPrompt, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold mb-2 text-wrap">{relatedPrompt.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-wrap">{relatedPrompt.description}</p>
                    {relatedPrompt.id && (
                      <button
                        onClick={() => navigate(`/prompts/${relatedPrompt.id}`)}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline text-wrap"
                      >
                        View Prompt
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section if available */}
          {prompt.allowComments && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-wrap">Comments</h3>
              <div className="space-y-4">
                {prompt.comments && prompt.comments.length > 0 ? (
                  prompt.comments.map((comment, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <strong className="text-wrap">{comment.author || 'Anonymous'}</strong>
                        <span className="text-sm text-gray-500 text-wrap">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-wrap">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-wrap">No comments yet. Be the first to comment!</p>
                )}
                
                {user && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <textarea
                      className="w-full p-3 border rounded-lg resize-vertical min-h-[100px] text-wrap"
                      placeholder="Add your comment..."
                    />
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-wrap">
                      Post Comment
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Link to external resource if available */}
          {prompt.link && (
            <div className="mt-8 text-center">
              <a 
                href={prompt.link.startsWith('http') ? prompt.link : `https://${prompt.link}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg text-wrap"
              >
                Visit Prompt Source
              </a>
            </div>
          )}

          {/* Download or Copy Button if available */}
          {(prompt.downloadable || prompt.copyable) && (
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              {prompt.downloadable && (
                <button 
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all shadow-lg text-wrap"
                  onClick={() => {
                    // Add download functionality here
                    toast.success('Prompt downloaded!');
                  }}
                >
                  Download Prompt
                </button>
              )}
              {prompt.copyable && (
                <button 
                  className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-all shadow-lg text-wrap"
                  onClick={() => {
                    navigator.clipboard.writeText(prompt.additionalHTML || prompt.description);
                    toast.success('Prompt copied to clipboard!');
                  }}
                >
                  Copy to Clipboard
                </button>
              )}
            </div>
          )}

          {/* Rating System if available */}
          {prompt.allowRating && (
            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-wrap">Rate This Prompt</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="text-2xl text-yellow-400 hover:text-yellow-500 transition-colors"
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 text-wrap">
                  {prompt.averageRating ? `${prompt.averageRating}/5 (${prompt.ratingCount} ratings)` : 'No ratings yet'}
                </span>
              </div>
            </div>
          )}

          {/* Prompt metadata */}
          {(prompt.createdAt || prompt.updatedAt || prompt.viewCount || prompt.downloadCount || prompt.version) && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-3 text-wrap">Prompt Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                {prompt.createdAt && (
                  <div className="text-wrap">
                    <strong>Created:</strong> {new Date(prompt.createdAt.seconds ? prompt.createdAt.seconds * 1000 : prompt.createdAt).toLocaleDateString()}
                  </div>
                )}
                {prompt.updatedAt && (
                  <div className="text-wrap">
                    <strong>Updated:</strong> {new Date(prompt.updatedAt.seconds ? prompt.updatedAt.seconds * 1000 : prompt.updatedAt).toLocaleDateString()}
                  </div>
                )}
                {prompt.viewCount !== undefined && (
                  <div className="text-wrap">
                    <strong>Views:</strong> {prompt.viewCount.toLocaleString()}
                  </div>
                )}
                {prompt.downloadCount !== undefined && (
                  <div className="text-wrap">
                    <strong>Downloads:</strong> {prompt.downloadCount.toLocaleString()}
                  </div>
                )}
                {prompt.version && (
                  <div className="text-wrap">
                    <strong>Version:</strong> {prompt.version}
                  </div>
                )}
                {prompt.language && (
                  <div className="text-wrap">
                    <strong>Language:</strong> {prompt.language}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* License Information if available */}
          {prompt.license && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-2 text-wrap">License</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-wrap">{prompt.license}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptPage;