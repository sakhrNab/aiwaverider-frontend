import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaCheck, FaTimes, FaClock, FaRandom, FaUserFriends, FaDollarSign, FaQuestion, FaDiscord, FaArrowRight, FaLightbulb, FaCogs, FaHandshake, FaGraduationCap, FaChartLine, FaTools } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AIObstacleSolutionsPage = () => {
  const { darkMode } = useTheme();

  // Animation variants
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

  // Obstacle and solution pairs
  const obstaclesAndSolutions = [
    {
      id: 1,
      obstacle: {
        title: "Technical Overwhelm",
        description: "Many believe you need advanced technical skills to build automation workflows or understand AI tools.",
        icon: <FaTimes className="text-red-500" size={24} />
      },
      solution: {
        title: "No-Code Automation Mastery",
        description: "I teach you to use n8n's visual drag-and-drop interface and pre-built workflow templates. No coding required - just connect the pieces like building blocks to create powerful automations worth $297-$2,997 each.",
        icon: <FaCogs className="text-green-500" size={24} />,
        benefits: [
          "Ready-to-use workflow templates for immediate implementation",
          "Visual tutorials showing exact step-by-step setup",
          "Business-focused approach rather than technical complexity",
          "Support community for troubleshooting and guidance"
        ]
      }
    },
    {
      id: 2,
      obstacle: {
        title: "Not Knowing Where to Start",
        description: "The AI space is vast and constantly evolving, making it difficult to identify profitable opportunities.",
        icon: <FaQuestion className="text-orange-500" size={24} />
      },
      solution: {
        title: "Proven Business Model Blueprint",
        description: "I provide a clear 4-step progression: Start with affiliate marketing for immediate income, create n8n workflows for scalable products, add consulting for premium pricing, then teach others for exponential growth.",
        icon: <FaChartLine className="text-blue-500" size={24} />,
        benefits: [
          "Clear roadmap from $0 to $25,000/month",
          "Step-by-step action plans for each business model",
          "Prioritized focus on highest-impact activities",
          "Proven sequence that minimizes risk and maximizes results"
        ]
      }
    },
    {
      id: 3,
      obstacle: {
        title: "Finding Clients",
        description: "Identifying businesses that need AI automation and convincing them to invest can be challenging.",
        icon: <FaUserFriends className="text-yellow-500" size={24} />
      },
      solution: {
        title: "Client Acquisition System",
        description: "My proven outreach methods include identifying pain points businesses face, crafting compelling value propositions, and building relationships that lead to $5,000-$50,000 projects consistently.",
        icon: <FaHandshake className="text-purple-500" size={24} />,
        benefits: [
          "Target market identification strategies for maximum conversion",
          "Email and LinkedIn outreach templates that work",
          "Value-first approach that builds trust before selling",
          "Case study frameworks that demonstrate clear ROI"
        ]
      }
    },
    {
      id: 4,
      obstacle: {
        title: "Pricing Your Services",
        description: "Determining what to charge for automation workflows, consulting, or affiliate commissions is complex.",
        icon: <FaDollarSign className="text-green-500" size={24} />
      },
      solution: {
        title: "Value-Based Pricing Framework",
        description: "I teach you to price based on business value delivered, not time spent. Workflows that save 20 hours/week justify $2,997 pricing. Consulting that increases revenue by $50,000 justifies $5,000+ fees.",
        icon: <FaDollarSign className="text-green-500" size={24} />,
        benefits: [
          "ROI calculators to justify premium pricing",
          "Tiered pricing strategies for different market segments",
          "Negotiation techniques for higher-value deals",
          "Package structures that maximize profit margins"
        ]
      }
    },
    {
      id: 5,
      obstacle: {
        title: "Scaling Your Business",
        description: "Moving from one-off projects to a scalable business model with predictable revenue is difficult.",
        icon: <FaClock className="text-blue-500" size={24} />
      },
      solution: {
        title: "Systematic Business Scaling",
        description: "Build recurring revenue through workflow marketplaces, consulting retainers, affiliate partnerships, and training programs. Each revenue stream compounds the others for exponential growth.",
        icon: <FaChartLine className="text-blue-500" size={24} />,
        benefits: [
          "Multiple revenue streams for stability and growth",
          "Systems and processes for delegation and automation",
          "Community building strategies for organic growth",
          "Partnership frameworks for exponential scaling"
        ]
      }
    },
    {
      id: 6,
      obstacle: {
        title: "Staying Updated",
        description: "AI tools and technologies change rapidly, making it hard to stay current and competitive.",
        icon: <FaRandom className="text-purple-500" size={24} />
      },
      solution: {
        title: "Continuous Learning System",
        description: "I provide ongoing training, monthly updates on new AI tools and opportunities, and access to a community of practitioners sharing the latest insights and strategies.",
        icon: <FaGraduationCap className="text-orange-500" size={24} />,
        benefits: [
          "Monthly training calls on emerging AI tools",
          "Community sharing of successful strategies",
          "Early access to new business opportunities",
          "Lifetime updates to courses and materials"
        ]
      }
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
              AI Business Obstacles & Solutions
            </h1>
            <p className={`text-xl max-w-3xl mx-auto mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Every challenge you face in building an AI business has been solved. Here's exactly how I help you overcome each obstacle and turn them into competitive advantages.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Obstacles and Solutions Section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-16"
          >
            {obstaclesAndSolutions.map((item, index) => (
              <motion.div 
                key={item.id}
                variants={itemVariants}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
              >
                {/* Obstacle */}
                <div className={`p-8 rounded-xl ${darkMode ? 'bg-red-900/20' : 'bg-red-50'} border-l-4 border-red-500`}>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white mr-4">
                      {item.obstacle.icon}
                    </div>
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Obstacle: {item.obstacle.title}
                    </h3>
                  </div>
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {item.obstacle.description}
                  </p>
                </div>

                {/* Solution */}
                <div className={`p-8 rounded-xl ${darkMode ? 'bg-green-900/20' : 'bg-green-50'} border-l-4 border-green-500`}>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white mr-4">
                      {item.solution.icon}
                    </div>
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Solution: {item.solution.title}
                    </h3>
                  </div>
                  <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {item.solution.description}
                  </p>
                  
                  {/* Benefits */}
                  <div className="space-y-3">
                    <h4 className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                      What You Get:
                    </h4>
                    <ul className="space-y-2">
                      {item.solution.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start">
                          <FaCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Success Framework Section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              The AI Business Success Framework
            </h2>
            <p className={`max-w-3xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              My systematic approach transforms obstacles into stepping stones. Here's the proven framework that's helped hundreds of entrepreneurs build successful AI businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg text-center`}>
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLightbulb className="text-white text-2xl" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                1. Foundation
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Master affiliate marketing and create your first n8n workflows with my templates and proven strategies.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg text-center`}>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCogs className="text-white text-2xl" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                2. Scaling
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Launch consulting services and develop premium workflow packages using my client acquisition system.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg text-center`}>
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGraduationCap className="text-white text-2xl" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                3. Teaching
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Create training programs and certification courses to scale your impact and income exponentially.
              </p>
            </div>

            {/* Step 4 */}
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg text-center`}>
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                4. Empire
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Build multiple revenue streams, strategic partnerships, and a team of certified practitioners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Stories */}
      <section className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              From Obstacles to Success Stories
            </h2>
            <p className={`max-w-3xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {/* Real entrepreneurs who overcame these exact obstacles using my proven systems and strategies. */}
              Become the first entrepreneur to overcome these obstacles and build a successful AI business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Story 1 */}
            {/* <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} shadow-lg`}>
              <div className="mb-4">
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Sarah M. - Marketing Consultant
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Before: Struggling with technical overwhelm
                </p>
              </div>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                "I thought I needed to learn coding to succeed with AI. Sakhr's no-code approach using n8n changed everything. I now sell automation workflows for $1,497 each and have generated over $45,000 in my first 6 months."
              </p>
              <p className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                Result: $45,000 in 6 months
              </p>
            </div> */}

            {/* Story 2 */}
            {/* <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} shadow-lg`}>
              <div className="mb-4">
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Michael R. - Business Owner
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Before: Couldn't find clients for AI services
                </p>
              </div>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                "Using Sakhr's client acquisition system, I landed my first $8,000 consulting project within 30 days. The outreach templates and value proposition frameworks are incredibly effective."
              </p>
              <p className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                Result: $8,000 project in 30 days
              </p>
            </div> */}

            {/* Story 3 */}
            {/* <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} shadow-lg`}>
              <div className="mb-4">
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Jennifer L. - Freelancer
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Before: Didn't know how to scale beyond hourly work
                </p>
              </div>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                "The progression from affiliate marketing to consulting to teaching was exactly what I needed. I now run a $25,000/month AI consulting agency and teach others through my certification program."
              </p>
              <p className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                Result: $25,000/month agency
              </p>
            </div> */}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={`py-16 ${darkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Ready to Turn Your Obstacles Into Opportunities?
            </h2>
            <p className={`max-w-3xl mx-auto text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Don't let these obstacles hold you back any longer. Every successful AI entrepreneur has faced these same challenges - the difference is having the right guidance and systems to overcome them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-full font-bold text-lg transition-all hover:shadow-lg inline-flex items-center justify-center"
              >
                Start Your AI Business Journey <FaArrowRight className="ml-2" />
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
    </div>
  );
};

export default AIObstacleSolutionsPage;
