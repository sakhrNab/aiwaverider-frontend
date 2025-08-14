import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { createPayPalOrder, capturePayPalPayment } from '../services/paymentApi.js';
import { HashLoader } from 'react-spinners';
import './CheckoutPage.css';
import { useTheme } from '../contexts/ThemeContext';

const Checkout = () => {
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [{ isPending }] = usePayPalScriptReducer();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { darkMode } = useTheme();
  const currentThemeClass = darkMode ? 'theme-dark' : 'theme-light';

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.email) setEmail(user.email);
  }, [isAuthenticated, user]);

  const finalTotal = cartTotal;
  const currency = 'USD';

  if (cart.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Continue Shopping
          </Link>
          <h1>Checkout</h1>
        </div>
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <FaShoppingCart />
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any products to your cart yet.</p>
          <Link to="/agents" className="continue-shopping-btn">Browse Products</Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-blue-900">
        <div className="mb-8">
          <HashLoader color="#4FD1C5" size={70} speedMultiplier={0.8} />
        </div>
        <div className="text-white text-xl font-semibold mt-4">Loading Checkout</div>
        <div className="text-blue-300 text-sm mt-2">Preparing your shopping cart...</div>
      </div>
    );
  }

  const createPaypalOrder = async () => {
    try {
      const orderData = {
        cartTotal: finalTotal,
        items: cart,
        currency,
        email: email || undefined,
      };
      const { id } = await createPayPalOrder(orderData);
      return id;
    } catch (error) {
      toast.error('Could not initiate PayPal checkout. Please try again.');
      setIsSubmitting(false);
      throw error;
    }
  };

  const onPayPalApprove = async (data) => {
    try {
      const result = await capturePayPalPayment(data.orderID, { items: JSON.stringify(cart), email: email || '' });
      // Persist templates for success page if provided
      try {
        if (result?.templates && Array.isArray(result.templates) && result.templates.length > 0) {
          sessionStorage.setItem('downloadTemplates', JSON.stringify(result.templates));
        }
      } catch {}
      // Persist purchased items for success page
      try { localStorage.setItem('lastPurchasedItems', JSON.stringify(cart)); } catch {}
      clearCart();
      toast.success('Payment successful! Thank you for your purchase.');
      navigate(`/checkout/success?payment_id=${data.orderID}&status=success&type=paypal`);
    } catch (error) {
      toast.error('There was a problem with your payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`checkout-container ${currentThemeClass}`}>
      <div className="checkout-header">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Continue Shopping
        </Link>
        <h1>Secure Checkout</h1>
      </div>

      <div className="checkout-content">
        <div className="checkout-items">
          <h2>Your Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})</h2>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image"><img src={item.imageUrl} alt={item.title} /></div>
              <div className="item-details">
                <h3>{item.title}</h3>
                <p className="item-price">USD {(item.price || 0).toFixed(2)}</p>
                <div className="item-actions">
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} disabled={item.quantity <= 1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="remove-button" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
              <div className="item-total">USD {((item.price || 0) * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="checkout-summary">
          <h2>Complete Your Order</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>USD {(cartTotal || 0).toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>USD {(finalTotal || 0).toFixed(2)}</span>
          </div>

          {!isAuthenticated && (
            <div className="form-group">
              <label htmlFor="email">Email for delivery receipt</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          )}

          <div className="paypal-focus">
            <div className="trust-badges">
              <span>Money-back guarantee</span>
              <span>Instant delivery to your email</span>
              <span>Trusted by creators</span>
            </div>

            {isPending ? (
              <div className="paypal-loading">Loading PayPal buttons...</div>
            ) : (
              <PayPalButtons
                style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 45 }}
                disabled={isSubmitting || (!isAuthenticated && !email)}
                createOrder={createPaypalOrder}
                onApprove={onPayPalApprove}
                onError={(err) => { toast.error('PayPal error. Please try again.'); setIsSubmitting(false); }}
                onCancel={() => { toast.info('Payment cancelled.'); setIsSubmitting(false); }}
                forceReRender={[finalTotal]}
              />
            )}

            <div className="payment-benefits">
              <ul>
                <li>Pay with PayPal balance, card, or bank — all via PayPal</li>
                <li>No account? Check out as guest with your card through PayPal</li>
                <li>Secure checkout with dispute protection</li>
              </ul>
            </div>
          </div>

          <p className="security-note">
            <small>Your payment is processed by PayPal. We never store your card details.</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 