import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaArrowLeft, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './PromptPage.css';
import PageTitle from '../components/common/PageTitle';
import DOMPurify from 'dompurify';
// Import Firebase for direct Firestore access as fallback
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

// Import useAIToolsStore for local storage fallback
import useAIToolsStore from '../store/useAIToolsStore';

const PromptPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { user, isAdmin } = useAuth();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get tools from the local store for fallback
  const { tools } = useAIToolsStore();

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Fetching prompt with ID: ${id}`);
        
        try {
          // First attempt: Try the API endpoint
          console.log('Attempting to fetch via API...');
          const response = await axios.get(`/api/ai-tools/${id}`);
          
          if (response.data.success && response.data.data) {
            // Check if this is a prompt type tool
            const tool = response.data.data;
            if (tool.keyword?.toLowerCase().includes('prompt')) {
              setPrompt(tool);
            } else {
              setError('This is not a prompt tool');
              setTimeout(() => navigate('/ai-tools'), 3000);
            }
          } else {
            setError('Failed to load prompt data');
          }
        } catch (apiError) {
          console.error('API fetch error:', apiError);
          
          // Second attempt: Try direct Firestore access as fallback
          console.log('API failed, attempting direct Firestore access...');
          try {
            // Get the document directly from Firestore
            const docRef = doc(db, 'ai_tools', id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              const toolData = docSnap.data();
              const formattedTool = {
                id: docSnap.id,
                ...toolData
              };
              
              console.log('Firestore direct access succeeded:', formattedTool);
              
              // Check if this is a prompt type tool
              if (formattedTool.keyword?.toLowerCase().includes('prompt')) {
                setPrompt(formattedTool);
              } else {
                setError('This is not a prompt tool');
                setTimeout(() => navigate('/ai-tools'), 3000);
              }
            } else {
              console.error('Document does not exist in Firestore');
              
              // Third attempt: Try local store data as final fallback
              console.log('Firestore failed, checking local store data...');
              const localPrompt = tools.find(tool => tool.id === id);
              
              if (localPrompt) {
                console.log('Found prompt in local store:', localPrompt);
                
                // Check if this is a prompt type tool
                if (localPrompt.keyword?.toLowerCase().includes('prompt')) {
                  setPrompt(localPrompt);
                } else {
                  setError('This is not a prompt tool');
                  setTimeout(() => navigate('/ai-tools'), 3000);
                }
              } else {
                setError('Prompt not found. Please check the ID and try again.');
              }
            }
          } catch (firestoreError) {
            console.error('Firestore direct access error:', firestoreError);
            
            // Third attempt: Try local store data as final fallback
            console.log('Firestore failed, checking local store data...');
            const localPrompt = tools.find(tool => tool.id === id);
            
            if (localPrompt) {
              console.log('Found prompt in local store:', localPrompt);
              
              // Check if this is a prompt type tool
              if (localPrompt.keyword?.toLowerCase().includes('prompt')) {
                setPrompt(localPrompt);
              } else {
                setError('This is not a prompt tool');
                setTimeout(() => navigate('/ai-tools'), 3000);
              }
            } else {
              // All fallbacks failed
              setError('Error loading prompt data. All attempts failed.');
            }
          }
        }
      } catch (err) {
        console.error('Unhandled error in fetch process:', err);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPrompt();
    }
  }, [id, navigate]);

  const handleEditClick = () => {
    navigate(`/admin/prompts/${id}`);
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
              onClick={() => navigate('/ai-tools')} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to AI Tools
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
            onClick={() => navigate('/ai-tools')} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to AI Tools
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
          onClick={() => navigate('/ai-tools')} 
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to AI Tools
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
            {prompt.category && (
              <div className="category-badge inline-block px-3 py-1 rounded-full text-sm font-medium">
                {prompt.category}
              </div>
            )}
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

          {/* Main content from additionalHTML */}
          {prompt.additionalHTML && (
            <div className="prompt-content">
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
        </div>
      </div>
    </div>
  );
};

export default PromptPage;
