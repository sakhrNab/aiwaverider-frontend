// src/App.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // <<<< CORRECTED: Added useNavigate import
import './styles/globals.css';
import AppContent from './components/app/AppContent';
import { AuthProvider } from './contexts/AuthContext';
import { PostsProvider } from './contexts/PostsContext';
import { CartProvider } from './contexts/CartContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthCallback from './components/auth/AuthCallback';
import { PAYMENT } from './config/config';
import useAgentStore from './store/agentStore';

// PayPal initial options from config
const paypalOptions = {
  "client-id": PAYMENT.PAYPAL.CLIENT_ID || "test",
  currency: PAYMENT.PAYPAL.CURRENCY || "USD",
  intent: PAYMENT.PAYPAL.INTENT || "capture",
  "disable-funding": "paylater,venmo,credit",
};

// Module-scoped flag to track if global, one-time initialization has occurred.
let globalAppSetupDone = false;

// Expose agent store preloading as a global function
window.preloadAgentData = async (force = false) => {
  try {
    console.log('Preloading agent data (called manually)');
    const agentStore = useAgentStore.getState();
    const currentAgents = agentStore.allAgents;
    if (force || currentAgents.length === 0) {
      await agentStore.loadInitialData(force);
      console.log('Agent data preloaded successfully');
    } else {
      console.log('Agent data already loaded, skipping preload');
    }
    return true;
  } catch (error) {
    console.error('Error preloading agent data:', error);
    return false;
  }
};

const App = () => {
  const [isUIVisible, setIsUIVisible] = useState(false); // State to control rendering of AppContent
  const effectRanThisMount = useRef(false); // Ref to ensure initialization logic in useEffect runs once per mount
  const navigate = useNavigate();

  useEffect(() => {
    // --- 1. Redirect Logic (handles deep links after 404 redirect) ---
    console.log('[App.jsx useEffect] Effect runs. Current window.location.href:', window.location.href);
    console.log('[App.jsx useEffect] sessionStorage.redirect at start:', sessionStorage.getItem('redirect'));

    const redirectPath = sessionStorage.getItem('redirect');
    if (redirectPath) {
      console.log('[App.jsx useEffect] redirectPath FOUND:', redirectPath);
      sessionStorage.removeItem('redirect');
      console.log('[App.jsx useEffect] sessionStorage.redirect AFTER removal:', sessionStorage.getItem('redirect'));

      console.log('[App.jsx useEffect] Calling window.history.replaceState with path:', redirectPath);
      window.history.replaceState(null, '', redirectPath); // Update browser bar URL
      console.log('[App.jsx useEffect] window.location.href AFTER replaceState:', window.location.href);

      console.log('[App.jsx useEffect] Calling navigate(redirectPath, { replace: true }) to sync React Router.');
      navigate(redirectPath, { replace: true }); // Sync React Router's internal state
    } else {
      console.log('[App.jsx useEffect] No redirectPath found in sessionStorage.');
    }

    // --- 2. Initialization Logic ---
    // This guard ensures the main initialization steps run only once per mount.
    if (effectRanThisMount.current) {
      console.log('[App.jsx useEffect] Initialization logic already run for this mount. Skipping.');
      // If UI is somehow not visible but effect ran, ensure it becomes visible.
      // This could happen if navigate changes identity and causes effect to re-run.
      if (!isUIVisible) setIsUIVisible(true);
      return;
    }
    effectRanThisMount.current = true;

    const initializeApp = async () => {
      try {
        if (!globalAppSetupDone) {
          console.log('[App.jsx initializeApp] Performing global, one-time app setup...');
          // Place any truly global, one-time setup logic here (e.g., API keys, global listeners)
          // Example: await someAnalyticsService.init();
          if (process.env.NODE_ENV === 'development') {
            console.log('[App.jsx initializeApp] Development-specific global setup done.');
          }
          globalAppSetupDone = true; // Mark global setup as done
        } else {
          console.log('[App.jsx initializeApp] Global app setup was already done.');
        }

        // This part can run on initial load (after global setup) or if needed on subsequent "soft" inits.
        // For this app, it primarily makes the UI visible.
        console.log('[App.jsx initializeApp] Preparing UI and any per-load specifics...');
        // Example: const user = await authService.checkSession(); if (user) setUserContext(user);

      } catch (error) {
        console.error('[App.jsx initializeApp] Error during app initialization:', error);
      } finally {
        if (!isUIVisible) { // Only set state if it needs changing, to avoid unnecessary re-renders
            console.log('[App.jsx initializeApp] Setting isUIVisible to true.');
            setIsUIVisible(true); // Make AppContent visible
        }
      }
    };

    initializeApp();

  }, [navigate, isUIVisible]); // Add isUIVisible because we check it before calling setIsUIVisible

  return (
    <ErrorBoundary>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ThemeProvider>
        <AuthProvider>
          <PostsProvider>
            <CartProvider>
              <PayPalScriptProvider options={paypalOptions}>
                <AuthCallback>
                  {isUIVisible ? <AppContent /> : <div>Loading application...</div>}
                </AuthCallback>
              </PayPalScriptProvider>
            </CartProvider>
          </PostsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;