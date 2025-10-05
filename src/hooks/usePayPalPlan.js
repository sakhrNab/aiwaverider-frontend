import { useState, useEffect } from 'react';
import { api } from '../api/core/apiConfig';
import { getPayPalPlanId } from '../config/config';

export const usePayPalPlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const planId = getPayPalPlanId();
        const response = await api.get(`/api/payments/paypal/plans/${planId}`);
        
        if (response.data?.success && response.data?.plan) {
          setPlan(response.data.plan);
        } else {
          throw new Error('Failed to fetch plan details');
        }
      } catch (err) {
        console.error('Error fetching PayPal plan:', err);
        setError(err.message);
        // Fallback to default plan data
        setPlan({
          name: 'All-Access Monthly',
          billing_cycles: [{
            pricing_scheme: {
              fixed_price: {
                currency_code: 'USD',
                value: '29.99'
              }
            }
          }]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  return { plan, loading, error };
};

