import React, { useState, useEffect, useCallback } from 'react';
import { FaHome, FaQuestion, FaUserFriends, FaCalendarAlt, FaBars, FaTimes, FaDiscord } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import './FloatingNav.css'; 

const FloatingNav = ({ scrollRefs = {} }) => {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { darkMode } = useTheme();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 640) {
        setExpanded(false); // Auto-collapse on larger screens
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  const scrollTo = useCallback((ref) => {
    if (scrollRefs[ref]?.current) {
      scrollRefs[ref].current.scrollIntoView({ behavior: 'smooth' });
      if (windowWidth < 640) setExpanded(false); // Auto-collapse after selection on mobile
    }
  }, [scrollRefs, windowWidth]);

  const openCalendly = useCallback(() => {
    window.open('https://calendly.com/aiwaverider8/30min', '_blank');
    if (windowWidth < 640) setExpanded(false); // Auto-collapse after selection on mobile
  }, [windowWidth]);

  const openDiscord = useCallback(() => {
    window.open('https://discord.com/channels/1377544516579491891/1377544516579491894', '_blank');
    if (windowWidth < 640) setExpanded(false); // Auto-collapse after selection on mobile
  }, [windowWidth]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 sm:bottom-6 md:bottom-5 lg:bottom-4 inset-x-0 mx-auto z-50 floating-nav-container"
          style={{
            maxWidth: '95vw',
            width: windowWidth < 640 ? (expanded ? '90%' : 'auto') : 'max-content',
          }}
        >
          {/* Mobile Toggle Button - Only visible on small screens */}
          {windowWidth < 640 && (
            <button 
              onClick={toggleExpanded}
              className={`absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-full p-2 shadow-lg border ${darkMode ? 'border-indigo-700' : 'border-indigo-200'}`}
              aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
            >
              {expanded ? <FaTimes /> : <FaBars />}
            </button>
          )}

          {/* Main Navigation Container */}
          <div
            className={`
              ${darkMode ? 'bg-gray-800' : 'bg-white'}
              rounded-full shadow-2xl border-2
              ${darkMode ? 'border-indigo-700' : 'border-indigo-200'}
              ${windowWidth < 640 
                ? expanded 
                  ? 'py-5 px-4 flex flex-col items-stretch gap-3 rounded-2xl' 
                  : 'py-3 px-3 flex justify-center items-center rounded-full' 
                : 'py-2 px-4 flex flex-row flex-wrap items-center justify-center gap-1 md:gap-2'}
              transition-all duration-300 ease-in-out
            `}
            style={{
              boxSizing: 'border-box',
              width: windowWidth < 640 && !expanded ? 'auto' : '100%',
            }}
          >
            {/* Collapsed state on mobile shows just one button */}
            {windowWidth < 640 && !expanded ? (
              <button
                onClick={toggleExpanded}
                className={`floating-nav-button ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center justify-center rounded-full`}
                aria-label="Expand navigation"
              >
                <span className="text-xs font-medium">Menu</span>
              </button>
            ) : (
              /* Expanded state (always shown on larger screens) */
              <>
                <button
                  onClick={() => scrollTo('top')}
                  className={`floating-nav-button ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'} 
                    py-2 px-3 rounded-full flex items-center justify-center md:justify-start
                    ${windowWidth < 640 ? 'w-full' : ''}
                    transition-colors duration-200`}
                  aria-label="Home"
                >
                  <FaHome className="text-lg" />
                  <span className="text-sm font-medium ml-2">Home</span>
                </button>

                {windowWidth >= 640 && <div className={`h-6 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>}

                <button
                  onClick={() => scrollTo('obstacles')}
                  className={`floating-nav-button ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'} 
                    py-2 px-3 rounded-full flex items-center justify-center md:justify-start
                    ${windowWidth < 640 ? 'w-full' : ''}
                    transition-colors duration-200`}
                  aria-label="Obstacles"
                >
                  <FaQuestion className="text-lg" />
                  <span className="text-sm font-medium ml-2">Obstacles</span>
                </button>

                {windowWidth >= 640 && <div className={`h-6 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>}

                <button
                  onClick={() => scrollTo('whoItsFor')}
                  className={`floating-nav-button ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'} 
                    py-2 px-3 rounded-full flex items-center justify-center md:justify-start
                    ${windowWidth < 640 ? 'w-full' : ''}
                    transition-colors duration-200`}
                  aria-label="Who It's For"
                >
                  <FaUserFriends className="text-lg" />
                  <span className="text-sm font-medium ml-2">Who It's For</span>
                </button>

                {windowWidth >= 640 && <div className={`h-6 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>}

                <button
                  onClick={openDiscord}
                  className={`floating-nav-button ${darkMode ? 'bg-purple-600 hover:bg-purple-700 border-purple-500' : 'bg-purple-500 hover:bg-purple-600 border-purple-400'} text-white border-2
                    py-2 px-3 rounded-full flex items-center justify-center md:justify-start
                    ${windowWidth < 640 ? 'w-full' : ''}
                    transition-colors duration-200 shadow-lg hover:shadow-xl`}
                  aria-label="Join Community"
                >
                  <FaDiscord className="text-lg" />
                  <span className="text-sm font-medium ml-2">Join Community</span>
                </button>

                {windowWidth >= 640 && <div className={`h-6 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>}

                <button
                  onClick={openCalendly}
                  className={`floating-nav-button bg-blue-600 hover:bg-blue-700 text-white 
                    py-2 px-3 rounded-full flex items-center justify-center md:justify-start
                    ${windowWidth < 640 ? 'w-full' : ''}
                    transition-colors duration-200`}
                  aria-label="Get Consultation"
                >
                  <FaCalendarAlt className="text-lg" />
                  <span className="text-sm font-medium ml-2">Get Consultation</span>
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNav;