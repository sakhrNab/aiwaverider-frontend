import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaBell, 
  FaInbox, 
  FaExclamationCircle, 
  FaCalendarAlt,
  FaSpinner,
  FaHeart,
  FaEye,
  FaDownload
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { deletePrompt, refreshPromptsCache } from '../../api/marketplace/promptsApi';
import usePromptsStore from '../../store/usePromptsStore';
import './AdminPromptsPage.css';

const AdminPromptsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const user = currentUser || {
    name: 'Admin User',
    email: 'admin@example.com'
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Use the prompts store
  const {
    prompts,
    isLoading: loading,
    error,
    isLoaded,
    categories,
    totalCount,
    currentPage,
    totalPages,
    pageSize,
    searchQuery,
    filters,
    startListening,
    stopListening,
    setSearchQuery,
    setFilters,
    setPage,
    setPageSize,
    forceRefresh
  } = usePromptsStore();

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

  // Initialize the prompts store when component mounts
  useEffect(() => {
    startListening();
    
    return () => {
      stopListening();
    };
  }, [startListening, stopListening]);

  // Filter prompts based on local search term and category
  const filteredPrompts = prompts.filter(prompt => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      prompt.title.toLowerCase().includes(searchLower) ||
      (prompt.description && prompt.description.toLowerCase().includes(searchLower)) ||
      (prompt.keywords && prompt.keywords.some(kw => kw.toLowerCase().includes(searchLower)));
    
    const matchesCategory = 
      categoryFilter === 'All' || 
      prompt.category === categoryFilter;
      
    return matchesSearch && matchesCategory;
  });

  // Handle create new prompt
  const handleCreatePrompt = () => {
    navigate('/admin/prompts/new');
  };

  // Handle edit prompt
  const handleEditPrompt = (id) => {
    navigate(`/admin/prompts/${id}`);
  };

  // Handle delete prompt
  const confirmDeletePrompt = (prompt) => {
    setConfirmDelete(prompt);
  };

  const handleDeletePrompt = async () => {
    if (!confirmDelete) return;

    try {
      const result = await deletePrompt(confirmDelete.id);
      
      if (result.success) {
        setConfirmDelete(null);
        toast.success('Prompt deleted successfully');
        // Refresh the prompts data
        forceRefresh();
      } else {
        toast.error(result.error || 'Failed to delete prompt');
        setConfirmDelete(null);
      }
    } catch (err) {
      console.error('Error deleting prompt:', err);
      toast.error('Failed to delete prompt');
      setConfirmDelete(null);
    }
  };

  // Cancel delete confirmation
  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  // Handle cache refresh
  const handleRefreshCache = async () => {
    try {
      setRefreshing(true);
      await refreshPromptsCache();
      await forceRefresh();
      toast.success('Prompts cache refreshed successfully');
    } catch (error) {
      console.error('Error refreshing cache:', error);
      toast.error('Failed to refresh cache');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading && !isLoaded) {
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
    <div className="admin-layout bg-gray-100 min-h-screen">
      <AdminSidebar />
      
      <main className="content-area">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-gray-900">Manage Prompts</h1>
              {totalCount > 0 && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {totalCount} total
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleRefreshCache}
                disabled={refreshing}
                className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                title="Refresh cache"
              >
                <FaSpinner className={refreshing ? 'animate-spin' : ''} size={20} />
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <FaBell size={20} />
              </button>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {user?.name || 'User'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={handleCreatePrompt}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaPlus className="mr-2" />
                  Create New Prompt
                </button>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaExclamationCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Prompts grid */}
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
              <FaInbox className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No prompts</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || categoryFilter !== 'All' 
                  ? 'No prompts match your current filters.'
                  : 'Get started by creating a new prompt.'
                }
              </p>
              <div className="mt-6">
                <button
                  onClick={handleCreatePrompt}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                  New Prompt
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt) => (
                <div 
                  key={prompt.id} 
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  {/* Prompt image */}
                  <div className="h-40 bg-gray-100 overflow-hidden">
                    {prompt.image ? (
                      <img 
                        src={prompt.image} 
                        alt={prompt.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-600">
                        <span className="text-white text-4xl font-bold">
                          {prompt.title?.charAt(0).toUpperCase() || 'P'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Prompt content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-base font-medium text-gray-900 line-clamp-1">
                        {prompt.title}
                      </h3>
                      {prompt.isFeatured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {prompt.category || 'General'}
                      </span>
                      {prompt.tags && prompt.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {prompt.description || 'No description available.'}
                    </p>
                    
                    {/* Stats */}
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        {prompt.likeCount > 0 && (
                          <span className="flex items-center">
                            <FaHeart className="mr-1 h-3 w-3 text-red-500" />
                            {prompt.likeCount}
                          </span>
                        )}
                        {prompt.viewCount > 0 && (
                          <span className="flex items-center">
                            <FaEye className="mr-1 h-3 w-3" />
                            {prompt.viewCount}
                          </span>
                        )}
                        {prompt.downloadCount > 0 && (
                          <span className="flex items-center">
                            <FaDownload className="mr-1 h-3 w-3" />
                            {prompt.downloadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="mr-1.5 h-4 w-4 text-gray-400" />
                        <span>
                          {prompt.createdAt ? new Date(
                            prompt.createdAt.seconds ? 
                            prompt.createdAt.seconds * 1000 : 
                            prompt.createdAt
                          ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'Unknown'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPrompt(prompt.id)}
                          className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          aria-label="Edit prompt"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => confirmDeletePrompt(prompt)}
                          className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                          aria-label="Delete prompt"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Delete confirmation modal */}
          {confirmDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                <p className="mb-6">
                  Are you sure you want to delete "{confirmDelete.title}"? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeletePrompt}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPromptsPage;