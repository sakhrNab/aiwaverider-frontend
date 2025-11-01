import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/marketing-pages.css';
import { getTodayIsoDate, printCurrentPageAsPdf } from '../utils/pdf';
import QuoteWizard from '../components/marketing/QuoteWizard';
import {
    FaDownload,
    FaShieldAlt,
    FaNetworkWired,
    FaFileAlt,
    FaArrowRight
} from 'react-icons/fa';

const BusinessMediaKitPage = () => {
    const { darkMode } = useTheme();
    const today = getTodayIsoDate();
    const [currentWorkflow, setCurrentWorkflow] = useState(0);
    const [agentStats, setAgentStats] = useState({
        totalAgents: 0,
        totalCategories: 0,
        activeUsers: 0
    });

    // Fetch agent statistics
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { getAgentsCount } = await import('../api/marketplace/agentApi');
                const totalCount = await getAgentsCount();
                setAgentStats({
                    totalAgents: totalCount || 150,
                    totalCategories: 40,
                    activeUsers: 0 // Set to 0 if you don't have real data
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

    // Marketplace Statistics - HONEST NUMBERS ONLY
    const marketplaceStats = [
        { number: `${agentStats.totalAgents}+`, label: "N8N Workflows Available" },
        { number: `${agentStats.totalCategories}+`, label: "Categories & Use Cases" },
        { number: "200+", label: "Integrations Supported" },
        { number: "24/7", label: "Automated Execution" },
        { number: "< 24h", label: "Custom Setup Time" },
        { number: "Full Stack", label: "Technical Capability" }
    ];

    // Performance Metrics - HONEST PROJECTIONS
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
                        <Link
                            to="/media-kit"
                            className="mk-btn-secondary"
                        >
                            View Personal Media Kit →
                        </Link>
                    </div>
                </div>
    
                {/* Hero Section - IMPROVED */}
                <div className="mk-glass-card">
                    <div className="text-center mb-6">
                        <div className="inline-block px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full text-sm font-bold mb-4 text-white">
                            🚀 Save 15-30 Hours Per Week on Autopilot
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            We Build AI Workflows That Work While You Sleep
                        </h2>
                        <p className="text-lg md:text-xl mk-muted mb-6 max-w-3xl mx-auto">
                            Custom N8N automation workflows that handle your repetitive tasks 24/7—from AI video creation
                            to lead generation to content distribution. No coding required.
                        </p>
                        <div className="flex gap-4 justify-center items-center flex-wrap mb-4">
                            <button 
                                onClick={() => {
                                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="mk-btn-primary text-base md:text-lg px-6 md:px-8 py-3"
                            >
                                See How It Works →
                            </button>
                            <Link to="/agents" className="mk-btn-secondary text-base md:text-lg px-6 md:px-8 py-3">
                                Browse Workflows
                            </Link>
                        </div>
                        <p className="text-sm text-gray-400">
                            ⚡ First 50 businesses get intro pricing • 💰 100% money-back guarantee
                        </p>
                    </div>
    
                    {/* Company Info */}
                    <div className="border-t border-white border-opacity-10 pt-6 mt-6">
                        <h3 className="mk-section-title text-2xl">AI Waverider — N8N AI Agentic Automation Marketplace</h3>
                        <p className="mk-text text-base md:text-lg mb-3">Business Process Automation | N8N AI Agentic Workflows & Integration</p>
                        
                        <p className="mk-muted mt-3">
                            <strong>Specialized Social Media & Content Automation:</strong> Our AI Agentic workflows enable fully automated content creation
                            and distribution. Generate video scripts based on market research, create videos using Sora 2, Veo 3.1, and other cutting-edge AI models
                            while you sleep, automatically generate thumbnails and descriptions, schedule posts across all platforms, and set up comment-to-DM
                            workflows for seamless lead capture—all running autonomously 24/7.
                        </p>
    
                        <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-amber-900/20 border-amber-700/50' : 'bg-amber-50 border-amber-200'} border`}>
                            <strong>🎯 Building Business Portfolio:</strong> We're offering introductory pricing for the first 50 businesses that partner with us.
                            Same expert service and workflows, reduced investment to help us build proven case studies in the business automation space.
                        </div>
                    </div>
    
                    {/* Trust Badges */}
                    <div className="flex flex-wrap gap-4 mt-6 justify-center">
                        <div className="mk-stat-card" style={{ padding: '0.75rem', minWidth: 'auto' }}>
                            <span className="mk-stat-number text-sm">200+</span>
                            <span className="mk-stat-label text-xs">Integrations</span>
                        </div>
                        <div className="mk-stat-card" style={{ padding: '0.75rem', minWidth: 'auto' }}>
                            <span className="mk-stat-number text-sm">100%</span>
                            <span className="mk-stat-label text-xs">Money-Back Guarantee</span>
                        </div>
                        <div className="mk-stat-card" style={{ padding: '0.75rem', minWidth: 'auto' }}>
                            <span className="mk-stat-number text-sm">&lt; 24h</span>
                            <span className="mk-stat-label text-xs">Setup Time</span>
                        </div>
                        <div className="mk-stat-card" style={{ padding: '0.75rem', minWidth: 'auto' }}>
                            <span className="mk-stat-number text-sm">24/7</span>
                            <span className="mk-stat-label text-xs">Automated Execution</span>
                        </div>
                    </div>
                </div>
    
                {/* NEW: Building Portfolio Section */}
                <div className="mk-glass-card">
                    <div className="text-center">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">Industries We Automate</h3>
                        <p className="mk-muted mb-8 max-w-2xl mx-auto">
                            We're partnering with forward-thinking businesses to build proven case studies.
                            Get intro pricing and be featured as an early success story.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-teal-500 transition-all`}>
                                <div className="text-4xl mb-3">🎯</div>
                                <div className="text-xl font-bold mb-2">E-commerce</div>
                                <div className="text-sm text-gray-400">Order automation, inventory sync, customer follow-ups</div>
                            </div>
                            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-teal-500 transition-all`}>
                                <div className="text-4xl mb-3">📱</div>
                                <div className="text-xl font-bold mb-2">Content Creators</div>
                                <div className="text-sm text-gray-400">AI video generation, posting, engagement workflows</div>
                            </div>
                            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-teal-500 transition-all`}>
                                <div className="text-4xl mb-3">💼</div>
                                <div className="text-xl font-bold mb-2">B2B Services</div>
                                <div className="text-sm text-gray-400">Lead gen, CRM sync, proposal automation</div>
                            </div>
                        </div>
                    </div>
                </div>
    
                {/* IMPROVED: Before/After + Statistics */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">Why Businesses Choose AI Waverider</h2>
    
                    {/* Before/After Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className={`p-6 rounded-lg ${darkMode ? 'bg-red-900/20 border-red-700/50' : 'bg-red-50 border-red-200'} border-2`}>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="text-2xl">😰</span> Without Automation
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 text-xl">✗</span>
                                    <span className="text-sm">15-30 hours/week on repetitive tasks</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 text-xl">✗</span>
                                    <span className="text-sm">Manual data entry and copy-paste work</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 text-xl">✗</span>
                                    <span className="text-sm">Inconsistent processes across team</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 text-xl">✗</span>
                                    <span className="text-sm">Limited scale without hiring more people</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 text-xl">✗</span>
                                    <span className="text-sm">Human errors and missed follow-ups</span>
                                </li>
                            </ul>
                        </div>
    
                        <div className={`p-6 rounded-lg ${darkMode ? 'bg-green-900/20 border-green-700/50' : 'bg-green-50 border-green-200'} border-2`}>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="text-2xl">🚀</span> With AI Waverider
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <span className="text-sm">Workflows run 24/7 automatically</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <span className="text-sm">Zero manual work on repetitive tasks</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <span className="text-sm">Consistent, error-free execution every time</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <span className="text-sm">Scale infinitely without hiring</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 text-xl">✓</span>
                                    <span className="text-sm">100% reliable follow-through on every task</span>
                                </li>
                            </ul>
                        </div>
                    </div>
    
                    {/* Stats Grid */}
                    <h3 className="text-xl font-bold mb-4 text-center">Our Automation Platform</h3>
                    <div className="mk-stats-grid">
                        {marketplaceStats.map((stat, index) => (
                            <div key={index} className="mk-stat-card">
                                <span className="mk-stat-number">{stat.number}</span>
                                <span className="mk-stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
    
                {/* IMPROVED: Featured Workflows */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">Featured Workflows</h2>
    
                    {/* Visual Proof Coming Soon Notice */}
                    <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
                        <p className="text-sm">
                            <strong>📸 Coming Soon:</strong> Live workflow screenshots and demo videos showing automation in action.
                            <Link to="/agents" className="mk-highlight ml-1">View available workflows in marketplace →</Link>
                        </p>
                    </div>
    
                    <p className="mk-muted mb-6">
                        Explore our most popular automation workflows, designed to save time and streamline business operations:
                    </p>
    
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
                                            <div className="flex items-center gap-1">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${darkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}>
                                                    {topWorkflows[currentWorkflow].rating}
                                                </span>
                                            </div>
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
    
                                        <Link
                                            to="/agents"
                                            className="mk-btn-primary w-full text-center inline-block"
                                        >
                                            Browse All Workflows <FaArrowRight className="inline ml-2" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
    
                            {/* Navigation buttons */}
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
    
                        {/* Thumbnail navigation */}
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
    
                {/* Performance Metrics */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">Service Capabilities</h2>
                    <p className="mk-muted mb-6 text-center">
                        What you can expect when working with us:
                    </p>
                    <div className="mk-dashboard-grid">
                        {performanceMetrics.map((metric, index) => (
                            <div key={index} className="mk-metric-card">
                                <div className="mk-metric-title">{metric.title}</div>
                                <div className="mk-metric-value">{metric.value}</div>
                                <div className="mk-metric-subtitle">{metric.subtitle}</div>
                            </div>
                        ))}
                    </div>
    
                    <div className={`mk-text mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <strong>Note on Time Savings:</strong> Estimated time savings are based on typical use cases and will vary depending on
                        your specific processes, complexity, and implementation. We recommend starting with pilot workflows to measure actual impact
                        for your business.
                    </div>
                </div>
    
                {/* Social Media & Content Automation Feature */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">🤖 AI-Powered Social Media & Content Automation</h2>
                    <p className="mk-muted mb-6 text-center">
                        Our specialized AI Agentic workflows transform content creation from a time-consuming manual process into a fully automated,
                        hands-off operation. Here's what you can automate:
                    </p>
    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-teal-500 transition-all`}>
                            <div className="text-3xl mb-3">🎬</div>
                            <h3 className="font-bold text-lg mb-2">Video Creation Automation</h3>
                            <ul className="text-sm space-y-2 text-gray-400">
                                <li>✓ AI-generated video scripts based on market research</li>
                                <li>✓ Automatic video generation with Sora 2, Veo 3.1, and more</li>
                                <li>✓ Runs while you sleep—24/7 autonomous workflow execution</li>
                                <li>✓ Multi-platform video format optimization</li>
                            </ul>
                        </div>
    
                        <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-teal-500 transition-all`}>
                            <div className="text-3xl mb-3">🎨</div>
                            <h3 className="font-bold text-lg mb-2">Content Asset Generation</h3>
                            <ul className="text-sm space-y-2 text-gray-400">
                                <li>✓ AI-powered thumbnail creation</li>
                                <li>✓ Automatic description generation optimized for each platform</li>
                                <li>✓ Hashtag research and suggestion</li>
                                <li>✓ Brand-consistent styling across all assets</li>
                            </ul>
                        </div>
    
                        <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-teal-500 transition-all`}>
                            <div className="text-3xl mb-3">📱</div>
                            <h3 className="font-bold text-lg mb-2">Automated Posting & Distribution</h3>
                            <ul className="text-sm space-y-2 text-gray-400">
                                <li>✓ Schedule posts across TikTok, Instagram, YouTube, LinkedIn</li>
                                <li>✓ Optimal posting time optimization per platform</li>
                                <li>✓ Cross-platform content adaptation</li>
                                <li>✓ Automatic posting while you sleep</li>
                            </ul>
                        </div>
    
                        <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-teal-500 transition-all`}>
                            <div className="text-3xl mb-3">💬</div>
                            <h3 className="font-bold text-lg mb-2">Engagement & Lead Capture</h3>
                            <ul className="text-sm space-y-2 text-gray-400">
                                <li>✓ Comment-to-DM automated workflows</li>
                                <li>✓ Lead qualification and routing</li>
                                <li>✓ Automated follow-up sequences</li>
                                <li>✓ Engagement analytics and reporting</li>
                            </ul>
                        </div>
                    </div>
    
                    <div className={`p-5 rounded-lg ${darkMode ? 'bg-teal-900/30' : 'bg-teal-50'} border-2 ${darkMode ? 'border-teal-700' : 'border-teal-300'}`}>
                        <p className="text-sm">
                            <strong>💡 The Complete Automation Loop:</strong> From market research → script generation → AI video creation (Sora 2, Veo 3.1)
                            → thumbnail & description generation → scheduled posting → comment engagement → lead capture → CRM integration.
                            All running autonomously, all while you focus on growing your business.
                        </p>
                    </div>
                </div>
    
                {/* Integration Capabilities */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">Integration Capabilities</h2>
                    <p className="mk-muted mb-6 text-center">
                        Our workflows integrate with 200+ popular business tools and platforms, including the latest AI video generation models:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {integrations.map((integration, index) => (
                            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-blue-500 transition-all`}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-lg">{integration.name}</h3>
                                    <span className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}>
                                        {integration.count} apps
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {integration.examples.map((example, idx) => (
                                        <span key={idx} className={`px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'}`}>
                                            {example}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Business Service Packages */}
                {/* Business Service Packages */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">Business Service Packages</h2>

                    {/* Real AI Efficiency Data */}
                    <div className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-gradient-to-br from-teal-900/40 to-blue-900/40 border-teal-700/50' : 'bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200'} border-2`}>
                        <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                            📊 Real AI Automation Impact (Industry Data)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'}`}>
                                <div className="text-3xl font-bold text-teal-400">30-70%</div>
                                <div className="text-sm mt-1">Productivity increase</div>
                                <div className="text-xs text-gray-400 mt-1">Source: McKinsey Global Institute</div>
                            </div>
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'}`}>
                                <div className="text-3xl font-bold text-blue-400">15-30 hrs</div>
                                <div className="text-sm mt-1">Saved per employee/week</div>
                                <div className="text-xs text-gray-400 mt-1">Source: Harvard Business Review</div>
                            </div>
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'}`}>
                                <div className="text-3xl font-bold text-purple-400">50-80%</div>
                                <div className="text-sm mt-1">Reduction in task time</div>
                                <div className="text-xs text-gray-400 mt-1">Source: Gartner Research</div>
                            </div>
                        </div>
                        <p className="text-sm">
                            <strong>Real-World Impact:</strong> Businesses implementing AI workflow automation report average time savings of
                            20-25 hours per employee per week on repetitive tasks. For a team of 10 people, that's <span className="font-bold text-teal-400">200-250 hours
                                saved weekly</span>, equivalent to hiring 5-6 additional full-time employees—without the salary costs.
                        </p>
                    </div>

                    {/* Pricing Explanation */}
                    <div className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-700/50' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300'} border-2`}>
                        <div className="flex items-start gap-3 mb-4">
                            <div className="text-3xl">💡</div>
                            <div>
                                <h3 className="font-bold text-xl mb-2">Understanding Intro vs. Standard Pricing</h3>
                                <p className="text-sm opacity-90 mb-4">
                                    We're offering limited-time introductory rates while building our business automation case study portfolio.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50 border-green-600/50' : 'bg-white/80 border-green-300'} border-2`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-green-600' : 'bg-green-500 text-white'}`}>
                                        INTRO PRICING
                                    </span>
                                </div>
                                <div className="text-2xl font-bold mb-2 text-green-400">€997 - €9,997</div>
                                <div className="text-sm space-y-2">
                                    <p><strong>Who:</strong> First 50 businesses</p>
                                    <p><strong>Why:</strong> Help us build proven case studies</p>
                                    <p><strong>Benefit:</strong> Same service, reduced investment</p>
                                    <p className="text-xs text-green-400 font-semibold">⚡ Limited availability</p>
                                </div>
                            </div>

                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50 border-blue-600/50' : 'bg-white/80 border-blue-300'} border-2`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-blue-600' : 'bg-blue-500 text-white'}`}>
                                        STANDARD PRICING
                                    </span>
                                </div>
                                <div className="text-2xl font-bold mb-2 text-blue-400">€1,497 - €12,997</div>
                                <div className="text-sm space-y-2">
                                    <p><strong>When:</strong> After portfolio completion</p>
                                    <p><strong>Same:</strong> Deliverables, support, guarantees</p>
                                    <p><strong>Value:</strong> Regular market rate</p>
                                    <p className="text-xs text-blue-400 font-semibold">📅 Coming soon</p>
                                </div>
                            </div>
                        </div>

                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-amber-800/30' : 'bg-amber-100'} text-center`}>
                            <p className="text-sm font-semibold">
                                🔥 <span className="text-amber-400">Lock in intro pricing now</span> - Save up to €3,000 per package
                            </p>
                        </div>
                    </div>

                    <p className="mk-muted mb-6 text-center">
                        Choose the package that best fits your business needs. All packages include setup, training, and support.
                    </p>

                    {/* ACTUAL PACKAGE CARDS - THIS WAS MISSING */}
                    <div className="space-y-6">
                        {businessPackages.map((pkg, index) => (
                            <div key={index} className="mk-package-card">
                                <div className="mk-package-title">{pkg.name}</div>
                                <div className="mk-package-subtitle text-lg mb-2">{pkg.subtitle}</div>
                                <div className="mk-package-price">
                                    {pkg.intro ? (
                                        <>Standard: {pkg.price} | <span className="mk-highlight">Intro: {pkg.intro}</span></>
                                    ) : (
                                        pkg.price
                                    )}
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

                    {/* CTA to Quote Wizard */}
                    <div className="text-center my-6">
                        <button
                            onClick={() => {
                                document.getElementById('quote-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="mk-btn-primary"
                            style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
                        >
                            Not Sure Which Package? Get Custom Quote →
                        </button>
                        <p className="mk-muted mt-2 text-sm">We'll help you choose the best fit for your business</p>
                    </div>

                    {/* Risk Reversal */}
                    <div className="mk-text mt-6 p-4 bg-gradient-to-r from-green-500 from-opacity-20 to-blue-500 to-opacity-20 rounded-lg border border-white border-opacity-20">
                        <div className="text-center">
                            <div className="text-xl font-bold mb-2"><FaShieldAlt className="inline mr-2" />Money-Back Guarantee</div>
                            <div>Not satisfied with results? Get a full refund within the guarantee period (30-90 days depending on package), no questions asked. We'll over-deliver to earn your testimonial.</div>
                        </div>
                    </div>
                </div>

                {/* NEW SECTION: How It Works - ADD AFTER PACKAGES */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">How It Works — Simple 4-Step Process</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className={`w-16 h-16 rounded-full ${darkMode ? 'bg-teal-600' : 'bg-teal-500'} text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3`}>
                                1
                            </div>
                            <h3 className="font-bold mb-2">Discovery Call</h3>
                            <p className="text-sm text-gray-400">15-30 min consultation to understand your processes and goals</p>
                        </div>

                        <div className="text-center">
                            <div className={`w-16 h-16 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3`}>
                                2
                            </div>
                            <h3 className="font-bold mb-2">Custom Proposal</h3>
                            <p className="text-sm text-gray-400">Detailed workflow plan with timeline and exact deliverables</p>
                        </div>

                        <div className="text-center">
                            <div className={`w-16 h-16 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-purple-500'} text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3`}>
                                3
                            </div>
                            <h3 className="font-bold mb-2">Build & Test</h3>
                            <p className="text-sm text-gray-400">We develop workflows, you provide feedback, we refine until perfect</p>
                        </div>

                        <div className="text-center">
                            <div className={`w-16 h-16 rounded-full ${darkMode ? 'bg-green-600' : 'bg-green-500'} text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3`}>
                                4
                            </div>
                            <h3 className="font-bold mb-2">Launch & Support</h3>
                            <p className="text-sm text-gray-400">Go live with full training and ongoing support included</p>
                        </div>
                    </div>
                </div>

                {/* NEW SECTION: Why Choose Us - ADD BEFORE QUOTE WIZARD */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">Why Choose AI Waverider?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-start gap-3">
                                <div className="text-3xl">🚀</div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Fast Implementation</h3>
                                    <p className="text-sm text-gray-400">Most workflows live within 1-2 weeks. No months-long "discovery phases" or enterprise bloat.</p>
                                </div>
                            </div>
                        </div>

                        <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-start gap-3">
                                <div className="text-3xl">💰</div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Transparent Pricing</h3>
                                    <p className="text-sm text-gray-400">Fixed-price packages, no hidden fees. You know exactly what you're paying before we start.</p>
                                </div>
                            </div>
                        </div>

                        <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-start gap-3">
                                <div className="text-3xl">🛡️</div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Zero Risk</h3>
                                    <p className="text-sm text-gray-400">30-90 day money-back guarantee on all packages. If it doesn't work, you don't pay.</p>
                                </div>
                            </div>
                        </div>

                        <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-start gap-3">
                                <div className="text-3xl">🎯</div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Custom Built</h3>
                                    <p className="text-sm text-gray-400">Not cookie-cutter templates. Each workflow tailored specifically to your processes and tools.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NEW SECTION: Common Questions - ADD BEFORE QUOTE WIZARD */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">Common Questions</h2>
                    <div className="space-y-4">
                        <details className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <summary className="font-semibold cursor-pointer">How long until I see time savings?</summary>
                            <p className="mt-2 text-sm text-gray-400">Most clients see immediate impact once workflows go live (1-2 weeks). Full optimization typically takes 30-60 days as we refine based on usage.</p>
                        </details>

                        <details className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <summary className="font-semibold cursor-pointer">What if my team isn't technical?</summary>
                            <p className="mt-2 text-sm text-gray-400">That's exactly who we built this for. We handle all the technical complexity. Your team just uses the workflows through simple interfaces—no coding required.</p>
                        </details>

                        <details className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <summary className="font-semibold cursor-pointer">Can workflows be modified after launch?</summary>
                            <p className="mt-2 text-sm text-gray-400">Absolutely. All packages include optimization period. Enterprise and Retainer packages include ongoing modifications as your needs evolve.</p>
                        </details>

                        <details className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <summary className="font-semibold cursor-pointer">What happens if something breaks?</summary>
                            <p className="mt-2 text-sm text-gray-400">All packages include support period. We monitor workflows, fix issues quickly, and provide documentation for common troubleshooting. Enterprise gets 24/7 monitoring.</p>
                        </details>

                        <details className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <summary className="font-semibold cursor-pointer">Do I need to buy N8N licenses?</summary>
                            <p className="mt-2 text-sm text-gray-400">N8N has a generous free tier for small teams. For larger deployments, licensing costs are separate (~€20-50/month depending on scale). We'll advise on the best option for your needs.</p>
                        </details>
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
                        Get in touch to discuss your automation needs, explore custom workflows, or get a personalized quote.
                    </p>

                    {/* Trust signals */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="mk-stat-card">
                            <span className="mk-stat-number text-lg">200+</span>
                            <span className="mk-stat-label">Integrations</span>
                        </div>
                        <div className="mk-stat-card">
                            <span className="mk-stat-number text-lg">&lt; 24h</span>
                            <span className="mk-stat-label">Setup Time</span>
                        </div>
                        <div className="mk-stat-card">
                            <span className="mk-stat-number text-lg">24/7</span>
                            <span className="mk-stat-label">Automation</span>
                        </div>
                        <div className="mk-stat-card">
                            <span className="mk-stat-number text-lg">100%</span>
                            <span className="mk-stat-label">Money-Back Guarantee</span>
                        </div>
                    </div>

                    <div className="mk-button-group justify-center flex-wrap">
                        <button
                            className="mk-btn-primary"
                            onClick={() => window.location.href = 'mailto:support@aiwaverider.com?subject=Business Automation Inquiry&body=Hi AI Waverider team,%0D%0A%0D%0AI\'m interested in your automation services. Here are my details:%0D%0A%0D%0ACompany: %0D%0AIndustry: %0D%0ATeam Size: %0D%0ACurrent Challenges: %0D%0ABudget Range: %0D%0ATimeline: %0D%0A%0D%0ALooking forward to discussing how automation can help!'}
                        >
                            <FaFileAlt className="inline mr-2" />
                            Contact for Business Quote
                        </button>
                        <button onClick={copyEmailBlock} className="mk-btn-secondary">
                            <FaDownload className="inline mr-2" />
                            Copy Packages for Email
                        </button>
                        <Link to="/agents" className="mk-btn-secondary">
                            <FaNetworkWired className="inline mr-2" />
                            Browse Workflow Marketplace
                        </Link>
                    </div>

                    <div className="mk-text mt-4 text-sm opacity-75">
                        🔒 Your information is secure and never shared with third parties
                    </div>
                </div>

                {/* Contact & Terms */}
                <div className="mk-glass-card">
                    <h2 className="mk-section-title">Contact & Service Terms</h2>
                    <div className="mk-text space-y-4">
                        <div>
                            <strong>Payment Structure:</strong><br />
                            • 50% deposit to begin development<br />
                            • Remaining 50% due on delivery<br />
                            • Monthly retainers billed at start of month
                        </div>

                        <div>
                            <strong>Implementation Timeline:</strong><br />
                            • Starter Package: 3-5 business days<br />
                            • Professional Package: 1-2 weeks<br />
                            • Enterprise Package: 2-4 weeks<br />
                            • Rush delivery available (add-on)
                        </div>

                        <div>
                            <strong>Support & Maintenance:</strong><br />
                            • Email support included in all packages<br />
                            • Priority support for Professional & Enterprise<br />
                            • Monthly maintenance plans available
                        </div>

                        <div>
                            <strong>Contact:</strong><br />
                            • Email: support@aiwaverider.com<br />
                            • Response time: Within 4 hours (business days)<br />
                            • Consultation: <a href="https://calendly.com/aiwaverider8/30min" target="_blank" rel="noopener noreferrer" className="mk-highlight">Schedule a call</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessMediaKitPage;