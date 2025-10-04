import React from 'react';
import './CategoryNav.css';

const DEFAULT_CATEGORIES = [
  'All', 'New', 'Design', 'Creative', 'Productivity', 'Development', 'Business', 'Education', 'Entertainment', 'Writing', 'Self Improvement', 'Music & Sound Design', 'Software Development', 'Drawing & Painting', '3D',
  // Folder-based categories from N8N workflows
  'AI', 'Airtable', 'AI Chatbot', 'AI RAG', 'AI Research', 'AI Summarization', 'Building Blocks', 'Content Creation', 'CRM', 'Crypto Trading', 'Database & Storage', 'DevOps', 'Discord', 'Document Extraction', 'Engineering', 'Finance', 'Forms & Surveys', 'Email Automation', 'Google Workspace', 'HR', 'HR & Recruitment', 'Social Media', 'Internal Wiki', 'Invoice Processing', 'IT Operations', 'Lead Generation', 'Lead Nurturing', 'Marketing', 'Market Research', 'Miscellaneous', 'Multimodal AI', 'Notion', 'OpenAI & LLMs', 'Other', 'Other Integrations', 'PDF Processing', 'Personal Productivity', 'Product', 'Project Management', 'Sales', 'Security Operations', 'Slack', 'Support', 'Support Chatbot', 'Telegram', 'Ticket Management', 'WhatsApp', 'WordPress'
];

const CategoryNav = ({ selectedCategory, onCategoryChange, categories = [] }) => {
  const categoryList = Array.isArray(categories) && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <div className="filter-tags-container">
      {categoryList.map((category) => (
        <button
          key={category}
          className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryNav; 