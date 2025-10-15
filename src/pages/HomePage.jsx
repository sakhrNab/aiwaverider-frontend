import React, { useState, useEffect, useRef } from 'react';
import { HashLoader } from 'react-spinners';
import {FaCalendarAlt, FaArrowRight, FaRobot, FaTools, FaLightbulb, FaUserGraduate, FaChartLine, FaCheck, FaChevronRight, FaStar, FaTimes, FaClock, FaRandom, FaUserFriends, FaDollarSign, FaQuestion, FaUsers, FaCogs, FaHandshake, FaBullseye, FaBriefcase, FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/animations.css'; // Import animations
import FloatingNav from '../components/navigation/FloatingNav';
// import YouAreYouWant from '../components/sections/YouAreYouWant';
import sakhrProfileImg from '../assets/sakhr-profile.jpg';
import tazProfileImg from '../assets/taz-profile.jpg';
import simpleToSellImg from '../assets/simple-to-sell.png';
import savingTimeImg from '../assets/saving-time.png';
import makingAiEasyImg from '../assets/making-ai-easy.png';
import aiHeroPage from '../assets/ai-surfer-hero.png';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // Typewriter effect function with cleanup
  const typeWriter = (element, text, speed = 20) => {
    return new Promise(resolve => {
      let i = 0;
      let timeoutId = null;
      let isCancelled = false;
      
      element.innerHTML = '';
      element.classList.add('typing');
      
      // Ensure element is visible and has proper styling
      element.style.display = 'block';
      element.style.opacity = '1';
      
      function type() {
        if (isCancelled) return;
        
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
          timeoutId = setTimeout(type, speed);
        } else {
          element.classList.remove('typing');
          // Ensure final content is visible
          element.style.opacity = '1';
          element.style.display = 'block';
          resolve();
        }
      }
      
      // Store cleanup function on element for potential cancellation
      element._typewriterCleanup = () => {
        isCancelled = true;
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      };
      
      type();
    });
  };

  // Create refs for all sections we want to navigate to
  const topRef = useRef(null);
  const obstaclesRef = useRef(null);
  const whoItsForRef = useRef(null);
  const faqRef = useRef(null);
  const monetizationPathsRef = useRef(null);

  // Trigger typewriter effect on page load with cleanup
  useEffect(() => {
    let isMounted = true;
    let timeoutIds = [];
    
    const animateCards = async () => {
      if (!isMounted) return;
      
      // Wait for page to load
      const initialDelay = new Promise(resolve => {
        const id = setTimeout(resolve, 1000);
        timeoutIds.push(id);
      });
      await initialDelay;
      
      if (!isMounted) return;
      
      // Animate monetizing methods cards
      const methodCards = document.querySelectorAll('.futuristic-card');
      for (let i = 0; i < methodCards.length && isMounted; i++) {
        const card = methodCards[i];
        const title = card.querySelector('h3');
        const description = card.querySelector('p');
        
        if (title && isMounted) {
          const originalText = title.textContent;
          const delay = new Promise(resolve => {
            const id = setTimeout(resolve, 200 * i);
            timeoutIds.push(id);
          });
          await delay;
          if (isMounted) await typeWriter(title, originalText, 15);
        }
        
        if (description && isMounted) {
          const originalText = description.textContent;
          const delay = new Promise(resolve => {
            const id = setTimeout(resolve, 100);
            timeoutIds.push(id);
          });
          await delay;
          if (isMounted) await typeWriter(description, originalText, 10);
        }
      }

      if (!isMounted) return;

      // Animate obstacles cards
      const obstacleCards = document.querySelectorAll('.obstacle-card');
      for (let i = 0; i < obstacleCards.length && isMounted; i++) {
        const card = obstacleCards[i];
        const title = card.querySelector('h3');
        const description = card.querySelector('p');
        
        if (title && isMounted) {
          const originalText = title.textContent;
          const delay = new Promise(resolve => {
            const id = setTimeout(resolve, 200 * i);
            timeoutIds.push(id);
          });
          await delay;
          if (isMounted) await typeWriter(title, originalText, 15);
        }
        
        if (description && isMounted) {
          const originalText = description.textContent;
          const delay = new Promise(resolve => {
            const id = setTimeout(resolve, 100);
            timeoutIds.push(id);
          });
          await delay;
          if (isMounted) await typeWriter(description, originalText, 10);
        }
      }
    };

    animateCards();
    
    // Cleanup function
    return () => {
      isMounted = false;
      // Clear all timeouts
      timeoutIds.forEach(id => clearTimeout(id));
      // Cleanup any running typewriter effects
      document.querySelectorAll('[class*="typing"]').forEach(el => {
        if (el._typewriterCleanup) {
          el._typewriterCleanup();
        }
      });
    };
  }, []);

  // Audio refs
  const audioContextRef = useRef(null);
  const hoverSynthRef = useRef(null);
  const clickSynthRef = useRef(null);
  
  const { darkMode } = useTheme();
  const calendlyLink = "https://calendly.com/aiwaverider8/30min";

  // Data arrays for cards
  const monetizingMethods = [
    {
      icon: '🎯',
      title: 'AI Tool Affiliate Marketing',
      description: 'Learn best practices to promote AI tools, and earn commissions by recommending tools to companies. I will provide the step-by-step for creating marketing assets for reviews and making recommendations your audience loves.'
    },
    {
      icon: '⚙️',
      title: 'n8n Automation Workflows',
      description: 'Create and sell powerful automation workflows using n8n that save businesses 100s of hours per month. Learn how to create custom solutions, and price them so they are a no-brainer for any B2B or B2C business.'
    },
    {
      icon: '💼',
      title: 'AI Consulting Services',
      description: 'Provide strategic AI consulting to help businesses identify automation opportunities, implement AI solutions, and optimize their operations. Charge $250-$500/hour for your expertise and AI implementation services.'
    },
    {
      icon: '💬',
      title: 'Teaching & Training Programs',
      description: 'Share your knowledge and help others build their own AI businesses. Create courses, coaching programs, and training materials that teach others marketing, workflow creation, and AI consulting skills.'
    }
  ];
  
  const obstacles = [
    {
      icon: '✕',
      title: 'Technical Overwhelm',
      description: 'Many believe you need advanced technical skills to build automation workflows or understand AI tools. My approach focuses on no-code solutions and practical business applications that anyone can master.'
    },
    {
      icon: '?',
      title: 'Not Knowing Where to Start',
      description: 'The AI space is vast and constantly evolving. I provide a clear roadmap and step-by-step system that eliminates confusion and gets you generating income quickly with proven strategies.'
    },
    {
      icon: '👥',
      title: 'Finding Clients',
      description: 'Identifying businesses that need AI automation and convincing them to invest can be challenging. I share my proven outreach methods and client acquisition strategies that consistently land high-value projects.'
    },
    {
      icon: '$',
      title: 'Pricing Your Services',
      description: 'Determining what to charge for automation workflows, consulting, or affiliate commissions is complex. I provide detailed pricing frameworks and value-based strategies that maximize your earnings while delivering clear ROI.'
    },
    {
      icon: '⇅',
      title: 'Scaling Your Business',
      description: 'Moving from one-off projects to a scalable business model is difficult. I teach systems and processes for building recurring revenue streams through automation workflows, consulting retainers, and affiliate partnerships.'
    },
    {
      icon: '🔄',
      title: 'Staying Updated',
      description: 'AI tools and technologies change rapidly, making it hard to stay current. I provide ongoing training and updates on the latest tools, strategies, and market opportunities to keep you ahead of the curve.'
    }
  ];
  
  // Refs object for the FloatingNav component
  const scrollRefs = {
    top: topRef,
    obstacles: obstaclesRef,
    whoItsFor: whoItsForRef,
    faq: faqRef
  };
  // Function to scroll to the monetization paths section
  const scrollToMonetizationPaths = (e) => {
    e.preventDefault();
    monetizationPathsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to open Calendly for consultation calls
  const openCalendlyConsultation = () => {
    window.open(calendlyLink, '_blank');
  };

  // Load Tone.js and initialize audio with cleanup
  useEffect(() => {
    const loadToneJS = async () => {
      try {
        // Dynamically import Tone.js
        const Tone = await import('tone');
        
        // Initialize audio context
        audioContextRef.current = Tone;
        
        // Create synthesizers
        hoverSynthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'fatsine' },
          volume: -20,
          envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.2 }
        }).toDestination();

        clickSynthRef.current = new Tone.PolySynth(Tone.Synth, {
          volume: -12,
          oscillator: { type: 'fmsquare', modulationType: 'sawtooth', modulationIndex: 0.5 },
          envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.5 }
        }).toDestination();
        
        // Sound effects loaded
      } catch (error) {
        // Tone.js not available, continuing without sound effects
      }
    };

    loadToneJS();
    
    // Cleanup function
    return () => {
      // Dispose of audio resources
      if (hoverSynthRef.current) {
        hoverSynthRef.current.dispose();
        hoverSynthRef.current = null;
      }
      if (clickSynthRef.current) {
        clickSynthRef.current.dispose();
        clickSynthRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.context) {
        audioContextRef.current.context.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // Initialize particles with cleanup and reduced count
  useEffect(() => {
    let particlesInstance = null;
    let timeoutIds = [];
    
    const loadParticles = () => {
      // Load particles.js from CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';

      script.onload = () => {
        if (window.particlesJS) {
          // Wait for DOM to be ready and container to exist
          const initParticles = () => {
            const container = document.querySelector('#particles-js');
            if (!container) {
              const id = setTimeout(initParticles, 50);
              timeoutIds.push(id);
              return;
            }
            try {
              // Reduced particle count and simplified configuration for better performance
              particlesInstance = window.particlesJS('particles-js', {
                "particles": {
                  "number": { "value": 30, "density": { "enable": true, "value_area": 1200 } },
                  "color": { "value": "#00ffff" },
                  "shape": { "type": "circle" },
                  "opacity": { "value": 0.4, "random": false },
                  "size": { "value": 2, "random": true },
                  "line_linked": { "enable": true, "distance": 200, "color": "#00ffff", "opacity": 0.2, "width": 1 },
                  "move": { "enable": true, "speed": 1, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
                },
                "interactivity": { 
                  "detect_on": "canvas", 
                  "events": { 
                    "onhover": { "enable": true, "mode": "repulse" }, 
                    "onclick": { "enable": false, "mode": "push" }, 
                    "resize": true 
                  }, 
                  "modes": { 
                    "repulse": { "distance": 80, "duration": 0.4 }, 
                    "push": { "particles_nb": 2 } 
                  } 
                },
                "retina_detect": true
              });
            } catch (error) {
              console.error('❌ Error initializing particles:', error);
            }
          };

          // Start the initialization process with timeout tracking
          const id1 = setTimeout(() => {
            const id2 = setTimeout(initParticles, 100);
            timeoutIds.push(id2);
          }, 500);
          timeoutIds.push(id1);
        } else {
          console.error('❌ particlesJS is not available after script load');
        }
      };

      script.onerror = () => {
        // Try alternative CDN
        const altScript = document.createElement('script');
        altScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js';
        altScript.onload = () => {
          if (window.particlesJS) {
            particlesInstance = window.particlesJS('particles-js', {
              "particles": {
                "number": { "value": 30, "density": { "enable": true, "value_area": 1200 } },
                "color": { "value": "#00ffff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.4, "random": false },
                "size": { "value": 2, "random": true },
                "line_linked": { "enable": true, "distance": 200, "color": "#00ffff", "opacity": 0.2, "width": 1 },
                "move": { "enable": true, "speed": 1, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
              },
              "interactivity": { 
                "detect_on": "canvas", 
                "events": { 
                  "onhover": { "enable": true, "mode": "repulse" }, 
                  "onclick": { "enable": false, "mode": "push" }, 
                  "resize": true 
                }, 
                "modes": { 
                  "repulse": { "distance": 80, "duration": 0.4 }, 
                  "push": { "particles_nb": 2 } 
                } 
              },
              "retina_detect": true
            });
          }
        };
        altScript.onerror = () => {
          console.error('❌ Alternative CDN also failed to load');
        };
        document.head.appendChild(altScript);
      };

      document.head.appendChild(script);
    };

    loadParticles();
    
    // Cleanup function
    return () => {
      // Clear all timeouts
      timeoutIds.forEach(id => clearTimeout(id));
      
      // Destroy particles instance
      if (particlesInstance && particlesInstance.destroy) {
        particlesInstance.destroy();
      }
      
      // Remove particles script
      const existingScript = document.querySelector('script[src*="particles"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // Keyboard event listener for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  // Simulate loading state for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Pause animations when page is not visible to save CPU
  useEffect(() => {
    const handleVisibilityChange = () => {
      const style = document.createElement('style');
      style.id = 'animation-control';
      
      if (document.hidden) {
        // Pause all animations when page is hidden
        style.textContent = `
          * {
            animation-play-state: paused !important;
          }
        `;
        document.head.appendChild(style);
      } else {
        // Resume animations when page is visible
        const existingStyle = document.getElementById('animation-control');
        if (existingStyle) {
          existingStyle.remove();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      const existingStyle = document.getElementById('animation-control');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-blue-900">
        <div className="mb-8">
          <HashLoader color="#4FD1C5" size={70} speedMultiplier={0.8} />
        </div>
        <div className="text-white text-xl font-semibold mt-4">
          Initializing AI Waverider
        </div>
        <div className="text-blue-300 text-sm mt-2">
          Connecting to neural networks...
        </div>
      </div>
    );
  }

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Marketing Consultant',
      image: '/testimonial-1.jpg',
      quote: 'The n8n automation workflows from AI Waverider saved me 20 hours per week. I was able to scale my consulting business by 300% in just 2 months!',
      stars: 5
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'Small Business Owner',
      image: '/testimonial-2.jpg',
      quote: 'Learning their affiliate marketing strategy for AI tools opened up a new $5,000/month revenue stream. The step-by-step guidance made it incredibly easy to implement.',
      stars: 5
    },
    {
      id: 3,
      name: 'Jennifer Lee',
      role: 'Freelance Professional',
      image: '/testimonial-3.jpg',
      quote: 'The AI consulting training helped me transition from freelancing to running a $15,000/month AI consulting agency. The workflows and strategies are pure gold!',
      stars: 5
    }
  ];

  // Modal functions
  const openModal = (item) => {
    playClickSound();
    setModalContent(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  // Sound effect functions
  const playHoverSound = async () => {
    if (audioContextRef.current && hoverSynthRef.current) {
      try {
        if (audioContextRef.current.context.state !== 'running') {
          await audioContextRef.current.start();
        }
        hoverSynthRef.current.triggerAttackRelease('C5', '8n');
        } catch (error) {
          // Audio error - continuing without sound
        }
    }
  };

  const playClickSound = async () => {
    if (audioContextRef.current && clickSynthRef.current) {
      try {
        if (audioContextRef.current.context.state !== 'running') {
          await audioContextRef.current.start();
        }
        clickSynthRef.current.triggerAttackRelease(['C4', 'E4', 'G4'], '8n');
        } catch (error) {
          // Audio error - continuing without sound
        }
    }
  };

  return (
    <div className={`${darkMode ? 'bg-black' : 'bg-purple-900'} relative`} ref={topRef} style={{ color: darkMode ? '#e0e0e0' : '#1e293b', overflowX: 'hidden', position: 'relative', minHeight: '100vh', zIndex: 1 }}>
      {/* Cinematic gradient backdrop (behind particles) */}
      <div className="bg-movie-gradient fixed inset-0" style={{ zIndex: -2 }} aria-hidden="true"></div>




      {/* Particle Background */}
      <div id="particles-js" className="fixed inset-0 w-full h-full" style={{ zIndex: 0, backgroundColor: 'transparent', pointerEvents: 'none' }}></div>
















      {/* CSS Animations */}
      <style>{`
        body {
          font-family: 'Roboto', 'Inter', sans-serif;
          background-color: #0a0a1a;
          color: #e0e0e0;
          overflow-x: hidden;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* Ensure header has highest priority on homepage */
        .main-header {
          z-index: 9999 !important;
          position: sticky !important;
          top: 0 !important;
        }

        /* Global background for all sections to ensure particle consistency */
        .homepage-section {
          background-color: transparent !important;
          position: relative !important;
          z-index: 1 !important;
        }

        .mobile-menu-btn {
          z-index: 10000 !important;
          position: relative !important;
        }

        /* Light mode body styling */
        :global(.light) body {
          background-color: #f8fafc;
          color: #1e293b;
        }

        /* Cinematic moving gradient backdrop */
        .bg-movie-gradient {
          background: radial-gradient(60% 60% at 20% 20%, rgba(10, 10, 26, 0.8) 0%, rgba(0, 0, 0, 0.0) 60%),
                      radial-gradient(50% 50% at 80% 30%, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.0) 60%),
                      radial-gradient(40% 40% at 50% 80%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.0) 60%);
          animation: gradient-drift 18s ease-in-out infinite alternate;
          filter: blur(0.5px);
        }

        /* Light mode gradient */
        :global(.light) .bg-movie-gradient {
          background: radial-gradient(60% 60% at 20% 20%, rgba(59, 130, 246, 0.4) 0%, rgba(255, 255, 255, 0.0) 60%),
                      radial-gradient(50% 50% at 80% 30%, rgba(147, 51, 234, 0.3) 0%, rgba(255, 255, 255, 0.0) 60%),
                      radial-gradient(40% 40% at 50% 80%, rgba(16, 185, 129, 0.15) 0%, rgba(255, 255, 255, 0.0) 60%);
        }

        @keyframes gradient-drift {
          0%   { transform: translate3d(0,0,0) scale(1); }
          50%  { transform: translate3d(-1.5%, 1%, 0) scale(1.02); }
          100% { transform: translate3d(1%, -1.5%, 0) scale(1.03); }
        }

        #particles-js {
          position: fixed !important;
          width: 100% !important;
          height: 100% !important;
          top: 0 !important;
          left: 0 !important;
          z-index: 0 !important;
          background: transparent !important;
          pointer-events: none !important;
        }

        #particles-js canvas {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          pointer-events: none !important;
          z-index: 1 !important;
          display: block !important;
          background: transparent !important;
        }

        html {
          scroll-behavior: smooth;
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes floatIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes subtle-glow {
          from { text-shadow: 0 0 15px rgba(0, 255, 255, 0.5); }
          to { text-shadow: 0 0 25px rgba(0, 255, 255, 0.8); }
        }

        @keyframes subtle-float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(0); }
        }

        .futuristic-card {
          background: linear-gradient(135deg, rgba(16, 16, 32, 0.8), rgba(32, 32, 64, 0.6));
          border: 1px solid rgba(0, 255, 255, 0.3);
          backdrop-filter: blur(15px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 0 20px rgba(0, 255, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          animation: pulse-glow 8s infinite alternate;
          font-family: 'Roboto', 'Inter', 'JetBrains Mono', monospace;
          position: relative;
          overflow: hidden;
        }

        .futuristic-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent);
          animation: typewriter-sweep 6s infinite;
        }

        .futuristic-card:hover {
          transform: translateY(-15px) scale(1.05) rotateX(5deg);
          box-shadow: 
            0 25px 50px rgba(0, 255, 255, 0.4),
            0 0 60px rgba(0, 255, 255, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          border-color: rgba(0, 255, 255, 0.8);
          animation-play-state: paused;
        }

        .futuristic-card:hover::before {
          animation: typewriter-sweep 0.8s ease-out;
        }

        @keyframes typewriter-glow {
          0%, 100% { 
            box-shadow: 
              0 0 20px rgba(0, 255, 255, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }
          50% { 
            box-shadow: 
              0 0 30px rgba(0, 255, 255, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
        }

        @keyframes typewriter-sweep {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        /* Simple typewriter effect - working version */
        .typewriter-text {
          font-family: 'Roboto Mono', monospace;
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid rgba(0, 255, 255, 0.8);
          animation: typing 1s steps(20, end), blink-caret 0.75s step-end infinite 1s;
        }

        .typewriter-text-multiline {
          font-family: 'Roboto Mono', monospace;
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid rgba(0, 255, 255, 0.8);
          animation: typing 1.5s steps(30, end), blink-caret 0.75s step-end infinite 1.5s;
        }

        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }

        @keyframes blink-caret {
          from, to { border-color: transparent; }
          50% { border-color: rgba(0, 255, 255, 0.8); }
        }

        /* Typewriter cursor effect */
        .typing::after {
          content: '_';
          animation: blink 0.8s infinite;
          font-weight: bold;
          margin-left: 2px;
          color: rgba(0, 255, 255, 0.8);
        }

        @keyframes blink { 
          50% { opacity: 0; } 
        }

      /* Staggered typewriter effect for multiple elements */
      .typewriter-stagger-1 { 
        animation-delay: 0s; 
      }
      .typewriter-stagger-2 { 
        animation-delay: 0.2s; 
      }
      .typewriter-stagger-3 { 
        animation-delay: 0.4s; 
      }
      .typewriter-stagger-4 { 
        animation-delay: 0.6s; 
      }

      /* Hero Illustration Animations */
      .hero-illustration {
        filter: drop-shadow(0 20px 40px rgba(0, 188, 212, 0.3));
        transition: all 0.3s ease;
      }

      .hero-illustration:hover {
        filter: drop-shadow(0 25px 50px rgba(0, 188, 212, 0.4));
        transform: scale(1.02) !important;
      }

      @keyframes heroFloatIn {
        0% {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        50% {
          opacity: 0.8;
          transform: translateY(-10px) scale(1.02);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes heroFloat {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
        }
        25% {
          transform: translateY(-8px) rotate(0.5deg);
        }
        50% {
          transform: translateY(-12px) rotate(0deg);
        }
        75% {
          transform: translateY(-6px) rotate(-0.5deg);
        }
      }


        @keyframes pulse-glow {
          from {
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
          }
          to {
            box-shadow: 0 0 25px rgba(0, 255, 255, 0.4);
          }
        }

        .icon-container {
          background-color: rgba(0, 255, 255, 0.1);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #00ffff;
          text-shadow: 0 0 10px #00ffff;
        }

        .hero-title, .hero-content, .hero-checklist, .hero-buttons {
          font-family: 'Roboto', 'Inter', sans-serif;
        }

        /* Responsive hero content for 700-1000px range */
        @media (min-width: 700px) and (max-width: 1000px) {
          .hero-content {
            max-width: 100%;
            padding: 0 1rem;
          }
          
          .hero-title {
            font-size: 2.5rem !important;
            line-height: 1.2 !important;
          }
          
          .hero-checklist li {
            font-size: 0.9rem !important;
            line-height: 1.4 !important;
          }
          
          .hero-buttons {
            flex-direction: column !important;
            gap: 0.75rem !important;
          }
          
          .hero-buttons a {
            width: 100% !important;
            text-align: center !important;
            font-size: 0.9rem !important;
            padding: 0.75rem 1rem !important;
          }
        }

        /* Mobile-first responsive design */
        @media (max-width: 699px) {
          .hero-content {
            text-align: center;
            padding: 0 0.5rem;
          }
          
          .hero-title {
            font-size: 2rem !important;
            line-height: 1.1 !important;
          }
          
          .hero-checklist li {
            font-size: 0.85rem !important;
            text-align: left;
          }
        }

        .hero-checklist > * {
          animation: slideUp 1s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        
        .hero-checklist > *:nth-child(1) { animation-delay: 0.8s; }
        .hero-checklist > *:nth-child(2) { animation-delay: 1.0s; }
        .hero-checklist > *:nth-child(3) { animation-delay: 1.2s; }

        .hero-buttons > * {
          animation: fadeIn 1s ease-out forwards;
          opacity: 0;
        }
        
        .hero-buttons > *:nth-child(1) { animation-delay: 1.5s; }
        .hero-buttons > *:nth-child(2) { animation-delay: 1.7s; }

        .hero-image img {
          animation: floatIn 2s 0.5s ease-in-out forwards, subtle-float 8s ease-in-out infinite;
          opacity: 0;
          transform: translateX(50px);
        }

        .card {
          background-color: rgba(16, 16, 32, 0.5);
          border: 1px solid rgba(0, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
          animation: pulse-glow 4s infinite alternate;
        }

        .card:hover {
          transform: translateY(-10px) scale(1.03);
          box-shadow: 0 0 35px rgba(0, 255, 255, 0.5);
          border-color: rgba(0, 255, 255, 0.5);
        }

        @keyframes pulse-glow {
          from {
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
          }
          to {
            box-shadow: 0 0 25px rgba(0, 255, 255, 0.4);
          }
        }

        .icon-container {
          background-color: rgba(0, 255, 255, 0.1);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #00ffff;
          text-shadow: 0 0 10px #00ffff;
        }

        .modal {
          background-color: rgba(10, 10, 26, 0.9);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(0, 255, 255, 0.3);
          box-shadow: 0 0 50px rgba(0, 255, 255, 0.3);
        }

      `}</style>
      {/* Floating navigation that appears when scrolling */}
      <FloatingNav scrollRefs={scrollRefs} />
      
      {/* Cinematic Hero Section */}
      <div className="hero-section container mx-auto px-4 text-left homepage-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full max-w-7xl">
          <div className="hero-content w-full" style={{ animation: 'fadeIn 1s ease-out forwards', opacity: 0 }}>
            <h1 className={`hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight ${darkMode ? 'text-white' : 'text-white'}`} style={{ 
              animation: 'slideUp 1s 0.5s ease-out forwards, subtle-glow 3s infinite alternate', 
              opacity: 0, 
              transform: 'translateY(20px)',
              textShadow: darkMode ? '0 0 15px rgba(0, 255, 255, 0.5)' : '0 0 15px rgba(59, 130, 246, 0.3)'
            }}>Master AI Automation & Build Your Digital Empire</h1>
            <p className={`text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-200'}`}>Learn how to monetize AI through affiliate marketing, sell powerful n8n automation workflows, and provide high-value AI consulting services. Build a $5,000-$25,000/month business in the AI revolution.</p>
            <ul className={`hero-checklist space-y-2 sm:space-y-3 mb-6 sm:mb-8 ${darkMode ? 'text-gray-200' : 'text-gray-300'}`}>
              <li className="flex items-start sm:items-center" style={{ animation: 'slideUp 1s 0.8s ease-out forwards', opacity: 0, transform: 'translateY(20px)' }}>
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-cyan-400 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-sm sm:text-base">No coding experience required</span>
                  </li>
              <li className="flex items-start sm:items-center" style={{ animation: 'slideUp 1s 1.0s ease-out forwards', opacity: 0, transform: 'translateY(20px)' }}>
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-cyan-400 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-sm sm:text-base">Start earning $5,000-$25,000/month with proven strategies</span>
              </li>
              <li className="flex items-start sm:items-center" style={{ animation: 'slideUp 1s 1.2s ease-out forwards', opacity: 0, transform: 'translateY(20px)' }}>
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-cyan-400 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-sm sm:text-base">Launch your first AI automation workflow in 7 days</span>
              </li>
              </ul>
            <div className="hero-buttons flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-4">
              <Link to="/monetization-paths" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 sm:px-6 rounded-lg transition duration-300 shadow-lg shadow-blue-600/30 text-center text-sm sm:text-base" style={{ animation: 'fadeIn 1s 1.5s ease-out forwards', opacity: 0 }}>Explore Business Models</Link>
              <a
                href="https://calendly.com/aiwaverider8/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-4 sm:px-6 rounded-lg transition duration-300 shadow-lg shadow-yellow-500/30 text-center text-sm sm:text-base"
                style={{ animation: 'fadeIn 1s 1.6s ease-out forwards', opacity: 0 }}
              >
                Book a FREE Consultation
              </a>
              <a
                href="https://www.skool.com/ai-waverider-community-2071"
                target="_blank"
                rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-400 text-gray-900 font-bold py-3 px-4 sm:px-6 rounded-lg transition duration-300 shadow-lg shadow-green-500/30 text-center text-sm sm:text-base"
                style={{ animation: 'fadeIn 1s 1.7s ease-out forwards', opacity: 0 }}
                >
                  JOIN COMMUNITY
              </a>
              </div>





















            </div>
          <div className="hero-image hidden lg:block">
            <img 
              src={aiHeroPage} 
              alt="AI Waverider Illustration" 
              className="w-full h-auto hero-illustration max-w-lg mx-auto" 
              style={{ 
                animation: 'heroFloatIn 2s ease-out 0.5s forwards, heroFloat 6s ease-in-out 2.5s infinite', 
                opacity: 0, 
                transform: 'translateY(30px) scale(0.95)' 
              }} 
            />
          </div>
        </div>
      </div>

      {/* YouAreYouWant section with arrow diagrams */}
      {/* <YouAreYouWant /> */}

      {/* Monetization Paths */}
      <section ref={monetizationPathsRef} id="monetization-paths" className="py-20 relative homepage-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
        <h2 className={`text-4xl md:text-6xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`} style={{ textShadow: darkMode ? '0 0 15px rgba(0, 255, 255, 0.5)' : '0 0 15px rgba(99, 102, 241, 0.3)' }}>
          4 Proven Ways To Monetize AI
        </h2>
            <p className={`max-w-3xl mx-auto text-lg md:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-200'}`}>
          Discover the core business models top-performing automation figures in the AI space, plus how I teach others to replicate my success.
        </p>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {monetizingMethods.map((method, index) => (
              <div 
              key={index} 
                className="futuristic-card rounded-lg p-6 cursor-pointer text-left"
                onMouseEnter={playHoverSound}
                onClick={() => openModal(method)}
              >
                <div className="flex items-center mb-4">
                  <div className="icon-container mr-4 text-3xl">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white typewriter-text typewriter-stagger-1">{method.title}</h3>









































                </div>
                <p className="text-gray-400 typewriter-text-multiline typewriter-stagger-2">
                  {method.description.substring(0, 100)}...




                </p>
              </div>
          ))}
        </div>

          <div className="text-center mt-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/monetization-paths" className={`px-8 py-4 rounded-full font-bold text-lg transition-all inline-flex items-center ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'} hover:shadow-lg`}>
                Learn All Business Models <FaChevronRight className="ml-2" />
              </Link>
              <a 
                href="https://www.skool.com/ai-waverider-community-2071"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-4 rounded-full font-bold text-lg transition-all inline-flex items-center ${darkMode ? 'bg-green-600 hover:bg-green-700 text-white border-2 border-green-500' : 'bg-green-500 hover:bg-green-600 text-white border-2 border-green-400'} hover:shadow-lg`}
              >
                <FaUsers className="mr-2" /> JOIN COMMUNITY
              </a>
      </div>
          </div>
        </div>
      </section>

      {/* Obstacles Section */}
      <section ref={obstaclesRef} id="obstacles" className="py-20 relative homepage-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
        <h2 className={`text-4xl md:text-6xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`} style={{ textShadow: darkMode ? '0 0 15px rgba(0, 255, 255, 0.5)' : '0 0 15px rgba(239, 68, 68, 0.3)' }}>
          Common Obstacles To Building an AI Business
        </h2>
            <p className={`max-w-3xl mx-auto text-lg md:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-200'}`}>
          These are the key challenges that prevent most people from successfully building a profitable AI business.
        </p>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {obstacles.map((obstacle, index) => (
              <div 
              key={index} 
                className="futuristic-card rounded-lg p-6 cursor-pointer text-left"
                onMouseEnter={playHoverSound}
                onClick={() => openModal(obstacle)}
              >
                <div className="flex items-center mb-4">
                  <div className="icon-container mr-4 text-3xl">
                    {obstacle.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white typewriter-text typewriter-stagger-1">{obstacle.title}</h3>


























































                </div>
                <p className="text-gray-400 typewriter-text-multiline typewriter-stagger-2">
                  {obstacle.description.substring(0, 100)}...
                </p>
              </div>
          ))}
        </div>




          <div className="text-center mt-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/ai-obstacle-solutions" className={`px-8 py-4 rounded-full font-bold text-lg transition-all inline-flex items-center ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'} hover:shadow-lg`}>
                Learn How I Solve These Obstacles <FaChevronRight className="ml-2" />
              </Link>
              <a 
                href="https://www.skool.com/ai-waverider-community-2071"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-4 rounded-full font-bold text-lg transition-all inline-flex items-center ${darkMode ? 'bg-green-600 hover:bg-green-700 text-white border-2 border-green-500' : 'bg-green-500 hover:bg-green-600 text-white border-2 border-green-400'} hover:shadow-lg`}
              >
                <FaUsers className="mr-2" /> JOIN COMMUNITY
              </a>
      </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section ref={whoItsForRef} id="community" className="py-20 relative homepage-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>
              Your Path to AI Business Success:
              <br />No Technical Degree, No Guesswork
              </h2>
            <p className={`max-w-2xl mx-auto text-xl ${darkMode ? 'text-gray-300' : 'text-gray-200'}`}>
              I understand these challenges because I've overcome them myself.
              <br />Here's how I make AI business building simple and profitable:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <img 
                src={makingAiEasyImg} 
                alt="Making AI Easy" 
                className="rounded-lg shadow-xl w-full max-w-md mx-auto" 
                onError={(e) => { e.target.src = 'https://placehold.co/600x400/indigo/white?text=Making+AI+Easy'; }}
              />
            </div>
            <div>
              <h4 className={`text-2xl md:text-3xl font-semibold mb-4 ${darkMode ? 'text-teal-400' : 'text-teal-400'}`}>
                Simplifying AI Business Building
              </h4>
              <p className={`mb-8 text-lg md:text-xl leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-300'}`}>
                I provide you with ready-to-use automation workflows, proven affiliate marketing templates, and client acquisition systems. Everything is broken down into simple steps with real-world examples, so you can start generating income within days, not months.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 md:order-1">
              <h4 className={`text-2xl md:text-3xl font-semibold mb-4 ${darkMode ? 'text-teal-400' : 'text-teal-400'}`}>
                Maximizing Your Time Investment
              </h4>
              <p className={`mb-8 text-lg md:text-xl leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-300'}`}>
                My system is designed for busy entrepreneurs. You'll learn how to create workflows that can be sold multiple times, build affiliate relationships that generate passive income, and develop consulting processes that scale efficiently.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img 
                src={savingTimeImg} 
                alt="Saving Time" 
                className="rounded-lg shadow-xl w-full max-w-md mx-auto" 
                onError={(e) => { e.target.src = 'https://placehold.co/600x400/indigo/white?text=Saving+Time'; }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src={simpleToSellImg} 
                alt="Simple To Sell" 
                className="rounded-lg shadow-xl w-full max-w-md mx-auto" 
                onError={(e) => { e.target.src = 'https://placehold.co/600x400/indigo/white?text=Simple+To+Sell'; }}
              />
            </div>
            <div>
              <h4 className={`text-3xl md:text-4xl font-semibold mb-4 ${darkMode ? 'text-teal-400' : 'text-teal-400'}`}>
                Plug-and-Play Business Model
              </h4>
              <p className={`mb-8 text-xl md:text-2xl leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-300'}`}>
                No more confusion about what to sell or how to price it. I provide you with complete business models including n8n workflow templates, affiliate partner connections, pricing strategies, and client onboarding systems. Plus, I teach you how to package your own knowledge into profitable training programs.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to={calendlyLink}              
              // onClick={() => document.dispatchEvent(new CustomEvent('open-signup-modal'))}
                  className="px-10 py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-bold text-lg transition-all inline-flex items-center"
                >
                  START FREE Strategy Call
                </Link>
              <a 
                href="https://www.skool.com/ai-waverider-community-2071"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-4 rounded-lg font-bold text-lg transition-all inline-flex items-center ${darkMode ? 'bg-green-600 hover:bg-green-700 text-white border-2 border-green-500' : 'bg-green-500 hover:bg-green-600 text-white border-2 border-green-400'} hover:shadow-lg`}
              >
                <FaUsers className="mr-2" /> JOIN COMMUNITY
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your AI Educator Section */}
      <section className="py-24 relative homepage-section" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2961&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="container mx-auto px-5 max-w-6xl">
          <h2 className={`text-5xl md:text-6xl font-bold text-center mb-16 ${darkMode ? 'text-white' : 'text-white'}`}>
            MEET YOUR AI BUSINESS MENTOR!
          </h2>

          {/* Sakhr Nabil */}
          <div className="flex flex-col lg:flex-row items-stretch gap-10 mb-24">
            {/* Educator Card */}
            <div className="w-full lg:w-1/3">
              <div className="rounded-3xl overflow-hidden border-4 border-white h-full relative" style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
              }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-blue-800/40 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                <img 
                  src={sakhrProfileImg} 
                  alt="Sakhr Al-Absi" 
                  className="w-full h-full object-cover relative z-10"
                  onError={(e) => { e.target.src = 'https://placehold.co/600x800/333/white?text=Sakhr+Al-Absi'; }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 z-20">
                  <h3 className="text-4xl font-bold text-white">SAKHR</h3>
                  <h4 className="text-3xl font-bold text-white">AL-ABSI</h4>
                </div>
              </div>
            </div>

            {/* Educator Bio */}
            <div className="w-full lg:w-2/3">
              <div className="text-white space-y-6">
                <h3 className="text-2xl font-semibold text-white">From software engineer to AI business entrepreneur — building the future of automation, one workflow at a time.</h3>

                <p className="text-lg leading-relaxed">
                  As a <strong className="text-pink-300 font-semibold">full-stack developer at Accenture</strong> for the past 3 years, I've built high-impact solutions for Fortune 500 companies. But my real passion emerged when I discovered how to bridge the gap between technical AI capabilities and real business value. That's when <strong className="text-pink-300 font-semibold">AI Waverider</strong> was born.
                </p>

                <p className="text-lg leading-relaxed">
                  I've personally generated <strong className="text-pink-300 font-semibold">over $200,000</strong> using the exact strategies I teach: affiliate marketing with AI companies, creating and selling <strong className="text-pink-300 font-semibold">n8n automation workflows</strong>, and providing strategic AI consulting to businesses looking to optimize their operations.
                </p>

                <p className="text-lg leading-relaxed">
                  My approach is different because I focus on <strong className="text-pink-300 font-semibold">practical business applications</strong> rather than complex technical theory. Whether you're a complete beginner or experienced entrepreneur, I'll show you how to monetize AI without needing to code or understand machine learning algorithms.
                </p>

                <p className="text-lg leading-relaxed">
                  What sets me apart is my ability to communicate in <strong className="text-pink-300 font-semibold">Arabic, German, English, and Spanish</strong>, allowing me to serve a global community and understand diverse business challenges across different markets.
                </p>

                <ul className="space-y-2 pl-5">
                  <li className="flex items-start">
                    <span className="text-pink-300 mr-2">•</span>
                    <span><strong className="text-pink-300 font-semibold">Ready-to-sell n8n workflow templates</strong> that solve real business problems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-300 mr-2">•</span>
                    <span><strong className="text-pink-300 font-semibold">Proven affiliate marketing strategies</strong> for high-converting AI tool partnerships</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-300 mr-2">•</span>
                    <span><strong className="text-pink-300 font-semibold">Step-by-step consulting frameworks</strong> for landing $5,000-$50,000 AI projects</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-300 mr-2">•</span>
                    <span><strong className="text-pink-300 font-semibold">Complete business systems</strong> for scaling from side hustle to six-figure business</span>
                  </li>
                </ul>

                <div className="flex items-center mt-8">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-300 mr-4">
                    <img 
                      src={sakhrProfileImg} 
                      alt="Sakhr Al-Absi" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://placehold.co/200x200/333/white?text=S'; }}
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">SAKHR AL-ABSI</h4>
                    <p className="text-lg text-white">AI Business Strategist & Automation Expert</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Possible Section */}
      <section className="py-24 relative homepage-section" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2961&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="container mx-auto px-5 max-w-6xl">
          {/* Main Heading */}
          <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-16">
            WHAT'S POSSIBLE WITH AI BUSINESS
          </h2>

          {/* Two Column Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            {/* Discover Column */}
            <div className="bg-transparent border-2 border-pink-300 rounded-xl p-8">
              <div className="flex items-center mb-8">
                <span className="text-pink-300 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                    <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                    <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                  </svg>
                </span>
                <h3 className="text-3xl font-bold text-white uppercase">MASTER</h3>
              </div>

              <ul className="space-y-4 text-xl text-white">
                <li className="flex items-start">
                  <span className="text-pink-300 mr-2 mt-1">›</span>
                  <span>AI tool affiliate marketing strategies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-300 mr-2 mt-1">›</span>
                  <span>Creating profitable n8n automation workflows</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-300 mr-2 mt-1">›</span>
                  <span>Building a six-figure consulting practice</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-300 mr-2 mt-1">›</span>
                  <span>Scaling with digital products and courses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-300 mr-2 mt-1">›</span>
                  <span>Advanced client acquisition systems</span>
                </li>
              </ul>
            </div>

            {/* Growth Column */}
            <div className="bg-transparent border-2 border-pink-300 rounded-xl p-8">
              <div className="flex items-center mb-8">
                <span className="text-pink-300 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                  </svg>
                </span>
                <h3 className="text-3xl font-bold text-white uppercase">ACHIEVE</h3>
              </div>

              <ul className="space-y-4 text-xl text-white">
                <li className="flex items-start">
                  <span className="text-pink-300 mr-2 mt-1">›</span>
                  <span>Location and time freedom</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-300 mr-2 mt-1">›</span>
                  <span>Recurring revenue streams</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-300 mr-2 mt-1">›</span>
                  <span>Premium pricing for your expertise</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-300 mr-2 mt-1">›</span>
                  <span>Automated business processes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-300 mr-2 mt-1">›</span>
                  <span>Multiple six-figure income potential</span>
                </li>
              </ul>
        </div>
      </div>

          {/* And Much More */}
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold text-white">...AND MUCH MORE</h3>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to={calendlyLink}              
              // onClick={() => document.dispatchEvent(new CustomEvent('open-signup-modal'))}
                  className="px-16 py-6 bg-blue-400 hover:bg-blue-500 text-white rounded-xl font-bold text-3xl transition-all inline-flex items-center"
                >
                  START FREE Strategy Call
                </Link>
              <a 
                href="https://www.skool.com/ai-waverider-community-2071"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-6 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-xl sm:text-2xl transition-all inline-flex items-center border-2 border-green-400 hover:shadow-lg"
              >
                <FaUsers className="mr-2" /> JOIN COMMUNITY
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Two Options */}
      <section className="py-20 relative homepage-section">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Option 1: Join Now */}
            <div className="bg-transparent rounded-3xl shadow-xl p-10 border-2 border-gray-100 transform transition-transform hover:scale-105">
              <h3 className="text-3xl font-bold mb-8">
                <span className="text-red-400">Option 1:</span> <span className="text-white">Start Building</span>
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-red-400 text-sm" />
                  </div>
                  <p className="ml-3 text-white font-medium">Learn my proven n8n workflow templates that sell for $297-$2,997 each.</p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-red-400 text-sm" />
                  </div>
                  <p className="ml-3 text-white font-medium">
                    Master affiliate marketing strategies that generate $2,000-$15,000/month in commissions.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-red-400 text-sm" />
                  </div>
                  <p className="ml-3 text-white font-medium">
                    Build a consulting practice charging $200-$500/hour for AI strategy and implementation.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-red-400 text-sm" />
                  </div>
                  <p className="ml-3 text-white font-medium">
                    Create your own training programs and scale to six-figure monthly revenue.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-red-400 text-sm" />
                  </div>
                  <p className="ml-3 text-white font-medium">
                    Join a community of successful AI entrepreneurs and get ongoing support.
            </p>
          </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-red-400 text-sm" />
                  </div>
                  <p className="ml-3 text-white font-medium">
                    Get lifetime access to updates as AI technology evolves.
                  </p>
                </div>
              </div>
            </div>

            {/* Option 2: Exit This Page */}
            <div className="bg-transparent rounded-3xl shadow-xl p-10 border-2 border-gray-100 transform transition-transform hover:scale-105">
              <h3 className="text-3xl font-bold mb-8">
                <span className="text-red-400">Option 2:</span> <span className="text-white">Do It Alone</span>
                    </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-transparent flex items-center justify-center mt-0.5">
                    <FaCheck className="text-white text-sm" />
                  </div>
                  <p className="ml-3 text-white font-medium">
                    Continue struggling to find profitable AI opportunities on your own.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-transparent flex items-center justify-center mt-0.5">
                    <FaCheck className="text-white text-sm" />
                  </div>
                  <p className="ml-3 text-white font-medium">
                    Waste months trying to figure out which AI tools to promote and how to price your services.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-transparent flex items-center justify-center mt-0.5">
                    <FaCheck className="text-white text-sm" />
                  </div>
                  <p className="ml-3 text-white font-medium">
                    Miss out on the current AI boom while competitors build profitable businesses.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-transparent flex items-center justify-center mt-0.5">
                    <FaCheck className="text-white text-sm" />
                  </div>
                  <p className="ml-3 text-white font-medium">
                    Keep trading time for money instead of building scalable, automated income streams.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-transparent flex items-center justify-center mt-0.5">
                    <FaCheck className="text-white text-sm" />
                  </div>
                  <p className="ml-3 text-white font-medium">
                    Watch as others implement the exact strategies I'm sharing and achieve the success you want.
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-transparent flex items-center justify-center mt-0.5">
                    <FaCheck className="text-white text-sm" />
                  </div>
                  <p className="ml-3 text-white font-medium">
                    Never know how much your income and lifestyle could have improved with proven AI business strategies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
                onClick={() => document.dispatchEvent(new CustomEvent('open-signup-modal'))}
                className="px-10 py-4 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold text-xl transition-all inline-flex items-center"
            >
                START MY AI BUSINESS JOURNEY
                <FaArrowRight className="ml-3" />
            </button>
              <a 
                href="https://www.skool.com/ai-waverider-community-2071"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-4 rounded-full font-bold text-xl transition-all inline-flex items-center ${darkMode ? 'bg-green-600 hover:bg-green-700 text-white border-2 border-green-500' : 'bg-green-500 hover:bg-green-600 text-white border-2 border-green-400'} hover:shadow-lg`}
              >
                <FaUsers className="mr-2" /> JOIN COMMUNITY
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative homepage-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {/* FAQ Item 1 */}
            <details className="p-6 rounded-lg bg-transparent cursor-pointer group">
              <summary className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-white'} flex justify-between items-center`}>
                Do I need technical skills to succeed with your AI business strategies?
                <svg className="w-5 h-5 transition-transform transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-300 font-semibold'}`}>
                <p>Not at all! My entire approach is designed for non-technical entrepreneurs. The n8n workflows use a visual, drag-and-drop interface, the affiliate marketing strategies focus on relationship building and sales, and the consulting frameworks are based on business strategy rather than technical implementation.</p>
              </div>
            </details>

            {/* FAQ Item 2 */}
            <details className="p-6 rounded-lg bg-transparent cursor-pointer group">
              <summary className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-white'} flex justify-between items-center`}>
                How quickly can I start earning income with these strategies?
                <svg className="w-5 h-5 transition-transform transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-300 font-semibold'}`}>
                <p>With affiliate marketing, you can start earning commissions within your first week once you have the right partnerships in place. n8n workflows can be created and sold within 2-4 weeks, and consulting clients typically come within 30-60 days of implementing my outreach strategies. The key is consistent action and following the proven systems I provide.</p>
              </div>
            </details>

            {/* FAQ Item 3 */}
            <details className="p-6 rounded-lg bg-transparent cursor-pointer group">
              <summary className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-200'} flex justify-between items-center`}>
                What makes your n8n workflows different from free templates online?
                <svg className="w-5 h-5 transition-transform transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-300 font-semibold'}`}>
                <p>My workflows are battle-tested in real businesses and designed specifically for profitability. They include detailed documentation, customization guides, and business use cases that demonstrate clear ROI. Plus, you get my pricing strategies and sales frameworks to position these as premium solutions worth $297-$2,997 each.</p>
              </div>
            </details>

            {/* FAQ Item 4 */}
            <details className="p-6 rounded-lg bg-transparent cursor-pointer group">
              <summary className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-white'} flex justify-between items-center`}>
                Can I implement these strategies while working full-time?
                <svg className="w-5 h-5 transition-transform transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-300 font-semibold'}`}>
                <p>Absolutely! Many of my students start as side hustles while maintaining their day jobs. Affiliate marketing and selling workflows can be done in your spare time, and consulting calls can be scheduled outside work hours. The strategies are designed for efficiency and scalability, not long hours.</p>
              </div>
            </details>

            {/* FAQ Item 5 */}
            <details className="p-6 rounded-lg bg-transparent cursor-pointer group">
              <summary className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-white'} flex justify-between items-center`}>
                What ongoing support do you provide?
                <svg className="w-5 h-5 transition-transform transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-300 font-semibold'}`}>
                <p>You get access to our private Discord community, monthly group coaching calls, regular updates on new AI tools and opportunities, and direct access to me for questions and guidance. The AI space evolves rapidly, so ongoing support and education are crucial for continued success.</p>
              </div>
            </details>

            {/* FAQ Item 6 */}
            <details className="p-6 rounded-lg bg-transparent cursor-pointer group">
              <summary className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-white'} flex justify-between items-center`}>
                How do I know if this will work for my specific situation?
                <svg className="w-5 h-5 transition-transform transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-300 font-semibold'}`}>
                <p>The best way to find out is to book a free strategy call with me. I'll assess your current situation, goals, and resources to determine which of the four business models would be the best fit for you. This personalized approach ensures you're starting with the strategy most likely to succeed in your specific circumstances.</p>
              </div>
            </details>
          </div>

          <div className="text-center mt-16">
            <div className="bg-blue-400 hover:bg-blue-500 inline-block transition-all rounded-xl shadow-lg overflow-hidden cursor-pointer" onClick={openCalendlyConsultation}>
              <div className="px-16 py-6 font-bold text-2xl text-white flex items-center justify-center gap-3">
                <FaCalendarAlt /> BOOK FREE Strategy Call
              </div>
              <div className="bg-transparent text-white text-sm py-2">
                Discover Your Best AI Business Model
              </div>
            </div>
            <div className="mt-4">
              <a 
                href="https://www.skool.com/ai-waverider-community-2071"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all inline-flex items-center ${darkMode ? 'bg-green-600 hover:bg-green-700 text-white border-2 border-green-500' : 'bg-green-500 hover:bg-green-600 text-white border-2 border-green-400'} hover:shadow-lg`}
              >
                <FaUsers className="mr-2" /> JOIN COMMUNITY
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Consultation Call Section */}
      <section className="py-16 relative homepage-section">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-200'}`}
            >
              Ready to Build Your AI Business Empire?
            </h2>

            <p 
              className={`text-xl mb-10 ${darkMode ? 'text-indigo-100' : 'text-gray-300'}`}
            >
              Book a free 30-minute strategy call to discover which AI business model is perfect for your goals and current situation
            </p>

            <div className="mb-10">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={openCalendlyConsultation}
                  className="px-10 py-5 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-full font-bold text-2xl transition-all hover:shadow-xl inline-flex items-center gap-3"
                >
                  <FaCalendarAlt /> Schedule Your Free Strategy Call
                </button>
                <a 
                  href="https://www.skool.com/ai-waverider-community-2071"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-8 py-5 rounded-full font-bold text-xl transition-all inline-flex items-center gap-3 ${darkMode ? 'bg-green-600 hover:bg-green-700 text-white border-2 border-green-500' : 'bg-green-500 hover:bg-green-600 text-white border-2 border-green-400'} hover:shadow-xl`}
                >
                  <FaUsers /> JOIN COMMUNITY
                </a>
              </div>
            </div>

            <div className={`${darkMode ? 'text-indigo-200' : 'text-gray-300'}`}>
              <p className="text-lg">No sales pressure, just a friendly conversation about your AI business potential</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 relative" style={{ zIndex: 10 }}>
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-300 text-sm">
            © 2025 AI Waverider. All rights reserved. Built with 🚀 and AI.
          </p>
        </div>
      </footer>

      {/* Modal for detailed view */}
      {modalOpen && modalContent && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="w-full max-w-3xl rounded-lg shadow-lg p-8 relative" style={{
            backgroundColor: 'rgba(10, 10, 26, 0.9)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(0, 255, 255, 0.3)',
            boxShadow: '0 0 50px rgba(0, 255, 255, 0.3)'
          }}>
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors"
            >
              &times;
            </button>
            <div className="flex items-center mb-6">
              <div className="icon-container mr-4 text-3xl">
                {modalContent.icon}
              </div>
              <h2 className="text-3xl font-bold text-white">{modalContent.title}</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed" style={{
              fontFamily: "'Roboto Mono', monospace",
              animation: 'typing 2s steps(40, end)'
            }}>
              {modalContent.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;