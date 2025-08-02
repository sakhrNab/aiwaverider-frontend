import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaEnvelope, FaPhone, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const ContactPage = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Information</h1>
            <p className="text-lg">Business contact details and working hours</p>
          </div>

          {/* Contact Information */}
          <div className={`p-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            
            <h2 className="text-2xl font-semibold mb-6">Contact Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Primary Contact */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FaEnvelope className="mr-2 text-blue-500" />
                  Email Contact
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600">General Inquiries:</span>
                    <p>
                      <a href="mailto:support@aiwaverider.com" className={`text-lg ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>
                        support@aiwaverider.com
                      </a>
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Business & Partnerships:</span>
                    <p>
                      <a href="mailto:support@aiwaverider.com" className={`text-lg ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>
                        support@aiwaverider.com
                      </a>
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Technical Support:</span>
                    <p>
                      <a href="mailto:support@aiwaverider.com" className={`text-lg ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>
                        support@aiwaverider.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone Contact */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FaPhone className="mr-2 text-green-500" />
                  Phone Contact
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600">Business Phone:</span>
                    <p>
                      <a href="tel:+995 558950430" className={`text-lg ${darkMode ? 'text-green-400' : 'text-green-600'} hover:underline`}>
                        +995 558950430
                      </a>
                    </p>
                    <p className="text-sm text-gray-500">Available during business hours</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Working Hours */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaClock className="mr-2 text-yellow-500" />
                Working Hours & Availability
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Business Hours</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                    <p><strong>Saturday:</strong> 10:00 AM - 2:00 PM</p>
                    <p><strong>Sunday:</strong> Closed</p>
                    <p className="text-xs text-gray-500 mt-2">Time Zone: GMT+4 (Georgia Standard Time)</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Response Times</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Email:</strong> Within 24 hours</p>
                    <p><strong>Phone:</strong> During business hours only</p>
                    <p><strong>Technical Support:</strong> Within 48 hours</p>
                    <p className="text-xs text-gray-500 mt-2">Closed on Georgian public holidays</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Address */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-red-500" />
                Business Address
              </h3>
              <div>
                <span className="font-medium text-gray-600">Registered Address:</span>
                <p className="text-lg">
                  Individual Entrepreneur AI Waverider Digital Services<br />
                  Georgia, Tbilisi, Krtsanisi district<br />
                  Nino and Ilia Nakashidze str., N1, Flat N3, Building N3<br />
                  Tbilisi, Georgia
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Website:</strong> <a href="https://aiwaverider.com" className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>https://aiwaverider.com</a></p>
                <p><strong>Business Registration:</strong> 304779979</p>
                <p><strong>Services:</strong> AI Consulting, Digital Workflows (n8n), Affiliate Marketing</p>
                <p><strong>Email:</strong> support@aiwaverider.com</p>
                <p><strong>Phone:</strong> +995 558950430</p>
              </div>
            </div>

            {/* Legal Note */}
            <div className={`mt-8 p-4 rounded-md ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border-l-4 border-blue-500`}>
              <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                <strong>Note:</strong> This contact information is provided in compliance with Georgian Law on Electronic Commerce. 
                All communications will be handled professionally and in accordance with our Privacy Policy.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 