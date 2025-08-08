// src/api/user/profileApi.js

import firebase from 'firebase/compat/app';
import { api, API_URL } from '../core/apiConfig';

// Helper function to create a mock profile from Firebase user
const createMockProfileFromFirebase = (firebaseUser) => {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
    photoURL: firebaseUser.photoURL || '/default-avatar.png',
    firstName: firebaseUser.displayName?.split(' ')[0] || firebaseUser.email.split('@')[0],
    lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
    role: 'authenticated',
    phoneNumber: firebaseUser.phoneNumber || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isOfflineProfile: true
  };
};

// Get user profile with caching and fallback logic
export const getProfile = async (retryCount = 0) => {
  try {
    // Check for cached data
    const cacheKey = 'profile_data';
    const cachedData = localStorage.getItem(cacheKey);
    let cachedProfile = null;

    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData);
        const cacheAge = Date.now() - timestamp;
        const cacheDuration = 30 * 60 * 1000; // 30 minutes
        
        if (cacheAge < cacheDuration) {
          console.log('[API] Using cached profile data', Math.round(cacheAge/1000) + 's old');
          return data;
        } else {
          console.log('[API] Profile cache expired, fetching fresh data');
          // Save the cached data for potential fallback
          cachedProfile = data;
        }
      } catch (cacheError) {
        console.error('[API] Error parsing cached profile data:', cacheError);
        // Continue to fetch fresh data
      }
    } else {
      console.log('[API] No profile cache found, fetching fresh data');
    }

    // Get current Firebase user for token
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    // Ensure we have a valid token
    let authToken = localStorage.getItem('authToken');
    if (!authToken) {
      try {
        authToken = await currentUser.getIdToken(true);
        localStorage.setItem('authToken', authToken);
        console.log('[API] Refreshed auth token');
      } catch (tokenError) {
        console.error('[API] Error getting auth token:', tokenError);
        throw new Error('Failed to get authentication token');
      }
    }

    // Use direct fetch with timeout instead of axios for better control
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      clearTimeout(timeoutId);
      
      // Check if response is valid JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('[API] Profile response is not JSON:', 
          contentType || 'no content-type header');
        
        // Fall back to cached data if available
        if (cachedProfile) {
          console.log('[API] Using expired cache as fallback due to non-JSON response');
          return cachedProfile;
        }
        
        // If no cached data, create a minimal profile from Firebase user
        const mockProfile = createMockProfileFromFirebase(currentUser);
        return mockProfile;
      }
      
      // If we have a valid JSON response
      if (response.ok) {
        const profileData = await response.json();
        
        // Cache the fresh data
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            data: profileData,
            timestamp: Date.now()
          }));
          console.log('[API] Profile data cached successfully');
        } catch (cacheError) {
          console.error('[API] Error caching profile data:', cacheError);
          // Continue even if caching fails
        }
        
        return profileData;
      } else if (response.status === 404) {
        console.warn('[API] Profile not found (404), user document may not exist yet');
        
        // If this is the first retry and we got 404, wait a moment and try again
        if (retryCount === 0) {
          console.log('[API] Retrying profile fetch after 404...');
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          return getProfile(1); // Retry once
        }
        
        // After retry or if this is already a retry, fall back to cached data or Firebase user
        if (cachedProfile) {
          console.log('[API] Using cached profile as fallback after 404');
          return cachedProfile;
        }
        
        // Create profile from Firebase user
        console.log('[API] Creating profile from Firebase user data after 404');
        const mockProfile = createMockProfileFromFirebase(currentUser);
        return mockProfile;
      } else if (response.status === 401) {
        console.warn('[API] Authentication error, refreshing token...');
        
        // Try refreshing the token once
        if (retryCount === 0) {
          try {
            const newToken = await currentUser.getIdToken(true);
            localStorage.setItem('authToken', newToken);
            console.log('[API] Token refreshed, retrying profile fetch...');
            return getProfile(1); // Retry with new token
          } catch (tokenError) {
            console.error('[API] Error refreshing token:', tokenError);
          }
        }
        
        throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
      } else {
        throw new Error(`Failed to get profile: ${response.status} ${response.statusText}`);
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Handle timeout or network errors
      if (fetchError.name === 'AbortError') {
        console.warn('[API] Profile request timed out');
      } else {
        console.error('[API] Fetch error:', fetchError);
      }
      
      // Use cached data if available
      if (cachedProfile) {
        console.log('[API] Using cached profile as fallback');
        return cachedProfile;
      }
      
      // Try to create a profile from Firebase user
      if (currentUser) {
        console.warn('[API] Using Firebase user data as profile fallback');
        return createMockProfileFromFirebase(currentUser);
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.error('[API] Error getting profile:', error);

    // Try to return cached data as fallback
    try {
      const cacheKey = 'profile_data';
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const { data } = JSON.parse(cachedData);
        console.log('[API] Using expired profile cache as fallback due to error');
        return data;
      }
    } catch (fallbackError) {
      console.error('[API] Error reading fallback profile cache:', fallbackError);
    }

    // Create a minimal mock profile if all else fails
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      return createMockProfileFromFirebase(currentUser);
    }

    return {
      uid: 'unknown',
      displayName: 'Guest User',
      email: 'guest@example.com',
      photoURL: '/default-avatar.png',
      createdAt: new Date().toISOString(),
      isOfflineProfile: true,
      error: error.message
    };
  }
};

