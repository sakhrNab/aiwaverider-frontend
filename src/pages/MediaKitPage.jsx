import React, { useState } from 'react';
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

  // Screenshots data with actual TikTok metrics (sorted by views)
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
    { number: "1,916", label: "Followers" },
    { number: "6,600+", label: "Total Likes" },
    { number: "167K", label: "Peak Video Views" },
    { number: "341K", label: "Total Post Views" },
    { number: "8.2%", label: "Engagement Rate" },
    { number: "87x", label: "Reach Multiplier" }
  ];

  const performanceMetrics = [
    { title: "Peak Video Views", value: "167K", subtitle: "Single video performance" },
    { title: "Engagement Rate", value: "8.2%", subtitle: "3x industry average" },
    { title: "Reach Multiplier", value: "87x", subtitle: "Views beyond follower base" },
    { title: "Total Shares", value: "100s", subtitle: "Organic content distribution" },
    { title: "Response Time", value: "< 4h", subtitle: "Fast turnaround guaranteed" },
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
          <div className="flex gap-3">
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
          </div>
        </div>

        {/* Channel Header */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">ai.wave.rider — AI Waverider</h2>
          <p className="mk-text text-lg">AI Tools & Hacks | Unlock AI's Power</p>
          <p className="mk-muted mt-2">
            Creator specializing in viral AI automation content, marketing workflows, and no-code solutions.
            Recent viral video reached <span className="mk-highlight">167K views</span> with an audience that actively engages at <span className="mk-highlight">3x industry average rates</span>.
          </p>

          <div className="mk-muted mt-3 p-3 bg-white bg-opacity-10 rounded-lg">
            <strong>Building Case Study Portfolio:</strong> Limited pilot pricing available for brands ready to test our unique combination of viral content + technical implementation.
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="mk-stat-card" style={{ padding: '0.75rem', minWidth: 'auto' }}>
              <span className="mk-stat-number text-sm">87x</span>
              <span className="mk-stat-label text-xs">Reach Multiplier</span>
            </div>
            <div className="mk-stat-card" style={{ padding: '0.75rem', minWidth: 'auto' }}>
              <span className="mk-stat-number text-sm">100%</span>
              <span className="mk-stat-label text-xs">Money-Back Guarantee</span>
            </div>
            <div className="mk-stat-card" style={{ padding: '0.75rem', minWidth: 'auto' }}>
              <span className="mk-stat-number text-sm">&lt; 4h</span>
              <span className="mk-stat-label text-xs">Response Time</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Channel Statistics</h2>
          <div className="mk-stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="mk-stat-card">
                <span className="mk-stat-number">{stat.number}</span>
                <span className="mk-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Top Performing Content (Proof)</h2>
          <p className="mk-muted mb-4">
            Recent viral content showing audience engagement and reach potential:
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
                    {/* Play button overlay */}
                    <div className="mk-play-overlay">
                      <svg className="mk-play-icon" width="64" height="64" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    {/* Video footer with stats */}
                    <div className="mk-video-footer">
                      <svg className="mk-video-play-small" width="18" height="18" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <strong className="mk-video-count">{screenshots[currentScreenshot].views}</strong>
                    </div>
                    {/* Pinned badge */}
                    {currentScreenshot === 0 && (
                      <div className="mk-video-badge">Pinned</div>
                    )}
                  </div>
                  {/* Video info below */}
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

              {/* Navigation buttons */}
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

            {/* Thumbnail navigation */}
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

          <div className="mk-text mt-4">
            <strong>Performance Note:</strong> AI Video Generation comparison reached 167K views (87x our follower base) and drove significant
            profile visits, demonstrating strong organic reach potential in the AI automation niche.
          </div>
        </div>

        {/* Performance Dashboard */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Real Performance Metrics</h2>
          <p className="mk-muted mb-4">
            Verified data from our TikTok channel showing content performance and engagement:
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

          <div className="mk-text mt-4 p-4 bg-white bg-opacity-10 rounded-lg">
            <strong>Why These Numbers Matter:</strong> With only 1,916 followers, we've achieved 167K views on a single video (87x reach multiplier) and maintain 8.2% engagement—3x the industry average of 2-3%. This demonstrates our content resonates beyond our immediate audience and reaches high-intent viewers in the AI tools space.
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

        {/* Packages */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Sponsorship Packages</h2>
          <p className="mk-muted mb-4">
            <strong>Pilot Pricing Available:</strong> We're building our case study portfolio with select AI tool brands.
            Standard pricing shown with introductory pilot rates for first partnerships.
          </p>
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
            <p className="mk-muted mt-2 text-sm">We'll help you choose the best fit for your goals</p>
          </div>

          {/* Risk Reversal */}
          <div className="mk-text mt-6 p-4 bg-gradient-to-r from-green-500 from-opacity-20 to-blue-500 to-opacity-20 rounded-lg border border-white border-opacity-20">
            <div className="text-center">
              <div className="text-xl font-bold mb-2">🛡️ Zero Risk Guarantee</div>
              <div>Not satisfied with results in the first 30 days? Get a full refund, no questions asked. We'll over-deliver to earn your testimonial.</div>
            </div>
          </div>
        </div>

        {/* Add-ons */}
{/* Add-ons */}
<div className="mk-glass-card">
  <h2 className="mk-section-title">Optional Add-ons</h2>
  <p className="mk-muted mb-4 text-center">
    💡 Hover over each add-on for more details
  </p>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Fast Turnaround */}
    <div className="mk-addon-wrapper">
      <div className="mk-stat-card">
        <div className="mk-stat-number text-lg">+€150</div>
        <div className="mk-stat-label">Fast Turnaround (48-72h)</div>
      </div>
      <div className="mk-addon-tooltip">
        <strong>⚡ Priority Production</strong>
        <p>Jump to the front of our queue. Your content will be delivered within 48-72 hours instead of the standard 5-7 day timeline. Perfect for urgent launches or time-sensitive campaigns.</p>
      </div>
    </div>

    {/* Extended Usage Rights */}
    <div className="mk-addon-wrapper">
      <div className="mk-stat-card">
        <div className="mk-stat-number text-lg">+€200-€500</div>
        <div className="mk-stat-label">Extended Usage Rights</div>
      </div>
      <div className="mk-addon-tooltip">
        <strong>📜 Broader Distribution</strong>
        <p>Use the content beyond social media: ads, website, presentations, trade shows, etc. Includes longer posting duration (6-12 months vs. standard 3 months) and multi-platform rights.</p>
      </div>
    </div>

    {/* Extra Edits */}
    <div className="mk-addon-wrapper">
      <div className="mk-stat-card">
        <div className="mk-stat-number text-lg">€80</div>
        <div className="mk-stat-label">Extra Edits (per round)</div>
      </div>
      <div className="mk-addon-tooltip">
        <strong>🎬 Additional Revisions</strong>
        <p>Need more tweaks beyond included revisions? Each extra round covers changes to script, visuals, pacing, music, or any creative elements. Get it exactly right.</p>
      </div>
    </div>

    {/* Influencer Seeding */}
    <div className="mk-addon-wrapper">
      <div className="mk-stat-card">
        <div className="mk-stat-number text-lg">€250+</div>
        <div className="mk-stat-label">Influencer Seeding</div>
      </div>
      <div className="mk-addon-tooltip">
        <strong>🌟 Amplified Reach</strong>
        <p>We'll identify and coordinate with 3-5 micro-influencers in your niche to share your content. Setup fee covers outreach and coordination. Influencer fees separate (typically €50-200 each).</p>
      </div>
    </div>

    {/* Custom Voiceover */}
    <div className="mk-addon-wrapper">
      <div className="mk-stat-card">
        <div className="mk-stat-number text-lg">€80-€150</div>
        <div className="mk-stat-label">Custom Voiceover</div>
      </div>
      <div className="mk-addon-tooltip">
        <strong>🎙️ Professional Narration</strong>
        <p>High-quality voiceover in English or other languages. Includes script writing, professional voice talent, and multiple takes. €80 for 30-45s, €150 for 60-90s videos.</p>
      </div>
    </div>

    {/* Paid Ads Setup */}
    <div className="mk-addon-wrapper">
      <div className="mk-stat-card">
        <div className="mk-stat-number text-lg">€150+</div>
        <div className="mk-stat-label">Paid Ads Setup</div>
      </div>
      <div className="mk-addon-tooltip">
        <strong>🎯 Ad Campaign Launch</strong>
        <p>Complete setup of TikTok/Instagram/Facebook ad campaigns. Includes audience targeting, ad creative optimization, pixel installation, and initial campaign structure. Ad spend separate.</p>
      </div>
    </div>
  </div>
</div>


        {/* Quote Wizard */}
        <div className="mk-glass-card" id="quote-section">
          <QuoteWizard />
        </div>

        {/* What Happens Next */}
        <div className="mk-glass-card text-center">
          <h2 className="mk-section-title">✅ What Happens Next?</h2>
          <p className="mk-text mb-6">
            Once you submit your quote request above, here's what you can expect:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="mk-stat-card">
              <div className="text-3xl mb-2">📧</div>
              <div className="mk-stat-number text-lg">&lt; 4 hours</div>
              <div className="mk-stat-label">We'll respond to your request</div>
            </div>
            <div className="mk-stat-card">
              <div className="text-3xl mb-2">💬</div>
              <div className="mk-stat-number text-lg">15 min</div>
              <div className="mk-stat-label">Discovery call to discuss details</div>
            </div>
            <div className="mk-stat-card">
              <div className="text-3xl mb-2">🚀</div>
              <div className="mk-stat-number text-lg">24-48h</div>
              <div className="mk-stat-label">Start production after deposit</div>
            </div>
          </div>

          <div className="mk-text p-4 bg-white bg-opacity-10 rounded-lg mb-6">
            <strong>Need immediate assistance?</strong> We're available multiple ways:<br />
            Email:{' '}
            <a href="mailto:support@aiwaverider.com" className="mk-highlight" style={{ textDecoration: 'underline' }}>
              support@aiwaverider.com
            </a>
            {' '}| TikTok DM:{' '}
            <a href="https://tiktok.com/@ai.wave.rider" target="_blank" rel="noopener noreferrer" className="mk-highlight" style={{ textDecoration: 'underline' }}>
              @ai.wave.rider
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mk-stat-card">
              <span className="mk-stat-number text-lg">87x</span>
              <span className="mk-stat-label">Viral Reach Potential</span>
            </div>
            <div className="mk-stat-card">
              <span className="mk-stat-number text-lg">100%</span>
              <span className="mk-stat-label">Money-Back Guarantee</span>
            </div>
          </div>

          <div className="mk-text mt-6 text-sm opacity-75">
            🔒 Your information is secure and never shared with third parties
          </div>
        </div>

        {/* Prefer Direct Contact - Express Lane */}
        <div className="mk-glass-card text-center" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)' }}>
          <h2 className="mk-section-title">⚡ Prefer Direct Contact?</h2>
          <p className="mk-text mb-6">
            Already know what you need? Skip the form and reach out directly, or grab our pricing to share with your team.
          </p>

          {/* Trust signals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="mk-stat-card">
              <span className="mk-stat-number text-lg">87x</span>
              <span className="mk-stat-label">Viral Reach Potential</span>
            </div>
            <div className="mk-stat-card">
              <span className="mk-stat-number text-lg">&lt; 4h</span>
              <span className="mk-stat-label">Response Time</span>
            </div>
            <div className="mk-stat-card">
              <span className="mk-stat-number text-lg">100%</span>
              <span className="mk-stat-label">Money-Back Guarantee</span>
            </div>
          </div>

          <div className="mk-button-group justify-center">
            <button
              className="mk-btn-primary"
              onClick={() => window.location.href = 'mailto:support@aiwaverider.com?subject=Partnership Inquiry&body=Hi AI Waverider team,%0D%0A%0D%0AI\'m interested in discussing a partnership. Here are my details:%0D%0A%0D%0ACompany: %0D%0AIndustry: %0D%0ABudget Range: %0D%0ATimeline: %0D%0A%0D%0ALooking forward to connecting!'}
            >
              Email Us Directly
            </button>
            <button onClick={copyEmailBlock} className="mk-btn-secondary">
              📋 Copy Pricing for Email
            </button>
          </div>

          <div className="mk-text mt-4 text-sm opacity-75">
            Perfect for sharing with stakeholders or your procurement team
          </div>
        </div>

        {/* Contact & Terms */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Contact & Payment Terms</h2>
          <div className="mk-text space-y-4">
            <div>
              <strong>Payment Structure:</strong><br />
              • 50% deposit to begin production<br />
              • Remaining 50% due on delivery<br />
              • Performance bonuses paid weekly via invoice
            </div>

            <div>
              <strong>Usage Rights:</strong><br />
              • Social media posting included for specified duration<br />
              • Extended usage rights available as add-on<br />
              • Exclusive rights +30% with 2-3 weeks lead time
            </div>

            <div>
              <strong>Tracking & Reporting:</strong><br />
              • UTM tags for all links<br />
              • Daily/weekly lead exports provided<br />
              • Full performance reporting included
            </div>

            <div>
              <strong>Contact:</strong><br />
              • Email: support@aiwaverider.com<br />
              • TikTok: @ai.wave.rider<br />
              • Response time: Within 24 hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaKitPage;