import React, { useState, useEffect } from 'react';

const ROICalculator = () => {
  const [budget, setBudget] = useState(2000);
  const [currentLeadCost, setCurrentLeadCost] = useState(50);
  const [conversionRate, setConversionRate] = useState(2);
  const [avgDealValue, setAvgDealValue] = useState(5000);
  const [results, setResults] = useState(null);

  const calculateROI = () => {
    // Our typical performance metrics
    const ourLeadCost = 15; // €15 per lead vs their €50
    const ourConversionRate = 8.2; // 8.2% vs their 2%
    const campaignLeads = Math.floor(budget / ourLeadCost);
    const campaignConversions = Math.floor(campaignLeads * (ourConversionRate / 100));
    const revenue = campaignConversions * avgDealValue;
    const roi = ((revenue - budget) / budget) * 100;
    
    // Their current performance
    const theirLeads = Math.floor(budget / currentLeadCost);
    const theirConversions = Math.floor(theirLeads * (conversionRate / 100));
    const theirRevenue = theirConversions * avgDealValue;
    const theirROI = ((theirRevenue - budget) / budget) * 100;

    setResults({
      campaignLeads,
      campaignConversions,
      revenue,
      roi,
      improvement: roi - theirROI,
      extraRevenue: revenue - theirRevenue,
      theirLeads,
      theirConversions,
      theirRevenue,
      theirROI
    });
  };

  useEffect(() => {
    calculateROI();
  }, [budget, currentLeadCost, conversionRate, avgDealValue]);

  return (
    <div className="mk-calculator">
      <h3 className="mk-section-title text-lg mb-4">ROI Calculator</h3>
      <p className="mk-muted mb-4">
        See how our proven system compares to your current lead generation:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mk-text block mb-2">Monthly Budget (€)</label>
          <input
            type="number"
            className="mk-calculator-input"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            min="500"
            max="50000"
            step="100"
          />
        </div>
        
        <div>
          <label className="mk-text block mb-2">Current Cost per Lead (€)</label>
          <input
            type="number"
            className="mk-calculator-input"
            value={currentLeadCost}
            onChange={(e) => setCurrentLeadCost(Number(e.target.value))}
            min="1"
            max="200"
            step="5"
          />
        </div>
        
        <div>
          <label className="mk-text block mb-2">Current Conversion Rate (%)</label>
          <input
            type="number"
            className="mk-calculator-input"
            value={conversionRate}
            onChange={(e) => setConversionRate(Number(e.target.value))}
            min="0.1"
            max="50"
            step="0.1"
          />
        </div>
        
        <div>
          <label className="mk-text block mb-2">Average Deal Value (€)</label>
          <input
            type="number"
            className="mk-calculator-input"
            value={avgDealValue}
            onChange={(e) => setAvgDealValue(Number(e.target.value))}
            min="100"
            max="100000"
            step="100"
          />
        </div>
      </div>

      {results && (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Performance */}
            <div className="mk-calculator-result bg-opacity-20" style={{background: 'rgba(239, 68, 68, 0.2)'}}>
              <h4 className="font-bold text-lg mb-2" style={{color: 'white'}}>Your Current System</h4>
              <div className="space-y-2 text-sm">
                <div>Leads: {results.theirLeads}</div>
                <div>Conversions: {results.theirConversions}</div>
                <div>Revenue: €{results.theirRevenue.toLocaleString()}</div>
                <div>ROI: {results.theirROI.toFixed(0)}%</div>
              </div>
            </div>

            {/* Our Performance */}
            <div className="mk-calculator-result">
              <h4 className="font-bold text-lg mb-2" style={{color: '#1f2937'}}>With AI Waverider</h4>
              <div className="space-y-2 text-sm" style={{color: '#1f2937'}}>
                <div>Leads: {results.campaignLeads}</div>
                <div>Conversions: {results.campaignConversions}</div>
                <div>Revenue: €{results.revenue.toLocaleString()}</div>
                <div>ROI: {results.roi.toFixed(0)}%</div>
              </div>
            </div>
          </div>

          {/* Improvement Summary */}
          <div className="mk-calculator-result mt-4">
            <h4 className="font-bold text-xl mb-3" style={{color: '#1f2937'}}>Projected Improvement</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold" style={{color: '#1f2937'}}>
                  +{results.improvement.toFixed(0)}%
                </div>
                <div className="text-sm" style={{color: '#6b7280'}}>ROI Improvement</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{color: '#1f2937'}}>
                  €{results.extraRevenue.toLocaleString()}
                </div>
                <div className="text-sm" style={{color: '#6b7280'}}>Extra Revenue</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{color: '#1f2937'}}>
                  {Math.floor(results.campaignLeads / results.theirLeads * 10) / 10}x
                </div>
                <div className="text-sm" style={{color: '#6b7280'}}>More Leads</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ROICalculator;
