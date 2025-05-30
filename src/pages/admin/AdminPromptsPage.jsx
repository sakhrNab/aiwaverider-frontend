import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import './AdminPromptsPage.css';

const AdminPromptsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [confirmDelete, setConfirmDelete] = useState(null);
  
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

  // Fetch prompts from AI tools collection where keyword contains 'prompt'
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/ai-tools');
        
        if (response.data.success) {
          // Filter for tools with 'prompt' in the keyword
          const promptTools = response.data.data.filter(tool => 
            tool.keyword?.toLowerCase().includes('prompt')
          );
          setPrompts(promptTools);
        } else {
          setError('Failed to fetch prompts');
        }
      } catch (err) {
        console.error('Error fetching prompts:', err);
        setError('Error fetching prompts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  // Filter prompts based on search term and category
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        prompt.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || prompt.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Handle creating a new prompt
  const handleCreatePrompt = () => {
    navigate('/admin/prompts/new');
  };

  // Handle editing a prompt
  const handleEditPrompt = (id) => {
    navigate(`/admin/prompts/${id}`);
  };

  // Handle prompt deletion
  const confirmDeletePrompt = (prompt) => {
    setConfirmDelete(prompt);
  };

  const handleDeletePrompt = async () => {
    if (!confirmDelete) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`/api/ai-tools/${confirmDelete.id}`);
      
      if (response.data.success) {
        setPrompts(prompts.filter(p => p.id !== confirmDelete.id));
        toast.success('Prompt deleted successfully');
      } else {
        toast.error('Failed to delete prompt');
      }
    } catch (err) {
      console.error('Error deleting prompt:', err);
      toast.error('Error deleting prompt. Please try again.');
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  // Cancel delete confirmation
  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  if (loading && prompts.length === 0) {
    return (
      <div className="admin-prompts-page p-6">
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-3xl text-blue-600" />
          <span className="ml-2">Loading prompts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-prompts-page p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Prompts</h1>
      
      {/* Controls row */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        {/* Create button */}
        <button
          onClick={handleCreatePrompt}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          <FaPlus className="mr-2" />
          Create New Prompt
        </button>
        
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Prompts grid */}
      {filteredPrompts.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No prompts found</p>
          <button
            onClick={handleCreatePrompt}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create your first prompt
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <div 
              key={prompt.id} 
              className="prompt-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform hover:shadow-lg hover:-translate-y-1"
            >
              {/* Prompt image */}
              <div className="h-48 overflow-hidden bg-gray-100">
                {prompt.image ? (
                  <img 
                    src={prompt.image} 
                    alt={prompt.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl">
                    {prompt.title?.charAt(0).toUpperCase() || 'P'}
                  </div>
                )}
              </div>
              
              {/* Prompt content */}
              <div className="p-4 flex-1">
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">{prompt.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{prompt.description}</p>
                
                {prompt.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                    {prompt.category}
                  </span>
                )}
                
                <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleEditPrompt(prompt.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => confirmDeletePrompt(prompt)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete "{confirmDelete.title}"? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePrompt}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromptsPage;
