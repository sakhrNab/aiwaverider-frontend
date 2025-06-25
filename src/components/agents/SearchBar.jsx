import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './SearchBar.css';

// Simple search component with guaranteed typing response
const SearchBar = ({ onSearch, initialQuery = '', placeholder = "Search agents..." }) => {
  // Use a single state value for the input
  const [query, setQuery] = useState(initialQuery || '');
  
  // Initialize with initial query when it changes
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);
  
  // Super simple input change handler - just update the local state
  const handleInputChange = (e) => {
    // Update local state immediately
    setQuery(e.target.value);
    
    // Use a custom DOM event to trigger the search after a delay
    // This approach bypasses React's state management for the search operation
    const element = e.target;
    
    // Use the browser's native setTimeout instead of creating a ref
    setTimeout(() => {
      if (element.value === e.target.value) { // Only if value hasn't changed again
        onSearch(e.target.value);
      }
    }, 500);
  };
  
  // Handle form submission (Enter key or search button click)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    // Pass true as the third parameter to indicate this is an explicit submission
    // which should trigger a jump to the marketplace
    onSearch(query, false, true);
  };
  
  // Clear the search input
  const handleClear = () => {
    setQuery('');
    // Pass true as the second parameter to indicate this is a clear action
    onSearch('', true);
  };
  
  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            className="search-input"
            autoComplete="off"
          />
          {query && (
            <button 
              type="button" 
              className="clear-button" 
              onClick={handleClear}
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
          <button 
            type="submit" 
            className="search-button"
            onClick={(e) => {
              e.preventDefault();
              // Explicitly pass the jump parameter
              onSearch(query, false, true);
            }}
          >
            <FaSearch />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar; 