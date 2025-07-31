import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import '../../styles/animations.css';
import './PageHeader.css';

const PageHeader = ({ 
  title = "AI Waverider", 
  subtitle = "Your Gateway to AI Mastery",
  showBookingButton = true 
}) => {
  const { darkMode } = useTheme();

  return (
    <div className="relative overflow-hidden">
      {/* Animated background gradient with enhanced colors */}
      <div className={`absolute inset-0 animate-gradient-x ${darkMode 
        ? 'bg-gradient-to-r from-indigo-900 via-purple-800 to-blue-900' 
        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'}`}>
      </div>
      
      {/* Advanced grid pattern that gives a tech/AI feel */}
      <div className="absolute inset-0 bg-grid-white/[0.15] bg-[length:15px_15px] opacity-70">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:50px_50px] rotate-45"></div>
      </div>
      
      {/* Parallax floating elements - small geometric shapes */}
      <div className="absolute top-20 right-1/4 w-16 h-16 border-2 border-blue-400/30 rotate-45 animate-float-slow hidden md:block"></div>
      <div className="absolute bottom-10 left-1/3 w-12 h-12 border-2 border-purple-400/20 rounded-full animate-float hidden md:block"></div>
      <div className="absolute top-1/3 left-1/5 w-8 h-8 border-2 border-teal-400/20 rotate-12 animate-spin-slow hidden md:block"></div>
      
      {/* Advanced glowing orbs with dynamic animations */}
      <div className="absolute -top-20 right-1/4 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse-slow hidden md:block"></div>
      <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-float hidden md:block"></div>
      <div className="absolute top-1/2 left-2/3 w-40 h-40 bg-teal-500 rounded-full filter blur-3xl opacity-5 animate-pulse hidden md:block"></div>
      
      {/* Header content with enhanced glass effect */}
      <div className={`relative backdrop-blur-sm py-6 md:py-8 px-4 md:px-6 border-b ${darkMode ? 'border-white/10' : 'border-indigo-500/30'} glass-effect ${darkMode ? 'bg-black/5' : 'bg-white/15'}`}>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="relative z-10 text-center md:text-left">
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text ${darkMode ? 'bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300' : 'bg-gradient-to-r from-white via-yellow-100 to-white'} mb-2 drop-shadow-lg`}>
              {title}
            </h2>
            <div className="flex items-center justify-center md:justify-start">
              <div className={`w-8 md:w-10 h-[2px] bg-gradient-to-r ${darkMode ? 'from-blue-400' : 'from-gray-200'} to-transparent mr-3`}></div>
              <p className="text-white font-medium text-sm md:text-lg drop-shadow-md">
                {subtitle}
              </p>
              <div className={`w-8 md:w-10 h-[2px] bg-gradient-to-l ${darkMode ? 'from-blue-400' : 'from-gray-200'} to-transparent ml-3`}></div>
            </div>
          </div>
          
          {showBookingButton && (
            <div className="mt-6 md:mt-0 relative z-10">
              <a 
                href="https://calendly.com/aiwaverider8/30min"
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 md:px-6 lg:px-8 py-3 md:py-4 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-full font-semibold flex items-center heartbeat-pulse hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 transform hover:-translate-y-1 text-sm md:text-base lg:text-lg"
              >
                <FaCalendarAlt className="mr-2 md:mr-3 text-sm md:text-lg flex-shrink-0" />
                <span className="booking-text-responsive">Book a FREE Consultation Session</span>
                <FaArrowRight className="ml-2 md:ml-3 text-sm md:text-lg flex-shrink-0" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader; 