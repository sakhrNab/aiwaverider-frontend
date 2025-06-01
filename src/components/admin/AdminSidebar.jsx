import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaRobot, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt, 
  FaDollarSign,
  FaBars,
  FaTimes,
  FaTools,
  FaEnvelope,
  FaLightbulb
} from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navItems = [
    { path: '/admin/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/admin/agents', icon: <FaRobot />, label: 'Manage Agents' },
    { path: '/admin/ai-tools', icon: <FaTools />, label: 'AI Tools' },
    { path: '/admin/prompts', icon: <FaLightbulb />, label: 'Prompts' },
    { path: '/admin/users', icon: <FaUsers />, label: 'Manage Users' },
    { path: '/admin/analytics', icon: <FaChartBar />, label: 'Analytics' },
    { path: '/admin/pricing', icon: <FaDollarSign />, label: 'Pricing' },
    { path: '/admin/email', icon: <FaEnvelope />, label: 'Email Management' },
    { path: '/admin/email-composer', icon: <FaEnvelope />, label: 'Email Composer' },
    { path: '/admin/settings', icon: <FaCog />, label: 'Settings' },
  ];
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="mobile-menu-button"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1>Admin Panel</h1>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <Link to="/signout" className="signout-button">
            <FaSignOutAlt />
            <span>Sign Out</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
