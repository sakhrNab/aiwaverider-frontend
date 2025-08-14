import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const PrivacyPage = () => {
    const { darkMode } = useTheme();

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
                                Privacy Policy
                            </span>
                        </h1>
                        <p className="text-lg">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    {/* Content */}
                    <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}>

                        {/* Data Controller Information */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">1. Data Controller Information</h2>
                            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <p><strong>Company:</strong> Individual Entrepreneur AI Waverider Digital Services</p>
                                <p><strong>Registration Number:</strong> 304779979</p>
                                <p><strong>Address:</strong> Georgia, Tbilisi, Krtsanisi district, Nino and Ilia Nakashidze str., N1, Flat N3, Building N3</p>
                                <p><strong>Email:</strong> support@aiwaverider.com</p>
                                <p><strong>Phone:</strong> +995 558950430</p>
                                <p><strong>Data Protection Officer:</strong> support@aiwaverider.com</p>
                            </div>
                        </section>

                        {/* Introduction */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">2. Introduction</h2>
                            <p>
                                Individual Entrepreneur AI Waverider Digital Services ("we," "our," or "us") respects your privacy and is committed to protecting
                                your personal data. This privacy policy explains how we collect, use, and protect your information
                                when you visit our website aiwaverider.com and use our services.
                            </p>
                            <p>
                                This policy complies with the Georgian Law on Personal Data Protection and the EU General Data
                                Protection Regulation (GDPR) where applicable.
                            </p>
                        </section>

                        {/* Information We Collect */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">3. Information We Collect</h2>

                            <h3 className="text-xl font-semibold mb-3">3.1 Personal Information</h3>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Name and contact information (email address, phone number)</li>
                                <li>Account credentials (username, encrypted password)</li>
                                <li>Payment information (processed securely through third-party payment processors)</li>
                                <li>Profile information and preferences</li>
                                <li>Communication history with our support team</li>
                            </ul>

                            <h3 className="text-xl font-semibold mb-3">3.2 Technical Information</h3>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>IP address and geolocation data</li>
                                <li>Browser type and version</li>
                                <li>Device information and operating system</li>
                                <li>Usage patterns and analytics data</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>

                            <h3 className="text-xl font-semibold mb-3">3.3 Usage Information</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Pages visited and time spent on our website</li>
                                <li>Features used and interactions with our content</li>
                                <li>Download and purchase history</li>
                                <li>Search queries and preferences</li>
                            </ul>
                        </section>

                        {/* Legal Basis for Processing */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">4. Legal Basis for Processing</h2>
                            <p>We process your personal data based on the following legal grounds:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Consent:</strong> When you explicitly agree to our processing activities</li>
                                <li><strong>Contract Performance:</strong> To provide services you've purchased</li>
                                <li><strong>Legitimate Interest:</strong> For business operations, security, and improvement</li>
                                <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
                            </ul>
                        </section>

                        {/* How We Use Your Information */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">5. How We Use Your Information</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide and maintain our services</li>
                                <li>Process payments and deliver digital products</li>
                                <li>Communicate with you about your account and our services</li>
                                <li>Provide customer support and respond to inquiries</li>
                                <li>Improve and personalize your experience</li>
                                <li>Send marketing communications (with your consent)</li>
                                <li>Comply with legal obligations and prevent fraud</li>
                                <li>Analyze usage patterns to improve our services</li>
                            </ul>
                        </section>

                        {/* Information Sharing */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">6. Information Sharing and Disclosure</h2>
                            <p>We do not sell your personal information. We may share your data with:</p>

                            <h3 className="text-xl font-semibold mb-3">6.1 Service Providers</h3>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Payment processor (PayPal)</li>
                                <li>Email service providers</li>
                                <li>Analytics providers (Google Analytics)</li>
                                <li>Cloud hosting providers</li>
                                <li>Customer support platforms</li>
                            </ul>

                            <h3 className="text-xl font-semibold mb-3">6.2 Legal Requirements</h3>
                            <p>We may disclose your information when required by law or to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Comply with legal processes or government requests</li>
                                <li>Protect our rights, property, or safety</li>
                                <li>Prevent fraud or security threats</li>
                                <li>Investigate potential violations of our terms</li>
                            </ul>
                        </section>

                        {/* Data Security */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
                            <p>We implement appropriate technical and organizational measures to protect your data:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>SSL/TLS encryption for data transmission</li>
                                <li>Secure data storage with encryption at rest</li>
                                <li>Regular security audits and vulnerability assessments</li>
                                <li>Access controls and staff training</li>
                                <li>Incident response procedures</li>
                            </ul>
                        </section>

                        {/* Data Retention */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
                            <p>We retain your personal data for as long as necessary to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide our services to you</li>
                                <li>Comply with legal obligations</li>
                                <li>Resolve disputes and enforce agreements</li>
                                <li>Improve our services and user experience</li>
                            </ul>
                            <p>
                                Generally, we retain account data for 7 years after account closure,
                                and anonymized analytics data may be retained longer for business intelligence purposes.
                            </p>
                        </section>

                        {/* Your Rights */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">9. Your Privacy Rights</h2>
                            <p>Under applicable data protection laws, you have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Access:</strong> Request a copy of your personal data</li>
                                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                                <li><strong>Restriction:</strong> Limit how we process your data</li>
                                <li><strong>Objection:</strong> Object to certain types of processing</li>
                                <li><strong>Withdraw Consent:</strong> Withdraw consent for consent-based processing</li>
                            </ul>
                            <p>To exercise these rights, contact us at: support@aiwaverider.com</p>
                        </section>

                        {/* Cookies */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">10. Cookies and Tracking Technologies</h2>
                            <p>We use cookies and similar technologies to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Remember your preferences and settings</li>
                                <li>Analyze website traffic and usage patterns</li>
                                <li>Provide personalized content and advertising</li>
                                <li>Ensure website security and prevent fraud</li>
                            </ul>
                            <p>
                                You can control cookie settings through your browser preferences. However,
                                disabling certain cookies may limit website functionality.
                            </p>
                        </section>

                        {/* International Transfers */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">11. International Data Transfers</h2>
                            <p>
                                Your data may be transferred to and processed in countries outside Georgia.
                                When we transfer data internationally, we ensure adequate protection through:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Standard Contractual Clauses approved by the European Commission</li>
                                <li>Privacy Shield certification (where applicable)</li>
                                <li>Adequacy decisions by relevant authorities</li>
                                <li>Other legally recognized transfer mechanisms</li>
                            </ul>
                        </section>

                        {/* Children's Privacy */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">12. Children's Privacy</h2>
                            <p>
                                Our services are not intended for children under 16 years of age. We do not
                                knowingly collect personal information from children under 16. If we become
                                aware that a child under 16 has provided us with personal data, we will take
                                steps to delete such information.
                            </p>
                        </section>

                        {/* Third-Party Links */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">13. Third-Party Links and Services</h2>
                            <p>
                                Our website may contain links to third-party websites and services. We are not
                                responsible for the privacy practices of these external sites. We encourage you
                                to review their privacy policies before providing any personal information.
                            </p>
                        </section>

                        {/* Updates to Privacy Policy */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">14. Updates to This Privacy Policy</h2>
                            <p>
                                We may update this privacy policy from time to time. We will notify you of any
                                significant changes by email or through a prominent notice on our website.
                                Your continued use of our services after such modifications constitutes acceptance
                                of the updated policy.
                            </p>
                        </section>

                        {/* Contact Information */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">15. Contact Us</h2>
                            <p>
                                If you have any questions about this privacy policy or our data practices,
                                please contact us:
                            </p>
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} mt-4`}>
                                <p><strong>Email:</strong> support@aiwaverider.com</p>
                                <p><strong>Data Protection Officer:</strong> support@aiwaverider.com</p>
                                <p><strong>Address:</strong> Georgia, Tbilisi, Krtsanisi district, Nino and Ilia Nakashidze str., N1, Flat N3, Building N3</p>
                                <p><strong>Phone:</strong> +995 558950430</p>
                            </div>
                        </section>

                        {/* Supervisory Authority */}
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">16. Supervisory Authority</h2>
                            <p>
                                You have the right to lodge a complaint with the relevant supervisory authority:
                            </p>
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} mt-4`}>
                                <p><strong>Georgia:</strong> Personal Data Protection Inspector (inspector.ge)</p>
                                <p><strong>EU residents:</strong> Your local Data Protection Authority</p>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage; 