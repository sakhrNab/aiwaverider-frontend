import React, { useState, useEffect } from 'react';
import { 
  FaChartLine, 
  FaChartBar, 
  FaChartPie, 
  FaCalendarAlt,
  FaExclamationTriangle,
  FaSpinner,
  FaEye,
  FaDownload
} from 'react-icons/fa';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  getAnalyticsData
} from '../../api/admin/adminAnalyticsApi';
import './AdminAnalyticsPage.css';

/**
 * Admin Analytics page with charts and metrics
 */
const Analytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [metrics, setMetrics] = useState({
    sales: { total: 0, data: [] },
    users: { total: 0, new: 0, active: 0, data: [] },
    agents: { total: 0, free: 0, paid: 0, downloads: 0 },
    orders: { total: 0, revenue: 0, data: [] },
    visitors: { total: 0, data: [] }
  });
  const [topAgents, setTopAgents] = useState([]);
  const [detailedUserInfo, setDetailedUserInfo] = useState({
    users: [],
    agents: [],
    orders: [],
    visitors: []
  });
  const [userActivity, setUserActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  
  // Fetch analytics data on component mount and when timeRange changes
  useEffect(() => {
    fetchAnalyticsData(timeRange);
  }, [timeRange]);
  
  // Function to fetch analytics data
  const fetchAnalyticsData = async (range) => {
    // TEMPORARILY DISABLED CACHE FOR TESTING
    const now = Date.now();
    // if (now - lastFetchTime < 30000 && topAgents.length > 0 && timeRange === range) {
    //   return;
    // }
    
    setLoading(true);
    try {
      // Fetch consolidated analytics data (includes everything)
      const analyticsResponse = await getAnalyticsData(range);
      
      if (analyticsResponse.success) {
        const data = analyticsResponse.data;
        
        // Set metrics (includes detailed user info)
        setMetrics(data);
        
        // Set top agents from the consolidated data
        setTopAgents(data.topAgents || []);
        
        // Set detailed user info from the consolidated data
        setDetailedUserInfo({
          users: data.users.detailed || [],
          agents: data.agents.detailed || [],
          orders: data.orders.detailed || [],
          visitors: data.visitors.detailed || []
        });
        
        // Set user activity data
        setUserActivity(data.userActivity || []);
      } else {
        setError('Failed to load analytics data');
      }
      
      setLastFetchTime(now);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate the maximum value for the chart
  const getMaxValue = (data) => {
    return Math.max(...data.map(item => item.value)) * 1.2;
  };
  
  return (
    <AdminLayout>
      <div className="analytics-page">
        <header className="page-header">
          <h1>Analytics Dashboard</h1>
          <div className="time-range-selector">
            <button 
              className={timeRange === 'week' ? 'active' : ''} 
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button 
              className={timeRange === 'month' ? 'active' : ''} 
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button 
              className={timeRange === 'year' ? 'active' : ''} 
              onClick={() => setTimeRange('year')}
            >
              Year
            </button>
          </div>
        </header>
        
        {error && (
          <div className="error-message">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}
        
        {loading ? (
          <div className="loading-message">Loading analytics data...</div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon sales">
                  <FaChartLine />
                </div>
                <div className="metric-content">
                  <h3>Total Revenue</h3>
                  <div className="metric-value">
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      formatCurrency(metrics.sales.total)
                    )}
                  </div>
                  <div className="metric-label">Last {timeRange}</div>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon users">
                  <FaChartBar />
                </div>
                <div className="metric-content">
                  <h3>Total Users</h3>
                  <div className="metric-value">
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      metrics.users.total
                    )}
                  </div>
                  <div className="metric-label">{metrics.users.new} new users</div>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon agents">
                  <FaChartPie />
                </div>
                <div className="metric-content">
                  <h3>Total Agents</h3>
                  <div className="metric-value">
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      metrics.agents.total
                    )}
                  </div>
                  <div className="metric-label">{metrics.agents.free} free, {metrics.agents.paid} paid</div>
                </div>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon visitors">
                  <FaEye />
                </div>
                <div className="metric-content">
                  <h3>Visitors</h3>
                  <div className="metric-value">
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      metrics.visitors.total
                    )}
                  </div>
                  <div className="metric-label">Page views last {timeRange}</div>
                </div>
              </div>
            </div>
            
            {/* Charts Section */}
            <div className="charts-section">
              <div className="chart-container">
                <h2>Revenue Trend</h2>
                <div className="chart">
                  <div className="chart-bars">
                    {metrics.sales.data.map((item, index) => (
                      <div 
                        key={index} 
                        className="chart-bar"
                        style={{ 
                          height: `${(item.value / getMaxValue(metrics.sales.data)) * 100}%` 
                        }}
                      >
                        <div className="tooltip">{formatCurrency(item.value)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="chart-labels">
                    {metrics.sales.data.map((item, index) => (
                      <div key={index} className="chart-label">{item.label}</div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="chart-container">
                <h2>User Growth</h2>
                <div className="chart">
                  <div className="chart-bars">
                    {metrics.users.data.map((item, index) => (
                      <div 
                        key={index} 
                        className="chart-bar user-growth"
                        style={{ 
                          height: `${(item.value / getMaxValue(metrics.users.data)) * 100}%` 
                        }}
                      >
                        <div className="tooltip">{item.value} users</div>
                      </div>
                    ))}
                  </div>
                  <div className="chart-labels">
                    {metrics.users.data.map((item, index) => (
                      <div key={index} className="chart-label">{item.label}</div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="chart-container">
                <h2>Visitors Trend</h2>
                <div className="chart">
                  <div className="chart-bars">
                    {metrics.visitors.data.map((item, index) => (
                      <div 
                        key={index} 
                        className="chart-bar visitors"
                        style={{ 
                          height: `${(item.value / getMaxValue(metrics.visitors.data)) * 100}%` 
                        }}
                      >
                        <div className="tooltip">{item.value} visitors</div>
                      </div>
                    ))}
                  </div>
                  <div className="chart-labels">
                    {metrics.visitors.data.map((item, index) => (
                      <div key={index} className="chart-label">{item.label}</div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="chart-container">
                <h2>Agent Downloads Trend</h2>
                <div className="chart">
                  <div className="chart-bars">
                    {topAgents.slice(0, 7).map((agent, index) => (
                      <div 
                        key={agent.id} 
                        className="chart-bar downloads"
                        style={{ 
                          height: `${(agent.downloads / Math.max(...topAgents.slice(0, 7).map(a => a.downloads))) * 100}%` 
                        }}
                      >
                        <div className="tooltip">{agent.downloads} downloads</div>
                      </div>
                    ))}
                  </div>
                  <div className="chart-labels">
                    {topAgents.slice(0, 7).map((agent, index) => (
                      <div key={agent.id} className="chart-label" title={agent.name}>
                        {agent.name.length > 15 ? agent.name.substring(0, 15) + '...' : agent.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Top Agents Table */}
            <div className="top-agents-section">
              <h2>Top Performing Agents</h2>
              <table className="top-agents-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Agent Name</th>
                    <th>Downloads</th>
                    <th>Revenue</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {topAgents.length > 0 ? (
                    topAgents.map((agent, index) => (
                      <tr key={agent.id}>
                        <td>{index + 1}</td>
                        <td>{agent.name}</td>
                        <td>{agent.downloads}</td>
                        <td>{formatCurrency(agent.revenue)}</td>
                        <td>
                          <span className={`agent-type ${agent.isFree ? 'free' : 'paid'}`}>
                            {agent.isFree ? 'Free' : 'Paid'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                        {loading ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <FaSpinner className="animate-spin" />
                            Loading top agents...
                          </div>
                        ) : (
                          <div>
                            <p>No agent data available</p>
                            <p style={{ fontSize: '12px', marginTop: '4px' }}>
                              Debug: topAgents.length = {topAgents.length}
                            </p>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
      {/* Comprehensive User Activity Table */}
      <div className="comprehensive-user-activity-section">
        <h2>User Activity Overview</h2>
        <div className="user-activity-table-container">
          <table className="user-activity-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Agent Name</th>
                <th>Download/Purchase</th>
                <th>Revenue</th>
                <th>Nr of Visits</th>
                <th>Last Time Visited</th>
                <th>Last Time Logged In</th>
              </tr>
            </thead>
            <tbody>
              {userActivity.length > 0 ? (
                userActivity.slice(0, 20).map((user, index) => (
                  <tr key={user.userId}>
                    <td className="rank-cell">
                      <span className={`rank-badge rank-${user.rank <= 3 ? user.rank : 'other'}`}>
                        #{user.rank}
                      </span>
                    </td>
                    <td className="user-cell">
                      <div className="user-info">
                        <div className="user-email">{user.userEmail}</div>
                        <div className="user-username">{user.username}</div>
                      </div>
                    </td>
                    <td className="agent-cell">{user.agentName}</td>
                    <td className="activity-cell">{user.downloadPurchase}</td>
                    <td className="revenue-cell">${user.revenue.toFixed(2)}</td>
                    <td className="visits-cell">{user.numberOfVisits}</td>
                    <td className="date-cell">
                      {user.lastTimeVisited 
                        ? new Date(user.lastTimeVisited.seconds * 1000).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="date-cell">
                      {user.lastTimeLoggedIn 
                        ? new Date(user.lastTimeLoggedIn.seconds * 1000).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    {loading ? 'Loading user activity...' : 'No user activity data available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed User Information */}
      <div className="detailed-user-info-section">
        <h2>Detailed User Information</h2>
              
              {/* Recent Users */}
              <div className="user-info-card">
                <h3>Recent Users ({detailedUserInfo.users.length})</h3>
                <div className="user-list">
                  {detailedUserInfo.users.length > 0 ? (
                    detailedUserInfo.users.slice(0, 10).map((user, index) => (
                      <div key={user.id} className="user-item">
                        <div className="user-email">{user.email}</div>
                        <div className="user-username">{user.username}</div>
                        <div className="user-role">{user.role}</div>
                        <div className="user-date">
                          {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No recent users found</p>
                  )}
                </div>
              </div>
              
              {/* Recent Downloads */}
              <div className="user-info-card">
                <h3>Recent Downloads ({detailedUserInfo.agents.length})</h3>
                <div className="download-list">
                  {detailedUserInfo.agents.length > 0 ? (
                    detailedUserInfo.agents.slice(0, 10).map((download, index) => (
                      <div key={download.id} className="download-item">
                        <div className="download-agent">{download.agentName}</div>
                        <div className="download-user">User: {download.userId}</div>
                        <div className="download-type">{download.agentType}</div>
                        <div className="download-date">
                          {download.downloadDate ? new Date(download.downloadDate.seconds * 1000).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No recent downloads found</p>
                  )}
                </div>
              </div>
              
              {/* Recent Purchases */}
              <div className="user-info-card">
                <h3>Recent Purchases ({detailedUserInfo.orders.length})</h3>
                <div className="purchase-list">
                  {detailedUserInfo.orders.length > 0 ? (
                    detailedUserInfo.orders.slice(0, 10).map((purchase, index) => (
                      <div key={purchase.id} className="purchase-item">
                        <div className="purchase-agent">{purchase.agentName}</div>
                        <div className="purchase-user">User: {purchase.userId}</div>
                        <div className="purchase-amount">{formatCurrency(purchase.amount)}</div>
                        <div className="purchase-date">
                          {purchase.purchaseDate ? new Date(purchase.purchaseDate.seconds * 1000).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No recent purchases found</p>
                  )}
                </div>
              </div>
              
              {/* Recent Visits */}
              <div className="user-info-card">
                <h3>Recent Visits ({detailedUserInfo.visitors.length})</h3>
                <div className="visit-list">
                  {detailedUserInfo.visitors.length > 0 ? (
                    detailedUserInfo.visitors.slice(0, 10).map((visit, index) => (
                      <div key={visit.id} className="visit-item">
                        <div className="visit-page">{visit.pagePath}</div>
                        <div className="visit-user">User: {visit.userId}</div>
                        <div className="visit-product">{visit.productId ? `Product: ${visit.productId}` : 'General visit'}</div>
                        <div className="visit-date">
                          {visit.visitDate ? new Date(visit.visitDate.seconds * 1000).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No recent visits found</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Analytics; 