// src/Components/Chatbot/Chatbot.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import image from '../../Assets/Image/ask alia-01.png';
import ChatbotModal from './ChatbotModal';
import '../../Assets/Css/Chatbot/Chatbot.scss';

const Chatbot = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(propIsOpen);
  const location = useLocation();

  const is404Page = location.pathname === '/404' || location.pathname === '*';

  useEffect(() => {
    setIsOpen(propIsOpen);
  }, [propIsOpen]);

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

  const handleChatbotClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (propOnClose) propOnClose();
  };

  if (!isVisible) return null;

  return (
    <>
      <div 
        className={`chatbot-overlay ${isOpen ? 'open' : ''}`} 
        onClick={handleClose}
      />
      
      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
        {!isOpen && (
          <div className="chatbot-image-container" onClick={handleChatbotClick}>
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
          onClose={handleClose} 
          is404Page={is404Page} 
        />
      </div>
    </>
  );
};

export default Chatbot;