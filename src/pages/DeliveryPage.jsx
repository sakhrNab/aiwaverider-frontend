import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const DeliveryPage = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Delivery Terms</h1>
            <p className="text-lg">Service delivery information and terms</p>
          </div>

          {/* Content */}
          <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}>
            
            {/* Service Provider Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Service Provider Information</h2>
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p><strong>Legal Name:</strong> Individual Entrepreneur AI Waverider Digital Services</p>
                <p><strong>Trading Name:</strong> AI Waverider</p>
                <p><strong>Identification Number:</strong> 304779979</p>
                <p><strong>Address:</strong> Georgia, Tbilisi, Krtsanisi district, Nino and Ilia Nakashidze str., N1, Flat N3, Building N3</p>
                <p><strong>Email:</strong> support@aiwaverider.com</p>
                <p><strong>Support:</strong> support@aiwaverider.com</p>
                <p><strong>Phone:</strong> +995 558950430</p>
                <p><strong>Working Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM (GMT+4)</p>
              </div>
            </section>

            {/* Types of Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Services and Products Delivered</h2>
              
              <h3 className="text-xl font-semibold mb-3">2.1 Digital Products</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>n8n Automation Workflows:</strong> Custom-built digital workflows for business process automation</li>
                <li><strong>Documentation:</strong> Setup guides, configuration instructions, and user manuals</li>
                <li><strong>Educational Resources:</strong> AI tool guides and implementation tutorials</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.2 Consulting Services</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>AI Integration Consulting:</strong> Strategic planning for AI tool implementation</li>
                <li><strong>Workflow Implementation:</strong> Hands-on setup and customization services</li>
                <li><strong>Training Sessions:</strong> Live instruction on AI tools and automation workflows</li>
                <li><strong>Ongoing Support:</strong> Technical assistance and troubleshooting</li>
              </ul>
            </section>

            {/* Delivery Methods and Timeframes */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Delivery Methods and Timeframes</h2>
              
              <h3 className="text-xl font-semibold mb-3">3.1 Digital Product Delivery</h3>
              <div className={`overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4 mb-4`}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left p-3">Product Type</th>
                      <th className="text-left p-3">Delivery Method</th>
                      <th className="text-left p-3">Delivery Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="p-3">n8n Workflows (Standard)</td>
                      <td className="p-3">Email + Download Link</td>
                      <td className="p-3">Within 2-4 hours</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-3">Custom Workflows</td>
                      <td className="p-3">Email Delivery</td>
                      <td className="p-3">3-7 business days</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-3">Documentation</td>
                      <td className="p-3">Email + Cloud Storage</td>
                      <td className="p-3">Same as workflow delivery</td>
                    </tr>
                    <tr>
                      <td className="p-3">Educational Materials</td>
                      <td className="p-3">Email + Download</td>
                      <td className="p-3">Immediate to 24 hours</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold mb-3">3.2 Consulting Service Delivery</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Initial Consultation:</strong> Scheduled within 24-48 hours of booking</li>
                <li><strong>Implementation Services:</strong> Begin within 3-5 business days</li>
                <li><strong>Training Sessions:</strong> Scheduled based on mutual availability</li>
                <li><strong>Support Responses:</strong> Within 24-48 hours during business hours</li>
              </ul>
            </section>

            {/* Working Hours and Support */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Working Hours and Support Availability</h2>
              
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Business Hours</h3>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM (GMT+4)</li>
                      <li><strong>Saturday:</strong> 10:00 AM - 2:00 PM (GMT+4)</li>
                      <li><strong>Sunday:</strong> Closed</li>
                      <li><strong>Time Zone:</strong> Georgia Standard Time (GMT+4)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Support Response Times</h3>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Email Support:</strong> Within 24 hours</li>
                      <li><strong>Technical Issues:</strong> Within 48 hours</li>
                      <li><strong>Phone Support:</strong> During business hours only</li>
                      <li><strong>Emergency Support:</strong> Available for consulting clients</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Delivery Confirmation */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Delivery Confirmation</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All digital products are delivered with email confirmation</li>
                <li>Download links are provided with expiration dates (typically 30 days)</li>
                <li>Consulting appointments are confirmed via email with calendar invitations</li>
                <li>Delivery receipts include transaction IDs for reference</li>
                <li>Order status can be tracked via email communication</li>
              </ul>
            </section>

            {/* Failed Delivery */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Failed Delivery and Resolution</h2>
              
              <h3 className="text-xl font-semibold mb-3">6.1 Common Issues</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Email delivery blocked by spam filters</li>
                <li>Incorrect email address provided</li>
                <li>Large file size causing delivery failures</li>
                <li>Technical issues with cloud storage links</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">6.2 Resolution Process</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Immediate re-delivery attempts within 2 hours</li>
                <li>Alternative delivery methods (cloud storage, direct transfer)</li>
                <li>Manual delivery via customer support within 24 hours</li>
                <li>Full refund if delivery cannot be completed within 48 hours</li>
              </ul>
            </section>

            {/* Quality Assurance */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Quality Assurance</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All workflows are tested before delivery</li>
                <li>Comprehensive documentation included with all products</li>
                <li>30-day support period for technical questions</li>
                <li>Free replacement if files are corrupted or incomplete</li>
                <li>Updates and improvements provided for purchased workflows</li>
              </ul>
            </section>

            {/* Limitations */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Service Limitations and Dependencies</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delivery times may be affected by internet connectivity issues</li>
                <li>Email service provider outages may cause delays</li>
                <li>Custom workflow delivery depends on complexity and requirements</li>
                <li>Consulting availability is subject to scheduling constraints</li>
                <li>Third-party platform dependencies (n8n, cloud services) may affect delivery</li>
              </ul>
            </section>

            {/* Contact for Delivery Issues */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Contact for Delivery Issues</h2>
              <p>
                If you experience any issues with delivery, please contact us immediately:
              </p>
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} mt-4`}>
                <p><strong>Delivery Support:</strong> support@aiwaverider.com</p>
                <p><strong>Phone:</strong> +995 558950430</p>
                <p><strong>Business Hours:</strong> Monday-Friday 9:00 AM - 6:00 PM (GMT+4)</p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
              </div>
            </section>

            {/* Georgian Law Compliance */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Compliance</h2>
              <p>
                These delivery terms comply with Georgian Law on Electronic Commerce and consumer protection regulations. 
                All delivery processes meet Georgian legal requirements for digital service provision.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage; 