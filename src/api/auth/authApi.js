// src/api/auth/authApi.js

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  verifyPasswordResetCode as firebaseVerifyPasswordResetCode,
  browserPopupRedirectResolver
} from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { api, API_URL } from '../core/apiConfig';

// Initialize providers
const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

// Configure Google provider
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Configure Microsoft provider
microsoftProvider.addScope('email');
microsoftProvider.addScope('profile');

/**
 * Register backend user after Firebase signup
 */
const registerBackendUser = async (firebaseUser, additionalData = {}) => {
  try {
    console.log('[AuthAPI] Registering backend user for:', firebaseUser.email);
    
    // Get the ID token for authentication
    const idToken = await firebaseUser.getIdToken();
    
    // Prepare user data for backend
    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || additionalData.displayName || firebaseUser.email.split('@')[0],
      photoURL: firebaseUser.photoURL || additionalData.photoURL || '',
      firstName: additionalData.firstName || firebaseUser.displayName?.split(' ')[0] || firebaseUser.email.split('@')[0],
      lastName: additionalData.lastName || firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
      username: additionalData.username || `user_${firebaseUser.email.split('@')[0]}_${Date.now().toString().slice(-4)}`,
      phoneNumber: firebaseUser.phoneNumber || additionalData.phoneNumber || ''
    };
    
    console.log('[AuthAPI] Sending backend registration request with data:', userData);
    
    // Call backend signup endpoint with increased timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(userData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[AuthAPI] Backend registration failed:', response.status, errorData);
        throw new Error(errorData.error || `Backend registration failed: ${response.status}`);
      }
      
      const backendResponse = await response.json();
      console.log('[AuthAPI] Backend registration successful:', backendResponse);
      
      // Ensure we have complete profile data in the response
      const profileData = backendResponse.user || backendResponse.profile || {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        role: 'authenticated'
      };
      
      return {
        firebaseUser,
        backendResponse,
        user: profileData,
        profile: profileData // Ensure profile data is available
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        throw new Error('Registration request timed out. Please try again.');
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.error('[AuthAPI] Error registering backend user:', error);
    
    // Return partial success with Firebase user data as fallback
    const fallbackUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
      photoURL: firebaseUser.photoURL || '',
      firstName: additionalData.firstName || firebaseUser.displayName?.split(' ')[0] || firebaseUser.email.split('@')[0],
      lastName: additionalData.lastName || firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
      role: 'authenticated',
      username: additionalData.username || `user_${firebaseUser.email.split('@')[0]}_${Date.now().toString().slice(-4)}`
    };
    
    return {
      firebaseUser,
      backendResponse: null,
      error: error.message,
      user: fallbackUser,
      profile: fallbackUser
    };
  }
};

/**
 * Sign up with email and password
 */
export const signUp = async (userData) => {
  try {
    console.log('[AuthAPI] Starting email signup process for:', userData.email);
    
    // Validate required fields
    if (!userData.email || !userData.password) {
      throw new Error('Email and password are required');
    }
    
    if (!userData.firstName) {
      throw new Error('First name is required');
    }
    
    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    const firebaseUser = userCredential.user;
    console.log('[AuthAPI] Firebase user created successfully:', firebaseUser.uid);
    
    // Store auth token immediately
    const idToken = await firebaseUser.getIdToken();
    localStorage.setItem('authToken', idToken);
    
    // Register with backend
    const result = await registerBackendUser(firebaseUser, {
      firstName: userData.firstName,
      lastName: userData.lastName || '',
      username: userData.username,
      phoneNumber: userData.phoneNumber || ''
    });
    
    console.log('[AuthAPI] Email signup completed successfully');
    return result;
  } catch (error) {
    console.error('[AuthAPI] Email signup error:', error);
    throw error;
  }
};

/**
 * Sign up with Google
 */
