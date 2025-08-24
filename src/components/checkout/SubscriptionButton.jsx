import React, { useEffect } from 'react';
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { api } from '../../api/core/apiConfig';

const InnerButtons = ({ activePlanId, onConfirmed, disabled }) => {
  const [{ options }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    const newOptions = { ...options, vault: true, intent: 'subscription' };
    dispatch({ type: 'resetOptions', value: newOptions });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePlanId]);

  return (
    <PayPalButtons
      style={{ layout: 'vertical' }}
      fundingSource="paypal"
      createSubscription={(data, actions) => actions.subscription.create({ plan_id: activePlanId })}
      onApprove={async (data) => {
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
          toast.error(e?.response?.data?.error || e.message || 'Subscription confirmation failed');
        }
      }}
      disabled={disabled}
    />
  );
};

const SubscriptionButton = ({ planId, onConfirmed = () => {}, disabled = false }) => {
  const activePlanId = planId || import.meta.env.VITE_PAYPAL_SUBS_PLAN_ID;
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID_SANDBOX || import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';

  if (!activePlanId) {
    return <button className="subscribe-btn" disabled>Subscription plan not configured</button>;
  }

  // Local provider ensures intent=subscription without affecting global capture buttons
  return (
    <PayPalScriptProvider options={{ 'client-id': clientId, intent: 'subscription', vault: true, components: 'buttons' }}>
      <InnerButtons activePlanId={activePlanId} onConfirmed={onConfirmed} disabled={disabled} />
    </PayPalScriptProvider>
  );
};

export default SubscriptionButton; 