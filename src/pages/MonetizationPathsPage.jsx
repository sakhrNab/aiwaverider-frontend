import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaClock, FaRocket, FaChartLine, FaUsers, FaLightbulb, FaDollarSign, FaStar, FaTrophy } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MonetizationPathsPage = () => {
  const { darkMode } = useTheme();
  
  // Animation variants for elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Timeline steps data
  const timelineSteps = [
    {
      id: 1,
      title: 'Software Referral',
      description: 'Earn a 40% commission by referring businesses to AI tools they need. No technical skills required, just connect businesses with the right solutions.',
      income: '$600-$5,000/month',
      timeToSetup: '1-2 days',
      icon: <FaUsers className="text-blue-500" size={24} />,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Setup/Build Fees',
      description: 'Charge $500-$15,000 for setting up AI tools for businesses. Includes customization, training, and implementation services.',
      income: '$1,500-$15,000 per project',
      timeToSetup: '1-2 weeks',
      icon: <FaRocket className="text-purple-500" size={24} />,
      color: 'purple'
    },
    {
      id: 3,
      title: 'Monthly Retainer',
      description: 'Manage AI tools for clients on an ongoing basis. Provide monthly maintenance, updates, and optimization to ensure maximum ROI.',
      income: '$1,000-$5,000/month per client',
      timeToSetup: '2-4 weeks',
      icon: <FaClock className="text-green-500" size={24} />,
      color: 'green'
    },
    {
      id: 4,
      title: 'Consulting',
      description: 'Charge $150-$500/hour for strategic AI consulting. Help businesses identify opportunities, develop AI strategies, and implement AI solutions.',
      income: '$3,000-$20,000/month',
      timeToSetup: '1-3 weeks',
      icon: <FaLightbulb className="text-yellow-500" size={24} />,
      color: 'yellow'
    },
    {
      id: 5,
      title: 'Profit Sharing',
      description: 'Earn 5%-35% of the sales generated through AI implementation. This performance-based model aligns your income with client success.',
      income: 'Unlimited (based on client success)',
      timeToSetup: '1-3 months',
      icon: <FaChartLine className="text-red-500" size={24} />,
      color: 'red'
    },
    {
      id: 6,
      title: 'Equity Deals',
      description: 'Get part ownership in companies you help transform with AI. Ideal for startups and businesses with high growth potential.',
      income: '$100,000+ in equity',
      timeToSetup: '3-6 months',
      icon: <FaDollarSign className="text-indigo-500" size={24} />,
      color: 'indigo'
    },
    {
      id: 7,
      title: 'Affiliate/Referral Program',
      description: 'Earn 30% of all sales you refer to our program. Recommend our training to others and get paid recurring commissions.',
      income: '30% of all referred sales',
      timeToSetup: 'Immediate',
      icon: <FaStar className="text-orange-500" size={24} />,
      color: 'orange'
    }
  ];
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      {/* Hero section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Monetization Paths for AI
            </h1>
            <p className={`text-xl max-w-3xl mx-auto mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Discover the most effective ways to generate income with artificial intelligence technology in today's market.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Timeline section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Your AI Monetization Journey
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className={`max-w-3xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Each path represents a proven way to generate income with AI technology. Start with the easiest paths and progress as you build experience and expertise.
            </motion.p>
          </motion.div>
          
          {/* Timeline visualization - completely redesigned */}
          <div className="relative pb-16">
            {/* Timeline connector line - only visible on desktop */}
            <div className={`hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="py-8"
            >
              {timelineSteps.map((step, index) => (
                <motion.div 
                  key={step.id}
                  variants={itemVariants}
                  className="mb-20"
                >
                  {/* Desktop view: alternating layout */}
                  <div className="hidden md:flex items-center relative">
                    {/* Left side content (even indices) */}
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12' : 'text-right pr-12'}`}>
                      {index % 2 === 0 && (
                        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                          <h3 className={`text-2xl font-bold mb-3 text-${step.color}-500`}>{step.title}</h3>
                          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {step.description}
                          </p>
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center">
                              <FaDollarSign className={`mr-2 text-${step.color}-500`} />
                              <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                Potential Income: {step.income}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <FaClock className={`mr-2 text-${step.color}-500`} />
                              <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                Time to Setup: {step.timeToSetup}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Timeline node */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 shadow-lg z-20">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-2 ${darkMode ? 'border-' + step.color + '-400' : 'border-' + step.color + '-500'}`}>
                        {step.icon}
                      </div>
                    </div>
                    
                    {/* Right side content (odd indices) */}
                    <div className={`w-1/2 ${index % 2 !== 0 ? 'pl-12' : 'text-left pl-12'}`}>
                      {index % 2 !== 0 && (
                        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                          <h3 className={`text-2xl font-bold mb-3 text-${step.color}-500`}>{step.title}</h3>
                          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {step.description}
                          </p>
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center">
                              <FaDollarSign className={`mr-2 text-${step.color}-500`} />
                              <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                Potential Income: {step.income}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <FaClock className={`mr-2 text-${step.color}-500`} />
                              <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                Time to Setup: {step.timeToSetup}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Mobile view: stacked layout */}
                  <div className="md:hidden flex flex-col items-center">
                    {/* Timeline node on top */}
                    <div className="w-14 h-14 mb-4 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 shadow-lg z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-2 ${darkMode ? 'border-' + step.color + '-400' : 'border-' + step.color + '-500'}`}>
                        {step.icon}
                      </div>
                    </div>
                    
                    {/* Content below */}
                    <div className="w-full px-4">
                      <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <h3 className={`text-2xl font-bold mb-3 text-${step.color}-500`}>{step.title}</h3>
                        <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {step.description}
                        </p>
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center">
                            <FaDollarSign className={`mr-2 text-${step.color}-500`} />
                            <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                              Potential Income: {step.income}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FaClock className={`mr-2 text-${step.color}-500`} />
                            <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                              Time to Setup: {step.timeToSetup}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Final milestone */}
      <section className={`py-16 ${darkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <FaTrophy className="text-yellow-500 text-5xl mx-auto mb-6" />
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Path to Success
            </h2>
            <p className={`max-w-3xl mx-auto text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              With the right training and support, you can combine these monetization paths to create a thriving AI-powered business.
            </p>
            <div className="flex justify-center">
              <Link to="/pricing" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-full font-bold text-lg transition-all hover:shadow-lg inline-flex items-center justify-center">
                Start Your Journey <FaRocket className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* FAQ section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className={`mb-6 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Do I need technical skills to implement these monetization paths?
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                No, our program is specifically designed for non-technical people. We provide templates, tools, and step-by-step guidance to make it easy for anyone to implement these monetization paths.
              </p>
            </div>
            
            <div className={`mb-6 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                How long does it take to start earning income?
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                It varies by path. Some paths like Software Referral and Affiliate Program can generate income within days, while others like Equity Deals may take several months to fully develop. Most of our students see their first results within 30-60 days.
              </p>
            </div>
            
            <div className={`mb-6 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Which monetization path is best for beginners?
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                We recommend starting with Software Referral or our Affiliate Program as they require the least technical knowledge and can be implemented quickly. As you gain confidence, you can progress to Setup/Build Fees and Monthly Retainer services.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MonetizationPathsPage;
