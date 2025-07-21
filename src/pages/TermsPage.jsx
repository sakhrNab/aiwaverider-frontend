import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const TermsPage = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
            <p className="text-lg">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Content */}
          <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}>
            
            {/* Company Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Service Provider Information</h2>
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p><strong>Legal Name:</strong> Individual Entrepreneur AI Waverider Digital Services</p>
                <p><strong>Trading Name:</strong> AI Waverider</p>
                <p><strong>Legal Form:</strong> Individual Entrepreneur</p>
                <p><strong>Identification Number:</strong> 304779979</p>
                <p><strong>Registration Date:</strong> 17/07/2025</p>
                <p><strong>Registering Authority:</strong> LEPL National Agency of Public Registry</p>
                <p><strong>Legal Address:</strong> Georgia, Tbilisi, Krtsanisi district, Nino and Ilia Nakashidze str., N1, Flat N3, Building N3</p>
                <p><strong>Authorized Person:</strong> Sakhr Al-Absi</p>
                <p><strong>Website:</strong> https://aiwaverider.com</p>
                <p><strong>Email:</strong> support@aiwaverider.com</p>
                <p><strong>Phone:</strong> +995 558950430</p>
              </div>
            </section>

            {/* Acceptance of Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Acceptance of Terms</h2>
              <p>
                By accessing and using the AI Waverider website (aiwaverider.com) and our services, you accept and agree 
                to be bound by these terms and conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            {/* Services Description */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Services Provided</h2>
              <p>AI Waverider provides the following services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Affiliate Marketing Services:</strong> We promote and recommend AI software tools and platforms through affiliate partnerships, earning commissions on qualifying purchases.</li>
                <li><strong>Digital Workflow Sales:</strong> We create and sell custom automation workflows using n8n platform for business process optimization.</li>
                <li><strong>AI Consulting Services:</strong> We provide consulting services for AI integration, implementation strategies, and workflow automation.</li>
                <li><strong>Educational Content:</strong> We offer guides, tutorials, and resources related to AI tools and automation.</li>
              </ul>
            </section>

            {/* Website Registration and User Accounts */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Website Registration and User Accounts</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Users may create accounts to access additional features and services</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must provide accurate and complete information during registration</li>
                <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
                <li>You are responsible for all activities that occur under your account</li>
              </ul>
            </section>

            {/* Information Confidentiality */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Information Confidentiality and Privacy</h2>
              <p>
                We are committed to protecting your privacy and personal information. Our data protection 
                practices are governed by:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Georgian Law on Personal Data Protection</li>
                <li>EU General Data Protection Regulation (GDPR) where applicable</li>
                <li>Our comprehensive Privacy Policy (available at /privacy)</li>
              </ul>
              <p>
                Personal information collected during registration and use of our services is handled 
                in accordance with our Privacy Policy and applicable data protection laws.
              </p>
            </section>

            {/* Payment Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment is due at the time of purchase for digital products and services</li>
                <li>Consulting services may require upfront payment or milestone-based payments as agreed</li>
                <li>We accept major credit cards, PayPal, and other payment methods as displayed</li>
                <li>All prices are in USD unless otherwise specified</li>
                <li>Affiliate commissions are governed by individual affiliate program terms</li>
              </ul>
            </section>

            {/* Affiliate Disclosures */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Affiliate Marketing Disclosures</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We participate in affiliate marketing programs and may earn commissions from qualified purchases</li>
                <li>Affiliate relationships will be clearly disclosed where applicable</li>
                <li>Our recommendations are based on our professional assessment, regardless of affiliate status</li>
                <li>We only promote products and services we believe provide value to our customers</li>
              </ul>
            </section>

            {/* Digital Products and Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Digital Products and Consulting Services</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>n8n workflows are provided as digital downloads with documentation</li>
                <li>Consulting services are delivered via video calls, documentation, and implementation support</li>
                <li>All digital products are for the purchaser's use and may not be resold without permission</li>
                <li>Consulting agreements may include confidentiality and scope limitations</li>
              </ul>
              
              <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-red-900/30' : 'bg-red-100'} border-l-4 border-red-500`}>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-red-200' : 'text-red-800'}`}>Digital Product Usage and Refund Policy</h3>
                <ul className={`list-disc pl-6 space-y-1 text-sm ${darkMode ? 'text-red-100' : 'text-red-700'}`}>
                  <li>Digital workflow files become the purchaser's property upon successful download</li>
                  <li>Once downloaded or accessed, digital products cannot be returned or refunded</li>
                  <li>This policy protects against unauthorized copying and ensures fair compensation</li>
                  <li>Refunds are only available for technical issues or billing errors, not for change of mind</li>
                  <li>Please review our complete Refund Policy at /refund for detailed terms</li>
                </ul>
              </div>
            </section>

            {/* AI Consulting Disclaimers */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. AI Consulting Service Disclaimers</h2>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} border-l-4 border-blue-500`}>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>Important Disclaimers for AI Consulting Services</h3>
                <ul className={`list-disc pl-6 space-y-1 text-sm ${darkMode ? 'text-blue-100' : 'text-blue-700'}`}>
                  <li><strong>AI Tool Recommendations:</strong> Our recommendations are based on our professional assessment and may not be suitable for all use cases</li>
                  <li><strong>Implementation Results:</strong> Success depends on client's technical capabilities and business requirements</li>
                  <li><strong>Third-Party Tools:</strong> We recommend but do not guarantee third-party AI tool performance</li>
                  <li><strong>No Guaranteed Outcomes:</strong> AI implementation results vary based on many factors including data quality, system compatibility, and business processes</li>
                  <li><strong>Technical Requirements:</strong> Clients are responsible for ensuring their systems meet the technical requirements for recommended solutions</li>
                  <li><strong>Ongoing Support:</strong> While we provide implementation guidance, ongoing maintenance and support may require additional services</li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Intellectual Property Rights</h2>
              <p>
                All content, workflows, documentation, and consulting materials provided by AI Waverider 
                are protected by intellectual property laws. Purchased workflows may be used and modified 
                by the purchaser but may not be redistributed commercially without explicit permission.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Limitation of Liability</h2>
              <p>
                AI Waverider provides services and products "as is" and shall not be liable for any direct, 
                indirect, incidental, consequential, or punitive damages arising from your use of our services, 
                except as required by Georgian law. This includes but is not limited to performance issues 
                with third-party tools we recommend through affiliate partnerships.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Governing Law and Jurisdiction</h2>
              <p>
                These terms and conditions are governed by Georgian law. Any disputes arising from these terms 
                or your use of our services shall be resolved in accordance with Georgian legislation. 
                The courts of Georgia shall have exclusive jurisdiction over any such disputes.
              </p>
            </section>

            {/* Modifications */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Users will be notified 
                of significant changes via email or website notification. Continued use of our 
                services after modifications constitutes acceptance of the new terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
              <p>
                For questions about these Terms and Conditions, please contact us at:
              </p>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} mt-4`}>
                <p><strong>Email:</strong> contact@aiwaverider.com</p>
                <p><strong>Address:</strong> Georgia, Tbilisi, Krtsanisi district, Nino and Ilia Nakashidze str., N1, Flat N3, Building N3</p>
                <p><strong>Phone:</strong> +995 558950430</p>
                <p><strong>Business Hours:</strong> Monday-Friday 9:00 AM - 6:00 PM (GMT+4)</p>
              </div>
            </section>

            {/* Georgian Law Compliance */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">15. Georgian E-Commerce Law Compliance</h2>
              <p>
                These terms and conditions are prepared in compliance with the Georgian Law on 
                Electronic Commerce. This website and its services are operated in accordance 
                with Georgian legislation and are registered with the National Agency of Public Registry.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 