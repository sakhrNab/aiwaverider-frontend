/**
 * Global Configuration
 * 
 * This file centralizes all environment-specific configuration for the application.
 * Always use these constants instead of hardcoded values or scattered environment variable access.
 */

// Environment detection
export const ENV = {
  PROD: import.meta.env.VITE_NODE_ENV === 'production' || import.meta.env.MODE === 'production',
  DEV: import.meta.env.DEV === true || import.meta.env.MODE === 'development',
  TEST: import.meta.env.MODE === 'test',
  LOCAL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
};

// API Configuration
export const API = {
  URL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
  RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3', 10)
};

// Firebase Configuration
export const FIREBASE = {
  API_KEY: import.meta.env.VITE_FIREBASE_API_KEY || "random",
  AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "random",
  PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || "random",
  STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "random",
  MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "random",
  APP_ID: import.meta.env.VITE_FIREBASE_APP_ID || "random"
};

// Authentication Configuration
export const AUTH = {
  MICROSOFT: {
    CLIENT_ID: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
    CALLBACK_URL: import.meta.env.VITE_MICROSOFT_CALLBACK_URL
  }
};

// Payment Configuration
export const PAYMENT = {
  PAYPAL: {
    // Explicit runtime environment selection for PayPal SDK
    ENV: (import.meta.env.VITE_PAYPAL_ENV || (ENV.PROD ? 'live' : 'sandbox')).toLowerCase(),
    // Optional separate client IDs for live and sandbox, with fallback to a generic client ID
    CLIENT_ID_LIVE: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    CLIENT_ID_SANDBOX: import.meta.env.VITE_PAYPAL_CLIENT_ID_SANDBOX || 'test',
    // Backward compatible single client id (if provided)
    CLIENT_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
    CURRENCY: 'USD',
    INTENT: 'capture',
    // Plan IDs for different environments
    PLAN_ID_LIVE: import.meta.env.VITE_PAYPAL_SUBS_PLAN_ID,
    PLAN_ID_SANDBOX: import.meta.env.VITE_PAYPAL_PLAN_ID_SANDBOX || 'P-5AX73474PL747521LNDQ27HQ',
    // Backward compatible single plan id (if provided)
    PLAN_ID: import.meta.env.VITE_PAYPAL_SUBS_PLAN_ID || 'P-5AX73474PL747521LNDQ27HQ'
  },
  ENABLE_SIMULATION: ENV.DEV && (import.meta.env.VITE_ENABLE_PAYMENT_SIMULATION === 'true'),
  ALLOWED_CURRENCIES: ['USD', 'EUR', 'GBP']
};

// Helper function to get the correct PayPal plan ID based on environment
export const getPayPalPlanId = () => {
  const env = PAYMENT.PAYPAL.ENV;
  if (env === 'live') return PAYMENT.PAYPAL.PLAN_ID_LIVE || PAYMENT.PAYPAL.PLAN_ID;
  if (env === 'sandbox') return PAYMENT.PAYPAL.PLAN_ID_SANDBOX || PAYMENT.PAYPAL.PLAN_ID;
  return PAYMENT.PAYPAL.PLAN_ID;
};

// External Services
export const SERVICES = {
  YOUTUBE_API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY
};

// Monitoring and Logging
export const MONITORING = {
  SENTRY: {
    DSN: import.meta.env.VITE_SENTRY_DSN,
    ENVIRONMENT: import.meta.env.MODE,
    TRACES_SAMPLE_RATE: 0.5
  },
  LOGROCKET: {
    APP_ID: import.meta.env.VITE_LOGROCKET_APP_ID
  },
  LOGGING_LEVEL: ENV.PROD ? 'error' : 'debug'
};

// Feature Flags
export const FEATURES = {
  ENABLE_CRYPTO_PAYMENTS: false,
  ENABLE_APPLE_PAY: false,
  ENABLE_GOOGLE_PAY: false,
  ENABLE_SEPA: false,
  // Only show these features in development unless explicitly enabled in production
  SHOW_TEST_FEATURES: ENV.DEV || import.meta.env.VITE_SHOW_TEST_FEATURES === 'true'
};

export default {
  ENV,
  API,
  FIREBASE,
  AUTH,
  PAYMENT,
  SERVICES,
  MONITORING,
  FEATURES
}; 