// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { auth } from '../utils/firebase';
import { getProfile, updateProfile } from '../api/user/profileApi';
import { db } from '../utils/firebase';

export const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes cache duration

// Profile fields to store in cache (to keep it lightweight)
const PROFILE_CACHE_FIELDS = [
  'uid', 'email', 'username', 'displayName', 'photoURL', 
  'firstName', 'lastName', 'role', 'interests', 
  'notifications', 'favorites', 'language'
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastProfileFetch, setLastProfileFetch] = useState(0);

  // Cache management functions
  const getCacheKey = useCallback((type, id) => `auth_${type}_${id}`, []);

  const getFromCache = useCallback((type, id) => {
    try {
      const key = getCacheKey(type, id);
      const cached = localStorage.getItem(key);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          console.log(`[AuthContext] Using cached ${type} data for ${id}`);
          return data;
        }
        // Cache expired
        console.log(`[AuthContext] Cache expired for ${type} data for ${id}`);
        localStorage.removeItem(key);
      }
    } catch (err) {
      console.error("[AuthContext] Cache read error:", err);
    }
    return null;
  }, [getCacheKey]);

  const setInCache = useCallback((type, id, fullData) => {
    try {
      // For profile data, only store essential fields to keep cache lightweight
      let dataToCache = fullData;
      
      if (type === 'profile' && fullData) {
        dataToCache = {};
        PROFILE_CACHE_FIELDS.forEach(field => {
          if (fullData[field] !== undefined) {
            dataToCache[field] = fullData[field];
          }
        });
      }
      
      const key = getCacheKey(type, id);
      localStorage.setItem(key, JSON.stringify({ 
        data: dataToCache, 
        timestamp: Date.now() 
      }));
      console.log(`[AuthContext] Cached ${type} data for ${id}`);
    } catch (err) {
      console.error("[AuthContext] Cache write error:", err);
    }
  }, [getCacheKey]);

  const clearCache = useCallback((type, id) => {
    try {
      if (id) {
        localStorage.removeItem(getCacheKey(type, id));
        console.log(`[AuthContext] Cleared cache for ${type} ${id}`);
      } else {
        const keysToRemove = Object.keys(localStorage)
          .filter(key => key.startsWith('auth_'));
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log(`[AuthContext] Cleared all auth cache (${keysToRemove.length} items)`);
      }
    } catch (err) {
      console.error("[AuthContext] Cache clear error:", err);
    }
  }, [getCacheKey]);

  // Fetch user profile with improved caching
  const fetchUserProfile = useCallback(async (uid, force = false) => {
    try {
      // Check if we've fetched recently (throttle API calls)
      const timeSinceLastFetch = Date.now() - lastProfileFetch;
      if (!force && timeSinceLastFetch < 5000) { // 5 second throttle
        console.log('[AuthContext] Throttling profile fetch - requested too soon');
        const cachedProfile = getFromCache('profile', uid);
        return cachedProfile;
      }
      
      // Check cache first unless forced refresh
      if (!force) {
        const cachedProfile = getFromCache('profile', uid);
        if (cachedProfile) {
          return cachedProfile;
        }
      }

      console.log('[AuthContext] Fetching fresh profile data from API');
      setLastProfileFetch(Date.now());
      
      const profile = await getProfile();
      if (profile) {
        setInCache('profile', uid, profile);
      }
      return profile;
    } catch (err) {
      console.error('[AuthContext] Error fetching user profile:', err);
      // Return cached data as fallback even if it's expired
      try {
        const key = getCacheKey('profile', uid);
        const cached = localStorage.getItem(key);
        if (cached) {
          const { data } = JSON.parse(cached);
          console.log('[AuthContext] Using expired cache as fallback after API error');
          return data;
        }
      } catch (cacheErr) {
        console.error('[AuthContext] Error reading cache as fallback:', cacheErr);
      }
      return null;
    }
  }, [getFromCache, setInCache, getCacheKey, lastProfileFetch]);

  // Update user profile and invalidate cache
  const updateUserProfile = useCallback(async (uid, updates) => {
    try {
      console.log('[AuthContext] Updating user profile');
      
      // Check if updates is a Firebase user object or contains a profile property
      let dataToUpdate = updates;
      
      // If updates contains profile data from sign-in, use that
      if (updates && updates.profile) {
        console.log('[AuthContext] Using profile data from sign-in');
        dataToUpdate = updates.profile;
      }
      
      const updatedProfile = await updateProfile(dataToUpdate);
      
      if (updatedProfile) {
        // Clear the cache for this profile
        clearCache('profile', uid);
        
        // Update the user state with the new profile data
        setUser(prev => {
          // Only update if there are actual changes to prevent unnecessary renders
          const hasChanges = Object.keys(updatedProfile).some(
            key => JSON.stringify(prev?.[key]) !== JSON.stringify(updatedProfile[key])
          );
          
          return hasChanges ? { ...prev, ...updatedProfile } : prev;
        });
        
        // Cache the new profile
        setInCache('profile', uid, updatedProfile);
      }
      return updatedProfile;
    } catch (err) {
      console.error('[AuthContext] Error updating user profile:', err);
      return null;
    }
  }, [clearCache, setInCache]);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setLoading(true);
      try {
        if (firebaseUser) {
          console.log('[AuthContext] Auth state change detected - User signed in:', firebaseUser.email);
          const { uid, email } = firebaseUser;
          
          // Check for any potentially saved info from the sign-in process
          let currentUserInfo = null;
          try {
            const savedUserInfo = localStorage.getItem('currentUserInfo');
            if (savedUserInfo) {
              const parsedInfo = JSON.parse(savedUserInfo);
              // Only use if it's for the same user and is recent (last 5 minutes)
              if (parsedInfo.uid === uid && (Date.now() - parsedInfo.timestamp) < 5 * 60 * 1000) {
                currentUserInfo = parsedInfo;
                console.log('[AuthContext] Found recent sign-in data for current user');
              } else {
                // Remove stale data
                localStorage.removeItem('currentUserInfo');
              }
            }
          } catch (cacheError) {
            console.error('[AuthContext] Error reading user info from cache:', cacheError);
          }
          
          // Get and store the Firebase ID token for API requests
          try {
            const idToken = await firebaseUser.getIdToken(true);
            localStorage.setItem('authToken', idToken);
            console.log('[AuthContext] Firebase token refreshed and stored');
            
            // Add extra debugging for the token
            try {
              const tokenPayload = JSON.parse(atob(idToken.split('.')[1]));
              console.log('[AuthContext] Token exp:', new Date(tokenPayload.exp * 1000).toLocaleString());
              console.log('[AuthContext] Token iat:', new Date(tokenPayload.iat * 1000).toLocaleString());
              console.log('[AuthContext] Token auth_time:', new Date(tokenPayload.auth_time * 1000).toLocaleString());
            } catch (e) {
              console.error('[AuthContext] Could not decode token for debugging:', e);
            }
          } catch (tokenError) {
            console.error('[AuthContext] Error getting Firebase token:', tokenError);
          }
          
          // For new sign-ins, always clear all caches for this user to ensure we get fresh data
          if (currentUserInfo) {
            console.log('[AuthContext] This appears to be a new sign-in, clearing all caches');
            clearCache('profile', uid);
          }
          
          // Try to get profile from Firestore directly (faster than API call)
          let userProfile = null;
          let needsFreshData = true;
          
          try {
            console.log('[AuthContext] Fetching user profile from Firestore');
            const userDoc = await db.collection('users').doc(uid).get();
            if (userDoc.exists) {
              userProfile = userDoc.data();
              // Cache this data with a fresh timestamp
              setInCache('profile', uid, userProfile);
              needsFreshData = false;
              console.log('[AuthContext] Found user profile in Firestore');
            } else {
              console.warn('[AuthContext] No user profile found in Firestore');
            }
          } catch (dbErr) {
            console.error('[AuthContext] Error fetching from Firestore:', dbErr);
            needsFreshData = true;
          }

          // Only use cached data as a last resort if Firestore lookup failed
          if (!userProfile) {
            userProfile = getFromCache('profile', uid);
            if (userProfile) {
              console.log('[AuthContext] Using cached profile as fallback');
              needsFreshData = true; // Still mark as needing fresh data
            }
          }

          // Set user with available data
          setUser({
            uid,
            email,
            displayName: userProfile?.displayName || firebaseUser.displayName || email.split('@')[0],
            photoURL: userProfile?.photoURL || firebaseUser.photoURL || '/default-avatar.png',
            role: userProfile?.role || 'authenticated',
            ...(userProfile || {})
          });
          
          // If we need fresh data, fetch it in the background
          if (needsFreshData) {
            console.log('[AuthContext] Fetching fresh profile data in background');
            fetchUserProfile(uid).then(freshProfile => {
              if (freshProfile) {
                setUser(prev => ({ ...prev, ...freshProfile }));
              }
            }).catch(err => {
              console.error('[AuthContext] Background profile fetch error:', err);
            });
          }
        } else {
          setUser(null);
          clearCache();
        }
      } catch (err) {
        console.error('[AuthContext] Error in auth state change:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [getFromCache, setInCache, clearCache, fetchUserProfile]);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      await auth.signOut();
      setUser(null);
      clearCache();
    } catch (err) {
      console.error('[AuthContext] Error signing out:', err);
      setError(err.message);
    }
  }, [clearCache]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    loading,
    error,
    setUser,
    fetchUserProfile,
    updateUserProfile,
    signOut,
    clearProfileCache: (uid) => clearCache('profile', uid)
  }), [user, loading, error, fetchUserProfile, updateUserProfile, signOut, clearCache]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
