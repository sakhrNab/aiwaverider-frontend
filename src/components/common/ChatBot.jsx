import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaPaperPlane, FaRedo } from 'react-icons/fa';
import chatIcon from '../../assets/chat-icon.jpg';
import chatApi from '../../api/chat/chatApi';
import { useTheme } from '../../contexts/ThemeContext';

const ChatBot = () => {
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hi there! 👋 I can help you navigate the AI Waverider website and answer questions about our offerings. How can I assist you today?' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const retryLastMessage = () => {
    // Find the last user message
    const lastUserMessageIndex = [...messages].reverse().findIndex(msg => msg.role === 'user');
    if (lastUserMessageIndex !== -1) {
      const lastUserMessage = messages[messages.length - 1 - lastUserMessageIndex];
      // Remove the error message
      setMessages(prevMessages => {
        // Filter out the error message
        const updatedMessages = prevMessages.filter(msg => msg.role !== 'error');
        return updatedMessages;
      });
      // Set loading state
      setIsLoading(true);
      setHasError(false);
      // Send the message again
      const filteredMessages = messages.filter(msg => msg.role !== 'error');
      sendMessageToAPI(lastUserMessage.content, filteredMessages);
    }
  };

  const sendMessageToAPI = async (messageText, currentMessages) => {
    try {
      console.log('Sending chat message to API...');
      
      // Use the chatApi service instead of direct fetch
      const response = await chatApi.sendMessage(currentMessages.filter(msg => msg.role !== 'error'));
      
      console.log('API Response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to get response from chat API');
      }
      
      // Add assistant response to chat
      setMessages(prevMessages => [...prevMessages, { 
        role: 'assistant', 
        content: response.message || 'I\'m not sure how to respond to that.'
      }]);
      setHasError(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          role: 'error', 
          content: 'Sorry, I encountered an error: ' + error.message
        }
      ]);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;
    
    const userMessage = { role: 'user', content: inputMessage };
    
    // Add user message to chat
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Call the API with the updated messages array including the new user message
      await sendMessageToAPI(inputMessage, [...messages, userMessage]);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      // If there's an error, we'll handle it in sendMessageToAPI
    }
  };

  // Dynamic styles based on theme
  const getChatContainerStyle = () => ({
    position: 'fixed',
    bottom: '90px',
    right: '20px',
    width: '350px',
    height: '500px',
    backgroundColor: darkMode ? '#1f2937' : 'white',
    borderRadius: '10px',
    boxShadow: darkMode 
      ? '0 5px 15px rgba(0,0,0,0.4)' 
      : '0 5px 15px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    overflow: 'hidden',
    animation: 'slideUp 0.3s ease',
    border: darkMode ? '1px solid #374151' : 'none'
  });

  const getMessageStyle = (message) => ({
    alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
    backgroundColor: message.role === 'user' 
      ? (darkMode ? '#3b82f6' : '#e2f8f5')
      : message.role === 'error' 
        ? (darkMode ? '#dc2626' : '#ffeded') 
        : (darkMode ? '#374151' : '#f0f0f0'),
    color: message.role === 'user'
      ? 'white'
      : message.role === 'error' 
        ? 'white' 
        : (darkMode ? '#f3f4f6' : '#333'),
    padding: '10px 15px',
    borderRadius: message.role === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
    maxWidth: '80%',
    wordBreak: 'break-word'
  });

  const getInputStyle = () => ({
    flex: 1,
    padding: '10px 15px',
    borderRadius: '20px',
    border: darkMode ? '1px solid #4b5563' : '1px solid #ddd',
    outline: 'none',
    fontSize: '14px',
    color: darkMode ? '#f3f4f6' : '#333',
    backgroundColor: darkMode ? '#374151' : '#ffffff',
    transition: 'all 0.2s ease'
  });

  const getInputContainerStyle = () => ({
    borderTop: darkMode ? '1px solid #374151' : '1px solid #eee',
    backgroundColor: darkMode ? '#1f2937' : 'transparent',
    padding: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  });

  const getMessagesContainerStyle = () => ({
    flex: 1,
    overflowY: 'auto',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: darkMode ? '#1f2937' : 'transparent'
  });

  return (
    <>
      {/* Chat Toggle Button */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        <div 
          onClick={toggleChat}
          style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img 
            src={chatIcon} 
            alt="Chat with us" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
      
      {/* Chat Interface */}
      {isOpen && (
        <div style={getChatContainerStyle()}>
          {/* Chat Header */}
          <div
            style={{
              backgroundColor: '#4FD1C5',
              color: 'white',
              padding: '15px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🤖</span> AI Waverider Assistant
            </h3>
            <button
              onClick={toggleChat}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              <FaTimes />
            </button>
          </div>
          
          {/* Chat Messages */}
          <div style={getMessagesContainerStyle()}>
            {messages.map((message, index) => (
              <div key={index} style={getMessageStyle(message)}>
                {message.content}
                {message.role === 'error' && (
                  <button
                    onClick={retryLastMessage}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '14px',
                      padding: '0'
                    }}
                  >
                    <FaRedo /> Retry
                  </button>
                )}
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: darkMode ? '#374151' : '#f0f0f0',
                  color: darkMode ? '#f3f4f6' : '#333',
                  padding: '10px 15px',
                  borderRadius: '18px 18px 18px 0',
                  maxWidth: '80%'
                }}
              >
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <div style={getInputContainerStyle()}>
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              style={getInputStyle()}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={inputMessage.trim() === '' || isLoading}
              style={{
                backgroundColor: '#4FD1C5',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: inputMessage.trim() === '' || isLoading ? 'not-allowed' : 'pointer',
                opacity: inputMessage.trim() === '' || isLoading ? 0.7 : 1
              }}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .typing-indicator span {
          width: 8px;
          height: 8px;
          background-color: ${darkMode ? '#9ca3af' : '#999'};
          border-radius: 50%;
          animation: typing 1s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        /* Enhanced input focus styles for better visibility */
        input:focus {
          box-shadow: 0 0 0 2px ${darkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(79, 209, 197, 0.5)'} !important;
          border-color: ${darkMode ? '#3b82f6' : '#4FD1C5'} !important;
        }

        /* Ensure placeholder text is visible in both themes */
        input::placeholder {
          color: ${darkMode ? '#9ca3af' : '#6b7280'} !important;
          opacity: 1 !important;
        }

        /* Mobile-specific fixes */
        @media (max-width: 480px) {
          input {
            -webkit-appearance: none !important;
            -webkit-text-fill-color: ${darkMode ? '#f3f4f6' : '#333'} !important;
            background-color: ${darkMode ? '#374151' : '#ffffff'} !important;
          }
          
          input:focus {
            -webkit-text-fill-color: ${darkMode ? '#f3f4f6' : '#333'} !important;
          }
        }
      `}</style>
    </>
  );
};

export default ChatBot; 