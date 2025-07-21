import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const CompanyInfoPage = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Company Information</h1>
            <p className="text-lg">Legal business information as required by Georgian E-Commerce law</p>
          </div>

          {/* Legal Business Information */}
          <div className={`p-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            
            <h2 className="text-2xl font-semibold mb-6">Legal Entity Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">Legal Name:</span>
                  <p className="text-lg">Individual Entrepreneur AI Waverider Digital Services</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-600">Trading Name:</span>
                  <p className="text-lg">AI Waverider</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">Legal Form:</span>
                  <p className="text-lg">Individual Entrepreneur</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-600">Identification Number:</span>
                  <p className="text-lg font-mono">304779979</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">Registration Date:</span>
                  <p className="text-lg">17/07/2025</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-600">Registering Authority:</span>
                  <p className="text-lg">LEPL National Agency of Public Registry</p>
                </div>
              </div>

              <div>
                <span className="font-medium text-gray-600">Legal Address:</span>
                <p className="text-lg">
                  Georgia, Tbilisi, Krtsanisi district,<br />
                  Nino and Ilia Nakashidze str., N1, Flat N3, Building N3
                </p>
              </div>

              <div>
                <span className="font-medium text-gray-600">Authorized Person:</span>
                <p className="text-lg">Sakhr Al-Absi</p>
              </div>

              <div>
                <span className="font-medium text-gray-600">Country of Registration:</span>
                <p className="text-lg">Georgia</p>
              </div>

              <div>
                <span className="font-medium text-gray-600">Website:</span>
                <p className="text-lg">
                  <a href="https://aiwaverider.com" className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>
                    https://aiwaverider.com
                  </a>
                </p>
              </div>

            </div>

            {/* Business Activities */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <h3 className="text-xl font-semibold mb-4">Business Activities</h3>
              <ul className="space-y-2">
                <li>• Affiliate marketing for AI software tools and services</li>
                <li>• Sale of digital automation workflows (n8n)</li>
                <li>• AI consulting and implementation services</li>
                <li>• Digital workflow integration consulting</li>
              </ul>
            </div>

            {/* Compliance Statement */}
            <div className={`mt-8 p-4 rounded-md ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border-l-4 border-blue-500`}>
              <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                <strong>Compliance:</strong> This business operates in full compliance with Georgian Law on Electronic Commerce and is registered with the National Agency of Public Registry of Georgia.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoPage; 