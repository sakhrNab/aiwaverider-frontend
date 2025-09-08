import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaHome, FaQuestion, FaUserFriends, FaCalendarAlt, FaUsers, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import './FloatingNav.css'; 

const FloatingNav = ({ scrollRefs = {} }) => {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { darkMode } = useTheme();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const prevScrollYRef = useRef(window.scrollY);
  const panelRef = useRef(null);

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const prevY = prevScrollYRef.current;
      const scrollingUp = currentY < prevY;
      prevScrollYRef.current = currentY;

      const scrolledPastThreshold = currentY > 500;
      // Hide when near bottom (last 200px)
      const nearBottom = (window.innerHeight + currentY) >= (document.documentElement.scrollHeight - 200);

      if (scrollingUp) {
        setVisible(false);
      } else {
        setVisible(scrolledPastThreshold && !nearBottom);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    if (expanded) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 640) {
        setExpanded(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollTo = useCallback((ref) => {
    if (scrollRefs[ref]?.current) {
      scrollRefs[ref].current.scrollIntoView({ behavior: 'smooth' });
      if (windowWidth < 640) setExpanded(false);
    }
  }, [scrollRefs, windowWidth]);

  const isMobile = windowWidth < 640;
  const iconClass = isMobile ? 'text-base' : 'text-lg';
  const containerPositionClass = 'inset-x-0 mx-auto';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-8 sm:bottom-6 md:bottom-5 lg:bottom-4 ${containerPositionClass} z-50 floating-nav-container`}
          style={{
            maxWidth: isMobile ? '92vw' : '95vw',
            width: 'max-content',
          }}
        >
          {/* Mobile: Collapsed pill */}
          {isMobile && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className={`floating-nav-collapsed ${darkMode ? 'bg-gray-800/95 border-indigo-700 text-white' : 'bg-white/95 border-indigo-200 text-gray-800'}
                rounded-full flex items-center justify-center gap-2`}
              aria-label="Open navigation menu"
            >
              <FaBars className="text-base" />
              <span className="text-sm font-semibold">Menu</span>
            </button>
          )}

          {/* Mobile: Expanded panel */}
          {isMobile && expanded && (
            <div ref={panelRef} className={`floating-nav-panel ${darkMode ? 'bg-gray-800/95 border-indigo-700' : 'bg-white/95 border-indigo-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Quick Navigation</span>
                <button
                  onClick={() => setExpanded(false)}
                  aria-label="Close navigation"
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => scrollTo('top')}
                  className={`floating-nav-button w-full ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'} 
                    py-2 px-3 rounded-full flex items-center justify-start transition-colors duration-200`}
                >
                  <FaHome className="mr-2" />
                  <span className="text-sm font-medium">Home</span>
                </button>
                <button
                  onClick={() => scrollTo('obstacles')}
                  className={`floating-nav-button w-full ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'} 
                    py-2 px-3 rounded-full flex items-center justify-start transition-colors duration-200`}
                >
                  <FaQuestion className="mr-2" />
                  <span className="text-sm font-medium">Obstacles</span>
                </button>
                <button
                  onClick={() => scrollTo('whoItsFor')}
                  className={`floating-nav-button w-full ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'} 
                    py-2 px-3 rounded-full flex items-center justify-start transition-colors duration-200`}
                >
                  <FaUserFriends className="mr-2" />
                  <span className="text-sm font-medium">Who It's For</span>
                </button>
                <button
                  onClick={() => window.open('https://www.skool.com/ai-waverider-community-2071', '_blank')}
                  className={`floating-nav-button w-full ${darkMode ? 'bg-green-600 hover:bg-green-700 border-green-500 text-white' : 'bg-green-500 hover:bg-green-600 border-green-400 text-white'} 
                    border-2 py-2 px-3 rounded-full flex items-center justify-start transition-colors duration-200 shadow-lg hover:shadow-xl`}
                >
                  <FaUsers className="mr-2" />
                  <span className="text-sm font-medium">Join Community</span>
                </button>
                <button
                  onClick={() => window.open('https://calendly.com/aiwaverider8/30min', '_blank')}
                  className={`floating-nav-button w-full bg-blue-600 hover:bg-blue-700 text-white 
                    py-2 px-3 rounded-full flex items-center justify-start transition-colors duration-200`}
                >
                  <FaCalendarAlt className="mr-2" />
                  <span className="text-sm font-medium">Get Consultation</span>
                </button>
              </div>
            </div>
          )}

          {/* Desktop/tablet: Full horizontal nav */}
          {!isMobile && (
            <div
              className={`
                ${darkMode ? 'bg-gray-800' : 'bg-white'}
                rounded-full shadow-2xl border-2
                ${darkMode ? 'border-indigo-700' : 'border-indigo-200'}
                py-2 px-4 flex flex-row flex-wrap items-center justify-center gap-1 md:gap-2
                transition-all duration-300 ease-in-out
              `}
              style={{ boxSizing: 'border-box' }}
            >
              <button
                onClick={() => scrollTo('top')}
                className={`floating-nav-button ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'} 
                  py-2 px-3 rounded-full flex items-center justify-center md:justify-start transition-colors duration-200`}
                aria-label="Home"
              >
                <span className={iconClass}><FaHome /></span>
                <span className="text-sm font-medium ml-2">Home</span>
              </button>

              <div className={`h-6 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

              <button
                onClick={() => scrollTo('obstacles')}
                className={`floating-nav-button ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'} 
                  py-2 px-3 rounded-full flex items-center justify-center md:justify-start transition-colors duration-200`}
                aria-label="Obstacles"
              >
                <span className={iconClass}><FaQuestion /></span>
                <span className="text-sm font-medium ml-2">Obstacles</span>
              </button>

              <div className={`h-6 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

              <button
                onClick={() => scrollTo('whoItsFor')}
                className={`floating-nav-button ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'} 
                  py-2 px-3 rounded-full flex items-center justify-center md:justify-start transition-colors duration-200`}
                aria-label="Who It's For"
              >
                <span className={iconClass}><FaUserFriends /></span>
                <span className="text-sm font-medium ml-2">Who It's For</span>
              </button>

              <div className={`h-6 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

              <button
                onClick={() => window.open('https://www.skool.com/ai-waverider-community-2071', '_blank')}
                className={`floating-nav-button ${darkMode ? 'bg-green-600 hover:bg-green-700 border-green-500' : 'bg-green-500 hover:bg-green-600 border-green-400'} text-white border-2
                  py-2 px-3 rounded-full flex items-center justify-center md:justify-start transition-colors duration-200 shadow-lg hover:shadow-xl`}
                aria-label="Join Community"
              >
                <span className={iconClass}><FaUsers /></span>
                <span className="text-sm font-medium ml-2">Join Community</span>
              </button>

              <div className={`h-6 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

              <button
                onClick={() => window.open('https://calendly.com/aiwaverider8/30min', '_blank')}
                className={`floating-nav-button bg-blue-600 hover:bg-blue-700 text-white 
                  py-2 px-3 rounded-full flex items-center justify-center md:justify-start transition-colors duration-200`}
                aria-label="Get Consultation"
              >
                <span className={iconClass}><FaCalendarAlt /></span>
                <span className="text-sm font-medium ml-2">Get Consultation</span>
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNav;