import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to update the document title based on the current route
 * and maintain proper browser history
 * 
 * @param {string} title - The title to set for the current page
 */
const useDocumentTitle = (title) => {
  const location = useLocation();

  useEffect(() => {
    // Create a base title that will be used for all pages
    const baseTitle = 'AIWaverider';
    const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;

    // Update the document title
    document.title = fullTitle;

    // Update history state with the new title
    const currentState = window.history.state;
    if (currentState) {
      window.history.replaceState(
        { ...currentState, title: fullTitle },
        fullTitle,
        location.pathname + location.search + location.hash
      );
    }
  }, [title, location]);
};

export default useDocumentTitle;
