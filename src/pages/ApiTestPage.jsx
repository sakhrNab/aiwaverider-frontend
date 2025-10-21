import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiTestPage = () => {
  const [status, setStatus] = useState('idle');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [promptId, setPromptId] = useState('aNlBYTxPgXlDAKQkyEWP');

  // Function to test API endpoints
  const testApi = async (endpoint) => {
    setStatus('loading');
    setError(null);
    try {
      // console.log(`Testing API endpoint: ${endpoint}`);
      const result = await axios.get(endpoint);
      // console.log('API response:', result);
      setResponse(result.data);
      setStatus('success');
      return result.data;
    } catch (err) {
      console.error('API test error:', err);
      const errorDetails = {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      };
      setError(errorDetails);
      setStatus('error');
      return null;
    }
  };

  const handleGetAllTools = () => {
    testApi('/api/ai-tools');
  };

  const handleGetPrompt = () => {
    testApi(`/api/ai-tools/${promptId}`);
  };

  const handleFetchWithFetch = async () => {
    setStatus('loading');
    setError(null);
    try {
      // Try using the native fetch API instead of axios
      // console.log(`Testing with fetch API: /api/ai-tools/${promptId}`);
      const response = await fetch(`/api/ai-tools/${promptId}`);
      // console.log('Fetch response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Fetch failed with status: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      // console.log('Fetch response data:', data);
      setResponse(data);
      setStatus('success');
    } catch (err) {
      console.error('Fetch API test error:', err);
      setError({
        message: err.message,
        type: 'fetch-error'
      });
      setStatus('error');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={promptId}
            onChange={(e) => setPromptId(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-md mr-4"
            placeholder="Enter prompt ID to test"
          />
        </div>
        
        <div className="flex space-x-4 mb-6">
          <button 
            onClick={handleGetAllTools}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Test GET /api/ai-tools
          </button>
          
          <button 
            onClick={handleGetPrompt}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Test GET /api/ai-tools/{promptId}
          </button>
          
          <button 
            onClick={handleFetchWithFetch}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          >
            Test with fetch() API
          </button>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Status: {status}</h2>
        
        {status === 'loading' && <p>Loading...</p>}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
            <h3 className="font-bold">Error</h3>
            <p>Message: {error.message}</p>
            {error.status && <p>Status: {error.status}</p>}
            {error.statusText && <p>Status Text: {error.statusText}</p>}
            {error.data && (
              <pre className="mt-2 p-2 bg-red-50 overflow-auto max-h-40 text-sm">
                {JSON.stringify(error.data, null, 2)}
              </pre>
            )}
            {error.config && (
              <div className="mt-2">
                <p>Request Config:</p>
                <pre className="p-2 bg-red-50 overflow-auto max-h-40 text-sm">
                  {JSON.stringify(error.config, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
        
        {response && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Response Data:</h3>
            <pre className="p-4 bg-white border border-gray-300 rounded-md overflow-auto max-h-96 text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTestPage;
