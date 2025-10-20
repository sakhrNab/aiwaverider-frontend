import React, { useState, useContext } from 'react';
import { FaRocket, FaUsers, FaGem, FaLightbulb, FaTimes, FaCrown } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { toast } from 'react-toastify';
import './SkoolCommunityModal.css';

const SkoolCommunityModal = ({ isOpen, onClose, triggerSource = 'signup' }) => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useTheme();

  if (!isOpen) return null;

  const handleJoinCommunity = () => {
    // Direct link to your Skool community
    window.open('https://www.skool.com/ai-waverider-community-2071', '_blank', 'noopener,noreferrer');
    
    toast.success('🎉 Welcome to the AI Waverider Community! You\'re now part of something special!', {
      position: "bottom-right",
      autoClose: 4000,
      icon: "🎉"
    });
    
    onClose();
  };

  const handleMaybeLater = () => {
    toast.info('No problem! You can always join later at skool.com/ai-waverider-community-2071', {
      position: "bottom-right",
      autoClose: 4000
    });
    onClose();
  };

  return (
    <div className={`skool-modal-overlay ${darkMode ? 'dark-mode' : ''}`}>
      <div className={`skool-modal ${darkMode ? 'dark-mode' : ''}`}>
        <button 
          className="skool-modal-close"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        
        <div className="skool-main-content">
          <div className="skool-header">
            <div className="skool-icon">
              <FaRocket />
            </div>
            <h2>Join Our AI Community! 🚀</h2>
          </div>
          
          <div className="skool-message">
            <p className="main-message">
              You just got access to <strong>5,000+ free AI agents</strong>. 
              Now join our community where we share:
            </p>
            
            <div className="community-benefits">
              <div className="benefit-item">
                <FaGem className="benefit-icon" />
                <div className="benefit-content">
                  <h4>Advanced N8N Workflows</h4>
                  <p>Exclusive workflows not available on the site yet</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <FaUsers className="benefit-icon" />
                <div className="benefit-content">
                  <h4>Custom Automation Challenges</h4>
                  <p>Collaborate on solving real-world automation problems</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <FaLightbulb className="benefit-icon" />
                <div className="benefit-content">
                  <h4>Direct Access to Our Team</h4>
                  <p>Get help directly from the creators and shape new features</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <FaRocket className="benefit-icon" />
                <div className="benefit-content">
                  <h4>Early Access to Premium Features</h4>
                  <p>Be the first to try new agents and tools</p>
                </div>
              </div>
            </div>
            
            <div className="founding-member-highlight">
              <div className="founding-badge">
                <FaCrown />
                <span>FREE for First 50 Members!</span>
              </div>
              <p className="founding-text">
                We're building this community together! Join now and be part of the first 50 pioneers 
                who get in completely FREE.
              </p>
            </div>
          </div>
          
          <div className="skool-actions">
            <button 
              className="skool-btn primary-btn"
              onClick={handleJoinCommunity}
            >
              <FaCrown />
              Join Community (FREE)
            </button>
            
            <button 
              className="skool-btn secondary-btn"
              onClick={handleMaybeLater}
            >
              Maybe Later
            </button>
          </div>
          
          <div className="skool-footer">
            <p className="footer-note">
              💡 <strong>Everything stays 100% free!</strong> Join our community and help us build 
              the ultimate AI automation hub together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkoolCommunityModal;
