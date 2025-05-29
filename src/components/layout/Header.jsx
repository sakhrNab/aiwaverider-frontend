// src/components/Header.jsx
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
  FaUserPlus,
  FaBars,
  FaCircle,
  FaInfoCircle,
  FaTimes as FaX
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
    const toggleMobileMenu = () => {
      const newMenuState = !isMenuOpen;
      document.body.classList.toggle('menu-open', newMenuState);
      setIsMenuOpen(newMenuState);
      
      // For devices with specific dimensions, adjust position
      const isSurfacePro = window.innerWidth === 1368 && window.innerHeight === 912;
      const isIPad = (window.innerWidth === 768 || window.innerWidth === 820 || window.innerWidth === 1024) && 
                    (window.innerHeight === 1024 || window.innerHeight === 1180 || window.innerHeight === 1366);
      
      if (isSurfacePro || isIPad) {
        document.documentElement.classList.toggle('tablet-device', newMenuState);
      }
    };

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
    
    // Cleanup function
    return () => {
      body.classList.remove('admin-page');
    };
  }, [isAdminPage]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen && 
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target) &&
        toggleButtonRef.current && 
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close mobile menu on window resize and handle iPad Air specifically
  useEffect(() => {
    const handleResize = () => {
      // Special case for iPad Air portrait (820x1180)
      const isIpadAirPortrait = window.innerWidth === 820 && window.innerHeight > 1000;
      
      if ((window.innerWidth > 1024 && !isIpadAirPortrait) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);
  
  // Check if we're on iPad Air portrait mode
  useEffect(() => {
    const checkIpadAir = () => {
      const isIpadAirPortrait = window.innerWidth === 820 && window.innerHeight > 1000;
      if (isIpadAirPortrait) {
        document.documentElement.classList.add('ipad-air-portrait');
      } else {
        document.documentElement.classList.remove('ipad-air-portrait');
      }
    };
    
    checkIpadAir();
    window.addEventListener('resize', checkIpadAir);
    return () => window.removeEventListener('resize', checkIpadAir);
  }, []);

  // If we're already on /sign-in, going to sign up should push /sign-up
  const handleSignUp = () => {
    if (typeof openSignUpModal === 'function') {
      openSignUpModal();
    } else {
      document.dispatchEvent(new CustomEvent('open-signup-modal'));
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  // Toggle mobile menu - direct implementation that works across all devices
  const toggleMobileMenu = () => {
    // Create direct DOM manipulation to fix the issue
    // Toggle menu state directly
    const bodyElement = document.body;
    const newMenuState = !bodyElement.classList.contains('menu-open');
    
    // Check device dimensions for specialized handling
    const isSurfacePro = window.innerWidth === 1368 && window.innerHeight === 912;
    const isIPad = [
      // iPad Mini
      window.innerWidth === 768 && window.innerHeight === 1024,
      // iPad Air
      window.innerWidth === 820 && window.innerHeight === 1180,
      // iPad Pro
      window.innerWidth === 1024 && window.innerHeight === 1366
    ].some(condition => condition);
    const isNestHub = [
      // Nest Hub
      window.innerWidth === 1024 && window.innerHeight === 600,
      // Nest Hub Max
      window.innerWidth === 1280 && window.innerHeight === 800
    ].some(condition => condition);
    
    if (newMenuState) {
      // Opening menu
      bodyElement.classList.add('menu-open');
      
      // Add device-specific classes
      if (isSurfacePro) document.documentElement.classList.add('surface-pro');
      if (isIPad) document.documentElement.classList.add('ipad-device');
      if (isNestHub) document.documentElement.classList.add('nest-hub');
      
    } else {
      // Closing menu
      bodyElement.classList.remove('menu-open');
      
      // Remove device-specific classes
      document.documentElement.classList.remove('surface-pro', 'ipad-device', 'nest-hub');
    }
    
    setIsMenuOpen(newMenuState);
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
        
        {/* Desktop Navigation - hidden at 1024px and below */}
        <nav className="hidden 2xl:flex items-center justify-center flex-grow">
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
        
        {/* Desktop Right Side - hidden at 1024px and below */}
        <div className="hidden 2xl:flex items-center space-x-2">
          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-full hover:bg-gray-100/10 transition-colors text-white"
          >
            {darkMode ? <FaSun className="text-white" /> : <FaMoon className="text-white" />}
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
          
          {/* Auth Buttons - Hidden on Mobile */}
            {!user && (
              <div className="relative group">
                <button className="account-access-button flex items-center space-x-1 bg-gradient-to-r from-blue-600/30 to-teal-500/30 hover:from-blue-600/40 hover:to-teal-500/40 px-2 py-1 rounded-md transition-all duration-300 group">
                  <div className="avatar w-7 h-7 rounded-full overflow-hidden border border-blue-300 group-hover:border-teal-300 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-xs text-white font-medium group-hover:scale-105 transition-transform duration-300">
                      <FaUser />
                    </div>
                  </div>
                  <span className="text-white text-sm hidden md:inline group-hover:text-teal-200 transition-colors duration-300">Account Access</span>
                </button>
                
                <div className="account-access-dropdown absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-200 origin-top-right">
                  <div className="py-1">
                    <Link 
                      to="/sign-in" 
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 border-l-0 hover:border-l-4 hover:border-blue-500 hover:pl-3"
                    >
                      <span className="flex items-center"><FaUser className="mr-2 text-blue-400" /> Sign In</span>
                    </Link>
                    <button
                      onClick={handleSignUp}
                      className="block w-full text-left px-4 py-3 text-sm text-teal-600 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200 border-l-0 hover:border-l-4 hover:border-teal-500 hover:pl-3"
                    >
                      <span className="flex items-center"><FaUserPlus className="mr-2 text-teal-400" /> Sign Up</span>
                    </button>
                  </div>
                </div>
              </div>
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

        {/* Mobile menu button - visible at 1024px and below */}
        <div className="2xl:hidden flex items-center">
          <button 
            ref={toggleButtonRef}
            className="2xl:hidden text-white hover:text-[#00bcd4] p-2 flex items-center justify-center flex-shrink-0 rounded-md"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}
          >
            <FaBars className="text-xl" />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu - Enhanced for better accessibility and UX */}
      <div 
        ref={mobileMenuRef}
        className="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        style={{ display: isMenuOpen ? 'block' : 'none' }}
      >
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <div className="flex items-center">
              <img src={logo} alt="AI Waverider" className="w-10 h-10 mr-2" />
              <span className="font-bold text-xl text-indigo-600">AIWaverider</span>
            </div>
            {/* Mobile Menu Button - Enhanced for all device sizes */}
          <button
            onClick={toggleMobileMenu}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-500/20 active:bg-blue-600/30 transition-all duration-300 text-white sm:text-xl md:hidden"
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <FaX className="text-2xl text-blue-400" /> : <FaBars className="text-2xl" />}
          </button>
          </div>
          <nav className="container mx-auto px-4 py-3">
            <ul className="space-y-1">
              <li className="mobile-nav-item">
                <Link
                  to="/"
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-teal-600 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaHome className="mr-3" /> Home
                </Link>
              </li>
              <li className="mobile-nav-item">
                <Link
                  to="/agents"
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-teal-600 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaRobot className="mr-3" /> Agents
                </Link>
              </li>
              <li className="mobile-nav-item">
                <Link
                  to="/ai-tools"
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-teal-600 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaTools className="mr-3" /> AI Tools
                </Link>
              </li>
              <li className="mobile-nav-item">
                <Link
                  to="/latest-tech"
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-teal-600 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaMicrochip className="mr-3" /> Latest Tech
                </Link>
              </li>
              <li className="mobile-nav-item">
                <Link
                  to="/about"
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-teal-600 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaInfoCircle className="mr-3" /> About
                </Link>
              </li>
              <li className="mobile-nav-item">
                <Link
                  to="/checkout"
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-teal-600 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaShoppingCart className="mr-3" /> Cart {itemCount > 0 ? `(${itemCount})` : ''}
                </Link>
              </li>
              
              {/* Dark/Light mode toggle on mobile */}
              <li className="mobile-nav-item">
                <button
                  onClick={() => {
                    toggleDarkMode();
                    setIsMenuOpen(false);
                  }}
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-teal-600 flex items-center w-full"
                >
                  {darkMode ? <FaSun className="mr-3" /> : <FaMoon className="mr-3" />}
                  {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                </button>
              </li>
              
              {/* Mobile-only auth options */}
              <li className="pt-2 mt-2 border-t border-gray-200">
                {!user && (
                  <div className="mobile-account-options flex flex-col space-y-2">
                    <div className="flex flex-col gap-3 px-4">
                      {/* Sign In Link - Clean, Aligned Design */}
                      <Link
                        to="/sign-in"
                        className="w-full py-3 px-4 rounded-md bg-white border border-blue-100 text-blue-700 hover:bg-blue-50 transition-colors duration-200 flex items-center shadow-smw-full py-3 px-4 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white transition-colors duration-200 flex items-center justify-center shadow-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="mr-3">
                          <FaUserPlus className="text-white" size={18} />
                        </div>
                        <div>
                          <span className="font-bold text-lg">Sign In</span>
                          <span className="text-sm text-white/80 block">Access your account</span>
                        </div>
                      </Link>
                      
                      {/* Create Account Button - Clean, Aligned Design */}
                      <button
                        className="w-full py-3 px-4 rounded-md bg-white border border-blue-100 text-blue-700 hover:bg-blue-50 transition-colors duration-200 flex items-center shadow-smw-full py-3 px-4 rounded-md bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white transition-colors duration-200 flex items-center justify-center shadow-md"
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleSignUp();
                        }}
                      >
                        <div className="mr-3">
                          <FaUserPlus className="text-white" size={18} />
                        </div>
                        <div>
                          <span className="font-bold text-lg">Create Account</span>
                          <span className="text-sm text-white/80 block">Join the AI wave</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
                
                {user && (
                  <div className="flex flex-col space-y-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-teal-600 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUser className="mr-3" /> Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin/agents"
                        className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-teal-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSignOut();
                      }}
                      className="mx-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-center mt-2"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
    </header>
  );
};

export default Header;