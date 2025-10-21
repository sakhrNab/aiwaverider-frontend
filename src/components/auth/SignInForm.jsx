// src/components/SignIn.jsx

import React, { useState, useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { signIn, signInWithGoogle, signInWithMicrosoft } from '../../api/auth/authApi';

import { toast } from 'react-toastify';
import { getLockInfo, setLockInfo, clearLockInfo } from '../../utils/lockManager';
import './signup.css';

const SignIn = ({ isOpen, onClose, redirectPath }) => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const noop = () => {};
  const handleClose = isOpen !== undefined ? onClose : noop;
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const { user, updateUserProfile } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [networkIssue, setNetworkIssue] = useState(false);
  const [showNetworkGuide, setShowNetworkGuide] = useState(false);
  const isModalView = isOpen !== undefined;
  const shouldRender = isModalView ? isOpen : true;

  useEffect(() => {
    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Add new useEffect for lock persistence
  useEffect(() => {
    const lockInfo = getLockInfo();
    if (lockInfo) {
      setIsLocked(true);
      setAttempts(lockInfo.attempts);
      setLockoutEndTime(new Date(lockInfo.endTime));
      startLockoutTimer((new Date(lockInfo.endTime) - new Date()) / 1000);
    }
  }, []);

  // Add timer effect
  useEffect(() => {
    if (!lockoutEndTime) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = Math.max(0, lockoutEndTime - now);
      if (diff === 0) {
        setIsLocked(false);
        setAttempts(0);
        setLockoutEndTime(null);
        setTimeLeft(null);
        clearLockInfo();
        return;
      }
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    // Update immediately and then every second
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lockoutEndTime]);

  // Replace old timer code with new implementation
  const startLockoutTimer = (duration) => {
    const endTime = new Date(Date.now() + duration * 1000);
    setLockoutEndTime(endTime);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingLock = getLockInfo();
    if (existingLock) {
      const now = new Date();
      const lockEnd = new Date(existingLock.endTime);
      if (now < lockEnd) {
        const timeLeft = Math.ceil((lockEnd - now) / 1000 / 60); // Minutes left
        toast.error(`Account is locked. Please try again in ${timeLeft} minutes.`);
        return;
      }
      clearLockInfo();
    }

    try {
      const data = await signIn(formData.usernameOrEmail, formData.password);
      if (data.firebaseUser) {
        clearLockInfo();
        setAttempts(0);
        setIsLocked(false);
        setLockoutEndTime(null);
        setShowTips(false);
        
        // Update user profile in context
        await updateUserProfile(data.firebaseUser.uid, data.firebaseUser);
        
        toast.success('Successfully signed in!');
        setTimeout(() => navigate(redirectPath || '/', { replace: true }), 100);
      }
    } catch (error) {
      console.error('Sign-in error:', error);

      // Handle Firebase specific errors
      switch (error.code) {
        case 'auth/user-not-found':
          toast.error('No account found with this email address');
          break;
        case 'auth/wrong-password':
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          const remaining = 5 - newAttempts;

          if (remaining <= 0) {
            setIsLocked(true);
            const lockDuration = 15 * 60; // 15 minutes in seconds
            startLockoutTimer(lockDuration);
            setLockInfo(formData.usernameOrEmail, new Date(Date.now() + lockDuration * 1000), 5);
            toast.error('Account locked. Please try again in 15 minutes.');
          } else {
            toast.error(`Invalid password. ${remaining} attempts remaining.`);
            setShowTips(remaining <= 3);
          }
          break;
        case 'auth/too-many-requests':
          setIsLocked(true);
          const lockDuration = 15 * 60;
          startLockoutTimer(lockDuration);
          setLockInfo(formData.usernameOrEmail, new Date(Date.now() + lockDuration * 1000), 5);
          toast.error('Too many failed attempts. Account temporarily locked.');
          break;
        case 'auth/invalid-email':
          toast.error('Please enter a valid email address');
          break;
        default:
          toast.error(error.message || 'An error occurred during sign in');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      // console.log('Starting Google sign-in from SignIn component');
      
      const userData = await signInWithGoogle();
      
      // Check if the sign-in was canceled by the user
      if (userData && userData.canceled) {
        toast.info('Sign-in was canceled');
        return; // Exit early, no need for error handling
      }
      
      // Check if there was a network error
      if (userData && userData.network === false) {
        handleNetworkIssue(userData.message);
        return; // Exit with network error
      }
      
      // console.log('SignIn component received user data:', userData);
      
      if (userData) {
        // Clear any lockout status
        clearLockInfo();
        setAttempts(0);
        setIsLocked(false);
        setLockoutEndTime(null);
        setShowTips(false);
        
        // Update user profile in context if needed
        if (updateUserProfile && userData.uid) {
          await updateUserProfile(userData.uid, userData);
        }
        
        // Show success message
        toast.success('Successfully signed in with Google!');
        
        // If not verified with backend but we have user info, still proceed
        if (userData.isVerified === false) {
          toast.warn('Connected to Google but had trouble verifying with the server. Some features may be limited.', {
            autoClose: 5000
          });
        }
        
        // Navigate to home page
        setTimeout(() => navigate(redirectPath || '/', { replace: true }), 100);
      } else {
        toast.error('Could not retrieve user information from Google');
      }
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      
      // Network-related errors
      if (error.message?.includes('network') || error.code === 'auth/network-request-failed') {
        handleNetworkIssue('Network error during authentication. Click here for troubleshooting tips.');
      } else if (error.message?.includes('NO_ACCOUNT') || error.code === 'auth/no-account') {
        toast.info('No account found. Redirecting to sign up...');
        setTimeout(() => navigate('/sign-up'), 2000);
      } else {
        // For actual errors, show an error message
        toast.error(`Google sign-in failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      setIsLoading(true);
      // console.log('Starting Microsoft sign-in from SignIn component');
      
      const userData = await signInWithMicrosoft();
      
      // Check if the sign-in was canceled by the user
      if (userData && userData.canceled) {
        toast.info('Sign-in was canceled');
        return; // Exit early, no need for error handling
      }
      
      // Check if there was a network error
      if (userData && userData.network === false) {
        handleNetworkIssue(userData.message);
        return; // Exit with network error
      }
      
      // console.log('SignIn component received user data:', userData);
      
      if (userData) {
        // Clear any lockout status
        clearLockInfo();
        setAttempts(0);
        setIsLocked(false);
        setLockoutEndTime(null);
        setShowTips(false);
        
        // Update user profile in context if needed
        if (updateUserProfile && userData.uid) {
          await updateUserProfile(userData.uid, userData);
        }
        
        // Show success message
        toast.success('Successfully signed in with Microsoft!');
        
        // If not verified with backend but we have user info, still proceed
        if (userData.isVerified === false) {
          toast.warn('Connected to Microsoft but had trouble verifying with the server. Some features may be limited.', {
            autoClose: 5000
          });
        }
        
        // Navigate to home page
        setTimeout(() => navigate(redirectPath || '/', { replace: true }), 100);
      } else {
        toast.error('Could not retrieve user information from Microsoft');
      }
    } catch (error) {
      console.error("Microsoft Sign-in Error:", error);
      
      // Network-related errors
      if (error.message?.includes('network') || error.code === 'auth/network-request-failed') {
        handleNetworkIssue('Network error during authentication. Click here for troubleshooting tips.');
      } else if (error.message?.includes('NO_ACCOUNT') || error.code === 'auth/no-account') {
        toast.info('No account found. Redirecting to sign up...');
        setTimeout(() => navigate('/sign-up'), 2000);
      } else {
        // For actual errors, show an error message
        toast.error(`Microsoft sign-in failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Add password requirements hint
  const PasswordHint = () => (
    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
      Password must contain at least 8 characters, including uppercase, lowercase, number and special character (@$!%*?&)
    </div>
  );

  // Check if network is online when component mounts
  useEffect(() => {
    const checkOnlineStatus = () => {
      if (!navigator.onLine) {
        setNetworkIssue(true);
      }
    };
    
    // Check initially
    checkOnlineStatus();
    
    // Add event listeners for online/offline status
    window.addEventListener('online', () => setNetworkIssue(false));
    window.addEventListener('offline', () => setNetworkIssue(true));
    
    return () => {
      window.removeEventListener('online', () => setNetworkIssue(false));
      window.removeEventListener('offline', () => setNetworkIssue(true));
    };
  }, []);
  
  // Function to handle network connectivity issues in sign-in
  const handleNetworkIssue = (message) => {
    setNetworkIssue(true);
    toast.error(message || 'Network connectivity issue detected', {
      autoClose: 8000,
      onClick: () => setShowNetworkGuide(true)
    });
  };
  
  // Network troubleshooting guide
  const NetworkGuide = () => (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-left">
      <h3 className="text-blue-800 font-medium mb-2">Network Connectivity Issues</h3>
      <p className="text-sm text-gray-700 mb-3">
        Authentication requires access to Google and Microsoft servers. Try these steps:
      </p>
      <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1 mb-3">
        <li>Check your internet connection</li>
        <li>Disable any VPN or proxy services temporarily</li>
        <li>Check if your firewall is blocking authentication services</li>
        <li>Try using a different network (like mobile data)</li>
        <li>Clear your browser cache and cookies</li>
      </ol>
      <div className="flex justify-between">
        <button 
          onClick={() => setShowNetworkGuide(false)}
          className="text-xs text-blue-600 hover:underline"
        >
          Close guide
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
        >
          Refresh page
        </button>
      </div>
    </div>
  );

  const formContent = (
    <>
      <h2 className="modal-title">Sign In</h2>
      <p className="modal-subtitle">Welcome back! Continue to your account.</p>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username or Email
          </label>
          <input
            type="text"
            id="usernameOrEmail"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     text-gray-900 dark:text-white 
                     bg-white dark:bg-gray-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Enter your username or email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     text-gray-900 dark:text-white 
                     bg-white dark:bg-gray-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Enter your password"
            required
          />
          {showTips && <PasswordHint />}
        </div>

        <button
          type="submit"
          disabled={isLocked || isLoading}
          className="w-full py-2 sm:py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 
                   text-white text-sm sm:text-base font-semibold rounded-md shadow-sm transition-colors
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="relative my-4 sm:my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-xs sm:text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 font-bold text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <button type="button" onClick={handleGoogleSignIn} disabled={isLoading} className="flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
            Google
          </button>
          <button type="button" onClick={handleMicrosoftSignIn} disabled={isLoading} className="flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <img src="https://www.microsoft.com/favicon.ico" alt="Microsoft" className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
            Microsoft
          </button>
        </div>

        {!isLocked && (
          <p className="modal-footer-note">
            Don't have an account?{' '}
            <a href="/sign-up" className="modal-footer-link">Sign Up</a>
          </p>
        )}

        {isLocked && timeLeft && (
          <div className="mt-4 text-center text-xs sm:text-sm text-red-600 dark:text-red-400">
            Account is locked. Please try again in {timeLeft}
          </div>
        )}

        {networkIssue && (
          <div className="mt-4 p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md">
            <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">{networkIssue}</p>
          </div>
        )}
      </form>
      {showNetworkGuide && (<NetworkGuide />)}
    </>
  );

  if (!shouldRender) return null;

  if (isModalView) {
    return (
      <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="signin-title">
        <div className="modal-content">
          <button type="button" aria-label="Close" onClick={handleClose} className="modal-close-btn">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          {formContent}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[90%] sm:max-w-md mx-auto p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        {formContent}
         
      </div>
    </div>
  );
};

SignIn.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  redirectPath: PropTypes.string,
};

SignIn.defaultProps = {
  isOpen: undefined,
  onClose: () => {},
  redirectPath: '/',
};

export default SignIn;