export const signUpWithGoogle = async () => {
  try {
    console.log('[AuthAPI] Starting Google signup process');
    
    // Use browserPopupRedirectResolver to fix popup issues
    const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    const firebaseUser = result.user;
    
    console.log('[AuthAPI] Google Firebase user created:', firebaseUser.uid);
    
    // Store auth token immediately
    const idToken = await firebaseUser.getIdToken();
    localStorage.setItem('authToken', idToken);
    
    // Register with backend
    const backendResult = await registerBackendUser(firebaseUser, {
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL
    });
    
    console.log('[AuthAPI] Google signup completed successfully');
    return backendResult;
  } catch (error) {
    console.error('[AuthAPI] Google signup error:', error);
    
    // Enhanced error handling for common popup issues
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked by browser. Please allow popups and try again.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Popup was closed. Please try again.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized. Please contact support.');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Google sign-in is not enabled. Please contact support.');
    }
    
    throw error;
  }
};

/**
 * Sign up with Microsoft
 */
export const signUpWithMicrosoft = async () => {
  try {
    console.log('[AuthAPI] Starting Microsoft signup process');
    
    // Use browserPopupRedirectResolver to fix popup issues
    const result = await signInWithPopup(auth, microsoftProvider, browserPopupRedirectResolver);
    const firebaseUser = result.user;
    
    console.log('[AuthAPI] Microsoft Firebase user created:', firebaseUser.uid);
    
    // Store auth token immediately
    const idToken = await firebaseUser.getIdToken();
    localStorage.setItem('authToken', idToken);
    
    // Register with backend
    const backendResult = await registerBackendUser(firebaseUser, {
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL
    });
    
    console.log('[AuthAPI] Microsoft signup completed successfully');
    return backendResult;
  } catch (error) {
    console.error('[AuthAPI] Microsoft signup error:', error);
    
    // Enhanced error handling for common popup issues
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked by browser. Please allow popups and try again.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Popup was closed. Please try again.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized. Please contact support.');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Microsoft sign-in is not enabled. Please contact support.');
    }
    
    throw error;
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (email, password) => {
  try {
    console.log('[AuthAPI] Starting email sign in for:', email);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Store auth token
    const idToken = await firebaseUser.getIdToken();
    localStorage.setItem('authToken', idToken);
    
    console.log('[AuthAPI] Email sign in successful:', firebaseUser.uid);
    
    // Create session with backend
    try {
      const response = await api.post('/api/auth/create-session', { idToken });
      console.log('[AuthAPI] Backend session created:', response.data);
      
      return {
        firebaseUser,
        backendResponse: response.data,
        user: response.data.user,
        profile: response.data.user
      };
    } catch (sessionError) {
      console.warn('[AuthAPI] Failed to create backend session:', sessionError);
      
      // Return Firebase user data as fallback
      return {
        firebaseUser,
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL || '',
          role: 'authenticated'
        }
      };
    }
  } catch (error) {
    console.error('[AuthAPI] Email sign in error:', error);
    throw error;
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    console.log('[AuthAPI] Starting Google sign in');
    
    const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    const firebaseUser = result.user;
    
    // Store auth token
    const idToken = await firebaseUser.getIdToken();
    localStorage.setItem('authToken', idToken);
    
    console.log('[AuthAPI] Google sign in successful:', firebaseUser.uid);
    
    // Create session with backend
    try {
      const response = await api.post('/api/auth/create-session', { idToken });
      console.log('[AuthAPI] Backend session created:', response.data);
      
      return {
        firebaseUser,
        backendResponse: response.data,
        user: response.data.user,
        profile: response.data.user
      };
    } catch (sessionError) {
      console.warn('[AuthAPI] Failed to create backend session:', sessionError);
      
      // Return Firebase user data as fallback
      return {
        firebaseUser,
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL || '',
          role: 'authenticated'
        }
      };
    }
  } catch (error) {
    console.error('[AuthAPI] Google sign in error:', error);
    
    // Enhanced error handling
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked by browser. Please allow popups and try again.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Popup was closed. Please try again.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized. Please contact support.');
    }
    
    throw error;
  }
};

