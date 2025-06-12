import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const VideoPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalVideos,
  limit
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    // Logic to show current page and surrounding pages
    if (totalPages <= maxPagesToShow) {
      // If total pages is less than max to show, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex logic to show current page with some before and after
      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      // Scroll to top when changing pages
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const pageNumbers = getPageNumbers();
  
  // Calculate the display range for videos
  const startVideo = (currentPage - 1) * limit + 1;
  const endVideo = Math.min(currentPage * limit, totalVideos);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing <span className="font-medium">{startVideo}</span> to <span className="font-medium">{endVideo}</span> of{' '}
        <span className="font-medium">{totalVideos}</span> videos
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center px-3 py-1 rounded-md ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700'
              : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          } border border-gray-300 dark:border-gray-600`}
        >
          <FaChevronLeft className="mr-1" /> Prev
        </button>
        
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            } border border-gray-300 dark:border-gray-600`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700'
              : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          } border border-gray-300 dark:border-gray-600`}
        >
          Next <FaChevronRight className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default VideoPagination;
