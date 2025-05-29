import { useEffect } from 'react';

/**
 * Component that updates the document title and browser history entry
 * based on the current route
 * 
 * @param {object} props
 * @param {string} props.title - The title to set for the current page
 */
const PageTitle = ({ title }) => {
  useEffect(() => {
    // Create a base title that will be used for all pages
    const baseTitle = 'AIWaverider';
    const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;

    // Update the document title
    document.title = fullTitle;

    // Update history state with the new title
    try {
      const currentState = window.history.state;
      const currentPath = window.location.pathname + window.location.search + window.location.hash;
      
      if (currentState) {
        window.history.replaceState(
          { ...currentState, title: fullTitle },
          fullTitle,
          currentPath
        );
      }
    } catch (error) {
      console.error('Error updating history state:', error);
    }
  }, [title]);

  // This component doesn't render anything
  return null;
};

export default PageTitle;
