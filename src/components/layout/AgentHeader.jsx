// src/components/layout/AgentHeader.jsx
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
  FaTimes as FaX,
  FaSignOutAlt,
  FaUserShield,
  FaVideo,
  FaLightbulb
} from 'react-icons/fa';
import { MdKeyboardArrowDown } from 'react-icons/md';
import './AgentHeader.css';
import '../../styles/animations.css';
import { motion, AnimatePresence } from 'framer-motion';

const AgentHeader = ({ openSignUpModal }) => {
  const { user, signOut, loading } = useContext(AuthContext);
  const { itemCount } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    const body = document.querySelector('body');
    if (isMenuOpen) body.classList.add('menu-open');
    else body.classList.remove('menu-open');
    return () => body.classList.remove('menu-open');
  }, [isMenuOpen]);

  useEffect(() => {
    const body = document.querySelector('body');
    if (isAdminPage) body.classList.add('admin-page');
    else body.classList.remove('admin-page');
    return () => body.classList.remove('admin-page');
  }, [isAdminPage]);

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
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      const isIpadAirPortrait = window.innerWidth === 820 && window.innerHeight > 1000;
      if ((window.innerWidth >= 800 && !isIpadAirPortrait) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  const handleSignUp = () => {
    if (typeof openSignUpModal === 'function') openSignUpModal();
    else document.dispatchEvent(new CustomEvent('open-signup-modal'));
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

  const toggleMobileMenu = () => {
    const bodyElement = document.body;
    const newMenuState = !bodyElement.classList.contains('menu-open');
    if (newMenuState) bodyElement.classList.add('menu-open');
    else bodyElement.classList.remove('menu-open');
    setIsMenuOpen(newMenuState);
  };

  const getUserDisplayName = () => {
    if (!user) return null;
    return user.displayName || user.firstName || user.email?.split('@')[0] || 'User';
  };

  const getUserAvatar = () => {
    if (!user) return null;
    if (user.photoURL && user.photoURL !== '/default-avatar.png') return user.photoURL;
    return null;
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const displayName = getUserDisplayName();
    if (displayName && displayName.length > 0) return displayName.charAt(0).toUpperCase();
    return user.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <>
      <header className={`main-header ${darkMode 
        ? 'bg-gradient-to-r from-gray-900/90 via-indigo-950/80 to-gray-900/90 border-b border-indigo-700/30 shadow-lg shadow-indigo-900/20' 
        : 'bg-gradient-to-r from-blue-600/90 via-indigo-500/80 to-purple-500/90 border-b border-indigo-300 shadow-lg shadow-indigo-500/20'} transition-all duration-300`}>
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
            className={`absolute -top-24 -right-24 w-48 h-48 rounded-full ${darkMode ? 'bg-indigo-600' : 'bg-blue-400'} blur-3xl`}
          />
          <motion.div 
            animate={{ y: [-10, 10, -10], opacity: [0.1, 0.2, 0.1] }}
            transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
            className={`absolute -bottom-24 -left-24 w-48 h-48 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-indigo-400'} blur-3xl`}
          />
        </div>

        <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center relative">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }} className="flex-shrink-0 flex items-center mr-4">
            <Link to="/" className="flex items-center">
              <motion.img whileHover={{ rotate: 10 }} src={logo} alt="AI Waverider" className="min-w-[40px] w-10 md:w-12 h-auto site-logo" />
              <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className={`ml-2 font-bold text-lg md:text-xl text-transparent bg-clip-text ${darkMode 
                  ? 'bg-gradient-to-r from-blue-300 to-purple-300' 
                  : 'bg-gradient-to-r from-yellow-300 via-orange-200 to-yellow-100 drop-shadow-lg'}`}>
                AIWaverider
              </motion.span>
            </Link>
          </motion.div>

          <nav className="hidden custom-1000:flex items-center justify-center flex-grow">
            <ul className="flex nav-links items-center">
              <li className="nav-item flex items-center">
                <Link to="/" className="nav-link px-2 py-1 md:px-3 md:py-2 rounded-md font-medium flex items-center text-white hover:bg-opacity-10 hover:bg-white" aria-label="Home">
                  <FaHome className="mr-1.5" /> <span>Home</span>
                </Link>
                <span className="nav-dot mx-2 text-[6px] text-white opacity-70"><FaCircle /></span>
              </li>
              <li className="nav-item flex items-center">
                <Link to="/agents" className="nav-link px-2 py-1 md:px-3 md:py-2 rounded-md font-medium flex items-center text-white hover:bg-opacity-10 hover:bg-white" aria-label="AI Agents">
                  <FaRobot className="mr-1.5" /> <span>AI Agents</span>
                </Link>
                <span className="nav-dot mx-2 text-[6px] text-white opacity-70"><FaCircle /></span>
              </li>
              <li className="nav-item flex items-center">
                <div className="relative group">
                  <button className="nav-link px-2 py-1 md:px-3 md:py-2 rounded-md font-medium flex items-center text-white hover:bg-opacity-10 hover:bg-white" aria-label="AI Tools & Prompts" aria-expanded="false">
                    <FaTools className="mr-1.5" />
                    <div className="flex flex-col items-start">
                      <span>AI Tools</span>
                      <span className="text-xs mt-[-2px] text-blue-200">& Prompts</span>
                    </div>
                    <MdKeyboardArrowDown className="ml-1 text-xs" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200 dark:border-gray-700">
                    <Link to="/ai-tools" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg">
                      <FaTools className="mr-2 inline" /> AI Tools
                    </Link>
                    <Link to="/prompts" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg">
                      <FaLightbulb className="mr-2 inline" /> Prompts
                    </Link>
                  </div>
                </div>
                <span className="nav-dot mx-2 text-[6px] text-white opacity-70"><FaCircle /></span>
              </li>
              <li className="nav-item flex items-center">
                <Link to="/latest-tech" className="nav-link px-2 py-1 md:px-3 md:py-2 rounded-md font-medium flex items-center text-white hover:bg-opacity-10 hover:bg-white" aria-label="Latest News & Tutorials">
                  <FaMicrochip className="mr-1.5" />
                  <div className="flex flex-col items-start">
                    <span>Latest Tech News</span>
                    <span className="text-xs mt-[-2px] text-blue-200">& Tutorials</span>
                  </div>
                </Link>
                <span className="nav-dot mx-2 text-[6px] text-white opacity-70"><FaCircle /></span>
              </li>
              <li className="nav-item flex items-center">
                <Link to="/videos" className="nav-link px-2 py-1 md:px-3 md:py-2 rounded-md font-medium flex items-center text-white hover:bg-opacity-10 hover:bg-white" aria-label="Video Gallery">
                  <FaVideo className="mr-1.5" /> <span>Videos</span>
                </Link>
                <span className="nav-dot mx-2 text-[6px] text-white opacity-70"><FaCircle /></span>
              </li>
              <li className="nav-item flex items-center">
                <Link to="/about" className="nav-link px-2 py-1 md:px-3 md:py-2 rounded-md font-medium flex items-center text-white hover:bg-opacity-10 hover:bg-white" aria-label="About">
                  <FaInfoCircle className="mr-1.5" /> <span>About Us</span>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center space-x-3">
            <button onClick={toggleDarkMode} aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'} className="theme-toggle-btn p-2 rounded-full hover:bg-gray-100/10 transition-colors text-white">
              {darkMode ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-white" />}
            </button>
            <Link to="/checkout" className="cart-btn p-2 rounded-full hover:bg-gray-100/10 transition-colors relative text-white" aria-label="Cart">
              <FaShoppingCart />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{itemCount}</span>
              )}
            </Link>

            <div className="relative" ref={profileDropdownRef}>
              <button onClick={() => setProfileDropdownOpen(o => !o)} className="profile-btn flex items-center space-x-1 hover:bg-gray-100/10 rounded-full transition-all duration-200" aria-label="Profile options" aria-expanded={profileDropdownOpen} disabled={loading}>
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-300/50 hover:border-indigo-300 transition-colors duration-200 flex items-center justify-center">
                  {loading ? (
                    <div className="w-full h-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-xs text-white font-medium animate-pulse"><FaUser /></div>
                  ) : user && getUserAvatar() ? (
                    <img src={getUserAvatar()} alt={getUserDisplayName() || 'User'} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-xs text-white font-medium">
                      {user ? (getUserInitials()) : (<FaUser />)}
                    </div>
                  )}
                </div>
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2 }} className="profile-dropdown absolute right-0 mt-2 w-56 glass-effect-dark dark:glass-effect rounded-lg shadow-xl overflow-hidden z-20 origin-top-right">
                    {user ? (
                      <div className="profile-dropdown-content">
                        <div className="px-4 py-3 border-b border-gray-200/10 text-center">
                          <div className="font-medium text-white truncate">{getUserDisplayName()}</div>
                          <div className="text-xs text-gray-300 truncate">{user.email}</div>
                        </div>
                        <div className="py-1">
                          <Link to="/profile" className="block px-4 py-2 text-sm text-gray-200 hover:bg-indigo-500/20 flex items-center" onClick={() => setProfileDropdownOpen(false)}>
                            <FaUser className="mr-2 text-indigo-300" /> Profile
                          </Link>
                          {user.role === 'admin' && (
                            <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-200 hover:bg-indigo-500/20 flex items-center" onClick={() => setProfileDropdownOpen(false)}>
                              <FaUserShield className="mr-2 text-indigo-300" /> Admin Dashboard
                            </Link>
                          )}
                          <button onClick={() => { setProfileDropdownOpen(false); handleSignOut(); }} className="block w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 flex items-center">
                            <FaSignOutAlt className="mr-2 text-red-400" /> Sign Out
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-1">
                        <Link to="/sign-in" className="block px-4 py-2 text-sm text-gray-200 hover:bg-indigo-500/20 flex items-center" onClick={() => setProfileDropdownOpen(false)}>
                          <FaUser className="mr-2 text-indigo-300" /> Sign In
                        </Link>
                        <button onClick={() => { setProfileDropdownOpen(false); handleSignUp(); }} className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-indigo-500/20 flex items-center">
                          <FaUserPlus className="mr-2 text-indigo-300" /> Sign Up
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button ref={toggleButtonRef} className="mobile-menu-btn custom-1000:hidden text-white hover:text-[#00bcd4] p-2 flex items-center justify-center flex-shrink-0 rounded-md" onClick={toggleMobileMenu} aria-label="Toggle mobile menu" aria-expanded={isMenuOpen}>
              <FaBars className="text-xl" />
            </button>
          </div>
        </div>
      </header>

      <div ref={mobileMenuRef} className="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation menu" style={{ display: isMenuOpen ? 'block' : 'none' }}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center">
            <img src={logo} alt="AI Waverider" className="w-10 h-10 mr-2" />
            <span className="font-bold text-xl text-indigo-600">AIWaverider</span>
          </div>
          <button onClick={toggleMobileMenu} className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-500/20 active:bg-blue-600/30 transition-all duration-300 text-white sm:text-xl md:hidden" aria-label="Toggle mobile menu">
            {isMenuOpen ? <FaX className="text-2xl text-blue-400" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
        <nav className="container mx-auto px-4 py-3">
          <ul className="space-y-1">
            <li className="mobile-nav-item"><Link to="/" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-teal-600 flex items-center" onClick={() => setIsMenuOpen(false)}><FaHome className="mr-3" /> Home</Link></li>
            <li className="mobile-nav-item"><Link to="/agents" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-teal-600 flex items-center" onClick={() => setIsMenuOpen(false)}><FaRobot className="mr-3" /> Agents</Link></li>
            <li className="mobile-nav-item"><Link to="/ai-tools" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-teal-600 flex items-center" onClick={() => setIsMenuOpen(false)}><FaTools className="mr-3" /> AI Tools</Link></li>
            <li className="mobile-nav-item"><Link to="/prompts" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-teal-600 flex items-center" onClick={() => setIsMenuOpen(false)}><FaLightbulb className="mr-3" /> Prompts</Link></li>
            <li className="mobile-nav-item"><Link to="/latest-tech" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-teal-600 flex items-center" onClick={() => setIsMenuOpen(false)}><FaMicrochip className="mr-3" /> <div className="flex flex-col items-start"><span>Latest Tech News</span><span className="text-xs text-gray-500">Tutorials</span></div></Link></li>
            <li className="mobile-nav-item"><Link to="/videos" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-teal-600 flex items-center" onClick={() => setIsMenuOpen(false)}><FaVideo className="mr-3" /> Videos</Link></li>
            <li className="mobile-nav-item"><Link to="/about" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-teal-600 flex items-center" onClick={() => setIsMenuOpen(false)}><FaInfoCircle className="mr-3" /> About</Link></li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default AgentHeader; 