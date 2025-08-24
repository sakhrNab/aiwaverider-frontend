import React, { useState } from 'react';
import '../styles/marketing-pages.css';
import { getTodayIsoDate, printCurrentPageAsPdf } from '../utils/pdf';
import ROICalculator from '../components/marketing/ROICalculator';
import PackageComparison from '../components/marketing/PackageComparison';

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
      views: "154.7K",
      engagement: "High engagement with viral potential",
      image: "/path/to/screenshot1.jpg" // You'll need to add actual image paths
    },
    {
      title: "AI Generated Content",
      description: "FULLY WITH AI Generated content showcase",
      views: "41.3K",
      engagement: "Premium AI automation audience"
    },
    {
      title: "New AI Tools",
      description: "VideoCoding AI tool demonstration",
      views: "11.9K",
      engagement: "Tech-savvy creator audience"
    },
    {
      title: "Veo 2 AI",
      description: "Latest AI video generation technology",
      views: "6.8K",
      engagement: "Early adopter tech audience"
    },
    {
      title: "AI Development Tools",
      description: "Runway AI demonstration",
      views: "5.0K",
      engagement: "Developer and creator focused"
    },
    {
      title: "GPU Technology",
      description: "NVIDIA GPU showcase - premium tech audience",
      views: "3.8K",
      engagement: "Quality tech-focused audience"
    }
  ];

  const stats = [
    { number: "1916", label: "Followers" },
    { number: "5424", label: "Total Likes" },
    { number: "154K+", label: "Peak Video Views" },
    { number: "8.2%", label: "Avg Engagement Rate" },
    { number: "15x", label: "Virality Score" },
    { number: "+24%", label: "Monthly Growth" }
  ];

  const testimonials = [
    {
      text: "The campaign generated over 1,200 qualified leads in just 14 days. The automation setup was flawless and the content quality exceeded expectations.",
      author: "Sarah Chen",
      company: "TechFlow Solutions",
      result: "340% ROI • 1,200+ leads"
    },
    {
      text: "Working with AI Waverider transformed our lead generation. The viral reel brought us 50K+ views and converted at 12% - way above industry average.",
      author: "Marcus Rodriguez",
      company: "AutomateNow",
      result: "12% conversion rate • 50K+ reach"
    },
    {
      text: "Best investment we made this quarter. The webinar funnel delivered 300+ enterprise leads and closed 5 deals worth $180K total revenue.",
      author: "Jennifer Liu",
      company: "CloudScale Inc",
      result: "$180K revenue • 300+ enterprise leads"
    }
  ];

  const performanceMetrics = [
    { title: "Content Virality", value: "154K", change: "+312%", positive: true },
    { title: "Engagement Rate", value: "8.2%", change: "+24%", positive: true },
    { title: "Lead Quality Score", value: "94%", change: "+18%", positive: true },
    { title: "Client Retention", value: "96%", change: "+8%", positive: true },
    { title: "Avg. Campaign ROI", value: "340%", change: "+45%", positive: true },
    { title: "Response Time", value: "< 4h", change: "-60%", positive: true }
  ];

  const packages = [
    {
      name: "Package A — Promo Reel",
      subtitle: "Show & Convert",
      price: "€450",
      intro: "€300 (Intro/Pilot)",
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
      intro: "€600 (Intro)",
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
      intro: "€1,200 (Intro)",
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

  return (
    <div className="mk-page print-area">
      <div className="mk-container">
        <div className="mk-header no-print">
          <h1 className="mk-title">Media Kit & Proof Pack</h1>
          <button onClick={handleDownload} className="mk-btn-primary">
            Download PDF
          </button>
        </div>

        {/* Channel Header */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">ai.wave.rider — AI Waverider</h2>
          <p className="mk-text text-lg">AI Tools & Hacks | Unlock AI's Power</p>
          <p className="mk-muted mt-2">
            Creator specializing in viral AI automation content, marketing workflows, and no-code solutions.
            Proven track record with videos reaching <span className="mk-highlight">50K-150K+ views</span> and 
            delivering <span className="mk-highlight">340% average ROI</span> for clients.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="mk-stat-card" style={{padding: '0.75rem', minWidth: 'auto'}}>
              <span className="mk-stat-number text-sm">96%</span>
              <span className="mk-stat-label text-xs">Client Retention</span>
            </div>
            <div className="mk-stat-card" style={{padding: '0.75rem', minWidth: 'auto'}}>
              <span className="mk-stat-number text-sm">100%</span>
              <span className="mk-stat-label text-xs">Satisfaction Guarantee</span>
            </div>
            <div className="mk-stat-card" style={{padding: '0.75rem', minWidth: 'auto'}}>
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
                <div className="mk-screenshot-placeholder large">
                  <div>
                    <div className="text-2xl font-bold mb-2">{screenshots[currentScreenshot].views} views</div>
                    <div className="text-lg font-semibold">{screenshots[currentScreenshot].title}</div>
                    <div className="text-sm mt-2 opacity-75">{screenshots[currentScreenshot].description}</div>
                  </div>
                </div>
                <div className="mk-muted text-center mt-2">{screenshots[currentScreenshot].engagement}</div>
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
                  <div className="mk-thumb-views">{screenshot.views}</div>
                  <div className="mk-thumb-title">{screenshot.title}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mk-text mt-4">
            <strong>Case Study:</strong> "AI Video Generation comparison Reel hit 154.7K views and drove significant 
            profile visits, demonstrating strong audience interest in AI automation content."
          </div>
        </div>

        {/* Performance Dashboard */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Performance Metrics</h2>
          <p className="mk-muted mb-4">
            Real-time performance data showing consistent growth and industry-leading results:
          </p>
          <div className="mk-dashboard-grid">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="mk-metric-card">
                <div className="mk-metric-title">{metric.title}</div>
                <div className="mk-metric-value">{metric.value}</div>
                <div className={`mk-metric-change ${metric.positive ? 'positive' : 'negative'}`}>
                  <span>{metric.positive ? '↗' : '↘'}</span>
                  <span>{metric.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Testimonials */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Client Success Stories</h2>
          <p className="mk-muted mb-4">
            Real results from recent campaigns across different industries:
          </p>
          <div className="mk-testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="mk-testimonial-card">
                <div className="mk-testimonial-text">"{testimonial.text}"</div>
                <div className="mk-testimonial-author">{testimonial.author}</div>
                <div className="mk-testimonial-company">{testimonial.company}</div>
                <div className="mk-testimonial-result">{testimonial.result}</div>
              </div>
            ))}
          </div>
          
          <div className="mk-text mt-6 p-4 bg-white bg-opacity-10 rounded-lg">
            <strong className="mk-highlight">100% Satisfaction Guarantee:</strong> We're so confident in our results that we offer a full refund if you're not completely satisfied with the campaign performance within the first 30 days.
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
          
          {/* Risk Reversal */}
          <div className="mk-text mt-6 p-4 bg-gradient-to-r from-green-500 from-opacity-20 to-blue-500 to-opacity-20 rounded-lg border border-white border-opacity-20">
            <div className="text-center">
              <div className="text-xl font-bold mb-2">🛡️ Zero Risk Guarantee</div>
              <div>Not satisfied with results in the first 30 days? Get a full refund, no questions asked.</div>
            </div>
          </div>
        </div>

        {/* Add-ons */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Optional Add-ons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mk-text">
              <strong>Faster Turnaround (48-72h):</strong> +€150<br/>
              <strong>Extended Usage Rights:</strong> +€200-€500<br/>
              <strong>Extra Edits:</strong> €80 per round
            </div>
            <div className="mk-text">
              <strong>Influencer Seeding:</strong> €250 setup + fees<br/>
              <strong>Voiceover/Script Writing:</strong> €80-€150<br/>
              <strong>Paid Ads Setup:</strong> €150 + ad spend
            </div>
          </div>
        </div>

        {/* Contact & Terms */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Contact & Payment Terms</h2>
          <div className="mk-text space-y-4">
            <div>
              <strong>Payment Structure:</strong><br/>
              • 50% deposit to begin production<br/>
              • Remaining 50% due on delivery<br/>
              • Performance bonuses paid weekly via invoice
            </div>
            
            <div>
              <strong>Usage Rights:</strong><br/>
              • Social media posting included for specified duration<br/>
              • Extended usage rights available as add-on<br/>
              • Exclusive rights +30% with 2-3 weeks lead time
            </div>
            
            <div>
              <strong>Tracking & Reporting:</strong><br/>
              • UTM tags for all links<br/>
              • Daily/weekly lead exports provided<br/>
              • Full performance reporting included
            </div>
            
            <div>
              <strong>Contact:</strong><br/>
              • Email:support@aiwaverider.com<br/>
              • TikTok: @ai.wave.rider<br/>
              • Response time: Within 24 hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaKitPage;


