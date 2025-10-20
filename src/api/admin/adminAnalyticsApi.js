import { api } from '../core/apiConfig';

/**
 * Admin Analytics API functions
 * Handles all analytics-related API calls for admin dashboard
 */

/**
 * Get dashboard statistics (revenue, users, agents, orders)
 * @returns {Promise<Object>} - Dashboard stats data
 */
export const getDashboardStats = async () => {
  try {
    console.log('[API] Fetching dashboard stats');
    const response = await api.get('/api/admin/dashboard-stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Get detailed analytics data for a specific time range
 * @param {string} timeRange - Time range ('week', 'month', 'year')
 * @returns {Promise<Object>} - Analytics data
 */
export const getAnalyticsData = async (timeRange = 'week') => {
  try {
    console.log(`[API] Fetching analytics data for ${timeRange}`);
    const response = await api.get(`/api/admin/analytics?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};

/**
 * Get visitor analytics data
 * @param {string} timeRange - Time range ('week', 'month', 'year')
 * @returns {Promise<Object>} - Visitor analytics data
 */
export const getVisitorAnalytics = async (timeRange = 'week') => {
  try {
    console.log(`[API] Fetching visitor analytics for ${timeRange}`);
    const response = await api.get(`/api/admin/analytics/visitors?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching visitor analytics:', error);
    throw error;
  }
};

/**
 * Get revenue analytics data
 * @param {string} timeRange - Time range ('week', 'month', 'year')
 * @returns {Promise<Object>} - Revenue analytics data
 */
export const getRevenueAnalytics = async (timeRange = 'week') => {
  try {
    console.log(`[API] Fetching revenue analytics for ${timeRange}`);
    const response = await api.get(`/api/admin/analytics/revenue?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    throw error;
  }
};

/**
 * Get user analytics data
 * @param {string} timeRange - Time range ('week', 'month', 'year')
 * @returns {Promise<Object>} - User analytics data
 */
export const getUserAnalytics = async (timeRange = 'week') => {
  try {
    console.log(`[API] Fetching user analytics for ${timeRange}`);
    const response = await api.get(`/api/admin/analytics/users?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    throw error;
  }
};

/**
 * Get download analytics data
 * @param {string} timeRange - Time range ('week', 'month', 'year')
 * @returns {Promise<Object>} - Download analytics data
 */
export const getDownloadAnalytics = async (timeRange = 'week') => {
  try {
    console.log(`[API] Fetching download analytics for ${timeRange}`);
    const response = await api.get(`/api/admin/analytics/downloads?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching download analytics:', error);
    throw error;
  }
};

/**
 * Get top performing agents
 * @param {string} timeRange - Time range ('week', 'month', 'year')
 * @param {number} limit - Number of agents to return
 * @returns {Promise<Object>} - Top agents data
 */
export const getTopAgents = async (timeRange = 'week', limit = 10) => {
  try {
    console.log(`[API] Fetching top agents for ${timeRange}, limit: ${limit}`);
    const response = await api.get(`/api/admin/analytics/top-agents?timeRange=${timeRange}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top agents:', error);
    throw error;
  }
};

/**
 * Track a page view for analytics
 * @param {string} page - Page name/route
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<Object>} - Tracking response
 */
export const trackPageView = async (page, metadata = {}) => {
  try {
    console.log(`[API] Tracking page view: ${page}`);
    const response = await api.post('/api/analytics/track-view', {
      page,
      metadata,
      timestamp: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error tracking page view:', error);
    // Don't throw error for tracking - it shouldn't break the app
    return { success: false, error: error.message };
  }
};

/**
 * Track a product view for analytics
 * @param {string} productId - Product/Agent ID
 * @returns {Promise<Object>} - Tracking response
 */
export const trackProductView = async (productId) => {
  try {
    console.log(`[API] Tracking product view: ${productId}`);
    const response = await api.post('/api/recommendations/track-view', {
      productId
    });
    return response.data;
  } catch (error) {
    console.error('Error tracking product view:', error);
    // Don't throw error for tracking - it shouldn't break the app
    return { success: false, error: error.message };
  }
};

/**
 * Get detailed user information for analytics
 * @param {string} timeRange - Time range ('week', 'month', 'year')
 * @returns {Promise<Object>} - Detailed user information
 */
export const getDetailedUserInfo = async (timeRange = 'week') => {
  try {
    console.log(`[API] Fetching detailed user info for ${timeRange}`);
    const response = await api.get(`/api/admin/analytics/detailed-users?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching detailed user info:', error);
    throw error;
  }
};
