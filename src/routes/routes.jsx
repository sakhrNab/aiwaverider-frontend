import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import ProtectedRoute from './ProtectedRoute';

// Eagerly loaded components
import HomePage from '../pages/HomePage';

// Lazy loaded components
const Agents = lazy(() => import('../pages/AgentsPage'));
const AgentDetail = lazy(() => import('../pages/AgentDetailPage'));
const AITools = lazy(() => import('../pages/AIToolsPage'));
const PromptsPage = lazy(() => import('../pages/PromptsPage'));
const PromptPage = lazy(() => import('../pages/PromptPage'));
const Profile = lazy(() => import('../pages/ProfilePage'));
const SignIn = lazy(() => import('../components/auth/SignInForm'));
const SignUp = lazy(() => import('../components/auth/SignUpForm'));
const About = lazy(() => import('../pages/AboutPage'));
const LatestTech = lazy(() => import('../pages/LatestTechPage'));
const Checkout = lazy(() => import('../pages/CheckoutPage'));
const ThankYou = lazy(() => import('../pages/ThankYouPage'));
const MonetizationPaths = lazy(() => import('../pages/MonetizationPathsPage'));
const AIObstacleSolutions = lazy(() => import('../pages/AIObstacleSolutionsPage'));
const CheckoutSuccess = lazy(() => import('../components/checkout/CheckoutSuccessDisplay'));
const PostDetail = lazy(() => import('../components/posts/PostDetail'));
const CreatePost = lazy(() => import('../components/posts/CreatePost'));
const ApiTestPage = lazy(() => import('../pages/ApiTestPage'));
const VideosPage = lazy(() => import('../pages/VideosPage'));
const SubscribePage = lazy(() => import('../pages/SubscribePage'));

