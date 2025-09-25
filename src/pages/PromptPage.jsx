import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaArrowLeft, FaSpinner, FaExclamationTriangle, FaHeart, FaRegHeart, FaTimes, FaSearchPlus, FaSearchMinus, FaExpand, FaCompress } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { fetchPromptById, togglePromptLike, incrementPromptView } from '../api/marketplace/promptsApi';
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
  const [viewIncremented, setViewIncremented] = useState(false);
  
  // Image modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [modalImageAlt, setModalImageAlt] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Drag state for image panning
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [lastDragPosition, setLastDragPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Fetching prompt with ID: ${id}`);
        
        // Fetch prompt using the new prompts API
        const promptData = await fetchPromptById(id);
        
        if (promptData) {
          console.log('📊 Prompt data received:', {
            id: promptData.id,
            title: promptData.title,
            image: promptData.image,
            inputImage: promptData.inputImage,
            hasAdditionalHTML: !!promptData.additionalHTML,
            additionalHTMLLength: promptData.additionalHTML?.length,
            hasInputImage: !!promptData.inputImage,
            hasResultImage: !!promptData.image,
            createdAt: promptData.createdAt,
            updatedAt: promptData.updatedAt,
            viewCount: promptData.viewCount
          });
          
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

  // Increment view count when prompt loads
  useEffect(() => {
    if (prompt && !viewIncremented) {
      const incrementView = async () => {
        try {
          await incrementPromptView(prompt.id);
          setViewIncremented(true);
          console.log('✅ View count incremented for prompt:', prompt.id);
        } catch (error) {
          console.error('❌ Failed to increment view count:', error);
        }
      };
      
      incrementView();
    }
  }, [prompt, viewIncremented]);

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

  // Image modal functions
  const openImageModal = (src, alt) => {
    setModalImageSrc(src);
    setModalImageAlt(alt);
    setIsImageModalOpen(true);
    setZoomLevel(1);
    setIsFullscreen(false);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setModalImageSrc('');
    setModalImageAlt('');
    setZoomLevel(1);
    setIsFullscreen(false);
    setImagePosition({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 5));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.25));
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  // Drag handlers for image panning
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setLastDragPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      e.preventDefault();
      const deltaX = e.clientX - lastDragPosition.x;
      const deltaY = e.clientY - lastDragPosition.y;
      
      setImagePosition(prev => {
        const newX = prev.x + deltaX;
        const newY = prev.y + deltaY;
        
        // Calculate bounds based on zoom level and viewport
        const maxOffset = 200 * zoomLevel; // Allow some overflow for better UX
        
        return {
          x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
          y: Math.max(-maxOffset, Math.min(maxOffset, newY))
        };
      });
      
      setLastDragPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (zoomLevel > 1 && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX, y: touch.clientY });
      setLastDragPosition({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && zoomLevel > 1 && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastDragPosition.x;
      const deltaY = touch.clientY - lastDragPosition.y;
      
      setImagePosition(prev => {
        const newX = prev.x + deltaX;
        const newY = prev.y + deltaY;
        
        // Calculate bounds based on zoom level and viewport
        const maxOffset = 200 * zoomLevel; // Allow some overflow for better UX
        
        return {
          x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
          y: Math.max(-maxOffset, Math.min(maxOffset, newY))
        };
      });
      
      setLastDragPosition({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Handle keyboard shortcuts and modal body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isImageModalOpen) return;

      switch (e.key) {
        case 'Escape':
          closeImageModal();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    // Prevent body scroll when modal is open and add drag event listeners
    if (isImageModalOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.body.style.overflow = 'unset';
    };
  }, [isImageModalOpen, isDragging, zoomLevel, lastDragPosition]);

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
          {/* <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 text-wrap">Description</h3>
            <p className="text-lg text-wrap leading-relaxed">{prompt.description}</p>
          </div> */}

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
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(prompt.additionalHTML, {
                    ADD_ATTR: ['src', 'alt', 'class'],
                    ADD_TAGS: ['img']
                  })
                }}
                onLoad={() => {
                  console.log('✅ additionalHTML rendered');
                  // Check if images are present
                  const images = document.querySelectorAll('.rich-text-content img');
                  console.log('🖼️ Found images in additionalHTML:', images.length);
                  images.forEach((img, index) => {
                    console.log(`📷 Image ${index + 1}:`, {
                      src: img.src.substring(0, 50) + '...',
                      alt: img.alt,
                      className: img.className,
                      naturalWidth: img.naturalWidth,
                      naturalHeight: img.naturalHeight
                    });
                  });
                }}
              />
            </div>
          )}

          {/* Image Comparison Section - Input vs Result */}
          {(prompt.inputImage || prompt.image) && (
            <div className="prompt-images-container mb-8">
              <h3 className="text-xl font-bold mb-6 text-wrap">Visual Comparison</h3>
              
              {/* Show comparison layout only when both images exist */}
              {prompt.inputImage && prompt.image ? (
                <>
                  {/* Image comparison layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Image */}
                    <div className="image-comparison-item">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 text-wrap">Input Image</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full text-wrap">
                          Before
                        </span>
                      </div>
                      <div className="image-wrapper bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-blue-200 dark:border-blue-700">
                        <img 
                          src={prompt.inputImage} 
                          alt={`Input for ${prompt.title}`}
                          className="w-full h-auto max-h-96 object-contain cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                          onClick={() => openImageModal(prompt.inputImage, `Input for ${prompt.title}`)}
                          onLoad={() => console.log('✅ Input image loaded:', prompt.inputImage)}
                          onError={(e) => console.log('❌ Input image failed to load:', e.target.src)}
                          title="Click to open in full screen"
                        />
                      </div>
                    </div>

                    {/* Result Image */}
                    <div className="image-comparison-item">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 text-wrap">Result Image</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-wrap">
                          After
                        </span>
                      </div>
                      <div className="image-wrapper bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-green-200 dark:border-green-700">
                        <img 
                          src={prompt.image} 
                          alt={`Result for ${prompt.title}`}
                          className="w-full h-auto max-h-96 object-contain cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                          onClick={() => openImageModal(prompt.image, `Result for ${prompt.title}`)}
                          onLoad={() => console.log('✅ Result image loaded:', prompt.image)}
                          onError={(e) => console.log('❌ Result image failed to load:', e.target.src)}
                          title="Click to open in full screen"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Comparison instructions */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-blue-600 dark:text-blue-400">← Input</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-500 dark:text-gray-400">Compare the transformation</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-green-600 dark:text-green-400">Result →</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Single image fallback - only show when there's no input image */
                !prompt.inputImage && prompt.image && (
                  <div className="image-comparison-item">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-400 text-wrap">Visual Example</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-wrap">
                        Result
                      </span>
                    </div>
                    <div className="image-wrapper bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-200 dark:border-gray-600">
                <img 
                  src={prompt.image} 
                  alt={prompt.title}
                        className="w-full h-auto max-h-96 object-contain cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                  onClick={() => openImageModal(prompt.image, prompt.title)}
                  onLoad={() => console.log('✅ Main image loaded:', prompt.image)}
                  onError={(e) => console.log('❌ Main image failed to load:', e.target.src)}
                  title="Click to open in full screen"
                />
              </div>
                  </div>
                )
              )}
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
          {(prompt.createdAt || prompt.updatedAt || prompt.viewCount || prompt.version) && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-3 text-wrap">Prompt Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                {prompt.createdAt && (
                  <div className="text-wrap">
                    <strong>Created:</strong> {(() => {
                      try {
                        console.log('🔍 Parsing createdAt:', prompt.createdAt, typeof prompt.createdAt);
                        
                        // Handle Firestore Timestamp objects
                        let date;
                        if (prompt.createdAt.toDate && typeof prompt.createdAt.toDate === 'function') {
                          // Firestore Timestamp object
                          console.log('📅 Using toDate() method');
                          date = prompt.createdAt.toDate();
                        } else if (prompt.createdAt.seconds) {
                          // Timestamp with seconds property
                          console.log('📅 Using seconds property:', prompt.createdAt.seconds);
                          date = new Date(prompt.createdAt.seconds * 1000);
                        } else if (prompt.createdAt._seconds) {
                          // Alternative timestamp format
                          console.log('📅 Using _seconds property:', prompt.createdAt._seconds);
                          date = new Date(prompt.createdAt._seconds * 1000);
                        } else {
                          // Regular date string or number
                          console.log('📅 Using direct date conversion');
                          date = new Date(prompt.createdAt);
                        }
                        
                        console.log('📅 Parsed date:', date, 'isValid:', !isNaN(date.getTime()));
                        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
                      } catch (e) {
                        console.error('Error parsing createdAt:', e);
                        return 'N/A';
                      }
                    })()}
                  </div>
                )}
                {prompt.updatedAt && (
                  <div className="text-wrap">
                    <strong>Updated:</strong> {(() => {
                      try {
                        console.log('🔍 Parsing updatedAt:', prompt.updatedAt, typeof prompt.updatedAt);
                        
                        // Handle Firestore Timestamp objects
                        let date;
                        if (prompt.updatedAt.toDate && typeof prompt.updatedAt.toDate === 'function') {
                          // Firestore Timestamp object
                          console.log('📅 Using toDate() method for updatedAt');
                          date = prompt.updatedAt.toDate();
                        } else if (prompt.updatedAt.seconds) {
                          // Timestamp with seconds property
                          console.log('📅 Using seconds property for updatedAt:', prompt.updatedAt.seconds);
                          date = new Date(prompt.updatedAt.seconds * 1000);
                        } else if (prompt.updatedAt._seconds) {
                          // Alternative timestamp format
                          console.log('📅 Using _seconds property for updatedAt:', prompt.updatedAt._seconds);
                          date = new Date(prompt.updatedAt._seconds * 1000);
                        } else {
                          // Regular date string or number
                          console.log('📅 Using direct date conversion for updatedAt');
                          date = new Date(prompt.updatedAt);
                        }
                        
                        console.log('📅 Parsed updatedAt date:', date, 'isValid:', !isNaN(date.getTime()));
                        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
                      } catch (e) {
                        console.error('Error parsing updatedAt:', e);
                        return 'N/A';
                      }
                    })()}
                  </div>
                )}
                {prompt.viewCount !== undefined && (
                  <div className="text-wrap">
                    <strong>Views:</strong> {prompt.viewCount.toLocaleString()}
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

      {/* Image Modal */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" 
          style={{ 
            position: 'fixed',
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Header Controls Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                {/* Left side - Zoom controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-black/60 backdrop-blur-sm rounded-lg p-1">
                    <button
                      onClick={zoomOut}
                      className="p-2 text-white hover:bg-white/20 rounded-md transition-all duration-200 hover:scale-105"
                      title="Zoom Out (-)"
                    >
                      <FaSearchMinus size={16} />
                    </button>
                    <div className="px-3 py-2 text-white text-sm font-medium min-w-[60px] text-center">
                      {Math.round(zoomLevel * 100)}%
                    </div>
                    <button
                      onClick={zoomIn}
                      className="p-2 text-white hover:bg-white/20 rounded-md transition-all duration-200 hover:scale-105"
                      title="Zoom In (+)"
                    >
                      <FaSearchPlus size={16} />
                    </button>
                  </div>
                  
                  <button
                    onClick={resetZoom}
                    className="px-3 py-2 bg-black/60 backdrop-blur-sm text-white hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105 text-sm font-medium"
                    title="Reset Zoom (0)"
                  >
                    1:1
                  </button>
                </div>

                {/* Right side - Close and fullscreen */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-black/60 backdrop-blur-sm text-white hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105"
                    title="Toggle Fullscreen (F)"
                  >
                    {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
                  </button>
                  <button
                    onClick={closeImageModal}
                    className="p-2 bg-red-600/80 backdrop-blur-sm text-white hover:bg-red-500/80 rounded-lg transition-all duration-200 hover:scale-105"
                    title="Close (Esc)"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Image container */}
            <div 
              className={`flex items-center justify-center w-full h-full ${isFullscreen ? 'p-0' : 'pt-20 pb-16 px-8'} overflow-hidden`}
              style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <img
                src={modalImageSrc}
                alt={modalImageAlt}
                className="max-w-full max-h-full object-contain transition-transform duration-200 shadow-2xl"
                style={{
                  transform: `scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  transformOrigin: 'center',
                  cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                  userSelect: 'none'
                }}
                draggable={false}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              />
            </div>

            {/* Footer Instructions */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-center">
                <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
                  <span className="hidden sm:inline">
                    <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">+</kbd> / <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">-</kbd> to zoom • 
                    <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">0</kbd> reset • 
                    <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">F</kbd> fullscreen • 
                    Drag to pan • <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">Esc</kbd> close
                  </span>
                  <span className="sm:hidden">
                    Pinch to zoom • Drag to pan • <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">Esc</kbd> close
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptPage;