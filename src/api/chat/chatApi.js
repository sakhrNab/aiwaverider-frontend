// src/api/chat/chatApi.js

import { api, getAuthHeaders } from '../core/apiConfig';
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * Chat API service for handling communication with the AI assistant
 */
export const chatApi = {
  /**
   * Send a message to the chat API and get a response
   * @param {Array} messages - Array of message objects with role and content properties
   * @returns {Promise} - Promise that resolves to the API response
   */
  sendMessage: async (messages) => {
    try {
      // Filter out any error messages before sending to API
      const filteredMessages = messages.filter(msg => msg.role !== 'error');
      
      // Get auth headers for the request
      const headers = await getAuthHeaders();
      
      // Make a direct fetch call with proper error handling
      // This approach gives us more control over the request
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: filteredMessages
        }),
        credentials: 'include' // Include cookies for cross-origin requests
      });
      
      // Check if the response was successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chat API Error:', errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
      
      // Parse the JSON response
      const data = await response.json();
      
      return {
        success: true,
        message: data.message || data.response || data.reply || 'No response content',
        data
      };
    } catch (error) {
      console.error('Error in chat API:', error);
      
      // Provide a fallback response if the API is unavailable
      if (error.message && (error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError') || 
          error.message.includes('Network request failed'))) {
        return {
          success: true, // Return success to prevent UI error
          message: "I'm currently having trouble connecting to my knowledge base. Please check your internet connection or try again later. In the meantime, you can browse our website for information about AI Waverider's services and offerings.",
          isFallback: true
        };
      }
      
      // Return a structured error response
      return {
        success: false,
        message: error.message || 'Failed to get response from chat API',
        error
      };
    }
  },
  
  /**
   * Get chat history for the current user
   * @returns {Promise} - Promise that resolves to the chat history
   */
  getChatHistory: async () => {
    try {
      const response = await api.get('/api/chat/history');
      return {
        success: true,
        history: response.data.history || []
      };
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return {
        success: false,
        history: [],
        error
      };
    }
  },
  
  /**
   * Clear the chat history for the current user
   * @returns {Promise} - Promise that resolves to the API response
   */
  clearChatHistory: async () => {
    try {
      const response = await api.delete('/api/chat/history');
      return {
        success: true,
        message: response.data.message || 'Chat history cleared'
      };
    } catch (error) {
      console.error('Error clearing chat history:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to clear chat history',
        error
      };
    }
  }
};

export default chatApi;
