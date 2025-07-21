import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaCookieBite, FaCog, FaShieldAlt, FaTimes, FaCheck } from 'react-icons/fa';

const CookieConsent = () => {
  const { darkMode } = useTheme();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });

  // Check if user has already made a choice
  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowBanner(true);
    } else {
      const preferences = JSON.parse(cookieConsent);
      setCookiePreferences(preferences);
      // Apply cookie preferences
      applyCookiePreferences(preferences);
    }
  }, []);

  const applyCookiePreferences = (preferences) => {
    // Apply Google Analytics
    if (preferences.analytics) {
      enableGoogleAnalytics();
    } else {
      disableGoogleAnalytics();
    }

    // Apply marketing cookies
    if (preferences.marketing) {
      enableMarketingCookies();
    } else {
      disableMarketingCookies();
    }

    // Apply functional cookies
    if (preferences.functional) {
      enableFunctionalCookies();
    } else {
      disableFunctionalCookies();
    }
  };

  const enableGoogleAnalytics = () => {
    // Enable Google Analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  };

  const disableGoogleAnalytics = () => {
    // Disable Google Analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
  };

  const enableMarketingCookies = () => {
    // Enable marketing/advertising cookies
    if (window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      });
    }
  };

  const disableMarketingCookies = () => {
    // Disable marketing/advertising cookies
    if (window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }
  };

  const enableFunctionalCookies = () => {
    // Enable functional cookies (preferences, language, etc.)
    localStorage.setItem('functionalCookiesEnabled', 'true');
  };

  const disableFunctionalCookies = () => {
    // Disable functional cookies
    localStorage.removeItem('functionalCookiesEnabled');
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setCookiePreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    applyCookiePreferences(allAccepted);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setCookiePreferences(necessaryOnly);
    localStorage.setItem('cookieConsent', JSON.stringify(necessaryOnly));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    applyCookiePreferences(necessaryOnly);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(cookiePreferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    applyCookiePreferences(cookiePreferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handlePreferenceChange = (type) => {
    if (type === 'necessary') return; // Cannot disable necessary cookies
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const cookieCategories = [
    {
      id: 'necessary',
      name: 'Necessary Cookies',
      description: 'These cookies are essential for the website to function properly. They enable basic features like page navigation, access to secure areas, and payment processing.',
      examples: 'Authentication, security, shopping cart functionality',
      required: true
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      description: 'These cookies enhance your experience by remembering your preferences and providing personalized features.',
      examples: 'Language preference, theme selection, form data'
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website, allowing us to improve our services.',
      examples: 'Google Analytics, page views, user behavior tracking'
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'These cookies are used to deliver relevant advertisements and marketing content based on your interests.',
      examples: 'Social media integration, advertising tracking, remarketing'
    }
  ];

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ${
        showBanner ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-t shadow-lg`}>
          <div className="container mx-auto px-6 py-4">
            {!showSettings ? (
              /* Simple Banner View */
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <FaCookieBite className={`mr-2 text-2xl ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    <h3 className="text-lg font-semibold">Cookie Notice</h3>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    We use cookies to enhance your experience, analyze site usage, and provide personalized content. 
                    By clicking "Accept All," you consent to our use of all cookies. You can customize your preferences 
                    or learn more in our{' '}
                    <a href="/privacy" className={`underline ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:no-underline`}>
                      Privacy Policy
                    </a>.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 lg:ml-6">
                  <button
                    onClick={() => setShowSettings(true)}
                    className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FaCog className="inline mr-1" />
                    Customize
                  </button>
                  
                  <button
                    onClick={handleAcceptNecessary}
                    className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Necessary Only
                  </button>
                  
                  <button
                    onClick={handleAcceptAll}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    <FaCheck className="inline mr-1" />
                    Accept All
                  </button>
                </div>
              </div>
            ) : (
              /* Detailed Settings View */
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FaShieldAlt className={`mr-2 text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h3 className="text-lg font-semibold">Cookie Preferences</h3>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className={`p-1 rounded-full hover:bg-gray-200 ${darkMode ? 'hover:bg-gray-700' : ''}`}
                  >
                    <FaTimes className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {cookieCategories.map((category) => (
                    <div key={category.id} className={`p-4 rounded-lg border ${
                      darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{category.name}</h4>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={cookiePreferences[category.id]}
                            onChange={() => handlePreferenceChange(category.id)}
                            disabled={category.required}
                          />
                          <div className={`w-11 h-6 rounded-full transition-colors ${
                            cookiePreferences[category.id]
                              ? 'bg-blue-600'
                              : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                          } ${category.required ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                              cookiePreferences[category.id] ? 'translate-x-5' : 'translate-x-0'
                            } mt-0.5 ml-0.5`}></div>
                          </div>
                        </label>
                      </div>
                      
                      <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {category.description}
                      </p>
                      
                      {category.examples && (
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <strong>Examples:</strong> {category.examples}
                        </p>
                      )}
                      
                      {category.required && (
                        <p className={`text-xs mt-1 font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                          Always Active (Required)
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-end">
                  <button
                    onClick={handleAcceptNecessary}
                    className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Reject All Optional
                  </button>
                  
                  <button
                    onClick={handleSavePreferences}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    Save Preferences
                  </button>
                  
                  <button
                    onClick={handleAcceptAll}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    Accept All
                  </button>
                </div>

                <div className={`mt-4 p-3 rounded-md text-xs ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  <p>
                    For more detailed information about our data processing practices, please review our{' '}
                    <a href="/privacy" className={`underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      Privacy Policy
                    </a>. 
                    You can change your cookie preferences at any time by clicking the cookie settings link in our footer.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop for settings */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowSettings(false)}
        />
      )}
    </>
  );
};

// Function to manually show cookie settings (can be called from footer link)
export const showCookieSettings = () => {
  // Remove existing consent to force the banner to show
  localStorage.removeItem('cookieConsent');
  window.location.reload();
};

export default CookieConsent; 