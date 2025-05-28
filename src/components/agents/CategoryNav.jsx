import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './CategoryNav.css';

// Simplified agent categories
const AGENT_CATEGORIES = [
  'All',
  'Design',
  'Creative',
  'Productivity',
  'Development',
  'Business'
];

const CategoryNav = ({ selectedCategory, onCategoryChange }) => {
  const scrollContainerRef = useRef(null);
  const [showScrollButtons, setShowScrollButtons] = React.useState(false);
  
  // Check if scrolling is needed when component mounts or window resizes
  React.useEffect(() => {
    const checkForScrolling = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        // Only show scroll buttons if content width exceeds container width
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };
    
    // Initial check
    checkForScrolling();
    
    // Check on window resize
    window.addEventListener('resize', checkForScrolling);
    return () => window.removeEventListener('resize', checkForScrolling);
  }, []);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="category-nav-container">
      {showScrollButtons && (
        <button 
          className="scroll-button scroll-left"
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <FaChevronLeft />
        </button>
      )}
      
      <div className="category-nav" ref={scrollContainerRef}>
        <div className="category-scroll">
          {AGENT_CATEGORIES.map((category) => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {showScrollButtons && (
        <button 
          className="scroll-button scroll-right"
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

export default CategoryNav; 