// Legal pages
const TermsPage = lazy(() => import('../pages/TermsPage'));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'));
const DeliveryPage = lazy(() => import('../pages/DeliveryPage'));
const RefundPage = lazy(() => import('../pages/RefundPage'));
const CompanyInfoPage = lazy(() => import('../pages/CompanyInfoPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));

// Admin pages
const Dashboard = lazy(() => import('../pages/admin/AdminDashboardPage'));
const ManageAgents = lazy(() => import('../pages/admin/AdminManageAgentsPage'));
const ManageUsers = lazy(() => import('../pages/admin/AdminManageUsersPage'));
const AdminAnalytics = lazy(() => import('../pages/admin/AdminAnalyticsPage'));
const Settings = lazy(() => import('../pages/admin/AdminSettingsPage'));
const Pricing = lazy(() => import('../pages/admin/AdminPricingPage'));
const AIToolsManager = lazy(() => import('../components/admin/ai-tools/AIToolsManager'));
const EmailManagement = lazy(() => import('../pages/admin/AdminEmailManagementPage'));
const EmailComposer = lazy(() => import('../pages/admin/AdminEmailComposerPage'));
const AdminPromptsPage = lazy(() => import('../pages/admin/AdminPromptsPage'));
const AdminPromptEditPage = lazy(() => import('../pages/admin/AdminPromptEditPage'));
const AdminVideosPage = lazy(() => import('../pages/admin/AdminVideosPage'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-blue-900">
    <div className="mb-8">
      <HashLoader color="#4FD1C5" size={70} speedMultiplier={0.8} />
    </div>
    <div className="text-white text-xl font-semibold mt-4">
      Loading...
    </div>
  </div>
);

// Helper function to wrap components with Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<LoadingSpinner />}>
    {Component}
  </Suspense>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-in" element={withSuspense(<SignIn />)} />
      <Route path="/sign-up" element={withSuspense(<SignUp />)} />
      <Route path="/profile" element={withSuspense(<Profile />)} />
      <Route path="/subscribe" element={withSuspense(<SubscribePage />)} />
      
      {/* Content Routes */}
      <Route path="/agents" element={withSuspense(<Agents />)} />
      <Route path="/agents/:agentId" element={withSuspense(<AgentDetail />)} />
      <Route path="/product/:agentId" element={withSuspense(<AgentDetail />)} />
      
      {/* AI Tools and Prompts - Now Separate */}
      <Route path="/ai-tools" element={withSuspense(<AITools />)} />
      <Route path="/prompts" element={withSuspense(<PromptsPage />)} />
      <Route path="/prompts/:id" element={withSuspense(<PromptPage />)} />
      
      {/* Other Content */}
      <Route path="/videos" element={withSuspense(<VideosPage />)} />
      <Route path="/latest-tech" element={withSuspense(<LatestTech />)} />
      <Route path="/about" element={withSuspense(<About />)} />
      <Route path="/monetization-paths" element={withSuspense(<MonetizationPaths />)} />
      <Route path="/ai-obstacle-solutions" element={withSuspense(<AIObstacleSolutions />)} />
      
      {/* E-commerce */}
      <Route path="/checkout" element={withSuspense(<Checkout />)} />
      <Route path="/thankyou" element={withSuspense(<ThankYou />)} />
      <Route path="/checkout/success" element={withSuspense(<CheckoutSuccess />)} />
      
      {/* Legal Pages - Required for Georgian E-Commerce Compliance */}
      <Route path="/terms" element={withSuspense(<TermsPage />)} />
      <Route path="/privacy" element={withSuspense(<PrivacyPage />)} />
      <Route path="/delivery" element={withSuspense(<DeliveryPage />)} />
      <Route path="/refund" element={withSuspense(<RefundPage />)} />
      <Route path="/company-info" element={withSuspense(<CompanyInfoPage />)} />
      <Route path="/contact" element={withSuspense(<ContactPage />)} />
      
      {/* Development Tools */}
      <Route path="/api-test" element={withSuspense(<ApiTestPage />)} />

      {/* Posts Routes */}
      <Route path="/posts/:postId" element={withSuspense(<PostDetail />)} />
      <Route
        path="/posts/create"
        element={
          <ProtectedRoute roles={['admin']}>
            {withSuspense(<CreatePost />)}
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <Navigate to="/admin/dashboard" replace />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={['admin']}>
            {withSuspense(<Dashboard />)}
          </ProtectedRoute>
        }
      />
      
      {/* Admin Content Management */}
      <Route
        path="/admin/agents"
        element={
          <ProtectedRoute roles={['admin']}>
            {withSuspense(<ManageAgents />)}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/ai-tools"
        element={
          <ProtectedRoute roles={['admin']}>
            {withSuspense(<AIToolsManager />)}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/prompts"
        element={
          <ProtectedRoute roles={['admin']}>
            {withSuspense(<AdminPromptsPage />)}
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/prompts/:id"
        element={
          <ProtectedRoute roles={['admin']}>
            {withSuspense(<AdminPromptEditPage />)}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/videos"
        element={
          <ProtectedRoute roles={['admin']}>
            {withSuspense(<AdminVideosPage />)}
          </ProtectedRoute>
        }
      />

      {/* Admin System Management */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={['admin']}>
            {withSuspense(<ManageUsers />)}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute roles={['admin']}>
            {withSuspense(<AdminAnalytics />)}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute roles={['admin']}>
            {withSuspense(<Settings />)}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/pricing"
        element={
          <ProtectedRoute roles={['admin']}>
            {withSuspense(<Pricing />)}
          </ProtectedRoute>
        }
      />
      
      {/* Admin Communication */}
      <Route
        path="/admin/email"
        element={
          <ProtectedRoute roles={['admin']}>
            {withSuspense(<EmailManagement />)}
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/email-composer"
        element={
          <ProtectedRoute roles={['admin']}>
            {withSuspense(<EmailComposer />)}
          </ProtectedRoute>
        }
      />

      {/* Fallback - Redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;