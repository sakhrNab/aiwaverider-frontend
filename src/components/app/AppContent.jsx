import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/globals.css'; // Tailwind global styles
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import SignUp from '../auth/SignUpForm';
import AppRoutes from '../../routes/routes.jsx';
import ChatBot from '../common/ChatBot';
import BackToTop from '../common/BackToTop';
import CookieConsent from '../common/CookieConsent';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import ErrorBoundary from '../common/ErrorBoundary';
import PageTitle from '../common/PageTitle';

const AppContent = () => {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('');

  // Check if Vercel Analytics should be enabled
  const isVercelAnalyticsEnabled = import.meta.env.VITE_VERCEL_ANALYTICS_ENABLED === 'true';

  const openSignUpModal = () => setIsSignUpModalOpen(true);
  const closeSignUpModal = () => setIsSignUpModalOpen(false);
  
  // Update page title based on current route
  useEffect(() => {
    const pathToTitle = {
      '/': 'AI Waverider - AI Agents & Tools Marketplace',
      '/agents': 'AI Agents - AI Waverider',
      '/ai-tools': 'AI Tools - AI Waverider',
      '/prompts': 'AI Prompts - AI Waverider',
      '/about': 'About Us - AI Waverider',
      '/videos': 'Videos - AI Waverider',
      '/latest-tech': 'Latest Technology - AI Waverider',
      '/monetization-paths': 'Monetization Paths - AI Waverider',
      '/ai-obstacle-solutions': 'AI Solutions - AI Waverider',
      '/checkout': 'Checkout - AI Waverider',
      '/profile': 'Profile - AI Waverider',
      '/sign-in': 'Sign In - AI Waverider',
      '/sign-up': 'Sign Up - AI Waverider',
      '/terms': 'Terms and Conditions - AI Waverider',
      '/privacy': 'Privacy Policy - AI Waverider',
      '/delivery': 'Delivery Terms - AI Waverider',
      '/refund': 'Refund Policy - AI Waverider',
      '/contact': 'Contact Information - AI Waverider',
      '/company-info': 'Company Information - AI Waverider',
      '/thankyou': 'Thank You - AI Waverider',
      '/checkout/success': 'Order Success - AI Waverider'
    };

    // Handle dynamic routes
    let currentTitle = pathToTitle[location.pathname];
    
    // Handle prompt detail pages
    if (!currentTitle && location.pathname.startsWith('/prompts/')) {
      currentTitle = 'Prompt Details - AI Waverider';
    }
    
    // Handle admin routes
    if (!currentTitle && location.pathname.startsWith('/admin')) {
      if (location.pathname.includes('/prompts')) {
        currentTitle = 'Admin - Manage Prompts - AI Waverider';
      } else if (location.pathname.includes('/ai-tools')) {
        currentTitle = 'Admin - Manage AI Tools - AI Waverider';
      } else {
        currentTitle = 'Admin Panel - AI Waverider';
      }
    }
    
    // Default fallback
    if (!currentTitle) {
      currentTitle = 'AI Waverider';
    }
    
    setPageTitle(currentTitle);
    
    // Also update the document title directly for better SEO
    document.title = currentTitle;
  }, [location.pathname]);

  // Add event listener for opening signup modal from anywhere in the app
  useEffect(() => {
    const handleOpenSignUpModal = () => {
      openSignUpModal();
    };
    
    document.addEventListener('open-signup-modal', handleOpenSignUpModal);
    
    return () => {
      document.removeEventListener('open-signup-modal', handleOpenSignUpModal);
    };
  }, []);

  return (
    <>
      {/* Update page title and browser history entry */}
      <PageTitle title={pageTitle} />
      
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
          <Header openSignUpModal={openSignUpModal} />

          <div className="flex-grow">
            <AppRoutes />
          </div>

          <Footer />

          {/* Show SignUp modal if not on /sign-up */}
          {location.pathname !== '/sign-up' && (
            <SignUp isOpen={isSignUpModalOpen} onClose={closeSignUpModal} />
          )}

          {/* Cookie Consent Banner - Required for GDPR/Legal Compliance */}
          <CookieConsent />
        </div>
      </ErrorBoundary>
      
      {/* Only load Vercel Analytics if properly configured */}
      {isVercelAnalyticsEnabled && <VercelAnalytics />}
      
      <ChatBot />
      <BackToTop />
    </>
  );
};

export default AppContent;