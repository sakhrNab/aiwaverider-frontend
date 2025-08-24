import React from 'react';

const PackageComparison = () => {
  const features = [
    { name: 'Vertical Video Content', a: true, b: true, c: true, d: true },
    { name: 'Professional Editing', a: true, b: true, c: true, d: true },
    { name: 'ManyChat Automation', a: true, b: true, c: true, d: true },
    { name: 'UTM Tracking', a: true, b: true, c: true, d: true },
    { name: 'Landing Page Creation', a: false, b: true, c: true, d: true },
    { name: 'Email Automation (3+)', a: false, b: true, c: true, d: true },
    { name: 'Multiple Videos', a: false, b: false, c: true, d: true },
    { name: 'Live Webinar Hosting', a: false, b: false, c: true, d: true },
    { name: 'Multi-Channel Promotion', a: false, b: false, c: true, d: true },
    { name: 'Detailed Analytics', a: false, b: false, c: true, d: true },
    { name: 'Monthly Content (8+ Reels)', a: false, b: false, c: false, d: true },
    { name: 'Ongoing Optimization', a: false, b: false, c: false, d: true },
    { name: 'Priority Support', a: false, b: false, c: false, d: true },
    { name: 'Strategy Consultation', a: false, b: false, c: false, d: true }
  ];

  const packages = [
    { id: 'a', name: 'Promo Reel', price: '€450', popular: false },
    { id: 'b', name: 'Promo + Funnel', price: '€900', popular: true },
    { id: 'c', name: 'Campaign', price: '€2,000', popular: false },
    { id: 'd', name: 'Monthly Retainer', price: '€1,200+/mo', popular: false }
  ];

  const CheckIcon = () => (
    <span className="mk-feature-check">✓</span>
  );

  const CrossIcon = () => (
    <span className="mk-feature-cross">✗</span>
  );

  return (
    <div className="mk-comparison-table">
      <h3 className="mk-section-title text-lg mb-4 p-4">Package Feature Comparison</h3>
      
      {/* Header */}
      <div className="mk-comparison-header">
        <div className="font-semibold">Features</div>
        {packages.map(pkg => (
          <div key={pkg.id} className="text-center">
            <div className="font-semibold">{pkg.name}</div>
            <div className="text-sm mt-1 text-yellow-300">{pkg.price}</div>
            {pkg.popular && (
              <div className="text-xs mt-1 bg-yellow-500 text-black px-2 py-1 rounded-full inline-block">
                Most Popular
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feature Rows */}
      {features.map((feature, index) => (
        <div key={index} className="mk-comparison-row">
          <div className="font-medium">{feature.name}</div>
          <div>{feature.a ? <CheckIcon /> : <CrossIcon />}</div>
          <div>{feature.b ? <CheckIcon /> : <CrossIcon />}</div>
          <div>{feature.c ? <CheckIcon /> : <CrossIcon />}</div>
          <div>{feature.d ? <CheckIcon /> : <CrossIcon />}</div>
        </div>
      ))}

      {/* Package Benefits */}
      <div className="p-4 border-t border-white border-opacity-10">
        <h4 className="font-semibold mb-3">Key Differentiators:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Package A:</strong> Perfect for testing our system with a single high-impact video
          </div>
          <div>
            <strong>Package B:</strong> Complete lead generation funnel with proven 8.2% conversion rate
          </div>
          <div>
            <strong>Package C:</strong> Full campaign with live webinar for maximum engagement and sales
          </div>
          <div>
            <strong>Package D:</strong> Ongoing partnership for sustained growth and optimization
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageComparison;
