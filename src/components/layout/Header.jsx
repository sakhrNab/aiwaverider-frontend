// src/components/layout/Header.jsx
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/v6.webp';
import { AuthContext } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext.jsx';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-toastify';
import { 
  FaShoppingCart, 
  FaSun, 
  FaMoon, 
  FaHome, 
  FaRobot, 
  FaTools, 
  FaMicrochip,
  FaUser,
  FaTimes,
  FaBars,
  FaCircle,
  FaInfoCircle
} from 'react-icons/fa';
import './Header.css'; // Import custom Header CSS
import '../../styles/animations.css'; // Import animations
import { motion } from 'framer-motion'; // For subtle animations

const Header = ({ openSignUpModal }) => {
  const { user, signOut } = useContext(AuthContext);
  const { cart, itemCount } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // For toggling mobile navigation
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Check if current page is an admin page
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Toggle body class when menu opens/closes
  useEffect(() => {
    const body = document.querySelector('body');
    if (isMenuOpen) {
      body.classList.add('menu-open');
    } else {
      body.classList.remove('menu-open');
    }
    
    return () => {
      body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);
  
  // Add/remove admin-page class to body
  useEffect(() => {
    const body = document.querySelector('body');
    if (isAdminPage) {
      body.classList.add('admin-page');
    } else {
      body.classList.remove('admin-page');
    }
    
    return () => {
      body.classList.remove('admin-page');
    };
  }, [isAdminPage]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu on window resize (if open)
  useEffect(() => {
    function handleResize() {
      if (isMenuOpen && window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // Handle sign up button click
  const handleSignUp = () => {
    if (typeof openSignUpModal === 'function') {
      openSignUpModal();
    } else {
      document.dispatchEvent(new CustomEvent('open-signup-modal'));
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("You've been signed out successfully");
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out. Please try again.');
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  return (
    <header className={`main-header sticky top-0 z-50 backdrop-blur-xl ${
      darkMode 
        ? 'bg-gradient-to-r from-gray-900/90 via-indigo-950/80 to-gray-900/90 border-b border-indigo-700/30 shadow-lg shadow-indigo-900/20' 
        : 'bg-gradient-to-r from-blue-600/90 via-indigo-500/80 to-purple-500/90 border-b border-indigo-300 shadow-lg shadow-indigo-500/20'
    } transition-all duration-300`}>
      {/* Animated glow effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut" 
          }}
          className={`absolute -top-24 -right-24 w-48 h-48 rounded-full ${darkMode ? 'bg-indigo-600' : 'bg-blue-400'} blur-3xl`}
        />
        <motion.div 
          animate={{ 
            y: [-10, 10, -10],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut" 
          }}
          className={`absolute -bottom-24 -left-24 w-48 h-48 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-indigo-400'} blur-3xl`}
        />
      </div>
      
      <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="flex-shrink-0 flex items-center mr-4"
        >
          <Link to="/" className="flex items-center">
            <motion.img 
              whileHover={{ rotate: 10 }}
              src={logo} 
              alt="AI Waverider" 
              className="min-w-[40px] w-10 md:w-12 h-auto site-logo" 
            />
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`ml-2 font-bold text-lg md:text-xl text-transparent bg-clip-text ${darkMode 
                ? 'bg-gradient-to-r from-blue-300 to-purple-300' 
                : 'bg-gradient-to-r from-yellow-300 via-orange-200 to-yellow-100 drop-shadow-lg'}`}
            >
              AIWaverider
            </motion.span>
          </Link>
        </motion.div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center flex-grow">
          <ul className="flex nav-links items-center">
            <li className="nav-item flex items-center">
              <Link 
                to="/" 
                className="nav-link px-2 py-1 md:px-3 md:py-2 rounded-md font-medium flex items-center text-white hover:bg-opacity-10 hover:bg-white"
                aria-label="Home"
              >
                <FaHome className="mr-1.5" /> 
                <span>Home</span>
              </Link>
              <span className="nav-dot mx-2 text-[6px] text-white opacity-70">
                <FaCircle />
              </span>
            </li>
            <li className="nav-item flex items-center">
              <Link 
                to="/agents" 
                className="nav-link px-2 py-1 md:px-3 md:py-2 rounded-md font-medium flex items-center text-white hover:bg-opacity-10 hover:bg-white"
                aria-label="AI Agents"
              >
                <FaRobot className="mr-1.5" /> 
                <span>AI Agents</span>
              </Link>
              <span className="nav-dot mx-2 text-[6px] text-white opacity-70">
                <FaCircle />
              </span>
            </li>
            <li className="nav-item flex items-center">
              <Link 
                to="/ai-tools" 
                className="nav-link px-2 py-1 md:px-3 md:py-2 rounded-md font-medium flex items-center text-white hover:bg-opacity-10 hover:bg-white"
                aria-label="AI Tools & Prompts"
              >
                <FaTools className="mr-1.5" /> 
                <span>AI Tools & Prompts</span>
              </Link>
              <span className="nav-dot mx-2 text-[6px] text-white opacity-70">
                <FaCircle />
              </span>
            </li>
            <li className="nav-item flex items-center">
              <Link 
                to="/latest-tech" 
                className="nav-link px-2 py-1 md:px-3 md:py-2 rounded-md font-medium flex items-center text-white hover:bg-opacity-10 hover:bg-white"
                aria-label="Latest News & Tutorials"
              >
                <FaMicrochip className="mr-1.5" /> 
                <span>Latest Tech News & Tutorials</span>
              </Link>
              <span className="nav-dot mx-2 text-[6px] text-white opacity-70">
                <FaCircle />
              </span>
            </li>
            <li className="nav-item flex items-center">
              <Link 
                to="/about" 
                className="nav-link px-2 py-1 md:px-3 md:py-2 rounded-md font-medium flex items-center text-white hover:bg-opacity-10 hover:bg-white"
                aria-label="About"
              >
                <FaInfoCircle className="mr-1.5" /> 
                <span>About Us</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center space-x-2">
          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-full hover:bg-gray-100/10 transition-colors text-white"
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-200" />}
          </button>
          
          {/* Cart Button */}
          <Link 
            to="/checkout" 
            className="p-2 rounded-full hover:bg-gray-100/10 transition-colors relative text-white"
            aria-label="Cart"
          >
            <FaShoppingCart />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          
          {/* Auth Buttons */}
          {!user && (
            <>
              <Link 
                to="/sign-in"
                className="auth-button px-3 py-1 text-white/90 hover:text-white transition"
              >
                Sign In
              </Link>
              <button
                onClick={handleSignUp}
                className="auth-button-primary px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition"
              >
                Sign Up
              </button>
            </>
          )}
          
          {user && (
            <div className="relative group">
              <button className="flex items-center space-x-1 bg-blue-600/30 hover:bg-blue-600/40 px-2 py-1 rounded-md">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-blue-300 flex items-center justify-center">
                  {user.photoURL ? (
                    <img src={user.photoURL || '/default-avatar.png'} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-500 flex items-center justify-center text-xs text-white font-medium">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <span className="text-white text-sm hidden md:inline">{user.displayName || user.email?.split('@')[0] || 'User'}</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-200 origin-top-right">
                <div className="py-1">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin/dashboard" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            ref={toggleButtonRef}
            onClick={toggleMobileMenu}
            className="mobile-menu-button text-white focus:outline-none"
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? (
              <FaTimes className="text-xl" />
            ) : (
              <FaBars className="text-xl" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden fixed inset-0 z-50 bg-gray-900 bg-opacity-95 overflow-y-auto"
        >
          {/* Close button at top right */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-white hover:text-teal-400 focus:outline-none"
              aria-label="Close menu"
            >
              <FaTimes className="w-8 h-8" />
            </button>
          </div>
          
          {/* Logo at top left */}
          <div className="pt-6 pb-6 flex justify-center">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
              <img src={logo} alt="AI Waverider" className="h-12 w-auto" />
            </Link>
          </div>
          
          <nav className="px-6 py-2">
            <ul className="flex flex-col items-start w-full space-y-4">
              <li>
                <Link
                  to="/"
                  className="flex items-center py-3 text-white hover:text-teal-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaHome className="mr-3 text-lg" /> Home
                </Link>
              </li>
              <li>
                <Link
                  to="/agents"
                  className="flex items-center py-3 text-white hover:text-teal-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaRobot className="mr-3 text-lg" /> Agents
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-tools"
                  className="flex items-center py-3 text-white hover:text-teal-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaTools className="mr-3 text-lg" /> AI Tools
                </Link>
              </li>
              <li>
                <Link
                  to="/latest-tech"
                  className="flex items-center py-3 text-white hover:text-teal-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaMicrochip className="mr-3 text-lg" /> Latest Tech
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="flex items-center py-3 text-white hover:text-teal-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaInfoCircle className="mr-3 text-lg" /> About
                </Link>
              </li>
              <li>
                <Link
                  to="/checkout"
                  className="flex items-center py-3 text-white hover:text-teal-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaShoppingCart className="mr-3 text-lg" /> Cart {itemCount > 0 ? `(${itemCount})` : ''}
                </Link>
              </li>
              
              {/* Dark/Light mode toggle on mobile */}
              <li className="pt-3 mt-3 border-t border-gray-700">
                <button
                  onClick={() => {
                    toggleDarkMode();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center py-3 text-white hover:text-teal-400 w-full"
                  aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {darkMode ? (
                    <>
                      <FaSun className="mr-3 text-lg" /> Switch to Light Mode
                    </>
                  ) : (
                    <>
                      <FaMoon className="mr-3 text-lg" /> Switch to Dark Mode
                    </>
                  )}
                </button>
              </li>
              
              {/* Profile or sign up */}
              {user ? (
                <>
                  <li className="pt-3 mt-3 border-t border-gray-700">
                    <Link
                      to="/profile"
                      className="flex items-center py-3 text-white hover:text-teal-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUser className="mr-3 text-lg" /> Profile
                    </Link>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center py-3 text-white hover:text-teal-400"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center py-3 text-red-400 hover:text-red-300 w-full text-left"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <li className="pt-3 mt-3 border-t border-gray-700">
                  <button
                    onClick={() => {
                      handleSignUp();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center py-3 text-white hover:text-teal-400 w-full text-left"
                  >
                    Sign Up / Sign In
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
