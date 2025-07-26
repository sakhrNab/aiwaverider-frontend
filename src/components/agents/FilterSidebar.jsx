import React, { useState, useEffect } from 'react';
import './FilterSidebar.css';
import { FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FilterSidebar = ({ 
  selectedTags = [], 
  onTagChange, 
  selectedFeatures = [],
  onFeatureChange, 
  selectedRating = 0, 
  onRatingChange,
  selectedPrice = { min: 0, max: 1000 },
  onPriceChange,
  tagCounts = {},
  featureCounts = {}
}) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [tagOptions, setTagOptions] = useState([]);
  const [featureOptions, setFeatureOptions] = useState([]);
  const [price, setPrice] = useState({
    min: selectedPrice.min || 0,
    max: selectedPrice.max || 1000
  });

  // Update price state when selectedPrice prop changes
  useEffect(() => {
    if (selectedPrice && typeof selectedPrice === 'object') {
      setPrice({
        min: selectedPrice.min || 0,
        max: selectedPrice.max || 1000
      });
    }
  }, [selectedPrice]);

  // Update tag options based on provided counts with improved sorting
  useEffect(() => {
    if (Object.keys(tagCounts).length > 0) {
      const dynamicTags = Object.entries(tagCounts).map(([name, count]) => ({
        name,
        count
      }));
      
      // Enhanced sorting: Featured categories first, then alphabetical, "Others" at end
      dynamicTags.sort((a, b) => {
        const nameA = a.name && a.name.trim() ? a.name : 'Others';
        const nameB = b.name && b.name.trim() ? b.name : 'Others';
        
        if (nameA === 'Others' && nameB !== 'Others') return 1;
        if (nameA !== 'Others' && nameB === 'Others') return -1;
        
        const priorityCategories = ['Technology', 'Business', 'Productivity', 'Creative', 'Education', 'Marketing', 'Finance'];
        const aIsPriority = priorityCategories.includes(nameA);
        const bIsPriority = priorityCategories.includes(nameB);
        
        if (aIsPriority && !bIsPriority) return -1;
        if (!aIsPriority && bIsPriority) return 1;
        
        if (aIsPriority && bIsPriority) {
          return priorityCategories.indexOf(nameA) - priorityCategories.indexOf(nameB);
        }
        
        return nameA.localeCompare(nameB);
      });
      
      setTagOptions(dynamicTags);
    } else {
      setTagOptions([]);
    }
  }, [tagCounts]);
  
  // Update feature options based on provided counts with improved sorting
  useEffect(() => {
    if (Object.keys(featureCounts).length > 0) {
      const dynamicFeatures = Object.entries(featureCounts).map(([name, count]) => ({
        name,
        count
      }));
      
      dynamicFeatures.sort((a, b) => {
        const nameA = a.name && a.name.trim() ? a.name : 'Others';
        const nameB = b.name && b.name.trim() ? b.name : 'Others';
        
        if (nameA === 'Others' && nameB !== 'Others') return 1;
        if (nameA !== 'Others' && nameB === 'Others') return -1;
        
        const priorityFeatures = ['Free', 'Subscription', 'API Integration', 'Automation', 'Analytics', 'Real-time', 'Cloud-based'];
        const aIsPriority = priorityFeatures.includes(nameA);
        const bIsPriority = priorityFeatures.includes(nameB);
        
        if (aIsPriority && !bIsPriority) return -1;
        if (!aIsPriority && bIsPriority) return 1;
        
        if (aIsPriority && bIsPriority) {
          return priorityFeatures.indexOf(nameA) - priorityFeatures.indexOf(nameB);
        }
        
        return nameA.localeCompare(nameB);
      });
      
      setFeatureOptions(dynamicFeatures);
    } else {
      setFeatureOptions([]);
    }
  }, [featureCounts]);

  // Optimized price change handler with debouncing
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const newValue = Number(value);
    
    if (isNaN(newValue) || newValue < 0) return;
    
    const newPrice = { ...price, [name]: newValue };
    setPrice(newPrice);
    
    // Debounced update to parent component
    if (onPriceChange) {
      if (handlePriceChange.timeout) {
        clearTimeout(handlePriceChange.timeout);
      }
      
      handlePriceChange.timeout = setTimeout(() => {
        onPriceChange(newPrice);
      }, 500);
    }
  };

  const getVisibleTags = () => {
    return showAllTags ? tagOptions : tagOptions.slice(0, 8);
  };

  const getVisibleFeatures = () => {
    return showAllFeatures ? featureOptions : featureOptions.slice(0, 5);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "star filled" : "star empty"}>
          ★
        </span>
      );
    }
    return stars;
  };
  
  const handleTagSelect = (tag) => {
    if (onTagChange) {
      onTagChange(tag);
    }
  };
  
  const handleFeatureSelect = (feature) => {
    if (onFeatureChange) {
      onFeatureChange(feature);
    }
  };
  
  const handleRatingSelect = (rating) => {
    if (onRatingChange) {
      onRatingChange(rating);
    }
  };

  // Enhanced price range preset options
  const pricePresets = [
    { label: 'All Prices', min: 0, max: 1000 },
    { label: 'Free', min: 0, max: 0 },
    { label: '$1 - $10', min: 1, max: 10 },
    { label: '$10 - $50', min: 10, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100+', min: 100, max: 1000 },
  ];

  // Get current price preset label
  const getCurrentPriceLabel = () => {
    const currentPreset = pricePresets.find(preset => 
      preset.min === price.min && preset.max === price.max
    );
    return currentPreset ? currentPreset.label : 'Custom Range';
  };

  // Check if any filters are active
  const hasActiveFilters = selectedTags.length > 0 || selectedFeatures.length > 0 || selectedRating > 0 || 
    !(selectedPrice.min === 0 && selectedPrice.max === 1000);

  const activeFilterCount = selectedTags.length + selectedFeatures.length + 
    (selectedRating > 0 ? 1 : 0) + (!(selectedPrice.min === 0 && selectedPrice.max === 1000) ? 1 : 0);

  return (
    <div className="filter-sidebar">
      <div className="filter-header-main">
        <h2>Filters</h2>
        {hasActiveFilters && (
          <span className="active-filters-count">
            {activeFilterCount} active
          </span>
        )}
      </div>
      
      {/* Price Range Filter */}
      <div className="filter-section">
        <div className="filter-header">
          <h3>Price Range</h3>
        </div>
        <div className="filter-content">
          <div className="price-range-selector">
            <select 
              className="price-range-dropdown"
              value={`${price.min}-${price.max}`}
              onChange={(e) => {
                const selectedPreset = pricePresets.find(preset => 
                  `${preset.min}-${preset.max}` === e.target.value
                );
                if (selectedPreset) {
                  const newPrice = { min: selectedPreset.min, max: selectedPreset.max };
                  setPrice(newPrice);
                  if (onPriceChange) {
                    onPriceChange(newPrice);
                  }
                }
              }}
            >
              {pricePresets.map((preset) => (
                <option key={`${preset.min}-${preset.max}`} value={`${preset.min}-${preset.max}`}>
                  {preset.label}
                </option>
              ))}
            </select>
            {!(price.min === 0 && price.max === 1000) && (
              <div className="active-price-display">
                Active: {getCurrentPriceLabel()}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Rating Filter */}
      <div className="filter-section">
        <div className="filter-header">
          <h3>Rating</h3>
        </div>
        <div className="filter-content">
          <div className="rating-selector">
            <select 
              className="rating-dropdown"
              value={selectedRating}
              onChange={(e) => handleRatingSelect(Number(e.target.value))}
            >
              <option value="0">Any Rating</option>
              <option value="4">★★★★☆ & Up (4+)</option>
              <option value="3">★★★☆☆ & Up (3+)</option>
              <option value="2">★★☆☆☆ & Up (2+)</option>
              <option value="1">★☆☆☆☆ & Up (1+)</option>
            </select>
            {selectedRating > 0 && (
              <div className="active-rating-display">
                Active: {selectedRating}+ stars
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Popular Tags Filter */}
       {/*<div className="filter-section">
        <div className="filter-header">
          <h3>Popular Tags</h3>
          {tagOptions.length > 8 && (
            <button 
              className="expand-button"
              onClick={() => setShowAllTags(!showAllTags)}
              aria-label={showAllTags ? "Show fewer tags" : "Show more tags"}
            >
              {showAllTags ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          )}
        </div>
        <div className="filter-content">
          {tagOptions.length === 0 ? (
            <div className="no-data-message">
              No tags available
            </div>
          ) : (
            <div className="tag-cloud">
              {getVisibleTags().map((tag) => {
                const displayName = tag.name && tag.name.trim() ? tag.name : 'Others';
                const isSelected = selectedTags.includes(tag.name);
                
                return (
                  <button 
                    key={tag.name || 'Others'} 
                    className={`tag-button ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleTagSelect(tag.name)}
                    title={`${displayName} (${tag.count} agents)`}
                  >
                    <span className="tag-name">{displayName}</span>
                    <span className="tag-count">({tag.count})</span>
                    {isSelected && <FaCheck className="tag-check" />}
                  </button>
                );
              })}
              
              {tagOptions.length > 8 && (
                <button 
                  className="tag-button more-button"
                  onClick={() => setShowAllTags(!showAllTags)}
                >
                  {showAllTags ? (
                    <>
                      <FaChevronUp className="more-icon" />
                      <span>Show Less</span>
                    </>
                  ) : (
                    <>
                      <FaChevronDown className="more-icon" />
                      <span>+{tagOptions.length - 8} More</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
          
          Selected tags display *
          {selectedTags.length > 0 && (
            <div className="selected-tags">
              <div className="selected-tags-list">
                {selectedTags.map((tag) => (
                  <div key={tag} className="selected-tag">
                    <span>{tag}</span>
                    <button 
                      onClick={() => handleTagSelect(tag)}
                      className="remove-tag"
                      aria-label={`Remove ${tag} filter`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      /}
      {/* Features Filter */}
      <div className="filter-section">
        <div className="filter-header">
          <h3>Features</h3>
        </div>
        <div className="filter-content">
          {featureOptions.length === 0 ? (
            <div className="no-data-message">
              No features available
            </div>
          ) : (
            <div className="feature-selector">
              <select 
                className="feature-dropdown"
                value=""
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  if (selectedValue) {
                    handleFeatureSelect(selectedValue);
                  }
                }}
              >
                <option value="">Select a feature</option>
                {featureOptions.map((feature) => {
                  const displayName = feature.name && feature.name.trim() ? feature.name : 'Others';
                  const isSelected = selectedFeatures.includes(feature.name);
                  return (
                    <option 
                      key={feature.name || 'Others'} 
                      value={feature.name}
                      disabled={isSelected}
                    >
                      {displayName} ({feature.count}) {isSelected ? '✓' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          
          {selectedFeatures.length > 0 && (
            <div className="selected-features">
              {selectedFeatures.map((feature) => (
                <div key={feature} className="selected-feature">
                  <span>{feature}</span>
                  <button 
                    onClick={() => handleFeatureSelect(feature)}
                    className="remove-feature"
                    aria-label={`Remove ${feature} filter`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Clear All Filters */}
      {hasActiveFilters && (
        <div className="filter-actions">
          <button 
            className="clear-all-button"
            onClick={() => {
              // Reset all filters
              if (onTagChange) {
                selectedTags.forEach(tag => onTagChange(tag));
              }
              if (onFeatureChange) {
                selectedFeatures.forEach(feature => onFeatureChange(feature));
              }
              if (onRatingChange) {
                onRatingChange(0);
              }
              if (onPriceChange) {
                onPriceChange({ min: 0, max: 1000 });
              }
            }}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;