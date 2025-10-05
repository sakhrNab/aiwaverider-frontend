// src/components/layout/Footer.jsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { showCookieSettings } from '../common/CookieConsent';

const Footer = () => {
  const { darkMode } = useTheme();

  const handleCookieSettings = () => {
    showCookieSettings();
  };

  return (
    <footer className={`${darkMode ? 'bg-black/80' : 'bg-purple-900/50'} text-white py-8 relative z-20 backdrop-blur-sm`}>
      <div className="container mx-auto px-6 relative z-30">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          
          {/* Company Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-teal-400">AI Waverider</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <p>Individual Entrepreneur AI Waverider Digital Services</p>
              <p>Registration: 304779979</p>
              <p>Georgia, Tbilisi</p>
            </div>
          </div>

          {/* Legal Links */}
          <div className="relative z-40">
            <h3 className="text-lg font-semibold mb-3 text-teal-400">Legal Information</h3>
            <div className="space-y-2 text-sm">
              <a href="/company-info" className="block hover:text-blue-400 transition-colors relative z-50" style={{ zIndex: 50 }}>
                Company Information
              </a>
              <a href="/contact" className="block hover:text-blue-400 transition-colors relative z-50" style={{ zIndex: 50 }}>
                Contact Information
              </a>
              <a href="/terms" className="block hover:text-blue-400 transition-colors relative z-50" style={{ zIndex: 50 }}>
                Terms & Conditions
              </a>
              <a href="/privacy" className="block hover:text-blue-400 transition-colors relative z-50" style={{ zIndex: 50 }}>
                Privacy Policy
              </a>
              <a href="/delivery" className="block hover:text-blue-400 transition-colors relative z-50" style={{ zIndex: 50 }}>
                Delivery Terms
              </a>
              <a href="/refund" className="block hover:text-blue-400 transition-colors relative z-50" style={{ zIndex: 50 }}>
                Refund Policy
              </a>
              <button 
                onClick={handleCookieSettings}
                className="block hover:text-blue-400 transition-colors text-left relative z-50"
                style={{ zIndex: 50 }}
              >
                Cookie Settings
              </button>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="relative z-40">
            <h3 className="text-lg font-semibold mb-3 text-teal-400">Contact & Social</h3>
            <div className="space-y-2 text-sm text-gray-300 mb-4">
              <p>Email: <a href="mailto:support@aiwaverider.com" className="hover:text-blue-400 transition-colors relative z-50" style={{ zIndex: 50 }}>support@aiwaverider.com</a></p>
              <p>Phone: +995 558950430</p>
              <p>Business Hours: Mon-Fri 9:00-18:00 (GMT+4)</p>
            </div>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 relative z-50" style={{ zIndex: 50 }}>
              <a 
                href="https://www.facebook.com/profile.php?id=61576823491758" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xl hover:text-blue-500 transition-colors relative z-50"
                style={{ zIndex: 50 }}
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a 
                href="https://www.instagram.com/ai.waverider/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xl hover:text-pink-500 transition-colors relative z-50"
                style={{ zIndex: 50 }}
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a 
                href="https://www.tiktok.com/@ai.wave.rider" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xl hover:text-gray-300 transition-colors relative z-50"
                style={{ zIndex: 50 }}
                aria-label="TikTok"
              >
                <FontAwesomeIcon icon={faTiktok} />
              </a>
              <a 
                href="https://www.youtube.com/@AIWaverider1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xl hover:text-red-500 transition-colors relative z-50"
                style={{ zIndex: 50 }}
                aria-label="YouTube"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Compliance */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-2 lg:space-y-0">
            <div className="text-sm text-gray-400 text-center lg:text-left">
              <p>&copy; 2025 Individual Entrepreneur AI Waverider Digital Services. All rights reserved.</p>
              <p>Registered in Georgia | Compliant with Georgian E-Commerce Law</p>
            </div>
            <div className="text-xs text-gray-500 text-center lg:text-right">
              <p>Website: aiwaverider.com | Registration: 304779979</p>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
