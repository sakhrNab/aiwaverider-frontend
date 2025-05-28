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

  // Update tag options based on provided counts
  useEffect(() => {
    // Use dynamic counts from props
    if (Object.keys(tagCounts).length > 0) {
      const dynamicTags = Object.entries(tagCounts).map(([name, count]) => ({
        name,
        count
      }));
      
      // Sort alphabetically by name, but put "Others" at the end
      dynamicTags.sort((a, b) => {
        // Handle empty names as "Others"
        const nameA = a.name && a.name.trim() ? a.name : 'Others';
        const nameB = b.name && b.name.trim() ? b.name : 'Others';
        
        // Always put "Others" at the end
        if (nameA === 'Others' && nameB !== 'Others') return 1;
        if (nameA !== 'Others' && nameB === 'Others') return -1;
        
        // Standard alphabetical sort for everything else
        return nameA.localeCompare(nameB);
      });
      
      setTagOptions(dynamicTags);
    } else {
      setTagOptions([]);
    }
  }, [tagCounts]);
  
  // Update feature options based on provided counts
  useEffect(() => {
    // Use dynamic counts from props
    if (Object.keys(featureCounts).length > 0) {
      const dynamicFeatures = Object.entries(featureCounts).map(([name, count]) => ({
        name,
        count
      }));
      
      // Sort alphabetically by name, but put "Others" at the end
      dynamicFeatures.sort((a, b) => {
        // Handle empty names as "Others"
        const nameA = a.name && a.name.trim() ? a.name : 'Others';
        const nameB = b.name && b.name.trim() ? b.name : 'Others';
        
        // Always put "Others" at the end
        if (nameA === 'Others' && nameB !== 'Others') return 1;
        if (nameA !== 'Others' && nameB === 'Others') return -1;
        
        // Standard alphabetical sort for everything else
        return nameA.localeCompare(nameB);
      });
      
      setFeatureOptions(dynamicFeatures);
    } else {
      setFeatureOptions([]);
    }
  }, [featureCounts]);

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const newValue = Number(value);
    
    // Validate input
    if (isNaN(newValue) || newValue < 0) return;
    
    const newPrice = { ...price, [name]: newValue };
    setPrice(newPrice);
    
    // Only update parent component after user has stopped typing (debounce)
    if (onPriceChange) {
      onPriceChange(newPrice);
    }
  };

  const getVisibleTags = () => {
    return showAllTags ? tagOptions : tagOptions.slice(0, 5);
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

  return (
    <div className="filter-sidebar">
      <div className="filter-header-main">
        <h2>Filters</h2>
      </div>
      
      <div className="filter-section">
        <div className="filter-header" onClick={() => {}}>
          <h3>Price Range</h3>
        </div>
        <div className="filter-content">
          <div className="price-range-selector">
            <select 
              className="price-range-dropdown"
              value={`${price.min}-${price.max}`}
              onChange={(e) => {
                const [min, max] = e.target.value.split('-').map(Number);
                const newPrice = { min, max };
                setPrice(newPrice);
                if (onPriceChange) {
                  onPriceChange(newPrice);
                }
              }}
            >
              <option value="0-1000">All Prices</option>
              <option value="0-0">Free</option>
              <option value="1-10">$1 - $10</option>
              <option value="10-50">$10 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-1000">$100+</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="filter-section">
        <div className="filter-header" onClick={() => {}}>
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
              <option value="4">★★★★☆ & Up</option>
              <option value="3">★★★☆☆ & Up</option>
              <option value="2">★★☆☆☆ & Up</option>
              <option value="1">★☆☆☆☆ & Up</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="filter-section">
        <div className="filter-header" onClick={() => {}}>
          <h3>Popular Tags</h3>
        </div>
        <div className="filter-content">
          <div className="tag-cloud">
            {tagOptions.slice(0, 8).map((tag) => (
              <button 
                key={tag.name} 
                className={`tag-button ${selectedTags.includes(tag.name) ? 'selected' : ''}`}
                onClick={() => handleTagSelect(tag.name)}
              >
                {tag.name && tag.name.trim() ? tag.name : 'Others'}
              </button>
            ))}
            {tagOptions.length > 8 && (
              <button 
                className="tag-button more-button"
                onClick={() => setShowAllTags(!showAllTags)}
              >
                {showAllTags ? 'Show Less' : 'More...'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="filter-section">
        <div className="filter-header" onClick={() => {}}>
          <h3>Features</h3>
        </div>
        <div className="filter-content">
          <div className="feature-selector">
            <select 
              className="feature-dropdown"
              value=""
              onChange={(e) => {
                const selectedValue = e.target.value;
                // Special handling for "Others" - ensure it can be selected
                if (selectedValue) {
                  handleFeatureSelect(selectedValue);
                }
              }}
            >
              <option value="">Select a feature</option>
              {featureOptions.map((feature) => {
                // Handle empty feature names as "Others"
                const displayName = feature.name && feature.name.trim() ? feature.name : 'Others';
                const valueToUse = feature.name && feature.name.trim() ? feature.name : 'Others';
                return (
                  <option key={valueToUse} value={valueToUse}>
                    {displayName}
                  </option>
                );
              })}
            </select>
          </div>
          
          {selectedFeatures.length > 0 && (
            <div className="selected-features">
              {selectedFeatures.map((feature) => (
                <div key={feature} className="selected-feature">
                  <span>{feature}</span>
                  <button onClick={() => handleFeatureSelect(feature)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