/**
 * Sign in with Microsoft
 */
export const signInWithMicrosoft = async () => {
  try {
    console.log('[AuthAPI] Starting Microsoft sign in');
    
    const result = await signInWithPopup(auth, microsoftProvider, browserPopupRedirectResolver);
    const firebaseUser = result.user;
    
    // Store auth token
    const idToken = await firebaseUser.getIdToken();
    localStorage.setItem('authToken', idToken);
    
    console.log('[AuthAPI] Microsoft sign in successful:', firebaseUser.uid);
    
    // Create session with backend
    try {
      const response = await api.post('/api/auth/create-session', { idToken });
      console.log('[AuthAPI] Backend session created:', response.data);
      
      return {
        firebaseUser,
        backendResponse: response.data,
        user: response.data.user,
        profile: response.data.user
      };
    } catch (sessionError) {
      console.warn('[AuthAPI] Failed to create backend session:', sessionError);
      
      // Return Firebase user data as fallback
      return {
        firebaseUser,
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL || '',
          role: 'authenticated'
        }
      };
    }
  } catch (error) {
    console.error('[AuthAPI] Microsoft sign in error:', error);
    
    // Enhanced error handling
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked by browser. Please allow popups and try again.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Popup was closed. Please try again.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized. Please contact support.');
    }
    
    throw error;
  }
};

/**
 * Sign out user
 */
export const signOut = async () => {
  try {
    console.log('[AuthAPI] Starting sign out process');
    
    // Sign out from Firebase
    await auth.signOut();
    
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUserInfo');
    localStorage.removeItem('profile_data');
    
    // Call backend signout
    try {
      await api.post('/api/auth/signout');
      console.log('[AuthAPI] Backend signout successful');
    } catch (backendError) {
      console.warn('[AuthAPI] Backend signout failed:', backendError);
      // Continue with signout even if backend fails
    }
    
    console.log('[AuthAPI] Sign out completed successfully');
  } catch (error) {
    console.error('[AuthAPI] Sign out error:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  try {
    console.log('[AuthAPI] Sending password reset email to:', email);
    await sendPasswordResetEmail(auth, email);
    console.log('[AuthAPI] Password reset email sent successfully');
  } catch (error) {
    console.error('[AuthAPI] Password reset error:', error);
    throw error;
  }
};

/**
 * Confirm password reset
 */
export const confirmPasswordReset = async (oobCode, newPassword) => {
  try {
    console.log('[AuthAPI] Confirming password reset');
    await firebaseConfirmPasswordReset(auth, oobCode, newPassword);
    console.log('[AuthAPI] Password reset confirmed successfully');
  } catch (error) {
    console.error('[AuthAPI] Password reset confirmation error:', error);
    throw error;
  }
};

/**
 * Verify password reset code
 */
export const verifyPasswordResetCode = async (oobCode) => {
  try {
    console.log('[AuthAPI] Verifying password reset code');
    const email = await firebaseVerifyPasswordResetCode(auth, oobCode);
    console.log('[AuthAPI] Password reset code verified for:', email);
    return email;
  } catch (error) {
    console.error('[AuthAPI] Password reset code verification error:', error);
    throw error;
  }
};

/**
 * Verify user token with backend
 */
export const verifyUser = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user');
    }
    
    const idToken = await user.getIdToken();
    const response = await api.get('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('[AuthAPI] User verification error:', error);
    throw error;
  }
};

export default {
  signUp,
  signUpWithGoogle,
  signUpWithMicrosoft,
  signIn,
  signInWithGoogle,
  signInWithMicrosoft,
  signOut,
  resetPassword,
  confirmPasswordReset,
  verifyPasswordResetCode,
  verifyUser
};