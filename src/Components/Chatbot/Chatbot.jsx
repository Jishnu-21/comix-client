// src/Components/Chatbot/Chatbot.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import image from '../../Assets/Image/ask alia-01.png';
import ChatbotModal from './ChatbotModal';
import '../../Assets/Css/Chatbot/Chatbot.scss';

const Chatbot = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  const is404Page = location.pathname === '/404' || location.pathname === '*';

  // Prevent body scroll when chatbot is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth <= 767) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const hideChatbot = (e) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Add overlay for mobile */}
      <div 
        className={`chatbot-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />
      
      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
        {!isOpen && (
          <div className="chatbot-image-container" onClick={onClose}>
            <img src={image} alt="Ask Alia" className="chatbot-image" />
            <button 
              className="chatbot-close-button" 
              onClick={hideChatbot} 
              aria-label="Close chatbot"
            >
              &times;
            </button>
          </div>
        )}
        <ChatbotModal 
          isOpen={isOpen} 
          onClose={onClose} 
          is404Page={is404Page} 
        />
      </div>
    </>
  );
};

export default Chatbot;