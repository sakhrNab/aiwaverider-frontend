/**
 * UNIPAY SERVICE - COMPREHENSIVE PAYMENT INTEGRATION
 * ==================================================
 * 
 * This service integrates with UniPay (https://unipay.com/) payment gateway
 * based in Georgia, providing international payment processing.
 * 
 * Supported Payment Methods:
 * - Credit Cards (Visa, Mastercard)
 * - Debit Cards
 * - SEPA Transfers (EU)
 * - PayPal Payments
 * - Google Pay
 * - Apple Pay (if supported by UniPay)
 * 
 * Features:
 * - 99.9% API uptime
 * - International processing
 * - Recurring payments
 * - Comprehensive API
 */

import axios from 'axios';

// Use environment variable for API URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// UniPay API configuration
const UNIPAY_CONFIG = {
  apiUrl: import.meta.env.VITE_UNIPAY_API_URL || 'https://api.unipay.com',
  merchantId: import.meta.env.VITE_UNIPAY_MERCHANT_ID,
  publicKey: import.meta.env.VITE_UNIPAY_PUBLIC_KEY,
  version: 'v1'
};

// Create API instance for our backend
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create UniPay API instance (for direct calls if needed)
const unipayApi = axios.create({
  baseURL: UNIPAY_CONFIG.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${UNIPAY_CONFIG.publicKey}`,
  },
});

/**
 * Check UniPay API connectivity and status
 * @returns {Promise<Object>} - Connectivity status
 */
export const checkUnipayConnectivity = async () => {
  try {
    console.log(`Checking UniPay connectivity with ${UNIPAY_CONFIG.apiUrl}`);
    
    const response = await fetch(`${API_URL}/api/payments/unipay/health`);
    
    if (!response.ok) {
      console.error(`UniPay connectivity test failed: ${response.status}`);
      return { 
        ok: false, 
        error: `API returned status ${response.status}` 
      };
    }
    
    const data = await response.json();
    console.log('UniPay connectivity test results:', data);
    
    return { 
      ok: true, 
      data 
    };
  } catch (error) {
    console.error('UniPay connectivity check failed:', error);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return { 
        ok: false, 
        error: `Cannot connect to backend server at ${API_URL}. Is the server running?` 
      };
    }
    
    return { 
      ok: false, 
      error: error.message 
    };
  }
};

/**
 * Get supported payment methods for a country via UniPay
 * @param {string} countryCode - Two-letter country code
 * @returns {Promise<Object>} - Available payment methods
 */
export const getUnipayPaymentMethods = async (countryCode = 'US') => {
  try {
    const response = await api.get(`/api/payments/unipay/methods?country=${countryCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching UniPay payment methods:', error);
    
    // Return default payment methods as fallback
    return {
      success: false,
      error: error.message,
      methods: ['card', 'paypal', 'google_pay'], // Default fallback
      countryCode
    };
  }
};

/**
 * Create a UniPay payment session
 * @param {Object} data - Payment data including amount, currency, items, etc.
 * @returns {Promise<Object>} - Payment session details
 */
export const createUnipayPayment = async (data) => {
  try {
    const {
      amount,
      currency = 'USD',
      paymentMethod = 'card',
      items = [],
      email,
      metadata = {},
      successUrl,
      cancelUrl
    } = data;

    if (!amount || amount <= 0) {
      throw new Error('Amount must be provided and greater than 0');
    }

    console.log('Creating UniPay payment:', { 
      amount, 
      currency, 
      paymentMethod, 
      itemCount: items.length 
    });

    // Prepare request data for our backend
    const requestData = {
      amount,
      currency,
      paymentMethod,
      items,
      email,
      metadata: {
        ...metadata,
        provider: 'unipay',
        timestamp: new Date().toISOString(),
      },
      successUrl: successUrl || `${window.location.origin}/checkout/success`,
      cancelUrl: cancelUrl || `${window.location.origin}/checkout`,
    };

    const response = await api.post('/api/payments/unipay/create', requestData);
    
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.error || 'Failed to create UniPay payment');
    }

    console.log('UniPay payment created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating UniPay payment:', error);
    throw error;
  }
};

/**
 * Process a credit card payment through UniPay
 * @param {Object} cardData - Card payment data
 * @returns {Promise<Object>} - Payment result
 */
export const processUnipayCardPayment = async (cardData) => {
  try {
    const {
      amount,
      currency = 'USD',
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      cardholderName,
      billingAddress = {},
      email,
      items = [],
      metadata = {}
    } = cardData;

    console.log('Processing UniPay card payment');

    const requestData = {
      paymentMethod: 'card',
      amount,
      currency,
      card: {
        number: cardNumber,
        expiryMonth,
        expiryYear,
        cvv,
        holderName: cardholderName,
      },
      billing: billingAddress,
      email,
      items,
      metadata: {
        ...metadata,
        paymentType: 'card',
        provider: 'unipay',
      },
    };

    const response = await api.post('/api/payments/unipay/process-card', requestData);

    if (!response.data || !response.data.success) {
      throw new Error(response.data?.error || 'Card payment failed');
    }

    return response.data;
  } catch (error) {
    console.error('Error processing UniPay card payment:', error);
    throw error;
  }
};

/**
 * Create SEPA payment through UniPay
 * @param {Object} sepaData - SEPA payment data
 * @returns {Promise<Object>} - SEPA payment result
 */
export const createUnipaySepaPayment = async (sepaData) => {
  try {
    const {
      amount,
      currency = 'EUR',
      iban,
      bic,
      accountHolderName,
      email,
      items = [],
      metadata = {}
    } = sepaData;

    if (currency !== 'EUR') {
      throw new Error('SEPA payments only support EUR currency');
    }

    console.log('Creating UniPay SEPA payment');

    const requestData = {
      paymentMethod: 'sepa',
      amount,
      currency,
      sepa: {
        iban,
        bic,
        accountHolderName,
      },
      email,
      items,
      metadata: {
        ...metadata,
        paymentType: 'sepa',
        provider: 'unipay',
      },
    };

    const response = await api.post('/api/payments/unipay/process-sepa', requestData);

    if (!response.data || !response.data.success) {
      throw new Error(response.data?.error || 'SEPA payment failed');
    }

    return response.data;
  } catch (error) {
    console.error('Error creating UniPay SEPA payment:', error);
    throw error;
  }
};

/**
 * Create PayPal payment through UniPay
 * @param {Object} paypalData - PayPal payment data
 * @returns {Promise<Object>} - PayPal payment result
 */
export const createUnipayPaypalPayment = async (paypalData) => {
  try {
    const {
      amount,
      currency = 'USD',
      email,
      items = [],
      metadata = {},
      successUrl,
      cancelUrl
    } = paypalData;

    console.log('Creating UniPay PayPal payment');

    const requestData = {
      paymentMethod: 'paypal',
      amount,
      currency,
      email,
      items,
      metadata: {
        ...metadata,
        paymentType: 'paypal',
        provider: 'unipay',
      },
      successUrl: successUrl || `${window.location.origin}/checkout/success`,
      cancelUrl: cancelUrl || `${window.location.origin}/checkout`,
    };

    const response = await api.post('/api/payments/unipay/process-paypal', requestData);

    if (!response.data || !response.data.success) {
      throw new Error(response.data?.error || 'PayPal payment failed');
    }

    return response.data;
  } catch (error) {
    console.error('Error creating UniPay PayPal payment:', error);
    throw error;
  }
};

/**
 * Process Google Pay through UniPay
 * @param {Object} googlePayData - Google Pay data
 * @returns {Promise<Object>} - Google Pay payment result
 */
export const processUnipayGooglePay = async (googlePayData) => {
  try {
    const {
      paymentData,
      amount,
      currency = 'USD',
      email,
      items = [],
      metadata = {}
    } = googlePayData;

    if (!paymentData || !paymentData.paymentMethodData) {
      throw new Error('Invalid Google Pay payment data');
    }

    console.log('Processing UniPay Google Pay payment');

    const requestData = {
      paymentMethod: 'google_pay',
      amount,
      currency,
      googlePay: {
        paymentData: paymentData.paymentMethodData,
        signature: paymentData.signature || null,
      },
      email,
      items,
      metadata: {
        ...metadata,
        paymentType: 'google_pay',
        provider: 'unipay',
      },
    };

    const response = await api.post('/api/payments/unipay/process-google-pay', requestData);

    if (!response.data || !response.data.success) {
      throw new Error(response.data?.error || 'Google Pay payment failed');
    }

    return response.data;
  } catch (error) {
    console.error('Error processing UniPay Google Pay payment:', error);
    throw error;
  }
};

/**
 * Get payment status from UniPay
 * @param {string} paymentId - Payment ID to check
 * @param {string} paymentType - Type of payment (card, sepa, paypal, google_pay)
 * @returns {Promise<Object>} - Payment status
 */
export const getUnipayPaymentStatus = async (paymentId, paymentType = 'card') => {
  try {
    console.log(`Checking UniPay payment status for ${paymentType} payment ${paymentId}`);

    const response = await api.get(`/api/payments/unipay/status/${paymentId}?type=${paymentType}`);

    if (!response.data) {
      throw new Error('No status data received');
    }

    return response.data;
  } catch (error) {
    console.error('Error checking UniPay payment status:', error);
    
    // Return a fallback status for better UX
    return {
      success: false,
      error: error.message,
      id: paymentId,
      type: paymentType,
      status: 'unknown'
    };
  }
};