// Update profile with fallback for non-JSON responses
export const updateProfile = async (profileData) => {
  try {
    console.log('[API] Sending profile update request:', profileData);
    
    // Get the current Firebase user
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }
    
    // Convert Firebase User object or custom objects to plain objects for Firestore
    // Extract only serializable properties
    let dataToSave = {};
    
    // Handle Firebase User objects specifically
    if (profileData && typeof profileData === 'object') {
      if (profileData.uid && profileData.email) {
        // This is likely a Firebase user object or something similar
        // Extract only the fields we want to save
        dataToSave = {
          uid: profileData.uid || currentUser.uid,
          email: profileData.email || currentUser.email,
          displayName: profileData.displayName || currentUser.displayName || '',
          photoURL: profileData.photoURL || currentUser.photoURL || '',
          emailVerified: profileData.emailVerified || currentUser.emailVerified || false,
          phoneNumber: profileData.phoneNumber || currentUser.phoneNumber || ''
        };
        
        // If it's a Firebase user, get providerData info too
        if (profileData.providerData && Array.isArray(profileData.providerData)) {
          dataToSave.providerData = profileData.providerData.map(provider => ({
            providerId: provider.providerId,
            uid: provider.uid,
            displayName: provider.displayName,
            email: provider.email,
            phoneNumber: provider.phoneNumber,
            photoURL: provider.photoURL
          }));
        }
      } else {
        // This is likely a regular update object with specific fields
        dataToSave = { ...profileData };
      }
    }
    
    console.log('[API] Prepared data for profile update:', dataToSave);
    
    // First, try to update the data in Firestore directly
    // This ensures the profile is updated even if the API endpoint fails
    try {
      const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
      
      // Update the Firestore document with the prepared data
      await userRef.update({
        ...dataToSave,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      console.log('[API] User profile updated in Firestore');
    } catch (firestoreError) {
      console.error('[API] Error updating profile in Firestore:', firestoreError);
      // Continue to try the API route even if Firestore update fails
    }
    
    // Try updating with the API (might be unavailable in some environments)
    try {
      // Use direct fetch instead of api.put to have more control over the request
      const authToken = localStorage.getItem('authToken') || await currentUser.getIdToken();
      
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(dataToSave)
      });
      
      // Check if response is successful
      if (response.ok) {
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('[API] Profile update API response:', data);
          
          // Clear cache after successful update
          localStorage.removeItem('profile_data');
          
          return data;
        }
      } else {
        console.warn(`[API] Profile update returned status: ${response.status} ${response.statusText}`);
      }
    } catch (apiError) {
      console.warn('[API] Profile update API failed, continuing with Firestore data:', apiError);
    }
    
    // If we reached here, the API call failed or returned non-JSON
    // Fetch the latest user data from Firestore
    try {
      const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        console.log('[API] Retrieved updated profile from Firestore:', userData);
        
        // Clear cache since we have fresh data
        localStorage.removeItem('profile_data');
        
        return userData;
      }
    } catch (fetchError) {
      console.error('[API] Error fetching updated profile from Firestore:', fetchError);
    }
    
    // Last resort fallback: return the data that was supposed to be saved
    console.warn('[API] Using profile data fallback with timestamp');
    return {
      ...profileData,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('[API] Error in profile update flow:', error);
    
    // Return the original data as fallback
    return {
      ...profileData,
      updatedAt: new Date().toISOString(),
      error: error.message
    };
  }
};

// Update user interests
export const updateInterests = async (interests) => {
  try {
    // Ensure interests is an array
    if (!Array.isArray(interests)) {
      console.error('[API] Invalid interests format:', interests);
      throw new Error('Interests must be an array');
    }

    console.log('[API] Updating interests:', interests);
    
    // Make the API call
    const response = await api.put('/api/profile/interests', { interests });
    console.log('[API] Update interests response:', response.data);
    
    // Clear caches after successful update
    try {
      localStorage.removeItem('profile_data');
      localStorage.removeItem('community_data');
      console.log('[API] Cleared profile and community caches after interests update');
    } catch (cacheError) {
      console.error('[API] Error clearing caches:', cacheError);
    }
    
    return response.data;
  } catch (error) {
    console.error('[API] Error updating interests:', error);
    throw error;
  }
};

