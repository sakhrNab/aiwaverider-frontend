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
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthCallback from './components/auth/AuthCallback';
import { PAYMENT } from './config/config';
import useAgentStore from './store/agentStore';

// PayPal initial options from config
const resolvedClientId = (() => {
  const env = PAYMENT.PAYPAL.ENV;
  if (env === 'live') return PAYMENT.PAYPAL.CLIENT_ID;
  if (env === 'sandbox') return PAYMENT.PAYPAL.CLIENT_ID_SANDBOX;
  return 'test';
})();

const paypalOptions = {
  "client-id": resolvedClientId,
  currency: PAYMENT.ALLOWED_CURRENCIES?.includes(PAYMENT.PAYPAL.CURRENCY) ? PAYMENT.PAYPAL.CURRENCY : 'USD',
  intent: "capture", // Default intent, can be overridden by individual components
  components: 'buttons',
  vault: false, // Default vault setting, can be overridden by individual components
};

// Module-scoped flag to track if global, one-time initialization has occurred.
let globalAppSetupDone = false;

// Expose agent store preloading as a global function
window.preloadAgentData = async (force = false) => {
  try {
    console.log('Preloading agent data (called manually)');
    const agentStore = useAgentStore.getState();
    const currentAgents = agentStore.allAgents || [];
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
    const redirectPath = sessionStorage.getItem('redirect');
    if (redirectPath) {
      sessionStorage.removeItem('redirect');
      window.history.replaceState(null, '', redirectPath); // Update browser bar URL

      navigate(redirectPath, { replace: true }); // Sync React Router's internal state
    }

    // --- 2. Initialization Logic ---
    // This guard ensures the main initialization steps run only once per mount.
    if (effectRanThisMount.current) {
      if (!isUIVisible) setIsUIVisible(true);
      return;
    }
    effectRanThisMount.current = true;

    const initializeApp = async () => {
      try {
        if (!globalAppSetupDone) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[App.jsx initializeApp] Development-specific global setup done.');
          }
          globalAppSetupDone = true; // Mark global setup as done
        }

      } catch (error) {
        console.error('[App.jsx initializeApp] Error during app initialization:', error);
      } finally {
        if (!isUIVisible) { // Only set state if it needs changing, to avoid unnecessary re-renders
            setIsUIVisible(true); // Make AppContent visible
        }
      }
    };

    initializeApp();

  }, [navigate, isUIVisible]); // Add isUIVisible because we check it before calling setIsUIVisible

  return (
    <ErrorBoundary>
      <HelmetProvider>
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
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;