import React, { useEffect } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { api } from '../../api/core/apiConfig';
import { getPayPalPlanId } from '../../config/config';

const SubscriptionButton = ({ planId, onConfirmed = () => {}, disabled = false }) => {
  const [{ options }, dispatch] = usePayPalScriptReducer();
  const activePlanId = planId || getPayPalPlanId();

  // Update PayPal options for subscription
  useEffect(() => {
    const newOptions = { 
      ...options, 
      vault: true, 
      intent: 'subscription',
      components: 'buttons'
    };
    dispatch({ type: 'resetOptions', value: newOptions });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePlanId]);

  if (!activePlanId) {
    return <button className="subscribe-btn" disabled>Subscription plan not configured</button>;
  }

  return (
    <PayPalButtons
      style={{ layout: 'vertical' }}
      fundingSource="paypal"
      createSubscription={(data, actions) => {
        console.log('Creating subscription with plan ID:', activePlanId);
        return actions.subscription.create({ plan_id: activePlanId });
      }}
      onApprove={async (data) => {
        console.log('Subscription approved:', data);
        try {
          const res = await api.post('/api/payments/paypal/subscriptions/confirm', { subscriptionID: data.subscriptionID });
          if (res.data?.success) {
            try { localStorage.setItem('subscription_status', 'active'); } catch {}
            toast.success('Subscription activated. Thank you!');
            onConfirmed(res.data);
          } else {
            toast.error(res.data?.error || 'Failed to confirm subscription');
          }
        } catch (e) {
          console.error('Subscription confirmation error:', e);
          toast.error(e?.response?.data?.error || e.message || 'Subscription confirmation failed');
        }
      }}
      onError={(error) => {
        console.error('PayPal subscription error:', error);
        toast.error('PayPal subscription failed. Please try again.');
      }}
      onCancel={() => {
        console.log('Subscription cancelled by user');
        toast.info('Subscription cancelled.');
      }}
      disabled={disabled}
    />
  );
};

export default SubscriptionButton; 