import React from 'react';
import '../styles/marketing-pages.css';
import { getTodayIsoDate, printCurrentPageAsPdf } from '../utils/pdf';
import ROICalculator from '../components/marketing/ROICalculator';
import PackageComparison from '../components/marketing/PackageComparison';
import QuoteWizard from '../components/marketing/QuoteWizard';

const PackagePricingPage = () => {
  const today = getTodayIsoDate();

  const packages = [
    {
      name: "Promo Reel (A)",
      price: "€450",
      intro: "€300 (Pilot)",
      details: "30–45s Reel + ManyChat comment→DM + 1 revision",
      description: "Single high-impact vertical video with automated DM workflow",
      deliverables: [
        "30-45s vertical video (MP4)",
        "Thumbnail image (1080×1920)",
        "ManyChat automation setup",
        "UTM tracking links",
        "1 revision round",
        "Post copy + hashtags"
      ],
      bonus: "€5-€10 per verified lead"
    },
    {
      name: "Promo + Funnel (B)",
      price: "€900",
      intro: "€600 (Pilot)",
      details: "45–60s Reel + landing page + email nurture + lead delivery",
      description: "Complete lead generation funnel with email automation",
      deliverables: [
        "45-60s demo video",
        "Custom landing page",
        "ManyChat flow with email capture",
        "3 automated follow-up emails",
        "UTM tracking & analytics",
        "2 revision rounds",
        "Social media templates"
      ],
      bonus: "€10-€25 per qualified lead"
    },
    {
      name: "Campaign (C)",
      price: "€2,000",
      intro: "€1,200 (Pilot)",
      details: "2 Reels + webinar co-host + funnel + full reporting",
      description: "Full campaign with live webinar and comprehensive funnel",
      deliverables: [
        "2 videos: teaser + demo",
        "Complete email funnel",
        "Live webinar co-hosting",
        "Registration & replay pages",
        "Multi-channel promotion",
        "Performance tracking",
        "Detailed analytics report"
      ],
      bonus: "Revenue share or conversion bonus"
    },
    {
      name: "Monthly Retainer (D)",
      price: "€1,200-€2,500/month",
      intro: "Volume dependent",
      details: "Ongoing Reels + 1 campaign + reporting",
      description: "Continuous content production and funnel management",
      deliverables: [
        "8+ Reels per month",
        "1 campaign per month",
        "Monthly analytics reports",
        "ManyChat maintenance",
        "Strategy optimization",
        "Priority support"
      ],
      bonus: "2-month minimum commitment"
    }
  ];

  const copyEmailBlock = () => {
    const text = packages.map(pkg => 
      `${pkg.name} — ${pkg.price} — ${pkg.details}`
    ).join('\n');
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Pricing copied to clipboard!');
      }).catch((err) => {
        console.error('Failed to copy: ', err);
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  };

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

  const handleDownload = () => {
    printCurrentPageAsPdf(`package-pricing_${today}`);
  };

  return (
    <div className="mk-page print-area">
      <div className="mk-container">
        <div className="mk-header no-print">
          <h1 className="mk-title">Package Pricing Table</h1>
          <div className="mk-button-group">
            <button onClick={copyEmailBlock} className="mk-btn-secondary">
              Copy Email Version
            </button>
            <button onClick={handleDownload} className="mk-btn-primary">
              Download PDF
            </button>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="mk-glass-card">
          <ROICalculator />
        </div>

        {/* Package Comparison Matrix */}
        <div className="mk-glass-card">
          <PackageComparison />
        </div>

        {/* Quick Reference Table */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Quick Reference</h2>
          <div className="mk-table-container">
            <table className="mk-table">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Standard Price</th>
                  <th>Pilot Price</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg, index) => (
                  <tr key={index}>
                    <td className="font-semibold">{pkg.name}</td>
                    <td className="font-semibold text-yellow-300">{pkg.price}</td>
                    <td className="font-semibold text-green-300">{pkg.intro}</td>
                    <td>{pkg.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mk-text mt-4 p-4 bg-white bg-opacity-10 rounded-lg">
            <strong className="mk-highlight">Limited Time:</strong> New clients get <span className="mk-pulse">pilot pricing</span> + performance guarantee. 
            Book your campaign in the next 7 days and lock in these rates!
          </div>
        </div>

        {/* Detailed Package Cards */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Detailed Package Information</h2>
          <div className="space-y-6">
            {packages.map((pkg, index) => (
              <div key={index} className="mk-package-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="mk-package-title">{pkg.name}</div>
                    <div className="mk-package-details text-base">{pkg.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="mk-package-price">{pkg.price}</div>
                    <div className="mk-muted text-sm">Pilot: {pkg.intro}</div>
                  </div>
                </div>
                
                <div className="mk-text">
                  <strong>What's Included:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {pkg.deliverables.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mk-muted mt-4 p-3 bg-white bg-opacity-10 rounded-lg">
                  <strong>Performance Bonus:</strong> {pkg.bonus}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Optional Add-ons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="mk-stat-card">
              <div className="mk-stat-number text-lg">+€150</div>
              <div className="mk-stat-label">Fast Turnaround (48-72h)</div>
            </div>
            <div className="mk-stat-card">
              <div className="mk-stat-number text-lg">+€200-€500</div>
              <div className="mk-stat-label">Extended Usage Rights</div>
            </div>
            <div className="mk-stat-card">
              <div className="mk-stat-number text-lg">€80</div>
              <div className="mk-stat-label">Extra Edits (per round)</div>
            </div>
            <div className="mk-stat-card">
              <div className="mk-stat-number text-lg">€250+</div>
              <div className="mk-stat-label">Influencer Seeding</div>
            </div>
            <div className="mk-stat-card">
              <div className="mk-stat-number text-lg">€80-€150</div>
              <div className="mk-stat-label">Custom Voiceover</div>
            </div>
            <div className="mk-stat-card">
              <div className="mk-stat-number text-lg">€150+</div>
              <div className="mk-stat-label">Paid Ads Setup</div>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="mk-glass-card">
          <h2 className="mk-section-title">Payment Terms & Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mk-text">
              <strong>Payment Structure:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>50% deposit to reserve production slot</li>
                <li>Remaining 50% due on delivery</li>
                <li>Performance bonuses paid weekly</li>
                <li>Bank transfer, PayPal, or Stripe accepted</li>
              </ul>
            </div>
            <div className="mk-text">
              <strong>What You Get:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Professional video content</li>
                <li>Complete automation setup</li>
                <li>UTM tracking & analytics</li>
                <li>Performance reporting</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quote Wizard */}
        <div className="mk-glass-card">
          <QuoteWizard />
        </div>

        {/* Contact CTA */}
        <div className="mk-glass-card text-center">
          <h2 className="mk-section-title">Ready to Get Started?</h2>
          <p className="mk-text mb-6">
            Contact us to discuss your specific needs and get a custom quote.
            All packages can be adapted to your brand and goals.
          </p>
          
          {/* Trust signals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="mk-stat-card">
              <span className="mk-stat-number text-lg">96%</span>
              <span className="mk-stat-label">Client Satisfaction</span>
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
            <button className="mk-btn-primary" onClick={() => window.location.href = 'mailto:support@aiwaverider.com'}>
              Contact for Quote
            </button>
            <button onClick={copyEmailBlock} className="mk-btn-secondary">
              Copy Pricing for Email
            </button>
          </div>
          
          <div className="mk-text mt-4 text-sm opacity-75">
            🔒 Your information is secure and never shared with third parties
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagePricingPage;


