import React, { memo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Pagination Component with glassy design
 */
const Pagination = memo(({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onNext,
  onPrevious,
  onGoToPage,
  className = ''
}) => {
  const { darkMode } = useTheme();

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages = [];
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Always show first page
    if (totalPages > 0) {
      pages.push(1);
    }

    // Add ellipsis if there's a gap after first page
    if (rangeStart > 2) {
      pages.push('...');
    }

    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Add ellipsis if there's a gap before last page
    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const buttonBaseClass = `
    px-3 py-2 text-sm font-medium rounded-lg
    transition-all duration-200 ease-in-out
    backdrop-blur-sm border
    flex items-center justify-center min-w-[40px]
  `;

  const activeButtonClass = `
    ${buttonBaseClass}
    ${darkMode 
      ? 'bg-blue-600/80 text-white border-blue-500/50 shadow-lg shadow-blue-500/25' 
      : 'bg-blue-500/80 text-white border-blue-400/50 shadow-lg shadow-blue-500/25'
    }
    hover:shadow-xl hover:shadow-blue-500/30
  `;

  const inactiveButtonClass = `
    ${buttonBaseClass}
    ${darkMode 
      ? 'bg-gray-800/60 text-gray-300 border-gray-700/50 hover:bg-gray-700/80 hover:text-white' 
      : 'bg-white/60 text-gray-700 border-gray-300/50 hover:bg-white/80 hover:text-gray-900'
    }
    hover:shadow-md
  `;

  const disabledButtonClass = `
    ${buttonBaseClass}
    ${darkMode 
      ? 'bg-gray-800/30 text-gray-600 border-gray-700/30' 
      : 'bg-gray-200/30 text-gray-400 border-gray-300/30'
    }
    cursor-not-allowed opacity-50
  `;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`} aria-label="Pagination">
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        disabled={!hasPreviousPage}
        className={hasPreviousPage ? inactiveButtonClass : disabledButtonClass}
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="ml-1 hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => (
          <React.Fragment key={`${page}-${index}`}>
            {page === '...' ? (
              <span className={`
                px-2 py-2 text-sm
                ${darkMode ? 'text-gray-500' : 'text-gray-400'}
              `}>
                ...
              </span>
            ) : (
              <button
                onClick={() => onGoToPage(page)}
                className={page === currentPage ? activeButtonClass : inactiveButtonClass}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={!hasNextPage}
        className={hasNextPage ? inactiveButtonClass : disabledButtonClass}
        aria-label="Next page"
      >
        <span className="mr-1 hidden sm:inline">Next</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination; 