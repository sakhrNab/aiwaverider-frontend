import React, { useState, useEffect, useRef } from 'react';
import { HashLoader } from 'react-spinners';
import {FaCalendarAlt, FaArrowRight, FaRobot, FaTools, FaLightbulb, FaUserGraduate, FaChartLine, FaCheck, FaChevronRight, FaStar, FaTimes, FaClock, FaRandom, FaUserFriends, FaDollarSign, FaQuestion, FaDiscord, FaCogs, FaHandshake } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/animations.css'; // Import animations
import FloatingNav from '../components/navigation/FloatingNav';
import PageHeader from '../components/layout/PageHeader';
// import YouAreYouWant from '../components/sections/YouAreYouWant';
import sakhrProfileImg from '../assets/sakhr-profile.jpg';
import tazProfileImg from '../assets/taz-profile.jpg';
import simpleToSellImg from '../assets/simple-to-sell.png';
import savingTimeImg from '../assets/saving-time.png';
import makingAiEasyImg from '../assets/making-ai-easy.png';
import aiHeroPage from '../assets/ai-surfer-hero.png';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  
  // Create refs for all sections we want to navigate to
  const topRef = useRef(null);
  const obstaclesRef = useRef(null);
  const whoItsForRef = useRef(null);
  const faqRef = useRef(null);
  const monetizationPathsRef = useRef(null);
  
  const { darkMode } = useTheme();
  const calendlyLink = "https://calendly.com/aiwaverider8/30min";
  
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

  // Simulate loading state for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
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
  
  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`} ref={topRef}>
      {/* Floating navigation that appears when scrolling */}
      <FloatingNav scrollRefs={scrollRefs} />
      
      {/* Use centralized PageHeader component */}
      <PageHeader />

      {/* Hero Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-10 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">Master AI Automation</span> & Build Your Digital Empire
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl">
                Learn how to monetize AI through affiliate marketing, sell powerful n8n automation workflows, and provide high-value AI consulting services. Build a $5,000-$25,000/month business in the AI revolution.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center">

                <a href="#monetization-paths" onClick={scrollToMonetizationPaths} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-full font-bold text-lg transition-all hover:shadow-lg inline-flex items-center justify-center">
                  Explore Business Models <FaArrowRight className="ml-2" />
                </a>

                <a 
                href="https://discord.gg/PNqBfZcm"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-4 rounded-full font-bold text-lg transition-all inline-flex items-center ${darkMode ? 'bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500' : 'bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-400'} hover:shadow-lg`}
              >
                <FaDiscord className="mr-2" /> JOIN COMMUNITY
              </a>
              </div>
              
              <div className={`flex items-center space-x-2 ${darkMode ? 'text-gray-200 text-base md:text-lg lg:text-xl xl:text-2xl font-bold' : 'text-base md:text-lg lg:text-xl xl:text-2xl font-bold'}`}>
                <FaCheck className="text-green-500" />
                <span>No coding experience required</span>
              </div>
              <div className={`flex items-center space-x-2 mt-2 ${darkMode ? 'text-gray-200 text-base md:text-lg lg:text-xl xl:text-2xl font-bold' : 'text-base md:text-lg lg:text-xl xl:text-2xl font-bold'}`}>
                <FaCheck className="text-green-500" />
                <span>Start earning $5,000-$25,000/month with proven strategies</span>
            </div>
              <div className={`flex items-center space-x-2 mt-2 ${darkMode ? 'text-gray-200 text-base md:text-lg lg:text-xl xl:text-2xl font-bold' : 'text-base md:text-lg lg:text-xl xl:text-2xl font-bold'}`}>
                <FaCheck className="text-green-500" />
                <span>Launch your first AI automation workflow in 7 days</span>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src={aiHeroPage} 
                alt="AI Waverider" 
                className="rounded-lg shadow-2xl w-full max-w-lg mx-auto transform hover:-translate-y-2 transition-transform duration-300" 
                onError={(e) => { e.target.src = 'https://placehold.co/800x600/blue/white?text=AI+Waverider'; }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* YouAreYouWant section with arrow diagrams */}
      {/* <YouAreYouWant /> */}

      {/* Monetization Paths */}
      <section ref={monetizationPathsRef} id="monetization-paths" className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              4 Proven Ways To Monetize AI
            </h2>
            <p className={`max-w-3xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Discover the exact business models I use to generate consistent income in the AI space, plus how I teach others to replicate my success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {/* Card 1 - AI Tool Affiliate Marketing */}
            <div className={`rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}>
              <div className="p-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}>
                  <FaHandshake className="text-2xl" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>AI Tool Affiliate Marketing</h3>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Partner with leading AI companies to earn 20-50% commissions by recommending tools to businesses. I'll teach you my proven strategy for identifying high-converting AI tools and building relationships with potential clients.
                </p>
                <p className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Potential Income: $2,000-$15,000/month
                </p>
              </div>
            </div>

            {/* Card 2 - n8n Automation Workflows */}
            <div className={`rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}>
              <div className="p-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${darkMode ? 'bg-purple-600' : 'bg-purple-500'} text-white`}>
                  <FaCogs className="text-2xl" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>n8n Automation Workflows</h3>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Create and sell powerful automation workflows using n8n that save businesses 10-40 hours per week. From lead generation to customer service automation, these digital products sell for $297-$2,997 each.
                </p>
                <p className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Potential Income: $3,000-$20,000/month
                </p>
              </div>
            </div>

            {/* Card 3 - AI Consulting Services */}
            <div className={`rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}>
              <div className="p-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${darkMode ? 'bg-green-600' : 'bg-green-500'} text-white`}>
                  <FaUserGraduate className="text-2xl" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>AI Consulting Services</h3>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Provide strategic AI consulting to help businesses identify automation opportunities, implement AI solutions, and optimize their operations. Charge $200-$500/hour for your expertise in AI integration and workflow optimization.
                </p>
                <p className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Potential Income: $8,000-$50,000/month
                </p>
              </div>
            </div>

            {/* Card 4 - Teaching & Training */}
            <div className={`rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}>
              <div className="p-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${darkMode ? 'bg-orange-600' : 'bg-orange-500'} text-white`}>
                  <FaLightbulb className="text-2xl" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Teaching & Training Programs</h3>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Share your knowledge and help others build their own AI businesses. Create courses, coaching programs, and training materials that teach affiliate marketing, workflow creation, and AI consulting strategies.
                </p>
                <p className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Potential Income: $5,000-$100,000/month
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/monetization-paths" className={`px-8 py-4 rounded-full font-bold text-lg transition-all inline-flex items-center ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'} hover:shadow-lg`}>
                Learn All Business Models <FaChevronRight className="ml-2" />
              </Link>
              <a 
                href="https://discord.gg/PNqBfZcm"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-4 rounded-full font-bold text-lg transition-all inline-flex items-center ${darkMode ? 'bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500' : 'bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-400'} hover:shadow-lg`}
              >
                <FaDiscord className="mr-2" /> JOIN COMMUNITY
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Obstacles Section */}
      <section ref={obstaclesRef} className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Common Obstacles To Building an AI Business
            </h2>
            <p className={`max-w-3xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              These are the key challenges that prevent most people from successfully building a profitable AI business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {/* Obstacle 1 */}
            <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-red-500' : 'bg-red-500'} flex items-center justify-center text-white mr-4`}>
                  <FaTimes />
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Technical Overwhelm</h3>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Many believe you need advanced technical skills to build automation workflows or understand AI tools. My approach focuses on no-code solutions and practical business applications that anyone can master.
              </p>
            </div>

            {/* Obstacle 2 */}
            <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-orange-500' : 'bg-orange-500'} flex items-center justify-center text-white mr-4`}>
                  <FaQuestion />
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Not Knowing Where to Start</h3>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                The AI space is vast and constantly evolving. I provide a clear roadmap and step-by-step system that eliminates confusion and gets you generating income quickly with proven strategies.
              </p>
            </div>

            {/* Obstacle 3 */}
            <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-yellow-500' : 'bg-yellow-500'} flex items-center justify-center text-white mr-4`}>
                  <FaUserFriends />
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Finding Clients</h3>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Identifying businesses that need AI automation and convincing them to invest can be challenging. I share my proven outreach methods and client acquisition strategies that consistently land high-value projects.
              </p>
            </div>

            {/* Obstacle 4 */}
            <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-green-500' : 'bg-green-500'} flex items-center justify-center text-white mr-4`}>
                  <FaDollarSign />
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Pricing Your Services</h3>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Determining what to charge for automation workflows, consulting, or affiliate commissions is complex. I provide detailed pricing frameworks and value-based strategies that maximize your earnings while delivering clear ROI.
              </p>
            </div>

            {/* Obstacle 5 */}
            <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-blue-500'} flex items-center justify-center text-white mr-4`}>
                  <FaClock />
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Scaling Your Business</h3>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Moving from one-off projects to a scalable business model is difficult. I teach systems and processes for building recurring revenue streams through automation workflows, consulting retainers, and affiliate partnerships.
              </p>
            </div>

            {/* Obstacle 6 */}
            <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white shadow-md'}`}>
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-purple-500' : 'bg-purple-500'} flex items-center justify-center text-white mr-4`}>
                  <FaRandom />
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Staying Updated</h3>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                AI tools and technologies change rapidly, making it hard to stay current. I provide ongoing training and updates on the latest tools, strategies, and market opportunities to keep you ahead of the curve.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/ai-obstacle-solutions" className={`px-8 py-4 rounded-full font-bold text-lg transition-all inline-flex items-center ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'} hover:shadow-lg`}>
                Learn How I Solve These Obstacles <FaChevronRight className="ml-2" />
              </Link>
              <a 
                href="https://discord.gg/PNqBfZcm"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-4 rounded-full font-bold text-lg transition-all inline-flex items-center ${darkMode ? 'bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500' : 'bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-400'} hover:shadow-lg`}
              >
                <FaDiscord className="mr-2" /> JOIN COMMUNITY
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section ref={whoItsForRef} className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Your Path to AI Business Success:
              <br />No Technical Degree, No Guesswork
              </h2>
            <p className={`max-w-2xl mx-auto text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
              <h4 className={`text-2xl md:text-3xl font-semibold mb-4 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                Simplifying AI Business Building
              </h4>
              <p className={`mb-8 text-lg md:text-xl leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                I provide you with ready-to-use automation workflows, proven affiliate marketing templates, and client acquisition systems. Everything is broken down into simple steps with real-world examples, so you can start generating income within days, not months.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 md:order-1">
              <h4 className={`text-2xl md:text-3xl font-semibold mb-4 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                Maximizing Your Time Investment
              </h4>
              <p className={`mb-8 text-lg md:text-xl leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
              <h4 className={`text-3xl md:text-4xl font-semibold mb-4 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                Plug-and-Play Business Model
              </h4>
              <p className={`mb-8 text-xl md:text-2xl leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
                href="https://discord.gg/PNqBfZcm"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-4 rounded-lg font-bold text-lg transition-all inline-flex items-center ${darkMode ? 'bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500' : 'bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-400'} hover:shadow-lg`}
              >
                <FaDiscord className="mr-2" /> JOIN COMMUNITY
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your AI Educator Section */}
      <section className="py-24 relative bg-black" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2961&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="container mx-auto px-5 max-w-6xl">
          <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-16">
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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 mix-blend-overlay"></div>
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
      <section className="py-24 relative bg-black" style={{
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
            <div className="bg-gray-800 border-2 border-pink-300 rounded-xl p-8">
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
            <div className="bg-gray-800 border-2 border-pink-300 rounded-xl p-8">
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
                href="https://discord.gg/PNqBfZcm"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold text-xl sm:text-2xl transition-all inline-flex items-center border-2 border-purple-400 hover:shadow-lg"
              >
                <FaDiscord className="mr-2" /> JOIN COMMUNITY
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Two Options */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Option 1: Join Now */}
            <div className="bg-white rounded-3xl shadow-xl p-10 border-2 border-gray-100 transform transition-transform hover:scale-105">
              <h3 className="text-3xl font-bold mb-8">
                <span className="text-red-300">Option 1:</span> <span className="text-gray-900">Start Building</span>
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-red-400 text-sm" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">Learn my proven n8n workflow templates that sell for $297-$2,997 each.</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-red-400 text-sm" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">
                    Master affiliate marketing strategies that generate $2,000-$15,000/month in commissions.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-red-400 text-sm" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">
                    Build a consulting practice charging $200-$500/hour for AI strategy and implementation.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-red-400 text-sm" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">
                    Create your own training programs and scale to six-figure monthly revenue.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-red-400 text-sm" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">
                    Join a community of successful AI entrepreneurs and get ongoing support.
            </p>
          </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-red-400 text-sm" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">
                    Get lifetime access to updates as AI technology evolves.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Option 2: Exit This Page */}
            <div className="bg-white rounded-3xl shadow-xl p-10 border-2 border-gray-100 transform transition-transform hover:scale-105">
              <h3 className="text-3xl font-bold mb-8">
                <span className="text-gray-900">Option 2:</span> <span className="text-gray-500">Do It Alone</span>
                    </h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-gray-600 text-sm" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">
                    Continue struggling to find profitable AI opportunities on your own.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-gray-600 text-sm" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">
                    Waste months trying to figure out which AI tools to promote and how to price your services.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-gray-600 text-sm" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">
                    Miss out on the current AI boom while competitors build profitable businesses.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-gray-600 text-sm" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">
                    Keep trading time for money instead of building scalable, automated income streams.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-gray-600 text-sm" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">
                    Watch as others implement the exact strategies I'm sharing and achieve the success you want.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <FaCheck className="text-gray-600 text-sm" />
                  </div>
                  <p className="ml-3 text-gray-700 font-medium">
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
                href="https://discord.gg/PNqBfZcm"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-4 rounded-full font-bold text-xl transition-all inline-flex items-center ${darkMode ? 'bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500' : 'bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-400'} hover:shadow-lg`}
              >
                <FaDiscord className="mr-2" /> JOIN COMMUNITY
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {/* FAQ Item 1 */}
            <details className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} cursor-pointer group`}>
              <summary className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'} flex justify-between items-center`}>
                Do I need technical skills to succeed with your AI business strategies?
                <svg className="w-5 h-5 transition-transform transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>Not at all! My entire approach is designed for non-technical entrepreneurs. The n8n workflows use a visual, drag-and-drop interface, the affiliate marketing strategies focus on relationship building and sales, and the consulting frameworks are based on business strategy rather than technical implementation.</p>
              </div>
            </details>

            {/* FAQ Item 2 */}
            <details className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} cursor-pointer group`}>
              <summary className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'} flex justify-between items-center`}>
                How quickly can I start earning income with these strategies?
                <svg className="w-5 h-5 transition-transform transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>With affiliate marketing, you can start earning commissions within your first week once you have the right partnerships in place. n8n workflows can be created and sold within 2-4 weeks, and consulting clients typically come within 30-60 days of implementing my outreach strategies. The key is consistent action and following the proven systems I provide.</p>
              </div>
            </details>

            {/* FAQ Item 3 */}
            <details className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} cursor-pointer group`}>
              <summary className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'} flex justify-between items-center`}>
                What makes your n8n workflows different from free templates online?
                <svg className="w-5 h-5 transition-transform transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>My workflows are battle-tested in real businesses and designed specifically for profitability. They include detailed documentation, customization guides, and business use cases that demonstrate clear ROI. Plus, you get my pricing strategies and sales frameworks to position these as premium solutions worth $297-$2,997 each.</p>
              </div>
            </details>

            {/* FAQ Item 4 */}
            <details className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} cursor-pointer group`}>
              <summary className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'} flex justify-between items-center`}>
                Can I implement these strategies while working full-time?
                <svg className="w-5 h-5 transition-transform transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>Absolutely! Many of my students start as side hustles while maintaining their day jobs. Affiliate marketing and selling workflows can be done in your spare time, and consulting calls can be scheduled outside work hours. The strategies are designed for efficiency and scalability, not long hours.</p>
              </div>
            </details>

            {/* FAQ Item 5 */}
            <details className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} cursor-pointer group`}>
              <summary className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'} flex justify-between items-center`}>
                What ongoing support do you provide?
                <svg className="w-5 h-5 transition-transform transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>You get access to our private Discord community, monthly group coaching calls, regular updates on new AI tools and opportunities, and direct access to me for questions and guidance. The AI space evolves rapidly, so ongoing support and education are crucial for continued success.</p>
              </div>
            </details>

            {/* FAQ Item 6 */}
            <details className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} cursor-pointer group`}>
              <summary className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'} flex justify-between items-center`}>
                How do I know if this will work for my specific situation?
                <svg className="w-5 h-5 transition-transform transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>The best way to find out is to book a free strategy call with me. I'll assess your current situation, goals, and resources to determine which of the four business models would be the best fit for you. This personalized approach ensures you're starting with the strategy most likely to succeed in your specific circumstances.</p>
              </div>
            </details>
          </div>

          <div className="text-center mt-16">
            <div className="bg-blue-400 hover:bg-blue-500 inline-block transition-all rounded-xl shadow-lg overflow-hidden cursor-pointer" onClick={openCalendlyConsultation}>
              <div className="px-16 py-6 font-bold text-2xl text-white flex items-center justify-center gap-3">
                <FaCalendarAlt /> BOOK FREE Strategy Call
              </div>
              <div className="bg-blue-500 text-white text-sm py-2">
                Discover Your Best AI Business Model
              </div>
            </div>
            <div className="mt-4">
              <a 
                href="https://discord.gg/PNqBfZcm"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all inline-flex items-center ${darkMode ? 'bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500' : 'bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-400'} hover:shadow-lg`}
              >
                <FaDiscord className="mr-2" /> JOIN COMMUNITY
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Consultation Call Section */}
      <section className={`py-16 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-50'}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}
            >
              Ready to Build Your AI Business Empire?
            </h2>
            
            <p 
              className={`text-xl mb-10 ${darkMode ? 'text-indigo-100' : 'text-gray-600'}`}
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
                  href="https://discord.gg/PNqBfZcm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-8 py-5 rounded-full font-bold text-xl transition-all inline-flex items-center gap-3 ${darkMode ? 'bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500' : 'bg-purple-500 hover:bg-purple-600 text-white border-2 border-purple-400'} hover:shadow-xl`}
                >
                  <FaDiscord /> JOIN COMMUNITY
                </a>
              </div>
            </div>
            
            <div className={`${darkMode ? 'text-indigo-200' : 'text-gray-600'}`}>
              <p className="text-lg">No sales pressure, just a friendly conversation about your AI business potential</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 