import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const RefundPage = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
            <p className="text-lg">Refund terms and conditions</p>
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
                <p><strong>Refund Contact:</strong> support@aiwaverider.com</p>
                <p><strong>Phone:</strong> +995 558950430</p>
                <p><strong>Working Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM (GMT+4)</p>
              </div>
            </section>

            {/* Overview */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Refund Policy Overview</h2>
              <p>
                This refund policy outlines the terms and conditions under which refunds may be requested 
                and processed for digital products and consulting services offered by AI Waverider.
              </p>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border-l-4 border-blue-500 mt-4`}>
                <p><strong>Important:</strong> Due to the digital nature of our products and personalized consulting services, 
                refunds are subject to specific conditions outlined below.</p>
              </div>
            </section>

            {/* Refund Eligibility */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Refund Eligibility</h2>
              
              <h3 className="text-xl font-semibold mb-3">3.1 Eligible for Refund</h3>
              
              <h4 className="text-lg font-semibold mb-2">Digital Products (n8n Workflows)</h4>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Technical Issues Only:</strong> Product files are corrupted, incomplete, or cannot be downloaded</li>
                <li><strong>Download Failures:</strong> Download links do not work within 48 hours of purchase</li>
                <li><strong>Misrepresentation:</strong> Product does not match the described specifications</li>
                <li><strong>Duplicate Charges:</strong> Multiple charges for the same product</li>
                <li><strong>Billing Errors:</strong> Incorrect pricing or unauthorized charges</li>
              </ul>

              <h4 className="text-lg font-semibold mb-2">Consulting Services</h4>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Service not delivered as promised in the agreement</li>
                <li>Scheduled sessions cancelled by AI Waverider</li>
                <li>Service quality significantly below agreed standards</li>
                <li>Failure to deliver within agreed timeframes (without client delay)</li>
                <li>Billing errors or unauthorized charges</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">3.2 NOT Eligible for Refund</h3>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900/30' : 'bg-red-100'} border-l-4 border-red-500 mb-4`}>
                <p className={`font-semibold ${darkMode ? 'text-red-200' : 'text-red-800'}`}>Important Notice for Digital Workflows:</p>
                <p className={`text-sm ${darkMode ? 'text-red-100' : 'text-red-700'} mt-2`}>
                  Due to the digital nature of n8n workflows, <strong>NO REFUNDS</strong> are provided once the file has been 
                  successfully downloaded or accessed. This includes:
                </p>
              </div>
              
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Successful Downloads:</strong> Any workflow file that has been downloaded or accessed</li>
                <li><strong>Change of Mind:</strong> Customer decides they don't want the workflow after purchase</li>
                <li><strong>Technical Inability:</strong> Customer lacks skills to implement the workflow</li>
                <li><strong>Compatibility Issues:</strong> Customer's system cannot run the workflow (unless specified as compatible)</li>
                <li><strong>Workflow Functionality:</strong> Workflow works but doesn't meet customer's specific needs</li>
                <li><strong>Custom Workflows:</strong> Any custom-developed workflows specifically created for client requirements</li>
                <li><strong>Time-based Refunds:</strong> Products purchased more than 7 days ago (even if not downloaded)</li>
              </ul>
            </section>

            {/* Refund Timeframes */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Refund Request Timeframes</h2>
              
              <div className={`overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4`}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left p-3">Product/Service Type</th>
                      <th className="text-left p-3">Request Deadline</th>
                      <th className="text-left p-3">Processing Time</th>
                      <th className="text-left p-3">Restrictions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="p-3">n8n Workflows (Standard)</td>
                      <td className="p-3">7 days from purchase</td>
                      <td className="p-3">3-5 business days</td>
                      <td className="p-3 text-red-600">No refund if downloaded</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-3">Custom Workflows</td>
                      <td className="p-3">3 days from delivery</td>
                      <td className="p-3">5-7 business days</td>
                      <td className="p-3 text-red-600">No refund if accessed</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-3">Consulting Services (Single Session)</td>
                      <td className="p-3">48 hours after session</td>
                      <td className="p-3">3-5 business days</td>
                      <td className="p-3">Standard terms apply</td>
                    </tr>
                    <tr>
                      <td className="p-3">Consulting Packages</td>
                      <td className="p-3">Within active service period</td>
                      <td className="p-3">7-10 business days</td>
                      <td className="p-3">Prorated refunds only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'} border-l-4 border-yellow-500`}>
                <p className={`text-sm ${darkMode ? 'text-yellow-100' : 'text-yellow-800'}`}>
                  <strong>Digital Product Policy:</strong> Once a digital workflow file is downloaded or accessed, 
                  it cannot be "returned" and is considered used. This policy protects against unauthorized copying 
                  and ensures fair compensation for our intellectual property.
                </p>
              </div>
            </section>

            {/* Refund Process */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. How to Request a Refund</h2>
              
              <h3 className="text-xl font-semibold mb-3">5.1 Required Information</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Order ID or transaction reference number</li>
                <li>Email address used for purchase</li>
                <li>Product name or service description</li>
                <li>Purchase date and amount paid</li>
                <li>Detailed reason for refund request</li>
                <li>Supporting evidence (screenshots, error messages, etc.)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">5.2 Contact Information</h3>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border-l-4 border-blue-500`}>
                <p><strong>Email:</strong> support@aiwaverider.com</p>
                <p><strong>Subject Line:</strong> Refund Request - [Order ID]</p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
                <p><strong>Phone:</strong> +995 558950430 (during business hours)</p>
              </div>

              <h3 className="text-xl font-semibold mb-3">5.3 Review Process</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Initial review and acknowledgment within 24 hours</li>
                <li>Investigation of the refund request (2-3 business days)</li>
                <li>Decision notification via email</li>
                <li>If approved, refund processing begins immediately</li>
              </ol>
            </section>

            {/* Refund Methods */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Refund Methods and Processing</h2>
              
              <h3 className="text-xl font-semibold mb-3">6.1 Processing Times</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Credit/Debit Cards:</strong> 5-7 business days</li>
                <li><strong>PayPal:</strong> 1-3 business days</li>
                <li><strong>Bank Transfer:</strong> 3-5 business days</li>
                <li><strong>International Payments:</strong> 7-10 business days</li>
              </ul>

              <p className="mt-4">
                <strong>Note:</strong> Refunds are processed to the original payment method used for purchase. 
                Processing times depend on the payment provider and banking institutions.
              </p>
            </section>

            {/* Partial Refunds */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Partial Refunds</h2>
              <p>Partial refunds may be offered in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Consulting Packages:</strong> Prorated refunds for unused sessions</li>
                <li><strong>Custom Development:</strong> Refunds based on work completed vs. agreed scope</li>
                <li><strong>Multiple Product Orders:</strong> Refunds for specific items within a bundle</li>
                <li><strong>Service Interruptions:</strong> Compensation for significant delays or disruptions</li>
              </ul>
            </section>

            {/* Special Conditions */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Special Refund Conditions</h2>
              
              <h3 className="text-xl font-semibold mb-3">8.1 Custom Workflow Development</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>No refund after client approval of final deliverable</li>
                <li>50% refund if project cancelled before development begins</li>
                <li>Milestone-based refunds for projects cancelled mid-development</li>
                <li>No refund for changes in client requirements after project start</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">8.2 Consulting Services</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full refund if cancelled 24 hours before scheduled session</li>
                <li>No refund for client no-shows without prior notice</li>
                <li>Rescheduling available without penalty (subject to availability)</li>
                <li>Satisfaction guarantee with follow-up session if needed</li>
              </ul>
            </section>

            {/* Dispute Resolution */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Dispute Resolution</h2>
              <p>If you disagree with our refund decision:</p>
              <ol className="list-decimal pl-6 space-y-2 mt-4">
                <li><strong>Appeal Process:</strong> Request review by senior management</li>
                <li><strong>Documentation Review:</strong> Provide additional evidence if available</li>
                <li><strong>Final Decision:</strong> Communicated within 5 business days</li>
                <li><strong>Legal Resolution:</strong> Subject to Georgian law and jurisdiction</li>
              </ol>
            </section>

            {/* Consumer Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Consumer Rights</h2>
              <p>
                Under Georgian consumer protection laws, you have rights that may apply beyond this refund policy. 
                These include rights to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Receive services as described</li>
                <li>Fair treatment in business transactions</li>
                <li>File complaints with relevant consumer protection authorities</li>
                <li>Seek legal remedy for unfair business practices</li>
              </ul>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
              <p>
                For refund requests or questions about this policy, contact us:
              </p>
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} mt-4`}>
                <p><strong>Email:</strong> support@aiwaverider.com</p>
                <p><strong>Phone:</strong> +995 558950430</p>
                <p><strong>Address:</strong> Georgia, Tbilisi, Krtsanisi district, Nino and Ilia Nakashidze str., N1, Flat N3, Building N3</p>
                <p><strong>Business Hours:</strong> Monday-Friday 9:00 AM - 6:00 PM (GMT+4)</p>
              </div>
            </section>

            {/* Policy Updates */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Policy Updates</h2>
              <p>
                This refund policy may be updated to reflect changes in our services or legal requirements. 
                Significant changes will be communicated via email and posted on our website. 
                The policy effective at the time of purchase governs refund requests.
              </p>
            </section>

            {/* Georgian Law Compliance */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Georgian Law Compliance</h2>
              <p>
                This refund policy complies with Georgian Law on Electronic Commerce and consumer protection regulations. 
                All refund processes are designed to meet Georgian legal requirements for digital commerce and service provision.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPage; 