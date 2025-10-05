import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import SubscriptionButton from '../components/checkout/SubscriptionButton.jsx';
import { usePayPalPlan } from '../hooks/usePayPalPlan.js';
import './SubscribePage.css';

const SubscribePage = () => {
	const { user } = useContext(AuthContext);
	const { darkMode } = useTheme();
	const { plan, loading: planLoading } = usePayPalPlan();

	const isSubscribed = useMemo(() => {
		try { return localStorage.getItem('subscription_status') === 'active'; } catch { return false; }
	}, []);

	// Extract pricing info from plan
	const pricing = useMemo(() => {
		if (!plan?.billing_cycles?.[0]?.pricing_scheme?.fixed_price) {
			return { currency: 'USD', value: '29.99' };
		}
		return plan.billing_cycles[0].pricing_scheme.fixed_price;
	}, [plan]);

	return (
		<div className={`subscribe-hero min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'}`}>
			<section className="max-w-5xl mx-auto px-4 pt-14 pb-8">
				<h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-center">
					Unlock All AI Agents with All‑Access
				</h1>
				<p className="mt-4 text-center text-lg opacity-90">
					Unlimited downloads. New agents monthly. Priority support. Cancel anytime.
				</p>

				<div className="mt-10 grid md:grid-cols-2 gap-6 items-stretch">
					<div className="glass-panel p-6 rounded-2xl shadow-xl">
						<h2 className="text-2xl font-bold mb-2">{plan?.name || 'All‑Access Monthly'}</h2>
						<div className="flex items-end gap-2 mb-4">
							{planLoading ? (
								<span className="text-4xl font-extrabold animate-pulse">Loading...</span>
							) : (
								<>
									<span className="text-4xl font-extrabold">
										{pricing.currency === 'USD' ? '$' : pricing.currency === 'EUR' ? '€' : pricing.currency}
										{pricing.value}
									</span>
									<span className="text-sm opacity-70">/month</span>
								</>
							)}
						</div>
						<ul className="space-y-2 text-sm opacity-95">
							<li>• Unlimited downloads of all paid agents</li>
							<li>• Instant access to new releases</li>
							<li>• Commercial use license</li>
							<li>• Priority support</li>
						</ul>
						{isSubscribed ? (
							<div className="mt-6 text-green-600 font-semibold">You already have an active subscription.</div>
						) : (
							<div className="mt-6">
								<SubscriptionButton onConfirmed={() => window.location.assign('/agents')} />
							</div>
						)}
						<p className="mt-3 text-xs opacity-70">No commitment. Cancel anytime.</p>
					</div>

					<div className="glass-panel alt-panel p-6 rounded-2xl">
						<h3 className="text-xl font-semibold mb-3">Why creators choose AI Waverider</h3>
						<ul className="space-y-3 text-sm">
							<li>• Save hours weekly with plug‑and‑play agents</li>
							<li>• Proven workflows validated by the community</li>
							<li>• Transparent pricing and instant delivery</li>
							<li>• 7‑day money‑back guarantee if not satisfied</li>
						</ul>
						<div className="mt-6 text-xs opacity-70">
							{user ? 'You are signed in. Your subscription will be linked to your account.' : 'You are not signed in. You can sign in during PayPal flow or after checkout.'}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default SubscribePage; 