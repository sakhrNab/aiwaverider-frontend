import React, { useState } from 'react';

const QuoteWizard = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    budget: '',
    goals: [],
    company: '',
    email: '',
    timeline: '',
    industry: ''
  });

  const steps = [
    { id: 1, title: 'Budget' },
    { id: 2, title: 'Goals' },
    { id: 3, title: 'Details' },
    { id: 4, title: 'Contact' }
  ];

  const budgetOptions = [
    { value: '500-1000', label: '€500 - €1,000', package: 'Package A - Promo Reel' },
    { value: '1000-2000', label: '€1,000 - €2,000', package: 'Package B - Promo + Funnel' },
    { value: '2000-5000', label: '€2,000 - €5,000', package: 'Package C - Campaign' },
    { value: '5000+', label: '€5,000+', package: 'Package D - Monthly Retainer' }
  ];

  const goalOptions = [
    'Lead Generation',
    'Brand Awareness',
    'Product Launch',
    'Event Promotion',
    'Sales Conversion',
    'Community Building'
  ];

  const industryOptions = [
    'SaaS/Technology',
    'E-commerce',
    'Professional Services',
    'Education/Training',
    'Healthcare',
    'Finance',
    'Other'
  ];

  const timelineOptions = [
    'ASAP (Rush - +€200)',
    '1-2 weeks',
    '2-4 weeks',
    'Flexible timing'
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const subject = `Quote Request - ${formData.company}`;
    const body = `
Hi AI Waverider team,

I'm interested in getting a quote for your services. Here are my details:

Company: ${formData.company}
Industry: ${formData.industry}
Budget Range: ${formData.budget}
Goals: ${formData.goals.join(', ')}
Timeline: ${formData.timeline}

Looking forward to hearing from you!

Best regards,
${formData.email}
    `.trim();

    window.location.href = `mailto:support@aiwaverider.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  return (
    <div className="mk-quote-wizard">
      <h3 className="mk-section-title text-lg mb-4">Get Your Custom Quote</h3>
      
      {/* Progress Bar */}
      <div className="mk-wizard-progress">
        {steps.map(s => (
          <div
            key={s.id}
            className={`mk-wizard-step ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}
          >
            {step > s.id ? '✓' : s.id}
          </div>
        ))}
      </div>

      <div className="mk-wizard-content">
        {/* Step 1: Budget */}
        {step === 1 && (
          <div>
            <h4 className="mk-text text-lg font-semibold mb-4">What's your budget range?</h4>
            <div className="space-y-3">
              {budgetOptions.map(option => (
                <div
                  key={option.value}
                  className={`mk-feature-toggle ${formData.budget === option.value ? 'selected' : ''}`}
                  onClick={() => updateFormData('budget', option.value)}
                >
                  <div>
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-yellow-300">{option.package}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <div>
            <h4 className="mk-text text-lg font-semibold mb-4">What are your main goals? (Select all that apply)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goalOptions.map(goal => (
                <div
                  key={goal}
                  className={`mk-feature-toggle ${formData.goals.includes(goal) ? 'selected' : ''}`}
                  onClick={() => toggleGoal(goal)}
                >
                  <span>{goal}</span>
                  <div className={`mk-toggle-switch ${formData.goals.includes(goal) ? 'active' : ''}`}></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div>
            <h4 className="mk-text text-lg font-semibold mb-4">Tell us about your project</h4>
            <div className="space-y-4">
              <div>
                <label className="mk-text block mb-2">Industry</label>
                <select
                  className="mk-calculator-input"
                  value={formData.industry}
                  onChange={(e) => updateFormData('industry', e.target.value)}
                >
                  <option value="">Select your industry</option>
                  {industryOptions.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="mk-text block mb-2">Timeline</label>
                <select
                  className="mk-calculator-input"
                  value={formData.timeline}
                  onChange={(e) => updateFormData('timeline', e.target.value)}
                >
                  <option value="">Select your timeline</option>
                  {timelineOptions.map(timeline => (
                    <option key={timeline} value={timeline}>{timeline}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Contact */}
        {step === 4 && (
          <div>
            <h4 className="mk-text text-lg font-semibold mb-4">Contact Information</h4>
            <div className="space-y-4">
              <div>
                <label className="mk-text block mb-2">Company Name</label>
                <input
                  type="text"
                  className="mk-calculator-input"
                  value={formData.company}
                  onChange={(e) => updateFormData('company', e.target.value)}
                  placeholder="Your company name"
                />
              </div>
              
              <div>
                <label className="mk-text block mb-2">Email Address</label>
                <input
                  type="email"
                  className="mk-calculator-input"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              {/* Summary */}
              <div className="mk-calculator-result mt-6">
                <h5 className="font-semibold mb-3" style={{color: '#1f2937'}}>Quote Summary</h5>
                <div className="text-sm space-y-2" style={{color: '#4b5563'}}>
                  <div><strong>Budget:</strong> {formData.budget}</div>
                  <div><strong>Goals:</strong> {formData.goals.join(', ')}</div>
                  <div><strong>Industry:</strong> {formData.industry}</div>
                  <div><strong>Timeline:</strong> {formData.timeline}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mk-wizard-buttons">
        <button
          className="mk-btn-secondary"
          onClick={handlePrev}
          disabled={step === 1}
          style={{opacity: step === 1 ? 0.5 : 1}}
        >
          Previous
        </button>
        
        {step === 4 ? (
          <button
            className="mk-btn-primary"
            onClick={handleSubmit}
            disabled={!formData.company || !formData.email}
            style={{opacity: (!formData.company || !formData.email) ? 0.5 : 1}}
          >
            Get Quote
          </button>
        ) : (
          <button
            className="mk-btn-primary"
            onClick={handleNext}
            disabled={
              (step === 1 && !formData.budget) ||
              (step === 2 && formData.goals.length === 0) ||
              (step === 3 && (!formData.industry || !formData.timeline))
            }
            style={{
              opacity: (
                (step === 1 && !formData.budget) ||
                (step === 2 && formData.goals.length === 0) ||
                (step === 3 && (!formData.industry || !formData.timeline))
              ) ? 0.5 : 1
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuoteWizard;