// Get notifications
export const getNotifications = async () => {
  try {
    const response = await api.get('/api/profile/notifications');
    return response.data;
  } catch (error) {
    console.error('[API] Error getting notifications:', error);
    throw error;
  }
};

// Update notifications
export const updateNotifications = async (notifications) => {
  try {
    const response = await api.put('/api/profile/notifications', { notifications });
    return response.data;
  } catch (error) {
    console.error('[API] Error updating notifications:', error);
    throw error;
  }
};

// Get user subscriptions
export const getSubscriptions = async () => {
  try {
    const response = await api.get('/api/profile/subscriptions');
    return response.data;
  } catch (error) {
    console.error('[API] Error getting subscriptions:', error);
    throw error;
  }
};

// Get favorites
export const getFavorites = async () => {
  try {
    const response = await api.get('/api/profile/favorites');
    return response.data;
  } catch (error) {
    console.error('[API] Error getting favorites:', error);
    throw error;
  }
};

// Add to favorites
export const addFavorite = async (favoriteId) => {
  try {
    const response = await api.post('/api/profile/favorites', { favoriteId });
    return response.data;
  } catch (error) {
    console.error('[API] Error adding favorite:', error);
    throw error;
  }
};

// Remove from favorites
export const removeFavorite = async (favoriteId) => {
  try {
    const response = await api.delete(`/api/profile/favorites/${favoriteId}`);
    return response.data;
  } catch (error) {
    console.error('[API] Error removing favorite:', error);
    throw error;
  }
};

// Get community info with caching
export const getCommunityInfo = async () => {
  try {
    // Check for cached data
    const cacheKey = 'community_data';
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData);
        const cacheAge = Date.now() - timestamp;
        const cacheDuration = 30 * 60 * 1000; // 30 minutes
        
        if (cacheAge < cacheDuration) {
          console.log('[API] Using cached community data', { cacheAge: Math.round(cacheAge/1000) + 's' });
          return data;
        } else {
          console.log('[API] Community cache expired, fetching fresh data');
        }
      } catch (cacheError) {
        console.error('[API] Error parsing cached community data:', cacheError);
        // Continue to fetch fresh data
      }
    } else {
      console.log('[API] No community cache found, fetching fresh data');
    }
    
    // Fetch fresh data from API
    const response = await api.get('/api/profile/community');
    const communityData = response.data;
    
    // Cache the fresh data
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data: communityData,
        timestamp: Date.now()
      }));
      console.log('[API] Community data cached successfully');
    } catch (cacheError) {
      console.error('[API] Error caching community data:', cacheError);
      // Continue even if caching fails
    }
    
    return communityData;
  } catch (error) {
    console.error('[API] Error getting community info:', error);
    
    // Try to return cached data even if expired as fallback
    try {
      const cacheKey = 'community_data';
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const { data } = JSON.parse(cachedData);
        console.log('[API] Using expired community cache as fallback due to error');
        return data;
      }
    } catch (fallbackError) {
      console.error('[API] Error reading fallback community cache:', fallbackError);
    }
    
    throw error;
  }
};

// Upload Profile Avatar using Firebase Storage
export const uploadProfileImage = async (file) => {
  try {
    console.log('[API] Preparing to upload image:', file.name, file.type, file.size);
    const formData = new FormData();
    formData.append('avatar', file);
    
    // Call the backend endpoint for avatar upload (Firebase Storage based)
    const response = await api.put('/api/profile/upload-avatar', formData, {
      // Do not set Content-Type header manually for FormData.
    });
    console.log('[API] Image upload response:', response.data);
    
    // Clear profile cache after successful upload
    localStorage.removeItem('profile_data');
    
    return response.data; // Expected to return { photoURL: "new_image_url" }
  } catch (error) {
    console.error('[API] Error uploading profile image:', error);
    if (error.response) {
      console.error('[API] Server response:', error.response.data);
      throw new Error(error.response.data.error || `Server error: ${error.response.status}`);
    }
    throw error;
  }
}; 

// Update Email Preferences
export const updateEmailPreferences = async (preferences) => {
  try {
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const response = await api.put(`/api/email/preferences/${currentUser.uid}`, preferences);
    return response.data;
  } catch (error) {
    console.error('[API] Error updating email preferences:', error);
    throw error;
  }
};