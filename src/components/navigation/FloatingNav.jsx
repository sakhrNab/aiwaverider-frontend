import React, { useState, useEffect } from 'react';
import { FaHome, FaQuestion, FaUserFriends, FaCalendarAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import './FloatingNav.css'; 

const FloatingNav = ({ scrollRefs = {} }) => {
  const [visible, setVisible] = useState(false);
  const { darkMode } = useTheme();

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

  const scrollTo = (ref) => {
    if (scrollRefs[ref]?.current) {
      scrollRefs[ref].current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openCalendly = () => {
    window.open('https://calendly.com/aiwaverider8/30min', '_blank');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 sm:bottom-4 inset-x-0 mx-auto z-50"
          style={{
            width: 'max-content', // Crucial: motion.div shrinks to fit its content
            maxWidth: '95vw',     // Overall width constraint
            boxSizing: 'border-box',
          }}
        >
          {/* Inner "Visual Pill" div - structure remains the same */}
          <div
            className={`
              ${darkMode ? 'bg-gray-800' : 'bg-white'}
              rounded-full shadow-2xl py-3 px-6 border-2
              ${darkMode ? 'border-indigo-700' : 'border-indigo-200'}
              flex flex-col items-center gap-4
              sm:flex-row sm:flex-wrap sm:justify-center sm:gap-2
            `}
            style={{
              width: 'max-content',
              maxWidth: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Buttons remain the same */}
            <button
              onClick={() => scrollTo('top')}
              className={`floating-nav-button ${
                darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'
              } py-3 px-4 sm:px-3 sm:py-2 rounded-full flex items-center transition-colors duration-200`}
              aria-label="Home"
            >
              <FaHome className="text-lg" />
              <span className="text-sm font-medium ml-1">Home</span>
            </button>

            <div className={`h-6 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} hidden sm:block`}></div>

            <button
              onClick={() => scrollTo('obstacles')}
              className={`floating-nav-button ${
                darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'
              } py-3 px-4 sm:px-3 sm:py-2 rounded-full flex items-center transition-colors duration-200`}
              aria-label="Obstacles"
            >
              <FaQuestion className="text-lg" />
              <span className="text-sm font-medium ml-1">Obstacles</span>
            </button>

            <div className={`h-6 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} hidden sm:block`}></div>

            <button
              onClick={() => scrollTo('whoItsFor')}
              className={`floating-nav-button ${
                darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-100'
              } py-3 px-4 sm:px-3 sm:py-2 rounded-full flex items-center transition-colors duration-200`}
              aria-label="Who It's For"
            >
              <FaUserFriends className="text-lg" />
              <span className="text-sm font-medium ml-1">Who It's For</span>
            </button>

            <div className={`h-6 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} hidden sm:block`}></div>

            <button
              onClick={openCalendly}
              className="floating-nav-button bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 sm:px-3 sm:py-2 rounded-full flex items-center transition-colors duration-200"
              aria-label="Get Consultation"
            >
              <FaCalendarAlt className="text-lg" />
              <span className="text-sm font-medium ml-1">Get Consultation</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNav;