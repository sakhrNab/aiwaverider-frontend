import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './SearchBar.css';

// SINGLE-RESPONSIBILITY SEARCH: Only handles UI, NO search logic
const SearchBar = ({ onSearch, initialQuery = '', placeholder = "Search agents..." }) => {
  // Local state for the input field ONLY
  const [query, setQuery] = useState(initialQuery || '');
  
  // Initialize with initial query when it changes
  useEffect(() => {
    if (initialQuery !== query) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);
  
  // PURE UI HANDLER: Only updates local state, no search logic
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    
    // Update local state immediately for responsive typing
    setQuery(newValue);
    
    // IMMEDIATELY notify parent of the change (no debouncing here)
    // Parent will handle all debouncing and search logic
    onSearch(newValue, false, false);
  };
  
  // Handle form submission (Enter key) - EXPLICIT ACTION
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Trigger immediate search with explicit submit flag
    onSearch(query, false, true);
  };
  
  // Clear the search input - EXPLICIT ACTION
  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setQuery('');
    onSearch('', true, false); // true = clearing action
  };
  
  // Handle search button click - EXPLICIT ACTION
  const handleSearchButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Trigger immediate search
    onSearch(query, false, true);
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
            spellCheck="false"
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
            type="button"
            className="search-button"
            onClick={handleSearchButtonClick}
            aria-label="Search"
          >
            <FaSearch />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar; 