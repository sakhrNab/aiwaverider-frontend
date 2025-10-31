import React, { useState, useEffect } from 'react';

const ROICalculator = () => {
  const [followers, setFollowers] = useState(2000);
  const [avgViews, setAvgViews] = useState(500);
  const [currentEngagement, setCurrentEngagement] = useState(2);
  const [results, setResults] = useState(null);

  // Fixed input handlers to allow deletion without sticky zeros
  const handleFollowersChange = (e) => {
    const value = e.target.value;
    if (value === '' || value === '0') {
      setFollowers('');
    } else {
      setFollowers(Math.max(100, Number(value)));
    }
  };

  const handleViewsChange = (e) => {
    const value = e.target.value;
    if (value === '' || value === '0') {
      setAvgViews('');
    } else {
      setAvgViews(Math.max(50, Number(value)));
    }
  };

  const handleEngagementChange = (e) => {
    const value = e.target.value;
    if (value === '' || value === '0') {
      setCurrentEngagement('');
    } else {
      setCurrentEngagement(Math.max(0.1, Number(value)));
    }
  };

  // Auto-fill minimum values on blur if empty
  const handleFollowersBlur = () => {
    if (followers === '' || followers < 100) setFollowers(100);
  };

  const handleViewsBlur = () => {
    if (avgViews === '' || avgViews < 50) setAvgViews(50);
  };

  const handleEngagementBlur = () => {
    if (currentEngagement === '' || currentEngagement < 0.1) setCurrentEngagement(0.1);
  };

  const calculatePotential = () => {
    // Handle empty or invalid inputs
    const validFollowers = Number(followers) || 100;
    const validViews = Number(avgViews) || 50;
    const validEngagement = Number(currentEngagement) || 0.1;

    // Our proven metrics (conservative)
    const ourReachMultiplier = 50; // Conservative (we hit 87x, using 50x to be safe)
    const ourEngagementRate = 8.2; // Proven metric
    
    // Their current performance
    const theirReachMultiplier = validViews / validFollowers;
    const theirCurrentReach = validFollowers * theirReachMultiplier;
    const theirEngagementCount = Math.floor(theirCurrentReach * (validEngagement / 100));
    
    // With our approach (conservative projection)
    const ourProjectedReach = validFollowers * ourReachMultiplier;
    const ourEngagementCount = Math.floor(ourProjectedReach * (ourEngagementRate / 100));
    
    // Improvements
    const reachImprovement = ((ourProjectedReach - theirCurrentReach) / theirCurrentReach * 100);
    const engagementImprovement = ((ourEngagementCount - theirEngagementCount) / (theirEngagementCount || 1) * 100);
    const extraEngagement = ourEngagementCount - theirEngagementCount;

    // Cap extreme percentages for credibility
    const cappedReachImprovement = Math.min(reachImprovement, 2000);
    const isExceptional = reachImprovement > 2000;

    setResults({
      theirCurrentReach: Math.floor(theirCurrentReach),
      theirEngagementCount,
      theirReachMultiplier: theirReachMultiplier.toFixed(1),
      ourProjectedReach: Math.floor(ourProjectedReach),
      ourEngagementCount,
      reachImprovement: cappedReachImprovement.toFixed(0),
      engagementImprovement: engagementImprovement.toFixed(0),
      extraEngagement,
      ourReachMultiplier,
      isExceptional
    });
  };

  useEffect(() => {
    calculatePotential();
  }, [followers, avgViews, currentEngagement]);

  return (
    <div className="mk-calculator">
      <h3 className="mk-section-title text-lg mb-4">Reach Potential Calculator</h3>
      <p className="mk-muted mb-4">
        Based on our proven 87x reach multiplier and 8.2% engagement rate, see your potential reach improvement:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="mk-text block mb-2">Your Brand's Current Followers</label>
          <input
            type="number"
            className="mk-calculator-input"
            value={followers}
            onChange={handleFollowersChange}
            onBlur={handleFollowersBlur}
            min="100"
            max="100000"
            step="100"
            placeholder="2000"
          />
        </div>
        
        <div>
          <label className="mk-text block mb-2">Your Typical Video Views</label>
          <input
            type="number"
            className="mk-calculator-input"
            value={avgViews}
            onChange={handleViewsChange}
            onBlur={handleViewsBlur}
            min="50"
            max="500000"
            step="50"
            placeholder="500"
          />
        </div>
        
        <div>
          <label className="mk-text block mb-2">Your Current Engagement Rate (%)</label>
          <input
            type="number"
            className="mk-calculator-input"
            value={currentEngagement}
            onChange={handleEngagementChange}
            onBlur={handleEngagementBlur}
            min="0.1"
            max="20"
            step="0.1"
            placeholder="2.0"
          />
        </div>
      </div>

      {results && (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Performance - Red tint for "problem" */}
            <div className="mk-calculator-result" style={{background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">📉</span>
                <h4 className="font-bold text-lg" style={{color: 'white'}}>Without Our Approach</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div>Average Reach: <strong>{results.theirCurrentReach.toLocaleString()}</strong> views</div>
                <div>Engagement Actions: <strong>{results.theirEngagementCount.toLocaleString()}</strong></div>
                <div>Reach Multiplier: <strong>{results.theirReachMultiplier}x</strong></div>
              </div>
            </div>

            {/* Projected with Us - Bright gold for "solution" */}
            <div className="mk-calculator-result" style={{background: 'rgba(234, 179, 8, 0.95)', border: '1px solid rgba(234, 179, 8, 1)'}}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🚀</span>
                <h4 className="font-bold text-lg" style={{color: '#1f2937'}}>With AI Waverider</h4>
              </div>
              <div className="space-y-2 text-sm" style={{color: '#1f2937'}}>
                <div>Projected Reach: <strong>{results.ourProjectedReach.toLocaleString()}</strong> views</div>
                <div>Engagement Actions: <strong>{results.ourEngagementCount.toLocaleString()}</strong></div>
                <div>Reach Multiplier: <strong>{results.ourReachMultiplier}x</strong> (conservative)</div>
              </div>
            </div>
          </div>

          {/* Improvement Summary */}
          <div className="mk-calculator-result mt-4">
            <h4 className="font-bold text-xl mb-3" style={{color: '#1f2937'}}>Potential Improvement</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold" style={{color: '#1f2937'}}>
                  {results.isExceptional ? '+2,000%+' : `+${results.reachImprovement}%`}
                </div>
                <div className="text-sm" style={{color: '#6b7280'}}>More Reach</div>
                {results.isExceptional && (
                  <div className="text-xs mt-1" style={{color: '#991b1b'}}>
                    ⚡ Exceptional improvement
                  </div>
                )}
              </div>
              <div>
                <div className="text-2xl font-bold" style={{color: '#1f2937'}}>
                  +{results.extraEngagement.toLocaleString()}
                </div>
                <div className="text-sm" style={{color: '#6b7280'}}>Extra Engagements</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{color: '#1f2937'}}>
                  {results.ourReachMultiplier}x
                </div>
                <div className="text-sm" style={{color: '#6b7280'}}>Reach Multiplier</div>
              </div>
            </div>
          </div>
          
          <div className="mk-text mt-4 p-4 bg-white bg-opacity-10 rounded-lg text-sm">
            <strong>Note:</strong> These projections are based on our verified 167K video (87x reach) and 8.2% engagement rate. 
            We use conservative 50x multiplier for calculations. Actual results depend on content quality, audience fit, and niche factors. 
            <span className="mk-highlight"> Pilot packages let you test this approach with minimal risk.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ROICalculator;