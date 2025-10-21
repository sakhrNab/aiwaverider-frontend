import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaSpinner, FaUpload, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import RichTextEditor from '../../components/editor/RichTextEditor';
import './AdminPromptEditPage.css';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  fetchPromptById, 
  createPrompt, 
  updatePrompt 
} from '../../api/marketplace/promptsApi';

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
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [additionalHTML, setAdditionalHTML] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isNewPrompt ? false : true);
  const [error, setError] = useState(null);
  
  // Categories for prompts
  const CATEGORIES = [
    'AI Prompts',
    'ChatGPT Prompts',
    'AI Art Generator', 
    'Coding Assistant',
    'Business Plan',
    'Creative Writing',
    'Marketing',
    'Productivity',
    'Education',
    'Content Creation'
  ];

  // Fetch prompt data if editing an existing prompt
  useEffect(() => {
    if (isNewPrompt) return;
    
    const fetchPromptData = async () => {
      try {
        setInitialLoading(true);
        const promptData = await fetchPromptById(id);
        
        if (promptData) {
          setTitle(promptData.title || '');
          setDescription(promptData.description || '');
          setLink(promptData.link || '');
          setCategory(promptData.category || '');
          setKeywords(promptData.keywords || []);
          setTags(promptData.tags || []);
          setAdditionalHTML(promptData.additionalHTML || '');
          setIsFeatured(promptData.isFeatured || false);
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

  // Handle adding keywords
  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const keyword = keywordInput.trim();
      if (keyword && !keywords.includes(keyword)) {
        setKeywords([...keywords, keyword]);
        setKeywordInput('');
      }
    }
  };

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  // Handle adding tags
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
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
      
      // Prepare prompt data
      const promptData = {
        title,
        description,
        link: link || '',
        category: category || '',
        keywords: keywords || [],
        tags: tags || [],
        additionalHTML: additionalHTML || '',
        isFeatured: isFeatured
      };
      
      // console.log('Submitting prompt with data:', {
      //   ...promptData,
      //   additionalHTML: promptData.additionalHTML ? `${promptData.additionalHTML.substring(0, 50)}...` : null,
      //   hasImageFile: !!imageFile
      // });
      
      let result;
      if (isNewPrompt) {
        result = await createPrompt(promptData, imageFile);
        toast.success('Prompt created successfully');
      } else {
        result = await updatePrompt(id, promptData, imageFile);
        toast.success('Prompt updated successfully');
      }
      
      if (result) {
        navigate('/admin/prompts');
      }
    } catch (err) {
      console.error('Error saving prompt:', err);
      
      let errorMessage = 'Error saving prompt. Please try again.';
      let detailedError = null;
      
      if (err.response) {
        errorMessage = `Server error: ${err.response.status} ${err.response.statusText}`;
        detailedError = {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
          headers: err.response.headers
        };
        console.error('Response error details:', detailedError);
      } else if (err.request) {
        errorMessage = 'No response received from server. Please check your network connection.';
        console.error('Request was made but no response received:', err.request);
      } else {
        errorMessage = `Request setup error: ${err.message}`;
        console.error('Error setting up request:', err.message);
      }
      
      setError({
        message: errorMessage,
        details: detailedError || err.message
      });
      
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
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-gray-700 font-medium">Featured Prompt</span>
                </label>
                <p className="text-sm text-gray-500 mt-1">Featured prompts appear in the featured section</p>
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

            {/* Keywords and Tags */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Keywords & Tags</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Keywords</label>
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleAddKeyword}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Type keyword and press Enter or comma"
                />
                <p className="text-sm text-gray-500 mt-1">Press Enter or comma to add keywords</p>
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Tags</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Type tag and press Enter or comma"
                />
                <p className="text-sm text-gray-500 mt-1">Press Enter or comma to add tags</p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
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