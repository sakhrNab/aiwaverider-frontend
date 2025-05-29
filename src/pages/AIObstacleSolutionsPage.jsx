import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaCode, 
  FaClock, 
  FaCompass, 
  FaUsers, 
  FaMoneyBillWave, 
  FaHandsHelping,
  FaCheck,
  FaArrowRight
} from 'react-icons/fa';

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

  // Solution data for each obstacle
  const solutions = [
    {
      id: 1,
      obstacle: "Too Technical",
      solution: "Business-First Approach",
      description: "Our program focuses on practical implementation rather than technical complexity. We guide you through pre-built solutions and templates that require zero coding knowledge, with simple customization steps anyone can follow.",
      benefits: [
        "No programming experience required",
        "Ready-to-use templates and workflows",
        "Focus on business outcomes, not technical details",
        "Step-by-step implementation guides"
      ],
      icon: <FaCode />,
      color: "red"
    },
    {
      id: 2,
      obstacle: "No Time",
      solution: "Accelerated Implementation",
      description: "Our streamlined approach is designed specifically for busy professionals. We provide condensed training modules that can be completed in as little as 5-10 hours total, with clear action steps to implement immediately.",
      benefits: [
        "Quick-start implementation guides",
        "Time-saving automation templates",
        "5-10 hour total commitment",
        "Weekend-friendly learning schedule"
      ],
      icon: <FaClock />,
      color: "orange"
    },
    {
      id: 3,
      obstacle: "Too Many Choices",
      solution: "Curated Pathways",
      description: "We've tested hundreds of AI tools and strategies to identify what actually works. Our program provides a clear roadmap with only the most effective options for your specific business needs, eliminating decision fatigue.",
      benefits: [
        "Pre-vetted tools and strategies",
        "Personalized recommendations",
        "Clear decision frameworks",
        "Proven ROI-focused options only"
      ],
      icon: <FaCompass />,
      color: "yellow"
    },
    {
      id: 4,
      obstacle: "Finding Clients",
      solution: "Client Acquisition System",
      description: "Our program includes proven outreach templates, targeting strategies, and qualification processes to help you connect with ideal clients. We'll show you exactly how to position your services to attract high-quality leads.",
      benefits: [
        "Ready-to-use outreach templates",
        "Ideal client identification framework",
        "Value proposition scripts",
        "Warm lead generation strategies"
      ],
      icon: <FaUsers />,
      color: "green"
    },
    {
      id: 5,
      obstacle: "Pricing Your Services",
      solution: "Value-Based Pricing Model",
      description: "Learn our proven pricing framework that helps you charge premium rates while delivering exceptional value. We provide pricing templates, negotiation scripts, and ROI calculators to justify your rates with confidence.",
      benefits: [
        "Tiered pricing structures",
        "ROI calculators for clients",
        "Negotiation frameworks",
        "Upsell and retention strategies"
      ],
      icon: <FaMoneyBillWave />,
      color: "blue"
    },
    {
      id: 6,
      obstacle: "Lack of Support",
      solution: "Community & Mentorship",
      description: "Join our thriving community of AI implementers for continuous support, accountability, and growth. Get access to expert mentors, weekly Q&A calls, and peer support to overcome any challenges you encounter.",
      benefits: [
        "Weekly live Q&A sessions",
        "Private community access",
        "Direct mentor support",
        "Accountability partners"
      ],
      icon: <FaHandsHelping />,
      color: "purple"
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
              How We Solve Common <span className={`text-blue-500`}>AI Obstacles</span>
            </h1>
            <p className={`text-xl max-w-3xl mx-auto mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              We've developed proven solutions to overcome the biggest challenges people face when trying to monetize AI technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions section */}
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
              Our Proven Solutions
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className={`max-w-3xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              We've helped hundreds of professionals overcome these obstacles and successfully monetize AI. Here's exactly how we do it.
            </motion.p>
          </motion.div>

          {/* Solutions grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {solutions.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                {/* Card header */}
                <div className={`p-4 bg-${item.color}-500 bg-opacity-${darkMode ? '90' : '80'} flex items-center`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white mr-4`}>
                    <span className={`text-${item.color}-500 text-xl`}>
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-medium">
                      {item.obstacle}
                    </h3>
                    <p className="text-white text-opacity-90 font-bold">
                      Solution: {item.solution}
                    </p>
                  </div>
                </div>
                
                {/* Card body */}
                <div className="p-6">
                  <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.description}
                  </p>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Key Benefits:
                  </h4>
                  <ul className="space-y-2">
                    {item.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className={`text-${item.color}-500 mt-1 mr-2 flex-shrink-0`} />
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Our 4-Step Implementation Process
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Assess Your Current Skills & Resources",
                  description: "We start by identifying your existing strengths and available resources to find the most suitable AI monetization path for your specific situation."
                },
                {
                  step: 2,
                  title: "Create Your Personalized Action Plan",
                  description: "Based on your assessment, we develop a customized implementation strategy with specific tools, templates, and timelines tailored to your goals."
                },
                {
                  step: 3,
                  title: "Implement with Expert Guidance",
                  description: "Follow our step-by-step implementation process with direct access to expert mentors who guide you through any challenges you encounter."
                },
                {
                  step: 4,
                  title: "Scale & Optimize Your Results",
                  description: "Once you've achieved initial success, we help you refine your approach, increase your rates, and scale your operations for maximum profitability."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
                >
                  <div className={`w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-4 flex-shrink-0`}>
                    {step.step}
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {step.title}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials section - brief version */}
      <section className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <h2 className={`text-3xl md:text-4xl font-bold mb-12 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Success Stories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Marketing Consultant",
                quote: "I went from struggling to find clients to earning $5,000/month in just 60 days. The client acquisition system is worth its weight in gold!",
                obstacle: "Finding Clients"
              },
              {
                name: "Mark Peterson",
                role: "Business Coach",
                quote: "As someone with zero technical background, I was amazed at how quickly I could implement these AI solutions. I'm now charging $3,000 per client implementation.",
                obstacle: "Too Technical"
              },
              {
                name: "Jennifer Williams",
                role: "Busy Professional",
                quote: "I completed the entire program in just 8 hours spread across two weekends. Within a month, I had my first paying client. The time investment was minimal compared to the return.",
                obstacle: "No Time"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="mb-4">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    Overcame: {testimonial.obstacle}
                  </span>
                </div>
                <p className={`italic mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {testimonial.name}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className={`py-16 ${darkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Ready to Overcome These Obstacles?
            </h2>
            <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Join our program and get access to all the tools, templates, and support you need to successfully monetize AI without technical skills, regardless of your time constraints.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/sign-up" className={`px-8 py-3 rounded-full font-semibold text-lg transition-all flex items-center ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
                Get Started Now <FaArrowRight className="ml-2" />
              </Link>
              <Link to="/monetization-paths" className={`px-8 py-3 rounded-full font-semibold text-lg transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-800 text-white' : 'bg-white hover:bg-gray-100 text-blue-500 border border-blue-500'}`}>
                Explore Monetization Paths
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AIObstacleSolutionsPage;
