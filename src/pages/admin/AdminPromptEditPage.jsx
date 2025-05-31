import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaSpinner, FaUpload, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import RichTextEditor from '../../components/editor/RichTextEditor';
import './AdminPromptEditPage.css';
import { auth } from '../../utils/firebase';
import AdminLayout from '../../components/layout/AdminLayout';

const AdminPromptEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const isNewPrompt = id === 'new';
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('prompt'); // Default to 'prompt' but allow customization
  const [additionalHTML, setAdditionalHTML] = useState('');
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isNewPrompt ? false : true);
  const [error, setError] = useState(null);
  
  // Categories for prompts
  const CATEGORIES = [
    'Latest Tech',
    'AI Prompts',
    'Creative Writing',
    'Coding Assistant',
    'Image Generation',
    'Marketing',
    'Business',
    'Education',
    'Research'
  ];

  // Fetch prompt data if editing an existing prompt
  useEffect(() => {
    if (isNewPrompt) return;
    
    const fetchPromptData = async () => {
      try {
        setInitialLoading(true);
        const response = await axios.get(`/api/ai-tools/${id}`);
        
        if (response.data.success) {
          const promptData = response.data.data;
          setTitle(promptData.title || '');
          setDescription(promptData.description || '');
          setLink(promptData.link || '');
          setCategory(promptData.category || '');
          setKeyword(promptData.keyword || 'prompt'); // Get keyword from response
          setAdditionalHTML(promptData.additionalHTML || '');
          if (promptData.image) {
            setImagePreview(promptData.image);
          }
        } else {
          setError('Failed to load prompt data');
          toast.error('Failed to load prompt data');
        }
      } catch (err) {
        console.error('Error fetching prompt:', err);
        setError('Error loading prompt data. Please try again.');
        toast.error('Error loading prompt data');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPromptData();
  }, [id, isNewPrompt]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image is too large. Maximum size is 5MB.');
      return;
    }
    
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !description) {
      toast.error('Title and description are required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // For debugging - display what we're sending
      console.log('Submitting prompt with data:', {
        title,
        description,
        link,
        keyword,
        category,
        additionalHTML: additionalHTML ? `${additionalHTML.substring(0, 50)}...` : null,
        hasImageFile: !!imageFile
      });
      
      // Prepare form data for multipart/form-data request (for image upload)
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('link', link || 'https://example.com'); // Ensure link is never empty as API requires it
      formData.append('keyword', keyword); // Use the custom keyword value
      formData.append('category', category || ''); // Ensure category is at least an empty string
      formData.append('additionalHTML', additionalHTML || '');
      
      if (imageFile) {
        formData.append('image', imageFile);
        console.log('Adding image file:', imageFile.name, imageFile.type, imageFile.size);
      }
      
      // Get Firebase auth token
      let token = null;
      try {
        token = await auth.currentUser?.getIdToken(true);
        console.log('Retrieved Firebase token successfully');
      } catch (tokenError) {
        console.error('Error getting Firebase token:', tokenError);
      }
      
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Determine if we should use absolute or relative URL based on environment
      const baseUrl = import.meta.env.VITE_PROXY_TARGET || 'http://localhost:4000';
      const apiUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      console.log(`Using API base URL: ${apiUrl}`);
      
      let response;
      if (isNewPrompt) {
        // Create new prompt - try direct URL first
        const endpoint = `/api/ai-tools`;
        console.log(`Making POST request to: ${endpoint}`);
        
        try {
          response = await axios.post(endpoint, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (directError) {
          console.error('Direct API request failed:', directError);
          console.log('Attempting with absolute URL as fallback');
          
          // Fallback to absolute URL if direct request fails
          response = await axios.post(`${apiUrl}/api/ai-tools`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          });
        }
      } else {
        // Update existing prompt
        const endpoint = `/api/ai-tools/${id}`;
        console.log(`Making PUT request to: ${endpoint}`);
        
        try {
          response = await axios.put(endpoint, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (directError) {
          console.error('Direct API request failed:', directError);
          console.log('Attempting with absolute URL as fallback');
          
          // Fallback to absolute URL if direct request fails
          response = await axios.put(`${apiUrl}/api/ai-tools/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          });
        }
      }
      
      if (response.data.success) {
        toast.success(isNewPrompt ? 'Prompt created successfully' : 'Prompt updated successfully');
        navigate('/admin/prompts');
      } else {
        // Handle API error response
        const errorMsg = response.data.error || 'Failed to save prompt';
        console.error('API returned error:', response.data);
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Error saving prompt:', err);
      
      // Display detailed error information
      let errorMessage = 'Error saving prompt. Please try again.';
      let detailedError = null;
      
      if (err.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        errorMessage = `Server error: ${err.response.status} ${err.response.statusText}`;
        detailedError = {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
          headers: err.response.headers
        };
        console.error('Response error details:', detailedError);
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response received from server. Please check your network connection.';
        console.error('Request was made but no response received:', err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = `Request setup error: ${err.message}`;
        console.error('Error setting up request:', err.message);
      }
      
      // Set the detailed error for display in the UI
      setError({
        message: errorMessage,
        details: detailedError || err.message
      });
      
      // Show a toast with a simplified error message
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="admin-prompt-edit p-6 flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
        <span className="ml-2">Loading prompt data...</span>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-prompt-edit-page">
        <div className="container mx-auto px-4 py-8">
          {/* Back button and page title */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/admin/prompts')}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold">{isNewPrompt ? 'Create New Prompt' : 'Edit Prompt'}</h1>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {typeof error === 'string' ? (
                <p>{error}</p>
              ) : (
                <div>
                  <p className="font-bold">{error.message}</p>
                  {error.details && (
                    <div className="mt-2">
                      <details className="cursor-pointer">
                        <summary className="font-medium text-sm">Show technical details</summary>
                        <pre className="mt-2 p-2 bg-red-50 text-xs overflow-auto max-h-64 rounded">
                          {JSON.stringify(error.details, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter prompt title"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md h-24"
                  placeholder="Enter a brief description"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Keyword</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter keyword (e.g., prompt, tool, generator)"
                />
                <p className="text-sm text-gray-500 mt-1">Used for categorization and search. Default: 'prompt'</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">External Link</label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Image</label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
                  >
                    <FaUpload className="mr-2" />
                    {imageFile ? 'Change Image' : 'Upload Image'}
                  </button>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      <FaTimes />
                      <span className="ml-1">Remove</span>
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                {imagePreview && (
                  <div className="mt-4 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-md h-auto rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Content editor */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Prompt Content</h2>
              <RichTextEditor
                content={additionalHTML}
                onChange={(html) => setAdditionalHTML(html)}
              />
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <FaSpinner className="animate-spin mr-2" />}
                <FaSave className={loading ? 'hidden' : 'mr-2'} />
                {isNewPrompt ? 'Create Prompt' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPromptEditPage;
