import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './CategoryNav.css';

const DEFAULT_CATEGORIES = ['All', 'New', 'Design', 'Creative', 'Productivity', 'Development', 'Business', 'Education', 'Entertainment', 'Writing', 'Self Improvement', 'Music & Sound Design', 'Software Development', 'Drawing & Painting', '3D'];

const CategoryNav = ({ selectedCategory, onCategoryChange, categories = [] }) => {
  const scrollContainerRef = useRef(null);
  const [showScrollButtons, setShowScrollButtons] = React.useState(false);
  const categoryList = Array.isArray(categories) && categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  
  React.useEffect(() => {
    const checkForScrolling = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };
    checkForScrolling();
    window.addEventListener('resize', checkForScrolling);
    return () => window.removeEventListener('resize', checkForScrolling);
  }, [categoryList.length]);
  
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
          {categoryList.map((category) => (
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