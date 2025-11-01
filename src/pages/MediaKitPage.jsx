import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/marketing-pages.css';
import { getTodayIsoDate, printCurrentPageAsPdf } from '../utils/pdf';
import ROICalculator from '../components/marketing/ROICalculator';
import PackageComparison from '../components/marketing/PackageComparison';
import QuoteWizard from '../components/marketing/QuoteWizard';
import tiktokAIGeneratedContent from '../assets/tiktok/tiktokAIGeneratedContentImg.png';
import tiktokCodeWithAI from '../assets/tiktok/tiktokCodeWithAI.png';
import tiktokGPUTechnology from '../assets/tiktok/tiktokGPUTechnology.png';
import tiktokHailuoAI from '../assets/tiktok/tiktokHailuoAI.jpeg';
import tiktokRunwayImg from '../assets/tiktok/tiktokRunwayImg.png';
import tiktokVeo2AI from '../assets/tiktok/tiktokVeo2AI.png';

const MediaKitPage = () => {
  const today = getTodayIsoDate();
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  const handleDownload = () => {
    printCurrentPageAsPdf(`media-kit_${today}`);
  };

  const screenshots = [
    {
      title: "AI Video Generation",
      description: "Kling AI vs Hailuo AI comparison video",
      views: "167K",
      likes: "1992",
      engagement: "High engagement with viral potential",
      image: tiktokHailuoAI
    },
    {
      title: "AI Generated Content",
      description: "FULLY WITH AI Generated content showcase",
      views: "41.4K",
      likes: "1540",
      engagement: "Premium AI automation audience",
      image: tiktokAIGeneratedContent
    },
    {
      title: "New AI Tools",
      description: "VideoCoding AI tool demonstration",
      views: "11.9K",
      likes: "319",
      engagement: "Tech-savvy creator audience",
      image: tiktokCodeWithAI
    },
    {
      title: "Veo 2 AI",
      description: "Latest AI video generation technology",
      views: "7.29K",
      likes: "130",
      engagement: "Early adopter tech audience",
      image: tiktokVeo2AI
    },
    {
      title: "AI Development Tools",
      description: "Runway AI demonstration",
      views: "5.6K",
      likes: "115",
      engagement: "Developer and creator focused",
      image: tiktokRunwayImg
    },
    {
      title: "GPU Technology",
      description: "NVIDIA GPU showcase - premium tech audience",
      views: "4.7K",
      likes: "50",
      engagement: "Quality tech-focused audience",
      image: tiktokGPUTechnology
    }
  ];

  const stats = [
    { number: "167K", label: "Peak Video Views" },
    { number: "87x", label: "Reach Multiplier" },
    { number: "8.2%", label: "Engagement Rate" },
    { number: "341K", label: "Total Views" },
    { number: "6,600+", label: "Total Likes" },
    { number: "1,916", label: "Followers" }
  ];

  const performanceMetrics = [
    { title: "Peak Video Views", value: "167K", subtitle: "Single video performance" },
    { title: "Engagement Rate", value: "8.2%", subtitle: "3x industry average" },
    { title: "Reach Multiplier", value: "87x", subtitle: "Views beyond follower base" },
    { title: "Total Shares", value: "100s", subtitle: "Organic distribution" },
    { title: "Response Time", value: "< 4h", subtitle: "Fast turnaround" },
    { title: "Technical Capability", value: "Full Stack", subtitle: "Content + implementation" }
  ];

  const packages = [
    {
      name: "Package A — Promo Reel",
      subtitle: "Show & Convert",
      price: "€450",
      intro: "€300 (Pilot)",
      description: "A single high-impact 30–45 second Reel/TikTok that demonstrates your tool/service and drives viewers to comment to receive a gated workflow in DM.",
      deliverables: [
        "One vertical Reel/TikTok (30–45s) delivered as MP4",
        "1x cover/thumbnail image (1080×1920)",
        "1 pinned comment CTA text",
        "Comment→DM ManyChat setup",
        "UTM-tagged landing URL",
        "One round of client revision",
        "Post copy + 3 hashtag suggestions"
      ],
      bonus: "€5–€10 per verified signup/lead"
    },
    {
      name: "Package B — Promo + Funnel",
      subtitle: "Convert & Capture",
      price: "€900",
      intro: "€600 (Pilot)",
      description: "Promo Reel + gated workflow that collects emails/leads and automatically sends the sponsored resource (perfect for SaaS & courses).",
      deliverables: [
        "One vertical Reel/TikTok (45–60s) with demo",
        "ManyChat comment→DM flow configured",
        "Landing page or Carrd mini-page",
        "3 follow-up emails pre-written",
        "UTM-enabled affiliate links and tracking",
        "Two rounds of revisions",
        "Post copy + 5 hashtags + 2 story templates"
      ],
      bonus: "€10–€25 per qualified lead"
    },
    {
      name: "Package C — Campaign",
      subtitle: "Launch & Webinar",
      price: "€2,000",
      intro: "€1,200 (Pilot)",
      description: "Complete mini-campaign: 2 Reels, gated workflow, landing page, co-hosted live webinar, and post-campaign performance report.",
      deliverables: [
        "Two vertical videos: teaser (20–30s) + demo (60–90s)",
        "Fully configured funnel with email sequence",
        "Co-hosted webinar setup and hosting",
        "Promotion plan (3 posts + 1 pin + 2 stories)",
        "UTM tracking & conversion reporting",
        "Performance troubleshooting during live week",
        "Final performance report with KPIs"
      ],
      bonus: "Revenue share or per-conversion bonus"
    },
    {
      name: "Package D — Monthly Retainer",
      subtitle: "Ongoing Growth",
      price: "€1,200–€2,500/month",
      intro: "Volume dependent",
      description: "Ongoing content production and management: multiple Reels/month + ManyChat maintenance + campaigns + reporting.",
      deliverables: [
        "8 Reels delivered across the month (2/week)",
        "One campaign (Package B style) per month",
        "Monthly performance reports",
        "ManyChat maintenance & lead routing",
        "Optional co-created webinar/demo per month"
      ],
      bonus: "Minimum 2-month commitment"
    }
  ];

  const fallbackCopy = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert('Pricing copied to clipboard!');
      } else {
        alert('Failed to copy. Please select and copy manually.');
      }
    } catch (err) {
      console.error('Fallback copy failed', err);
      alert('Copy failed. Please select and copy manually.');
    }

    document.body.removeChild(textArea);
  };

  const copyEmailBlock = () => {
    const text = packages.map(pkg =>
      `${pkg.name} — ${pkg.price} (Pilot: ${pkg.intro})\n${pkg.description}\n\nDeliverables:\n${pkg.deliverables.map(d => `• ${d}`).join('\n')}\n\nPerformance Bonus: ${pkg.bonus}`
    ).join('\n\n---\n\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Pricing copied to clipboard! Ready to share with your team.');
      }).catch((err) => {
        console.error('Failed to copy: ', err);
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  };

  return (
    <div className="mk-page print-area">
      <div className="mk-container">
        <div className="mk-header no-print">
          <h1 className="mk-title">Media Kit & Proof Pack</h1>
          <div className="flex gap-3 flex-wrap items-center">
            <button
              onClick={() => {
                document.getElementById('quote-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="mk-btn-primary"
              style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', fontWeight: 'bold' }}
            >
              Get Custom Quote →
            </button>
            <button onClick={handleDownload} className="mk-btn-secondary">
              Download PDF
            </button>
            <Link to="/media-kit-business" className="mk-btn-secondary">
              View Business Media Kit →
            </Link>
          </div>
        </div>

        {/* VISUAL HERO: Actual TikTok Content First! */}
        <div className="mk-glass-card">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-6">
            {/* Left: Minimal text */}
            <div>
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-sm font-bold mb-4 text-white">
                🔥 167K Views on One Video
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Viral AI Content That Drives Real Leads
              </h1>
              <p className="text-xl mk-muted mb-6">
                TikTok creator specializing in AI tools with <span className="mk-highlight">87x reach multiplier</span> and <span className="mk-highlight">8.2% engagement</span> (3x industry average).
              </p>
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => {
                    document.getElementById('proof-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mk-btn-primary"
                >
                  See Proof →
                </button>
                <a
                  href="https://tiktok.com/@ai.wave.rider"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mk-btn-secondary"
                >
                  View TikTok
                </a>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                ⚡ Pilot pricing • 🎯 High-intent AI audience • 💰 Performance bonuses
              </p>
            </div>

            {/* Right: ACTUAL TIKTOK SCREENSHOT */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-pink-500">
                <img
                  src={screenshots[0].image}
                  alt="Viral TikTok Video"
                  className="w-full"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <svg className="w-20 h-20 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                {/* View count badge */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className="text-white font-bold text-lg">{screenshots[0].views}</span>
                </div>
              </div>

              {/* Floating stats */}
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border-2 border-pink-500">
                <div className="text-2xl font-bold text-pink-500">87x</div>
                <div className="text-xs">reach multiplier</div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border-2 border-purple-500">
                <div className="text-2xl font-bold text-purple-500">8.2%</div>
                <div className="text-xs">engagement rate</div>
              </div>
            </div>
          </div>

          {/* Quick info bar */}
          <div className="border-t border-white border-opacity-10 pt-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { icon: '🎯', text: 'AI Tools Niche' },
                { icon: '⚡', text: '< 4h Response' },
                { icon: '🛡️', text: '100% Money-Back' },
                { icon: '📊', text: 'Full Analytics' }
              ].map((item, idx) => (
                <div key={idx} className="mk-stat-card" style={{ padding: '0.75rem', minWidth: 'auto' }}>
                  <span className="text-lg mr-2">{item.icon}</span>
                  <span className="text-xs">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pilot pricing callout */}
          <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-700/50">
            <strong>🎯 Building Portfolio:</strong> Pilot pricing available for AI tool brands. Same viral content + technical setup, reduced investment for first partnerships.
          </div>
        </div>

        {/* VISUAL: Why Sponsor Us (Instead of text block) */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Why AI Tool Brands Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Before: Other Creators */}
            <div className="p-6 rounded-xl bg-red-900/20 border-2 border-red-700/50">
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">❌</div>
                <h3 className="text-xl font-bold">Other Creators</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: '📉', text: 'Low engagement (1-2%)' },
                  { icon: '👥', text: 'General audience, not tech-focused' },
                  { icon: '🎥', text: 'Video only, no funnel setup' },
                  { icon: '❓', text: 'No tracking or lead routing' },
                  { icon: '🐌', text: 'Slow response times' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-red-800/30 flex items-center gap-3">
                    <div className="text-2xl">{item.icon}</div>
                    <div className="text-sm">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* After: AI Waverider */}
            <div className="p-6 rounded-xl bg-green-900/20 border-2 border-green-700/50">
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">✅</div>
                <h3 className="text-xl font-bold">AI Waverider</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: '🚀', text: 'High engagement (8.2%, 3x avg)' },
                  { icon: '🎯', text: 'AI enthusiasts & early adopters' },
                  { icon: '⚙️', text: 'Full funnel: video + ManyChat + tracking' },
                  { icon: '📊', text: 'UTM tags + lead exports included' },
                  { icon: '⚡', text: '< 4h response time' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-green-800/30 flex items-center gap-3">
                    <div className="text-2xl">{item.icon}</div>
                    <div className="text-sm">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow (desktop only) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl hidden md:block">
              →
            </div>
          </div>
        </div>

        {/* VISUAL: Quick Stats 
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Channel Performance</h2>
          <div className="mk-stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="mk-stat-card">
                <span className="mk-stat-number">{stat.number}</span>
                <span className="mk-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="mk-muted">
              <strong>What This Means:</strong> With only 1,916 followers, we reached <span className="mk-highlight">167K people</span> on one video—that's an <span className="mk-highlight">87x multiplier</span>. Your sponsored content gets seen by thousands beyond our immediate audience.
            </p>
          </div>
        </div>*/}

        {/* VISUAL: Top Performing Content (Your Best Section - Keep and Enhance) */}
        <div className="mk-glass-card" id="proof-section">
          <h2 className="mk-section-title">🔥 Viral Content Proof</h2>
          <p className="mk-muted mb-6 text-center">
            Real TikTok videos showing engagement and reach potential for your brand:
          </p>

          {/* Carousel Container */}
          <div className="mk-carousel-container">
            <div className="mk-carousel-main">
              <div className="mk-screenshot-large">
                <div className="mk-video-card">
                  <div className="mk-video-wrapper">
                    <img
                      src={screenshots[currentScreenshot].image}
                      alt={screenshots[currentScreenshot].title}
                      className="mk-video-image"
                    />
                    <div className="mk-play-overlay">
                      <svg className="mk-play-icon" width="64" height="64" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div className="mk-video-footer">
                      <svg className="mk-video-play-small" width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <strong className="mk-video-count">{screenshots[currentScreenshot].views}</strong>
                    </div>
                    {currentScreenshot === 0 && (
                      <div className="mk-video-badge">🔥 Viral</div>
                    )}
                  </div>
                  <div className="mk-video-info">
                    <div className="mk-video-title">{screenshots[currentScreenshot].title}</div>
                    <div className="mk-video-description">{screenshots[currentScreenshot].description}</div>
                    <div className="mk-video-stats">
                      <span className="mk-stat-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        {screenshots[currentScreenshot].likes}
                      </span>
                      <span className="mk-stat-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                        {screenshots[currentScreenshot].views}
                      </span>
                    </div>
                    <div className="mk-video-engagement">{screenshots[currentScreenshot].engagement}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentScreenshot(prev => prev > 0 ? prev - 1 : screenshots.length - 1)}
                className="mk-carousel-btn mk-carousel-prev"
                aria-label="Previous screenshot"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrentScreenshot(prev => prev < screenshots.length - 1 ? prev + 1 : 0)}
                className="mk-carousel-btn mk-carousel-next"
                aria-label="Next screenshot"
              >
                ›
              </button>
            </div>

            <div className="mk-carousel-thumbnails">
              {screenshots.map((screenshot, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentScreenshot(index)}
                  className={`mk-carousel-thumb ${currentScreenshot === index ? 'active' : ''}`}
                >
                  <div className="mk-thumb-image-wrapper">
                    <img src={screenshot.image} alt={screenshot.title} className="mk-thumb-image" />
                    <div className="mk-thumb-overlay">
                      <div className="mk-thumb-views">{screenshot.views}</div>
                    </div>
                  </div>
                  <div className="mk-thumb-title">{screenshot.title}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mk-text mt-6 p-4 bg-white bg-opacity-10 rounded-lg">
            <strong>💡 Why This Matters:</strong> These aren't vanity metrics. Our content reaches <span className="mk-highlight">high-intent AI tool users</span>—exactly the audience looking for solutions like yours. The 87x reach multiplier means your sponsored video gets seen far beyond our 1,916 followers.
          </div>
        </div>

        {/* VISUAL: How It Works Timeline */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">How Sponsorship Works</h2>
          <div className="relative mt-8">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {[
                { num: 1, emoji: '💬', title: 'Quick Chat', desc: '15-min call to discuss your tool', color: 'pink' },
                { num: 2, emoji: '🎬', title: 'Create Content', desc: 'We produce viral TikTok', color: 'purple' },
                { num: 3, emoji: '⚙️', title: 'Setup Funnel', desc: 'ManyChat + tracking in place', color: 'blue' },
                { num: 4, emoji: '📊', title: 'Track Results', desc: 'Daily leads + analytics', color: 'green' }
              ].map((step, idx) => (
                <div key={idx} className="text-center">
                  <div className="relative mx-auto mb-6">
                    <div className={`w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-${step.color}-900 to-${step.color}-700 flex items-center justify-center border-4 border-gray-900 shadow-xl`}>
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

        {/* Performance Dashboard */}
        {/* Performance Dashboard */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Why Our Numbers Matter</h2>

          {/* Story Context - NEW */}
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-700/50">
            <p className="text-sm">
              <strong>The Truth About TikTok Creators:</strong> Most have inflated follower counts but terrible engagement (1-2%).
              We're the opposite—small following, but <span className="mk-highlight">8.2% engagement</span> means our audience
              is <span className="mk-highlight">genuinely interested in AI tools</span>. That's YOUR target market.
            </p>
          </div>

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


        {/* ROI Calculator */}
        <div className="mk-glass-card no-print">
          <ROICalculator />
        </div>

        {/* Package Comparison */}
        <div className="mk-glass-card no-print">
          <PackageComparison />
        </div>

        {/* FAQ - Quick Objection Handling */}
        {/* FAQ - Accordion Style (Interactive + Visual) */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Quick Questions</h2>
          <p className="mk-muted mb-6 text-center text-sm">
            Common questions from brands considering sponsorships
          </p>

          <div className="max-w-3xl mx-auto space-y-3">
            {[
              {
                icon: "🤔",
                q: "What if my product isn't a good fit?",
                a: "We'll tell you honestly on the discovery call. No wasted time. We only work with AI tools we genuinely believe in."
              },
              {
                icon: "🎯",
                q: "Do you guarantee results?",
                a: "We guarantee effort + quality content. Results depend on your product-market fit. 30-day money-back guarantee if you're not satisfied with our work."
              },
              {
                icon: "⚡",
                q: "How long until I see leads?",
                a: "Video goes live within 5-7 days (48-72h with rush add-on). Leads typically start flowing the same day we post."
              },
              {
                icon: "✅",
                q: "Can I see the video before it's posted?",
                a: "Absolutely! You get revision rounds included in every package. We never post without your explicit approval."
              },
              {
                icon: "📊",
                q: "How do you track conversions?",
                a: "UTM tags on all links, daily lead exports from ManyChat, and full performance dashboard access. Complete transparency."
              },
              {
                icon: "💰",
                q: "What about the performance bonus?",
                a: "We track verified signups/leads through your funnel. You pay bonuses weekly via invoice. It's in our interest to drive real results."
              }
            ].map((item, idx) => (
              <details
                key={idx}
                className="group p-4 rounded-lg bg-gradient-to-r from-purple-900/10 to-blue-900/10 border border-white border-opacity-10 hover:border-opacity-30 transition-all cursor-pointer"
              >
                <summary className="flex items-center gap-3 font-bold text-sm list-none">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="flex-1">{item.q}</span>
                  <svg
                    className="w-5 h-5 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-3 ml-11 text-xs text-gray-400 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
        {/* Packages */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Sponsorship Packages</h2>

          {/* Pricing Explanation */}
          <div className="p-6 rounded-lg mb-6 bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-2 border-amber-700/50">
            <div className="flex items-start gap-3 mb-4">
              <div className="text-3xl">💡</div>
              <div>
                <h3 className="font-bold text-xl mb-2">Pilot vs. Standard Pricing</h3>
                <p className="text-sm opacity-90">Building our sponsorship portfolio with AI tool brands.</p>
              </div>
            </div>
            {/* NEW: Scarcity Counter */}
            <div className="p-4 rounded-lg mb-6 bg-gradient-to-r from-red-900/30 to-orange-900/30 border-2 border-red-700/50 text-center">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="text-3xl">⏰</div>
                <div>
                  <div className="text-2xl font-bold text-red-400">50 Pilot Slots Left</div>
                  <div className="text-sm">First partnerships filling fast</div>
                </div>
              </div>
              <div className="text-xs mt-2 opacity-75">
                Once we hit 100 case studies, pilot pricing ends permanently
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-800/50 border-2 border-green-600/50">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-600 text-white">
                  PILOT PRICING
                </span>
                <div className="text-2xl font-bold my-2 text-green-400">€300 - €1,200</div>
                <p className="text-xs text-green-400 font-semibold">⚡ First partnerships</p>
              </div>

              <div className="p-4 rounded-lg bg-gray-800/50 border-2 border-blue-600/50">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
                  STANDARD PRICING
                </span>
                <div className="text-2xl font-bold my-2 text-blue-400">€450 - €2,500</div>
                <p className="text-xs text-blue-400 font-semibold">📅 After case studies</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {packages.map((pkg, index) => (
              <div key={index} className="mk-package-card">
                <div className="mk-package-title">{pkg.name}</div>
                <div className="mk-package-subtitle text-lg mb-2">{pkg.subtitle}</div>
                <div className="mk-package-price">
                  Standard: {pkg.price} | <span className="mk-highlight">Pilot: {pkg.intro}</span>
                </div>
                <div className="mk-package-details mb-4">{pkg.description}</div>

                <div className="mk-text">
                  <strong>Deliverables:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {pkg.deliverables.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mk-muted mt-3 p-3 bg-white bg-opacity-10 rounded-lg">
                  <strong>Performance Bonus:</strong> {pkg.bonus}
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
            <p className="mk-muted mt-2 text-sm">We'll help you choose the best package</p>
          </div>

          {/* Guarantee */}
          <div className="mk-text mt-6 p-4 bg-gradient-to-r from-green-500 from-opacity-20 to-blue-500 to-opacity-20 rounded-lg border border-white border-opacity-20">
            <div className="text-center">
              <div className="text-xl font-bold mb-2">🛡️ Zero Risk Guarantee</div>
              <div>Not satisfied in 30 days? Full refund, no questions asked. We'll over-deliver to earn your testimonial.</div>
            </div>
          </div>
        </div>

        {/* Add-ons (Keep your hover tooltips - they're great!) */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Optional Add-ons</h2>
          <p className="mk-muted mb-4 text-center">
            💡 Hover over each add-on for more details
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { price: '+€150', label: 'Fast Turnaround (48-72h)', title: '⚡ Priority Production', desc: 'Jump to the front of our queue. Delivered within 48-72 hours instead of standard 5-7 days. Perfect for urgent launches.' },
              { price: '+€200-€500', label: 'Extended Usage Rights', title: '📜 Broader Distribution', desc: 'Use beyond social media: ads, website, presentations, trade shows. Includes 6-12 months vs. standard 3 months.' },
              { price: '€80', label: 'Extra Edits (per round)', title: '🎬 Additional Revisions', desc: 'Need more tweaks? Each round covers changes to script, visuals, pacing, music, or any creative elements.' },
              { price: '€250+', label: 'Influencer Seeding', title: '🌟 Amplified Reach', desc: 'We coordinate with 3-5 micro-influencers in your niche. Setup fee covers outreach (influencer fees separate €50-200 each).' },
              { price: '€80-€150', label: 'Custom Voiceover', title: '🎙️ Professional Narration', desc: 'High-quality voiceover in multiple languages. Includes script writing and professional voice talent. €80 for 30-45s, €150 for 60-90s.' },
              { price: '€150+', label: 'Paid Ads Setup', title: '🎯 Ad Campaign Launch', desc: 'Complete TikTok/Instagram/Facebook ad setup. Includes targeting, creative optimization, pixel installation. Ad spend separate.' }
            ].map((addon, idx) => (
              <div key={idx} className="mk-addon-wrapper">
                <div className="mk-stat-card">
                  <div className="mk-stat-number text-lg">{addon.price}</div>
                  <div className="mk-stat-label">{addon.label}</div>
                </div>
                <div className="mk-addon-tooltip">
                  <strong>{addon.title}</strong>
                  <p>{addon.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Wizard */}
        <div className="mk-glass-card" id="quote-section">
          <QuoteWizard />
        </div>

        {/* What Happens Next - Keep but make more visual */}
        <div className="mk-glass-card text-center">
          <h2 className="mk-section-title">✅ What Happens Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            {[
              { icon: '📧', time: '< 4 hours', label: 'We respond to your request' },
              { icon: '💬', time: '15 min', label: 'Discovery call to discuss details' },
              { icon: '🚀', time: '24-48h', label: 'Start production after deposit' }
            ].map((step, idx) => (
              <div key={idx} className="mk-stat-card">
                <div className="text-4xl mb-2">{step.icon}</div>
                <div className="mk-stat-number text-lg">{step.time}</div>
                <div className="mk-stat-label">{step.label}</div>
              </div>
            ))}
          </div>

          <div className="mk-text p-4 bg-white bg-opacity-10 rounded-lg mb-6">
            <strong>Need immediate assistance?</strong><br />
            Email: <a href="mailto:support@aiwaverider.com" className="mk-highlight">support@aiwaverider.com</a>
            {' '}| TikTok DM: <a href="https://tiktok.com/@ai.wave.rider" target="_blank" rel="noopener noreferrer" className="mk-highlight">@ai.wave.rider</a>
          </div>
          {/* Stats Grid - Redundant due to repetition.. 
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: '87x', label: 'Reach' },
              { num: '8.2%', label: 'Engagement' },
              { num: '< 4h', label: 'Response' },
              { num: '100%', label: 'Money-Back' }
            ].map((stat, idx) => (
              <div key={idx} className="mk-stat-card">
                <span className="mk-stat-number text-lg">{stat.num}</span>
                <span className="mk-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>*/}
        </div>

        {/* Direct Contact */}
        <div className="mk-glass-card text-center" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)' }}>
          <h2 className="mk-section-title">⚡ Prefer Direct Contact?</h2>
          <p className="mk-text mb-6">
            Already know what you need? Skip the form and reach out directly.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-6">
            <button
              className="mk-btn-primary"
              onClick={() => window.location.href = 'mailto:support@aiwaverider.com?subject=Partnership Inquiry&body=Hi AI Waverider team,%0D%0A%0D%0AI\'m interested in discussing a partnership. Here are my details:%0D%0A%0D%0ACompany: %0D%0AIndustry: %0D%0ABudget Range: %0D%0ATimeline: %0D%0A%0D%0ALooking forward to connecting!'}
            >
              Email Us Directly
            </button>
            <button onClick={copyEmailBlock} className="mk-btn-secondary">
              📋 Copy Pricing
            </button>
          </div>

          <div className="mk-text text-sm opacity-75">
            Perfect for sharing with your team or stakeholders
          </div>
        </div>

        {/* Contact & Terms */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Contact & Terms</h2>
          <div className="mk-text space-y-4 text-sm">
            <div>
              <strong>Payment:</strong> 50% deposit to start • Remaining 50% on delivery • Performance bonuses paid weekly
            </div>
            <div>
              <strong>Usage Rights:</strong> Social media posting included • Extended rights available as add-on • Exclusive rights +30%
            </div>
            <div>
              <strong>Tracking:</strong> UTM tags for all links • Daily/weekly lead exports • Full performance reporting included
            </div>
            <div>
              <strong>Contact:</strong> support@aiwaverider.com | TikTok: @ai.wave.rider | Response: Within 4 hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaKitPage;