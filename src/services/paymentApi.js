/**
 * PAYMENT API SERVICE - PAYPAL ONLY
 * =================================
 * - PayPal is the single payment provider
 * - Frontend creates orders and captures via backend endpoints
 */

import axios from 'axios';
// import unipayService from './unipayService';

// Use environment variable for API URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Create API instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to check API connectivity (deprecated UniPay)
export const checkApiConnectivity = async () => {
  try {
    // Minimal connectivity check to backend payments health
    const res = await api.get('/api/payments/health');
    return { ok: true, data: res.data };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

export const getPaymentMethodsForCountry = async () => {
  // PayPal-only now
  return { success: true, methods: ['paypal'] };
};

/**
 * Create a PayPal order via backend direct integration
 */
export const createPayPalOrder = async (data) => {
  try {
    const payload = {
      amount: data.cartTotal || data.amount,
      currency: data.currency || 'USD',
      items: data.items || [],
      customerInfo: {
        email: data.email || '',
        userId: data.userId || null,
      },
      metadata: {
        orderId: data.orderId || `order_${Date.now()}`,
        source: 'paypal_checkout',
        ...data.metadata
      }
    };

    const res = await api.post('/api/payments/paypal/create-order', payload);
    if (!res.data || !res.data.success) {
      throw new Error(res.data?.error || 'Failed to create PayPal order');
    }

    return { id: res.data.id, orderId: res.data.orderId };
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw error;
  }
};

/**
 * Capture a PayPal payment via backend
 */
export const capturePayPalPayment = async (orderID, metadata = {}) => {
  try {
    const res = await api.post('/api/payments/paypal/capture', { orderID, metadata });
    if (!res.data || !res.data.success) {
      throw new Error(res.data?.error || 'Failed to capture PayPal payment');
    }
    return res.data;
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    throw error;
  }
};

/**
 * Create a payment session through UniPay
 * @param {Object} data - Cart data including cartTotal, items, currency, and paymentMethod
 * @returns {Promise<Object>} - UniPay payment session details with checkout URL
 */
export const createStripeCheckout = async (data) => {
  try {
    // Determine payment method - default to card if not specified
    const paymentMethod = data.paymentMethodTypes && data.paymentMethodTypes.length > 0 
      ? data.paymentMethodTypes[0] 
      : 'card';
    
    console.log('Creating UniPay payment session');
    console.log('UniPay request data:', JSON.stringify(data, null, 2));
    
    const paymentData = {
      amount: data.cartTotal || data.amount,
      currency: data.currency || 'USD',
      paymentMethod,
      items: data.items || [],
      email: data.email || '',
      metadata: {
        orderId: data.orderId || `order_${Date.now()}`,
        source: 'checkout_session',
        countryCode: data.countryCode,
        ...data.metadata
      },
      successUrl: data.successUrl || `${window.location.origin}/checkout/success`,
      cancelUrl: data.cancelUrl || `${window.location.origin}/checkout`
    };
    
    // This function is now UniPay-specific, so we'll keep it as is
    // The original unipayService.createPayment call is removed
    // If UniPay integration is removed, this function will need to be updated
    // For now, we'll return a placeholder or throw an error if UniPay is not available
    console.warn('createStripeCheckout is now UniPay-specific and requires UniPay integration.');
    return {
      success: false,
      message: 'UniPay integration is not fully implemented yet.',
      sessionId: null,
      paymentId: null,
      orderId: null,
      url: null,
      checkoutUrl: null,
      status: 'failed',
      provider: 'unipay',
      expiresAt: null
    };
  } catch (error) {
    console.error('Error creating UniPay payment session:', error);
    throw error;
  }
};

/**
 * Create a Stripe Payment Intent for card payments
 * @param {Object} data - Payment data including amount and currency
 * @returns {Promise<Object>} - The payment intent data with client secret
 */
export const createPaymentIntent = async (data) => {
  try {
    const { amount, currency, email, metadata = {}, paymentMethodTypes, items = [] } = data;
    
    if (!amount || !currency) {
      throw new Error('Amount and currency are required for payment');
    }
    
    console.log('Creating payment intent:', { amount, currency, paymentMethodTypes });
    
    // Get cart items from localStorage if not provided
    let cartItems = items;
    if (!cartItems || cartItems.length === 0) {
      try {
        const storedItems = localStorage.getItem('cartItems');
        if (storedItems) {
          cartItems = JSON.parse(storedItems);
        }
      } catch (err) {
        console.warn('Could not retrieve cart items from localStorage', err);
      }
    }
    
    // If we still don't have items, try to get from cart context through localStorage
    if (!cartItems || cartItems.length === 0) {
      try {
        const cart = localStorage.getItem('lastPurchasedItems');
        if (cart) {
          cartItems = JSON.parse(cart);
        }
      } catch (err) {
        console.warn('Could not retrieve cart from localStorage', err);
      }
    }
    
    // Ensure items are in a format that can be properly serialized to JSON
    const formattedItems = Array.isArray(cartItems) ? cartItems.map(item => ({
      id: item.id || 'unknown',
      title: item.title || item.name || 'Product',
      price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
      quantity: typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 1,
      imageUrl: item.imageUrl || item.image || null
    })) : [];
    
    // Generate a unique order ID for tracking
    const generatedOrderId = 'ORD-' + Date.now().toString().substring(6) + 
                             Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Try to get user ID from localStorage
    let userId = null;
    try {
      userId = localStorage.getItem('userId') || null;
      
      // Check if we have user data in localStorage
      const userData = localStorage.getItem('userData');
      if (userData && !userId) {
        const user = JSON.parse(userData);
        userId = user.id || user.uid || null;
      }
    } catch (err) {
      console.warn('Could not retrieve user ID from localStorage', err);
    }
    
    const response = await fetch(`${API_URL}/api/payments/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: currency.toLowerCase(),
        email,
        paymentMethodTypes: paymentMethodTypes || ['card'], // Default to card if not specified
        metadata: {
          ...metadata,
          orderId: generatedOrderId,
          email: email || metadata.userEmail || '',
          userEmail: metadata.userEmail || email || '',
          items: JSON.stringify(formattedItems), // Convert items array to a JSON string for metadata
          userId: userId,
          source: 'checkout-form'
        }
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Payment intent creation failed: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Payment intent created successfully:', result);
    
    return result;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

/**
 * Confirm a card payment
 * @param {string} clientSecret - The payment intent client secret
 * @param {Object} paymentMethod - The payment method data
 * @returns {Promise<Object>} - The payment confirmation result
 */
export const confirmCardPayment = async (clientSecret, paymentMethod) => {
  // This is handled by Stripe.js directly on the client side
  // We include this function for documentation purposes
  try {
    // In a real implementation, you might have additional server-side validation
    // or logging related to the payment confirmation
    console.log('Confirming card payment with client secret');
    
    // Return a structured object for consistent API
    return {
      success: true,
      message: 'Payment confirmation initiated by client'
    };
  } catch (error) {
    console.error('Error in confirmCardPayment:', error);
    throw error;
  }
};

/**
 * Check the status of a card payment
 * @param {string} paymentIntentId - The payment intent ID
 * @returns {Promise<Object>} - The payment status
 */
export const checkCardPaymentStatus = async (paymentIntentId) => {
  try {
    if (!paymentIntentId) {
      throw new Error('Payment ID is required');
    }
    
    const response = await fetch(`${API_URL}/api/payments/payment-status/${paymentIntentId}?type=payment_intent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Payment status check failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking card payment status:', error);
    throw error;
  }
};

/**
 * Get payment status
 * @param {string} id - Payment ID
 * @param {string} type - Payment type (payment_intent, checkout_session, paypal_order, sepa_credit_transfer)
 * @returns {Promise<Object>} - Payment status details
 */
export const getPaymentStatus = async (id, type = 'payment_intent') => {
  try {
    // Log what we're checking for diagnostic purposes
    console.log(`Checking payment status for ${type} ${id}`);
    
    // Handle special payment types that use different endpoints
    if (type === 'sepa_credit_transfer') {
      const response = await fetch(`${API_URL}/api/payments/sepa-credit-transfer/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        // Gracefully handle errors for SEPA payments
        console.warn(`SEPA payment check returned status ${response.status}`);
        
        // For SEPA, we'll return a pending status as a fallback
        // This is because the payment might still be processing in the banking system
        return {
          success: true,
          id,
          type,
          status: 'pending',
          result: {
            id,
            status: 'pending',
            metadata: { orderId: id }
          }
        };
      }
      
      return await response.json();
    }
    
    // Standard payment status endpoint for other payment types
    const response = await fetch(`${API_URL}/api/payments/payment-status/${id}?type=${type}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP error ${response.status}` }));
      throw new Error(errorData.error || 'Failed to get payment status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking payment status:', error);
    
    // Return a minimal fallback object that the UI can handle
    if (type === 'sepa_credit_transfer') {
      return {
        success: true,
        id,
        type,
        status: 'pending',  // Default status for SEPA
        result: {
          id,
          status: 'pending',
          metadata: { orderId: id }
        }
      };
    }
    
    throw error;
  }
};

/**
 * Create a crypto payment (BitPay)
 * @param {Object} data - Cart data including cartTotal, items, and currency
 * @returns {Promise<Object>} - BitPay invoice details with payment URL
 */
export const createCryptoPayment = async (data) => {
  try {
    const response = await fetch(`${API_URL}/api/payments/create-crypto-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create crypto payment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating crypto payment:', error);
    throw error;
  }
};

/**
 * Check crypto payment status
 * @param {string} id - BitPay invoice ID
 * @returns {Promise<Object>} - Payment status details
 */
export const getCryptoPaymentStatus = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/payments/crypto-payment-status/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get crypto payment status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking crypto payment status:', error);
    throw error;
  }
};

/**
 * Detect user's country code
 * @returns {Promise<string>} - Two-letter country code
 */
export const detectUserCountry = async () => {
  try {
    // Try to get country from IP geolocation service
    const response = await fetch('https://ipapi.co/json/');
    
    if (response.ok) {
      const data = await response.json();
      return data.country_code;
    }
    
    // Fallback to browser's language preferences
    const language = navigator.language || navigator.userLanguage;
    const country = language.split('-')[1];
    
    return country || 'US'; // Default to US if detection fails
  } catch (error) {
    console.error('Error detecting user country:', error);
    return 'US'; // Default to US if detection fails
  }
};

/**
 * Get thank you page redirect URL for a specific session
 * @param {string} sessionId - The payment session ID
 * @returns {string} - The URL to redirect to
 */
export const getThankYouRedirectUrl = (sessionId) => {
  if (!sessionId) {
    console.error('Missing session ID for thank you redirect');
    return `${window.location.origin}/checkout/success`;
  }
  
  return `${API_URL}/api/payments/thankyou?session_id=${sessionId}`;
};

/**
 * Create a Stripe checkout session (direct endpoint call)
 * This is an alternative to createStripeCheckout that calls the endpoint directly
 * @param {Object} data - Cart data including items, successUrl, cancelUrl, etc.
 * @returns {Promise<Object>} - Checkout session with URL
 */
export const createCheckoutSession = async (data) => {
  try {
    console.log('Creating checkout session with data:', JSON.stringify(data, null, 2));
    
    const response = await fetch(`${API_URL}/api/payments/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('Checkout session error response:', errorData);
      } catch (parseError) {
        const textError = await response.text();
        console.error('Response text:', textError);
        throw new Error(`Server returned ${response.status}: ${textError || 'No response body'}`);
      }
      throw new Error(errorData.error || `Failed to create checkout session: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log('Checkout session created successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}; 