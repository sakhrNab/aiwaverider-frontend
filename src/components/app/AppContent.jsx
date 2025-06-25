// src/components/AppContent.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/globals.css'; // Tailwind global styles
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import SignUp from '../auth/SignUpForm';
import AppRoutes from '../../routes/routes.jsx';
import ChatBot from '../common/ChatBot';
import BackToTop from '../common/BackToTop';
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
    const path = location.pathname;
    let title = '';

    // Map routes to page titles
    if (path === '/') title = 'Home';
    else if (path === '/agents') title = 'AI Agents';
    else if (path.startsWith('/agents/')) title = 'Agent Details';
    else if (path === '/ai-tools') title = 'AI Tools';
    else if (path === '/latest-tech') title = 'Latest Tech';
    else if (path === '/videos') title = 'Videos';
    else if (path === '/about') title = 'About Us';
    else if (path === '/profile') title = 'Your Profile';
    else if (path === '/sign-in') title = 'Sign In';
    else if (path === '/sign-up') title = 'Create Account';
    else if (path === '/checkout') title = 'Checkout';
    else if (path === '/thankyou') title = 'Thank You';
    else if (path === '/monetization-paths') title = 'Monetization Paths';
    else if (path === '/ai-obstacle-solutions') title = 'AI Obstacle Solutions';
    else if (path.startsWith('/admin')) title = 'Admin Dashboard';
    else title = 'AIWaverider'; // Default title

    setPageTitle(title);
  }, [location]);

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
