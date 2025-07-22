import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaClock, FaRocket, FaChartLine, FaUsers, FaLightbulb, FaDollarSign, FaStar, FaTrophy, FaHandshake, FaCogs, FaUserGraduate, FaGraduationCap } from 'react-icons/fa';
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

  // Timeline steps data - Updated to reflect actual business model
  const timelineSteps = [
    {
      id: 1,
      title: 'AI Tool Affiliate Marketing',
      description: 'Partner with leading AI companies to earn 20-50% commissions by recommending their tools to businesses. Learn my proven strategies for identifying high-converting partnerships and building relationships with potential clients.',
      income: '$2,000-$15,000/month',
      timeToSetup: '1-2 weeks',
      icon: <FaHandshake className="text-blue-500" size={24} />,
      color: 'blue'
    },
    {
      id: 2,
      title: 'n8n Automation Workflows',
      description: 'Create and sell powerful automation workflows using n8n that save businesses 10-40 hours per week. From lead generation to customer service automation, these digital products sell for $297-$2,997 each.',
      income: '$3,000-$20,000/month',
      timeToSetup: '2-4 weeks',
      icon: <FaCogs className="text-purple-500" size={24} />,
      color: 'purple'
    },
    {
      id: 3,
      title: 'AI Consulting Services',
      description: 'Provide strategic AI consulting to help businesses identify automation opportunities, implement AI solutions, and optimize their operations. Charge $200-$500/hour for your expertise.',
      income: '$8,000-$50,000/month',
      timeToSetup: '1-3 months',
      icon: <FaUserGraduate className="text-green-500" size={24} />,
      color: 'green'
    },
    {
      id: 4,
      title: 'Teaching & Training Programs',
      description: 'Share your knowledge and help others build their own AI businesses. Create courses, coaching programs, and training materials that teach affiliate marketing, workflow creation, and AI consulting strategies.',
      income: '$5,000-$100,000/month',
      timeToSetup: '3-6 months',
      icon: <FaGraduationCap className="text-orange-500" size={24} />,
      color: 'orange'
    },
    {
      id: 5,
      title: 'Advanced Workflow Marketplace',
      description: 'Build a marketplace for selling specialized n8n workflows across different industries. Create templates for e-commerce, healthcare, real estate, and other niches with premium pricing.',
      income: '$10,000-$75,000/month',
      timeToSetup: '6-12 months',
      icon: <FaRocket className="text-red-500" size={24} />,
      color: 'red'
    },
    {
      id: 6,
      title: 'AI Integration Partnerships',
      description: 'Form strategic partnerships with software companies to integrate AI capabilities into their existing products. Earn equity stakes and revenue sharing agreements from successful integrations.',
      income: '$50,000+ equity value',
      timeToSetup: '6-18 months',
      icon: <FaChartLine className="text-indigo-500" size={24} />,
      color: 'indigo'
    },
    {
      id: 7,
      title: 'Certification & Licensing Programs',
      description: 'Create official certification programs for AI automation specialists. License your methodologies to other trainers and consultants, building a network of certified practitioners.',
      income: '$25,000-$200,000/month',
      timeToSetup: '12-24 months',
      icon: <FaStar className="text-yellow-500" size={24} />,
      color: 'yellow'
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
              AI Business Monetization Roadmap
            </h1>
            <p className={`text-xl max-w-3xl mx-auto mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Discover the complete progression from beginner to AI business expert. Each path builds on the previous one, creating multiple income streams and exponential growth potential.
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
              Your AI Business Evolution Journey
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className={`max-w-3xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Start with affiliate marketing and workflow creation, then scale to consulting and teaching. Each level multiplies your income potential and market influence.
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
                                Time to Build: {step.timeToSetup}
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
                                Time to Build: {step.timeToSetup}
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
                              Time to Build: {step.timeToSetup}
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
      
      {/* Business Model Deep Dive */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              The Complete AI Business Ecosystem
            </h2>
            <p className={`max-w-3xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Learn how each business model connects and amplifies the others, creating a sustainable, scalable AI empire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Foundation Phase */}
            <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mr-4">
                  <FaUsers />
                </div>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Foundation Phase (Months 1-6)</h3>
              </div>
              <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span>Master affiliate marketing for consistent monthly income</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span>Create your first 5-10 profitable n8n workflows</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span>Build your personal brand and online presence</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span>Establish initial client relationships and testimonials</span>
                </li>
              </ul>
            </div>

            {/* Scaling Phase */}
            <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white mr-4">
                  <FaRocket />
                </div>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Scaling Phase (Months 6-18)</h3>
              </div>
              <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  <span>Launch high-value AI consulting services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  <span>Develop premium workflow packages and enterprise solutions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  <span>Create your first training program or course</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  <span>Build strategic partnerships with AI companies</span>
                </li>
              </ul>
            </div>

            {/* Mastery Phase */}
            <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white mr-4">
                  <FaChartLine />
                </div>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Mastery Phase (18+ Months)</h3>
              </div>
              <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  <span>Launch comprehensive certification programs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  <span>Build advanced workflow marketplace and licensing deals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  <span>Secure equity partnerships with promising AI startups</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2 mt-1">•</span>
                  <span>Establish yourself as a recognized thought leader</span>
                </li>
              </ul>
            </div>

            {/* Empire Phase */}
            <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white mr-4">
                  <FaTrophy />
                </div>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Empire Phase (24+ Months)</h3>
              </div>
              <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2 mt-1">•</span>
                  <span>Multiple six-figure revenue streams operating simultaneously</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2 mt-1">•</span>
                  <span>Team of certified practitioners working under your brand</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2 mt-1">•</span>
                  <span>Investment opportunities in emerging AI technologies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2 mt-1">•</span>
                  <span>Global recognition as an AI business authority</span>
                </li>
              </ul>
            </div>
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
              Your AI Business Success Story Starts Here
            </h2>
            <p className={`max-w-3xl mx-auto text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Join hundreds of entrepreneurs who have transformed their lives using these exact strategies. From zero to six-figure AI businesses in 12-24 months.
            </p>
            <div className="flex justify-center">
              <Link to="/" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-full font-bold text-lg transition-all hover:shadow-lg inline-flex items-center justify-center">
                Start Your Journey Today <FaRocket className="ml-2" />
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
                Do I need to master all these monetization paths to be successful?
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Not at all! Many entrepreneurs achieve six-figure success focusing on just 2-3 paths. The key is starting with affiliate marketing and n8n workflows, then adding consulting and teaching as you grow. Each path amplifies the others, but you can be profitable from day one.
              </p>
            </div>
            
            <div className={`mb-6 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                How realistic are these income projections?
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                These ranges reflect actual results from my students and my own experience. Lower ranges represent conservative goals for part-time effort, while higher ranges reflect full-time focus with proven systems. Individual results vary based on effort, market conditions, and implementation quality.
              </p>
            </div>
            
            <div className={`mb-6 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                What's the biggest differentiator between success and failure in AI business?
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Consistent execution and focusing on business value rather than technical complexity. Many people get distracted by new AI tools and forget that clients pay for solved problems, not cool technology. My system keeps you focused on profitable activities that generate real results.
              </p>
            </div>

            <div className={`mb-6 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                How much time should I dedicate to see meaningful results?
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Most successful students dedicate 10-20 hours per week during their first 6 months. This includes learning, implementing, and client work. Once systems are established, many operate successful AI businesses with 20-30 hours per week while earning six-figure incomes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MonetizationPathsPage;
