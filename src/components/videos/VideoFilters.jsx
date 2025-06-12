import React from 'react';
import { FaSlidersH, FaTag, FaUserAlt, FaYoutube, FaTiktok, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

const VideoFilters = ({ categories, platforms, users, filters, onFilterChange, darkMode }) => {
  // Platform icon mapping  
  const platformIcon = (platform) => {
    switch(platform.toLowerCase()) {
      case 'youtube': return <FaYoutube className="text-red-500 dark:text-red-400" />;
      case 'tiktok': return <FaTiktok className="text-gray-700 dark:text-gray-300" />;
      case 'instagram': return <FaInstagram className="text-purple-600 dark:text-purple-400" />;
      default: return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`mb-6 p-5 rounded-xl shadow-md backdrop-blur-md ${darkMode ? 'bg-gray-900/60 border border-gray-800/40' : 'bg-white/80 border border-gray-100/40'}`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5">
        <h2 className={`text-lg font-semibold flex items-center ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 md:mb-0`}>
          <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'} flex items-center justify-center mr-3`}>
            <FaSlidersH className={`${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
          </div>
          Filter Videos
        </h2>
        
        {/* Reset filters button */}
        {(filters.category || filters.platform || filters.user) && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onFilterChange({
                category: '',
                platform: '',
                user: ''
              });
            }}
            className={`text-sm py-1 px-3 rounded-full ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}
          >
            Reset All
          </motion.button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Category Filter */}
        <div className="relative">
          <div className="flex items-center mb-2">
            <FaTag className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'} text-sm`} />
            <label htmlFor="category" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
          </div>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => onFilterChange({
              ...filters,
              category: e.target.value
            })}
            className={`w-full p-2.5 rounded-lg appearance-none focus:ring-2 focus:outline-none ${darkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-indigo-600' : 'bg-white border-gray-200 text-gray-800 focus:ring-blue-500'} border pl-4 pr-10`}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6">
            <svg className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        
        {/* Platform Filter */}
        <div className="relative">
          <div className="flex items-center mb-2">
            <div className="mr-2 flex">
              <FaYoutube className="text-red-500 dark:text-red-400 text-sm mr-0.5" />
              <FaTiktok className="text-gray-700 dark:text-gray-300 text-sm mr-0.5" />
              <FaInstagram className="text-purple-600 dark:text-purple-400 text-sm" />
            </div>
            <label htmlFor="platform" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Platform</label>
          </div>
          <select
            id="platform"
            value={filters.platform}
            onChange={(e) => onFilterChange({
              ...filters,
              platform: e.target.value
            })}
            className={`w-full p-2.5 rounded-lg appearance-none focus:ring-2 focus:outline-none ${darkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-indigo-600' : 'bg-white border-gray-200 text-gray-800 focus:ring-blue-500'} border pl-4 pr-10`}
          >
            <option value="">All Platforms</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6">
            <svg className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        
        {/* User Filter */}
        <div className="relative">
          <div className="flex items-center mb-2">
            <FaUserAlt className={`mr-2 ${darkMode ? 'text-green-400' : 'text-green-500'} text-sm`} />
            <label htmlFor="user" className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Added By</label>
          </div>
          <select
            id="user"
            value={filters.user}
            onChange={(e) => onFilterChange({
              ...filters,
              user: e.target.value
            })}
            className={`w-full p-2.5 rounded-lg appearance-none focus:ring-2 focus:outline-none ${darkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-indigo-600' : 'bg-white border-gray-200 text-gray-800 focus:ring-blue-500'} border pl-4 pr-10`}
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6">
            <svg className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Active filter indicators */}
      {(filters.category || filters.platform || filters.user) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.category && (
            <motion.span 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`inline-flex items-center text-xs px-3 py-1.5 rounded-full ${darkMode ? 'bg-blue-900/40 text-blue-200' : 'bg-blue-100 text-blue-700'}`}
            >
              <FaTag className="mr-1.5" />
              {filters.category}
              <button 
                className="ml-1.5 hover:text-red-500" 
                onClick={() => onFilterChange({
                  ...filters,
                  category: ''
                })}
                aria-label="Remove category filter"
              >
                ×
              </button>
            </motion.span>
          )}
          
          {filters.platform && (
            <motion.span 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`inline-flex items-center text-xs px-3 py-1.5 rounded-full ${darkMode ? 'bg-purple-900/40 text-purple-200' : 'bg-purple-100 text-purple-700'}`}
            >
              {platformIcon(filters.platform)}
              <span className="mx-1.5">{filters.platform.charAt(0).toUpperCase() + filters.platform.slice(1)}</span>
              <button 
                className="hover:text-red-500" 
                onClick={() => onFilterChange({
                  ...filters,
                  platform: ''
                })}
                aria-label="Remove platform filter"
              >
                ×
              </button>
            </motion.span>
          )}
          
          {filters.user && (
            <motion.span 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`inline-flex items-center text-xs px-3 py-1.5 rounded-full ${darkMode ? 'bg-green-900/40 text-green-200' : 'bg-green-100 text-green-700'}`}
            >
              <FaUserAlt className="mr-1.5" />
              {filters.user}
              <button 
                className="ml-1.5 hover:text-red-500" 
                onClick={() => onFilterChange({
                  ...filters,
                  user: ''
                })}
                aria-label="Remove user filter"
              >
                ×
              </button>
            </motion.span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default VideoFilters;
