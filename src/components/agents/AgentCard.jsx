import React, { useState, useRef, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart, FaPlus, FaTag } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { addToWishlist, removeFromWishlist } from '../../api/marketplace/agentApi';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-toastify';
import { fixPlaceholderUrl, generatePlaceholderImage } from '../../utils/imageUtils';
import '../../styles/MarketplaceAgentCard.css';
import n8nWorkflowImg from '../../assets/n8nworkflow.png';
// Helper function to create responsive SVG placeholders at module level
const createResponsivePlaceholder = (text, width = 300, height = 200) => {
  const maxLineLength = 25; // Maximum characters per line
  const padding = 20; // Padding from edges
  
  // Split text into words and create lines
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= maxLineLength) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Handle very long words by breaking them
        lines.push(word.substring(0, maxLineLength));
        currentLine = word.substring(maxLineLength);
      }
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  
  // Calculate font size based on number of lines and total text length
  const totalChars = text.length;
  let fontSize;
  
  if (totalChars <= 10) {
    fontSize = 24;
  } else if (totalChars <= 20) {
    fontSize = 20;
  } else if (totalChars <= 30) {
    fontSize = 16;
  } else if (totalChars <= 50) {
    fontSize = 14;
  } else {
    fontSize = 12;
  }
  
  // Adjust font size based on number of lines
  if (lines.length > 3) {
    fontSize = Math.max(10, fontSize - 2);
  }
  
  // Calculate line spacing
  const lineHeight = fontSize * 1.2;
  const totalTextHeight = lines.length * lineHeight;
  const startY = (height - totalTextHeight) / 2 + fontSize;
  
  // Generate SVG text elements for each line
  const textElements = lines.map((line, index) => {
    const y = startY + (index * lineHeight);
    return `%3Ctext x='${width/2}' y='${y}' font-family='Arial, sans-serif' font-size='${fontSize}' font-weight='500' text-anchor='middle' fill='%23ffffff'%3E${encodeURIComponent(line)}%3C/text%3E`;
  }).join('');
  
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%233498db;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%232980b9;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='${width}' height='${height}' fill='url(%23grad1)'/%3E${textElements}%3C/svg%3E`;
};

// Default fallback images using responsive text placeholders
const DEFAULT_IMAGE = createResponsivePlaceholder('Agent Image');
const DEFAULT_ICON = createResponsivePlaceholder('AI', 200, 200);

// Currency symbol helper function
const getCurrencySymbol = (currency) => {
  switch(currency) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    default: return currency;
  }
};

// Format rating to show only one decimal place
const formatRating = (rating) => {
  if (!rating) return '0';
  return typeof rating === 'number' ? rating.toFixed(1) : parseFloat(rating).toFixed(1);
};

// Helper function to get category colors
const getCategoryColor = (category) => {
  const colors = {
    'Productivity': '#10B981',
    'Business': '#3B82F6', 
    'Marketing': '#F59E0B',
    'Analytics': '#8B5CF6',
    'Communication': '#06B6D4',
    'Content': '#EF4444',
    'E-commerce': '#F97316',
    'Social': '#EC4899',
    'Development': '#6366F1',
    'Design': '#84CC16'
  };
  return colors[category] || '#6B7280';
};

// Helper function to check if agent is free
const isFreeAgent = (agent) => {
  if (!agent) return true; // Default to free if no agent
  
  // Check for explicit isFree flag
  if (agent.isFree === true) return true;
  
  // Check for zero or free in the direct price field
  if (agent.price === 0 || 
      agent.price === '0' || 
      agent.price === 'Free' || 
      agent.price === 'free' || 
      agent.price === '$0' ||
      agent.price === undefined || 
      agent.price === null ||
      agent.price === '') {
    return true;
  }
  
  // Check for free in formatted price string
  if (typeof agent.price === 'string' && 
      (agent.price.toLowerCase().includes('free') || 
       agent.price === '$0' || 
       agent.price === '0' || 
       agent.price.trim() === '')) {
    return true;
  }
  
  // Check priceDetails object
  if (agent.priceDetails) {
    if (agent.priceDetails.isFree === true) return true;
    if (agent.priceDetails.basePrice === 0) return true;
    if (agent.priceDetails.basePrice === '0') return true;
    if (agent.priceDetails.basePrice === undefined) return true;
    if (agent.priceDetails.discountedPrice === 0) return true;
    if (agent.priceDetails.discountedPrice === '0') return true;
  }
  
  return false;
};

// Category Badge Component
const CategoryBadge = React.memo(({ category, small = false }) => {
  return (
    <span 
      className={`marketplace-category-badge ${small ? 'small' : ''}`}
      style={{ backgroundColor: getCategoryColor(category) }}
    >
      <FaTag className="marketplace-category-icon" />
      {category}
    </span>
  );
});

CategoryBadge.displayName = 'CategoryBadge';

const AgentCard = memo(({ agent }) => {
  const [isWishlisted, setIsWishlisted] = useState(agent.isWishlisted || false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(null);
  const imageRef = useRef(null);
  const { addToCart } = useCart();
  
  // Helper function to calculate responsive text size and handle wrapping
  const generateResponsiveSVG = useCallback((text, width = 300, height = 200) => {
    const maxLineLength = 25; // Maximum characters per line
    const padding = 20; // Padding from edges
    const maxWidth = width - (padding * 2);
    
    // Split text into words and create lines
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length <= maxLineLength) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Handle very long words by breaking them
          lines.push(word.substring(0, maxLineLength));
          currentLine = word.substring(maxLineLength);
        }
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Calculate font size based on number of lines and total text length
    const totalChars = text.length;
    let fontSize;
    
    if (totalChars <= 10) {
      fontSize = 24;
    } else if (totalChars <= 20) {
      fontSize = 20;
    } else if (totalChars <= 30) {
      fontSize = 16;
    } else if (totalChars <= 50) {
      fontSize = 14;
    } else {
      fontSize = 12;
    }
    
    // Adjust font size based on number of lines
    if (lines.length > 3) {
      fontSize = Math.max(10, fontSize - 2);
    }
    
    // Calculate line spacing
    const lineHeight = fontSize * 1.2;
    const totalTextHeight = lines.length * lineHeight;
    const startY = (height - totalTextHeight) / 2 + fontSize;
    
    // Generate SVG text elements for each line
    const textElements = lines.map((line, index) => {
      const y = startY + (index * lineHeight);
      return `%3Ctext x='${width/2}' y='${y}' font-family='Arial, sans-serif' font-size='${fontSize}' font-weight='500' text-anchor='middle' fill='%23ffffff'%3E${encodeURIComponent(line)}%3C/text%3E`;
    }).join('');
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%233498db;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%232980b9;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='${width}' height='${height}' fill='url(%23grad1)'/%3E${textElements}%3C/svg%3E`;
  }, []);
  
  // Handle image load to determine aspect ratio
  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      const ratio = naturalWidth / naturalHeight;
      // Consider images with ratio less than 1 as portrait
      setAspectRatio(ratio < 1 ? 'portrait' : 'landscape');
    }
  }, []);
  
  // Handle wishlist toggling
  const handleWishlist = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(agent.id);
      } else {
        await addToWishlist(agent.id);
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, [agent.id, isWishlisted, isLoading]);

  // Get image URL with fallback - optimized with memoization
  const imageUrl = React.useMemo(() => {
    if (imageError) {
      return DEFAULT_IMAGE;
    }
    
    // Check for different possible image URL locations in the agent object
    if (agent.imageUrl && typeof agent.imageUrl === 'string') {
      return n8nWorkflowImg; //fixPlaceholderUrl(agent.imageUrl);
    }
    
    // Check if image info exists in a nested structure
    if (agent.image && agent.image.url) {
      return fixPlaceholderUrl(agent.image.url);
    }
    
    // Generate a custom placeholder with the agent name using responsive text
    const name = agent.name || agent.title || 'Agent';
    return generateResponsiveSVG(name, 300, 200);
  }, [agent.imageUrl, agent.image, agent.name, agent.title, imageError, generateResponsiveSVG]);

  // Handle add to cart
  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Determine price
      let price = 0;
      if (agent.priceDetails && agent.priceDetails.basePrice) {
        price = agent.priceDetails.discountedPrice || agent.priceDetails.basePrice;
      } else if (typeof agent.price === 'number') {
        price = agent.price;
      }
      
      // Create product object
      const product = {
        id: agent.id,
        title: agent.title || agent.name,
        price: price,
        imageUrl: imageUrl,
        quantity: 1
      };
      
      // Add to cart
      addToCart(product);
      toast.success('🛒 Added to cart!', {
        autoClose: 3000,
        position: "bottom-right"
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add to cart');
    }
  }, [agent, imageUrl, addToCart]);

  // Get icon URL with fallback - optimized with memoization
  const iconUrl = React.useMemo(() => {
    // Check for different possible icon URL locations in the agent object
    if (agent.iconUrl) {
      return fixPlaceholderUrl(agent.iconUrl);
    }
    
    // Check if icon info exists in a nested structure
    if (agent.icon && agent.icon.url) {
      return fixPlaceholderUrl(agent.icon.url);
    }
    
    // If no icon is found, use the image as the icon
    if (imageUrl && !imageUrl.includes('data:image/svg+xml')) {
      return imageUrl;
    }
    
    return DEFAULT_ICON;
  }, [agent.iconUrl, agent.icon, imageUrl]);

  // Format the price for display - optimized with enhanced memoization
  const formattedPrice = React.useMemo(() => {
    // First check if agent is marked as free
    if (isFreeAgent(agent)) {
      return <span className="free-price">Free</span>;
    }
    
    // Check if we have price details object
    if (agent.priceDetails) {
      const { basePrice, discountedPrice, currency } = agent.priceDetails;
      const currencySymbol = getCurrencySymbol(currency);
      
      // If price is 0, it's free
      if (basePrice === 0 || discountedPrice === 0) {
        return <span className="free-price">Free</span>;
      }
      
      // If there's a discount, show both prices
      if (discountedPrice !== undefined && discountedPrice < basePrice) {
        return (
          <div className="price-display">
            <span className="original-price">{currencySymbol}{basePrice.toFixed(2)}</span>
            <span className="discounted-price">{currencySymbol}{discountedPrice.toFixed(2)}</span>
          </div>
        );
      }
      
      if (basePrice !== undefined) {
        return `${currencySymbol}${basePrice.toFixed(2)}`;
      }
    }
    
    // Handle string or number price
    if (agent.price !== undefined) {
      if (typeof agent.price === 'number') {
        return agent.price === 0 ? <span className="free-price">Free</span> : `$${agent.price.toFixed(2)}`;
      }
      // Check if price string is "Free" or "0"
      if (agent.price === 'Free' || agent.price === '0') {
        return <span className="free-price">Free</span>;
      }
      return agent.price; // Return as is if it's a string
    }
    
    // Default fallback - be transparent when price is unknown
    return 'Price unavailable';
  }, [agent.isFree, agent.priceDetails, agent.price]);

  // Handle image loading errors
  const handleImageError = useCallback(() => {
    console.log(`Image error for agent: ${agent.id}`);
    setImageError(true);
  }, [agent.id]);

  // Derive and memoize the essential properties to prevent unnecessary calculations
  const title = React.useMemo(() => agent.title || agent.name, [agent.title, agent.name]);
  const description = React.useMemo(() => agent.description || "No description available", [agent.description]);
  const creatorName = React.useMemo(() => agent.creator?.name || "Unknown Creator", [agent.creator]);
  const rating = React.useMemo(() => agent.rating?.average ? formatRating(agent.rating.average) : null, [agent.rating]);
  const ratingCount = React.useMemo(() => agent.rating?.count || 0, [agent.rating]);

  // Get agent categories - handle both old single category and new multiple categories
  const agentCategories = React.useMemo(() => {
    // New categories array format
    if (agent.categories && Array.isArray(agent.categories)) {
      return agent.categories;
    }
    
    // Legacy single category format
    if (agent.category && typeof agent.category === 'string') {
      return [agent.category];
    }
    
    return [];
  }, [agent.categories, agent.category]);

  // Show only the first 2-3 categories to avoid overcrowding
  const displayCategories = React.useMemo(() => {
    return agentCategories.slice(0, 3);
  }, [agentCategories]);

  return (
    <Link to={`/agents/${agent.id}`} className="marketplace-agent-card-link">
      <div className="marketplace-agent-card">
        <div className="marketplace-agent-card-inner">
          {/* Card image with wishlist button */}
          <div className="marketplace-agent-image-container">
            <LazyLoadImage
              ref={imageRef}
              src={imageUrl} 
              alt={title} 
              className="marketplace-agent-image" 
              onError={handleImageError}
              onLoad={handleImageLoad}
              data-aspect={aspectRatio}
              threshold={1000}
              // effect="blur"
              placeholderSrc={imageUrl}
              width="100%"
              sizes="(max-width: 480px) 100vw, (max-width: 834px) 50vw, 33vw"
              visibleByDefault={true}
            />
            <div className="marketplace-agent-card-actions">
              <button 
                className={`marketplace-wishlist-button ${isWishlisted ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
                onClick={handleWishlist}
                disabled={isLoading}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isWishlisted ? <FaHeart /> : <FaRegHeart />}
              </button>
              
              {/* Only show add to cart button for paid agents */}
              {!isFreeAgent(agent) && (
                <button
                  className="marketplace-cart-button"
                  onClick={handleAddToCart}
                  aria-label="Add to cart"
                >
                  <FaPlus />
                </button>
              )}
            </div>
            
            {/* Badges */}
            {agent.isBestseller && <div className="marketplace-badge bestseller">Bestseller</div>}
            {agent.isNew && <div className="marketplace-badge new">New</div>}
            {agent.isTrending && <div className="marketplace-badge trending">Trending</div>}
          </div>

          {/* Card content */}
          <div className="marketplace-agent-content">
            <div className="marketplace-agent-header">
              <h3 className="marketplace-agent-title" title={title}>{title}</h3>
              
              {/* Categories Display - moved to same line as title */}
              {displayCategories.length > 0 && (
                <div className="marketplace-agent-categories">
                  {displayCategories.map((category) => (
                    <CategoryBadge 
                      key={category} 
                      category={category} 
                      small={true}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="marketplace-agent-description" style={{ whiteSpace: 'pre-line' }}>
              {description}
            </div>
            
            <div className="marketplace-agent-creator">
              By {creatorName}
            </div>
            
            <div className="marketplace-agent-rating">
              {rating ? (
                <>
                  <span className="marketplace-rating-score">{rating}</span>
                  <FaStar className="marketplace-star-icon" />
                  <span className="marketplace-rating-count">({ratingCount})</span>
                </>
              ) : (
                <span className="marketplace-no-rating">No ratings yet</span>
              )}
            </div>
            
            <div className="marketplace-agent-price">
              {formattedPrice}
            </div>
            
          {/* Business Value Preview - show only for paid agents to justify the price */}
            {/* {!isFreeAgent(agent) && agent.businessValue && (
              <div className="marketplace-business-value-preview">
                <span className="marketplace-value-label">Value: </span>
                <span className="marketplace-value-text">
                  {agent.businessValue.replace(/"/g, '').substring(0, 60)}
                  {agent.businessValue.length > 60 ? '...' : ''}
                </span>
              </div>
            )} */}
            
            {/* Deliverables count */}
            {agent.deliverables && Array.isArray(agent.deliverables) && agent.deliverables.length > 0 && (
              <div className="marketplace-deliverables-count">
                <span className="marketplace-files-count">
                  📦 {agent.deliverables.length} file{agent.deliverables.length !== 1 ? 's' : ''} included
                </span>
              </div>
            )}
            
            {agent.version && 
              <div className="marketplace-agent-version">v{agent.version}</div>
            }
          </div>
        </div>
      </div>
    </Link>
  );
});

// Set display name for debugging
AgentCard.displayName = 'AgentCard';

export default AgentCard;