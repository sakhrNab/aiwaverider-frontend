import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/marketing-pages.css';
import { getTodayIsoDate, printCurrentPageAsPdf } from '../utils/pdf';
import QuoteWizard from '../components/marketing/QuoteWizard';
import { useCountUp } from '../hooks/useCountUp';

import {
    FaDownload,
    FaShieldAlt,
    FaNetworkWired,
    FaFileAlt,
    FaArrowRight
} from 'react-icons/fa';

// Add this component before BusinessMediaKitPage
const AnimatedStat = ({ number, label, duration = 2000, shouldAnimate }) => {
    const numericValue = parseInt(number.replace(/[^0-9]/g, ''));
    const suffix = number.replace(/[0-9]/g, '');
    const count = useCountUp(numericValue, duration, shouldAnimate);

    return (
        <div className="mk-stat-card">
            <span className="mk-stat-number">
                {shouldAnimate ? count : numericValue}{suffix}
            </span>
            <span className="mk-stat-label">{label}</span>
        </div>
    );
};

const BusinessMediaKitPage = () => {
    const { darkMode } = useTheme();
    const today = getTodayIsoDate();
    const [currentWorkflow, setCurrentWorkflow] = useState(0);
    const [agentStats, setAgentStats] = useState({
        totalAgents: 0,
        totalCategories: 0,
        activeUsers: 0
    });
    const [shouldAnimateStats, setShouldAnimateStats] = useState(false);
    const statsRef = useRef(null);


    // Add Intersection Observer for scroll trigger
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !shouldAnimateStats) {
                        setShouldAnimateStats(true);
                    }
                });
            },
            { threshold: 0.5 } // Trigger when 30% of the element is visible
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => {
            if (statsRef.current) {
                observer.unobserve(statsRef.current);
            }
        };
    }, [shouldAnimateStats]);

    // Fetch agent statistics
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { getAgentsCount } = await import('../api/marketplace/agentApi');
                const totalCount = await getAgentsCount();
                setAgentStats({
                    totalAgents: totalCount || 150,
                    totalCategories: 40,
                    activeUsers: 0
                });
            } catch (error) {
                setAgentStats({
                    totalAgents: 150,
                    totalCategories: 40,
                    activeUsers: 0
                });
            }
        };
        fetchStats();
    }, []);

    const handleDownload = () => {
        printCurrentPageAsPdf(`business-media-kit_${today}`);
    };

    // Top performing workflows showcase
    const topWorkflows = [
        {
            title: "Email Outreach Automation",
            category: "Marketing",
            description: "Automated lead nurturing sequence that sends personalized emails based on user behavior",
            hoursSaved: "15-20",
            downloads: "Available",
            rating: "New",
            integrations: ["Gmail", "CRM", "Zapier"],
            image: null
        },
        {
            title: "Content Repurposing Pipeline",
            category: "Content Creation",
            description: "Transform one piece of content into multiple formats (blog, social, video scripts)",
            hoursSaved: "10-12",
            downloads: "Available",
            rating: "New",
            integrations: ["Notion", "WordPress", "Social Media"],
            image: null
        },
        {
            title: "Customer Support Automation",
            category: "Support",
            description: "Automated ticket routing, response templates, and escalation workflows",
            hoursSaved: "25-30",
            downloads: "Available",
            rating: "New",
            integrations: ["Slack", "Email", "CRM"],
            image: null
        },
        {
            title: "Lead Generation & Qualification",
            category: "Sales",
            description: "Automated lead capture, scoring, and assignment to sales team",
            hoursSaved: "18-22",
            downloads: "Available",
            rating: "New",
            integrations: ["Forms", "CRM", "Slack"],
            image: null
        },
        {
            title: "AI Video Creator & Automation Suite",
            category: "Content Creation",
            description: "End-to-end video creation automation: AI-generated scripts, Sora 2/Veo 3.1 video generation, thumbnail creation, descriptions, and auto-posting while you sleep",
            hoursSaved: "20-25",
            downloads: "Featured",
            rating: "New",
            integrations: ["Sora 2", "Veo 3.1", "TikTok", "Instagram", "YouTube"],
            image: null
        },
        {
            title: "Social Media Automation & Engagement",
            category: "Social Media",
            description: "Complete social media automation: thumbnail generation, description creation, scheduled posting across platforms, and comment-to-DM workflows for lead capture",
            hoursSaved: "12-15",
            downloads: "Featured",
            rating: "New",
            integrations: ["Twitter", "LinkedIn", "Facebook", "TikTok", "Instagram"],
            image: null
        },
        {
            title: "Invoice & Payment Processing",
            category: "Finance",
            description: "Automated invoice generation, payment reminders, and reconciliation",
            hoursSaved: "12-15",
            downloads: "Available",
            rating: "New",
            integrations: ["Stripe", "QuickBooks", "Email"],
            image: null
        }
    ];

    // Marketplace Statistics
    const marketplaceStats = [
        { number: "5600+", label: "N8N Workflows Available", duration: 2500 },
        { number: "200+", label: "Integrations Supported", duration: 2500 },
        { number: "40+", label: "Categories & Use Cases", duration: 2500 },
        { number: "24/7", label: "Automated Execution", duration: 0 }, // No animation
        { number: "< 24h", label: "Custom Setup Time", duration: 0 }, // No animation
        { number: "Full Stack", label: "N8N Experts", duration: 0 } // No animation
    ];

    // Performance Metrics
    const performanceMetrics = [
        { title: "Time Savings Potential", value: "15-30 hrs", subtitle: "Per workflow per week (estimated)" },
        { title: "Setup Speed", value: "< 24h", subtitle: "Ready-to-use workflows" },
        { title: "Custom Development", value: "1-4 weeks", subtitle: "Tailored solutions" },
        { title: "Support Response", value: "< 4h", subtitle: "Technical assistance" },
        { title: "Integration Support", value: "200+", subtitle: "Tools & platforms" },
        { title: "Guarantee Period", value: "30-90 days", subtitle: "Money-back guarantee" }
    ];

    // Business Service Packages
    const businessPackages = [
        {
            name: "Starter Package — Ready-to-Use Workflows",
            subtitle: "Quick Implementation",
            price: "€1,497",
            intro: "€997 (Intro)",
            description: "Get 5 pre-built N8N AI Agentic workflows customized for your business processes. Perfect for teams starting their automation journey.",
            deliverables: [
                "5 ready-to-use N8N AI Agentic workflows",
                "Basic customization (branding, variables)",
                "Integration setup assistance (up to 3 platforms)",
                "Documentation & user guides",
                "2 weeks of email support",
                "30-day money-back guarantee"
            ],
            bestFor: "Small teams (5-15 employees) looking to automate repetitive tasks",
            bonus: "Additional workflow at 50% off"
        },
        {
            name: "Professional Package — Custom Workflows",
            subtitle: "Built for Your Business",
            price: "€4,997",
            intro: "€3,497 (Intro)",
            description: "Custom N8N AI Agentic workflows designed specifically for your business processes, integrations, and workflows. Includes full implementation support. Perfect for content creators and social media teams needing automated video creation, posting, and engagement workflows.",
            deliverables: [
                "5-10 custom N8N AI Agentic workflows (tailored to your needs)",
                "Deep integration with your existing tools",
                "Custom logic and conditional workflows",
                "Social media automation (AI video scripts, Sora 2/Veo 3.1 integration, auto-posting)",
                "Comment-to-DM workflows and lead capture automation",
                "Full documentation & training sessions",
                "1 month of priority support",
                "Workflow optimization & performance tuning",
                "60-day money-back guarantee"
            ],
            bestFor: "Growing businesses (15-50 employees) and content creators needing tailored automation, especially social media & video creation workflows",
            bonus: "3 months of maintenance included"
        },
        {
            name: "Enterprise Package — Full Automation Suite",
            subtitle: "Complete Digital Transformation",
            price: "€12,997",
            intro: "€9,997 (Intro)",
            description: "Complete automation infrastructure with unlimited workflows, dedicated support, and ongoing optimization for enterprise operations. Includes enterprise-grade social media automation with AI video generation (Sora 2, Veo 3.1), content scheduling, and engagement workflows.",
            deliverables: [
                "Unlimited custom workflows",
                "Dedicated automation specialist",
                "Priority implementation (1-2 weeks)",
                "Custom integrations & API connections",
                "Enterprise social media automation suite (video creation, posting, engagement)",
                "24/7 workflow execution and monitoring",
                "Training for your team (up to 10 people)",
                "6 months of priority support & maintenance",
                "Monthly optimization reviews",
                "90-day money-back guarantee"
            ],
            bestFor: "Enterprise teams (50+ employees) requiring comprehensive automation, including large-scale content creation and social media operations",
            bonus: "Quarterly strategy sessions included"
        },
        {
            name: "Monthly Retainer — Ongoing Automation",
            subtitle: "Continuous Optimization",
            price: "€3,500–€8,500/month",
            intro: "Based on scope",
            description: "Ongoing automation development, maintenance, and optimization. New workflows added monthly based on your evolving needs.",
            deliverables: [
                "3-5 new workflows per month",
                "24/7 workflow monitoring & maintenance",
                "Monthly performance reports",
                "Continuous optimization & improvements",
                "Dedicated account manager",
                "Unlimited support requests",
                "Team training sessions (quarterly)"
            ],
            bestFor: "Businesses requiring continuous automation expansion",
            bonus: "Minimum 3-month commitment, cancel anytime after"
        }
    ];

    // Integration capabilities
    const integrations = [
        { name: "AI Video Generation", count: 8, examples: ["Sora 2", "Veo 3.1", "Runway", "Pika", "Kling AI", "Hailuo"] },
        { name: "Social Media Platforms", count: 12, examples: ["TikTok", "Instagram", "YouTube", "Twitter/X", "LinkedIn", "Facebook"] },
        { name: "CRM Systems", count: 25, examples: ["Salesforce", "HubSpot", "Pipedrive", "Zoho"] },
        { name: "Communication", count: 15, examples: ["Slack", "Teams", "Discord", "WhatsApp", "Email"] },
        { name: "Project Management", count: 12, examples: ["Asana", "Trello", "Monday.com", "Notion"] },
        { name: "E-commerce", count: 18, examples: ["Shopify", "WooCommerce", "Stripe", "PayPal"] },
        { name: "Cloud Storage", count: 10, examples: ["Google Drive", "Dropbox", "OneDrive", "AWS S3"] },
        { name: "Marketing Tools", count: 20, examples: ["Mailchimp", "ActiveCampaign", "Facebook Ads", "Google Ads"] }
    ];

    const copyEmailBlock = () => {
        const text = businessPackages.map(pkg =>
            `${pkg.name} — ${pkg.price} (Intro: ${pkg.intro})\n${pkg.description}\n\nBest For: ${pkg.bestFor}\n\nDeliverables:\n${pkg.deliverables.map(d => `• ${d}`).join('\n')}\n\n${pkg.bonus ? `Bonus: ${pkg.bonus}` : ''}`
        ).join('\n\n---\n\n');

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Business packages copied to clipboard! Ready to share with your team.');
            }).catch((err) => {
                console.error('Failed to copy: ', err);
                alert('Copy failed. Please select and copy manually.');
            });
        }
    };

    return (
        <div className={`mk-page print-area ${darkMode ? 'dark' : ''}`}>
            <div className="mk-container">
                <div className="mk-header no-print">
                    <h1 className="mk-title">Business Media Kit — N8N AI Agentic Automation Services</h1>
                    <div className="flex gap-3 flex-wrap items-center">
                        <button
                            onClick={() => {
                                document.getElementById('quote-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className="mk-btn-primary"
                            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', fontWeight: 'bold' }}
                        >
                            Get Custom Quote →
                        </button>
                        <button onClick={handleDownload} className="mk-btn-secondary">
                            <FaDownload className="mr-2" />
                            Download PDF
                        </button>
                        <Link to="/media-kit" className="mk-btn-secondary">
                            View Personal Media Kit →
                        </Link>
                    </div>
                </div>

                {/* VISUAL-FIRST HERO SECTION */}
                <div className="mk-glass-card">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                        {/* Left: Minimal Text */}
                        <div>
                            <div className="inline-block px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-sm font-bold mb-4 text-white">
                                🚀 Save 15-30 Hours/Week
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                AI Workflows That Work While You Sleep
                            </h1>
                            <p className="text-xl mk-muted mb-6">
                                Automate repetitive tasks in 24 hours. No coding required.
                            </p>
                            <div className="flex gap-4 flex-wrap">
                                <button
                                    onClick={() => {
                                        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="mk-btn-primary"
                                >
                                    See How It Works →
                                </button>
                                <Link to="/agents" className="mk-btn-secondary">
                                    Browse Workflows
                                </Link>
                            </div>
                            <p className="text-sm text-gray-400 mt-4">
                                ⚡ Intro pricing • 💰 Money-back guarantee
                            </p>
                        </div>

                        {/* Right: LARGE VISUAL PLACEHOLDER */}
                        <div className="relative">
                            <div className={`aspect-video rounded-xl overflow-hidden border-2 ${darkMode ? 'border-teal-500 bg-gray-800' : 'border-teal-300 bg-gray-100'} shadow-2xl`}>
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="text-6xl mb-4">🎬</div>
                                        <p className="text-lg font-semibold mb-2">Watch 90-Second Demo</p>
                                        <p className="text-sm text-gray-400">See automation in action</p>
                                        <div className="mt-4 text-xs text-gray-500">
                                            📸 Demo video coming soon
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stats */}
                            <div className={`absolute -bottom-4 -left-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-4 border-2 border-teal-500`}>
                                <div className="text-2xl font-bold text-teal-500">15-30 hrs</div>
                                <div className="text-xs">saved per week</div>
                            </div>
                            <div className={`absolute -top-4 -right-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-4 border-2 border-blue-500`}>
                                <div className="text-2xl font-bold text-blue-500">&lt; 24h</div>
                                <div className="text-xs">to go live</div>
                            </div>
                        </div>
                    </div>

                    {/* Company Info - Condensed */}
                    <div className="border-t border-white border-opacity-10 pt-6">
                        <h3 className="text-xl font-bold mb-2">AI Waverider — N8N AI Agentic Automation Marketplace</h3>
                        <p className="mk-muted mb-4">
                            <strong>Specialized in Social Media & Content Automation:</strong> AI workflows that create videos with Sora 2/Veo 3.1,
                            generate thumbnails, write descriptions, schedule posts, and capture leads—all running 24/7 while you sleep.
                        </p>

                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-amber-900/20 border-amber-700/50' : 'bg-amber-50 border-amber-200'} border mb-4`}>
                            <strong>🎯 Building Portfolio:</strong> First 50 businesses get intro pricing. Same expert service, reduced investment.
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap gap-3 justify-center">
                            <div className="mk-stat-card" style={{ padding: '0.75rem', minWidth: 'auto' }}>
                                <span className="mk-stat-number text-sm">200+</span>
                                <span className="mk-stat-label text-xs">Integrations</span>
                            </div>
                            <div className="mk-stat-card" style={{ padding: '0.75rem', minWidth: 'auto' }}>
                                <span className="mk-stat-number text-sm">100%</span>
                                <span className="mk-stat-label text-xs">Money-Back</span>
                            </div>
                            <div className="mk-stat-card" style={{ padding: '0.75rem', minWidth: 'auto' }}>
                                <span className="mk-stat-number text-sm">&lt; 24h</span>
                                <span className="mk-stat-label text-xs">Setup</span>
                            </div>
                            <div className="mk-stat-card" style={{ padding: '0.75rem', minWidth: 'auto' }}>
                                <span className="mk-stat-number text-sm">24/7</span>
                                <span className="mk-stat-label text-xs">Automation</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* VISUAL: Industries We Automate */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">Industries We Automate</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className={`p-6 rounded-xl text-center ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-teal-500 transition-all transform hover:-translate-y-1`}>
                            <div className="text-5xl mb-3">🎯</div>
                            <div className="text-xl font-bold mb-2">E-commerce</div>
                            <div className="text-sm text-gray-400">Order automation, inventory sync, customer follow-ups</div>
                        </div>
                        <div className={`p-6 rounded-xl text-center ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-teal-500 transition-all transform hover:-translate-y-1`}>
                            <div className="text-5xl mb-3">📱</div>
                            <div className="text-xl font-bold mb-2">Content Creators</div>
                            <div className="text-sm text-gray-400">AI video generation, posting, engagement workflows</div>
                        </div>
                        <div className={`p-6 rounded-xl text-center ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-teal-500 transition-all transform hover:-translate-y-1`}>
                            <div className="text-5xl mb-3">💼</div>
                            <div className="text-xl font-bold mb-2">B2B Services</div>
                            <div className="text-sm text-gray-400">Lead gen, CRM sync, proposal automation</div>
                        </div>
                    </div>
                </div>

                {/* VISUAL: The Transformation (Before/After) */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">The Transformation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                        {/* Before */}
                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-red-900/20 border-red-700/50' : 'bg-red-50 border-red-300'} border-2`}>
                            <div className="text-center mb-4">
                                <div className="text-6xl mb-2">😰</div>
                                <h3 className="text-2xl font-bold">Before Automation</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { icon: '⏰', text: '30 hours/week on manual tasks' },
                                    { icon: '😓', text: 'Overwhelmed team' },
                                    { icon: '📊', text: 'Inconsistent results' },
                                    { icon: '🐌', text: 'Can\'t scale without hiring' },
                                    { icon: '❌', text: 'Human errors and missed follow-ups' }
                                ].map((item, idx) => (
                                    <div key={idx} className={`p-3 rounded-lg ${darkMode ? 'bg-red-800/30' : 'bg-red-100'} flex items-center gap-3`}>
                                        <div className="text-2xl">{item.icon}</div>
                                        <div className="text-sm font-medium">{item.text}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* After */}
                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-green-900/20 border-green-700/50' : 'bg-green-50 border-green-300'} border-2`}>
                            <div className="text-center mb-4">
                                <div className="text-6xl mb-2">🚀</div>
                                <h3 className="text-2xl font-bold">After Automation</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { icon: '⚡', text: 'Tasks run 24/7 automatically' },
                                    { icon: '😌', text: 'Team focuses on growth' },
                                    { icon: '✓', text: '100% consistent execution' },
                                    { icon: '📈', text: 'Scale infinitely without hiring' },
                                    { icon: '🎯', text: 'Perfect follow-through every time' }
                                ].map((item, idx) => (
                                    <div key={idx} className={`p-3 rounded-lg ${darkMode ? 'bg-green-800/30' : 'bg-green-100'} flex items-center gap-3`}>
                                        <div className="text-2xl">{item.icon}</div>
                                        <div className="text-sm font-medium">{item.text}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Arrow (desktop only) */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl hidden md:block">
                            →
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="mt-8" ref={statsRef}>
                        <h3 className="text-xl font-bold mb-4 text-center">Our Automation Platform</h3>
                        <div className="mk-stats-grid">
                            {marketplaceStats.map((stat, index) => {
                                // Only animate numeric stats
                                if (stat.duration > 0) {
                                    return (
                                        <AnimatedStat
                                            key={index}
                                            number={stat.number}
                                            label={stat.label}
                                            duration={stat.duration}
                                            shouldAnimate={shouldAnimateStats}
                                        />
                                    );
                                }

                                // Static stats (24/7, etc.)
                                return (
                                    <div key={index} className="mk-stat-card">
                                        <span className="mk-stat-number">{stat.number}</span>
                                        <span className="mk-stat-label">{stat.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* VISUAL: How It Works Timeline */}
                <div className="mk-glass-card" id="how-it-works">
                    <h2 className="mk-section-title">How It Works — Simple 4-Step Process</h2>
                    <div className="relative mt-8">
                        {/* Timeline line */}
                        <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-green-500"></div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                            {[
                                { num: 1, emoji: '📞', title: 'Discovery Call', desc: '15-min consultation', color: 'teal' },
                                { num: 2, emoji: '📋', title: 'Custom Proposal', desc: 'Detailed plan & timeline', color: 'blue' },
                                { num: 3, emoji: '⚙️', title: 'Build & Test', desc: 'We develop, you approve', color: 'purple' },
                                { num: 4, emoji: '🚀', title: 'Launch & Support', desc: 'Go live with training', color: 'green' }
                            ].map((step, idx) => (
                                <div key={idx} className="text-center">
                                    <div className="relative mx-auto mb-6">
                                        <div className={`w-32 h-32 mx-auto rounded-2xl ${darkMode ? `bg-gradient-to-br from-${step.color}-900 to-${step.color}-700` : `bg-gradient-to-br from-${step.color}-100 to-${step.color}-300`} flex items-center justify-center border-4 ${darkMode ? 'border-gray-900' : 'border-white'} shadow-xl`}>
                                            <div className="text-5xl">{step.emoji}</div>
                                        </div>
                                        <div className={`absolute -top-2 -right-2 w-10 h-10 bg-${step.color}-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                            {step.num}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                                    <p className="text-sm text-gray-400">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Featured Workflows (kept as is but condensed) */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">Featured Workflows</h2>

                    <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
                        <p className="text-sm">
                            <strong>📸 Coming Soon:</strong> Live workflow screenshots and demo videos.
                            <Link to="/agents" className="mk-highlight ml-1">View marketplace →</Link>
                        </p>
                    </div>

                    {/* Workflow Carousel */}
                    <div className="mk-carousel-container">
                        <div className="mk-carousel-main">
                            <div className="mk-screenshot-large">
                                <div className="mk-workflow-card">
                                    <div className={`mk-workflow-header p-4 rounded-t-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}>
                                                {topWorkflows[currentWorkflow].category}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${darkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}>
                                                {topWorkflows[currentWorkflow].rating}
                                            </span>
                                        </div>
                                        <h3 className="mk-video-title">{topWorkflows[currentWorkflow].title}</h3>
                                        <p className="mk-video-description">{topWorkflows[currentWorkflow].description}</p>
                                    </div>

                                    <div className={`mk-workflow-body ${darkMode ? 'bg-gray-700' : 'bg-white'} p-4`}>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                                                <div className="text-sm text-gray-400 mb-1">Est. Time Savings</div>
                                                <div className="text-2xl font-bold text-teal-400">{topWorkflows[currentWorkflow].hoursSaved}</div>
                                                <div className="text-xs text-gray-500">hours per week</div>
                                            </div>
                                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}>
                                                <div className="text-sm text-gray-400 mb-1">Status</div>
                                                <div className="text-2xl font-bold text-blue-400">{topWorkflows[currentWorkflow].downloads}</div>
                                                <div className="text-xs text-gray-500">in marketplace</div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="text-sm font-semibold mb-2">Integrations:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {topWorkflows[currentWorkflow].integrations.map((integration, idx) => (
                                                    <span key={idx} className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                                                        {integration}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <Link to="/agents" className="mk-btn-primary w-full text-center inline-block">
                                            Browse All Workflows <FaArrowRight className="inline ml-2" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setCurrentWorkflow(prev => prev > 0 ? prev - 1 : topWorkflows.length - 1)}
                                className="mk-carousel-btn mk-carousel-prev"
                                aria-label="Previous workflow"
                            >
                                ‹
                            </button>
                            <button
                                onClick={() => setCurrentWorkflow(prev => prev < topWorkflows.length - 1 ? prev + 1 : 0)}
                                className="mk-carousel-btn mk-carousel-next"
                                aria-label="Next workflow"
                            >
                                ›
                            </button>
                        </div>

                        <div className="mk-carousel-thumbnails">
                            {topWorkflows.map((workflow, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentWorkflow(index)}
                                    className={`mk-carousel-thumb ${currentWorkflow === index ? 'active' : ''}`}
                                >
                                    <div className="mk-thumb-title text-xs">{workflow.title}</div>
                                    <div className="text-xs text-gray-400 mt-1">{workflow.hoursSaved} hrs/week est.</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Service Capabilities */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">Service Capabilities</h2>
                    <div className="mk-dashboard-grid">
                        {performanceMetrics.map((metric, index) => (
                            <div key={index} className="mk-metric-card">
                                <div className="mk-metric-title">{metric.title}</div>
                                <div className="mk-metric-value">{metric.value}</div>
                                <div className="mk-metric-subtitle">{metric.subtitle}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Social Media Automation - Visual Cards */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">🤖 AI-Powered Social Media Automation</h2>
                    <p className="mk-muted mb-6 text-center">
                        Complete content automation—from creation to posting to lead capture
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { emoji: '🎬', title: 'Video Creation', items: ['AI scripts', 'Sora 2/Veo 3.1', '24/7 execution', 'Multi-platform'] },
                            { emoji: '🎨', title: 'Asset Generation', items: ['AI thumbnails', 'Auto descriptions', 'Hashtag research', 'Brand styling'] },
                            { emoji: '📱', title: 'Auto Posting', items: ['TikTok, IG, YouTube', 'Optimal timing', 'Cross-platform', 'While you sleep'] },
                            { emoji: '💬', title: 'Lead Capture', items: ['Comment-to-DM', 'Lead routing', 'Auto follow-ups', 'CRM integration'] }
                        ].map((card, idx) => (
                            <div key={idx} className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-teal-500 transition-all transform hover:-translate-y-1`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="text-4xl">{card.emoji}</div>
                                    <h3 className="font-bold text-lg">{card.title}</h3>
                                </div>
                                <ul className="text-sm space-y-1 text-gray-400">
                                    {card.items.map((item, i) => (
                                        <li key={i}>✓ {item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Integration Capabilities */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">200+ Integration Capabilities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {integrations.map((integration, index) => (
                            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-blue-500 transition-all`}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">{integration.name}</h3>
                                    <span className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}>
                                        {integration.count}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {integration.examples.slice(0, 3).map((example, idx) => (
                                        <span key={idx} className={`px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'}`}>
                                            {example}
                                        </span>
                                    ))}
                                    {integration.examples.length > 3 && (
                                        <span className={`px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'}`}>
                                            +{integration.examples.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Business Service Packages */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">Business Service Packages</h2>

                    {/* Real AI Efficiency Data */}
                    <div className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-gradient-to-br from-teal-900/40 to-blue-900/40 border-teal-700/50' : 'bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200'} border-2`}>
                        <h3 className="font-bold text-xl mb-3">📊 Real AI Automation Impact (Industry Data)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'}`}>
                                <div className="text-3xl font-bold text-teal-400">30-70%</div>
                                <div className="text-sm mt-1">Productivity increase</div>
                                <div className="text-xs text-gray-400 mt-1">McKinsey Global Institute</div>
                            </div>
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'}`}>
                                <div className="text-3xl font-bold text-blue-400">15-30 hrs</div>
                                <div className="text-sm mt-1">Saved per employee/week</div>
                                <div className="text-xs text-gray-400 mt-1">Harvard Business Review</div>
                            </div>
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'}`}>
                                <div className="text-3xl font-bold text-purple-400">50-80%</div>
                                <div className="text-sm mt-1">Task time reduction</div>
                                <div className="text-xs text-gray-400 mt-1">Gartner Research</div>
                            </div>
                        </div>
                        <p className="text-sm">
                            <strong>Real-World Impact:</strong> For a team of 10 people, that's <span className="font-bold text-teal-400">200-250 hours saved weekly</span>—equivalent to 5-6 full-time employees without salary costs.
                        </p>
                    </div>

                    {/* Pricing Explanation */}
                    <div className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-700/50' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300'} border-2`}>
                        <div className="flex items-start gap-3 mb-4">
                            <div className="text-3xl">💡</div>
                            <div>
                                <h3 className="font-bold text-xl mb-2">Intro vs. Standard Pricing</h3>
                                <p className="text-sm opacity-90">Limited-time introductory rates while building our portfolio.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50 border-green-600/50' : 'bg-white/80 border-green-300'} border-2`}>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-green-600' : 'bg-green-500 text-white'}`}>
                                    INTRO PRICING
                                </span>
                                <div className="text-2xl font-bold my-2 text-green-400">€997 - €9,997</div>
                                <p className="text-xs text-green-400 font-semibold">⚡ First 50 businesses</p>
                            </div>

                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50 border-blue-600/50' : 'bg-white/80 border-blue-300'} border-2`}>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-blue-600' : 'bg-blue-500 text-white'}`}>
                                    STANDARD PRICING
                                </span>
                                <div className="text-2xl font-bold my-2 text-blue-400">€1,497 - €12,997</div>
                                <p className="text-xs text-blue-400 font-semibold">📅 After portfolio completion</p>
                            </div>
                        </div>

                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-amber-800/30' : 'bg-amber-100'} text-center`}>
                            <p className="text-sm font-semibold">
                                🔥 Save up to €3,000 per package with intro pricing
                            </p>
                        </div>
                    </div>

                    {/* Package Cards */}
                    <div className="space-y-6">
                        {businessPackages.map((pkg, index) => (
                            <div key={index} className="mk-package-card">
                                <div className="mk-package-title">{pkg.name}</div>
                                <div className="mk-package-subtitle text-lg mb-2">{pkg.subtitle}</div>
                                <div className="mk-package-price">
                                    Standard: {pkg.price} | <span className="mk-highlight">Intro: {pkg.intro}</span>
                                </div>
                                <div className="mk-package-details mb-4">{pkg.description}</div>

                                <div className={`p-3 rounded-lg mb-4 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} border ${darkMode ? 'border-blue-700' : 'border-blue-200'}`}>
                                    <strong className="text-sm">Best For:</strong> <span className="text-sm">{pkg.bestFor}</span>
                                </div>

                                <div className="mk-text">
                                    <strong>Deliverables:</strong>
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        {pkg.deliverables.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mk-muted mt-3 p-3 bg-white bg-opacity-10 rounded-lg">
                                    <strong>Bonus:</strong> {pkg.bonus}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center my-6">
                        <button
                            onClick={() => {
                                document.getElementById('quote-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="mk-btn-primary"
                            style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
                        >
                            Get Custom Quote →
                        </button>
                        <p className="mk-muted mt-2 text-sm">We'll help you choose the best fit</p>
                    </div>

                    {/* Guarantee */}
                    <div className="mk-text mt-6 p-4 bg-gradient-to-r from-green-500 from-opacity-20 to-blue-500 to-opacity-20 rounded-lg border border-white border-opacity-20">
                        <div className="text-center">
                            <div className="text-xl font-bold mb-2"><FaShieldAlt className="inline mr-2" />Money-Back Guarantee</div>
                            <div>Not satisfied? Full refund within 30-90 days (depending on package), no questions asked.</div>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">Why Choose AI Waverider?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { icon: '🚀', title: 'Fast Implementation', desc: 'Live within 1-2 weeks. No months-long "discovery phases"' },
                            { icon: '💰', title: 'Transparent Pricing', desc: 'Fixed-price packages. You know exactly what you\'re paying' },
                            { icon: '🛡️', title: 'Zero Risk', desc: '30-90 day money-back guarantee. If it doesn\'t work, you don\'t pay' },
                            { icon: '🎯', title: 'Custom Built', desc: 'Not templates. Each workflow tailored to your specific needs' }
                        ].map((item, idx) => (
                            <div key={idx} className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <div className="flex items-start gap-3">
                                    <div className="text-3xl">{item.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                        <p className="text-sm text-gray-400">{item.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">Common Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: 'How long until I see time savings?', a: 'Most clients see immediate impact once workflows go live (1-2 weeks). Full optimization takes 30-60 days.' },
                            { q: 'What if my team isn\'t technical?', a: 'We handle all technical complexity. Your team uses simple interfaces—no coding required.' },
                            { q: 'Can workflows be modified after launch?', a: 'Yes. All packages include optimization. Enterprise/Retainer packages include ongoing modifications.' },
                            { q: 'What happens if something breaks?', a: 'All packages include support. We monitor, fix issues quickly, and provide documentation. Enterprise gets 24/7 monitoring.' },
                            { q: 'Do I need to buy N8N licenses?', a: 'N8N has a free tier for small teams. Larger deployments cost ~€20-50/month. We\'ll advise on the best option.' }
                        ].map((item, idx) => (
                            <details key={idx} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <summary className="font-semibold cursor-pointer">{item.q}</summary>
                                <p className="mt-2 text-sm text-gray-400">{item.a}</p>
                            </details>
                        ))}
                    </div>
                </div>

                {/* Quote Wizard */}
                <div className="mk-glass-card" id="quote-section">
                    <QuoteWizard type="business" />
                </div>

                {/* Contact & Next Steps */}
                <div className="mk-glass-card text-center">
                    <h2 className="mk-section-title">Ready to Automate Your Business?</h2>
                    <p className="mk-text mb-6">
                        Get in touch to discuss your automation needs or get a personalized quote.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[
                            { num: '200+', label: 'Integrations' },
                            { num: '< 24h', label: 'Setup' },
                            { num: '24/7', label: 'Automation' },
                            { num: '100%', label: 'Money-Back' }
                        ].map((stat, idx) => (
                            <div key={idx} className="mk-stat-card">
                                <span className="mk-stat-number text-lg">{stat.num}</span>
                                <span className="mk-stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 justify-center flex-wrap">
                        <button
                            className="mk-btn-primary"
                            onClick={() => window.location.href = 'mailto:support@aiwaverider.com?subject=Business Automation Inquiry&body=Hi AI Waverider team,%0D%0A%0D%0AI\'m interested in your automation services. Here are my details:%0D%0A%0D%0ACompany: %0D%0AIndustry: %0D%0ATeam Size: %0D%0ACurrent Challenges: %0D%0ABudget Range: %0D%0ATimeline: %0D%0A%0D%0ALooking forward to discussing!'}
                        >
                            <FaFileAlt className="inline mr-2" />
                            Contact for Quote
                        </button>
                        <button onClick={copyEmailBlock} className="mk-btn-secondary">
                            <FaDownload className="inline mr-2" />
                            Copy Packages
                        </button>
                        <Link to="/agents" className="mk-btn-secondary">
                            <FaNetworkWired className="inline mr-2" />
                            Browse Workflows
                        </Link>
                    </div>

                    <div className="mk-text mt-4 text-sm opacity-75">
                        🔒 Your information is secure and never shared
                    </div>
                </div>

                {/* Contact & Terms */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">Contact & Service Terms</h2>
                    <div className="mk-text space-y-4 text-sm">
                        <div>
                            <strong>Payment:</strong> 50% deposit to start • Remaining 50% on delivery • Monthly retainers billed at start of month
                        </div>
                        <div>
                            <strong>Timeline:</strong> Starter (3-5 days) • Professional (1-2 weeks) • Enterprise (2-4 weeks) • Rush available
                        </div>
                        <div>
                            <strong>Support:</strong> Email support included • Priority support for Pro & Enterprise • Maintenance plans available
                        </div>
                        <div>
                            <strong>Contact:</strong> support@aiwaverider.com • Response: Within 4 hours • <a href="https://calendly.com/aiwaverider8/30min" target="_blank" rel="noopener noreferrer" className="mk-highlight">Schedule a call</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessMediaKitPage;