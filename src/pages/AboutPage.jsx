import React from 'react';
import { FaLinkedin, FaGithub, FaCode, FaLaptopCode, FaRobot, FaChartLine, FaBrain, FaTools } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import sakhrProfileImg from '../assets/sakhr-profile.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok } from '@fortawesome/free-brands-svg-icons';

const About = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      {/* Hero Section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-indigo-50 to-blue-50'}`}>
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
      <section className={`py-14 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
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
      <section className={`py-14 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
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
      <section className={`py-14 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
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
                <div className="flex justify-center space-x-6 mb-6">
                  <a href="https://www.linkedin.com/in/sakhr-nabil-al-absi/" target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'} text-2xl`}>
                    <FaLinkedin />
                  </a>
                  <a href="https://github.com/sakhrNab" target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-2xl`}>
                    <FaGithub />
                  </a>
                  <a href="https://www.tiktok.com/@ai.wave.rider" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-pink-600">
                    <FontAwesomeIcon icon={faTiktok} />
                  </a>
                </div>
              </div>
              <p className="text-base leading-relaxed mb-4">
                Sakhr is a technology entrepreneur with over 10 years of experience in software development and AI implementation. 
                He has successfully helped dozens of businesses integrate AI solutions to optimize processes, reduce costs, and create 
                new revenue streams.
              </p>
              <p className="text-base leading-relaxed">
                With a background in computer science and business administration, Sakhr bridges the gap between 
                cutting-edge technology and practical business applications, making complex AI concepts accessible to everyone.
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
      <section className={`py-14 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-teal-300' : 'text-teal-600'}`}>
              What We Offer
            </h2>
            <p className="text-lg mb-6 leading-relaxed">
              AI Waverider specializes in making artificial intelligence accessible and practical for businesses of all sizes. 
              We focus on three core areas that deliver real value to our clients.
            </p>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8`}>
              <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow`}>
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <FaRobot className={`mr-2 ${darkMode ? 'text-teal-300' : 'text-teal-600'}`} />
                  AI Tool Recommendations
                </h3>
                <p>
                  We help you discover and implement the right AI tools for your business through our affiliate partnerships, 
                  ensuring you get the best solutions at competitive prices.
                </p>
              </div>
              
              <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow`}>
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <FaTools className={`mr-2 ${darkMode ? 'text-teal-300' : 'text-teal-600'}`} />
                  Custom n8n Workflows
                </h3>
                <p>
                  Get powerful automation workflows built specifically for your business needs. Our n8n solutions 
                  streamline operations and eliminate repetitive tasks.
                </p>
              </div>
              
              <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow`}>
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <FaChartLine className={`mr-2 ${darkMode ? 'text-teal-300' : 'text-teal-600'}`} />
                  AI Consulting Services
                </h3>
                <p>
                  Work directly with our AI experts to develop comprehensive implementation strategies, 
                  integrate new technologies, and optimize your existing workflows.
                </p>
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
      <section className={`py-14 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-teal-300' : 'text-teal-600'}`}>Ready to Get Started?</h2>
            <p className="text-lg mb-8">
              Discover how AI can transform your business. Explore our services, check out our AI tool recommendations, 
              or get in touch to discuss your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/agents" 
                className={`inline-block px-8 py-3 ${darkMode ? 
                  'bg-teal-600 hover:bg-teal-700' : 
                  'bg-teal-600 hover:bg-teal-700'} 
                  text-white rounded-lg font-semibold transition duration-300`}
              >
                Browse AI Solutions
              </a>
              <a 
                href="/contact" 
                className={`inline-block px-8 py-3 ${darkMode ? 
                  'bg-blue-600 hover:bg-blue-700' : 
                  'bg-blue-600 hover:bg-blue-700'} 
                  text-white rounded-lg font-semibold transition duration-300`}
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 