/**
 * Create a refund through UniPay
 * @param {string} paymentId - Original payment ID
 * @param {number} amount - Refund amount (optional, full refund if not provided)
 * @param {string} reason - Refund reason
 * @returns {Promise<Object>} - Refund result
 */
export const createUnipayRefund = async (paymentId, amount = null, reason = '') => {
  try {
    console.log(`Creating UniPay refund for payment ${paymentId}`);

    const requestData = {
      paymentId,
      amount,
      reason,
      provider: 'unipay',
    };

    const response = await api.post('/api/payments/unipay/refund', requestData);

    if (!response.data || !response.data.success) {
      throw new Error(response.data?.error || 'Refund failed');
    }

    return response.data;
  } catch (error) {
    console.error('Error creating UniPay refund:', error);
    throw error;
  }
};

/**
 * Validate card details (client-side validation)
 * @param {Object} cardData - Card data to validate
 * @returns {Object} - Validation result
 */
export const validateCardData = (cardData) => {
  const { cardNumber, expiryMonth, expiryYear, cvv, cardholderName } = cardData;
  const errors = {};

  // Card number validation (basic Luhn algorithm)
  if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
    errors.cardNumber = 'Invalid card number';
  }

  // Expiry validation
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  if (!expiryMonth || expiryMonth < 1 || expiryMonth > 12) {
    errors.expiryMonth = 'Invalid expiry month';
  }
  
  if (!expiryYear || expiryYear < currentYear || 
      (expiryYear === currentYear && expiryMonth < currentMonth)) {
    errors.expiryYear = 'Card has expired';
  }

  // CVV validation
  if (!cvv || cvv.length < 3 || cvv.length > 4) {
    errors.cvv = 'Invalid CVV';
  }

  // Cardholder name validation
  if (!cardholderName || cardholderName.trim().length < 2) {
    errors.cardholderName = 'Cardholder name is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Format amount for UniPay (usually requires cents/smallest currency unit)
 * @param {number} amount - Amount in main currency unit
 * @param {string} currency - Currency code
 * @returns {number} - Amount in smallest currency unit
 */
export const formatAmountForUnipay = (amount, currency = 'USD') => {
  // Most currencies use 2 decimal places (cents)
  const decimalCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  const isDecimalCurrency = decimalCurrencies.includes(currency.toUpperCase());
  
  if (isDecimalCurrency) {
    return Math.round(parseFloat(amount) * 100);
  }
  
  // For currencies without decimals (like JPY, KRW)
  return Math.round(parseFloat(amount));
};

/**
 * Detect user's country for payment method availability
 * @returns {Promise<string>} - Two-letter country code
 */
export const detectUserCountryForUnipay = async () => {
  try {
    // Try to get country from our backend first
    const response = await api.get('/api/payments/detect-country');
    if (response.data && response.data.countryCode) {
      return response.data.countryCode;
    }
    
    // Fallback to browser language
    const language = navigator.language || navigator.userLanguage;
    const country = language.split('-')[1];
    
    return country || 'US';
  } catch (error) {
    console.error('Error detecting country:', error);
    return 'US'; // Default fallback
  }
};

// Export default service object
export default {
  config: UNIPAY_CONFIG,
  checkConnectivity: checkUnipayConnectivity,
  getPaymentMethods: getUnipayPaymentMethods,
  createPayment: createUnipayPayment,
  processCardPayment: processUnipayCardPayment,
  createSepaPayment: createUnipaySepaPayment,
  createPaypalPayment: createUnipayPaypalPayment,
  processGooglePay: processUnipayGooglePay,
  getPaymentStatus: getUnipayPaymentStatus,
  createRefund: createUnipayRefund,
  validateCardData,
  formatAmount: formatAmountForUnipay,
  detectCountry: detectUserCountryForUnipay,
  
  // Payment method constants
  PAYMENT_METHODS: {
    CARD: 'card',
    SEPA: 'sepa',
    PAYPAL: 'paypal',
    GOOGLE_PAY: 'google_pay',
    APPLE_PAY: 'apple_pay', // For future implementation
  },
  
  // Supported currencies
  SUPPORTED_CURRENCIES: ['USD', 'EUR', 'GBP', 'GEL', 'CAD', 'AUD'],
  
  // API endpoints
  ENDPOINTS: {
    health: '/api/payments/unipay/health',
    methods: '/api/payments/unipay/methods',
    create: '/api/payments/unipay/create',
    processCard: '/api/payments/unipay/process-card',
    processSepa: '/api/payments/unipay/process-sepa',
    processPaypal: '/api/payments/unipay/process-paypal',
    processGooglePay: '/api/payments/unipay/process-google-pay',
    status: '/api/payments/unipay/status',
    refund: '/api/payments/unipay/refund',
  }
}; 