import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaCode, FaLaptopCode, FaRobot, FaChartLine, FaBrain, FaTools, FaCogs, FaCloud, FaMobile, FaServer } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import sakhrProfileImg from '../assets/sakhr-profile.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faInstagram } from '@fortawesome/free-brands-svg-icons';

const About = () => {
  const { darkMode } = useTheme();
  const audioContextRef = useRef(null);
  const hoverSynthRef = useRef(null);
  const clickSynthRef = useRef(null);

  // Load Tone.js and initialize audio
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
        
        // console.log('🎵 Sound effects loaded successfully!');
      } catch (error) {
        // console.log('🔇 Tone.js not available, continuing without sound effects');
      }
    };

    loadToneJS();
  }, []);

  // Initialize particles
  useEffect(() => {
    const loadParticles = () => {
      // Load particles.js from CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
      script.onload = () => {
        if (window.particlesJS) {
          window.particlesJS('particles-js', {
            "particles": {
              "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
              "color": { "value": "#ffffff" },
              "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" } },
              "opacity": { "value": 0.5, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false } },
              "size": { "value": 3, "random": true, "anim": { "enable": false } },
              "line_linked": { "enable": true, "distance": 150, "color": "#4444ff", "opacity": 0.4, "width": 1 },
              "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": { 
              "detect_on": "canvas", 
              "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": false }, "resize": true }, 
              "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } } } 
            },
            "retina_detect": true
          });
          // console.log('✨ Particles loaded successfully!');
        }
      };
      script.onerror = () => {
        // console.log('🔇 Particles.js failed to load, continuing without particle background');
      };
      document.head.appendChild(script);
    };

    loadParticles();
  }, []);

  useEffect(() => {
    const gridContainer = document.getElementById('services-grid');
    const cards = document.querySelectorAll('.service-card');
    
    if (!gridContainer || cards.length === 0) return;

    const deactivateCards = () => {
      cards.forEach(c => c.classList.remove('active'));
      gridContainer.classList.remove('active');
    };

    // Typewriter effect for card details
    const typeWriter = (element, text, speed = 20) => {
      return new Promise(resolve => {
        let i = 0;
        element.innerHTML = '';
        element.classList.add('typing');
        
        // Ensure element is visible and has proper styling
        element.style.display = 'block';
        element.style.opacity = '1';
        
        function type() {
          if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
          } else {
            element.classList.remove('typing');
            // Ensure final content is visible
            element.style.opacity = '1';
            element.style.display = 'block';
            resolve();
          }
        }
        type();
      });
    };

    const animateCardDetails = async (card) => {
      const detailList = card.querySelector('.card-details ul');
      const lines = Array.from(detailList.querySelectorAll('li')).map(li => li.innerText);
      
      // console.log('Lines to animate:', lines); // Debug log
      detailList.innerHTML = ''; // Clear list for animation
      
      for (let i = 0; i < lines.length; i++) {
        const lineText = lines[i];
        // console.log(`Animating line ${i}:`, lineText); // Debug log
        const newLi = document.createElement('li');
        detailList.appendChild(newLi);
        
        // Add a small delay before starting each item to prevent conflicts
        await new Promise(resolve => setTimeout(resolve, 50));
        await typeWriter(newLi, lineText, 10); // Even faster typing speed
      }
    };

    const activateCard = (card) => {
      deactivateCards();
      card.classList.add('active');
      gridContainer.classList.add('active');
      animateCardDetails(card);
    };

    cards.forEach(card => {
      const closeButton = card.querySelector('.card-close');
      
      // Hover sound effect
      card.addEventListener('mouseenter', async () => {
        if (audioContextRef.current && hoverSynthRef.current) {
          try {
            // Start Tone.js context on first user interaction
            if (audioContextRef.current.context.state !== 'running') {
              await audioContextRef.current.start();
            }
            hoverSynthRef.current.triggerAttackRelease('C5', '8n');
          } catch (error) {
            // console.log('Audio error:', error);
          }
        }
      });

      // Card click to activate with sound
      card.addEventListener('click', async (e) => {
        if (card.classList.contains('active') || e.target === closeButton) return;
        
        // Play click sound
        if (audioContextRef.current && clickSynthRef.current) {
          try {
            // Start Tone.js context on first user interaction
            if (audioContextRef.current.context.state !== 'running') {
              await audioContextRef.current.start();
            }
            clickSynthRef.current.triggerAttackRelease(['C3', 'G3', 'C4'], '4n');
          } catch (error) {
            // console.log('Audio error:', error);
          }
        }
        
        activateCard(card);
      });

      // Close button click
      closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        deactivateCards();
      });
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (gridContainer.classList.contains('active') && !e.target.closest('.service-card')) {
        deactivateCards();
      }
    });

    // Cleanup
    return () => {
      cards.forEach(card => {
        const closeButton = card.querySelector('.card-close');
        card.removeEventListener('click', activateCard);
        closeButton.removeEventListener('click', deactivateCards);
      });
    };
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} relative`}>
      {/* Particle Background */}
      <div id="particles-js" className="fixed inset-0 w-full h-full z-0 pointer-events-none"></div>
      {/* Hero Section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-indigo-50 to-blue-50'} relative z-10`}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
                About AI Waverider
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Building the bridge between cutting-edge AI technology and practical business applications.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={`py-14 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} relative z-10`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-teal-300' : 'text-teal-600'}`}>Our Mission</h2>
            <p className="text-lg mb-6 leading-relaxed">
              AI Waverider was founded with a clear mission: to democratize access to artificial intelligence technologies 
              and help businesses and individuals harness the power of AI without requiring deep technical expertise.
            </p>
            <p className="text-lg mb-6 leading-relaxed">
              We believe that AI should be accessible to everyone, regardless of their technical background. Our platform
              provides the tools, resources, and guidance needed to navigate the rapidly evolving AI landscape and
              turn these powerful technologies into practical, profitable business solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className={`py-14 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} relative z-10`}>
        <div className="container mx-auto px-6">
          <h2 className={`text-3xl font-bold mb-12 text-center ${darkMode ? 'text-teal-300' : 'text-teal-600'}`}>Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
              <div className={`w-14 h-14 rounded-full ${darkMode ? 'bg-teal-600' : 'bg-teal-500'} flex items-center justify-center mb-4 text-white text-2xl`}>
                <FaRobot />
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p>We constantly explore the cutting edge of AI technology to bring you the most powerful and effective solutions.</p>
            </div>

            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
              <div className={`w-14 h-14 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center mb-4 text-white text-2xl`}>
                <FaLaptopCode />
              </div>
              <h3 className="text-xl font-bold mb-3">Accessibility</h3>
              <p>We believe in making AI understandable and usable for everyone, regardless of technical background.</p>
            </div>

            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
              <div className={`w-14 h-14 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-purple-500'} flex items-center justify-center mb-4 text-white text-2xl`}>
                <FaBrain />
              </div>
              <h3 className="text-xl font-bold mb-3">Practical Application</h3>
              <p>We focus on real-world applications that deliver measurable value and tangible business results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className={`py-14 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} relative z-10`}>
        <div className="container mx-auto px-6">
          <h2 className={`text-3xl font-bold mb-12 text-center ${darkMode ? 'text-teal-300' : 'text-teal-600'}`}>Meet the Founder</h2>

          <div className="max-w-3xl mx-auto">
            {/* Sakhr Nabil */}
            <div className={`rounded-lg overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-8`}>
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 mb-6 rounded-full overflow-hidden bg-gradient-to-r from-blue-100 to-teal-100 p-1">
                  <img 
                    src={sakhrProfileImg} 
                    alt="Sakhr Al-absi" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <h3 className="text-3xl font-bold mb-1 text-center">Sakhr Al-absi</h3>
                <p className={`text-xl mb-4 ${darkMode ? 'text-teal-300' : 'text-teal-600'}`}>Founder & CEO</p>
                <div className="flex justify-center space-x-6 mb-6 relative z-20" style={{ position: 'relative', zIndex: 20 }}>
                  <a 
                    href="https://www.linkedin.com/in/sakhr-nabil-al-absi/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'} text-2xl transition-colors duration-200 cursor-pointer relative z-30`}
                    onClick={() =>  console.log('LinkedIn clicked')}
                    style={{ zIndex: 30 }}
                  >
                    <FaLinkedin />
                  </a>
                  <a 
                    href="https://github.com/sakhrNab" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-2xl transition-colors duration-200 cursor-pointer relative z-30`}
                    onClick={() => console.log('GitHub clicked')}
                    style={{ zIndex: 30 }}
                  >
                    <FaGithub />
                  </a>
                  <a 
                    href="https://www.tiktok.com/@ai.wave.rider" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xl hover:text-pink-600 transition-colors duration-200 cursor-pointer relative z-30"
                    onClick={() => console.log('TikTok clicked')}
                    style={{ zIndex: 30 }}
                  >
                    <FontAwesomeIcon icon={faTiktok} />
                  </a>
                </div>
              </div>
              <p className="text-base leading-relaxed mb-4">
                Sakhr is a technology entrepreneur with over 7 years of experience in software development and AI implementation. 
                He has successfully helped dozens of businesses integrate AI solutions to optimize processes, reduce costs, and create 
                new revenue streams.
              </p>
              <p className="text-base leading-relaxed mb-4">
                With a degree in Applied Computer Science from Germany and a background in Industrial Engineering, Sakhr brings 
                a unique blend of technical expertise and business acumen. His international experience spans prestigious organizations 
                including Accenture (Big 4 consulting), BMG Rights and Management, and Innocean Worldwide GmbH, where he has worked 
                with major banks and automotive industry leaders across Germany.
              </p>
              <p className="text-base leading-relaxed">
                Fluent in Arabic, English and German, Sakhr bridges the gap between cutting-edge technology and practical business 
                applications, making complex AI concepts accessible to everyone while delivering solutions that drive real business value.
              </p>
            </div>

            {/* Mutaz Awn */}
            {/* <div className={`rounded-lg overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-8`}>
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 mb-6 rounded-full overflow-hidden bg-gradient-to-r from-blue-100 to-teal-100 p-1">
                  <img 
                    src={tazProfileImg} 
                    alt="Mutaz Awn" 
                    className="w-full h-full rounded-full object-cover object-top"
                  />
                </div>
                <h3 className="text-3xl font-bold mb-1 text-center">Mutaz Awn</h3>
                <p className={`text-xl mb-4 ${darkMode ? 'text-teal-300' : 'text-teal-600'}`}>Co-Founder & CEO</p>
                <div className="flex justify-center space-x-6 mb-6">
                  <a href="https://www.linkedin.com/in/taz-awn-878940120/" target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'} text-2xl`}>
                    <FaLinkedin />
                  </a>
        <a href="https://www.instagram.com/tazawn/" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-pink-600">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
                </div>
              </div>
              <p className="text-base leading-relaxed mb-4">
                Mutaz is an AI specialist and full-stack developer with expertise in machine learning, natural language 
                processing, and AI-powered automation. He has developed innovative AI solutions for startups and 
                enterprises across multiple industries.
              </p>
              <p className="text-base leading-relaxed">
                With a passion for making technology accessible, Mutaz focuses on creating user-friendly AI tools and 
                providing clear, actionable guidance that helps businesses implement AI solutions without requiring 
                extensive technical resources.
              </p>
            </div> */}
          </div>
        </div>
      </section>

      {/* AI Waverider Platform */}
      <section className={`py-14 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} relative z-10`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-teal-300' : 'text-teal-600'}`}>
              What We Offer
            </h2>
            <p className="text-lg mb-6 leading-relaxed">
              AI Waverider specializes in making artificial intelligence accessible and practical for businesses of all sizes. 
              We offer comprehensive solutions across multiple domains to deliver real value to our clients.
            </p>

            {/* Interactive Services Grid */}
            <div className="relative">
              <style>{`
                .services-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                  gap: 1.5rem;
                  width: 100%;
                  max-width: 1400px;
                  margin: 0 auto;
                  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
                }
                
                .service-card {
                  background: ${darkMode ? 'rgba(22, 22, 49, 0.6)' : 'rgba(255, 255, 255, 0.9)'};
                  border: 1px solid ${darkMode ? 'rgba(128, 128, 255, 0.25)' : 'rgba(59, 130, 246, 0.25)'};
                  border-radius: 12px;
                  padding: 2rem;
                  cursor: pointer;
                  backdrop-filter: blur(12px);
                  -webkit-backdrop-filter: blur(12px);
                  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                  overflow: hidden;
                  position: relative;
                }
                
                .service-card:hover {
                  transform: translateY(-10px) scale(1.03);
                  box-shadow: 0 0 35px 0px ${darkMode ? 'hsl(240, 100%, 75%)' : 'hsl(220, 100%, 60%)'};
                  border-color: ${darkMode ? 'hsl(240, 100%, 85%)' : 'hsl(220, 100%, 70%)'};
                }
                
                .service-card.active {
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) scale(1);
                  width: clamp(320px, 90vw, 600px);
                  height: auto;
                  max-height: 90vh;
                  z-index: 100;
                  cursor: default;
                  overflow-y: auto;
                  animation: pulseGlow 2.5s infinite ease-in-out;
                }
                
                .services-grid.active .service-card:not(.active) {
                  opacity: 0;
                  transform: scale(0.8);
                  pointer-events: none;
                }
                
                .card-close {
                  position: absolute;
                  top: 1rem;
                  right: 1.5rem;
                  font-size: 2rem;
                  color: ${darkMode ? '#A0A0CC' : '#6B7280'};
                  cursor: pointer;
                  transition: all 0.3s;
                  opacity: 0;
                  pointer-events: none;
                }
                
                .service-card.active .card-close {
                  opacity: 1;
                  pointer-events: all;
                  transition-delay: 0.5s;
                }
                
                .card-close:hover {
                  color: ${darkMode ? '#fff' : '#000'};
                  transform: scale(1.2);
                }
                
                .card-details {
                  max-height: 0;
                  opacity: 0;
                  overflow: hidden;
                  transition: max-height 0.6s ease-in-out, opacity 0.6s ease-in-out 0.2s;
                }
                
                .service-card.active .card-details {
                  max-height: 1000px;
                  opacity: 1;
                  display: block;
                }
                
                .card-details ul {
                  list-style: none;
                  padding: 0;
                  margin-top: 1.5rem;
                }
                
                .card-details li {
                  margin-bottom: 0.5rem;
                  color: ${darkMode ? '#E0E0FF' : '#4B5563'};
                  font-size: 0.95rem;
                }
                
                @keyframes pulseGlow {
                  0% { 
                    box-shadow: 0 0 20px -8px ${darkMode ? 'hsl(240, 100%, 75%)' : 'hsl(220, 100%, 60%)'}; 
                    border-color: ${darkMode ? 'hsl(240, 100%, 75%)' : 'hsl(220, 100%, 60%)'};
                  }
                  50% { 
                    box-shadow: 0 0 35px 0px ${darkMode ? 'hsl(240, 100%, 75%)' : 'hsl(220, 100%, 60%)'}; 
                    border-color: ${darkMode ? 'hsl(240, 100%, 85%)' : 'hsl(220, 100%, 70%)'};
                  }
                  100% { 
                    box-shadow: 0 0 20px -8px ${darkMode ? 'hsl(240, 100%, 75%)' : 'hsl(220, 100%, 60%)'}; 
                    border-color: ${darkMode ? 'hsl(240, 100%, 75%)' : 'hsl(220, 100%, 60%)'};
                  }
                }
                
                @keyframes blink { 
                  50% { opacity: 0; } 
                }
                
                .typing::after {
                  content: '_';
                  animation: blink 0.8s infinite;
                  font-weight: bold;
                  margin-left: 2px;
                }
              `}</style>
              
              <div className="services-grid" id="services-grid">
                {/* Custom Software Development */}
                <div className="service-card" data-service="software">
                  <div className="card-close">&times;</div>
                  <div className="card-front">
                    <div className="text-4xl mb-4">⚙️</div>
                    <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Custom Software Development</h3>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <strong>Built with Cursor AI, GitHub Copilot, and live coding sessions.</strong> 
                      We deliver production-ready applications 3x faster and 50% cheaper than traditional development.
                    </p>
                  </div>
                  <div className="card-details">
                    <ul>
                      <li>✓ 100+ successful projects</li>
                      <li>✓ 30-day money-back guarantee</li>
                      <li>✓ 24/7 support</li>
                      <li>✓ Agile methodology</li>
                      <li>✓ Scalable architectures</li>
                    </ul>
                  </div>
                </div>


                {/* Enterprise SaaS Platforms */}
                <div className="service-card" data-service="saas">
                  <div className="card-close">&times;</div>
                  <div className="card-front">
                    <div className="text-4xl mb-4">☁️</div>
                    <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Enterprise SaaS Platforms</h3>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <strong>React, Node.js, PostgreSQL, AWS/Azure architecture.</strong> 
                      Scalable multi-tenant platforms with 99.9% uptime, delivered in 8-12 weeks.
                    </p>
                  </div>
                  <div className="card-details">
                    <ul>
                      <li>✓ SOC 2 compliant</li>
                      <li>✓ Auto-scaling infrastructure</li>
                      <li>✓ Real-time collaboration</li>
                      <li>✓ Secure data handling</li>
                      <li>✓ Custom API integrations</li>
                    </ul>
                  </div>
                </div>


                {/* Native Mobile Applications */}
                <div className="service-card" data-service="mobile">
                  <div className="card-close">&times;</div>
                  <div className="card-front">
                    <div className="text-4xl mb-4">📱</div>
                    <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Native Mobile Applications</h3>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <strong>React Native, Swift, Kotlin development.</strong> 
                      Production-ready iOS and Android apps with 4.8+ App Store ratings, delivered in 6-10 weeks.
                    </p>
                  </div>
                  <div className="card-details">
                    <ul>
                      <li>✓ App Store optimization</li>
                      <li>✓ Push notifications</li>
                      <li>✓ Offline functionality</li>
                      <li>✓ Biometric authentication</li>
                      <li>✓ Smooth animations</li>
                    </ul>
                  </div>
                </div>


                {/* N8N Automation Workflows */}
                <div className="service-card" data-service="automation">
                  <div className="card-close">&times;</div>
                  <div className="card-front">
                    <div className="text-4xl mb-4">⚡️</div>
                    <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>N8N Automation Workflows</h3>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <strong>Custom N8N workflows that save 20+ hours/week.</strong> 
                      Connect 200+ apps and automate complex business processes with zero coding required.
                    </p>
                  </div>
                  <div className="card-details">
                    <ul>
                      <li>✓ 200+ app integrations</li>
                      <li>✓ Visual workflow builder</li>
                      <li>✓ Error handling & monitoring</li>
                      <li>✓ Scalable for high volume</li>
                      <li>✓ Secure credential management</li>
                    </ul>
                  </div>
              </div>
              
                {/* AI Tool Implementation */}
                <div className="service-card" data-service="ai-tools">
                  <div className="card-close">&times;</div>
                  <div className="card-front">
                    <div className="text-4xl mb-4">🤖</div>
                    <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>AI Tool Implementation</h3>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <strong>Strategic AI adoption with proven ROI.</strong> 
                      We've helped 50+ businesses increase productivity by 40% using ChatGPT, Claude, and custom AI solutions.
                    </p>
                  </div>
                  <div className="card-details">
                    <ul>
                      <li>✓ Free AI audit</li>
                      <li>✓ ROI tracking</li>
                      <li>✓ Training & support</li>
                      <li>✓ Custom model fine-tuning</li>
                      <li>✓ Prompt engineering</li>
                    </ul>
                  </div>
              </div>

                {/* AI Strategy Consulting */}
                <div className="service-card" data-service="ai-strategy">
                  <div className="card-close">&times;</div>
                  <div className="card-front">
                    <div className="text-4xl mb-4">🧠</div>
                    <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>AI Strategy Consulting</h3>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <strong>End-to-end AI transformation for enterprises.</strong> 
                      From strategy to implementation, we help Fortune 500 companies integrate AI across all departments.
                    </p>
                  </div>
                  <div className="card-details">
                    <ul>
                      <li>✓ C-suite advisory</li>
                      <li>✓ Change management</li>
                      <li>✓ Performance metrics</li>
                      <li>✓ Technology roadmap</li>
                      <li>✓ Competitive analysis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg mb-6">
                Whether you're just starting your AI journey or looking to optimize existing systems, 
                we're here to guide you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className={`py-14 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} relative z-10`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-teal-300' : 'text-teal-600'}`}>Ready to Get Started?</h2>
            <p className="text-lg mb-8">
              Discover how AI can transform your business. Explore our services, check out our AI tool recommendations, 
              or get in touch to discuss your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/agents" 
                className={`inline-block px-8 py-3 ${darkMode ? 
                  'bg-teal-600 hover:bg-teal-700' : 
                  'bg-teal-600 hover:bg-teal-700'} 
                  text-white rounded-lg font-semibold transition duration-300`}
              >
                Browse AI Solutions
              </Link>
              <Link 
                to="/contact" 
                className={`inline-block px-8 py-3 ${darkMode ? 
                  'bg-blue-600 hover:bg-blue-700' : 
                  'bg-blue-600 hover:bg-blue-700'} 
                  text-white rounded-lg font-semibold transition duration-300`}
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;