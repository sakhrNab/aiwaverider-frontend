// src/components/SignUp.jsx

import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import { signUp, signUpWithGoogle, signUpWithMicrosoft } from '../../api/auth/authApi';
import { AuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext'; // Import theme context
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash, faStar } from '@fortawesome/free-solid-svg-icons';
import { validateEmail } from '../../utils/emailValidator';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = ({ isOpen, onClose }) => {
  const noop = () => {};
  const handleClose = isOpen !== undefined ? onClose : noop;
  const { darkMode } = useTheme(); // Get current theme

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailError, setEmailError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const isModalView = isOpen !== undefined;
  const shouldRender = isModalView ? isOpen : true;
  const { signInUser, handleSignupData } = useContext(AuthContext);

  // Calculate password strength with more detailed scoring
  const calculatePasswordStrength = useCallback((password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++; // Bonus for longer passwords
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 5); // Cap at 5
  }, []);

  const getStrengthData = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return { class: 'strength-weak', text: 'Weak', textClass: 'strength-weak-text' };
      case 2:
        return { class: 'strength-fair', text: 'Fair', textClass: 'strength-fair-text' };
      case 3:
      case 4:
        return { class: 'strength-good', text: 'Good', textClass: 'strength-good-text' };
      case 5:
        return { class: 'strength-strong', text: 'Strong', textClass: 'strength-strong-text' };
      default:
        return { class: 'strength-weak', text: 'Weak', textClass: 'strength-weak-text' };
    }
  };

  // Handle modal outside click
  useEffect(() => {
    if (!isModalView) return;

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleClose, isModalView]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  }, [calculatePasswordStrength]);

  const handleEmailChange = (e) => {
    const { value } = e.target;
    const validation = validateEmail(value);
    
    setEmailError(validation.isValid ? '' : validation.message);
    handleInputChange(e);
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField('');
  };

  // NEW: Handle successful signup response
  const handleSuccessfulSignup = useCallback(async (result, method = 'email') => {
    try {
      console.log('[SignUp] Processing successful signup:', result);
      
      // Handle the signup response data
      if (result.user || result.profile) {
        const userData = result.user || result.profile;
        
        // Store user data for AuthContext
        if (signInUser) {
          signInUser(userData);
        }
        
        // Handle signup data for immediate use
        if (handleSignupData) {
          handleSignupData(result);
        }
        
        // Show success message
        const successMessage = result.message || 
          (method === 'social' ? '🎉 Welcome aboard! Your account has been created successfully!' : 
           '🎉 Welcome aboard! Your account has been created successfully!');
           
        toast.success(successMessage, {
          theme: darkMode ? 'dark' : 'light',
          position: "top-center",
          autoClose: 3000,
        });
        
        // Wait a moment to ensure auth state is updated before navigating
        setTimeout(() => {
          navigate('/', { replace: true });
          if (isModalView) {
            handleClose();
          }
        }, 100);
      }
    } catch (err) {
      console.error('[SignUp] Error handling successful signup:', err);
      // Still navigate on success even if there was an error processing the response
      navigate('/', { replace: true });
      if (isModalView) {
        handleClose();
      }
    }
  }, [signInUser, handleSignupData, darkMode, navigate, isModalView, handleClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate email
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        setError(emailValidation.message);
        setIsLoading(false);
        return;
      }

      // Validate password strength (at least fair)
      if (passwordStrength < 2) {
        setError('Please create a stronger password with at least 8 characters');
        setIsLoading(false);
        return;
      }

      // Generate username from email
      const username = `user_${formData.email.split('@')[0]}_${Date.now().toString().slice(-4)}`;

      // Prepare signup data with generated/default values
      const signupData = {
        username: username,
        firstName: formData.firstName,
        lastName: '', // Will be collected later in onboarding
        email: formData.email,
        phoneNumber: '', // Will be collected later in onboarding  
        password: formData.password,
        confirmPassword: formData.password, // Same as password since we removed confirm field
      };

      console.log('[SignUp] Attempting email signup:', { email: signupData.email, username });
      const result = await signUp(signupData);
      
      if (result && (result.user || result.firebaseUser)) {
        await handleSuccessfulSignup(result, 'email');
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle specific errors with better messaging
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Try signing in instead or use a different email.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address');
          break;
        case 'auth/weak-password':
          setError('Please create a stronger password with at least 8 characters');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection and try again.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please wait a moment before trying again.');
          break;
        default:
          setError(error.message || 'Something went wrong. Please try again or contact support.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      console.log('[SignUp] Attempting Google signup');
      const result = await signUpWithGoogle();
      
      if (result && result.firebaseUser) {
        console.log('[SignUp] Google signup successful:', result);
        await handleSuccessfulSignup(result, 'social');
      }
    } catch (error) {
      console.error("Google Sign-up Error:", error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        // Don't show error for user cancellation
        return;
      }
      
      if (error.response && error.response.data) {
        setError(`Google signup failed: ${error.response.data.error || error.response.data.message || error.message}`);
      } else {
        setError(`Google signup failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftSignUp = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      console.log('[SignUp] Attempting Microsoft signup');
      const result = await signUpWithMicrosoft();
      
      if (result && result.firebaseUser) {
        console.log('[SignUp] Microsoft signup successful:', result);
        await handleSuccessfulSignup(result, 'social');
      }
    } catch (error) {
      console.error("Microsoft Sign-up Error:", error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        // Don't show error for user cancellation
        return;
      }
      
      if (error.response && error.response.data) {
        setError(`Microsoft signup failed: ${error.response.data.error || error.response.data.message || error.message}`);
      } else {
        setError(`Microsoft signup failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!shouldRender) {
    return null;
  }

  const strengthData = getStrengthData(passwordStrength);
  const isFormValid = formData.firstName && formData.email && formData.password && passwordStrength >= 2 && !emailError;

  // Shared form content
  const formContent = (
    <>
      {/* Enhanced Header with stars */}
      <div className="text-center mb-8">
        <h1 className="modal-title">
          <FontAwesomeIcon icon={faStar} className="mr-2" style={{ fontSize: '0.8em' }} />
          Join Us Today
          <FontAwesomeIcon icon={faStar} className="ml-2" style={{ fontSize: '0.8em' }} />
        </h1>
        <p className="modal-subtitle">Create your account in seconds ⚡</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Social Login Buttons */}
      <div className="social-buttons">
        <button
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="social-button google-button"
          aria-label="Sign up with Google"
        >
          <FontAwesomeIcon icon={faGoogle} className="icon" />
          Continue with Google
        </button>
        <button
          onClick={handleMicrosoftSignUp}
          disabled={isLoading}
          className="social-button microsoft-button"
          aria-label="Sign up with Microsoft"
        >
          <FontAwesomeIcon icon={faMicrosoft} className="icon" />
          Continue with Microsoft
        </button>
      </div>

      {/* Fixed Divider */}
      <div className="divider">
        <span className="divider-text">or create account with email</span>
      </div>

      {/* Email Signup Form */}
      <form onSubmit={handleSubmit} className="signup-form" noValidate>
        {/* First Name */}
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            onFocus={() => handleFocus('firstName')}
            onBlur={handleBlur}
            className={`form-input ${focusedField === 'firstName' ? 'focused' : ''}`}
            placeholder="Enter your first name"
            required
            disabled={isLoading}
            autoComplete="given-name"
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleEmailChange}
            onFocus={() => handleFocus('email')}
            onBlur={handleBlur}
            className={`form-input ${focusedField === 'email' ? 'focused' : ''} ${emailError ? 'border-red-500' : ''}`}
            placeholder="Enter your email"
            required
            disabled={isLoading}
            autoComplete="email"
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              className={`form-input ${focusedField === 'password' ? 'focused' : ''}`}
              placeholder="Create a strong password"
              required
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div className={`strength-fill ${strengthData.class}`}></div>
              </div>
              <div className={`strength-text ${strengthData.textClass}`}>
                <span>Password strength: {strengthData.text}</span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="button-group">
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="button primary"
            aria-describedby={!isFormValid ? 'form-validation-help' : undefined}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
          
          {isModalView && (
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="button secondary"
              aria-label="Cancel signup"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Hidden validation help text for screen readers */}
        <div id="form-validation-help" className="sr-only">
          Please fill in all required fields with valid information to continue.
        </div>
      </form>

      {/* Terms */}
      <p className="terms-text">
        By creating an account, you agree to our{' '}
        <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
      </p>

      {/* Login Link */}
      <p className="login-link">
        Already have an account?{' '}
        <a href="/sign-in" onClick={(e) => {
          if (isModalView) {
            e.preventDefault();
            handleClose();
            // Trigger sign in modal or navigate
            navigate('/sign-in');
          }
        }}>
          Sign in here
        </a>
      </p>

      {/* Enhanced Trust Indicators */}
      <div className="trust-indicators">
        <div className="trust-grid">
          <div className="trust-item">
            <div className="trust-dot trust-green"></div>
            SSL Secured
          </div>
          <div className="trust-item">
            <div className="trust-dot trust-blue"></div>
            GDPR Compliant
          </div>
          <div className="trust-item">
            <div className="trust-dot trust-purple"></div>
            No Spam Promise
          </div>
        </div>
      </div>
    </>
  );

  // Modal View
  if (isModalView) {
    return (
      <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="signup-title">
        <div ref={modalRef} className="modal-content">
          {formContent}
        </div>
      </div>
    );
  }

  // Page View
  return (
    <div className="page-container">
      <div className="page-content">
        {formContent}
      </div>
    </div>
  );
};

SignUp.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

SignUp.defaultProps = {
  isOpen: undefined,
  onClose: () => {},
};

export default SignUp;