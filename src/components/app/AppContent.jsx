import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/globals.css'; // Tailwind global styles
import Header from '../layout/Header';
import AgentHeader from '../layout/AgentHeader';
import Footer from '../layout/Footer';
import SignUp from '../auth/SignUpForm';
import SignIn from '../auth/SignInForm';
import SkoolCommunityModal from '../community/SkoolCommunityModal';
import AppRoutes from '../../routes/routes.jsx';
import ChatBot from '../common/ChatBot';
import BackToTop from '../common/BackToTop';
import CookieConsent from '../common/CookieConsent';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import ErrorBoundary from '../common/ErrorBoundary';
import PageTitle from '../common/PageTitle';
import useScrollToTop from '../../hooks/useScrollToTop';

const AppContent = () => {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSkoolModalOpen, setIsSkoolModalOpen] = useState(false);
  const [skoolModalTrigger, setSkoolModalTrigger] = useState('signup');
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('');
  const [prefillEmail, setPrefillEmail] = useState('');

  // Check if Vercel Analytics should be enabled
  const isVercelAnalyticsEnabled = import.meta.env.VITE_VERCEL_ANALYTICS_ENABLED === 'true';

  const openSignUpModal = () => setIsSignUpModalOpen(true);
  const closeSignUpModal = () => setIsSignUpModalOpen(false);
  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);
  const openSkoolModal = (trigger = 'signup') => {
    setSkoolModalTrigger(trigger);
    setIsSkoolModalOpen(true);
  };
  const closeSkoolModal = () => setIsSkoolModalOpen(false);
  
  // Make modal functions globally available
  useEffect(() => {
    window.openSignUpModal = openSignUpModal;
    window.openSignInModal = openSignInModal;
    window.closeSignUpModal = closeSignUpModal;
    window.closeSignInModal = closeSignInModal;
    window.openSkoolModal = openSkoolModal;
    window.closeSkoolModal = closeSkoolModal;
    
    return () => {
      delete window.openSignUpModal;
      delete window.openSignInModal;
      delete window.closeSignUpModal;
      delete window.closeSignInModal;
      delete window.openSkoolModal;
      delete window.closeSkoolModal;
    };
  }, []);
  
  // Use custom hook for robust scroll restoration
  useScrollToTop();

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
    const handleOpenSignUpModal = (e) => {
      const incomingEmail = e && e.detail && e.detail.email ? e.detail.email : '';
      if (incomingEmail) {
        setPrefillEmail(incomingEmail);
      }
      openSignUpModal();
    };
    const handleOpenSignInModal = () => {
      openSignInModal();
    };
    
    document.addEventListener('open-signup-modal', handleOpenSignUpModal);
    document.addEventListener('open-signin-modal', handleOpenSignInModal);
    
    return () => {
      document.removeEventListener('open-signup-modal', handleOpenSignUpModal);
      document.removeEventListener('open-signin-modal', handleOpenSignInModal);
    };
  }, []);

  const isAgentsRoute = location.pathname === '/agents' || /^\/agents\//.test(location.pathname);

  return (
    <>
      <PageTitle title={pageTitle} />
      
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
          {isAgentsRoute ? (
            <AgentHeader openSignUpModal={openSignUpModal} />
          ) : (
            <Header
              openSignUpModal={openSignUpModal}
              isFixedOnHome={location.pathname === '/' && !isAgentsRoute}
              isHomePage={location.pathname === '/'}
            />
          )}

          <div className="flex-grow">
            <AppRoutes />
          </div>

          <Footer />

          {location.pathname !== '/sign-up' && (
            <SignUp isOpen={isSignUpModalOpen} onClose={closeSignUpModal} prefillEmail={prefillEmail} redirectPath={location.pathname} />
          )}
          {location.pathname !== '/sign-in' && (
            <SignIn isOpen={isSignInModalOpen} onClose={closeSignInModal} redirectPath={location.pathname} />
          )}

          <SkoolCommunityModal 
            isOpen={isSkoolModalOpen} 
            onClose={closeSkoolModal} 
            triggerSource={skoolModalTrigger}
          />

          <CookieConsent />
        </div>
      </ErrorBoundary>
      
      {isVercelAnalyticsEnabled && <VercelAnalytics />}
      
      <ChatBot />
      <BackToTop />
    </>
  );
};

export default AppContent;